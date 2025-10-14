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
// Parser imports will be available after running npm run generate-parser
// import R2Lexer from './parser/R2Lexer.js';
// import R2Parser from './parser/R2Parser.js';
// import R2Visitor from './parser/R2Visitor.js';

/**
 * Dice rolling utilities
 */
function rollDie(sides) {
  return Math.floor(Math.random() * sides) + 1;
}

function rollAcingDie(sides, maxAces = 100) {
  const rolls = [];
  let total = 0;
  let aces = 0;

  while (aces < maxAces) {
    const roll = rollDie(sides);
    rolls.push(roll);
    total += roll;

    if (roll < sides) break;
    aces++;
  }

  return { total, rolls };
}

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
 *
 * NOTE: This is a placeholder implementation that will work once the parser is generated.
 * After running `npm run generate-parser`, uncomment the imports and this visitor will work.
 */
export class R2EvaluatorVisitor /* extends R2Visitor */ {
  constructor() {
    // super();
    this.variables = new Map(); // Variable storage
  }

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
    // Implement keep highest/lowest, advantage/disadvantage, success counting
    // This is a simplified version - full implementation would handle all suffix types
    return new RollResult(total, this.formatRolls(rolls), rolls);
  }

  applyTargetNumber(results, tnCtx) {
    // Implement target number and raise step calculation
    // Return success/failure with raises
    return new RollResult(results[0].result);
  }

  applyTargetNumberSingle(value, tnCtx) {
    // Implement target number for single roll
    return new RollResult(value);
  }
}

/**
 * Parse and evaluate a dice expression
 * @param {string} expression - The dice expression to evaluate
 * @returns {RollResult} - The result of the evaluation
 */
export function evaluateExpression(expression) {
  // This function will work after generating the parser
  // For now, it's a placeholder that falls back to basic parsing

  try {
    // TODO: Uncomment after running npm run generate-parser
    /*
    const chars = new antlr4.InputStream(expression);
    const lexer = new R2Lexer(chars);
    const tokens = new antlr4.CommonTokenStream(lexer);
    const parser = new R2Parser(tokens);

    const tree = parser.commandElement();
    const evaluator = new R2EvaluatorVisitor();
    return evaluator.visit(tree);
    */

    // Fallback to basic parsing for now
    throw new Error('Parser not generated yet. Run: npm run generate-parser');
  } catch (error) {
    throw new Error(`Failed to evaluate expression: ${error.message}`);
  }
}
