import { Client, GatewayIntentBits, Events, MessageFlags } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { config } from './config.js';
import {
  cmd_roll,
  cmd_roll_help,
  cmd_wild,
  cmd_fight_start,
  cmd_fight_end,
  cmd_initiative_deal,
  cmd_initiative_show,
  cmd_initiative_round
} from './commands/diceCommands.js';

// Initialize Discord client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// Build slash commands
const commands = [
  // Dice rolling commands
  new SlashCommandBuilder()
    .setName('roll')
    .setDescription('Roll dice (e.g., 2d6+3, d20!, s8t6)')
    .addStringOption(option =>
      option
        .setName('dice')
        .setDescription('Dice expression (use ! for acing, +/- for modifiers)')
        .setRequired(true)),

  new SlashCommandBuilder()
    .setName('wild')
    .setDescription('Savage Worlds wild die roll')
    .addIntegerOption(option =>
      option
        .setName('trait')
        .setDescription('Trait die size')
        .setRequired(true)
        .addChoices(
          { name: 'd4', value: 4 },
          { name: 'd6', value: 6 },
          { name: 'd8', value: 8 },
          { name: 'd10', value: 10 },
          { name: 'd12', value: 12 }))
    .addIntegerOption(option =>
      option
        .setName('modifier')
        .setDescription('Modifier to add')
        .setRequired(false))
    .addIntegerOption(option =>
      option
        .setName('target')
        .setDescription('Target number (default 4)')
        .setRequired(false))
    .addIntegerOption(option =>
      option
        .setName('raise')
        .setDescription('Points needed per raise (default 4)')
        .setRequired(false)),

  // Fight management
  new SlashCommandBuilder()
    .setName('fight')
    .setDescription('Manage combat encounters')
    .addSubcommand(subcommand =>
      subcommand
        .setName('start')
        .setDescription('Start a new fight'))
    .addSubcommand(subcommand =>
      subcommand
        .setName('end')
        .setDescription('End the current fight')),

  // Initiative commands
  new SlashCommandBuilder()
    .setName('initiative')
    .setDescription('Initiative card management')
    .addSubcommand(subcommand =>
      subcommand
        .setName('deal')
        .setDescription('Deal initiative cards')
        .addStringOption(option =>
          option
            .setName('characters')
            .setDescription('Character names (comma-separated)')
            .setRequired(true))
        .addBooleanOption(option =>
          option
            .setName('quick')
            .setDescription('Quick edge (draw 2, keep best)')
            .setRequired(false))
        .addBooleanOption(option =>
          option
            .setName('level_headed')
            .setDescription('Level Headed edge (draw 2, keep best)')
            .setRequired(false))
        .addBooleanOption(option =>
          option
            .setName('improved_level_headed')
            .setDescription('Improved Level Headed (draw 3, keep best)')
            .setRequired(false)))
    .addSubcommand(subcommand =>
      subcommand
        .setName('show')
        .setDescription('Show initiative order'))
    .addSubcommand(subcommand =>
      subcommand
        .setName('round')
        .setDescription('Start a new round')),


  // Help command
  new SlashCommandBuilder()
    .setName('help')
    .setDescription('Show dice rolling guide'),
];

// Register commands when bot is ready
client.once(Events.ClientReady, async (readyClient) => {
  console.log(`Logged in as ${readyClient.user.tag}`);

  // Register slash commands for all guilds
  for (const guild of client.guilds.cache.values()) {
    try {
      await guild.commands.set(commands.map(cmd => cmd.toJSON()));
      console.log(`✅ Registered commands for guild ${guild.name}`);
    } catch (error) {
      console.error(`❌ Error registering commands for guild ${guild.name}:`, error.message);
      // Continue with other guilds even if one fails
    }
  }
});

// Handle slash commands
client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  try {
    // Dice rolling
    if (commandName === 'roll') {
      await cmd_roll(interaction);
    } else if (commandName === 'wild') {
      await cmd_wild(interaction);
    }

    // Fight management
    else if (commandName === 'fight') {
      const subcommand = interaction.options.getSubcommand();
      if (subcommand === 'start') {
        await cmd_fight_start(interaction);
      } else if (subcommand === 'end') {
        await cmd_fight_end(interaction);
      }
    }

    // Initiative
    else if (commandName === 'initiative') {
      const subcommand = interaction.options.getSubcommand();
      if (subcommand === 'deal') {
        await cmd_initiative_deal(interaction);
      } else if (subcommand === 'show') {
        await cmd_initiative_show(interaction);
      } else if (subcommand === 'round') {
        await cmd_initiative_round(interaction);
      }
    }


    // Help
    else if (commandName === 'help') {
      await cmd_roll_help(interaction);
    }

  } catch (error) {
    console.error('Error handling command:', error);

    const errorResponse = {
      content: `❌ An error occurred: ${error.message}`,
      flags: [MessageFlags.Ephemeral]
    };

    if (interaction.replied || interaction.deferred) {
      await interaction.followUp(errorResponse);
    } else {
      await interaction.reply(errorResponse);
    }
  }
});

// Error handling
client.on('error', (error) => {
  console.error('Discord client error:', error);
});

process.on('unhandledRejection', (error) => {
  console.error('Unhandled promise rejection:', error);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Shutting down...');
  client.destroy();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('Shutting down...');
  client.destroy();
  process.exit(0);
});

// Login
client.login(config.token);
