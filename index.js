const fs = require('node:fs');
const path = require('node:path');
const dotenv = require('dotenv');
dotenv.config();
const token = process.env.DISCORD_TOKEN;
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

const oursong = require('./btn/oursong.js')

const form = require('./btn/form.js')
const form_callback = require('./btn/form_callback.js')

const school = require('./btn/school.js')
const school_callback = require('./btn/school_callback.js')

const code = require('./btn/code.js')
const code_callback = require('./btn/code_callback.js')

const site = require('./resident/site.js')
const get_creator_created_nfts = require('./resident/get_creator_created_nfts.js')

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	// Set a new item in the Collection with the key as the command name and the value as the exported module
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}


client.once(Events.ClientReady, async c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
    await site(client);
    await get_creator_created_nfts();
});

client.on(Events.InteractionCreate, async interaction => {
    
	const command = interaction.client.commands.get(interaction.commandName);
    
	try {
		if (interaction.isAutocomplete()) {
            await command.autocomplete(interaction);
        }
    	else if (interaction.isButton()) {
            if (interaction.customId === 'oursong') { await oursong(interaction); }
            else if (interaction.customId === 'form') { await form(interaction); }
            else if (interaction.customId === 'school') { await school(interaction); }
            else if (interaction.customId === 'code') { await code(interaction); }
        }
        else if (interaction.isModalSubmit()) {
            if (interaction.customId === 'form') { await form_callback(interaction); }
            else if (interaction.customId === 'school') { await school_callback(interaction); }
            else if (interaction.customId === 'code') { await code_callback(interaction); }
        }
		else { await command.execute(interaction); }
	}
	catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

client.login(token);