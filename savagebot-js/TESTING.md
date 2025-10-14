# Testing the Savagebot

## Parser Testing

A test script is included to verify the R2 dice parser is working correctly.

### Run Tests Locally

```bash
node test-parser.js
```

### Run Tests in Docker

```bash
docker compose exec savagebot node test-parser.js
```

### Expected Output

```
🎲 Testing R2 Dice Parser

============================================================
✅ 2d6                  → <result>
✅ d20                  → <result>
✅ 3d8+5                → <result>
...
✅ 10x3d6k1+4           → <result>
============================================================

📊 Results: 23 passed, 0 failed out of 23 tests
🎉 All tests passed!
```

## Test Cases Covered

### Basic Rolls
- `2d6` - Roll 2 six-sided dice
- `d20` - Roll a single d20
- `3d8+5` - Roll 3d8 with +5 modifier

### Acing Dice (Exploding)
- `d6!` - Exploding d6
- `2d8!` - Two exploding d8s

### Batch Rolls
- `10x2d6` - Roll 2d6 ten times
- `5x3d8+2` - Roll 3d8+2 five times

### Keep Highest/Lowest
- `4d6k3` - Roll 4d6, keep highest 3
- `2d20adv` - Advantage (keep highest)
- `2d20dis` - Disadvantage (keep lowest)

### Savage Worlds Rolls
- `s8` - Savage Worlds roll with d8 trait
- `s10w6` - Savage Worlds roll with d10 trait and d6 wild die
- `2s6` - Two Savage Worlds rolls with d6

### Extras Rolls
- `e6` - Single extra with d6
- `4e8` - Four extras with d8

### Success Counting
- `10d6s5` - Count dice rolling 5 or higher
- `8d10s7f1` - Count successes ≥7 and failures ≤1

### Target Number and Raises
- `s8t4` - Savage Worlds roll vs target 4
- `s10t6r3` - Roll vs target 6 with raises every 3

### Arithmetic
- `2d6+1d4` - Add results of two rolls
- `3d8*2` - Multiply result by 2

### Complex Expressions
- `4d6k3+5` - Keep highest 3 of 4d6, add 5
- `10x3d6k1+4` - Batch roll with keep and modifier

## Discord Testing

### Test Commands in Discord

1. **Basic Roll**
   ```
   /roll dice:2d6
   ```

2. **Acing Roll**
   ```
   /roll dice:d6 acing:true
   ```

3. **Batch Roll**
   ```
   /roll dice:10x2d6
   ```

4. **Wild Die**
   ```
   /wild trait:8 modifier:2 target:4
   ```

5. **Initiative**
   ```
   /fight start
   /initiative deal characters:Alice, Bob, Charlie
   /initiative show
   ```

6. **Bennies**
   ```
   /benny grant character:Alice count:3
   /benny list
   /benny spend character:Alice
   ```

7. **Character States**
   ```
   /state character:Alice action:add state:Shaken
   /state character:Alice action:show
   /state character:Alice action:remove state:Shaken
   ```

## Expected Bot Behavior

### Roll Command
Should respond with:
- Dice expression
- Final result
- Detailed breakdown showing individual rolls

### Wild Die Command
Should respond with:
- Trait die result (with acing shown)
- Wild die result (with acing shown)
- Final result (highest of the two)
- Success/raises calculation vs target number

### Initiative
Should respond with:
- Character names
- Card drawn (including suit)
- Sorted initiative order
- Edge benefits (Quick, Level Headed) shown

### Bennies
Should respond with:
- Grant: confirmation and new total
- Spend: confirmation and remaining count
- List: all characters and their benny counts

### States
Should respond with:
- Add: confirmation of state added
- Remove: confirmation of state removed
- Show: all states for character with emojis

## Troubleshooting

### Parser Not Working
If you see "Parser not generated yet" errors:

1. Check parser files exist:
   ```bash
   docker compose exec savagebot ls -la parser/
   ```
   Should show: R2Lexer.js, R2Parser.js, R2Visitor.js

2. Rebuild Docker image:
   ```bash
   docker compose down
   docker compose up --build -d
   ```

3. Run test script:
   ```bash
   docker compose exec savagebot node test-parser.js
   ```

### Bot Not Responding
If bot doesn't respond to commands:

1. Check bot is running:
   ```bash
   docker compose ps
   ```

2. Check logs:
   ```bash
   docker compose logs -f savagebot
   ```

3. Verify Discord token:
   ```bash
   cat .env
   ```

4. Check bot permissions in Discord server
   - Must have `applications.commands` scope
   - Must have permission to read/send messages in channel

### Commands Not Appearing
If slash commands don't appear in Discord:

1. Wait a few minutes (Discord caches commands)
2. Check bot has proper permissions when invited
3. Restart Discord client
4. Check logs for "Registered commands" message

## Performance Testing

### Stress Test Batch Rolls
```bash
# In Discord, try:
/roll dice:100x10d10
/roll dice:50x4d6k3+5
```

Should complete within 1-2 seconds.

### Memory Usage
```bash
docker stats savagebot
```

Should use < 100MB memory under normal operation.

## Integration Testing

Test the full workflow:

1. Start a fight
2. Deal initiative to 5+ characters
3. Grant bennies to all characters
4. Add states to characters
5. Progress through multiple rounds
6. Make multiple rolls per round
7. Spend bennies
8. End fight

Everything should work smoothly without errors or crashes.
