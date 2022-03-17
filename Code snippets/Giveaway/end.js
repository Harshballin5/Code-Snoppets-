const { MessageEmbed, CommandInteraction, Client } = require('discord.js');
const db = require('../../Structures/Schema/canusegiveawaysc');

module.exports = {
	name: 'gend',
	description: 'end a giveaway',
	usage: '/gend <id>',
	options: [
		{
			name: 'id',
			description: 'id of the giveaway',
			type: 'STRING',
			required: true,
		},
	],
	/**
	 *
	 * @param {CommandInteraction} interaction
	 * @param {Client} client
	 */
	async execute(interaction, client) {
		const id = interaction.options.getString('id');
		await interaction.deferReply({ ephemeral: true });

		db.findOne({ Guild: interaction.guild.id }, async (err, data) => {
			if (err) throw err;
			if (!data && !interaction.member.permissions.has('ADMINISTRATOR')) {
				return await interaction.editReply({
					content: `You are not the giveaway manager!!`,
				});
			}
			if (!data && interaction.member.permissions.has('ADMINISTRATOR')) {
				try {
					client.giveawaysManager.end(id).then(() => {
						interaction.editReply({
							content: 'Giveaway Ended !!',
						});
					});
				} catch {
					interaction.editReply({
						content:
							'⛔ | Error\nPlease check if the id is correct!! or The giveaway was already ended.',
					});
				}
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
					try {
						client.giveawaysManager.end(id).then(() => {
							interaction.editReply({
								content: 'Giveaway Ended !!',
							});
						});
					} catch {
						interaction.editReply({
							content:
								'⛔ | Error\nPlease check if the id is correct!! or The giveaway was already ended.',
						});
					}
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
