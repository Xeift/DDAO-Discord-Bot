const { EmbedBuilder } = require('discord.js');
const crypto = require('crypto');
const fs = require('fs/promises');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();
const APP_ACCOUNT = process.env['APP_ACCOUNT'];
const APP_PASSWORD = process.env['APP_PASSWORD'];

module.exports = async function(interaction) {
    
    const emailInput = interaction.fields.getTextInputValue('emailInput');
    const uid = interaction.user.id;

    const verifyCode = await generateCode(uid);
    await sendMail(emailInput, verifyCode);
    await sendEmbed(emailInput);
    
    async function generateCode(uid) {
        const randomData = crypto.randomBytes(32)
        const verifyCode = crypto.createHash('sha256').update(randomData).digest('hex');

        let verifyCodeData;
        await fs.readFile('./data/verify_code.json')
            .then(data => {
                verifyCodeData = JSON.parse(data);
            })
            .catch(err => {
                throw(err);
            })

        verifyCodeData[uid] = [verifyCode, emailInput];

        await fs.writeFile('./data/verify_code.json', JSON.stringify(verifyCodeData, null, 4), 'utf8')
        return verifyCode;
    }

    
    async function sendMail(emailInput, verifyCode) {
        
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: APP_ACCOUNT,
                pass: APP_PASSWORD
            }
        });
        
        const mailOptions = {
            from: APP_ACCOUNT,
            to: emailInput,
            subject: 'DDAO 學校信箱驗證碼',
            html: `<h1>DDAO 學校信箱驗證碼</h1><div class="title"><p>以下是你的驗證碼。回到 Discord 輸入後，機器人會自動授予你身分組。<br>Below is your verification code. Enter the code in #verify-school channel and bot will assign role to you automatically.</p><code style="background-color: #D4B25B;color: #04113F;font-size: 20px;">${verifyCode}</code></div></div>`
        };
        
        transporter.sendMail(mailOptions);         
    }


    async function sendEmbed(emailInput) {
		const embed = new EmbedBuilder()
            .setColor(0xf5bf3f)
            .setTitle('驗證碼已寄出')
            .setDescription(`請至\`${emailInput}\`收信，若沒有收到請檢查垃圾郵件或點擊按鈕重新發送。\n驗證碼請點擊\`輸入驗證碼\`按鈕輸入`)
        
        await interaction.reply({
            embeds: [embed],
            ephemeral: true
        });
    }
}