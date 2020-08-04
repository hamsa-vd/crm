const { mongodb } = require('../requires');
const { transporter, forgotOptions } = require('../nodemail');
const mongoClient = mongodb.MongoClient;
const mongoUrl = process.env.MONGO_URL;
const dbName = 'crm';

module.exports = (req, res) => {
	mongoClient.connect(mongoUrl, async (err, client) => {
		if (err) return res.json({ status: false, msg: 'refresh and try again', err });
		const db = client.db(dbName);
		const collection = db.collection('managers');
		const user_Collection = db.collection('users');
		const collections = await db.listCollections({}, { nameOnly: true }).toArray();
		let data = false;
		if (collections.some((v) => v.name === 'users')) {
			const [ manager_data, user_data ] = await Promise.all([
				collection.findOne({ email: req.body.email }),
				user_Collection.findOne({ email: req.body.email })
			]);
			data = manager_data || user_data;
		} else {
			const manager_data = await collection.findOne({ email: req.body.email });
			data = manager_data;
		}
		if (data) {
			client.close();
			await transporter.sendMail(forgotOptions(req.body.email, data['_id']), (err, info) => {
				if (err) return res.json({ status: false, msg: 'Unable to send email', err });
				else return res.status(201).json({ status: true, msg: 'change password' });
			});
		} else {
			client.close();
			return res.json({ status: false, msg: 'no such email is found' });
		}
	});
};
