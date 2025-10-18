/**
 * Savage Worlds dice rolling utilities - Wild Die system
 */

import { rollAcingDie } from './regularDice.js';

/**
 * Roll with Wild Die (Savage Worlds) - roll trait die and d6, keep highest
 * @param {number} traitDie - Size of the trait die (d4, d6, d8, etc.)
 * @param {number} modifier - Modifier to add to the result
 * @param {number} wildDie - Size of the wild die (default d6)
 * @returns {object} - Roll results with both dice
 */
export function rollWithWildDie(traitDie, modifier = 0, wildDie = 6) {
  const trait = rollAcingDie(traitDie);
  const wild = rollAcingDie(wildDie);

  const traitTotal = trait.total + modifier;
  const wildTotal = wild.total + modifier;

  const finalTotal = Math.max(traitTotal, wildTotal);
  const usedDie = traitTotal >= wildTotal ? 'trait' : 'wild';

  return {
    total: finalTotal,
    traitRoll: trait,
    wildRoll: wild,
    modifier,
    usedDie,
    traitTotal,
    wildTotal
  };
}

/**
 * Calculate raises (Savage Worlds mechanic)
 * @param {number} roll - Total roll result
 * @param {number} targetNumber - Target number (default 4)
 * @param {number} raiseInterval - Points needed per raise (default 4)
 * @returns {object} - {success, raises, margin}
 */
export function calculateRaises(roll, targetNumber = 4, raiseInterval = 4) {
  const margin = roll - targetNumber;
  const success = margin >= 0;
  const raises = success ? Math.floor(margin / raiseInterval) : 0;

  return {
    success,
    raises,
    margin,
    description: success
      ? (raises > 0 ? `Success with ${raises} raise${raises > 1 ? 's' : ''}` : 'Success')
      : `Failed by ${Math.abs(margin)}`
  };
}

/**
 * Parse Savage Worlds dice expression (e.g., "s8", "2s6", "s10+2", "s8t6")
 * @param {string} expression - Savage Worlds dice expression
 * @returns {object} - Parsed parameters for SW roll
 */
export function parseSavageWorldsExpression(expression) {
  // Remove spaces
  expression = expression.toLowerCase().replace(/\s/g, '');

  // Pattern: optional count, 's', die size, then modifier/target/raise in any order
  const swMatch = expression.match(/^(\d*)s(\d+)((?:[+-]\d+|t\d+|r\d+)+)?$/i);

  if (!swMatch) {
    throw new Error(`Invalid Savage Worlds expression: ${expression}`);
  }

  const count = swMatch[1] ? parseInt(swMatch[1]) : 1;
  const traitDie = parseInt(swMatch[2]);
  const suffixes = swMatch[3] || '';

  // Extract modifier, target number, and raise interval from suffixes (can be in any order)
  const modMatch = suffixes.match(/([+-]\d+)/);
  const tnMatch = suffixes.match(/t(\d+)/i);
  const raiseMatch = suffixes.match(/r(\d+)/i);

  const modifier = modMatch ? parseInt(modMatch[1]) : 0;
  const targetNumber = tnMatch ? parseInt(tnMatch[1]) : 4; // Default TN=4
  const raiseInterval = raiseMatch ? parseInt(raiseMatch[1]) : 4; // Default raise=4

  return {
    count,
    traitDie,
    modifier,
    targetNumber,
    raiseInterval
  };
}

/**
 * Roll Savage Worlds extras (single exploding die, no wild die)
 * @param {number} dieSides - Size of the die
 * @param {number} modifier - Modifier to add
 * @returns {object} - Roll result for extras
 */
export function rollSavageWorldsExtra(dieSides, modifier = 0) {
  const roll = rollAcingDie(dieSides);
  return {
    total: roll.total + modifier,
    roll: roll,
    modifier
  };
}

/**
 * Check if expression is a Savage Worlds expression
 * @param {string} expression - The dice expression
 * @returns {boolean} - True if it's a Savage Worlds expression
 */
export function isSavageWorldsExpression(expression) {
  return /^(\d*)s(\d+)((?:[+-]\d+|t\d+|r\d+)+)?$/i.test(expression);
}

/**
 * Handle Savage Worlds expression for Discord commands
 * @param {string} expression - The dice expression
 * @param {number} modifier - Additional modifier from command
 * @returns {object|null} - Savage Worlds result or null if not SW expression
 */
export function handleSavageWorldsExpression(expression, modifier = 0) {
  if (!isSavageWorldsExpression(expression)) {
    return null; // Not a Savage Worlds expression
  }

  try {
    // Use existing parser to get the parsed data
    const parsed = parseSavageWorldsExpression(expression);
    const totalModifier = modifier + parsed.modifier;

    // For single roll, return wild die result
    if (parsed.count === 1) {
      const result = rollWithWildDie(parsed.traitDie, totalModifier);
      result.raises = calculateRaises(result.total, parsed.targetNumber, parsed.raiseInterval);

      const displayExpr = `s${parsed.traitDie}${totalModifier !== 0 ? (totalModifier > 0 ? '+' : '') + totalModifier : ''}${parsed.targetNumber !== 4 ? `t${parsed.targetNumber}` : ''}${parsed.raiseInterval !== 4 ? `r${parsed.raiseInterval}` : ''}`;
      
      return {
        isWildDie: true,
        isSingle: true,
        result,
        displayExpr,
        targetNumber: parsed.targetNumber,
        raiseInterval: parsed.raiseInterval
      };
    }

    // For multiple rolls, return info to use with R2 evaluator
    return {
      isWildDie: true,
      isSingle: false,
      count: parsed.count,
      traitDie: parsed.traitDie,
      totalModifier,
      targetNumber: parsed.targetNumber,
      raiseInterval: parsed.raiseInterval,
      originalExpression: expression
    };
  } catch (error) {
    return null; // Invalid SW expression
  }
}