const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');

module.exports = async function(interaction) {
    
    const modal = new ModalBuilder()
        .setCustomId('code')
        .setTitle('填寫 email 中之驗證碼，驗證學校信箱');

    const verificationCodeInput = new TextInputBuilder()
        .setCustomId('codeInput')
        .setLabel('輸入驗證碼')
        .setPlaceholder('e.g. e95b0d3e57172d299ff3f84ffc7aa4989f011fcf50b57e36a75c696246ab1b2a')
        .setMinLength(64)
        .setMaxLength(64)
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

    modal.addComponents(
        new ActionRowBuilder().addComponents(verificationCodeInput)
    );

    await interaction.showModal(modal);
}