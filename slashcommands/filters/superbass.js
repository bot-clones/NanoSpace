const delay = require('delay');
const { MessageEmbed } = require('discord.js');

module.exports = { 
    name: "superbass",
    description: "Turning on superbass filter",
    
    run: async (interaction, client, user, language) => {
        await interaction.deferReply({ ephemeral: false });
        const msg = await interaction.editReply(`${client.i18n.get(language, "filters", "filter_loading", {
            name: "superbass"
            })}`);

            const player = client.manager.get(interaction.guild.id);
            if(!player) return msg.edit(`${client.i18n.get(language, "noplayer", "no_player")}`);
            const { channel } = interaction.member.voice;
            if (!channel || interaction.member.voice.channel !== interaction.guild.me.voice.channel) return msg.edit(`${client.i18n.get(language, "noplayer", "no_voice")}`);

            const data = {
                op: 'filters',
                guildId: interaction.guild.id,
                equalizer: [
                    { band: 0, gain: 0.2 },
                    { band: 1, gain: 0.3 },
                    { band: 2, gain: 0 },
                    { band: 3, gain: 0.8 },
                    { band: 4, gain: 0 },
                    { band: 5, gain: 0.5 },
                    { band: 6, gain: 0 },
                    { band: 7, gain: -0.5 },
                    { band: 8, gain: 0 },
                    { band: 9, gain: 0 },
                    { band: 10, gain: 0 },
                    { band: 11, gain: 0 },
                    { band: 12, gain: 0 },
                    { band: 13, gain: 0 },
                ]
            }

            await player.node.send(data);

        const sbed = new MessageEmbed()
            .setDescription(`${client.i18n.get(language, "filters", "filter_on", {
                name: "superbass"
            })}`)
            .setColor('#000001');

        await delay(5000);
        msg.edit({ content: " ", embeds: [sbed] });
   }
};