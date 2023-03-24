const { EmbedBuilder } = require('discord.js');
const fs = require('fs/promises');
const Torus = require('@toruslabs/torus-embed');

module.exports = async function(interaction) {
    
    let userData;
    await fs.readFile('./data/user_data.json')
        .then(data => {
            userData = JSON.parse(data);
        })
        .catch(err => {
            throw err;
        })
    
    const schoolInput = interaction.fields.getTextInputValue('schoolInput');
    const deptInput = interaction.fields.getTextInputValue('deptInput');
    const graduateYearInput = interaction.fields.getTextInputValue('graduateYearInput');
    let ethWalletInput = interaction.fields.getTextInputValue('ethWalletInput');
    const uid = interaction.user.id;
    const uname = interaction.user.username;

    if (ethWalletInput === '') {
        const torus = new Torus();
        const publicAddress = await torus.getPublicAddress({
            verifier: 'discord',
            verifierId: uid,
        });
        
        ethWalletInput = publicAddress['data'];
    }
    
    userData[uid] = {
        'name': uname,
        'school': schoolInput,
        'dept': deptInput,
        'graduate_year': graduateYearInput,
        'eth_wallet': ethWalletInput   
    }

    await fs.writeFile('./data/user_data.json', JSON.stringify(userData, null, 4), 'utf8');

    const embed = new EmbedBuilder()
        .setColor(0xf5bf3f)
        .setTitle('資料新增/編輯成功！')
        .setImage('https://cdn.discordapp.com/attachments/951682840435777536/1075270265635885117/d72c40fcb8514443d22e56afd2dd2aa2.png')
        .addFields(
            { name: 'Discord 使用者名稱', value: '`'+uname+'`', inline: false },
            { name: 'Discord 真實 ID', value: '`'+uid+'`', inline: false },
            { name: '就讀(畢業)學校', value: '`'+schoolInput+'`', inline: false },
            { name: '就讀(畢業)學系', value: '`'+deptInput+'`', inline: false },
            { name: '畢業年分(西元)', value: '`'+graduateYearInput+'`', inline: false },
            { name: '以太坊錢包地址', value: '`'+ethWalletInput+'`', inline: false },
        )
    interaction.reply({embeds: [embed], ephemeral: true});
}