import Discord from 'discord.js';

/**
 * Create a RichEmbed of a game server
 *
 * @param {object} srv - Gamedig state object
 * @param {string} host - Host name
 * @param {number} port - Port number
 * @param {string} type - Game type
 * @param {number} color - RGB color in decimal
 * @returns {Promise}
 */
export default function createRichEmbed(srv, host, port, type, color) {
    // determine player number
    let players = srv.players.length;

    if (!isNaN(srv.raw.numplayers)) {
        players = srv.raw.numplayers;
    }

    let additional = '';

    if (['csgo', 'css', 'cs16', 'cscz', 'alienswarm', 'hl2dm', 'hldm', 'hldms', 'insurgency', 'left4dead', 'left4dead2', 'synergy', 'tf2', 'tfc', 'garrysmod', 'dod', 'dods'].includes(type)) {
        additional = `\nQuick Join: **steam://connect/${host}:${port}/**`;
    }

    return new Discord.RichEmbed()
        .setColor(color)
        .setTitle(srv.name)
        .setDescription(`Current Map: **${srv.map}**\nCurrent Players: **${players}/${srv.maxplayers}**\nServer IP Address: **${host}:${port}**${additional}`)
        .setTimestamp(new Date())
        .setFooter(type);
}
