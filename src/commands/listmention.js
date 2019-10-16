import db from '../database';

export default async function listmention(msg) {
    const message = await msg.channel.send(`🔍 **Gathering information...**`);

    try {
        const docs = await db.mention.find({
            user: msg.author.id
        });

        if (docs.length === 0) {
            message.edit('❌ **No mention request is in the your list**');
            return;
        }

        message.edit(docs.map((doc, index) => `${index + 1}. ${doc.host}:${doc.port} - ${doc.type} - \`${doc.map}\``).join('\n'));
    }
    catch (err) {
        console.error(`Query DB error: ${err.toString()}`);
        message.edit('❌ **Error: BOT backend database has encountered an error**');
        return;
    }
}
