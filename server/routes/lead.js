const { mongodb } = require('../requires');
const mongoClient = mongodb.MongoClient;
const mongoUrl = process.env.MONGO_URL;
const dbName = 'crm';

const create = (req, res) => res.json({ msg: 'thank U for visiting' });

const edit = (req, res) => res.json({ msg: 'thank U for Visiting' });

module.exports = { create, edit };
