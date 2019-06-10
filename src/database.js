import Datastore from 'nedb-promises';

// init db
const db = Datastore.create({
    filename: 'db/tracking.db'
});

db.persistence.setAutocompactionInterval(60 * 1000);

export default db;
