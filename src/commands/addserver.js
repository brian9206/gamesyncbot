import Gamedig from 'gamedig';
import db from '../database';
import sendGameServerMessage from '../sendGameServerMessage';

export default async function addserver(msg, args) {
    // show usage
    if (!args || (args.length !== 2 && args.length !== 3)) {
        msg.channel.send('**Add a game server to tracking list**\nUsage: `!addserver <game> <ipaddr>:<port> [color]`\nExample: `!addserver csgo example.com:27015 ff0000`\nSupported game list: <https://www.npmjs.com/package/gamedig#games-list>');
        return;
    }

    // get user input
    const [ type, hostaddr, colorHex ] = args;
    const [ host, port ] = hostaddr.split(':', 2);

    // check user input
    if (port <= 0 || port > 65535) {
        msg.channel.send('❌ **Error: Invalid port number**');
        return;
    }

    if (colorHex && !colorHex.match(/^[0-9a-f]{6}$/)) {
        msg.channel.send('❌ **Error: Invalid color RGB hex**');
        return;
    }

    // parse color
    let color;

    if (!colorHex) {
        color = Math.floor(Math.random() * 0xffffff);
    }
    else {
        color = parseInt(colorHex, 16);
    }
    
    // notify user we received
    const message = await msg.channel.send(`🔍 **Querying game server...**\nGame: \`${type}\`, Host: \`${host}:${port}\``);

    // query game server
    let query;
    try {
        query = await Gamedig.query({ type, host, port });
    }
    catch (err) {
        message.edit('❌ **Error: Game server is unavailable currently**');
        return;
    }

    // add server to db
    try {
        const docs = await db.find({
            channel: msg.channel.id,
            host,
            port
        });

        if (docs.length > 0) {
            message.edit('❌ **This game server is already in the tracking list**');
            return;
        }

        await db.insert({
            channel: msg.channel.id,
            type,
            host,
            port,
            color
        });
    }
    catch (err) {
        console.error(`Insert DB error: ${err.toString()}`);
        message.edit('❌ **Error: BOT backend database has encountered an error**');
        return;
    }

    await message.edit('✅ **Game server has been added**');
    await sendGameServerMessage(msg.channel, query, host, port, type, color);
}
