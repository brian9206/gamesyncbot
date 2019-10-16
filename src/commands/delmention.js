import db from '../database';

export default async function delmention(msg, args) {
    // show usage
    if (!args || args.length !== 2) {
        msg.channel.send('**Remove a mention request in your list**\nUsage: `!delmention <ipaddr>:<port> <map>`\nExample: `!delmention example.com:27015 ze_*');
        return;
    }

    // get user input
    const [ host, port ] = args[0].split(':', 2);
    const map = args[1];

    // notify user we received
    const message = await msg.channel.send(`🔍 **Deleting mention request...**\nHost: \`${host}:${port}\``);

    // delete server from db
    try {
        const docs = await db.mention.find({
            user: msg.author.id,
            host,
            port,
            map
        });

        if (docs.length == 0) {
            message.edit('❌ **This mention request is not in your list**');
            return;
        }

        await db.mention.remove({
            user: msg.author.id,
            host,
            port,
            map
        });
    }
    catch (err) {
        console.error(`Delete DB error: ${err.toString()}`);
        message.edit('❌ **Error: BOT backend database has encountered an error**');
        return;
    }

    await message.edit('✅ **Mention request has been deleted**');
}

