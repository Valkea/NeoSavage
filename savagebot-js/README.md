# Savagebot JS

A Discord bot for **Savage Worlds** tabletop RPG mechanics, written in JavaScript using Discord.js.

## Features

### 🎲 Dice Rolling
- **Basic Rolls**: `/roll 2d6+3`, `/roll d20`, `/roll 3d8-2`
- **Acing Dice**: Exploding dice (reroll and add on max value)
- **Wild Die Rolls**: Savage Worlds signature mechanic - roll trait die + wild die, keep highest
- **Automatic Raises**: Calculate success and raises based on target number

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

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file (copy from `.env.example`):
   ```env
   DISCORD_TOKEN=your_bot_token_here
   CLIENT_ID=your_client_id_here
   GUILD_ID=your_guild_id_here
   ```

4. Run the bot:
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

### Initiative
```
/initiative deal characters:Grog, Valeria, Zephyr
> 🎴 Initiative Cards Dealt:
> Grog: K of ♠️ Spades
> Valeria: 7 of ♥️ Hearts
> Zephyr: 🃏 Red Joker
```

## Bot Setup

1. Create a Discord application at https://discord.com/developers/applications
2. Create a bot user
3. Enable the following intents:
   - Guilds
   - Guild Messages
   - Message Content
4. Invite the bot to your server with the `applications.commands` scope
5. Copy the bot token and client ID to your `.env` file

## License

MIT

## Credits

Based on the original [Savagebot](https://github.com/alessio29/savagebot) by alessio29, rewritten in JavaScript.
