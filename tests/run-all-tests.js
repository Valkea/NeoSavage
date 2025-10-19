#!/usr/bin/env node
/**
 * Comprehensive test runner for all dice expression tests
 * Runs all test suites and provides detailed reporting
 */

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Test suites to run
const testSuites = [
  {
    name: 'Normalize Expression Tests',
    file: 'normalize-expression.test.js',
    description: 'Tests for expression normalization and modifier reordering'
  },
  {
    name: 'Parser Integration Tests',
    file: 'parser-integration.test.js',
    description: 'Tests for parser with normalized expressions'
  }
];

// Color codes for output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function colorize(text, color) {
  return `${color}${text}${colors.reset}`;
}

// Run a single test suite
function runTestSuite(suite) {
  return new Promise((resolve, reject) => {
    const testPath = join(__dirname, suite.file);

    console.log('\n' + '='.repeat(80));
    console.log(colorize(`Running: ${suite.name}`, colors.cyan));
    console.log(colorize(suite.description, colors.bright));
    console.log('='.repeat(80));

    const startTime = Date.now();
    const child = spawn('node', [testPath], {
      stdio: 'inherit',
      cwd: __dirname
    });

    child.on('close', (code) => {
      const duration = ((Date.now() - startTime) / 1000).toFixed(2);

      if (code === 0) {
        console.log(colorize(`\n✓ ${suite.name} passed in ${duration}s`, colors.green));
        resolve({ suite: suite.name, passed: true, duration });
      } else {
        console.log(colorize(`\n✗ ${suite.name} failed in ${duration}s`, colors.red));
        resolve({ suite: suite.name, passed: false, duration });
      }
    });

    child.on('error', (error) => {
      console.error(colorize(`\n✗ Error running ${suite.name}:`, colors.red), error);
      reject(error);
    });
  });
}

// Main test runner
async function runAllTests() {
  console.log(colorize('\n🎲 Dice Expression Test Suite', colors.bright + colors.blue));
  console.log(colorize('Starting comprehensive test execution...', colors.bright));

  const results = [];
  const overallStartTime = Date.now();

  // Run each test suite sequentially
  for (const suite of testSuites) {
    try {
      const result = await runTestSuite(suite);
      results.push(result);
    } catch (error) {
      results.push({ suite: suite.name, passed: false, error: error.message });
    }
  }

  // Calculate overall statistics
  const totalDuration = ((Date.now() - overallStartTime) / 1000).toFixed(2);
  const passedCount = results.filter(r => r.passed).length;
  const failedCount = results.length - passedCount;

  // Print final summary
  console.log('\n' + '='.repeat(80));
  console.log(colorize('OVERALL TEST SUMMARY', colors.bright + colors.blue));
  console.log('='.repeat(80));

  results.forEach(result => {
    const icon = result.passed ? '✓' : '✗';
    const color = result.passed ? colors.green : colors.red;
    const duration = result.duration ? ` (${result.duration}s)` : '';
    console.log(colorize(`${icon} ${result.suite}${duration}`, color));
  });

  console.log('='.repeat(80));
  console.log(colorize(`Total Suites: ${results.length}`, colors.bright));
  console.log(colorize(`Passed: ${passedCount}`, colors.green));
  console.log(colorize(`Failed: ${failedCount}`, failedCount > 0 ? colors.red : colors.green));
  console.log(colorize(`Total Duration: ${totalDuration}s`, colors.bright));
  console.log('='.repeat(80));

  // Exit with appropriate code
  if (failedCount > 0) {
    console.log(colorize('\n❌ Some tests failed!', colors.red));
    process.exit(1);
  } else {
    console.log(colorize('\n✨ All tests passed!', colors.green));
    process.exit(0);
  }
}

// Handle errors
process.on('unhandledRejection', (error) => {
  console.error(colorize('\n💥 Unhandled error:', colors.red), error);
  process.exit(1);
});

// Run the tests
runAllTests().catch(error => {
  console.error(colorize('\n💥 Fatal error:', colors.red), error);
  process.exit(1);
});
