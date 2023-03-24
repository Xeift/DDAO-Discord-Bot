const { EmbedBuilder } = require('discord.js');
const fs = require('fs/promises');

module.exports = async function(interaction) {
    
    let codeData;
    await fs.readFile('./data/verify_code.json')
        .then(data => {
            codeData = JSON.parse(data);
        })
        .catch(err => {
            throw err;
        })

    let schoolData;
    await fs.readFile('./data/school_data.json')
        .then(data => {
            schoolData = JSON.parse(data);
        })
        .catch(err => {
            throw err;
        })
    
    const uid = interaction.user.id;
    
    const codeReal = codeData[uid][0];
    const email = codeData[uid][1];
    const codeInput = interaction.fields.getTextInputValue('codeInput');

    let isInSchoolList = false;
    
    const embed = new EmbedBuilder()
        .setColor(0xf5bf3f)

    if (codeReal === undefined) {
        embed.setTitle('驗證失敗');
        embed.setDescription('請先點選`驗證學校`按鈕，再選擇`輸入驗證碼`。');
    }
    else if (codeInput === codeReal) {

        embed.setTitle('驗證成功');
        
        for (const school in schoolData) {
            if ( email.includes(school) ) {
                isInSchoolList = schoolData[school];
            }
        }

        if (isInSchoolList === false) {
            embed.setDescription('但暫時不支持你的學校QWQ');
        }
        else {
            const member = await interaction.member;
            await member.roles.add(isInSchoolList).catch(console.error);
            embed.setDescription(`已新增<@&${isInSchoolList}>身分組`);
        }
    }
    else {
        embed.setTitle('驗證失敗');
        embed.setDescription('驗證碼輸入錯誤，請確認驗證碼無誤，或點選`驗證學校`按鈕重新發送驗證信');   
    }

    interaction.reply({embeds: [embed], ephemeral: true});
}