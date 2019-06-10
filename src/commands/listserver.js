import db from '../database';

export default async function listserver(msg) {
    const message = await msg.channel.send(`🔍 **Gathering information...**`);

    try {
        const docs = await db.find({
            channel: msg.channel.id
        });

        if (docs.length === 0) {
            message.edit('❌ **No game server is in the tracking list in this channel**');
            return;
        }

        message.edit(docs.map((doc, index) => `${index + 1}. ${doc.host}:${doc.port} - ${doc.type}`).join('\n'));
    }
    catch (err) {
        console.error(`Query DB error: ${err.toString()}`);
        message.edit('❌ **Error: BOT backend database has encountered an error**');
        return;
    }
}
