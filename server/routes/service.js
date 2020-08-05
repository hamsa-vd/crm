const { mongodb } = require('../requires');
const mongoClient = mongodb.MongoClient;
const mongoUrl = process.env.MONGO_URL;
const dbName = 'crm';

const start = (req, res) => {
	if (req.cadre === 'user') return res.json({ status: false, msg: 'You are not Authorized' });
	mongoClient.connect(mongoUrl, { useUnifiedTopology: true }, async (err, client) => {
		if (err) return res.json({ status: false, msg: 'Mongo Error, Retry!!', err });
		const db = client.db(dbName);
		const collection = db.collection('managers');
		let data = await collection.findOne({ email: req.username });
		if (data.services.some((v) => v.customer === req.body.customer && v.name === req.body.name))
			return res.json({ status: true, msg: `${req.body.name} with  ${req.body.customer} already exists` });
		try {
			await collection.updateOne({ email: req.username }, { $push: { services: req.body } });
			data = await collection.findOne({ email: req.username });
		} catch (error) {
			return res.json({ status: true, msg: 'Internal Server Error', err: error });
		}
		client.close();
		return res.json({ status: true, msg: 'Successfully added', out: data.services });
	});
};

const edit = (req, res) => {
	if (req.cadre === 'user') return res.json({ status: false, msg: 'You are not Authorized' });
	mongoClient.connect(mongoUrl, { useUnifiedTopology: true }, async (err, client) => {
		if (err) return res.json({ status: false, msg: 'Mongo Error, Retry!!', err });
		const db = client.db(dbName);
		const collection = db.collection('managers');
		let data = await collection.findOne({ email: req.username });
		if (!data.services.some((v) => v.name === req.body.name && v.customer === req.body.customer))
			return res.json({ status: true, msg: `${req.body.name} with  ${req.body.customer} doesn't exist` });
		try {
			await collection.updateOne(
				{ email: req.username },
				{ $set: { 'services.$[elem].status': req.body.status } },
				{
					multi: true,
					arrayFilters: [ { 'elem.customer': req.body.customer, 'elem.name': req.body.name } ]
				}
			);
		} catch (err) {
			return res.json({ status: false, mdg: 'Internal Server Error', err });
		}
		data = await collection.findOne({ email: req.username });
		client.close();
		return res.json({ status: true, msg: 'successfully updated', out: data.services });
	});
};

module.exports = { start, edit };
