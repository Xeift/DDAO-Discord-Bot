const { EmbedBuilder } = require('discord.js');
const dotenv = require('dotenv');
dotenv.config();
const CLIENT_ID = process.env['CLIENT_ID'];
const REDIRECT_URI = process.env['REDIRECT_URI'];

module.exports = async function(interaction) {
    
    const uid = interaction.user.id;
    const oursongURL = `https://www.oursong.com/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&state=${uid}`
    const embed = new EmbedBuilder()
        .setColor(0xf5bf3f)
        .setTitle('請點擊下方連結，驗證 OurSong NFT')
        .setDescription(oursongURL)
    
    await interaction.reply({
        embeds: [embed],
        ephemeral: true
    });
}