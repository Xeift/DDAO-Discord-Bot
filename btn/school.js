const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const nodemailer = require('nodemailer');
const APP_PASSWORD = process.env['APP_PASSWORD'];

module.exports = async function(interaction) {
    
    const modal = new ModalBuilder()
        .setCustomId('school')
        .setTitle('填寫 email 及驗證碼，驗證學校信箱');

    const schoolInput = new TextInputBuilder()
        .setCustomId('emailInput')
        .setLabel('email 信箱')
        .setPlaceholder('e.g. a110510322@gm.usc.edu.tw')
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

    modal.addComponents(
        new ActionRowBuilder().addComponents(schoolInput)
    );

    await interaction.showModal(modal);
}