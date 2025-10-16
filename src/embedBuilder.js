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

/**
 * Load dice icons from JSON configuration
 */
const diceIconsData = JSON.parse(readFileSync(join(__dirname, 'diceIcons.json'), 'utf8'));

/**
 * Get a random dice icon from the configuration
 * @returns {Object} { url: string, footer: string }
 */
function getRandomDiceIcon() {
  // Flatten all URLs with their author/source info
  const allIcons = [];
  for (const entry of diceIconsData.icons) {
    for (const url of entry.urls) {
      allIcons.push({
        url,
        author: entry.author,
        source: entry.source
      });
    }
  }

  const randomIcon = allIcons[Math.floor(Math.random() * allIcons.length)];
  return {
    url: randomIcon.url,
    footer: `by ${randomIcon.author} @ ${randomIcon.source}`
  };
}

/**
 * Format a single roll with optional exploding dice and modifiers
 * @param {Object} roll - Roll result object
 * @param {Array} roll.rolls - Individual die rolls
 * @param {number} roll.total - Total result
 * @param {boolean} hasExploded - Whether dice exploded
 * @param {number} [dropCount] - Number of dropped dice to show
 * @returns {string} Formatted roll string
 */
function formatRollValue(roll, hasExploded = false, dropCount = null) {
  if (!roll.rolls || roll.rolls.length === 0) {
    return `**${roll.total}**`;
  }

  let rollDisplay;

  if (hasExploded) {
    // Format: **21** ← **[** **( 6💥,6💥, 2 )**, 3, 4** ]**
    const explodingPart = roll.rolls.filter(r => r === Math.max(...roll.rolls)).map(r => `${r}💥`).join(', ');
    const regularPart = roll.rolls.filter(r => r !== Math.max(...roll.rolls));

    if (regularPart.length > 0) {
      rollDisplay = `**(** ${explodingPart} **)**, ${regularPart.join(', ')}`;
    } else {
      rollDisplay = `**(** ${explodingPart} **)**`;
    }
  } else {
    // Format: **10** ← **[ **3, 5, 2** ]**
    rollDisplay = `${roll.rolls.join(', ')}`;
  }

  let result = `**${roll.total}** ← **[** ${rollDisplay} **]**`;

  // Add dropped dice modifier if present
  if (dropCount !== null && dropCount > 0) {
    result += ` ~~*( ${dropCount} )*~~`;
  }

  return result;
}

/**
 * Create embed for single roll
 * @param {string} expression - Dice expression
 * @param {Object} result - Roll result
 * @returns {EmbedBuilder}
 */
export function createSingleRollEmbed(expression, result) {
  const hasExploded = result.rolls && result.rolls.some(r => r === Math.max(...result.rolls));
  const diceIcon = getRandomDiceIcon();

  const embed = new EmbedBuilder()
    .setColor(DICE_COLOR)
    .setDescription(`\`${expression}\``)
    .addFields({
      name: '__Roll__',
      value: formatRollValue(result, hasExploded),
      inline: false
    })
    .setThumbnail(diceIcon.url)
    .setFooter({
      text: diceIcon.footer,
      iconURL: diceIcon.url
    });

  return embed;
}

/**
 * Create embed for multiple rolls
 * @param {string} expression - Dice expression
 * @param {Array} rolls - Array of roll results
 * @param {number} total - Total of all rolls
 * @returns {EmbedBuilder}
 */
export function createMultipleRollsEmbed(expression, rolls, total) {
  const rollsValue = rolls.map((roll) => {
    const hasExploded = roll.rolls && roll.rolls.some(r => r === Math.max(...roll.rolls));
    return formatRollValue(roll, hasExploded);
  }).join('\n');
  const diceIcon = getRandomDiceIcon();

  const embed = new EmbedBuilder()
    .setColor(DICE_COLOR)
    .setDescription(`\`${expression}\``)
    .addFields(
      {
        name: '__Rolls__',
        value: rollsValue,
        inline: false
      },
      {
        name: '__Total__',
        value: `**${total}**`,
        inline: false
      }
    )
    .setThumbnail(diceIcon.url)
    .setFooter({
      text: diceIcon.footer,
      iconURL: diceIcon.url
    });

  return embed;
}

/**
 * Create embed for Savage Worlds wild die roll
 * @param {string} expression - Dice expression
 * @param {Object} result - Wild die result
 * @returns {EmbedBuilder}
 */
export function createWildDieEmbed(expression, result) {
  const traitRoll = formatRollValue(result.traitRoll, true);
  const wildRoll = formatRollValue(result.wildRoll, true);
  const diceIcon = getRandomDiceIcon();

  const embed = new EmbedBuilder()
    .setColor(DICE_COLOR)
    .setDescription(`\`${expression}\``)
    .addFields(
      {
        name: '__Trait Die__',
        value: traitRoll,
        inline: true
      },
      {
        name: '__Wild Die__',
        value: wildRoll,
        inline: true
      },
      {
        name: '__Final Result__',
        value: `**${result.total}** (used ${result.usedDie} die)`,
        inline: false
      }
    )
    .setThumbnail(diceIcon.url)
    .setFooter({
      text: diceIcon.footer,
      iconURL: diceIcon.url
    });

  // Add raises information if target number provided
  if (result.raises !== undefined) {
    embed.addFields({
      name: '__Success__',
      value: result.raises.description,
      inline: false
    });
  }

  return embed;
}

/**
 * Parse and format R2 description with exploding dice
 * @param {string} description - R2 description like "[6+5]=11, 3, 4" or "3, 5, 2"
 * @returns {string} Formatted dice string
 */
function formatR2Dice(description) {
  // Check if there are dropped dice (separated by |)
  const pipeSplit = description.split('|');
  const diceDescription = pipeSplit[0];
  const droppedDescription = pipeSplit.length > 1 ? pipeSplit[1] : null;

  // Split by commas to get individual dice or exploding groups
  const parts = diceDescription.split(',').map(p => p.trim());
  const formatted = [];

  for (const part of parts) {
    // Check if this is an exploding dice group like [6+5]=11 or [6+6+4]=16
    const explodeMatch = part.match(/\[([^\]]+)\]=(\d+)/);

    if (explodeMatch) {
      // Parse the exploded dice: [6+5] -> 6💥, 5  or  [6+6+4] -> 6💥, 6💥, 4
      const diceValues = explodeMatch[1].split('+').map(d => d.trim());
      // Add explosion emoji to all dice EXCEPT the last one (which stopped the explosion)
      const formattedDice = diceValues.map((d, i) =>
        i < diceValues.length - 1 ? `${d}💥` : d
      ).join(', ');
      formatted.push(`**(** ${formattedDice} **)**`);
    } else {
      // Regular die, just add it
      formatted.push(part);
    }
  }

  // Join with commas and spaces, then wrap in **
  let result;
  if (formatted.some(f => f.includes('**('))) {
    // Has exploded dice - don't wrap the whole thing
    result = formatted.join(', ');
  } else {
    // All regular dice - wrap in **
    result = `${formatted.join(', ')}`;
  }

  return { formattedDice: result, droppedDice: droppedDescription };
}

/**
 * Create embed for R2 parser results
 * @param {string} expression - Dice expression
 * @param {Object} result - R2 evaluation result
 * @returns {EmbedBuilder}
 */
export function createR2ResultEmbed(expression, result) {
  const diceIcon = getRandomDiceIcon();

  const embed = new EmbedBuilder()
    .setColor(DICE_COLOR)
    .setDescription(`\`${expression}\``)
    .setThumbnail(diceIcon.url)
    .setFooter({
      text: diceIcon.footer,
      iconURL: diceIcon.url
    });

  // Check if this is multiple rolls (result.rolls is an array of RollResult objects)
  if (result.rolls && Array.isArray(result.rolls) && result.rolls.length > 1 && result.rolls[0].value !== undefined) {
    // Multiple rolls - format each roll individually
    const rollsValue = result.rolls.map((roll) => {
      if (roll.description) {
        const { formattedDice, droppedDice } = formatR2Dice(roll.description);
        let line = `**${roll.value}** ← **[** ${formattedDice} **]**`;
        if (droppedDice) {
          line += ` ~~*( ${droppedDice} )*~~`;
        }
        return line;
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
  } else {
    // Single roll
    let rollValue;
    if (result.description) {
      // Has dice rolls - format as: **10** ← **[ **3, 5, 2** ]**
      // or with exploding: **21** ← **[** **( 6💥,6💥, 2 )**, 3, 4** ]**
      const { formattedDice, droppedDice } = formatR2Dice(result.description);
      rollValue = `**${result.value}** ← **[** ${formattedDice} **]**`;
      if (droppedDice) {
        rollValue += ` ~~*( ${droppedDice} )*~~`;
      }
    } else {
      // Just a value
      rollValue = `${result.value}`;
    }

    embed.addFields({
      name: '__Roll__',
      value: rollValue,
      inline: false
    });
  }

  return embed;
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
