const { MessageEmbed } = require('discord.js');
const Playlist = require('../../settings/models/Playlist.js');
const formatDuration = require('../../structures/formatduration');
const { SlashPage } = require('../../structures/PageQueue.js');

module.exports = { 
    name: "detail",
    description: "Detail a playlist",
    options: [
        {
            name: "name",
            description: "The name of the playlist",
            required: true,
            type: 3
        },
        {
            name: "page",
            description: "The page you want to view",
            required: false,
            type: 4
        }
    ],
    run: async (interaction, client, user, language) => {
        await interaction.deferReply({ ephemeral: false });

        const value = interaction.options.getString("name");
        const number = interaction.options.getInteger("page");

        try {
            if (user && user.isPremium) {

        const Plist = value.replace(/_/g, ' ');
        const playlist = await Playlist.findOne({ name: Plist });
        if(!playlist) return interaction.editReply(`${client.i18n.get(language, "playlist", "detail_notfound")}`);
        if(playlist.owner !== interaction.user.id) return interaction.editReply(`${client.i18n.get(language, "playlist", "detail_owner")}`);

        let pagesNum = Math.ceil(playlist.tracks.length / 10);
		if(pagesNum === 0) pagesNum = 1;

        const playlistStrings = [];
        for(let i = 0; i < playlist.tracks.length; i++) {
            const playlists = playlist.tracks[i];
            playlistStrings.push(
                `${i + 1}. **[${playlists.title}](${playlists.uri})** | Author: ${playlists.author} • \`[${formatDuration(playlists.duration)}]\`
                `);
        }

        const totalDuration = formatDuration(playlist.tracks.reduce((acc, cur) => acc + cur.duration, 0));

        const pages = [];
        for (let i = 0; i < pagesNum; i++) {
            const str = playlistStrings.slice(i * 10, i * 10 + 10).join('');
            const embed = new MessageEmbed() //${playlist.name}'s Playlists
                .setAuthor({ name: `${client.i18n.get(language, "playlist", "detail_embed_title", {
                    name: playlist.name
                })}`, iconURL: interaction.user.displayAvatarURL() })
                .setDescription(`${str == '' ? '  Nothing' : '\n' + str}`)
                .setColor('#000001') //Page • ${i + 1}/${pagesNum} | ${playlist.tracks.length} • Songs | ${totalDuration} • Total duration
                .setFooter({ text: `${client.i18n.get(language, "playlist", "detail_embed_footer", {
                    page: i + 1,
                    pages: pagesNum,
                    songs: playlist.tracks.length,
                    duration: totalDuration
                })}` });

            pages.push(embed);
        }
		if (!number) {
			if (pages.length == pagesNum && playlist.tracks.length > 10) SlashPage(client, interaction, pages, 60000, playlist.tracks.length, totalDuration);
			else return interaction.editReply({ embeds: [pages[0]] });
		}
		else {
			if (isNaN(number)) return interaction.editReply(`${client.i18n.get(language, "playlist", "detail_notnumber")}`);
			if (number > pagesNum) return interaction.editReply(`${client.i18n.get(language, "playlist", "detail_page_notfound", {
                page: pagesNum
            })}`);
			const pageNum = number == 0 ? 1 : number - 1;
			return interaction.editReply({ embeds: [pages[pageNum]] });
        }
    } else {
        const Premiumed = new MessageEmbed()
            .setAuthor({ name: `${client.i18n.get(language, "nopremium", "premiun_author")}`, iconURL: client.user.displayAvatarURL() })
            .setDescription(`${client.i18n.get(language, "nopremium", "premiun_desc")}`)
            .setColor("#000001")
            .setTimestamp()

        return interaction.editReply({ embeds: [Premiumed] });
      }
    } catch (err) {
        console.log(err)
        interaction.editReply({ content: `${client.i18n.get(language, "nopremium", "premium_error")}` })
        }
    }
};