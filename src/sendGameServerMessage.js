import Discord from 'discord.js';

/**
 * Send a server status embed to a text channel
 *
 * @param {TextChannel} channel - Text channel that you would like to send
 * @param {object} srv - Gamedig state object
 * @param {string} host - Host name
 * @param {number} port - Port number
 * @param {number} color - RGB color in decimal
 * @returns {Promise}
 */
export default function sendGameServerMessage(channel, srv, host, port, color) {
    console.log(`Server message ${host}:${port} sent to ${channel.id}`);

    let players = srv.players.length;

    if (!isNaN(srv.raw.numplayers)) {
        players = srv.raw.numplayers;
    }

    return channel.send({
        embed: new Discord.RichEmbed()
            .setColor(color)
            .setTitle(srv.name)
            .setDescription(`Current Map: **${srv.map}**\nCurrent Players: **${players}/${srv.maxplayers}**\nServer IP Address: **${host}:${port}**`)
    });
}
