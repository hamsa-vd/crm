const { mongodb } = require('../requires');
const mongoClient = mongodb.MongoClient;
const mongoUrl = process.env.MONGO_URL;
const dbName = 'crm';

const create = (req, res) => {
	if (req.cadre === 'user') return res.json({ status: false, msg: 'You are not Authorized' });
	mongoClient.connect(mongoUrl, { useUnifiedTopology: true }, async (err, client) => {
		if (err) return res.json({ status: false, msg: 'Mongo Error, Retry!!', err });
		const db = client.db(dbName);
		const collection = db.collection('managers');
		let data = await collection.findOne({ email: req.username });
		if (data.leads.some((v) => v.email === req.body.email))
			return res.json({ status: false, msg: 'lead with this email already exists' });
		try {
			await collection.updateOne({ email: req.username }, { $push: { leads: req.body } });
			data = await collection.findOne({ email: req.username });
		} catch (error) {
			return res.json({ status: false, msg: 'Internal Server Error', err: error });
		}
		client.close();
		return res.json({ status: true, msg: 'Successfully added', out: data.leads });
	});
};

const edit = (req, res) => {
	if (req.cadre === 'user') return res.json({ status: false, msg: 'You are not Authorized' });
	mongoClient.connect(mongoUrl, { useUnifiedTopology: true }, async (err, client) => {
		if (err) return res.json({ status: false, msg: 'Mongo Error, Retry!!', err });
		const db = client.db(dbName);
		const collection = db.collection('managers');
		let data = await collection.findOne({ email: req.username });
		try {
			await collection.updateOne(
				{ email: req.username },
				{ $set: { 'leads.$[elem].status': req.body.status } },
				{
					multi: true,
					arrayFilters: [
						{
							'elem.email': req.body.email
						}
					]
				}
			);
			data = await collection.findOne({ email: req.username });
		} catch (err) {
			client.close();
			return res.json({ status: false, msg: 'internal error Occurred', err });
		}
		client.close();
		return res.json({ status: true, msg: 'successfully updated', out: data.leads });
	});
};

module.exports = { create, edit };
