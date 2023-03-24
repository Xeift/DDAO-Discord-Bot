const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const fs = require('fs/promises');

module.exports = async function(interaction) {

    let userId = interaction.user.id.toString();
    
    let userData;
    await fs.readFile('./data/user_data.json')
        .then(data => {
            userData = JSON.parse(data);
        })
        .catch(err => {
            throw err;
        });
    
    const modal = new ModalBuilder()
        .setCustomId('form')
        .setTitle('填寫資料');

    const schoolInput = new TextInputBuilder()
        .setCustomId('schoolInput')
        .setLabel('就讀(畢業)學校')
        .setPlaceholder('e.g. 國立臺灣大學')
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

    const deptInput = new TextInputBuilder()
        .setCustomId('deptInput')
        .setLabel('就讀(畢業)學系')
        .setPlaceholder('e.g. 森林系')
        .setStyle(TextInputStyle.Short)
        .setRequired(true);
    
    const graduateYearInput = new TextInputBuilder()
        .setCustomId('graduateYearInput')
        .setLabel('畢業年分(西元)')
        .setPlaceholder('e.g. 2000')
        .setStyle(TextInputStyle.Short)
        .setMinLength(4)
        .setMaxLength(4)
        .setRequired(true);

    const ethWalletInput = new TextInputBuilder()
        .setCustomId('ethWalletInput')
        .setLabel('以太坊錢包地址(支援ENS)，若未填將自動分配 Torus 地址')
        .setPlaceholder('e.g. 0x8173D2165eE8ae29f0301C11B72C4cd85Ab5280f or xeift.eth')
        .setStyle(TextInputStyle.Short)
        .setRequired(false);
    
    modal.addComponents(
        new ActionRowBuilder().addComponents(schoolInput),
        new ActionRowBuilder().addComponents(deptInput),
        new ActionRowBuilder().addComponents(graduateYearInput),
        new ActionRowBuilder().addComponents(ethWalletInput)
    );
    
    for (const user in userData) {
        if (user === userId) {
            console.log(userData[user]);
            modal.setTitle('編輯資料');
            schoolInput.setPlaceholder(userData[user]['school']);
            deptInput.setPlaceholder(userData[user]['dept']);
            graduateYearInput.setPlaceholder(userData[user]['graduate_year']);
            ethWalletInput.setPlaceholder(userData[user]['eth_wallet']);
        }
    }
    
    await interaction.showModal(modal);
}