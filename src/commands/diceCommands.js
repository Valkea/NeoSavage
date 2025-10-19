/**
 * Discord commands for dice rolling functionality
 */

import { MessageFlags } from 'discord.js';
import { rollWithWildDie, calculateRaises, createWildResultFromR2 } from '../dice/savageWorldsDice.js';
import { evaluateExpression } from '../r2Evaluator.js';
import { InitiativeTracker } from '../dice/initiativeSystem.js';
import {
  createWildDieEmbed,
  createErrorEmbed,
  createCombinedRollEmbed,
  createEmbedForResult
} from '../discordUI/embedBuilder.js';

//**************************************************
// Helper Functions
//**************************************************

/**
 * Normalize expression by reordering modifiers to parser-friendly format
 * Handles: s10+5r2t5 -> s10r2t5+5, 3d6!+5k2 -> 3d6!k2+5, 3xs8+2r3t5 -> 3xs8r3t5+2
 * @param {string} expression - Original dice expression
 * @returns {string} Normalized expression
 */
function normalizeExpression(expression) {
  // Check for Nx prefix (multiple rolls)
  const repeatMatch = expression.match(/^(\d+[xX])(.*)/);
  let repeatPrefix = '';
  let rollExpression = expression;

  if (repeatMatch) {
    repeatPrefix = repeatMatch[1]; // e.g., "3x"
    rollExpression = repeatMatch[2]; // rest of expression after "3x"
  }

  // For Savage Worlds rolls (s notation)
  // Extract: base roll, modifiers (+/-), target (t), raise (r)
  const swMatch = rollExpression.match(/^(\d*[sS]\d+(?:[wW]\d+)?)(.*)/);
  if (swMatch) {
    const baseRoll = swMatch[1]; // e.g., "s10" or "2s8w6"
    const rest = swMatch[2]; // everything after base roll

    // Extract all modifier types from rest
    const targetMatch = rest.match(/[tT](\d+)/);
    const raiseMatch = rest.match(/[rR](\d+)/);
    const modifierMatch = rest.match(/([+-]\d+)/);

    // Rebuild in correct order: repeat + base + target + raise + modifier
    let normalized = repeatPrefix + baseRoll;
    if (targetMatch) normalized += 't' + targetMatch[1];
    if (raiseMatch) normalized += 'r' + raiseMatch[1];
    if (modifierMatch) normalized += modifierMatch[1];

    return normalized;
  }

  // For generic rolls (d notation)
  // Extract: base roll, explosion (!), keep (k/kl/adv/dis), target/raise, modifiers
  const genericMatch = rollExpression.match(/^(\d*[dD]\d+%?)(!)?(.*)$/);
  if (genericMatch) {
    const baseRoll = genericMatch[1]; // e.g., "3d6"
    const explosion = genericMatch[2] || ''; // "!" or ""
    const rest = genericMatch[3]; // everything after explosion

    // Extract modifier types (keep can have optional number: k, k2, kl, kl3, adv, dis)
    const keepMatch = rest.match(/([kK][lL]?|adv|dis)(\d*)/i);
    const targetMatch = rest.match(/[tT](\d+)/);
    const raiseMatch = rest.match(/[rR](\d+)/);
    const modifierMatch = rest.match(/([+-]\d+)/);

    // Rebuild: repeat + base + explosion + keep + target + raise + modifier
    let normalized = repeatPrefix + baseRoll + explosion;
    if (keepMatch) {
      // Normalize keep operation (kl, kL, KL -> kl; k, K -> k)
      const keepOp = keepMatch[1].toLowerCase();
      normalized += keepOp + (keepMatch[2] || '');
    }
    if (targetMatch) normalized += 't' + targetMatch[1];
    if (raiseMatch) normalized += 'r' + raiseMatch[1];
    if (modifierMatch) normalized += modifierMatch[1];

    return normalized;
  }

  // If no pattern matched, return original
  return expression;
}

/**
 * Parse roll modifiers from expression
 * @param {string} expression - Dice expression
 * @returns {Object} Object with targetNumber, raiseInterval, and modifier
 */
function parseRollModifiers(expression) {
  const targetMatch = expression.match(/t(\d+)/i);
  const raiseMatch = expression.match(/r(\d+)/i);
  const modifierMatch = expression.match(/([+-]\d+)/);

  return {
    targetNumber: targetMatch ? parseInt(targetMatch[1]) : null,
    raiseInterval: raiseMatch ? parseInt(raiseMatch[1]) : null,
    modifier: modifierMatch ? parseInt(modifierMatch[1]) : 0
  };
}

/**
 * Format edge text (full description)
 * @param {Object} edges - Edges object
 * @returns {string} Formatted edge text
 */
function formatEdgeText(edges) {
  if (edges.improved_level_headed) return ' (Improved Level Headed)';
  if (edges.level_headed) return ' (Level Headed)';
  if (edges.quick) return ' (Quick)';
  return '';
}

/**
 * Format edge abbreviation
 * @param {Object} edges - Edges object
 * @returns {string} Abbreviated edge text
 */
function formatEdgeAbbrev(edges) {
  if (edges.improvedLevelHeaded) return ' (ILH)';
  if (edges.levelHeaded) return ' (LH)';
  if (edges.quick) return ' (Q)';
  return '';
}

//**************************************************
// Rolls / Wild
//**************************************************

/**
 * Evaluate a Savage Worlds expression and return structured result
 */
function evaluateSavageExpression(expression, result) {
  // Extract target/raise info from the expression
  const { targetNumber, raiseInterval, modifier } = parseRollModifiers(expression);

  // Check if result.rolls is an array (multiple rolls) or object (single roll)
  const swRollData = Array.isArray(result.rolls) ? result.rolls[0] : result.rolls;

  if (!swRollData || !swRollData.trait || !swRollData.wild) {
    return null; // Not a valid SW result
  }

  // Check if this is multiple SW rolls or single
  if (Array.isArray(result.rolls) && result.rolls.length > 1) {
    // Multiple SW rolls (e.g., 2xs8t3r2+2)
    return {
      expression: expression,
      total: result.value,
      isWildDie: true,
      result: {
        rolls: result.rolls,
        modifier: modifier
      },
      targetNumber: targetNumber,
      raiseInterval: raiseInterval
    };
  } else {
    // Single SW roll from R2
    const { wildResult, targetNumber: tn, raiseInterval: ri } = createWildResultFromR2(swRollData);

    return {
      expression: expression,
      total: wildResult.total,
      isWildDie: true,
      result: wildResult,
      targetNumber: targetNumber || tn,
      raiseInterval: raiseInterval || ri
    };
  }
}

/**
 * Evaluate a single roll expression and return structured result
 */
function evaluateRoll(expression) {
  try {
    // Normalize expression to parser-friendly order
    const normalized = normalizeExpression(expression);

    // Use ANTLR4 parser for all expressions
    const result = evaluateExpression(normalized);

    // Savage Worlds roll result (use normalized for parsing, original for display)
    const swResult = evaluateSavageExpression(normalized, result);
    if (swResult) {
      // Use original expression for display
      swResult.expression = expression;
      return swResult;
    }

    // Regular R2 result (use original expression for display)
    return {
      expression: expression,
      total: result.value,
      isWildDie: false,
      result: result
    };

  } catch (error) {
    // Return error result
    return {
      expression: expression,
      total: 0,
      error: error.message
    };
  }
}

/**
 * Send interaction response (reply or followUp based on isFirst)
 */
async function sendInteractionResponse(interaction, embed, isFirst) {
  if (isFirst) {
    await interaction.reply({ embeds: [embed] });
  } else {
    await interaction.followUp({ embeds: [embed] });
  }
}

/**
 * Process roll groups - unified handler for single and multiple rolls
 */
async function rollExpressionRouter(interaction, groups, splitMode) {

  // Evaluate all groups in parallel (works for 1 or many)
  const results = await Promise.all(
    groups.map(group => evaluateRoll(group))
  );

  // Single result - use specific embed type
  if (results.length === 1) {
    const embed = createEmbedForResult(results[0]);
    await interaction.reply({ embeds: [embed] });

  // Multiple results - use combined embed with total
  } else if (!splitMode) {
    const overallTotal = results.reduce((sum, result) => sum + result.total, 0);
    const embed = createCombinedRollEmbed(results, overallTotal);
    await interaction.reply({ embeds: [embed] });

  // Send separate messages for each result
  } else {
    for (let i = 0; i < results.length; i++) {
      const embed = createEmbedForResult(results[i]);
      await sendInteractionResponse(interaction, embed, i === 0);

      // Add small delay between messages to ensure ordering
      if (i < results.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
  }
}

/**
 * Roll command - handles both regular dice and Savage Worlds expressions
 */
export async function cmd_roll(interaction) {
  const expression = interaction.options.getString('dice');

  try {
    // Check for split flags at the end: /split, /s, / s, / split
    const splitPattern = /\/\s*(split|s)\s*$/i;
    const hasSplitFlag = splitPattern.test(expression);
    const cleanExpression = expression.replace(splitPattern, '').trim();

    // Split expression into groups by "/" separator
    const groups = cleanExpression.split('/').map(group => group.trim()).filter(group => group.length > 0);

    // Process all groups with unified handler
    await rollExpressionRouter(interaction, groups, hasSplitFlag);

  } catch (error) {
    const embed = createErrorEmbed(error.message);
    await interaction.reply({ embeds: [embed], flags: [MessageFlags.Ephemeral] });
  }
}

/**
 * Wild dice roll (Savage Worlds) - explicit wild die command
 */
export async function cmd_wild(interaction) {
  const traitDie = interaction.options.getInteger('trait');
  const modifier = interaction.options.getInteger('modifier') || 0;
  const targetNumber = interaction.options.getInteger('target') || 4;
  const raiseInterval = interaction.options.getInteger('raise') || 4;

  try {
    const result = rollWithWildDie(traitDie, modifier);
    result.raises = calculateRaises(result.total, targetNumber, raiseInterval);

    const expression = `d${traitDie}${modifier !== 0 ? (modifier > 0 ? '+' : '') + modifier : ''}`;
    const embed = createWildDieEmbed(expression, result, targetNumber, raiseInterval);

    await interaction.reply({ embeds: [embed] });
  } catch (error) {
    const embed = createErrorEmbed(error.message);
    await interaction.reply({ embeds: [embed], flags: [MessageFlags.Ephemeral] });
  }
}

//**************************************************
// Fight / Initiative
//**************************************************

// Game state managers
const initiativeTrackers = new Map(); // guildId -> InitiativeTracker

// Helper to get or create initiative tracker
function getInitiativeTracker(guildId) {
  if (!initiativeTrackers.has(guildId)) {
    initiativeTrackers.set(guildId, new InitiativeTracker());
  }
  return initiativeTrackers.get(guildId);
}


/**
 * Start fight command
 */
export async function cmd_fight_start(interaction) {
  const tracker = getInitiativeTracker(interaction.guildId);

  if (tracker.isFightActive()) {
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

  if (!tracker.isFightActive()) {
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
  const tracker = getInitiativeTracker(interaction.guildId);
  const charactersInput = interaction.options.getString('characters');
  const quick = interaction.options.getBoolean('quick') || false;
  const levelHeaded = interaction.options.getBoolean('level_headed') || false;
  const improvedLevelHeaded = interaction.options.getBoolean('improved_level_headed') || false;

  try {
    if (!tracker.isFightActive()) {
      await interaction.reply({
        content: '❌ No active fight. Use `/fight start` first.',
        flags: [MessageFlags.Ephemeral]
      });
      return;
    }

    const characterNames = charactersInput.split(',').map(name => name.trim());
    const edges = { quick, level_headed: levelHeaded, improved_level_headed: improvedLevelHeaded };

    const results = tracker.dealCards(characterNames, edges);

    const embed = {
      color: 0x0099ff,
      title: '🎴 Initiative Cards Dealt',
      description: results.map(r => {
        const edgeText = formatEdgeText(r.edges);
        let cardText = `**${r.name}${edgeText}:** ${r.card.display}`;

        if (r.droppedCards.length > 0) {
          cardText += `\n  ↳ _Dropped: ${r.droppedCards.map(c => c.display).join(', ')}_`;
        }

        return cardText;
      }).join('\n\n')
    };

    await interaction.reply({ embeds: [embed] });
  } catch (error) {
    const embed = createErrorEmbed(error.message);
    await interaction.reply({ embeds: [embed], flags: [MessageFlags.Ephemeral] });
  }
}

/**
 * Show initiative order
 */
export async function cmd_initiative_show(interaction) {
  const tracker = getInitiativeTracker(interaction.guildId);

  if (!tracker.isFightActive()) {
    await interaction.reply({
      content: '❌ No active fight.',
      flags: [MessageFlags.Ephemeral]
    });
    return;
  }

  const order = tracker.getInitiativeOrder();

  if (order.length === 0) {
    await interaction.reply({
      content: '📋 No cards dealt yet. Use `/initiative deal` first.',
      flags: [MessageFlags.Ephemeral]
    });
    return;
  }

  const embed = {
    color: 0x00ff00,
    title: `⚔️ Initiative Order - Round ${tracker.getCurrentRound()}`,
    description: order.map((char, index) => {
      const edgeText = formatEdgeAbbrev(char.edges);
      return `**${index + 1}.** ${char.name}${edgeText} - ${char.card.display}`;
    }).join('\n')
  };

  await interaction.reply({ embeds: [embed] });
}

/**
 * Start new round
 */
export async function cmd_initiative_round(interaction) {
  const tracker = getInitiativeTracker(interaction.guildId);

  if (!tracker.isFightActive()) {
    await interaction.reply({
      content: '❌ No active fight.',
      flags: [MessageFlags.Ephemeral]
    });
    return;
  }

  tracker.newRound();
  await interaction.reply(`🔄 **Round ${tracker.getCurrentRound()} started!**`);
}

/**
 * Help command for dice rolling
 */
export async function cmd_roll_help(interaction) {
  const embed = {
    color: 0x0099ff,
    title: '🎲 Dice Rolling Guide',
    description: 'Complete guide to rolling dice with this bot',
    fields: [
      {
        name: '🎯 Basic Dice Rolling',
        value: `\`/roll dice:2d6\` - Roll 2 six-sided dice
\`/roll dice:d20\` - Roll 1 twenty-sided die
\`/roll dice:3d8+2\` - Roll 3d8 and add a +2 **modifier**
\`/roll dice:d6!\` - Roll 1 six-sided die with **exploding/acing**`,
        inline: false
      },
      {
        name: '🐺 Savage Worlds (Wild Die) with /roll syntax',
        value: `\`/roll dice:s8\` - Trait d8 + Wild d6
\`/roll dice:s10+2\` - Trait d10 + Wild d6 + 2 **modifier**
\`/roll dice:s8t6\` - Trait d8 + Wild d6 + **target** Number of 6
\`/roll dice:s12t8r5\` - Trait d12 + Wild d6 + target of 8 + **raise** every 5`,
        inline: false
      },
      {
        name: '🐺 Savage Worlds (Wild Die) Alternative with /wild syntax',
        value: `\`/wild trait:d8\` = \`/roll dice:s8\`
\`/wild trait:d10 modifier:2\` = \`/roll dice:s10+2\`
\`/wild trait:d8 target:6\` = \`/roll dice:s8t6\`
\`/wild trait:d12 target:8 raise:5\` = \`/roll dice:s12t8r5\``,
        inline: false
      },
      {
        name: '🎯 Keep/Drop Dice',
        value: `\`/roll dice:4d6k3\` - Roll 4d6, **keep highest** 3
\`/roll dice:4d6kl1\` - Roll 4d6, **keep lowest** 1
\`/roll dice:5d20adv3\` - Roll 5d20, **keep highest** 3 (Advantage)
\`/roll dice:2d20dis\` - Roll 2d20, **keep lowest** 1 (Disadvantage)`,
        inline: false
      },
      {
        name: '🔢 Multiple Rolls',
        value: `\`/roll dice:3xd20\` - Roll \`d20\` **three times**
\`/roll dice:5x2d4!\` - Roll \`2d4!\` **five times**
\`/roll dice:6x3d6+2\` - Roll \`3d6+2\` **six times**
\`/roll dice:10x4d6!k3\` - Roll \`4d6 explode, keep highest 3\` **ten times**
\`/roll dice:3xs8\` - Roll Savage Worlds \`s8\` **three times**`,
        inline: false
      },
      {
        name: '📊 Multi-Group Rolls',
        value: `\`/roll dice:3d6 / 4d8 / 3d12\` - **Combined**: Roll all groups, show total
\`/roll dice:2d6+2 / s8t3r2+2 / 5d20!k2+3\` - **Mixed types** with total
\`/roll dice:3d6 / 4d8 / 3d12 /split\` - **Separate messages**
\`/roll dice:s10 / 2d8+3 /s\` - **Split mode** (short flag)

**Split Flags**: \`/split\`, \`/s\`, \`/ s\`, \`/ split\`
**Default**: Combined message with overall total`,
        inline: false
      },
      {
        name: '📏 Bounded Rolls',
        value: `\`/roll dice:2d6[3:10]\` - Roll 2d6, **clamp result** between 3 and 10
\`/roll dice:3d8[5:]\` - Roll 3d8, **minimum** result of 5
\`/roll dice:d20[:15]\` - Roll d20, **maximum** result of 15
\`/roll dice:4d6k3[8:18]\` - Roll 4d6 keep 3, clamp between 8 and 18`,
        inline: false
      },
      {
        name: '🎲 Other Dice Systems',
        value: `\`/roll dice:1--100\` - **Gygax range** (1 to 100, like d100)
\`/roll dice:10--50\` - **Gygax range** (10 to 50)
\`/roll dice:4dF\` - **Fudge dice** (-1, 0, +1)
\`/roll dice:5w\` - **WEG D6** wild die system
\`/roll dice:i+2\` - **Ironsworn** roll with +2`,
        inline: false
      },
      {
        name: '⚔️ Initiative System',
        value: `\`/fight start\` - Start combat
\`/initiative deal characters:Alice,Bob\` - Deal cards
\`/initiative show\` - Show turn order
\`/initiative round\` - New round
\`/fight end\` - End combat`,
        inline: false
      },
      {
        name: '🃏 Edges Support',
        value: `When using \`/initiative deal characters:Alice,Bob\`:
• \`quick:true\` - Quick edge (draw 2, keep best)
• \`level_headed:true\` - Level Headed edge (draw 2, keep best)
• \`improved_level_headed:true\` - Improved Level Headed (draw 3, keep best)

*Note: Quick and Level Headed have the same mechanical effect*`,
        inline: false
      },
      {
        name: '✨ Flexible Modifier Order',
        value: `**Modifiers can be in ANY order!**
\`s10+5r2t5\` = \`s10r2t5+5\` = \`s10t5+5r2\` ✅
\`3d6!+5k2\` = \`3d6!k2+5\` = \`3d6k2!+5\` ✅
\`3d6+2kl2\` = \`3d6kl2+2\` ✅
\`3xs8+2r3t5\` = \`3xs8r3t5+2\` ✅

*The bot automatically reorders modifiers for you!*`,
        inline: false
      }
    ],
    footer: {
      text: '🎲 Happy rolling! Use /roll dice:2d6 to get started'
    }
  };

  await interaction.reply({ embeds: [embed], flags: [MessageFlags.Ephemeral] });
}

