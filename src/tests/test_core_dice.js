/**
 * Core Dice System Test - Tests the refactored modular dice system
 * Focuses on regular dice, Savage Worlds dice, and initiative system
 */

import { parseDiceExpression, rollDie, rollAcingDie } from '../dice/regularDice.js';
import { rollWithWildDie, calculateRaises, parseSavageWorldsExpression } from '../dice/savageWorldsDice.js';
import { InitiativeTracker } from '../dice/initiativeSystem.js';

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
function test(name, fn) {
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
console.log('🎲 CORE DICE SYSTEM TEST SUITE (REFACTORED)');
console.log(`${'='.repeat(60)}${colors.reset}\n`);

// ====================
// REGULAR DICE TESTS
// ====================
console.log(`${colors.yellow}## Regular Dice System${colors.reset}`);

test('rollDie(6) - Basic die roll', () => {
  const result = rollDie(6);
  assertInRange(result, 1, 6);
});

test('rollAcingDie(6) - Exploding die', () => {
  const result = rollAcingDie(6);
  assertResult(result);
  assertNumber(result.total);
  assert(Array.isArray(result.rolls), 'Should have rolls array');
  assert(result.total >= 1, 'Should be at least 1');
});

test('parseDiceExpression("2d6") - Basic dice expression', () => {
  const result = parseDiceExpression("2d6");
  assertResult(result);
  assertInRange(result.total, 2, 12);
  assert(Array.isArray(result.rolls), 'Should have rolls array');
  assert(result.rolls.length === 2, 'Should have 2 rolls');
});

test('parseDiceExpression("3d8+2") - Dice with modifier', () => {
  const result = parseDiceExpression("3d8+2");
  assertResult(result);
  assertInRange(result.total, 5, 26); // 3*1+2 to 3*8+2
  assert(result.modifier === 2, 'Should have correct modifier');
});

test('parseDiceExpression("d10", true) - Exploding dice', () => {
  const result = parseDiceExpression("d10", true);
  assertResult(result);
  assertNumber(result.total);
  assert(result.total >= 1, 'Should be at least 1');
});

// ====================
// SAVAGE WORLDS TESTS
// ====================
console.log(`\n${colors.yellow}## Savage Worlds Dice System${colors.reset}`);

test('rollWithWildDie(8, 0) - Basic wild die roll', () => {
  const result = rollWithWildDie(8, 0);
  assertResult(result);
  assertNumber(result.total);
  assert(result.traitRoll && typeof result.traitRoll === 'object', 'Should have trait roll');
  assert(result.wildRoll && typeof result.wildRoll === 'object', 'Should have wild roll');
  assert(['trait', 'wild'].includes(result.usedDie), 'Should specify which die was used');
});

test('rollWithWildDie(10, 2) - Wild die with modifier', () => {
  const result = rollWithWildDie(10, 2);
  assertResult(result);
  assertNumber(result.total);
  assert(result.modifier === 2, 'Should store modifier');
  assert(result.total >= 3, 'Should be at least 3 with +2 modifier');
});

test('calculateRaises(12, 4, 4) - Calculate raises', () => {
  const result = calculateRaises(12, 4, 4);
  assertResult(result);
  assert(result.success === true, 'Should be success');
  assert(result.raises === 2, 'Should have 2 raises');
  assert(result.margin === 8, 'Should have margin 8');
  assert(typeof result.description === 'string', 'Should have description');
});

test('calculateRaises(3, 4, 4) - Failed roll', () => {
  const result = calculateRaises(3, 4, 4);
  assertResult(result);
  assert(result.success === false, 'Should be failure');
  assert(result.raises === 0, 'Should have 0 raises');
  assert(result.margin === -1, 'Should have negative margin');
});

test('parseSavageWorldsExpression("s8") - Basic SW expression', () => {
  const result = parseSavageWorldsExpression("s8");
  assertResult(result);
  assert(result.count === 1, 'Should have count 1');
  assert(result.traitDie === 8, 'Should have trait die 8');
  assert(result.modifier === 0, 'Should have no modifier');
  assert(result.targetNumber === 4, 'Should have default TN 4');
});

test('parseSavageWorldsExpression("s10+2t6r3") - Complex SW expression', () => {
  const result = parseSavageWorldsExpression("s10+2t6r3");
  assertResult(result);
  assert(result.count === 1, 'Should have count 1');
  assert(result.traitDie === 10, 'Should have trait die 10');
  assert(result.modifier === 2, 'Should have modifier +2');
  assert(result.targetNumber === 6, 'Should have TN 6');
  assert(result.raiseInterval === 3, 'Should have raise interval 3');
});

test('parseSavageWorldsExpression("2s6") - Multiple SW rolls', () => {
  const result = parseSavageWorldsExpression("2s6");
  assertResult(result);
  assert(result.count === 2, 'Should have count 2');
  assert(result.traitDie === 6, 'Should have trait die 6');
});

// ====================
// INITIATIVE SYSTEM TESTS
// ====================
console.log(`\n${colors.yellow}## Initiative System${colors.reset}`);

test('InitiativeTracker creation and basic functions', () => {
  const tracker = new InitiativeTracker();
  assert(!tracker.isFightActive(), 'Should start inactive');
  assert(tracker.getCurrentRound() === 0, 'Should start at round 0');
  
  tracker.start();
  assert(tracker.isFightActive(), 'Should be active after start');
  
  tracker.end();
  assert(!tracker.isFightActive(), 'Should be inactive after end');
});

test('InitiativeTracker dealCards() - Basic card dealing', () => {
  const tracker = new InitiativeTracker();
  tracker.start();
  
  const results = tracker.dealCards(['Alice', 'Bob']);
  assert(Array.isArray(results), 'Should return array');
  assert(results.length === 2, 'Should have 2 results');
  
  results.forEach(result => {
    assert(typeof result.name === 'string', 'Should have character name');
    assert(result.card && typeof result.card === 'object', 'Should have card object');
    assert(Array.isArray(result.drawnCards), 'Should have drawn cards');
  });
});

test('InitiativeTracker dealCards() with edges', () => {
  const tracker = new InitiativeTracker();
  tracker.start();
  
  const results = tracker.dealCards(['Alice'], { level_headed: true });
  assert(results[0].edges.levelHeaded === true, 'Should store level headed edge');
  assert(results[0].drawnCards.length === 2, 'Should draw 2 cards for level headed');
  assert(results[0].droppedCards.length === 1, 'Should drop 1 card');
});

test('InitiativeTracker getInitiativeOrder()', () => {
  const tracker = new InitiativeTracker();
  tracker.start();
  
  tracker.dealCards(['Alice', 'Bob', 'Charlie']);
  const order = tracker.getInitiativeOrder();
  
  assert(Array.isArray(order), 'Should return array');
  assert(order.length === 3, 'Should have 3 characters');
  
  // Check if properly sorted (higher cards first)
  for (let i = 0; i < order.length - 1; i++) {
    const current = order[i].card;
    const next = order[i + 1].card;
    
    // Higher value should come first, or same value with better suit
    assert(
      current.value > next.value || 
      (current.value === next.value && current.suit !== next.suit),
      'Should be properly sorted by initiative order'
    );
  }
});

test('InitiativeTracker newRound()', () => {
  const tracker = new InitiativeTracker();
  tracker.start();
  
  assert(tracker.getCurrentRound() === 0, 'Should start at round 0');
  
  tracker.newRound();
  assert(tracker.getCurrentRound() === 1, 'Should advance to round 1');
  
  tracker.newRound();
  assert(tracker.getCurrentRound() === 2, 'Should advance to round 2');
});

// ====================
// INTEGRATION TESTS
// ====================
console.log(`\n${colors.yellow}## Integration Tests${colors.reset}`);

test('Complete combat workflow', () => {
  const tracker = new InitiativeTracker();
  
  // Start fight
  tracker.start();
  assert(tracker.isFightActive(), 'Fight should be active');
  
  // Deal cards with various edges
  const results = tracker.dealCards(['Fighter', 'Rogue', 'Mage'], {
    quick: false,
    level_headed: true,
    improved_level_headed: false
  });
  
  assert(results.length === 3, 'Should deal to 3 characters');
  
  // Get initiative order
  const order = tracker.getInitiativeOrder();
  assert(order.length === 3, 'Should have 3 in initiative order');
  
  // Start first round
  tracker.newRound();
  assert(tracker.getCurrentRound() === 1, 'Should be round 1');
  
  // End fight
  tracker.end();
  assert(!tracker.isFightActive(), 'Fight should end');
});

test('Savage Worlds roll with raises calculation', () => {
  const result = rollWithWildDie(8, 2);
  const raises = calculateRaises(result.total, 4, 4);
  
  assertResult(result);
  assertResult(raises);
  assertNumber(result.total);
  assert(typeof raises.success === 'boolean', 'Should have success boolean');
  assert(typeof raises.raises === 'number', 'Should have raises number');
});

// ====================
// PRINT RESULTS
// ====================
console.log(`\n${colors.blue}${'='.repeat(60)}`);
console.log('TEST RESULTS');
console.log(`${'='.repeat(60)}${colors.reset}\n`);

const total = results.passed + results.failed;
const percentage = total > 0 ? ((results.passed / total) * 100).toFixed(1) : '0.0';

console.log(`${colors.green}Passed: ${results.passed}${colors.reset}`);
console.log(`${colors.red}Failed: ${results.failed}${colors.reset}`);
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
  console.log(`${colors.green}✓ All core dice system tests passed!${colors.reset}\n`);
  console.log(`${colors.blue}Note: This test suite covers the refactored modular dice system.${colors.reset}`);
  console.log(`${colors.blue}Complex R2 parser features have been removed for simplicity.${colors.reset}\n`);
  process.exit(0);
}