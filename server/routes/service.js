const { mongodb } = require('../requires');
const mongoClient = mongodb.MongoClient;
const mongoUrl = process.env.MONGO_URL;
const dbName = 'crm';

const start = (req, res) => res.json({ msg: 'thank U for visiting' });

const end = (req, res) => res.json({ msg: 'thank U for Visiting' });

module.exports = { start, end };
