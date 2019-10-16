import createRichEmbed from './createRichEmbed';

/**
 * Send a mention to a user
 *
 * @param {User} user - User that you would like to send
 * @param {object} srv - Gamedig state object
 * @param {string} host - Host name
 * @param {number} port - Port number
 * @param {string} type - Game type
 * @param {number} color - RGB color in decimal
 * @returns {Promise}
 */
export default function sendMentionMessage(user, srv, host, port, type, color) {
    console.log(`Mention message ${host}:${port} sent to ${user.id}`);

    const embed = createRichEmbed(srv, host, port, type, color)
        .setTitle(`${srv.map} is now playing on the following server`);

    embed.description = `${srv.name}\n${embed.description}`;

    return user.send({ embed });
}
