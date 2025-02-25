const { MessageEmbed } = require('discord.js');
const Playlist = require('../../settings/models/Playlist.js');
const humanizeDuration = require('humanize-duration');
const { SlashPlaylist } = require('../../structures/PageQueue.js');

module.exports = { 
    name: "view",
    description: "View my playlists",
    options: [
        {
            name: "page",
            description: "The page you want to view",
            required: false,
            type: 4
        }
    ],
    run: async (interaction, client, user, language) => {
        await interaction.deferReply({ ephemeral: false });

        const value = interaction.options.getInteger("page");

		try {
			if (user && user.isPremium) {
        
        const playlists = await Playlist.find({ owner: interaction.user.id });

        let pagesNum = Math.ceil(playlists.length / 10);
		if(pagesNum === 0) pagesNum = 1;

        const playlistStrings = [];
        for(let i = 0; i < playlists.length; i++) {
            const playlist = playlists[i];
            const created = humanizeDuration(Date.now() - playlists[i].created, { largest: 1 })
            playlistStrings.push(
                `${i + 1}. **\`${playlist.name}\`** • (${playlist.tracks.length} tracks) • *Created At*: \`[${created}]\`
                `);
        }

        const pages = [];
        for (let i = 0; i < pagesNum; i++) {
            const str = playlistStrings.slice(i * 10, i * 10 + 10).join('');
            const embed = new MessageEmbed()
                .setAuthor({ name: `${client.i18n.get(language, "playlist", "view_embed_title", {
                    user: interaction.user.username
                })}`, iconURL: interaction.user.displayAvatarURL() })
                .setDescription(`${str == '' ? '  Nothing' : '\n' + str}`)
                .setColor('#000001')
                .setFooter({ text: `${client.i18n.get(language, "playlist", "view_embed_footer", {
                    page: i + 1,
                    pages: pagesNum,
                    songs: playlists.length
                })}` });

            pages.push(embed);
        }
		if (!value) {
			if (pages.length == pagesNum && playlists.length > 10) SlashPlaylist(client, interaction, pages, 30000, playlists.length);
			else return interaction.editReply({ embeds: [pages[0]] });
		}
		else {
			if (isNaN(value)) return interaction.editReply({ content: `${client.i18n.get(language, "playlist", "view_notnumber")}` });
			if (value > pagesNum) return interaction.editReply({ content: `${client.i18n.get(language, "playlist", "view_page_notfound", {
                page: pagesNum
            })}` });
			const pageNum = value == 0 ? 1 : value - 1;
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