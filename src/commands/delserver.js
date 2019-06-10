import db from '../database';

export default async function delserver(msg, args) {
    // show usage
    if (!args || args.length !== 1) {
        msg.channel.send('**Delete a game server from the tracking list in this channel**\nUsage: `!delserver <ipaddr>:<port>`\nExample: `!delserver example.com:27015');
        return;
    }

    // get user input
    const [ host, port ] = args[0].split(':', 2);

    // notify user we received
    const message = await msg.channel.send(`🔍 **Deleting game server...**\nHost: \`${host}:${port}\``);

    // delete server from db
    try {
        const docs = await db.find({
            channel: msg.channel.id,
            host,
            port
        });

        if (docs.length == 0) {
            message.edit('❌ **This game server is not in the tracking list**');
            return;
        }

        await db.remove({
            channel: msg.channel.id,
            host,
            port
        });
    }
    catch (err) {
        console.error(`Delete DB error: ${err.toString()}`);
        message.edit('❌ **Error: BOT backend database has encountered an error**');
        return;
    }

    await message.edit('✅ **Game server has been deleted**');
}

