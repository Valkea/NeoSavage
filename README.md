# NeoSavage

A Discord bot for **Savage Worlds** tabletop RPG mechanics, written in JavaScript using Discord.js.

## Features

### 🎲 Dice Rolling
- **Basic Rolls**: `/roll 2d6+3`, `/roll d20`, `/roll 3d8-2`
- **Acing Dice**: Exploding dice (reroll and add on max value)
- **Wild Die Rolls**: Savage Worlds signature mechanic - roll trait die + wild die, keep highest
- **Automatic Raises**: Calculate success and raises based on target number
- **Multi-Group Rolls**: `/roll dice:3d6 / s8 / 2d20adv` - Multiple dice groups with overall total
- **Split Mode**: Add `/split` or `/s` to get separate messages per group
- **✨ Flexible Modifiers**: Write modifiers in ANY order! `s10+5r2t5`, `3d6!+5k2`, `3d6+2kl2` all work

### ⚔️ Combat & Initiative
- **Card-Based Initiative**: Deal playing cards for initiative order (Savage Worlds style)
- **Edge Support**: Quick, Level Headed, Improved Level Headed edges
- **Round Management**: Track rounds and automatically deal new cards
- **On Hold**: Put characters on hold during combat

### 🎲 Benny Management
- **Grant Bennies**: Give bennies to characters
- **Spend Bennies**: Track benny usage
- **List View**: See all characters and their benny counts
- **Mode Support**: Standard and Deadlands modes

### 🎯 Character States
- **State Tracking**: Shaken, Stunned, Vulnerable, Distracted, etc.
- **Add/Remove**: Manage character conditions
- **Visual Display**: Emoji-based state display

## Installation

### Option 1: Docker (Recommended)

The easiest way to run the bot with all dependencies pre-installed:

```bash
# 1. Clone the repository
git clone <repository-url>
cd src

# 2. Create .env file
cp .env.example .env
# Edit .env with your Discord bot token

# 3. Build and run with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the bot
docker-compose down
```

### Option 2: Manual Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. **Generate the ANTLR4 parser** (required for advanced dice expressions):
   ```bash
   # Install ANTLR4 globally (one-time setup)
   npm install -g antlr4

   # Generate the parser
   npm run generate-parser
   ```

   See `SETUP_PARSER.md` for detailed parser setup instructions.

4. Create a `.env` file (copy from `.env.example`):
   ```env
   DISCORD_TOKEN=your_bot_token_here
   CLIENT_ID=your_client_id_here
   GUILD_ID=your_guild_id_here
   ```

5. Run the bot:
   ```bash
   npm start
   ```

   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

## Commands

### Dice Rolling
- `/roll dice:[expression] acing:[true/false] modifier:[number]` - Roll dice
- `/wild trait:[d4-d12] modifier:[number] target:[number]` - Wild die roll

### Combat
- `/fight start` - Start a new fight
- `/fight end` - End the current fight

### Initiative
- `/initiative deal characters:[names] quick:[true/false] level_headed:[true/false]` - Deal cards
- `/initiative show` - Show initiative order
- `/initiative round` - Start new round

### Bennies
- `/benny grant character:[name] count:[number]` - Grant bennies
- `/benny spend character:[name]` - Spend a benny
- `/benny list` - List all bennies
- `/benny clear character:[name]` - Clear bennies

### Character States
- `/state character:[name] action:[add/remove/clear/show] state:[state_name]` - Manage states

### Help
- `/help` - Show command help

## Advanced Dice Rolling (R2 Grammar)

The bot includes full support for the R2 dice expression grammar with automatic parser generation during Docker build:

### Supported Syntax

**Generic Rolls**
- `XdY` - Roll X dice with Y sides (e.g., `2d6`, `d20`)
- `XdY!` - Exploding dice (reroll and add on max)
- `XdY kN` - Keep highest N dice (e.g., `4d6 k3`)
- `XdY kl N` - Keep lowest N dice
- `2d20 adv` / `2d20 dis` - Advantage/Disadvantage
- `XdY sN` - Count successes ≥ N (e.g., `10d6 s5`)
- `XdY sN fM` - Count successes ≥N and failures ≤M
- `XdY tN rM` - Target number N with raises every M

**Savage Worlds**
- `sX` - Savage Worlds roll (trait die with wild die)
- `sX wY` - Specify wild die size (e.g., `s8 w6`)
- `eX` - Extras roll (single acing die)
- `4e6` - Multiple extras rolls

**Other Systems**
- `XdF` - Fudge/FATE dice
- `XdC` - Carcosa dice
- `XW` - West End Games D6 (with wild die)
- `pX` - Sword World power roll

**Advanced Features**
- `X--Y` - Gygax range roll (e.g., `1--100`)
- `NxExpression` - Batch roll (e.g., `5x2d6`)
- `@var := Expression` - Variable assignment
- `Expression[min:max]` - Bound result
- Arithmetic: `+`, `-`, `*`, `/`, `%`
- `--flag` - Flags for special behaviors

**Multi-Group Rolls**
- `Group1 / Group2 / Group3` - Combined roll (single message with total)
- `Group1 / Group2 / Group3 /split` - Separate messages per group
- `Group1 / Group2 /s` - Split mode (short flag)
- Mixed types supported: `3d6 / s8 / 2d20adv` - Regular + Savage Worlds + Advantage

## Examples

### Basic Dice Roll
```
/roll dice:2d6+3
> 🎲 Roll: 2d6+3
> Result: 11
> Breakdown: 4 + 4 + 3
```

### Acing Dice
```
/roll dice:d6 acing:true
> 🎲 Roll: d6
> Result: 14
> Breakdown: [6+6+2]
```

### Wild Die Roll
```
/wild trait:8 modifier:2 target:4
> 🎲 Wild Die Roll: d8
> Trait Die: [8+3] = 11
> Wild Die: 4 = 4
> Final Result: 13 (used trait die)
> Success with 2 raises (TN: 4)
```

### Multi-Group Rolls (Combined)
```
/roll dice:3d6 / s8 / 2d20adv
> 🎲 Multiple Roll Groups
> Group 1: 3d6
> Result: 12 ← [ 4, 3, 5 ]
> 
> Group 2: s8  
> Trait Die: 6 ← [ 6 ]
> Wild Die: 3 ← [ 3 ]
> Result: 6 • used trait die
>
> Group 3: 2d20adv
> Result: 17 ← [ 17, 8 ]
>
> Overall Total: 35
```

### Multi-Group Rolls (Split)
```
/roll dice:3d6 / s8 / 2d20adv /split
> [Three separate messages, one for each group]
```

### Initiative
```
/initiative deal characters:Grog, Valeria, Zephyr
> 🎴 Initiative Cards Dealt:
> Grog: K of ♠️ Spades
> Valeria: 7 of ♥️ Hearts
> Zephyr: 🃏 Red Joker
```

## Discord Bot Setup

### 1. Create Discord Application

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click **"New Application"**
3. Enter a name for your bot (e.g., "NeoSavage")
4. Click **"Create"**

### 2. Create Bot User

1. Go to **"Bot"** tab in the left sidebar
2. Click **"Add Bot"**
3. Customize the bot's username and avatar if desired
4. **Copy the bot token** - you'll need this for your `.env` file

### 3. Configure Bot Permissions

#### Required Intents (Bot → Privileged Gateway Intents)
- ❌ **PRESENCE INTENT** - Leave OFF
- ❌ **SERVER MEMBERS INTENT** - Leave OFF  
- ✅ **MESSAGE CONTENT INTENT** - **MUST BE ENABLED** (prevents "disallowed intents" error)

#### Bot Permissions (OAuth2 → URL Generator)
**Scopes:**
- ✅ `bot`
- ✅ `applications.commands`

**Bot Permissions:**
- ✅ **Send Messages**
- ✅ **Use Slash Commands** 
- ✅ **Embed Links**
- ✅ **Attach Files**
- ✅ **Read Message History**

### 4. Invite Bot to Server

1. Go to **OAuth2 → URL Generator**
2. Select the scopes and permissions listed above
3. Copy the generated URL
4. Open the URL in your browser
5. Select your Discord server and authorize the bot

### 5. Configure Environment

Create a `.env` file (copy from `.env.example`):
```env
DISCORD_TOKEN=your_bot_token_here
```

### 6. Get Required IDs

**Bot Token:** Found in Bot tab (step 2)

### Troubleshooting

**"Used disallowed intents" error:**
- Ensure **MESSAGE CONTENT INTENT** is enabled in Bot settings
- Save changes and restart the bot

**Commands not appearing:**
- Verify bot has `applications.commands` scope
- Bot may take up to 1 hour to register global commands (it is usually way faster)

**Permission errors:**
- Ensure bot has required permissions in the channel
- Check bot role is above other roles that might restrict permissions

## License

MIT

## Credits

Based on the original [Savagebot](https://github.com/alessio29/savagebot) by alessio29, rewritten in JavaScript.
