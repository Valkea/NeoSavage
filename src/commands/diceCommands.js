/**
 * Discord commands for dice rolling functionality
 */

import { MessageFlags } from 'discord.js';
import { rollWithWildDie, calculateRaises, handleSavageWorldsExpression } from '../dice/savageWorldsDice.js';
import { evaluateExpression } from '../r2Evaluator.js';
import { InitiativeTracker } from '../dice/initiativeSystem.js';
import {
  createWildDieEmbed,
  createR2ResultEmbed,
  createErrorEmbed,
  createCombinedRollEmbed
} from '../discordUI/embedBuilder.js';

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
 * Roll command - handles both regular dice and Savage Worlds expressions
 */
export async function cmd_roll(interaction) {
  const expression = interaction.options.getString('dice');
  const acing = interaction.options.getBoolean('acing') || false;
  const modifier = interaction.options.getInteger('modifier') || 0;

  try {
    // Check for split flags at the end: /split, /s, / s, / split
    const splitPattern = /\/\s*(split|s)\s*$/i;
    const hasSplitFlag = splitPattern.test(expression);
    const cleanExpression = expression.replace(splitPattern, '').trim();
    
    // Check if expression contains multiple groups separated by "/"
    const groups = cleanExpression.split('/').map(group => group.trim()).filter(group => group.length > 0);
    
    if (groups.length > 1) {
      if (hasSplitFlag) {
        // Split mode - send separate messages
        for (let i = 0; i < groups.length; i++) {
          const group = groups[i];
          
          // Process each group individually
          await processRollGroup(interaction, group, acing, modifier, i === 0);
          
          // Add small delay between messages to ensure ordering
          if (i < groups.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 100));
          }
        }
      } else {
        // Combined mode - merge into single message with total
        await processCombinedRollGroups(interaction, groups, acing, modifier);
      }
      return;
    }
    
    // Single group - process normally
    await processRollGroup(interaction, cleanExpression, acing, modifier, true);

  } catch (error) {
    const embed = createErrorEmbed(error.message);
    await interaction.reply({ embeds: [embed], flags: [MessageFlags.Ephemeral] });
  }
}

/**
 * Process multiple roll groups into a single combined message
 */
async function processCombinedRollGroups(interaction, groups, acing, modifier) {
  const results = [];
  let overallTotal = 0;
  
  // Process each group and collect results
  for (let i = 0; i < groups.length; i++) {
    const group = groups[i];
    
    try {
      // Check if this is a Savage Worlds expression first
      const swResult = handleSavageWorldsExpression(group, modifier);
      
      if (swResult && swResult.isSingle) {
        // Savage Worlds roll
        results.push({
          expression: swResult.displayExpr,
          total: swResult.result.total,
          isWildDie: true,
          result: swResult.result,
          targetNumber: swResult.targetNumber,
          raiseInterval: swResult.raiseInterval
        });
        overallTotal += swResult.result.total;
      } else {
        // Build full expression for non-SW or multi-SW rolls
        let fullExpression = group;

        // For acing flag, add '!' suffix if not already present
        if (acing && !group.includes('!')) {
          if (/^\d*d\d+$/.test(group.toLowerCase())) {
            fullExpression = group + '!';
          }
        }

        // Add modifier if specified (only for non-SW expressions)
        if (modifier !== 0 && !swResult) {
          fullExpression += (modifier > 0 ? '+' : '') + modifier;
        }

        // Use ANTLR4 parser for complex expressions
        const result = evaluateExpression(fullExpression);
        
        // Check if R2 result is a Savage Worlds roll from the evaluator
        if (result.rolls && result.rolls[0] && result.rolls[0].trait && result.rolls[0].wild) {
          // Single SW roll from R2
          const swR2Result = result.rolls[0];
          const wildResult = {
            total: swR2Result.result,
            traitRoll: swR2Result.trait,
            wildRoll: swR2Result.wild,
            usedDie: swR2Result.usedDie,
            modifier: 0
          };

          const targetNumber = swR2Result.success !== undefined ? 4 : null;
          const raiseInterval = 4;
          if (targetNumber) {
            wildResult.raises = calculateRaises(wildResult.total, targetNumber, raiseInterval);
          }

          results.push({
            expression: fullExpression,
            total: wildResult.total,
            isWildDie: true,
            result: wildResult,
            targetNumber: targetNumber,
            raiseInterval: raiseInterval
          });
          overallTotal += wildResult.total;
        } else {
          // Regular R2 result
          results.push({
            expression: fullExpression,
            total: result.value,
            isWildDie: false,
            result: result
          });
          overallTotal += result.value;
        }
      }
    } catch (error) {
      // If one group fails, add error to results
      results.push({
        expression: group,
        total: 0,
        error: error.message
      });
    }
  }
  
  // Create combined embed
  const embed = createCombinedRollEmbed(results, overallTotal);
  await interaction.reply({ embeds: [embed] });
}

/**
 * Process a single roll group
 */
async function processRollGroup(interaction, expression, acing, modifier, isFirst) {
  // Check if this is a Savage Worlds expression first
  const swResult = handleSavageWorldsExpression(expression, modifier);
  
  if (swResult && swResult.isSingle) {
    // Single Savage Worlds roll - use wild die embed
    const embed = createWildDieEmbed(swResult.displayExpr, swResult.result, swResult.targetNumber, swResult.raiseInterval);
    
    if (isFirst) {
      await interaction.reply({ embeds: [embed] });
    } else {
      await interaction.followUp({ embeds: [embed] });
    }
    return;
  }

  // Build full expression for non-SW or multi-SW rolls
  let fullExpression = expression;

  // For acing flag, add '!' suffix if not already present
  if (acing && !expression.includes('!')) {
    if (/^\d*d\d+$/.test(expression.toLowerCase())) {
      fullExpression = expression + '!';
    }
  }

  // Add modifier if specified (only for non-SW expressions)
  if (modifier !== 0 && !swResult) {
    fullExpression += (modifier > 0 ? '+' : '') + modifier;
  }

  // Use ANTLR4 parser for complex expressions
  const result = evaluateExpression(fullExpression);
  
  // Check if R2 result is a Savage Worlds roll from the evaluator
  if (result.rolls && result.rolls[0] && result.rolls[0].trait && result.rolls[0].wild) {
    // Single SW roll from R2 - use wild die embed
    const swR2Result = result.rolls[0];
    const wildResult = {
      total: swR2Result.result,
      traitRoll: swR2Result.trait,
      wildRoll: swR2Result.wild,
      usedDie: swR2Result.usedDie,
      modifier: 0
    };

    // Extract target number from R2 result if available
    const targetNumber = swR2Result.success !== undefined ? 4 : null;
    const raiseInterval = 4;
    if (targetNumber) {
      wildResult.raises = calculateRaises(wildResult.total, targetNumber, raiseInterval);
    }

    const embed = createWildDieEmbed(fullExpression, wildResult, targetNumber, raiseInterval);
    
    if (isFirst) {
      await interaction.reply({ embeds: [embed] });
    } else {
      await interaction.followUp({ embeds: [embed] });
    }
  } else {
    // Regular R2 result - use general embed
    const embed = createR2ResultEmbed(fullExpression, result);
    
    if (isFirst) {
      await interaction.reply({ embeds: [embed] });
    } else {
      await interaction.followUp({ embeds: [embed] });
    }
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
        let edgeText = '';
        if (r.edges.improvedLevelHeaded) edgeText = ' (Improved Level Headed)';
        else if (r.edges.levelHeaded) edgeText = ' (Level Headed)';
        else if (r.edges.quick) edgeText = ' (Quick)';

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
      let edgeText = '';
      if (char.edges.improvedLevelHeaded) edgeText = ' (ILH)';
      else if (char.edges.levelHeaded) edgeText = ' (LH)';
      else if (char.edges.quick) edgeText = ' (Q)';

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
\`/roll dice:d6!\` - Roll 1 six-sided die with **exploding/acing**
\`/roll dice:d6 acing:true\` - Exploding dice (alternative)`,
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
      }
    ],
    footer: {
      text: '🎲 Happy rolling! Use /roll dice:2d6 to get started'
    }
  };

  await interaction.reply({ embeds: [embed], flags: [MessageFlags.Ephemeral] });
}

