/**
 * Integration tests for parser with normalized expressions
 * Validates that normalized expressions can be successfully parsed and evaluated
 */

import { strict as assert } from 'assert';
import { evaluateExpression } from '../src/r2Evaluator.js';

// Test counter for reporting
let testsPassed = 0;
let testsFailed = 0;

function test(description, fn) {
  try {
    fn();
    testsPassed++;
    console.log(`✓ ${description}`);
  } catch (error) {
    testsFailed++;
    console.error(`✗ ${description}`);
    console.error(`  ${error.message}`);
    if (error.stack) {
      console.error(`  ${error.stack.split('\n').slice(1, 3).join('\n')}`);
    }
  }
}

function describe(description, fn) {
  console.log(`\n${description}`);
  fn();
}

// Helper function to check if result has expected structure
function assertRollResult(result, expectedType) {
  assert(result !== null, 'Result should not be null');
  assert(result.value !== undefined, 'Result should have a value property');
  if (expectedType) {
    assert.equal(result.rollType, expectedType, `Result should be of type ${expectedType}`);
  }
}

// ============================================================================
// Test Suite: Basic Dice Expression Parsing
// ============================================================================

describe('Basic Dice Expression Parsing', () => {
  test('should parse simple dice rolls', () => {
    const result = evaluateExpression('2d6');
    assertRollResult(result, 'generic');
    assert(result.value >= 2 && result.value <= 12, 'Result should be within valid range');
    assert.equal(result.dice.length, 2, 'Should have 2 dice');
  });

  test('should parse single die rolls', () => {
    const result = evaluateExpression('d20');
    assertRollResult(result, 'generic');
    assert(result.value >= 1 && result.value <= 20, 'Result should be within valid range');
    assert.equal(result.dice.length, 1, 'Should have 1 die');
  });

  test('should parse dice with modifiers', () => {
    const result = evaluateExpression('2d6+3');
    assertRollResult(result, 'generic');
    assert(result.value >= 5 && result.value <= 15, 'Result should be within valid range');
    assert.equal(result.modifier, 3, 'Modifier should be 3');
  });

  test('should parse dice with negative modifiers', () => {
    const result = evaluateExpression('2d6-2');
    assertRollResult(result, 'generic');
    assert(result.value >= 0 && result.value <= 10, 'Result should be within valid range');
    assert.equal(result.modifier, -2, 'Modifier should be -2');
  });

  test('should parse percentage dice', () => {
    const result = evaluateExpression('d%');
    assertRollResult(result, 'generic');
    assert(result.value >= 1 && result.value <= 100, 'Result should be within valid range');
  });
});

// ============================================================================
// Test Suite: Explosion/Acing Parsing
// ============================================================================

describe('Explosion/Acing Parsing', () => {
  test('should parse exploding dice', () => {
    const result = evaluateExpression('2d6!');
    assertRollResult(result, 'generic');
    assert(result.value >= 2, 'Result should be at least 2');
    assert.equal(result.dice.length, 2, 'Should have 2 dice');
    // At least one die might have exploded (check structure)
    result.dice.forEach(die => {
      assert(die.value !== undefined, 'Die should have a value');
      assert(die.total !== undefined, 'Die should have a total');
    });
  });

  test('should parse exploding dice with modifiers', () => {
    const result = evaluateExpression('3d6!+5');
    assertRollResult(result, 'generic');
    assert.equal(result.modifier, 5, 'Modifier should be 5');
    assert(result.value >= 8, 'Result should be at least 8');
  });

  test('should parse exploding dice with keep', () => {
    const result = evaluateExpression('5d20!k2');
    assertRollResult(result, 'generic');
    assert.equal(result.dice.length, 5, 'Should have 5 dice');
    assert.equal(result.droppedDice.length, 3, 'Should have 3 dropped dice');
  });
});

// ============================================================================
// Test Suite: Keep/Drop Parsing
// ============================================================================

describe('Keep/Drop Parsing', () => {
  test('should parse keep highest', () => {
    const result = evaluateExpression('4d6k3');
    assertRollResult(result, 'generic');
    assert.equal(result.dice.length, 4, 'Should have 4 dice');
    assert.equal(result.droppedDice.length, 1, 'Should have 1 dropped die');
    assert.equal(result.keepOperation, 'highest', 'Should be keep highest operation');
  });

  test('should parse keep lowest', () => {
    const result = evaluateExpression('4d6kl1');
    assertRollResult(result, 'generic');
    assert.equal(result.dice.length, 4, 'Should have 4 dice');
    assert.equal(result.droppedDice.length, 3, 'Should have 3 dropped dice');
    assert.equal(result.keepOperation, 'lowest', 'Should be keep lowest operation');
  });

  test('should parse advantage', () => {
    const result = evaluateExpression('2d20adv');
    assertRollResult(result, 'generic');
    assert.equal(result.dice.length, 2, 'Should have 2 dice');
    assert.equal(result.droppedDice.length, 1, 'Should have 1 dropped die');
    assert.equal(result.keepOperation, 'advantage', 'Should be advantage operation');
  });

  test('should parse disadvantage', () => {
    const result = evaluateExpression('2d20dis');
    assertRollResult(result, 'generic');
    assert.equal(result.dice.length, 2, 'Should have 2 dice');
    assert.equal(result.droppedDice.length, 1, 'Should have 1 dropped die');
    assert.equal(result.keepOperation, 'disadvantage', 'Should be disadvantage operation');
  });

  test('should parse keep with modifiers', () => {
    const result = evaluateExpression('4d6k3+2');
    assertRollResult(result, 'generic');
    assert.equal(result.modifier, 2, 'Modifier should be 2');
    assert.equal(result.droppedDice.length, 1, 'Should have 1 dropped die');
  });
});

// ============================================================================
// Test Suite: Savage Worlds Parsing
// ============================================================================

describe('Savage Worlds Parsing', () => {
  test('should parse basic Savage Worlds roll', () => {
    const result = evaluateExpression('s8');
    assertRollResult(result, 'savageWild');
    assert(result.value >= 1, 'Result should be at least 1');
    assert(result.traitDie !== undefined, 'Should have trait die');
    assert(result.wildDie !== undefined, 'Should have wild die');
    assert(result.usedDie === 'trait' || result.usedDie === 'wild', 'Should indicate which die was used');
  });

  test('should parse Savage Worlds with wild die size', () => {
    const result = evaluateExpression('s10w8');
    assertRollResult(result, 'savageWild');
    assert(result.traitDie !== undefined, 'Should have trait die');
    assert(result.wildDie !== undefined, 'Should have wild die');
  });

  test('should parse Savage Worlds with modifier', () => {
    const result = evaluateExpression('s8+2');
    assertRollResult(result, 'savageWild');
    assert.equal(result.modifier, 2, 'Modifier should be 2');
    // Result should be base roll + modifier
    assert(result.value >= 3, 'Result should be at least 3 (min 1 + 2)');
  });

  test('should parse Savage Worlds with target number', () => {
    const result = evaluateExpression('s8t4');
    assertRollResult(result, 'savageWild');
    assert.equal(result.targetNumber, 4, 'Target number should be 4');
    assert(result.raises !== undefined, 'Should have raises calculation');
    assert.equal(result.raises.success, result.value >= 4, 'Success should match target');
  });

  test('should parse Savage Worlds with raise interval', () => {
    const result = evaluateExpression('s8r4');
    assertRollResult(result, 'savageWild');
    assert.equal(result.raiseInterval, 4, 'Raise interval should be 4');
    assert(result.raises !== undefined, 'Should have raises calculation');
  });

  test('should parse Savage Worlds with target and raise', () => {
    const result = evaluateExpression('s8t6r4');
    assertRollResult(result, 'savageWild');
    assert.equal(result.targetNumber, 6, 'Target number should be 6');
    assert.equal(result.raiseInterval, 4, 'Raise interval should be 4');
    assert(result.raises !== undefined, 'Should have raises calculation');
  });

  test('should parse normalized Savage Worlds expression', () => {
    // Normalized: s8t5r2+3
    const result = evaluateExpression('s8t5r2+3');
    assertRollResult(result, 'savageWild');
    assert.equal(result.targetNumber, 5, 'Target number should be 5');
    assert.equal(result.raiseInterval, 2, 'Raise interval should be 2');
    assert.equal(result.modifier, 3, 'Modifier should be 3');
  });

  test('should parse multiple Savage Worlds rolls', () => {
    const result = evaluateExpression('2s8');
    assertRollResult(result, 'multiple');
    assert.equal(result.rolls.length, 2, 'Should have 2 rolls');
    result.rolls.forEach(roll => {
      assert.equal(roll.rollType, 'savageWild', 'Each roll should be a Savage Worlds roll');
    });
  });
});

// ============================================================================
// Test Suite: Repeat Expression Parsing
// ============================================================================

describe('Repeat Expression Parsing', () => {
  test('should parse repeat with basic dice', () => {
    const result = evaluateExpression('3x2d6');
    assertRollResult(result, 'multiple');
    assert.equal(result.rolls.length, 3, 'Should have 3 rolls');
    result.rolls.forEach(roll => {
      assert(roll.value >= 2 && roll.value <= 12, 'Each roll should be valid');
    });
  });

  test('should parse repeat with modifiers', () => {
    const result = evaluateExpression('2x3d6+2');
    assertRollResult(result, 'multiple');
    assert.equal(result.rolls.length, 2, 'Should have 2 rolls');
  });

  test('should parse repeat with keep', () => {
    const result = evaluateExpression('3x4d6k3');
    assertRollResult(result, 'multiple');
    assert.equal(result.rolls.length, 3, 'Should have 3 rolls');
    result.rolls.forEach(roll => {
      if (roll.droppedDice) {
        assert.equal(roll.droppedDice.length, 1, 'Each roll should drop 1 die');
      }
    });
  });

  test('should parse repeat with explosion', () => {
    const result = evaluateExpression('2x3d6!');
    assertRollResult(result, 'multiple');
    assert.equal(result.rolls.length, 2, 'Should have 2 rolls');
  });

  test('should parse repeat with Savage Worlds', () => {
    const result = evaluateExpression('3xs8');
    assertRollResult(result, 'multiple');
    assert.equal(result.rolls.length, 3, 'Should have 3 rolls');
    result.rolls.forEach(roll => {
      assert.equal(roll.rollType, 'savageWild', 'Each roll should be a Savage Worlds roll');
    });
  });

  test('should parse repeat with complex Savage Worlds', () => {
    const result = evaluateExpression('2xs8t4r2+3');
    assertRollResult(result, 'multiple');
    assert.equal(result.rolls.length, 2, 'Should have 2 rolls');
    result.rolls.forEach(roll => {
      assert.equal(roll.targetNumber, 4, 'Each roll should have target 4');
      assert.equal(roll.raiseInterval, 2, 'Each roll should have raise interval 2');
    });
  });
});

// ============================================================================
// Test Suite: Complex Normalized Expressions
// ============================================================================

describe('Complex Normalized Expressions', () => {
  test('should parse normalized: explosion + keep + modifier', () => {
    const result = evaluateExpression('5d20!k2+3');
    assertRollResult(result, 'generic');
    assert.equal(result.modifier, 3, 'Modifier should be 3');
    assert.equal(result.droppedDice.length, 3, 'Should drop 3 dice');
  });

  test('should parse normalized: repeat + explosion + keep + modifier', () => {
    const result = evaluateExpression('2x5d20!k2+3');
    assertRollResult(result, 'multiple');
    assert.equal(result.rolls.length, 2, 'Should have 2 rolls');
  });

  test('should parse normalized: Savage Worlds full complexity', () => {
    const result = evaluateExpression('s10t5r2+3');
    assertRollResult(result, 'savageWild');
    assert.equal(result.targetNumber, 5, 'Target should be 5');
    assert.equal(result.raiseInterval, 2, 'Raise interval should be 2');
    assert.equal(result.modifier, 3, 'Modifier should be 3');
  });

  test('should parse normalized: repeat + Savage Worlds full complexity', () => {
    const result = evaluateExpression('3xs8t4r2+2');
    assertRollResult(result, 'multiple');
    assert.equal(result.rolls.length, 3, 'Should have 3 rolls');
    result.rolls.forEach(roll => {
      assert.equal(roll.targetNumber, 4, 'Target should be 4');
      assert.equal(roll.raiseInterval, 2, 'Raise interval should be 2');
    });
  });
});

// ============================================================================
// Test Suite: Target Number and Raises
// ============================================================================

describe('Target Number and Raises', () => {
  test('should parse and calculate raises for generic dice', () => {
    const result = evaluateExpression('2d6t4');
    assertRollResult(result, 'generic');
    assert.equal(result.targetNumber, 4, 'Target should be 4');
    assert(result.raises !== undefined, 'Should have raises calculation');
    assert.equal(result.raises.success, result.value >= 4, 'Success should be correct');
  });

  test('should parse generic dice with target and raise interval', () => {
    const result = evaluateExpression('3d8t5r3');
    assertRollResult(result, 'generic');
    assert.equal(result.targetNumber, 5, 'Target should be 5');
    assert.equal(result.raiseInterval, 3, 'Raise interval should be 3');
  });

  test('should calculate raises correctly for Savage Worlds', () => {
    // Mock a high roll by running multiple times and checking structure
    const result = evaluateExpression('s12t4r4');
    assertRollResult(result, 'savageWild');
    assert(result.raises !== undefined, 'Should have raises');
    assert(result.raises.success !== undefined, 'Should have success flag');
    assert(result.raises.raises !== undefined, 'Should have raise count');
    assert(result.raises.margin !== undefined, 'Should have margin');
  });
});

// ============================================================================
// Test Suite: Edge Cases and Error Handling
// ============================================================================

describe('Edge Cases and Error Handling', () => {
  test('should handle minimum valid dice', () => {
    const result = evaluateExpression('d2');
    assertRollResult(result, 'generic');
    assert(result.value >= 1 && result.value <= 2, 'Result should be 1 or 2');
  });

  test('should handle maximum reasonable dice counts', () => {
    const result = evaluateExpression('10d6');
    assertRollResult(result, 'generic');
    assert.equal(result.dice.length, 10, 'Should have 10 dice');
  });

  test('should handle zero modifiers', () => {
    const result = evaluateExpression('2d6+0');
    assertRollResult(result, 'generic');
    assert.equal(result.modifier, 0, 'Modifier should be 0');
  });

  test('should handle large modifiers', () => {
    const result = evaluateExpression('2d6+100');
    assertRollResult(result, 'generic');
    assert.equal(result.modifier, 100, 'Modifier should be 100');
    assert(result.value >= 102, 'Result should be at least 102');
  });

  test('should throw error for invalid expression', () => {
    assert.throws(() => {
      evaluateExpression('invalid');
    }, 'Should throw error for invalid expression');
  });
});

// ============================================================================
// Test Suite: Real-World Scenarios
// ============================================================================

describe('Real-World Scenarios', () => {
  test('should handle D&D advantage', () => {
    const result = evaluateExpression('2d20adv');
    assertRollResult(result, 'generic');
    assert.equal(result.keepOperation, 'advantage', 'Should be advantage');
    assert(result.value >= 1 && result.value <= 20, 'Result should be valid');
  });

  test('should handle D&D disadvantage', () => {
    const result = evaluateExpression('2d20dis');
    assertRollResult(result, 'generic');
    assert.equal(result.keepOperation, 'disadvantage', 'Should be disadvantage');
    assert(result.value >= 1 && result.value <= 20, 'Result should be valid');
  });

  test('should handle D&D stat roll (4d6 keep highest 3)', () => {
    const result = evaluateExpression('4d6k3');
    assertRollResult(result, 'generic');
    assert(result.value >= 3 && result.value <= 18, 'Result should be valid stat range');
  });

  test('should handle Savage Worlds skill check', () => {
    const result = evaluateExpression('s8t4r4');
    assertRollResult(result, 'savageWild');
    assert.equal(result.targetNumber, 4, 'Standard TN is 4');
    assert.equal(result.raiseInterval, 4, 'Standard raise is 4');
  });

  test('should handle Savage Worlds damage roll', () => {
    const result = evaluateExpression('s10+2');
    assertRollResult(result, 'savageWild');
    assert.equal(result.modifier, 2, 'Damage modifier should be 2');
  });

  test('should handle multiple attacks', () => {
    const result = evaluateExpression('3xs8t4');
    assertRollResult(result, 'multiple');
    assert.equal(result.rolls.length, 3, 'Should have 3 attack rolls');
  });
});

// ============================================================================
// Test Suite: Idempotency Tests
// ============================================================================

describe('Idempotency Tests', () => {
  test('normalized expressions should parse consistently', () => {
    const expression = '3d6k2+2';
    const result1 = evaluateExpression(expression);
    const result2 = evaluateExpression(expression);

    // Both should have same structure (not same values due to randomness)
    assert.equal(result1.rollType, result2.rollType, 'Roll types should match');
    assert.equal(result1.dice.length, result2.dice.length, 'Dice counts should match');
    assert.equal(result1.modifier, result2.modifier, 'Modifiers should match');
  });

  test('parser should accept already normalized expressions', () => {
    const normalizedExpressions = [
      '3d6k2+2',
      's8t4r2+3',
      '5d20!k2+5',
      '2x3d6kl2+2',
      '2xs8t2r3+3',
    ];

    normalizedExpressions.forEach(expr => {
      assert.doesNotThrow(() => {
        evaluateExpression(expr);
      }, `Should parse normalized expression: ${expr}`);
    });
  });
});

// ============================================================================
// Run Tests and Report Results
// ============================================================================

console.log('\n' + '='.repeat(80));
console.log('TEST SUMMARY - Parser Integration Tests');
console.log('='.repeat(80));
console.log(`Total Tests: ${testsPassed + testsFailed}`);
console.log(`Passed: ${testsPassed}`);
console.log(`Failed: ${testsFailed}`);
console.log('='.repeat(80));

if (testsFailed > 0) {
  process.exit(1);
} else {
  console.log('\n✨ All integration tests passed!');
  process.exit(0);
}
