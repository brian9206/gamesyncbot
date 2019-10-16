import Datastore from 'nedb-promises';

// init db
const db = Datastore.create({
    filename: 'db/tracking.db'
});

db.persistence.setAutocompactionInterval(60 * 1000);

const mentiondb = Datastore.create({
    filename: 'db/mentions.db'
});

mentiondb.persistence.setAutocompactionInterval(60 * 1000);

db.mention = mentiondb;
export default db;
