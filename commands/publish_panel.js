const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('publish_panel')
		.setDescription('[權限鎖定: Xeift#1230] 部署驗證面板'),
	async execute(interaction) {
        if (interaction.user.id != 874806243208871977 || interaction.user.id != 415155279353741312) { return }

		const row = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId('oursong')
					.setLabel('OurSong驗證')
					.setStyle(ButtonStyle.Primary)
                    .setEmoji('1073501762499137567')
                ,
				new ButtonBuilder()
					.setCustomId('form')
					.setLabel('填寫資料')
					.setStyle(ButtonStyle.Primary)
                    .setEmoji('📝')
                ,
				new ButtonBuilder()
					.setCustomId('school')
					.setLabel('驗證學校')
					.setStyle(ButtonStyle.Primary)
                    .setEmoji('📧')
                ,
				new ButtonBuilder()
					.setCustomId('code')
					.setLabel('輸入驗證碼')
					.setStyle(ButtonStyle.Primary)
                    .setEmoji('✅')
                ,
			);
        
		const embed = new EmbedBuilder()
            .setColor(0xf5bf3f)
            .setTitle('請點擊下方按鈕選擇功能')
            .setImage('https://cdn.discordapp.com/attachments/951682840435777536/1075270265635885117/d72c40fcb8514443d22e56afd2dd2aa2.png')
            .addFields(
                { name: 'OurSong驗證', value: '驗證 OurSong NFT', inline: false },
                { name: '填寫資料', value: '填寫相關資料，用於將來接收空投', inline: false },
                { name: '驗證學校', value: '驗證就讀中/畢業之大專院校', inline: false },
            )
        
        await interaction.reply({
            content: 'published!',
            ephemeral: true
        });
        await interaction.channel.send({
            embeds: [embed],
            components: [row]            
        });
	},
};