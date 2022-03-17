const { MessageEmbed, CommandInteraction, Client } = require('discord.js');

module.exports = {
	name: 'previous',
	description: 'plays previous song',
	inVoiceChannel: true,
	usage: '/previous',
	cooldown: 10000,
	inVoiceChannel: true,
	/**
	 * @param {Client} client
	 * @param {CommandInteraction} interaction
	 */
	async execute(interaction, client) {
		let memberVoiceChannel = interaction.member.voice.channel;
		if (
			interaction.guild.me.voice.channelId &&
			memberVoiceChannel.id !== interaction.guild.me.voice.channelId
		) {
			return interaction.reply({
				content: `I am already playing music in <#${interaction.guild.me.voice.channelId}>`,
				ephemeral: true,
			});
		}
		const queue = client.distube.getQueue(interaction);
		if (!queue)
			return interaction.reply(`❌ | There is nothing in the queue right now!`);
		try {
			client.distube.previous(interaction);
		} catch (e) {
			message.channel.send(`❌ | ${e}`);
		}
	},
};
