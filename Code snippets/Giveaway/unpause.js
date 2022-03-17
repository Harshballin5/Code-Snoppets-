const { MessageEmbed, CommandInteraction, Client } = require('discord.js');
const db = require('../../Structures/Schema/canusegiveawaysc');

module.exports = {
	name: 'gunpause',
	description: 'unpauses the giveaway',
	usage: '/gunpause <id>',
	options: [
		{
			name: 'id',
			description: 'giveaway id',
			type: 'STRING',
			required: true,
		},
	],
	/**
	 * @param {Client} client
	 * @param {CommandInteraction} interaction
	 */
	async execute(interaction, client) {
		const messageId = interaction.options.getString('id');

		await interaction.deferReply({ ephemeral: true });

		db.findOne({ Guild: interaction.guild.id }, async (err, data) => {
			if (err) throw err;
			if (!data && !interaction.member.permissions.has('ADMINISTRATOR')) {
				return await interaction.editReply({
					content: `You are not the giveaway manager!!`,
				});
			}
			if (!data && interaction.member.permissions.has('ADMINISTRATOR')) {
				client.giveawaysManager
					.unpause(messageId)
					.then(() => {
						interaction.editReply({
							content: 'Success! Giveaway unpaused!',
							ephemeral: true,
						});
					})
					.catch((err) => {
						interaction.editReply({
							content: `An error has occurred, please check and try again.\n\`${err}\``,
							ephemeral: true,
						});
					});
			}
			if (data) {
				const mainrole = data.Roles;
				if (
					(mainrole.length =
						0 || !interaction.member.permissions.has('ADMINISTRATOR'))
				) {
					return await interaction.editReply({
						content: `You are not the giveaway manager!!`,
					});
				}
				arrays = [];
				mainrole.forEach((role) => {
					const check = interaction.member.roles.cache.get(role);
					if (check) {
						arrays.push('yes');
					} else {
						arrays.push('no');
					}
				});
				if (
					arrays.includes('yes') ||
					interaction.member.permissions.has('ADMINISTRATOR')
				) {
					client.giveawaysManager
						.unpause(messageId)
						.then(() => {
							interaction.editReply({
								content: 'Success! Giveaway unpaused!',
								ephemeral: true,
							});
						})
						.catch((err) => {
							interaction.editReply({
								content: `An error has occurred, please check and try again.\n\`${err}\``,
							});
						});
					arrays = [];
				} else {
					await interaction.editReply({
						content: `You are not the giveaway manager!!`,
					});
					arrays = [];
				}
			}
		});
	},
};
