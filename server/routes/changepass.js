const { mongodb, bcrypt } = require('../requires');
const mongoClient = mongodb.MongoClient;
const objectId = mongodb.ObjectID;
const mongoUrl = process.env.MONGO_URL;
const dbName = 'crm';

module.exports = (req, res) => {
	mongoClient.connect(mongoUrl, async (err, client) => {
		if (err) return res.json({ status: false, msg: 'refresh and try again', err });
		const db = client.db(dbName);
		const collection = db.collection('managers');
		const user_Collection = db.collection('users');
		const collections = await db.listCollections({}, { nameOnly: true }).toArray();
		let data = false,
			managers_data = true,
			users_data = false;
		if (collections.some((v) => v.name === 'users')) {
			const [ managers_data, users_data ] = await Promise.all([
				collection.findOne({ _id: new objectId(req.body.id) }),
				user_Collection.findOne({ _id: new objectId(req.body.id) })
			]);
			data = managers_data || users_data;
		} else {
			const managers_data = await collection.findOne({ _id: new objectId(req.body.id) });
			data = managers_data;
		}
		if (data) {
			bcrypt.hash(req.body.password, 10, async function(err, hash) {
				if (err) return res.json({ status: false, msg: 'internal error, try again', err });
				if (managers_data)
					collection.updateOne(
						{ _id: new objectId(req.body.id) },
						{ $set: { password: hash } },
						(err, result) => {
							client.close();
							if (err) return res.json({ status: false, msg: 'unable to update account', err });
							return res.status(200).json({ status: true, msg: 'password successfully updated' });
						}
					);
				else await user_Collection.updateOne({ _id: new objectId(req.body.id) }, { $set: { password: hash } });
			});
		} else {
			client.close();
			return res.json({ status: false, msg: 'no such id is found' });
		}
	});
};
