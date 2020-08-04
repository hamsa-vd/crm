const { mongodb, bcrypt } = require('../requires');
const { transporter, activateOptions } = require('../nodemail');
const mongoClient = mongodb.MongoClient;
const mongoUrl = process.env.MONGO_URL;
const dbName = 'crm';

module.exports = (req, res) => {
	mongoClient.connect(mongoUrl, async (err, client) => {
		if (err) return res.json({ status: false, msg: 'internal error try again', err });
		const db = client.db(dbName);
		const collection = db.collection('managers');
		const emailcheck = await collection.findOne({ email: req.body.email });
		if (!emailcheck)
			bcrypt.hash(req.body.password, 10, async function(err, hash) {
				if (err) return res.json({ status: false, msg: 'internal error try again', err });
				await collection.insertOne({
					...req.body,
					password: hash,
					token: '',
					activated: false,
					users: [],
					cadre: 'manager',
					leads: [],
					contacts: [],
					services: []
				});
				const data = await collection.findOne({ email: req.body.email });
				await transporter.sendMail(activateOptions(req.body.email, data['_id']), (err, info) => {
					if (err) {
						collection.remove({ _id: data['_id'] });
						return res.json({ status: false, msg: 'Unable to send email', err });
					} else
						return res
							.status(201)
							.json({ status: true, msg: 'successfully added and activation mail sent' });
				});
			});
		else {
			client.close();
			return res.json({ status: false, msg: 'email already exists' });
		}
	});
};
