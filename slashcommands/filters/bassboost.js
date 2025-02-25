const delay = require('delay');
const { MessageEmbed } = require('discord.js');

module.exports = { 
    name: 'bassboost',
    description: 'Turning on bassboost filter!',
    options: [
        {
            name: 'amount',
            description: 'The amount of the bassboost',
            type: 4,
        }
    ],
    
    run: async (interaction, client, user, language) => {
        await interaction.deferReply({ ephemeral: false });
        const value = interaction.options.getInteger('amount');

        const player = client.manager.get(interaction.guild.id);
        if(!player) return interaction.editReply(`${client.i18n.get(language, "noplayer", "no_player")}`);
        const { channel } = interaction.member.voice;
        if (!channel || interaction.member.voice.channel !== interaction.guild.me.voice.channel) return interaction.editReply(`${client.i18n.get(language, "noplayer", "no_voice")}`);

		if(!value) {
            const data = {
                op: 'filters',
                guildId: interaction.guild.id,
                equalizer: [
                    { band: 0, gain: 0.10 },
                    { band: 1, gain: 0.10 },
                    { band: 2, gain: 0.05 },
                    { band: 3, gain: 0.05 },
                    { band: 4, gain: -0.05 },
                    { band: 5, gain: -0.05 },
                    { band: 6, gain: 0 },
                    { band: 7, gain: -0.05 },
                    { band: 8, gain: -0.05 },
                    { band: 9, gain: 0 },
                    { band: 10, gain: 0.05 },
                    { band: 11, gain: 0.05 },
                    { band: 12, gain: 0.10 },
                    { band: 13, gain: 0.10 },
                ]
            }

            await player.node.send(data);

			const msg1 = await interaction.editReply(`${client.i18n.get(language, "filters", "filter_loading", {
                name: client.commands.get('bassboost').config.name
            })}`);
			const embed = new MessageEmbed()
				.setDescription(`${client.i18n.get(language, "filters", "filter_on", {
                name: client.commands.get('bassboost').config.name
            })}`)
                .setColor('#000001');
                
			await delay(5000);
            return msg1.edit({ content: " ", embeds: [embed] });
        } 

		if(isNaN(value)) return interaction.editReply(`${client.i18n.get(language, "filters", "filter_number")}`);
        if(value > 10 || value < -10) return interaction.editReply(`${client.i18n.get(language, "filters", "bassboost_limit")}`);
            const data = {
                op: 'filters',
                guildId: interaction.guild.id,
                equalizer: [
                    { band: 0, gain: value / 10 },
                    { band: 1, gain: value / 10 },
                    { band: 2, gain: value / 10 },
                    { band: 3, gain: value / 10 },
                    { band: 4, gain: value / 10 },
                    { band: 5, gain: value / 10 },
                    { band: 6, gain: value / 10 },
                    { band: 7, gain: 0 },
                    { band: 8, gain: 0 },
                    { band: 9, gain: 0 },
                    { band: 10, gain: 0 },
                    { band: 11, gain: 0 },
                    { band: 12, gain: 0 },
                    { band: 13, gain: 0 },
                ]
            }
            await player.node.send(data);
		    const msg2 = await interaction.editReply(`${client.i18n.get(language, "filters", "bassboost_loading", {
                amount: value
                })}`);
		    const embed = new MessageEmbed()
			    .setDescription(`${client.i18n.get(language, "filters", "bassboost_set", {
                amount: value
                })}`)
                .setColor('#000001');
            
		    await delay(5000);
            return msg2.edit({ content: " ", embeds: [embed] });
	}
};