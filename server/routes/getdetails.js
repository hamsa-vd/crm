const { mongodb } = require('../requires');
const mongoClient = mongodb.MongoClient;
const mongoUrl = process.env.MONGO_URL;
const dbName = 'crm';

module.exports = (req, res) => {
	mongoClient.connect(mongoUrl, { useUnifiedTopology: true }, async (err, client) => {
		if (err) return res.json({ status: false, msg: 'Mongo Error', err });
		const db = client.db(dbName);
		const collection = db.collection(`${req.cadre}s`);
		const data = await collection.findOne({ email: req.username });
		console.log(data.users, data.leads, data.services, data.contacts);
		return res.json({
			status: true,
			out: {
				users: data.users,
				leads: data.leads,
				contacts: data.contacts,
				services: data.services
			}
		});
	});
};
