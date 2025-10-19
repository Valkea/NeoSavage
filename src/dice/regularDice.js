/**
 * Regular dice rolling utilities for standard RPG dice
 */

/**
 * Roll a single die
 * @param {number} sides - Number of sides on the die
 * @returns {number} - Result of the roll
 */
export function rollDie(sides) {
  return Math.floor(Math.random() * sides) + 1;
}

/**
 * Roll a die with "acing" (exploding dice) - reroll and add on max value
 * Returns a nested structure where each explosion creates a nextRoll
 * @param {number} sides - Number of sides on the die
 * @param {number} maxAces - Maximum number of times to ace (default 100)
 * @returns {object} - Nested die structure {value, exploded, nextRoll, total}
 */
export function rollAcingDie(sides, maxAces = 100) {
  const firstRoll = rollDie(sides);

  // Build nested structure recursively
  function buildNestedRoll(currentRoll, acesLeft) {
    const exploded = currentRoll === sides && acesLeft > 0;

    const die = {
      value: currentRoll,
      exploded: exploded,
      nextRoll: null,
      total: currentRoll
    };

    if (exploded) {
      const nextValue = rollDie(sides);
      die.nextRoll = buildNestedRoll(nextValue, acesLeft - 1);
      die.total += die.nextRoll.total;
    }

    return die;
  }

  return buildNestedRoll(firstRoll, maxAces);
}

/**
 * Parse and roll a dice expression (e.g., "2d6+3", "d8", "3d10-2")
 * @param {string} expression - Dice expression to parse
 * @param {boolean} acing - Whether to use acing/exploding dice
 * @returns {object} - {total, rolls, expression, breakdown}
 */
export function parseDiceExpression(expression, acing = false) {
  // Remove spaces
  expression = expression.toLowerCase().replace(/\s/g, '');

  // Match pattern: [count]d[sides][+/-modifier]
  const match = expression.match(/^(\d*)d(\d+)([+-]\d+)?$/);

  if (!match) {
    throw new Error(`Invalid dice expression: ${expression}`);
  }

  const count = parseInt(match[1] || '1');
  const sides = parseInt(match[2]);
  const modifier = match[3] ? parseInt(match[3]) : 0;

  if (sides < 2) {
    throw new Error('Die must have at least 2 sides');
  }

  if (count < 1 || count > 100) {
    throw new Error('Dice count must be between 1 and 100');
  }

  const rolls = [];
  let total = 0;

  for (let i = 0; i < count; i++) {
    if (acing) {
      const result = rollAcingDie(sides);
      rolls.push(result);
      total += result.total;
    } else {
      const roll = rollDie(sides);
      rolls.push(roll);
      total += roll;
    }
  }

  total += modifier;

  return {
    total,
    rolls,
    modifier,
    expression,
    breakdown: formatBreakdown(rolls, modifier, acing)
  };
}

/**
 * Format breakdown of rolls for display
 */
function formatBreakdown(rolls, modifier, acing) {
  let breakdown = '';

  if (acing) {
    const parts = rolls.map(r => {
      if (r.rolls && r.rolls.length > 1) {
        return `[${r.rolls.join('+')}=${r.total}]`;
      }
      return r.total || r;
    });
    breakdown = parts.join(' + ');
  } else {
    breakdown = rolls.join(' + ');
  }

  if (modifier !== 0) {
    const sign = modifier > 0 ? '+' : '';
    breakdown += ` ${sign}${modifier}`;
  }

  return breakdown;
}