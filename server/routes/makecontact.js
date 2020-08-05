const { mongodb } = require('../requires');
const mongoClient = mongodb.MongoClient;
const mongoUrl = process.env.MONGO_URL;
const dbName = 'crm';

module.exports = (req, res) => {
	if (req.cadre === 'user') return res.json({ status: false, msg: 'You are not Authorized' });
	mongoClient.connect(mongoUrl, { useUnifiedTopology: true }, async (err, client) => {
		if (err) return res.json({ status: false, msg: 'Mongo Error, Retry!!', err });
		const db = client.db(dbName);
		const collection = db.collection('managers');
		let data = await collection.findOne({ email: req.username });
		const lead = data.leads.find((v) => v.email === req.body.email);
		delete lead.status;
		try {
			await collection.updateOne(
				{ email: req.username },
				{ $pull: { leads: { email: req.params.email } }, $push: { contacts: lead } }
			);
			data = await collection.findOne({ email: req.username });
		} catch (err) {
			return res.json({ status: false, msg: 'Internal server Error' });
		}
		return res.json({
			status: true,
			msg: 'sucessfully added',
			out: { leads: data.leads, contacts: data.contacts }
		});
	});
};
