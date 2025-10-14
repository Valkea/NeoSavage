/**
 * R2 Dice Expression Evaluator
 * Implements visitor pattern for ANTLR4-generated parser
 *
 * IMPORTANT: You must generate the parser first!
 * Run: npm run generate-parser
 *
 * This will create the parser files in ./parser/ directory
 */

import antlr4 from 'antlr4';
// Parser imports - available after running npm run generate-parser
import R2Lexer from './parser/R2Lexer.js';
import R2Parser from './parser/R2Parser.js';
import R2Visitor from './parser/R2Visitor.js';
// Import dice rolling utilities from shared module
import { rollDie, rollAcingDie } from './diceUtils.js';

/**
 * Roll result class
 */
export class RollResult {
  constructor(value, description = '', rolls = []) {
    this.value = value;
    this.description = description;
    this.rolls = rolls;
  }

  toString() {
    if (this.description) {
      return `${this.value} (${this.description})`;
    }
    return this.value.toString();
  }
}

/**
 * R2 Expression Evaluator Visitor
 * Implements the visitor pattern for evaluating R2 dice expressions
 */
export class R2EvaluatorVisitor extends R2Visitor {
  constructor() {
    super();
    this.variables = new Map(); // Variable storage
  }

  // ========== Statement Visitors ==========

  // Visit command element (top level)
  visitCommandElement(ctx) {
    const statements = ctx.statement();
    const results = statements.map(stmt => this.visit(stmt));

    // Return last result or combine multiple results
    if (results.length === 1) {
      return results[0];
    }

    return new RollResult(
      results.reduce((sum, r) => sum + r.value, 0),
      results.map((r, i) => `[${i+1}] ${r.toString()}`).join('\n'),
      results
    );
  }

  // Roll once statement: just evaluate the expression
  visitRollOnceStmt(ctx) {
    return this.visit(ctx.e);
  }

  // Roll multiple times statement: Nx[expression]
  visitRollTimesStmt(ctx) {
    const times = parseInt(ctx.n.getText());
    const results = [];

    for (let i = 0; i < times; i++) {
      const result = this.visit(ctx.e);
      results.push(result);
    }

    const total = results.reduce((sum, r) => sum + r.value, 0);

    // Build detailed description showing individual rolls and their calculations
    const descriptions = results.map((r, i) => {
      // If we have a description (like from keep/drop operations), show it
      if (r.description) {
        return `  Roll ${i+1}: ${r.description} → ${r.value}`;
      }
      // Otherwise just show the value
      return `  Roll ${i+1}: ${r.value}`;
    }).join('\n');

    return new RollResult(
      total,
      `${times}x rolls:\n${descriptions}\nTotal: ${total}`,
      results
    );
  }

  // Roll batch times: Nx[expression1; expression2; ...]
  visitRollBatchTimesStmt(ctx) {
    const times = parseInt(ctx.n.getText());
    const batchElements = ctx.batchElement();
    const allResults = [];

    for (let i = 0; i < times; i++) {
      const batchResults = batchElements.map(elem => {
        const comment = elem.comment ? elem.comment.text : null;
        const result = this.visit(elem.e);
        return { result, comment };
      });
      allResults.push(batchResults);
    }

    const total = allResults.flat().reduce((sum, {result}) => sum + result.value, 0);
    return new RollResult(total, `Batch ${times} times`, allResults);
  }

  // Savage Worlds extras roll statement: Ne6, 4e8, etc.
  visitRollSavageWorldsExtraStmt(ctx) {
    const count = parseInt(ctx.n.getText());
    const traitDie = parseInt(ctx.t1.getText());

    const results = [];
    for (let i = 0; i < count; i++) {
      const roll = rollAcingDie(traitDie);
      results.push(roll);
    }

    // Apply modifier if present
    let total = results.reduce((sum, r) => sum + r.total, 0);
    let desc = results.map(r => this.formatAcingRoll(r)).join(', ');

    if (ctx.additiveModifier()) {
      const modCtx = ctx.additiveModifier();
      const modifier = this.visit(modCtx.em);
      const op = modCtx.op.text;
      total = op === '+' ? total + modifier.value : total - modifier.value;
      desc += ` ${op} ${modifier.value}`;
    }

    // Handle target number if present
    const tnCtx = ctx.targetNumberAndRaiseStep();
    if (tnCtx) {
      return this.applyTargetNumberMultiple(results, tnCtx, total);
    }

    return new RollResult(total, desc, results);
  }

  // IronSworn roll statement
  visitIronSwornRollStmt(ctx) {
    // IronSworn: roll 1d6 action die + modifier vs 2d10 challenge dice
    const actionDie = rollDie(6);
    const challenge1 = rollDie(10);
    const challenge2 = rollDie(10);

    let actionTotal = actionDie;
    if (ctx.additiveModifier()) {
      const modCtx = ctx.additiveModifier();
      const modifier = this.visit(modCtx.em);
      actionTotal = modCtx.op.text === '+' ? actionTotal + modifier.value : actionTotal - modifier.value;
    }

    const hits = [challenge1, challenge2].filter(c => actionTotal > c).length;
    const match = challenge1 === challenge2;

    let result;
    if (hits === 2) result = match ? 'Strong Hit (Match!)' : 'Strong Hit';
    else if (hits === 1) result = match ? 'Weak Hit (Match!)' : 'Weak Hit';
    else result = match ? 'Miss (Match!)' : 'Miss';

    return new RollResult(
      actionTotal,
      `Action: ${actionTotal} vs Challenge: ${challenge1}, ${challenge2} → ${result}`
    );
  }

  // Flag statement
  visitFlagStmt(ctx) {
    const flag = ctx.flag.text;
    return new RollResult(0, `Flag: ${flag}`);
  }

  // ========== Expression Visitors ==========

  // Visit expression node
  visitExpression(ctx) {
    // Dispatch to specific expression type
    return this.visit(ctx);
  }

  // Generic roll: XdY[!][k/kl/adv/dis][s/f][t/r]
  visitGenericRollExpr(ctx) {
    const rollCtx = ctx.genericRoll();
    const count = rollCtx.t1 ? parseInt(rollCtx.t1.getText()) : 1;
    const sidesText = rollCtx.t2.getText();
    const sides = sidesText === '%' ? 100 : parseInt(sidesText);
    const acing = rollCtx.excl !== null;

    let rolls = [];
    let total = 0;

    // Roll the dice
    for (let i = 0; i < count; i++) {
      if (acing) {
        const result = rollAcingDie(sides);
        rolls.push(result);
        total += result.total;
      } else {
        const roll = rollDie(sides);
        rolls.push({ total: roll, rolls: [roll] });
        total += roll;
      }
    }

    // Handle suffixes (keep, success/fail, target number)
    const suffix = rollCtx.genericRollSuffix();
    if (suffix) {
      return this.applyGenericSuffix(rolls, total, suffix, sides);
    }

    return new RollResult(total, this.formatRolls(rolls), rolls);
  }

  // Savage Worlds roll: s8, s8w6, s12w6
  visitSavageWorldsRollExpr(ctx) {
    const rollCtx = ctx.savageWorldsRoll();
    const count = rollCtx.t1 ? parseInt(rollCtx.t1.getText()) : 1;
    const traitDie = parseInt(rollCtx.t2.getText());
    const wildDie = rollCtx.t3 ? parseInt(rollCtx.t3.getText()) : 6;

    const results = [];

    for (let i = 0; i < count; i++) {
      const trait = rollAcingDie(traitDie);
      const wild = rollAcingDie(wildDie);

      const bestRoll = Math.max(trait.total, wild.total);
      results.push({
        trait,
        wild,
        result: bestRoll,
        usedDie: trait.total >= wild.total ? 'trait' : 'wild'
      });
    }

    // Handle target number if present
    const tnCtx = rollCtx.targetNumberAndRaiseStep();
    if (tnCtx) {
      return this.applyTargetNumber(results, tnCtx);
    }

    if (results.length === 1) {
      const r = results[0];
      const desc = `trait: ${this.formatAcingRoll(r.trait)}, wild: ${this.formatAcingRoll(r.wild)} → ${r.result}`;
      return new RollResult(r.result, desc);
    }

    const total = results.reduce((sum, r) => sum + r.result, 0);
    const desc = results.map(r => r.result).join(', ');
    return new RollResult(total, desc, results);
  }

  // Savage Worlds extras roll: e6, 4e8
  visitSavageWorldsExtrasRollExpr(ctx) {
    const rollCtx = ctx.savageWorldsExtrasRoll();
    const traitDie = parseInt(rollCtx.t1.getText());

    const result = rollAcingDie(traitDie);

    // Handle target number if present
    const tnCtx = rollCtx.targetNumberAndRaiseStep();
    if (tnCtx) {
      return this.applyTargetNumberSingle(result.total, tnCtx);
    }

    return new RollResult(result.total, this.formatAcingRoll(result));
  }

  // Fudge dice: dF, 4dF
  visitFudgeRollExpr(ctx) {
    const rollCtx = ctx.fudgeRoll();
    const count = rollCtx.t ? parseInt(rollCtx.t.getText()) : 4;

    const fudgeValues = [-1, -1, 0, 0, 1, 1]; // Standard fudge die
    let total = 0;
    const rolls = [];

    for (let i = 0; i < count; i++) {
      const value = fudgeValues[Math.floor(Math.random() * fudgeValues.length)];
      total += value;
      rolls.push(value);
    }

    const symbols = rolls.map(v => v === -1 ? '−' : v === 0 ? '0' : '+').join(' ');
    return new RollResult(total, `[${symbols}] = ${total}`);
  }

  // WEG D6: 5W (5d6 with wild die)
  visitWegD6RollExpr(ctx) {
    const rollCtx = ctx.wegD6Roll();
    const count = parseInt(rollCtx.t.getText());

    let total = 0;
    const rolls = [];
    let wildDieValue = null;

    // Roll regular dice
    for (let i = 0; i < count - 1; i++) {
      const roll = rollDie(6);
      rolls.push(roll);
      total += roll;
    }

    // Roll wild die (explodes on 6)
    wildDieValue = rollAcingDie(6);
    total += wildDieValue.total;

    const desc = `Regular: [${rolls.join(', ')}], Wild: ${this.formatAcingRoll(wildDieValue)}`;
    return new RollResult(total, desc);
  }

  // Arithmetic operations
  visitInfixExpr1(ctx) {
    const left = this.visit(ctx.e1);
    const right = this.visit(ctx.e2);
    const op = ctx.op.text;

    let result;
    if (op === '*') result = left.value * right.value;
    else if (op === '/') result = Math.floor(left.value / right.value);
    else if (op === '%') result = left.value % right.value;

    return new RollResult(result, `${left.value} ${op} ${right.value}`);
  }

  visitInfixExpr2(ctx) {
    const left = this.visit(ctx.e1);
    const right = this.visit(ctx.e2);
    const op = ctx.op.text;

    const result = op === '+' ? left.value + right.value : left.value - right.value;

    // Preserve detailed description from left side (e.g., from keep operations)
    if (left.description) {
      return new RollResult(result, `${left.description} ${op} ${right.value}`, left.rolls);
    }

    return new RollResult(result, `${left.value} ${op} ${right.value}`);
  }

  visitPrefixExpr(ctx) {
    const expr = this.visit(ctx.e1);
    const op = ctx.op.text;

    const result = op === '-' ? -expr.value : expr.value;
    return new RollResult(result, `${op}${expr.value}`);
  }

  // Variable assignment: @hp := 2d6+10
  visitAssignExpr(ctx) {
    const varName = ctx.v.text;
    const result = this.visit(ctx.e1);

    this.variables.set(varName, result.value);
    return result;
  }

  // Bounded expression: 2d6[3:10]
  visitBoundedExpr(ctx) {
    const result = this.visit(ctx.e1);
    const min = ctx.e2 ? this.visit(ctx.e2).value : null;
    const max = ctx.e3 ? this.visit(ctx.e3).value : null;

    let bounded = result.value;
    if (min !== null && bounded < min) bounded = min;
    if (max !== null && bounded > max) bounded = max;

    return new RollResult(bounded, `${result.value} bounded [${min}:${max}]`);
  }

  // Gygax range: 1--100 (equivalent to 1d100)
  visitGygaxRangeRollExpr(ctx) {
    const min = parseInt(ctx.g0.text);
    const max = parseInt(ctx.g1.text);

    const result = min + Math.floor(Math.random() * (max - min + 1));
    return new RollResult(result, `${min}--${max}`);
  }

  // Term evaluation
  visitTermExpr(ctx) {
    return this.visit(ctx.t);
  }

  visitIntTerm(ctx) {
    const value = parseInt(ctx.i.text);
    return new RollResult(value);
  }

  visitVarTerm(ctx) {
    const varName = ctx.v.text;
    const value = this.variables.get(varName) || 0;
    return new RollResult(value, varName);
  }

  visitExprTerm(ctx) {
    return this.visit(ctx.e);
  }

  // Helper methods
  formatRolls(rolls) {
    return rolls.map(r => this.formatAcingRoll(r)).join(', ');
  }

  formatAcingRoll(roll) {
    if (roll.rolls && roll.rolls.length > 1) {
      return `[${roll.rolls.join('+')}]=${roll.total}`;
    }
    return roll.total.toString();
  }

  applyGenericSuffix(rolls, total, suffix, sides) {
    // Handle RollAndKeepSuffix
    if (suffix.constructor.name === 'RollAndKeepSuffixContext') {
      const op = suffix.op.text.toLowerCase();
      const keepCount = suffix.n ? parseInt(suffix.n.getText()) : 1;

      if (op === 'k' || op === 'adv') {
        // Keep highest
        const sorted = [...rolls].sort((a, b) => b.total - a.total);
        const kept = sorted.slice(0, keepCount);
        const dropped = sorted.slice(keepCount);
        const keptTotal = kept.reduce((sum, r) => sum + r.total, 0);

        // Format: 💀[dropped] 🎲[kept] = total
        const droppedStr = dropped.length > 0 ? `💀[${dropped.map(r => r.total).join(', ')}]` : '';
        const keptStr = `🎲[${kept.map(r => r.total).join(', ')}]`;

        return new RollResult(
          keptTotal,
          `${droppedStr}${keptStr}`,
          { kept, dropped, all: rolls }
        );
      } else if (op === 'kl' || op === 'dis') {
        // Keep lowest
        const sorted = [...rolls].sort((a, b) => a.total - b.total);
        const kept = sorted.slice(0, keepCount);
        const dropped = sorted.slice(keepCount);
        const keptTotal = kept.reduce((sum, r) => sum + r.total, 0);

        // Format: 💀[dropped] 🎲[kept] = total
        const droppedStr = dropped.length > 0 ? `💀[${dropped.map(r => r.total).join(', ')}]` : '';
        const keptStr = `🎲[${kept.map(r => r.total).join(', ')}]`;

        return new RollResult(
          keptTotal,
          `${droppedStr}${keptStr}`,
          { kept, dropped, all: rolls }
        );
      }
    }

    // Handle SuccessOrFailSuffix1 and SuccessOrFailSuffix2
    if (suffix.constructor.name.includes('SuccessOrFailSuffix')) {
      const successTarget = parseInt(suffix.sn.getText());
      const failTarget = suffix.fn ? parseInt(suffix.fn.getText()) : null;

      const successes = rolls.filter(r => r.total >= successTarget).length;
      const failures = failTarget ? rolls.filter(r => r.total <= failTarget).length : 0;

      let desc = `Successes (≥${successTarget}): ${successes}`;
      if (failTarget) {
        desc += `, Failures (≤${failTarget}): ${failures}`;
      }

      return new RollResult(successes, desc, { rolls, successes, failures });
    }

    // Handle TargetNumberAndRaiseStepSuffix
    if (suffix.constructor.name === 'TargetNumberAndRaiseStepSuffixContext') {
      const tnCtx = suffix.targetNumberAndRaiseStep();
      return this.applyTargetNumberSingle(total, tnCtx);
    }

    // Default: just return total
    return new RollResult(total, this.formatRolls(rolls), rolls);
  }

  applyTargetNumber(results, tnCtx) {
    // Extract target number and raise step
    let targetNum = 4;  // Default for Savage Worlds
    let raiseStep = 4;  // Default raise step

    if (tnCtx.tt) targetNum = parseInt(tnCtx.tt.getText());
    if (tnCtx.tr) raiseStep = parseInt(tnCtx.tr.getText());
    if (tnCtx.tnr) {
      targetNum = parseInt(tnCtx.tnr.getText());
      raiseStep = targetNum;
    }
    if (tnCtx.tgtn) targetNum = parseInt(tnCtx.tgtn.getText());

    // Calculate success/failure with raises
    const result = results[0];
    const total = result.result || result.total;
    const margin = total - targetNum;
    const success = margin >= 0;
    const raises = success ? Math.floor(margin / raiseStep) : 0;

    let desc = result.usedDie
      ? `Trait: ${this.formatAcingRoll(result.trait)}, Wild: ${this.formatAcingRoll(result.wild)} → ${total}`
      : `Roll: ${total}`;

    if (success) {
      desc += raises > 0 ? ` - Success with ${raises} raise${raises > 1 ? 's' : ''}!` : ' - Success!';
    } else {
      desc += ` - Failed by ${Math.abs(margin)}`;
    }

    return new RollResult(total, desc, { ...result, success, raises, margin });
  }

  applyTargetNumberSingle(value, tnCtx) {
    // Extract target number and raise step
    let targetNum = 4;
    let raiseStep = 4;

    if (tnCtx.tt) targetNum = parseInt(tnCtx.tt.getText());
    if (tnCtx.tr) raiseStep = parseInt(tnCtx.tr.getText());
    if (tnCtx.tnr) {
      targetNum = parseInt(tnCtx.tnr.getText());
      raiseStep = targetNum;
    }
    if (tnCtx.tgtn) targetNum = parseInt(tnCtx.tgtn.getText());

    const margin = value - targetNum;
    const success = margin >= 0;
    const raises = success ? Math.floor(margin / raiseStep) : 0;

    let desc = success
      ? (raises > 0 ? `Success with ${raises} raise${raises > 1 ? 's' : ''}! (${value} vs TN ${targetNum})` : `Success! (${value} vs TN ${targetNum})`)
      : `Failed by ${Math.abs(margin)} (${value} vs TN ${targetNum})`;

    return new RollResult(value, desc, { success, raises, margin });
  }

  applyTargetNumberMultiple(rolls, tnCtx, total) {
    // For multiple rolls with target number
    let targetNum = 4;
    let raiseStep = 4;

    if (tnCtx.tt) targetNum = parseInt(tnCtx.tt.getText());
    if (tnCtx.tr) raiseStep = parseInt(tnCtx.tr.getText());
    if (tnCtx.tnr) {
      targetNum = parseInt(tnCtx.tnr.getText());
      raiseStep = targetNum;
    }
    if (tnCtx.tgtn) targetNum = parseInt(tnCtx.tgtn.getText());

    const margin = total - targetNum;
    const success = margin >= 0;
    const raises = success ? Math.floor(margin / raiseStep) : 0;

    let desc = `Rolls: [${rolls.map(r => r.total).join(', ')}] = ${total}`;
    desc += success
      ? (raises > 0 ? ` - Success with ${raises} raise${raises > 1 ? 's' : ''}!` : ' - Success!')
      : ` - Failed by ${Math.abs(margin)}`;

    return new RollResult(total, desc, { rolls, success, raises, margin });
  }
}

/**
 * Parse and evaluate a dice expression
 * @param {string} expression - The dice expression to evaluate
 * @returns {RollResult} - The result of the evaluation
 */
export function evaluateExpression(expression) {
  try {
    const chars = new antlr4.InputStream(expression);
    const lexer = new R2Lexer(chars);
    const tokens = new antlr4.CommonTokenStream(lexer);
    const parser = new R2Parser(tokens);

    // Build error listener for better error messages
    parser.removeErrorListeners();
    parser.addErrorListener({
      syntaxError: (_recognizer, _offendingSymbol, _line, column, msg) => {
        throw new Error(`Syntax error at position ${column}: ${msg}`);
      }
    });

    const tree = parser.commandElement();
    const evaluator = new R2EvaluatorVisitor();
    return evaluator.visit(tree);
  } catch (error) {
    // Provide helpful error message
    if (error.message && error.message.includes('Cannot find module')) {
      throw new Error('Parser not generated yet. Run: npm run generate-parser');
    }
    // Re-throw with more context
    throw error;
  }
}
