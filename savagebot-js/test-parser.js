/**
 * Test script for R2 dice parser
 * Run: node test-parser.js
 */

import { evaluateExpression } from './r2Evaluator.js';

// Test cases
const testCases = [
  // Basic rolls
  '2d6',
  'd20',
  '3d8+5',

  // Acing dice
  'd6!',
  '2d8!',

  // Batch rolls
  '10x2d6',
  '5x3d8+2',

  // Keep highest/lowest
  '4d6k3',
  '2d20adv',
  '2d20dis',

  // Savage Worlds
  's8',
  's10w6',
  '2s6',

  // Extras
  'e6',
  '4e8',

  // Success counting
  '10d6s5',
  '8d10s7f1',

  // Target number and raises
  's8t4',
  's10t6r3',

  // Arithmetic
  '2d6+1d4',
  '3d8*2',

  // Complex expressions
  '4d6k3+5',
  '10x3d6k1+4',
];

console.log('🎲 Testing R2 Dice Parser\n');
console.log('='.repeat(60));

let passed = 0;
let failed = 0;

for (const expression of testCases) {
  try {
    const result = evaluateExpression(expression);
    console.log(`✅ ${expression.padEnd(20)} → ${result.value}${result.description ? ` (${result.description})` : ''}`);
    passed++;
  } catch (error) {
    console.log(`❌ ${expression.padEnd(20)} → ERROR: ${error.message}`);
    failed++;
  }
}

console.log('='.repeat(60));
console.log(`\n📊 Results: ${passed} passed, ${failed} failed out of ${testCases.length} tests`);

if (failed === 0) {
  console.log('🎉 All tests passed!');
} else {
  console.log('⚠️  Some tests failed. Check the parser implementation.');
  process.exit(1);
}
