import { EmbedBuilder } from 'discord.js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Constants for embed styling
 */
const DICE_COLOR = 3447003; // Blue color

//**************************************************
// Thumbnail functions
//**************************************************

/**
 * Load dice icons from JSON configuration
 */
const diceIconsData = JSON.parse(readFileSync(join(__dirname, 'diceIcons.json'), 'utf8'));

/**
 * Build icon array ONCE at module load instead of rebuilding on every call
 * Perf: O(1) lookup - array built once at startup
 */
const allIcons = (() => {
  const icons = [];
  for (const entry of diceIconsData.icons) {
    for (const url of entry.urls) {
      icons.push({
        url,
        author: entry.author,
        source: entry.source
      });
    }
  }
  return icons;
})();

/**
 * Get a random dice icon from the pre-built cache
 * Perf: O(1)
 * @returns {Object} { url: string, footer: string }
 */
function getRandomDiceIcon() {
  const randomIcon = allIcons[Math.floor(Math.random() * allIcons.length)];
  return {
    url: randomIcon.url,
    footer: `by ${randomIcon.author} @ ${randomIcon.source}`
  };
}

/**
 * Apply dice icon and footer to an embed
 * @param {EmbedBuilder} embed - The embed to apply icon to
 * @returns {EmbedBuilder} The embed with icon applied
 */
function applyDiceIcon(embed) {
  const diceIcon = getRandomDiceIcon();
  return embed
    .setThumbnail(diceIcon.url)
    .setFooter({
      text: diceIcon.footer,
      iconURL: diceIcon.url
    });
}

//**************************************************
// Format functions
//**************************************************

/**
 * Helper: Format a single die's explosion chain
 * Traverses the nested nextRoll structure
 * @param {Object} die - Die object {value, exploded, nextRoll, total}
 * @returns {string} Formatted die chain (e.g., "6💥, 6💥, 3" or "5")
 */
function formatDieChain(die) {
  if (!die) return '';

  const chain = [];
  let current = die;

  while (current) {
    if (current.exploded && current.nextRoll) {
      chain.push(`${current.value}💥`);
    } else {
      chain.push(current.value);
    }
    current = current.nextRoll;
  }

  return chain.length > 1 ? `**(** ${chain.join(', ')} **)** ` : chain.join('');
}

/**
 * Format a generic roll result
 * @param {Object} result - GenericRollResult instance
 * @returns {string} Formatted roll string
 */
function formatGenericRoll(result) {
  // Format each die with its explosion chain
  const diceStrings = result.dice
    .filter(die => die.kept !== false) // Only show kept dice (kept === true or kept === undefined)
    .map(die => formatDieChain(die));

  const diceDisplay = diceStrings.join(', ');

  let output = `**${result.value}** ← **[** ${diceDisplay} **]**`;
  output += formatDroppedDice(result.droppedDice);
  output += formatModifier(result.modifier);

  return output;
}

/**
 * Format a modifier value with appropriate sign
 * @param {number|null} modifier - Modifier value
 * @returns {string} Formatted modifier string or empty string
 */
function formatModifier(modifier) {
  if (modifier === null || modifier === 0) return '';
  const sign = modifier > 0 ? '+' : '';
  return ` ${sign}${modifier}`;
}

/**
 * Format dropped dice display
 * @param {Array} droppedDice - Array of dropped dice objects
 * @returns {string} Formatted dropped dice string or empty string
 */
function formatDroppedDice(droppedDice) {
  if (!droppedDice || droppedDice.length === 0) return '';
  const droppedValues = droppedDice.map(die => die.total).join(', ');
  return ` ~~*( ${droppedValues} )*~~`;
}

/**
 * Format raises/success information
 * @param {Object} raises - Raises object with success, raises, margin
 * @param {number|null} targetNumber - Target number for the roll
 * @param {number} raiseInterval - Points needed per raise
 * @returns {string} Formatted raises string
 */
function formatRaises(raises, targetNumber, raiseInterval) {
  if (!raises) return '';

  let text = '';
  if (raises.success) {
    if (raises.raises > 0) {
      const stars = '⭐'.repeat(raises.raises);
      const raiseWord = raises.raises === 1 ? 'raise' : 'raises';
      text = `\n✅ Success with ${raises.raises} ${stars} ${raiseWord}`;
    } else {
      text = '\n✅ Success';
    }
  } else {
    text = `\n💀 Failure by ${Math.abs(raises.margin)}`;
  }

  if (targetNumber !== null) {
    text += ` (🎯 ${targetNumber} | 🪜 ${raiseInterval})\n`;
  }
  return text;
}

/**
 * Format a Savage Worlds wild die roll result
 * @param {Object} result - SavageWildRollResult instance
 * @returns {string} Formatted roll string
 */
function formatSavageWildRoll(result) {
  const traitChain = formatDieChain(result.traitDie);
  const wildChain = formatDieChain(result.wildDie);

  let output = `**Trait:** ${traitChain} (${result.traitDie.total})\n`;
  output += `**Wild:** ${wildChain} (${result.wildDie.total})\n`;
  output += `**Result:** **${result.value}** • used ${result.usedDie} die`;
  output += formatModifier(result.modifier);
  output += formatRaises(result.raises, result.targetNumber, result.raiseInterval);

  return output;
}

//**************************************************
// Embedding functions
//**************************************************

/**
 * Create embed for Savage Worlds wild die roll
 * @param {string} expression - Dice expression
 * @param {Object} result - SavageWildRollResult instance
 * @param {number} targetNumber - Target number for the roll (deprecated, use result.targetNumber)
 * @param {number} raiseInterval - Points needed per raise (deprecated, use result.raiseInterval)
 * @returns {EmbedBuilder}
 */
export function createWildDieEmbed(expression, result, targetNumber = null, raiseInterval = 4) {
  // Use the new structured format
  const traitChain = formatDieChain(result.traitDie);
  const wildChain = formatDieChain(result.wildDie);

  const fields = [
    {
      name: '__Trait Die__',
      value: `${traitChain} (${result.traitDie.total})`,
      inline: true
    },
    {
      name: '__Wild Die__',
      value: `${wildChain} (${result.wildDie.total})`,
      inline: true
    }
  ];

  // Build final result display
  let finalResultText = `**${result.value}**`;

  // Show calculation if there's a modifier
  if (result.modifier && result.modifier !== 0) {
    const baseTotal = result.usedDie === 'trait' ? result.traitDie.total : result.wildDie.total;
    finalResultText = `**${result.value}** ← **[** ${baseTotal} **]**${formatModifier(result.modifier)}`;
  }

  finalResultText += ` • used ${result.usedDie} die`;

  // Add raises information if present
  if (result.raises) {
    const tn = result.targetNumber !== null ? result.targetNumber : targetNumber;
    const ri = result.raiseInterval !== null ? result.raiseInterval : raiseInterval;
    finalResultText += formatRaises(result.raises, tn, ri);
  }

  // Add final result field
  fields.push({
    name: '__Final Result__',
    value: finalResultText,
    inline: false
  });

  // Determine thumbnail based on success/failure
  const diceIcon = getRandomDiceIcon();
  let thumbnailUrl = diceIcon.url;

  if (result.raises) {
    if (result.raises.success) {
      thumbnailUrl = 'https://cdn-icons-png.flaticon.com/512/3426/3426250.png';
      if (result.raises.raises > 0) {
        thumbnailUrl = 'https://cdn-icons-png.flaticon.com/512/3426/3426127.png';
      }
    } else {
      thumbnailUrl = 'https://cdn-icons-png.flaticon.com/512/3426/3426286.png';
    }
  }

  const embed = new EmbedBuilder()
    .setColor(DICE_COLOR)
    .setDescription(`\`${expression}\``)
    .addFields(...fields)
    .setThumbnail(thumbnailUrl);

  return embed;
}

/**
 * Create embed for R2 parser results (using structured data)
 * Internal helper - not exported, used by createEmbedForResult
 * @param {string} expression - Dice expression
 * @param {Object} result - RollResult instance with structured data
 * @returns {EmbedBuilder}
 */
function createR2ResultEmbed(expression, result) {
  const embed = new EmbedBuilder()
    .setColor(DICE_COLOR)
    .setDescription(`\`${expression}\``);

  // Handle different roll types using the structured data
  if (result.rollType === 'multiple' && result.rolls && result.rolls.length > 1) {
    // Multiple rolls - format each roll
    const rollsValue = result.rolls.map((roll) => {
      if (roll.rollType === 'generic') {
        return formatGenericRoll(roll);
      } else if (roll.rollType === 'savageWild') {
        return formatSavageWildRoll(roll);
      } else {
        return `**${roll.value}**`;
      }
    }).join('\n');

    embed.addFields(
      {
        name: '__Rolls__',
        value: rollsValue,
        inline: false
      },
      {
        name: '__Total__',
        value: `**${result.value}**`,
        inline: false
      }
    );
  } else if (result.rollType === 'generic') {
    // Single generic roll
    embed.addFields({
      name: '__Roll__',
      value: formatGenericRoll(result),
      inline: false
    });
  } else if (result.rollType === 'savageWild') {
    // Single Savage Worlds roll
    embed.addFields({
      name: '__Roll__',
      value: formatSavageWildRoll(result),
      inline: false
    });
  } else {
    // Simple value or fallback
    embed.addFields({
      name: '__Roll__',
      value: `**${result.value}**`,
      inline: false
    });
  }

  return applyDiceIcon(embed);
}

/**
 * Create error embed
 * @param {string} message - Error message
 * @returns {EmbedBuilder}
 */
export function createErrorEmbed(message) {
  return new EmbedBuilder()
    .setColor(0xFF0000) // Red color
    .setDescription(`❌ **Error**\n${message}`);
}

/**
 * Create embed for combined multiple roll groups
 * @param {Array} results - Array of roll results with expression, total, and other data
 * @param {number} overallTotal - Sum of all group totals
 * @returns {EmbedBuilder}
 */
export function createCombinedRollEmbed(results, overallTotal) {
  const embed = new EmbedBuilder()
    .setColor(DICE_COLOR)
    .setTitle('🎲 Multiple Roll Groups');

  // Create fields for each roll group
  const fields = results.map((rollResult, index) => {
    const groupNumber = index + 1;
    let fieldValue;

    if (rollResult.error) {
      fieldValue = `❌ Error: ${rollResult.error}`;
    } else {
      const result = rollResult.result;

      // Use existing format functions based on rollType
      if (result.rollType === 'savageWild') {
        fieldValue = formatSavageWildRoll(result);
      } else if (result.rollType === 'generic') {
        fieldValue = formatGenericRoll(result);
      } else if (result.rollType === 'multiple' && result.rolls) {
        // Multiple rolls - format each one
        const rollsFormatted = result.rolls.map(roll => {
          if (roll.rollType === 'savageWild') {
            return formatSavageWildRoll(roll);
          } else if (roll.rollType === 'generic') {
            return formatGenericRoll(roll);
          }
          return `**${roll.value}**`;
        }).join('\n');
        fieldValue = `${rollsFormatted}\n**Total: ${rollResult.total}**`;
      } else {
        // Fallback for simple values
        fieldValue = `**${rollResult.total}**`;
      }
    }

    return {
      name: `__Group ${groupNumber}:__ \`${rollResult.expression}\``,
      value: fieldValue,
      inline: false
    };
  });

  // Add overall total field
  fields.push({
    name: '__Overall Total__',
    value: `**${overallTotal}**`,
    inline: false
  });

  applyDiceIcon(embed);
  embed.addFields(...fields);
  return embed;
}

/**
 * Create appropriate embed for a single roll result
 */
export function createEmbedForResult(rollResult) {

  // Error
  if (rollResult.error) {
    return createErrorEmbed(rollResult.error);
  }

  // Check the actual result's rollType (new structured format)
  const actualResult = rollResult.result;

  // Savage Worlds wild die (check both old isWildDie flag and new rollType)
  if (rollResult.isWildDie || actualResult.rollType === 'savageWild') {
    return createWildDieEmbed(
      rollResult.expression,
      actualResult,
      rollResult.targetNumber || actualResult.targetNumber,
      rollResult.raiseInterval || actualResult.raiseInterval
    );
  }

  // Other / Regular (generic, multiple, etc.)
  return createR2ResultEmbed(
    rollResult.expression,
    actualResult
  );
}
