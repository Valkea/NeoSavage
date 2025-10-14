# Savagebot JavaScript Implementation

Complete rewrite of the original Java-based [Savagebot](https://github.com/alessio29/savagebot) in JavaScript for Discord.js.

## Architecture

### Core Components

1. **index.js** - Discord bot initialization and command routing
2. **commands.js** - Command handler implementations
3. **diceUtils.js** - Basic dice rolling mechanics
4. **initiativeUtils.js** - Card-based initiative system
5. **bennyUtils.js** - Benny management and character states
6. **r2Evaluator.js** - Advanced dice expression parser (ANTLR4)

### ANTLR4 Parser Integration

The bot uses the original R2.g4 grammar file from Savagebot to provide identical dice rolling syntax.

**Grammar File**: `R2.g4` (from original Savagebot repository)
**Parser Generation**: `npm run generate-parser`
**Evaluator**: `r2Evaluator.js` implements visitor pattern

## Feature Comparison

| Feature | Original (Java) | This Implementation (JS) | Status |
|---------|----------------|--------------------------|--------|
| Basic dice rolls | ✅ | ✅ | Complete |
| Acing/Exploding dice | ✅ | ✅ | Complete |
| Savage Worlds rolls | ✅ | ✅ | Complete |
| Wild die mechanics | ✅ | ✅ | Complete |
| Initiative cards | ✅ | ✅ | Complete |
| Benny management | ✅ | ✅ | Complete |
| Character states | ✅ | ✅ | Complete |
| Keep highest/lowest | ✅ | ✅ | Parser ready |
| Success counting | ✅ | ✅ | Parser ready |
| Target numbers | ✅ | ✅ | Parser ready |
| Batch rolling | ✅ | ✅ | Parser ready |
| Variables | ✅ | ✅ | Parser ready |
| Multiple game systems | ✅ | ✅ | Parser ready |
| Music playback | ✅ | ❌ | Not implemented |

## Advanced Features (Requires Parser)

After running `npm run generate-parser`, the following advanced features become available:

### Dice Expression Syntax

All features from the original R2 grammar:

```
# Generic rolls with modifiers
4d6 k3              # Keep highest 3 of 4d6
2d20 adv            # Advantage (keep highest)
10d6 s5 f1          # Count successes ≥5, failures ≤1
d8 t4 r4            # Target number 4, raises every 4

# Batch rolling
5x2d6               # Roll 2d6 five times
3x[s8; s10; s12]    # Roll multiple different expressions

# Variables
@hp := 2d6+10       # Assign result to variable
@damage := @hp / 2  # Use variables in expressions

# Bounded expressions
2d6[3:10]           # Clamp result between 3 and 10

# Multiple systems
4dF                 # Fudge/FATE dice
5W                  # WEG D6 with wild die
p8                  # Sword World power roll
```

### Implementation Status

**✅ Fully Implemented:**
- Discord.js v14 integration
- Slash command system
- Basic dice rolling (d4-d100, acing, modifiers)
- Savage Worlds mechanics (wild die, extras, raises)
- Initiative system with playing cards
- Edge support (Quick, Level Headed)
- Benny tracking (standard and Deadlands modes)
- Character state management
- Error handling and validation

**📝 Parser Ready (Requires Testing):**
- Advanced R2 grammar parsing
- Keep highest/lowest mechanics
- Success/failure counting
- Complex arithmetic expressions
- Variable assignment and reuse
- Batch rolling operations
- Multiple game system support
- Target number and raise calculations

**❌ Not Implemented:**
- Music playback features
- Persistent storage (uses in-memory Maps)
- Multi-server state isolation (stores by guild ID)

## Setup Instructions

### Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Generate ANTLR4 parser (for advanced features)
npm install -g antlr4
npm run generate-parser

# 3. Configure bot
cp .env.example .env
# Edit .env with your Discord bot token

# 4. Run bot
npm start
```

### Parser Generation Details

See `SETUP_PARSER.md` for complete parser setup instructions.

The parser generation creates these files in `./parser/`:
- `R2Lexer.js` - Tokenizer
- `R2Parser.js` - Parser
- `R2Visitor.js` - Visitor base class
- `R2Listener.js` - Listener base class

## Testing

To test the basic implementation without the parser:

```bash
npm start
```

Available commands will use the basic dice rolling mechanics from `diceUtils.js`.

To test advanced features:

```bash
# Generate parser first
npm run generate-parser

# Then run bot
npm start
```

The `/roll` command will then support the full R2 grammar.

## Differences from Original

### Simplified
- No persistent database (in-memory state)
- No web interface
- No music/audio features
- Slash commands instead of text commands

### Enhanced
- Modern Discord.js v14 API
- Native JavaScript/ES6+
- Emoji-based visual feedback
- Improved error messages
- Type-safe slash command definitions

### Maintained
- Identical dice rolling grammar (R2.g4)
- Same Savage Worlds mechanics
- Compatible syntax for core features

## Contributing

To add new features:

1. **Dice Rolling**: Extend `r2Evaluator.js` visitor methods
2. **Commands**: Add to `commands.js` and update slash command definitions in `index.js`
3. **Game Mechanics**: Add utilities to appropriate files (dice, initiative, benny)

## Credits

- Original Savagebot: [alessio29/savagebot](https://github.com/alessio29/savagebot)
- R2 Grammar: ANTLR4 grammar from original repository
- JavaScript rewrite: Maintains compatibility with original syntax

## License

MIT (same as original Savagebot)
