import { MessageFlags } from 'discord.js';
import { parseDiceExpression, rollWithWildDie, calculateRaises } from './diceUtils.js';
import { evaluateExpression } from './r2Evaluator.js';
import { InitiativeTracker } from './initiativeUtils.js';
import { BennyManager, StateManager } from './bennyUtils.js';
import {
  createSingleRollEmbed,
  createWildDieEmbed,
  createR2ResultEmbed,
  createErrorEmbed
} from './embedBuilder.js';

// Game state managers
const initiativeTrackers = new Map(); // guildId -> InitiativeTracker
const bennyManagers = new Map(); // guildId -> BennyManager
const stateManagers = new Map(); // guildId -> StateManager

// Helper to get or create managers
function getInitiativeTracker(guildId) {
  if (!initiativeTrackers.has(guildId)) {
    initiativeTrackers.set(guildId, new InitiativeTracker());
  }
  return initiativeTrackers.get(guildId);
}

function getBennyManager(guildId) {
  if (!bennyManagers.has(guildId)) {
    bennyManagers.set(guildId, new BennyManager());
  }
  return bennyManagers.get(guildId);
}

function getStateManager(guildId) {
  if (!stateManagers.has(guildId)) {
    stateManagers.set(guildId, new StateManager());
  }
  return stateManagers.get(guildId);
}

/**
 * Roll command - dice rolling with R2 grammar support
 */
export async function cmd_roll(interaction) {
  const expression = interaction.options.getString('dice');
  const acing = interaction.options.getBoolean('acing') || false;
  const modifier = interaction.options.getInteger('modifier') || 0;

  try {
    // Build full expression
    let fullExpression = expression;

    // For acing flag, add '!' suffix if not already present
    if (acing && !expression.includes('!')) {
      // Simple pattern: if it's just XdY, add !
      if (/^\d*d\d+$/.test(expression.toLowerCase())) {
        fullExpression = expression + '!';
      }
    }

    // Add modifier if specified
    if (modifier !== 0) {
      fullExpression += (modifier > 0 ? '+' : '') + modifier;
    }

    // Try R2 evaluator first (supports complex expressions like 10x3d6k1+4)
    try {
      const result = evaluateExpression(fullExpression);
      console.log(result);
      const embed = createR2ResultEmbed(fullExpression, result);
      await interaction.reply({ embeds: [embed] });
    } catch (r2Error) {
      // Fallback to basic parser for simple expressions
      if (r2Error.message.includes('Parser not generated')) {
        // Parser not available, use basic parsing
        const result = parseDiceExpression(fullExpression, acing);
        console.log(result);
        const embed = createSingleRollEmbed(fullExpression, result);
        await interaction.reply({ embeds: [embed] });
      } else {
        // R2 parser error, re-throw
        throw r2Error;
      }
    }
  } catch (error) {
    const embed = createErrorEmbed(error.message);
    await interaction.reply({ embeds: [embed], flags: [MessageFlags.Ephemeral] });
  }
}

/**
 * Wild dice roll (Savage Worlds)
 */
export async function cmd_wild(interaction) {
  const traitDie = interaction.options.getInteger('trait');
  const modifier = interaction.options.getInteger('modifier') || 0;
  const targetNumber = interaction.options.getInteger('target') || 4;

  try {
    const result = rollWithWildDie(traitDie, modifier);
    result.raises = calculateRaises(result.total, targetNumber);

    const expression = `d${traitDie}${modifier !== 0 ? (modifier > 0 ? '+' : '') + modifier : ''}`;
    const embed = createWildDieEmbed(expression, result);
    await interaction.reply({ embeds: [embed] });
  } catch (error) {
    const embed = createErrorEmbed(error.message);
    await interaction.reply({ embeds: [embed], flags: [MessageFlags.Ephemeral] });
  }
}

function formatAcingRolls(rollResult) {
  if (rollResult.rolls.length > 1) {
    return `[${rollResult.rolls.join('+')}]`;
  }
  return rollResult.total.toString();
}

/**
 * Start fight command
 */
export async function cmd_fight_start(interaction) {
  const tracker = getInitiativeTracker(interaction.guildId);

  if (tracker.isActive) {
    await interaction.reply({
      content: '⚔️ Fight already in progress! Use `/fight end` to end it first.',
      flags: [MessageFlags.Ephemeral]
    });
    return;
  }

  tracker.start();
  await interaction.reply('⚔️ **Fight started!** Use `/initiative deal` to deal cards.');
}

/**
 * End fight command
 */
export async function cmd_fight_end(interaction) {
  const tracker = getInitiativeTracker(interaction.guildId);

  if (!tracker.isActive) {
    await interaction.reply({
      content: '❌ No active fight.',
      flags: [MessageFlags.Ephemeral]
    });
    return;
  }

  tracker.end();
  await interaction.reply('✅ **Fight ended.**');
}

/**
 * Deal initiative cards
 */
export async function cmd_initiative_deal(interaction) {
  const names = interaction.options.getString('characters').split(/[,\s]+/).filter(n => n.trim());
  const quick = interaction.options.getBoolean('quick') || false;
  const levelHeaded = interaction.options.getBoolean('level_headed') || false;
  const improvedLevelHeaded = interaction.options.getBoolean('improved_level_headed') || false;

  const tracker = getInitiativeTracker(interaction.guildId);

  if (!tracker.isActive) {
    await interaction.reply({
      content: '❌ No active fight. Use `/fight start` first.',
      flags: [MessageFlags.Ephemeral]
    });
    return;
  }

  try {
    const results = tracker.dealCards(names, {
      quickEdge: quick,
      levelHeadedEdge: levelHeaded,
      improvedLevelHeaded
    });

    let response = '🎴 **Initiative Cards Dealt:**\n\n';
    results.forEach(({ name, card, cardsDrawn }) => {
      response += `**${name}**: ${card.display}`;
      if (cardsDrawn && cardsDrawn.length > 1) {
        const allCards = cardsDrawn.map(c => c.display).join(', ');
        response += ` (drew: ${allCards})`;
      }
      response += '\n';
    });

    await interaction.reply(response);
  } catch (error) {
    await interaction.reply({
      content: `❌ Error: ${error.message}`,
      flags: [MessageFlags.Ephemeral]
    });
  }
}

/**
 * Show initiative order
 */
export async function cmd_initiative_show(interaction) {
  const tracker = getInitiativeTracker(interaction.guildId);

  if (!tracker.isActive) {
    await interaction.reply({
      content: '❌ No active fight.',
      flags: [MessageFlags.Ephemeral]
    });
    return;
  }

  const display = tracker.formatInitiative();
  await interaction.reply(display);
}

/**
 * New round
 */
export async function cmd_initiative_round(interaction) {
  const tracker = getInitiativeTracker(interaction.guildId);

  if (!tracker.isActive) {
    await interaction.reply({
      content: '❌ No active fight.',
      flags: [MessageFlags.Ephemeral]
    });
    return;
  }

  tracker.newRound();
  const display = tracker.formatInitiative();
  await interaction.reply(`🔄 **New Round!**\n\n${display}`);
}

/**
 * Grant bennies
 */
export async function cmd_benny_grant(interaction) {
  const name = interaction.options.getString('character');
  const count = interaction.options.getInteger('count') || 1;

  const manager = getBennyManager(interaction.guildId);
  const newTotal = manager.grant(name, count);

  const emoji = manager.mode === 'deadlands' ? '🪙' : '🎲';
  await interaction.reply(`${emoji} Granted **${count}** benny/bennies to **${name}**. New total: **${newTotal}**`);
}

/**
 * Spend benny
 */
export async function cmd_benny_spend(interaction) {
  const name = interaction.options.getString('character');

  const manager = getBennyManager(interaction.guildId);

  if (!manager.spend(name)) {
    await interaction.reply({
      content: `❌ **${name}** has no bennies to spend!`,
      flags: [MessageFlags.Ephemeral]
    });
    return;
  }

  const remaining = manager.get(name);
  const emoji = manager.mode === 'deadlands' ? '🪙' : '🎲';
  await interaction.reply(`${emoji} **${name}** spent a benny. Remaining: **${remaining}**`);
}

/**
 * List bennies
 */
export async function cmd_benny_list(interaction) {
  const manager = getBennyManager(interaction.guildId);
  const display = manager.formatList();
  await interaction.reply(display);
}

/**
 * Clear bennies
 */
export async function cmd_benny_clear(interaction) {
  const name = interaction.options.getString('character');

  const manager = getBennyManager(interaction.guildId);

  if (name) {
    manager.clear(name);
    await interaction.reply(`✅ Cleared bennies for **${name}**`);
  } else {
    manager.clear();
    await interaction.reply('✅ Cleared all bennies');
  }
}

/**
 * Manage character states
 */
export async function cmd_state(interaction) {
  const name = interaction.options.getString('character');
  const action = interaction.options.getString('action');
  const state = interaction.options.getString('state');

  const manager = getStateManager(interaction.guildId);

  try {
    if (action === 'add') {
      const added = manager.addState(name, state);
      await interaction.reply(`✅ Added state **${added}** to **${name}**`);
    } else if (action === 'remove') {
      const removed = manager.removeState(name, state);
      if (removed) {
        await interaction.reply(`✅ Removed state from **${name}**`);
      } else {
        await interaction.reply({
          content: `❌ State not found for **${name}**`,
          flags: [MessageFlags.Ephemeral]
        });
      }
    } else if (action === 'clear') {
      manager.clearStates(name);
      await interaction.reply(`✅ Cleared all states for **${name}**`);
    } else if (action === 'show') {
      const display = manager.formatStates(name);
      await interaction.reply(display);
    }
  } catch (error) {
    await interaction.reply({
      content: `❌ Error: ${error.message}`,
      flags: [MessageFlags.Ephemeral]
    });
  }
}

/**
 * Roll Help - Comprehensive guide to all rolling strategies
 */
export async function cmd_roll_help(interaction) {
  const help = `# 🎲 Dice Rolling Guide

## Basic Rolls
\`2d6\` - Roll 2 six-sided dice
\`d20\` - Roll 1 twenty-sided dice
\`3d8+5\` - Roll 3d8 and add 5
\`d%\` or \`d100\` - Roll percentile dice

## Exploding/Acing Dice
\`d6!\` - Exploding die (reroll on max)
\`2d8!\` - Multiple exploding dice
**Example**: d6! rolls 6 → 6+4 → 6+4+2 = 12

## Savage Worlds Rolls
\`s8\` - Roll d8 trait + d6 wild, keep highest
\`s10w6\` - Roll d10 trait + d6 wild
\`2s6\` - Roll for 2 characters
\`s8t4\` - Roll with target number 4
\`s8t4r4\` - Target 4, raises every 4
**Wild Cards**: Always roll trait + wild die!

## Extras (NPCs) Rolls
\`e6\` - Single exploding d6 (no wild die)
\`4e8\` - Roll 4 extras with d8
\`e6t4\` - Extras roll vs target 4
**Extras**: Single exploding die only

## Keep/Drop Dice
\`4d6k3\` - Roll 4d6, keep highest 3
\`4d6kl\` - Keep lowest 1
\`2d20adv\` - Advantage (keep highest)
\`2d20dis\` - Disadvantage (keep lowest)
**D&D 5e**: Use adv/dis for advantage/disadvantage

## Success Counting
\`10d6s5\` - Count successes (≥5)
\`8d10s7f1\` - Successes ≥7, failures ≤1
**Shadowrun/WoD**: Count dice meeting threshold

## Multiple Rolls
\`3x2d6\` - Roll 2d6 three times
\`10x3d6k1+4\` - Roll (3d6 keep 1)+4 ten times
**NPC Groups**: Roll for multiple enemies at once

## Advanced Features
\`@str := 3d6; @str*2\` - Variables in single expression
\`2d6[3:12]\` - Bound result between 3-12
\`1--100\` - Gygax range roll (1 to 100)
\`t4:d8!\` - Target number then roll
**Note**: Variables only work within a single roll command

## Other RPG Systems
\`4dF\` - Fudge/FATE dice (-1, 0, +1)
\`5w\` - WEG D6 wild die
\`dC\` - Carcosa roll
\`p10\` - Sword World power roll
\`i+2\` - Ironsworn roll with +2

## Arithmetic
\`2d6+1d4\` - Add rolls together
\`3d8*2\` - Multiply result
\`(2d6+3)*2\` - Use parentheses

**Tip**: Use \`/help rolls\` anytime to see this guide!
**Pro Tip**: Combine features: \`3x(4d6k3)\` for D&D ability scores!`;

  await interaction.reply({
    content: help,
    flags: [MessageFlags.Ephemeral]
  });
}

/**
 * Help command
 */
export async function cmd_help(interaction) {
  const help = `
## 🎲 Dice Rolling
**/roll** - Roll dice (e.g., 2d6+3, d20, 3d8-2)
  • \`dice\`: Dice expression
  • \`acing\`: Enable exploding dice (optional)
  • \`modifier\`: Additional modifier (optional)

**/wild** - Savage Worlds wild die roll
  • \`trait\`: Trait die size (4, 6, 8, 10, 12)
  • \`modifier\`: Modifier (optional)
  • \`target\`: Target number (default 4)

## ⚔️ Combat & Initiative
**/fight start** - Start a new fight
**/fight end** - End the current fight

**/initiative deal** - Deal initiative cards
  • \`characters\`: Names (comma-separated)
  • \`quick\`: Quick edge (optional)
  • \`level_headed\`: Level Headed edge (optional)
  • \`improved_level_headed\`: Improved Level Headed (optional)

**/initiative show** - Show initiative order
**/initiative round** - Start new round

## 🎲 Bennies
**/benny grant** - Grant bennies to character
**/benny spend** - Spend a benny
**/benny list** - List all bennies
**/benny clear** - Clear bennies (all or specific character)

## 🎯 Character States
**/state** - Manage character states (Shaken, Stunned, etc.)
  • \`character\`: Character name
  • \`action\`: add, remove, clear, or show
  • \`state\`: State name (for add/remove)

## ℹ️ Help
**/help commands** - Show this help message
**/help rolls** - Show the various rolling strategies
`;

  await interaction.reply({
    content: help,
    flags: [MessageFlags.Ephemeral]
  });
}
