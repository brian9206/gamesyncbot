import createRichEmbed from './createRichEmbed';

/**
 * Send a server status embed to a text channel
 *
 * @param {TextChannel} channel - Text channel that you would like to send
 * @param {object} srv - Gamedig state object
 * @param {string} host - Host name
 * @param {number} port - Port number
 * @param {string} type - Game type
 * @param {number} color - RGB color in decimal
 * @returns {Promise}
 */
export default function sendGameServerMessage(channel, srv, host, port, type, color) {
    console.log(`Server message ${host}:${port} sent to ${channel.id}`);

    return channel.send({
        embed: createRichEmbed(srv, host, port, type, color)
    });
}
