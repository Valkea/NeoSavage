# R2 Parser Implementation Fix

## Problem

The expression `/roll 10x3d6k1+4` was not working because:

1. The R2 evaluator (`r2Evaluator.js`) was incomplete - missing statement-level visitor methods
2. The parser imports were commented out
3. The `commands.js` was only using basic `parseDiceExpression()` which doesn't support complex R2 grammar

## What Was Fixed

### 1. Completed R2 Evaluator (`r2Evaluator.js`)

Added all missing visitor methods:

**Statement Visitors:**
- `visitCommandElement()` - Top-level command parsing
- `visitRollOnceStmt()` - Single expression evaluation
- `visitRollTimesStmt()` - Batch rolls (e.g., `10x3d6k1+4`)
- `visitRollBatchTimesStmt()` - Batch with multiple expressions
- `visitRollSavageWorldsExtraStmt()` - Savage Worlds extras (e.g., `4e6`)
- `visitIronSwornRollStmt()` - IronSworn mechanics
- `visitFlagStmt()` - Flag handling

**Suffix Handlers:**
- `applyGenericSuffix()` - Keep highest/lowest, advantage/disadvantage, success counting
- `applyTargetNumber()` - Target number and raises for Savage Worlds rolls
- `applyTargetNumberSingle()` - Target number for single rolls
- `applyTargetNumberMultiple()` - Target number for batch rolls

### 2. Enabled Parser Imports

Uncommented the parser imports:
```javascript
import R2Lexer from './parser/R2Lexer.js';
import R2Parser from './parser/R2Parser.js';
import R2Visitor from './parser/R2Visitor.js';
```

### 3. Updated Commands Integration

Modified `cmd_roll()` in `commands.js` to:
1. Try R2 evaluator first for full grammar support
2. Fallback to basic parser if R2 parser isn't generated yet
3. Provide clear error messages

## Supported R2 Grammar Features

The bot now supports the full R2 dice expression grammar:

### Batch Rolls
- `10x3d6k1+4` - Roll 3d6 ten times, keep highest die each time, add 4
- `5x2d20adv` - Roll with advantage 5 times
- `3xd8!` - Roll exploding d8 three times

### Keep Highest/Lowest
- `4d6k3` - Roll 4d6, keep highest 3
- `3d20kl1` - Roll 3d20, keep lowest 1
- `2d20adv` - Advantage (keep highest)
- `2d20dis` - Disadvantage (keep lowest)

### Success Counting
- `10d6s5` - Roll 10d6, count successes ≥5
- `8d10s6f1` - Roll 8d10, count successes ≥6 and failures ≤1

### Savage Worlds
- `s8` - Savage Worlds roll (d8 trait + d6 wild)
- `s12w6` - Savage Worlds with d12 trait, d6 wild
- `e6` - Extras roll (single exploding d6)
- `4e8` - Four extras with d8

### Target Numbers and Raises
- `3d6t4` - Roll 3d6 vs target number 4
- `s8t6r4` - Savage Worlds roll, TN 6, raises every 4
- `2d10tn8` - Roll 2d10, target number 8

### Other Systems
- `4dF` - Fudge/FATE dice
- `3dC` - Carcosa dice
- `5W` - West End Games D6 (with wild die)
- `p8` - Sword World power roll
- `i+2` - IronSworn roll with +2 modifier

### Advanced Features
- `1--100` - Gygax range roll (equivalent to d100)
- `@hp := 2d6+10` - Variable assignment
- `3d6[5:15]` - Bounded result (min 5, max 15)
- Arithmetic: `2d6 * 3`, `4d4 + 2d8`, etc.

## Testing

### Test in Docker

1. Rebuild and start the container:
```bash
docker compose down
docker compose up --build -d
```

2. Check logs:
```bash
docker compose logs -f
```

3. Test expressions in Discord:

**Basic batch roll:**
```
/roll dice:10x3d6k1+4
```
Expected: 10 rolls of 3d6, keeping highest die each time, adding 4 to total

**Exploding dice batch:**
```
/roll dice:5xd6!
```
Expected: 5 rolls of exploding d6

**Advantage rolls:**
```
/roll dice:3x2d20adv
```
Expected: 3 advantage rolls (2d20, keep highest)

**Success counting:**
```
/roll dice:10d6s5
```
Expected: Count how many d6 rolled ≥5

**Savage Worlds extras:**
```
/roll dice:4e8
```
Expected: 4 exploding d8 rolls (for extras)

### Test Locally (without Docker)

1. Generate the parser:
```bash
npm run generate-parser
```

2. Start the bot:
```bash
npm start
```

3. Test the same expressions in Discord

## How It Works

1. User types `/roll dice:10x3d6k1+4`
2. `cmd_roll()` calls `evaluateExpression("10x3d6k1+4")`
3. ANTLR4 lexer tokenizes: `10`, `x`, `3`, `d`, `6`, `k`, `1`, `+`, `4`
4. ANTLR4 parser builds parse tree:
   - RollTimesStmt: n=10
   - GenericRollExpr: 3d6
   - RollAndKeepSuffix: k1
   - InfixExpr2: +4
5. R2EvaluatorVisitor walks the tree:
   - `visitRollTimesStmt()` loops 10 times
   - Each iteration calls `visitGenericRollExpr()`
   - Rolls 3d6, applies `applyGenericSuffix()` for k1
   - Adds 4 to each result
6. Returns RollResult with total and description
7. Discord displays formatted result

## Error Handling

- **Syntax errors**: Clear position and message from ANTLR4
- **Parser not generated**: Graceful fallback to basic dice parser
- **Invalid expressions**: User-friendly error messages
- **Unsupported features**: Specific error about what's not implemented

## Next Steps

If you encounter any issues:

1. Check that parser was generated: `ls -la parser/`
2. Should see: `R2Lexer.js`, `R2Parser.js`, `R2Visitor.js`, etc.
3. Check bot logs for detailed error messages
4. Try simple expression first: `/roll dice:2d6`
5. Then try complex: `/roll dice:10x3d6k1+4`

## Files Modified

- **r2Evaluator.js**: Complete implementation with all visitor methods
- **commands.js**: Updated to use R2 evaluator with fallback
- **Dockerfile**: Already configured to generate parser during build
