const { CommandInteraction, MessageEmbed, Message } = require('discord.js');
const rolesschema = require('../../Structures/Schema/useafksc');
const afkSchema = require('../../Structures/Schema/afksc');

module.exports = {
	name: 'afk',
	description: 'set your self afk',
	options: [
		{
			name: 'reason',
			description: 'reason why you go afk',
			type: 'STRING',
			required: false,
		},
	],
	/**
	 *
	 * @param {CommandInteraction} interaction
	 * @param {Message} message
	 */
	async execute(interaction, message) {
		const reason = interaction.options.getString('reason') || 'No reason';
		await interaction.deferReply({ ephemeral: true });

		rolesschema.findOne({ Guild: interaction.guild.id }, async (err, data) => {
			if (err) throw err;
			if (!data && !interaction.member.permissions.has('MANAGE_MESSAGES')) {
				return await interaction.editReply({
					content: `You can't use this command.`,
				});
			}
			if (!data && interaction.member.permissions.has('MANAGE_MESSAGES')) {
				afkSchema.findOne(
					{ Guild: interaction.guild.id, User: interaction.user.id },
					async (err, data) => {
						if (err) throw err;
						if (data) {
							await interaction.editReply({
								content: `${interaction.user} you are no longer afk, you had ${data.pings} mention(s).`,
							});
							return data.delete();
						} else {
							new afkSchema({
								Guild: interaction.guild.id,
								User: interaction.user.id,
								Reason: reason,
								Date: Date.now(),
								pings: 0,
							}).save();
							return await interaction.editReply({
								content: `<:sleep:939906700163559444> You are now afk for \`${reason}\``,
							});
						}
					}
				);
			}
			if (data) {
				const mainrole = data.Roles;
				if (
					(mainrole.length =
						0 || !interaction.member.permissions.has('MANAGE_MESSAGES'))
				) {
					return await interaction.editReply({
						content: `You can't use this command.`,
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
					interaction.member.permissions.has('MANAGE_MESSAGES')
				) {
					afkSchema.findOne(
						{ Guild: interaction.guild.id, User: interaction.user.id },
						async (err, data) => {
							if (err) throw err;
							if (data) {
								await interaction.editReply({
									content: `${interaction.user} you are no longer afk, you had ${data.pings} mention(s).`,
								});
								return data.delete();
							} else {
								new afkSchema({
									Guild: interaction.guild.id,
									User: interaction.user.id,
									Reason: reason,
									Date: Date.now(),
									pings: 0,
								}).save();
								return await interaction.editReply({
									content: `<:sleep:939906700163559444> You are now afk for \`${reason}\``,
								});
							}
						}
					);
					arrays = [];
				} else {
					await interaction.editReply({
						content: `You can't use this command.`,
					});
					arrays = [];
				}
			}
		});
	},
};
