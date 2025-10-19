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
 * Convert R2 Savage Worlds result to wildResult format
 * @param {object} swR2Result - R2 evaluator result with trait/wild properties
 * @returns {object} - {wildResult, targetNumber, raiseInterval}
 */
export function createWildResultFromR2(swR2Result) {
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

  return { wildResult, targetNumber, raiseInterval };
}