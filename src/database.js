import Datastore from 'nedb-promises';

// init db
const db = Datastore.create({
    filename: 'bot.db'
});

db.persistence.setAutocompactionInterval(60 * 1000);

export default db;
