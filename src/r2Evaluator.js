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
const { InputStream, CommonTokenStream } = antlr4;
// Parser imports - available after running npm run generate-parser
import R2Lexer from './parser/R2Lexer.js';
import R2Parser from './parser/R2Parser.js';
import R2Visitor from './parser/R2Visitor.js';
// Import dice rolling utilities from shared module
import { rollDie, rollAcingDie } from './dice/regularDice.js';

/**
 * Base class for all roll results
 */
export class RollResult {
  constructor(value) {
    this.value = value;
  }

  toString() {
    return this.value.toString();
  }
}

/**
 * Generic dice roll result (2d6, 3d8!, 4d6k3, etc.)
 */
export class GenericRollResult extends RollResult {
  constructor(value, dice, modifier = null, droppedDice = [], keepOperation = null) {
    super(value);
    this.rollType = 'generic';
    this.dice = dice;              // Array of nested die structures (NestedRollResult)
    this.modifier = modifier;       // Numeric modifier (can be + or -)
    this.droppedDice = droppedDice; // Array of dropped dice
    this.keepOperation = keepOperation; // 'highest', 'lowest', 'advantage', 'disadvantage'
  }
}

/**
 * Savage Worlds wild die roll result (s8, s8+2t4r4)
 */
export class SavageWildRollResult extends RollResult {
  constructor(value, traitDie, wildDie, usedDie, modifier = 0, targetNumber = null, raiseInterval = null, raises = null) {
    super(value);
    this.rollType = 'savageWild';
    this.traitDie = traitDie;       // Nested die structure (NestedRollResult)
    this.wildDie = wildDie;         // Nested die structure (NestedRollResult)
    this.usedDie = usedDie;         // 'trait' or 'wild'
    this.modifier = modifier;       // Numeric modifier
    this.targetNumber = targetNumber;
    this.raiseInterval = raiseInterval;
    this.raises = raises;           // {success, raises, margin, description}
  }
}

/**
 * Multiple rolls (2xs8+2t4r4)
 */
export class MultipleRollsResult extends RollResult {
  constructor(value, rolls, modifier = 0, targetNumber = null, raiseInterval = null) {
    super(value);
    this.rollType = 'multiple';
    this.rolls = rolls;             // Array of SavageWildRollResult or GenericRollResult
  }
}


/**
 * Simple value result (for arithmetic, variables, etc.)
 */
export class SimpleValueResult extends RollResult {
  constructor(value, description = '') {
    super(value);
    this.rollType = 'simple';
    this.description = description;
  }

  toString() {
    return this.description || super.toString();
  }
}

/**
 * Success/Fail counting result
 */
export class SuccessFailRollResult extends RollResult {
  constructor(value, dice, successes, failures, successTarget, failTarget = null) {
    super(value);
    this.rollType = 'successFail';
    this.dice = dice;
    this.successes = successes;
    this.failures = failures;
    this.successTarget = successTarget;
    this.failTarget = failTarget;
  }
}

/**
 * R2 Expression Evaluator Visitor
 * Implements the visitor pattern for evaluating R2 dice expressions
 * Internal class - not exported, used by evaluateExpression
 */
class R2EvaluatorVisitor extends R2Visitor {
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
    const rolls = [];

    for (let i = 0; i < times; i++) {
      const result = this.visit(ctx.e);
      rolls.push(result);
    }

    const total = rolls.reduce((sum, r) => sum + r.value, 0);

    return new MultipleRollsResult(total, rolls);
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
    const traitDieSize = parseInt(ctx.t1.getText());

    // Extract modifier if present
    let modifier = 0;
    if (ctx.additiveModifier()) {
      const modCtx = ctx.additiveModifier();
      const modValue = this.visit(modCtx.em);
      const op = modCtx.op.text;
      modifier = op === '+' ? modValue.value : -modValue.value;
    }

    // Extract target number and raise step if present
    const tnCtx = ctx.targetNumberAndRaiseStep();
    let targetNumber = null;
    let raiseInterval = null;

    if (tnCtx) {
      targetNumber = tnCtx.tt ? parseInt(tnCtx.tt.getText()) : 4;
      raiseInterval = tnCtx.tr ? parseInt(tnCtx.tr.getText()) : 4;
      if (tnCtx.tnr) {
        targetNumber = parseInt(tnCtx.tnr.getText());
        raiseInterval = targetNumber;
      }
      if (tnCtx.tgtn) targetNumber = parseInt(tnCtx.tgtn.getText());
    }

    const dice = [];
    for (let i = 0; i < count; i++) {
      const die = rollAcingDie(traitDieSize);
      dice.push(die);
    }

    const baseTotal = dice.reduce((sum, die) => sum + die.total, 0);
    const total = baseTotal + modifier;

    return new RollResult(total, {
      rollType: 'savageExtras',
      dice: dice,
      modifier: modifier,
      targetNumber: targetNumber,
      raiseInterval: raiseInterval
    });
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

    const dice = [];

    // Roll the dice with nested structure
    for (let i = 0; i < count; i++) {
      if (acing) {
        const die = rollAcingDie(sides);
        dice.push(die);
      } else {
        const value = rollDie(sides);
        dice.push({
          value: value,
          exploded: false,
          nextRoll: null,
          total: value
        });
      }
    }

    // Handle suffixes (keep, success/fail, target number)
    const suffix = rollCtx.genericRollSuffix();
    if (suffix) {
      return this.applyGenericSuffix(dice, suffix, sides);
    }

    // Calculate total
    const total = dice.reduce((sum, die) => sum + die.total, 0);

    return new GenericRollResult(total, dice, null, []);
  }

  // Savage Worlds roll: s8, s8w6, s12w6
  visitSavageWorldsRollExpr(ctx) {
    const rollCtx = ctx.savageWorldsRoll();
    const count = rollCtx.t1 ? parseInt(rollCtx.t1.getText()) : 1;
    const traitDieSize = parseInt(rollCtx.t2.getText());
    const wildDieSize = rollCtx.t3 ? parseInt(rollCtx.t3.getText()) : 6;

    // Extract target number and raise step if present
    const tnCtx = rollCtx.targetNumberAndRaiseStep();
    let targetNumber = null;
    let raiseInterval = null;

    if (tnCtx) {
      targetNumber = tnCtx.tt ? parseInt(tnCtx.tt.getText()) : 4;
      raiseInterval = tnCtx.tr ? parseInt(tnCtx.tr.getText()) : 4;
      if (tnCtx.tnr) {
        targetNumber = parseInt(tnCtx.tnr.getText());
        raiseInterval = targetNumber;
      }
      if (tnCtx.tgtn) targetNumber = parseInt(tnCtx.tgtn.getText());
    }

    // Single roll
    if (count === 1) {
      const traitDie = rollAcingDie(traitDieSize);
      const wildDie = rollAcingDie(wildDieSize);
      const usedDie = traitDie.total >= wildDie.total ? 'trait' : 'wild';
      const baseValue = Math.max(traitDie.total, wildDie.total);

      // Always calculate raises for Savage Worlds (default TN 4, raise interval 4)
      const effectiveTN = targetNumber !== null ? targetNumber : 4;
      const effectiveRI = raiseInterval !== null ? raiseInterval : 4;

      const margin = baseValue - effectiveTN;
      const success = margin >= 0;
      const raiseCount = success ? Math.floor(margin / effectiveRI) : 0;
      const raises = {
        success: success,
        raises: raiseCount,
        margin: margin,
        description: success ? 'Success' : 'Failure'
      };

      return new SavageWildRollResult(baseValue, traitDie, wildDie, usedDie, 0, effectiveTN, effectiveRI, raises);
    }

    // Multiple rolls - each roll is a complete savageWild structure
    const rolls = [];

    // Always calculate raises for Savage Worlds (default TN 4, raise interval 4)
    const effectiveTN = targetNumber !== null ? targetNumber : 4;
    const effectiveRI = raiseInterval !== null ? raiseInterval : 4;

    for (let i = 0; i < count; i++) {
      const traitDie = rollAcingDie(traitDieSize);
      const wildDie = rollAcingDie(wildDieSize);
      const usedDie = traitDie.total >= wildDie.total ? 'trait' : 'wild';
      const baseValue = Math.max(traitDie.total, wildDie.total);

      const margin = baseValue - effectiveTN;
      const success = margin >= 0;
      const raiseCount = success ? Math.floor(margin / effectiveRI) : 0;
      const raises = {
        success: success,
        raises: raiseCount,
        margin: margin,
        description: success ? 'Success' : 'Failure'
      };

      rolls.push(new SavageWildRollResult(baseValue, traitDie, wildDie, usedDie, 0, effectiveTN, effectiveRI, raises));
    }

    const total = rolls.reduce((sum, r) => sum + r.value, 0);

    return new MultipleRollsResult(total, rolls, 0, targetNumber, raiseInterval);
  }

  // Savage Worlds extras roll: e6, 4e8
  visitSavageWorldsExtrasRollExpr(ctx) {
    const rollCtx = ctx.savageWorldsExtrasRoll();
    const traitDieSize = parseInt(rollCtx.t1.getText());

    const die = rollAcingDie(traitDieSize);

    // Extract target number and raise step if present
    const tnCtx = rollCtx.targetNumberAndRaiseStep();
    let targetNumber = null;
    let raiseInterval = null;

    if (tnCtx) {
      targetNumber = tnCtx.tt ? parseInt(tnCtx.tt.getText()) : 4;
      raiseInterval = tnCtx.tr ? parseInt(tnCtx.tr.getText()) : 4;
      if (tnCtx.tnr) {
        targetNumber = parseInt(tnCtx.tnr.getText());
        raiseInterval = targetNumber;
      }
      if (tnCtx.tgtn) targetNumber = parseInt(tnCtx.tgtn.getText());
    }

    return new RollResult(die.total, {
      rollType: 'savageExtras',
      dice: [die],
      modifier: 0,
      targetNumber: targetNumber,
      raiseInterval: raiseInterval
    });
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

    const modifierValue = op === '+' ? right.value : -right.value;
    const result = left.value + modifierValue;

    // If left side is a dice roll, add modifier to it
    if (left.rollType === 'generic') {
      return new GenericRollResult(result, left.dice, modifierValue, left.droppedDice, left.keepOperation);
    } else if (left.rollType === 'savageWild') {
      // Recalculate raises if there's a target number
      const raises = left.raises && left.targetNumber !== null ? {
        success: result >= left.targetNumber,
        raises: result >= left.targetNumber ? Math.floor((result - left.targetNumber) / left.raiseInterval) : 0,
        margin: result - left.targetNumber,
        description: result >= left.targetNumber ? 'Success' : 'Failure'
      } : left.raises;

      return new SavageWildRollResult(result, left.traitDie, left.wildDie, left.usedDie, modifierValue, left.targetNumber, left.raiseInterval, raises);
    }

    // Simple arithmetic
    return new SimpleValueResult(result, `${left.value} ${op} ${right.value}`);
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

  applyGenericSuffix(dice, suffix) {
    // Handle RollAndKeepSuffix
    if (suffix.constructor.name === 'RollAndKeepSuffixContext') {
      const op = suffix.op.text.toLowerCase();
      const keepCount = suffix.n ? parseInt(suffix.n.getText()) : 1;

      let sorted;
      let keepOperation;

      if (op === 'k' || op === 'adv') {
        // Keep highest
        sorted = [...dice].sort((a, b) => b.total - a.total);
        keepOperation = op === 'k' ? 'highest' : 'advantage';
      } else if (op === 'kl' || op === 'dis') {
        // Keep lowest
        sorted = [...dice].sort((a, b) => a.total - b.total);
        keepOperation = op === 'kl' ? 'lowest' : 'disadvantage';
      }

      const keptDice = sorted.slice(0, keepCount).map(die => ({...die, kept: true}));
      const droppedDice = sorted.slice(keepCount).map(die => ({...die, kept: false}));
      const total = keptDice.reduce((sum, die) => sum + die.total, 0);

      return new GenericRollResult(total, [...keptDice, ...droppedDice], null, droppedDice, keepOperation);
    }

    // Handle SuccessOrFailSuffix1 and SuccessOrFailSuffix2
    if (suffix.constructor.name.includes('SuccessOrFailSuffix')) {
      const successTarget = parseInt(suffix.sn.getText());
      const failTarget = suffix.fn ? parseInt(suffix.fn.getText()) : null;

      const successes = dice.filter(die => die.total >= successTarget).length;
      const failures = failTarget ? dice.filter(die => die.total <= failTarget).length : 0;

      return new SuccessFailRollResult(successes, dice, successes, failures, successTarget, failTarget);
    }

    // Handle TargetNumberAndRaiseStepSuffix
    if (suffix.constructor.name === 'TargetNumberAndRaiseStepSuffixContext') {
      const total = dice.reduce((sum, die) => sum + die.total, 0);
      const tnCtx = suffix.targetNumberAndRaiseStep();

      let targetNumber = tnCtx.tt ? parseInt(tnCtx.tt.getText()) : 4;
      let raiseInterval = tnCtx.tr ? parseInt(tnCtx.tr.getText()) : 4;
      if (tnCtx.tnr) {
        targetNumber = parseInt(tnCtx.tnr.getText());
        raiseInterval = targetNumber;
      }
      if (tnCtx.tgtn) targetNumber = parseInt(tnCtx.tgtn.getText());

      const margin = total - targetNumber;
      const success = margin >= 0;
      const raiseCount = success ? Math.floor(margin / raiseInterval) : 0;

      // For generic rolls with target numbers, we can extend GenericRollResult or create a wrapper
      // For now, add raises info to the result
      const result = new GenericRollResult(total, dice, null, []);
      result.targetNumber = targetNumber;
      result.raiseInterval = raiseInterval;
      result.raises = {
        success: success,
        raises: raiseCount,
        margin: margin,
        description: success ? 'Success' : 'Failure'
      };
      return result;
    }

    // Default: just return dice
    const total = dice.reduce((sum, die) => sum + die.total, 0);
    return new GenericRollResult(total, dice, null, []);
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
    const chars = new InputStream(expression);
    const lexer = new R2Lexer(chars);
    const tokens = new CommonTokenStream(lexer);
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
