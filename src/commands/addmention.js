import Gamedig from 'gamedig';
import db from '../database';

export default async function addmention(msg, args) {
    // show usage
    if (!args || (args.length !== 3 && args.length !== 4)) {
        msg.channel.send('**Add a mention request that PM me when a game server changed to specific map**\nUsage: `!addmention <game> <ipaddr>:<port> <map> [color]`\nExample: `!addmention csgo example.com:27015 ze_* ff0000`\nSupported game list: <https://www.npmjs.com/package/gamedig#games-list>');
        return;
    }

    // get user input
    const [ type, hostaddr, map, colorHex ] = args;
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
    try {
        let query = await Gamedig.query({ type, host, port });
    }
    catch (err) {
        message.edit('❌ **Error: Game server is unavailable currently**');
        return;
    }

    // add mention request to db
    try {
        const docs = await db.mention.find({
            user: msg.author.id,
            host,
            port,
            map
        });

        if (docs.length > 0) {
            message.edit('❌ **This mention request is already in your mention list**');
            return;
        }

        await db.mention.insert({
            user: msg.author.id,
            type,
            host,
            port,
            map,
            color
        });
    }
    catch (err) {
        console.error(`Insert DB error: ${err.toString()}`);
        message.edit('❌ **Error: BOT backend database has encountered an error**');
        return;
    }

    await message.edit('✅ **Mention request has been added**');
}
