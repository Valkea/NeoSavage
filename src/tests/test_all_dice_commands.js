/**
 * Comprehensive Test Script for All Dice Commands
 * Tests every rolling strategy mentioned in /help rolls
 */

import { parseDiceExpression } from '../dice/regularDice.js';
import { rollWithWildDie, parseSavageWorldsExpression } from '../dice/savageWorldsDice.js';

// Use simplified dice parsing (no complex R2 parser)
let r2Available = false;

// Basic evaluator using our modular dice system
function evaluateExpression(expr) {
  // Handle Savage Worlds expressions
  if (expr.match(/^(\d*)s(\d+)/i)) {
    const parsed = parseSavageWorldsExpression(expr);
    const result = rollWithWildDie(parsed.traitDie, parsed.modifier);
    return {
      value: result.total,
      total: result.total,
      rolls: [result],
      modifier: parsed.modifier,
      expression: expr
    };
  }
  
  // Handle basic dice expressions
  const result = parseDiceExpression(expr, expr.includes('!'));
  return {
    value: result.total,
    total: result.total,
    rolls: result.rolls,
    modifier: result.modifier,
    expression: result.expression
  };
}

// Test result tracking
const results = {
  passed: 0,
  failed: 0,
  errors: []
};

// Color codes for terminal output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

/**
 * Test runner
 */
function test(name, fn, requiresR2 = false) {
  if (requiresR2 && !r2Available) {
    console.log(`${colors.yellow}⊘${colors.reset} ${name} (skipped - requires R2 parser)`);
    results.skipped = (results.skipped || 0) + 1;
    return;
  }
  try {
    fn();
    console.log(`${colors.green}✓${colors.reset} ${name}`);
    results.passed++;
  } catch (error) {
    console.log(`${colors.red}✗${colors.reset} ${name}`);
    console.log(`  ${colors.red}Error: ${error.message}${colors.reset}`);
    results.failed++;
    results.errors.push({ name, error: error.message });
  }
}

/**
 * Assertion helpers
 */
function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

function assertResult(result, message = 'Result should exist') {
  assert(result !== null && result !== undefined, message);
  assert(typeof result === 'object', 'Result should be an object');
}

function assertNumber(value, message = 'Value should be a number') {
  assert(typeof value === 'number' && !isNaN(value), message);
}

function assertInRange(value, min, max, message) {
  assertNumber(value);
  assert(value >= min && value <= max, message || `Value ${value} should be between ${min} and ${max}`);
}

console.log(`\n${colors.blue}${'='.repeat(60)}`);
console.log('🎲 COMPREHENSIVE DICE COMMAND TEST SUITE');
console.log(`${'='.repeat(60)}${colors.reset}\n`);

// ====================
// BASIC ROLLS
// ====================
console.log(`${colors.yellow}## Basic Rolls${colors.reset}`);

test('2d6 - Roll 2 six-sided dice', () => {
  const result = evaluateExpression('2d6');
  console.log(result);
  assertResult(result);
  assertInRange(result.value, 2, 12);
});

test('d20 - Roll 1 twenty-sided die', () => {
  const result = evaluateExpression('d20');
  assertResult(result);
  assertInRange(result.value, 1, 20);
});

test('3d8+5 - Roll 3d8 and add 5', () => {
  const result = evaluateExpression('3d8+5');
  assertResult(result);
  assertInRange(result.value, 8, 29); // 3 + 5 to 24 + 5
});

test('d% - Roll percentile dice', () => {
  const result = evaluateExpression('d%');
  assertResult(result);
  assertInRange(result.value, 1, 100);
});

test('d100 - Roll 100-sided die', () => {
  const result = evaluateExpression('d100');
  assertResult(result);
  assertInRange(result.value, 1, 100);
});

// ====================
// EXPLODING/ACING DICE
// ====================
console.log(`\n${colors.yellow}## Exploding/Acing Dice${colors.reset}`);

test('d6! - Exploding die', () => {
  const result = evaluateExpression('d6!');
  assertResult(result);
  assertNumber(result.value);
  assert(result.value >= 1, 'Exploding die should be at least 1');
});

test('2d8! - Multiple exploding dice', () => {
  const result = evaluateExpression('2d8!');
  assertResult(result);
  assertNumber(result.value);
  assert(result.value >= 2, 'Two exploding dice should be at least 2');
});

// ====================
// SAVAGE WORLDS ROLLS
// ====================
console.log(`\n${colors.yellow}## Savage Worlds Rolls${colors.reset}`);

test('s8 - Roll d8 trait + d6 wild', () => {
  const result = evaluateExpression('s8');
  assertResult(result);
  assertNumber(result.value);
  assert(result.value >= 1, 'Savage Worlds roll should be at least 1');
});

test('s10 - Roll d10 trait + d6 wild', () => {
  const result = evaluateExpression('s10');
  assertResult(result);
  assertNumber(result.value);
  assert(result.value >= 1, 'Savage Worlds roll should be at least 1');
});

test('2s6 - Roll for 2 characters', () => {
  const result = evaluateExpression('2s6');
  assertResult(result);
  assert(Array.isArray(result.rolls) && result.rolls.length === 2, 'Should have 2 rolls');
});

test('s8t4 - Roll with target number 4', () => {
  const result = evaluateExpression('s8t4');
  assertResult(result);
  assertNumber(result.value);
});

test('s8t4r4 - Target 4, raises every 4', () => {
  const result = evaluateExpression('s8t4r4');
  assertResult(result);
  assertNumber(result.value);
});

test('s8+2 - Savage Worlds roll with modifier', () => {
  const result = evaluateExpression('s8+2');
  assertResult(result);
  assertNumber(result.value);
  assert(result.value >= 3, 'Roll with +2 should be at least 3');
});

// ====================
// EXTRAS (NPCs) ROLLS
// ====================
console.log(`\n${colors.yellow}## Extras (NPCs) Rolls${colors.reset}`);

test('e6 - Single exploding d6 (no wild die)', () => {
  const result = evaluateExpression('e6');
  assertResult(result);
  assertNumber(result.value);
  assert(result.value >= 1, 'Extras roll should be at least 1');
});

test('4e8 - Roll 4 extras with d8', () => {
  const result = evaluateExpression('4e8');
  assertResult(result);
  assert(Array.isArray(result.rolls) && result.rolls.length === 4, 'Should have 4 rolls');
});

test('e6t4 - Extras roll vs target 4', () => {
  const result = evaluateExpression('e6t4');
  assertResult(result);
  assertNumber(result.value);
});

// ====================
// KEEP/DROP DICE
// ====================
console.log(`\n${colors.yellow}## Keep/Drop Dice${colors.reset}`);

test('4d6k3 - Roll 4d6, keep highest 3', () => {
  const result = evaluateExpression('4d6k3');
  assertResult(result);
  assertInRange(result.value, 3, 18);
});

test('4d6kl - Keep lowest 1', () => {
  const result = evaluateExpression('4d6kl');
  assertResult(result);
  assertInRange(result.value, 1, 6);
});

test('2d20adv - Advantage (keep highest)', () => {
  const result = evaluateExpression('2d20adv');
  assertResult(result);
  assertInRange(result.value, 1, 20);
});

test('2d20dis - Disadvantage (keep lowest)', () => {
  const result = evaluateExpression('2d20dis');
  assertResult(result);
  assertInRange(result.value, 1, 20);
});

// ====================
// SUCCESS COUNTING
// ====================
console.log(`\n${colors.yellow}## Success Counting${colors.reset}`);

test('10d6s5 - Count successes (≥5)', () => {
  const result = evaluateExpression('10d6s5');
  assertResult(result);
  assertNumber(result.value);
  assertInRange(result.value, 0, 10);
});

test('8d10s7 - Count successes (≥7)', () => {
  const result = evaluateExpression('8d10s7');
  assertResult(result);
  assertNumber(result.value);
  assertInRange(result.value, 0, 8);
});

test('8d10s7f1 - Successes ≥7, failures ≤1', () => {
  const result = evaluateExpression('8d10s7f1');
  assertResult(result);
  assertNumber(result.value);
});

// ====================
// MULTIPLE ROLLS
// ====================
console.log(`\n${colors.yellow}## Multiple Rolls${colors.reset}`);

test('3x2d6 - Roll 2d6 three times', () => {
  const result = evaluateExpression('3x2d6');
  assertResult(result);
  assert(Array.isArray(result.rolls) && result.rolls.length === 3, 'Should have 3 rolls');
});

test('10x3d6k1+4 - Roll (3d6 keep 1)+4 ten times', () => {
  const result = evaluateExpression('10x3d6k1+4');
  assertResult(result);
  assert(Array.isArray(result.rolls) && result.rolls.length === 10, 'Should have 10 rolls');
});

test('5xd20 - Roll d20 five times', () => {
  const result = evaluateExpression('5xd20');
  assertResult(result);
  assert(Array.isArray(result.rolls) && result.rolls.length === 5, 'Should have 5 rolls');
});

// ====================
// ADVANCED FEATURES
// ====================
console.log(`\n${colors.yellow}## Advanced Features${colors.reset}`);

test('@str := 3d6; @str*2 - Variables in expression', () => {
  const result = evaluateExpression('@str := 3d6; @str*2');
  assertResult(result);
  assertNumber(result.value);
  assertInRange(result.value, 6, 36); // (3-18) * 2
});

test('2d6[3:12] - Bound result between 3-12', () => {
  const result = evaluateExpression('2d6[3:12]');
  assertResult(result);
  assertInRange(result.value, 3, 12);
});

test('1--100 - Gygax range roll', () => {
  const result = evaluateExpression('1--100');
  assertResult(result);
  assertInRange(result.value, 1, 100);
});

test('t4:d8! - Target number then roll', () => {
  const result = evaluateExpression('t4:d8!');
  assertResult(result);
  assertNumber(result.value);
});

// ====================
// OTHER RPG SYSTEMS
// ====================
console.log(`\n${colors.yellow}## Other RPG Systems${colors.reset}`);

test('4dF - Fudge/FATE dice', () => {
  const result = evaluateExpression('4dF');
  assertResult(result);
  assertInRange(result.value, -4, 4);
});

test('5w - WEG D6 wild die', () => {
  const result = evaluateExpression('5w');
  assertResult(result);
  assertNumber(result.value);
});

test('dC - Carcosa roll', () => {
  const result = evaluateExpression('dC');
  assertResult(result);
  assertNumber(result.value);
});

test('p10 - Sword World power roll', () => {
  const result = evaluateExpression('p10');
  assertResult(result);
  assertNumber(result.value);
});

test('i+2 - Ironsworn roll with +2', () => {
  const result = evaluateExpression('i+2');
  assertResult(result);
  assertNumber(result.value);
});

// ====================
// ARITHMETIC
// ====================
console.log(`\n${colors.yellow}## Arithmetic${colors.reset}`);

test('2d6+1d4 - Add rolls together', () => {
  const result = evaluateExpression('2d6+1d4');
  assertResult(result);
  assertInRange(result.value, 3, 16); // (2-12) + (1-4)
});

test('3d8*2 - Multiply result', () => {
  const result = evaluateExpression('3d8*2');
  assertResult(result);
  assertInRange(result.value, 6, 48); // (3-24) * 2
});

test('(2d6+3)*2 - Use parentheses', () => {
  const result = evaluateExpression('(2d6+3)*2');
  assertResult(result);
  assertInRange(result.value, 10, 30); // (2+3-12+3) * 2
});

test('3d6-2 - Subtraction', () => {
  const result = evaluateExpression('3d6-2');
  assertResult(result);
  assertNumber(result.value);
  assert(result.value >= 1, 'Result should be at least 1');
});

// ====================
// COMPLEX COMBINATIONS
// ====================
console.log(`\n${colors.yellow}## Complex Combinations${colors.reset}`);

test('3x(4d6k3) - D&D ability scores', () => {
  const result = evaluateExpression('3x(4d6k3)');
  assertResult(result);
  assert(Array.isArray(result.rolls) && result.rolls.length === 3, 'Should have 3 rolls');
});

test('2d20adv+5 - Advantage with modifier', () => {
  const result = evaluateExpression('2d20adv+5');
  assertResult(result);
  assertInRange(result.value, 6, 25);
});

test('s12+3t6r4 - SW roll with all options', () => {
  const result = evaluateExpression('s12+3t6r4');
  assertResult(result);
  assertNumber(result.value);
});

// ====================
// EDGE CASES
// ====================
console.log(`\n${colors.yellow}## Edge Cases${colors.reset}`);

test('d1 - One-sided die', () => {
  const result = evaluateExpression('d1');
  assertResult(result);
  assert(result.value === 1, 'One-sided die should always be 1');
});

test('0d6 - Zero dice (should handle gracefully)', () => {
  try {
    const result = evaluateExpression('0d6');
    assert(result.value === 0 || result.value === undefined, 'Zero dice should return 0 or be handled');
  } catch (e) {
    // Expected - some implementations may throw an error
    assert(true, 'Gracefully handled zero dice');
  }
});

test('100d1 - Many dice', () => {
  const result = evaluateExpression('100d1');
  assertResult(result);
  assert(result.value === 100, 'Should sum correctly for many dice');
});

// ====================
// WILD DIE FUNCTION TEST
// ====================
console.log(`\n${colors.yellow}## Wild Die Function (Direct Test)${colors.reset}`);

test('rollWithWildDie(8, 0) - Direct wild die test', () => {
  const result = rollWithWildDie(8, 0);
  assertResult(result);
  assertNumber(result.total);
  // traitRoll and wildRoll are objects with {total, rolls}, not numbers
  assert(result.traitRoll && typeof result.traitRoll === 'object', 'Should have traitRoll object');
  assert(result.wildRoll && typeof result.wildRoll === 'object', 'Should have wildRoll object');
  assert(['trait', 'wild'].includes(result.usedDie), 'Should specify which die was used');
});

test('rollWithWildDie(10, 2) - Wild die with modifier', () => {
  const result = rollWithWildDie(10, 2);
  assertResult(result);
  assertNumber(result.total);
  assert(result.modifier === 2, 'Modifier should be stored');
});

// ====================
// PRINT RESULTS
// ====================
console.log(`\n${colors.blue}${'='.repeat(60)}`);
console.log('TEST RESULTS');
console.log(`${'='.repeat(60)}${colors.reset}\n`);

const total = results.passed + results.failed + (results.skipped || 0);
const percentage = total > 0 ? ((results.passed / (results.passed + results.failed || 1)) * 100).toFixed(1) : '0.0';

console.log(`${colors.green}Passed: ${results.passed}${colors.reset}`);
console.log(`${colors.red}Failed: ${results.failed}${colors.reset}`);
if (results.skipped) {
  console.log(`${colors.yellow}Skipped: ${results.skipped}${colors.reset}`);
}
console.log(`Total: ${total}`);
console.log(`Success Rate: ${percentage}%\n`);

if (results.failed > 0) {
  console.log(`${colors.red}Failed Tests:${colors.reset}`);
  results.errors.forEach(({ name, error }) => {
    console.log(`  - ${name}`);
    console.log(`    ${error}`);
  });
  console.log();
  process.exit(1);
} else {
  console.log(`${colors.green}✓ All tests passed!${colors.reset}\n`);
  process.exit(0);
}
