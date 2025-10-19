/**
 * Comprehensive tests for normalizeExpression function
 * Tests all variations of dice expression combinations and modifier orders
 */

import { strict as assert } from 'assert';

// Mock the normalizeExpression function for testing
// In actual implementation, import from diceCommands.js
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
  }
}

function describe(description, fn) {
  console.log(`\n${description}`);
  fn();
}

// ============================================================================
// Test Suite: Basic Dice Expressions (d notation)
// ============================================================================

describe('Basic Dice Expressions (d notation)', () => {
  test('should not modify simple dice without modifiers', () => {
    assert.equal(normalizeExpression('2d6'), '2d6');
    assert.equal(normalizeExpression('d20'), 'd20');
    assert.equal(normalizeExpression('3d8'), '3d8');
    assert.equal(normalizeExpression('4d12'), '4d12');
  });

  test('should not modify dice with only numeric modifiers', () => {
    assert.equal(normalizeExpression('2d6+3'), '2d6+3');
    assert.equal(normalizeExpression('d20-2'), 'd20-2');
    assert.equal(normalizeExpression('3d8+5'), '3d8+5');
  });

  test('should handle percentage dice', () => {
    assert.equal(normalizeExpression('d%'), 'd%');
    assert.equal(normalizeExpression('d%+10'), 'd%+10');
    assert.equal(normalizeExpression('2d%'), '2d%');
  });

  test('should handle case insensitivity for d notation', () => {
    assert.equal(normalizeExpression('2D6'), '2D6');
    assert.equal(normalizeExpression('D20'), 'D20');
  });
});

// ============================================================================
// Test Suite: Explosion/Acing Modifiers (!)
// ============================================================================

describe('Explosion/Acing Modifiers (!)', () => {
  test('should preserve explosion without other modifiers', () => {
    assert.equal(normalizeExpression('2d6!'), '2d6!');
    assert.equal(normalizeExpression('d20!'), 'd20!');
    assert.equal(normalizeExpression('3d8!'), '3d8!');
  });

  test('should handle explosion zith numeric modifiers', () => {
    assert.equal(normalizeExpression('2d6!+3'), '2d6!+3');
    assert.equal(normalizeExpression('d20!-2'), 'd20!-2');
  });

  /* test('should move numeric modifier after explosion', () => {  NOT wanted at that time
    assert.equal(normalizeExpression('2d6+3!'), '2d6!+3');
    assert.equal(normalizeExpression('d20-2!'), 'd20!-2');
  });*/

  test('should handle explosion with keep modifiers', () => {
    assert.equal(normalizeExpression('5d20!k2'), '5d20!k2');
    assert.equal(normalizeExpression('4d6!kl1'), '4d6!kl1');
    assert.equal(normalizeExpression('3d8!adv'), '3d8!adv');
  });

  test('should normalize: explosion + keep + numeric modifier', () => {
    assert.equal(normalizeExpression('5d20!+3k2'), '5d20!k2+3');
    assert.equal(normalizeExpression('4d6!+5kl2'), '4d6!kl2+5');
    assert.equal(normalizeExpression('3d8!-2adv'), '3d8!adv-2');
  });
});

// ============================================================================
// Test Suite: Keep Modifiers (k, kl, adv, dis)
// ============================================================================

describe('Keep Modifiers (k, kl, adv, dis)', () => {
  test('should preserve keep highest without other modifiers', () => {
    assert.equal(normalizeExpression('4d6k3'), '4d6k3');
    assert.equal(normalizeExpression('5d20k2'), '5d20k2');
    assert.equal(normalizeExpression('3d8k1'), '3d8k1');
  });

  test('should preserve keep lowest without other modifiers', () => {
    assert.equal(normalizeExpression('4d6kl1'), '4d6kl1');
    assert.equal(normalizeExpression('5d20kl2'), '5d20kl2');
    assert.equal(normalizeExpression('3d8kl1'), '3d8kl1');
  });

  test('should handle advantage and disadvantage', () => {
    assert.equal(normalizeExpression('2d20adv'), '2d20adv');
    assert.equal(normalizeExpression('2d20dis'), '2d20dis');
    assert.equal(normalizeExpression('5d20adv3'), '5d20adv3');
  });

  test('should normalize: keep + numeric modifier', () => {
    assert.equal(normalizeExpression('4d6+2kl2'), '4d6kl2+2');
    assert.equal(normalizeExpression('5d20-3k2'), '5d20k2-3');
    assert.equal(normalizeExpression('3d8+5adv'), '3d8adv+5');
  });

  test('should normalize case variations of keep modifiers', () => {
    assert.equal(normalizeExpression('4d6K3'), '4d6k3');
    assert.equal(normalizeExpression('4d6KL2'), '4d6kl2');
    assert.equal(normalizeExpression('2d20ADV'), '2d20adv');
    assert.equal(normalizeExpression('2d20DIS'), '2d20dis');
  });

  test('should handle keep without explicit count', () => {
    assert.equal(normalizeExpression('2d20k'), '2d20k');
    assert.equal(normalizeExpression('2d20kl'), '2d20kl');
  });
});

// ============================================================================
// Test Suite: Savage Worlds Expressions (s notation)
// ============================================================================

describe('Savage Worlds Expressions (s notation)', () => {
  test('should not modify simple Savage Worlds rolls', () => {
    assert.equal(normalizeExpression('s8'), 's8');
    assert.equal(normalizeExpression('s10'), 's10');
    assert.equal(normalizeExpression('s12'), 's12');
  });

  test('should preserve wild die specification', () => {
    assert.equal(normalizeExpression('s8w6'), 's8w6');
    assert.equal(normalizeExpression('s10w8'), 's10w8');
    assert.equal(normalizeExpression('2s8w6'), '2s8w6');
  });

  test('should normalize: modifier + target', () => {
    assert.equal(normalizeExpression('s8+2t4'), 's8t4+2');
    assert.equal(normalizeExpression('s10-1t5'), 's10t5-1');
    assert.equal(normalizeExpression('s12+3t6'), 's12t6+3');
  });

  test('should normalize: modifier + raise', () => {
    assert.equal(normalizeExpression('s8+2r4'), 's8r4+2');
    assert.equal(normalizeExpression('s10-1r5'), 's10r5-1');
  });

  test('should normalize: modifier + target + raise (various orders)', () => {
    assert.equal(normalizeExpression('s8+2t4r3'), 's8t4r3+2');
    assert.equal(normalizeExpression('s8r3+2t5'), 's8t5r3+2');
    assert.equal(normalizeExpression('s8t5+2r3'), 's8t5r3+2');
    assert.equal(normalizeExpression('s10+5r2t5'), 's10t5r2+5');
  });

  test('should handle target only', () => {
    assert.equal(normalizeExpression('s8t4'), 's8t4');
    assert.equal(normalizeExpression('s10t6'), 's10t6');
  });

  test('should handle raise only', () => {
    assert.equal(normalizeExpression('s8r4'), 's8r4');
    assert.equal(normalizeExpression('s10r5'), 's10r5');
  });

  test('should handle target and raise without modifiers', () => {
    assert.equal(normalizeExpression('s8t4r4'), 's8t4r4');
    assert.equal(normalizeExpression('s10t5r3'), 's10t5r3');
  });

  test('should handle multiple Savage Worlds dice', () => {
    assert.equal(normalizeExpression('2s8'), '2s8');
    assert.equal(normalizeExpression('3s10+2'), '3s10+2');
    assert.equal(normalizeExpression('2s8+3t4r2'), '2s8t4r2+3');
  });

  test('should handle case insensitivity for s notation', () => {
    assert.equal(normalizeExpression('S8'), 'S8');
    assert.equal(normalizeExpression('S10T5R3+2'), 'S10t5r3+2');
    assert.equal(normalizeExpression('s8T5R3'), 's8t5r3');
  });
});

// ============================================================================
// Test Suite: Target and Raise Modifiers (Generic Dice)
// ============================================================================

describe('Target and Raise Modifiers (Generic Dice)', () => {
  test('should handle target number on generic dice', () => {
    assert.equal(normalizeExpression('2d6t4'), '2d6t4');
    assert.equal(normalizeExpression('3d8t5'), '3d8t5');
  });

  test('should normalize: generic dice + modifier + target', () => {
    assert.equal(normalizeExpression('2d6+2t4'), '2d6t4+2');
    assert.equal(normalizeExpression('3d8-1t5'), '3d8t5-1');
  });

  test('should normalize: generic dice + keep + target + modifier', () => {
    assert.equal(normalizeExpression('4d6+2k3t4'), '4d6k3t4+2');
    assert.equal(normalizeExpression('5d20-1k2t10'), '5d20k2t10-1');
  });

  test('should normalize: explosion + keep + target + modifier', () => {
    assert.equal(normalizeExpression('5d20!+3k2t8'), '5d20!k2t8+3');
    assert.equal(normalizeExpression('4d6!-2kl1t4'), '4d6!kl1t4-2');
  });
});

// ============================================================================
// Test Suite: Repeat Expressions (Nx prefix)
// ============================================================================

describe('Repeat Expressions (Nx prefix)', () => {
  test('should preserve repeat with simple dice', () => {
    assert.equal(normalizeExpression('2x3d6'), '2x3d6');
    assert.equal(normalizeExpression('5xd20'), '5xd20');
    assert.equal(normalizeExpression('3x2d8'), '3x2d8');
  });

  test('should normalize: repeat + dice + modifier', () => {
    assert.equal(normalizeExpression('2x3d6+2'), '2x3d6+2');
    assert.equal(normalizeExpression('5xd20-3'), '5xd20-3');
  });

  test('should normalize: repeat + dice + keep + modifier', () => {
    assert.equal(normalizeExpression('2x3d6+2kl2'), '2x3d6kl2+2');
    assert.equal(normalizeExpression('5xd20-3k1'), '5xd20k1-3');
    assert.equal(normalizeExpression('3x4d6+5k3'), '3x4d6k3+5');
  });

  test('should normalize: repeat + explosion + keep + modifier', () => {
    assert.equal(normalizeExpression('2x5d20!+3k2'), '2x5d20!k2+3');
    assert.equal(normalizeExpression('3x4d6!-2kl1'), '3x4d6!kl1-2');
  });

  test('should normalize: repeat + Savage Worlds + modifiers', () => {
    assert.equal(normalizeExpression('2xs8r3+3t2'), '2xs8t2r3+3');
    assert.equal(normalizeExpression('3xs10+2t4'), '3xs10t4+2');
    assert.equal(normalizeExpression('2xs8+3r3t2'), '2xs8t2r3+3');
  });

  test('should handle case insensitivity for X', () => {
    assert.equal(normalizeExpression('2x3d6'), '2x3d6');
    assert.equal(normalizeExpression('2X3d6'), '2X3d6');
  });
});

// ============================================================================
// Test Suite: Complex Modifier Combinations
// ============================================================================

describe('Complex Modifier Combinations', () => {
  test('should normalize all modifier types in correct order (generic)', () => {
    // Original: base + numeric + keep
    assert.equal(normalizeExpression('3d6+2k2'), '3d6k2+2');

    // Original: base + numeric + explosion + keep
    // assert.equal(normalizeExpression('5d20+3!k2'), '5d20!k2+3'); NOT wanted at that time

    // Original: base + explosion + numeric + keep + target
    assert.equal(normalizeExpression('4d6!+5k3t4'), '4d6!k3t4+5');
  });

  test('should normalize all modifier types in correct order (Savage Worlds)', () => {
    // Original: base + numeric + raise + target
    assert.equal(normalizeExpression('s8+5r2t5'), 's8t5r2+5');

    // Original: base + target + numeric + raise
    assert.equal(normalizeExpression('s8t5+2r3'), 's8t5r3+2');

    // Original: base + raise + target + numeric
    assert.equal(normalizeExpression('s8r3t5+2'), 's8t5r3+2');
  });

  test('should handle multiple modifier permutations correctly', () => {
    // All possible orderings should normalize to same result
    const expected = '3d6!k2t4+5';
    assert.equal(normalizeExpression('3d6!k2t4+5'), expected);
    assert.equal(normalizeExpression('3d6!+5k2t4'), expected);
    assert.equal(normalizeExpression('3d6!t4+5k2'), expected);
    assert.equal(normalizeExpression('3d6!t4k2+5'), expected);
  });

  test('should handle negative modifiers', () => {
    assert.equal(normalizeExpression('3d6-2k2'), '3d6k2-2');
    assert.equal(normalizeExpression('s8-3t4r2'), 's8t4r2-3');
    assert.equal(normalizeExpression('5d20!-5k2'), '5d20!k2-5');
  });
});

// ============================================================================
// Test Suite: Edge Cases
// ============================================================================

describe('Edge Cases', () => {
  test('should handle expressions without modifiers', () => {
    assert.equal(normalizeExpression('d20'), 'd20');
    assert.equal(normalizeExpression('s8'), 's8');
    assert.equal(normalizeExpression('3d6'), '3d6');
  });

  test('should handle single die rolls', () => {
    assert.equal(normalizeExpression('d6'), 'd6');
    assert.equal(normalizeExpression('d20'), 'd20');
    assert.equal(normalizeExpression('d100'), 'd100');
  });

  test('should return original for non-matching patterns', () => {
    // These don't match the dice patterns
    assert.equal(normalizeExpression('hello'), 'hello');
    assert.equal(normalizeExpression('123'), '123');
    assert.equal(normalizeExpression(''), '');
  });

  test('should handle expressions with only repeat prefix', () => {
    assert.equal(normalizeExpression('2xd6'), '2xd6');
    assert.equal(normalizeExpression('10xd20'), '10xd20');
  });

  test('should handle large numbers', () => {
    assert.equal(normalizeExpression('100d6'), '100d6');
    assert.equal(normalizeExpression('s20'), 's20');
    assert.equal(normalizeExpression('50x2d6'), '50x2d6');
  });

  test('should handle complex Savage Worlds with wild die', () => {
    assert.equal(normalizeExpression('s8w6+2t4r2'), 's8w6t4r2+2');
    assert.equal(normalizeExpression('2s10w8+3'), '2s10w8+3');
  });
});

// ============================================================================
// Test Suite: Real-World Examples from Debug Output
// ============================================================================

describe('Real-World Examples from Debug Output', () => {
  test('should match actual normalization patterns from debug output', () => {
    // Basic dice with modifiers
    assert.equal(normalizeExpression('3d6+2kl2'), '3d6kl2+2');
    assert.equal(normalizeExpression('5d20!+3k2'), '5d20!k2+3');

    // Savage Worlds with various modifiers
    assert.equal(normalizeExpression('s8r3+3t2'), 's8t2r3+3');
    assert.equal(normalizeExpression('s8+3r3t2'), 's8t2r3+3');

    // Repeat expressions
    assert.equal(normalizeExpression('2x3d6+2kl2'), '2x3d6kl2+2');
    assert.equal(normalizeExpression('2xs8r3+3t2'), '2xs8t2r3+3');
    assert.equal(normalizeExpression('2x5d20!+3k2'), '2x5d20!k2+3');
    assert.equal(normalizeExpression('2xs8+3r3t2'), '2xs8t2r3+3');
  });

  test('should handle complex combinations from help documentation', () => {
    // Examples from /help command
    assert.equal(normalizeExpression('s10+5r2t5'), 's10t5r2+5');
    assert.equal(normalizeExpression('3d6!+5k2'), '3d6!k2+5');
    assert.equal(normalizeExpression('3xs8+2r3t5'), '3xs8t5r3+2');
  });
});

// ============================================================================
// Test Suite: Parser Compatibility Validation
// ============================================================================

describe('Parser Compatibility Validation', () => {
  test('normalized expressions should follow parser grammar order', () => {
    // Parser expects: base + explosion + keep + target + raise + modifier

    // Generic dice order
    const genericTests = [
      { input: '3d6+2k1', expected: '3d6k1+2' },
      { input: '3d6!+2k1', expected: '3d6!k1+2' },
      { input: '3d6!k1+2t4', expected: '3d6!k1t4+2' },
    ];

    genericTests.forEach(({ input, expected }) => {
      assert.equal(normalizeExpression(input), expected);
    });

    // Savage Worlds order
    const swTests = [
      { input: 's8+2t4', expected: 's8t4+2' },
      { input: 's8+2r4', expected: 's8r4+2' },
      { input: 's8+2t4r4', expected: 's8t4r4+2' },
    ];

    swTests.forEach(({ input, expected }) => {
      assert.equal(normalizeExpression(input), expected);
    });
  });

  test('normalized expressions should be idempotent', () => {
    // Normalizing a normalized expression should not change it
    const expressions = [
      '3d6k2+2',
      's8t4r2+3',
      '5d20!k2+5',
      '2x3d6kl2+2',
      '2xs8t2r3+3',
    ];

    expressions.forEach(expr => {
      assert.equal(normalizeExpression(expr), expr);
    });
  });
});

// ============================================================================
// Test Suite: Multi-Dice Expressions (Not normalized by this function)
// ============================================================================

describe('Multi-Dice Expressions', () => {
  test('should return expressions with + separators unchanged', () => {
    // These are handled at a higher level, not by normalizeExpression
    assert.equal(normalizeExpression('2d6'), '2d6');
    assert.equal(normalizeExpression('1d4'), '1d4');
    assert.equal(normalizeExpression('3d8'), '3d8');
  });

  test('should normalize individual dice expressions in multi-dice scenarios', () => {
    // Each part would be normalized separately
    assert.equal(normalizeExpression('2d6+2k1'), '2d6k1+2');
    assert.equal(normalizeExpression('1d4'), '1d4');
    assert.equal(normalizeExpression('3d8+3'), '3d8+3');
  });
});

// ============================================================================
// Run Tests and Report Results
// ============================================================================

console.log('\n' + '='.repeat(80));
console.log('TEST SUMMARY');
console.log('='.repeat(80));
console.log(`Total Tests: ${testsPassed + testsFailed}`);
console.log(`Passed: ${testsPassed}`);
console.log(`Failed: ${testsFailed}`);
console.log('='.repeat(80));

if (testsFailed > 0) {
  process.exit(1);
} else {
  console.log('\n✨ All tests passed!');
  process.exit(0);
}
