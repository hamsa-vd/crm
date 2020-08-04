const { mongodb } = require('../requires');
const mongoClient = mongodb.MongoClient;
const objectId = mongodb.ObjectID;
const mongoUrl = process.env.MONGO_URL;
const dbName = 'crm';

module.exports = (req, res) => {
	mongoClient.connect(mongoUrl, { useUnifiedTopology: true }, async (err, client) => {
		if (err) return res.json({ status: false, msg: 'refresh and try again', err });
		const db = client.db(dbName);
		const collection = db.collection('managers');
		const user_Collection = db.collection('users');
		const collections = await db.listCollections({}, { nameOnly: true }).toArray();
		let data = false,
			manager_data = true,
			user_data = false;
		if (collections.some((v) => v.name === 'users')) {
			[ manager_data, user_data ] = await Promise.all([
				collection.findOne({ _id: new objectId(req.params.id) }),
				user_Collection.findOne({ _id: new objectId(req.params.id) })
			]);
			data = manager_data || user_data;
		} else {
			manager_data = await collection.findOne({ _id: new objectId(req.params.id) });
			data = manager_data;
		}
		if (data)
			if (manager_data)
				collection.updateOne(
					{ _id: new objectId(req.params.id) },
					{ $set: { activated: true } },
					(err, result) => {
						if (err) {
							client.close();
							console.log(error);
							return res.json({ status: false, msg: 'unable to activate account', err });
						}
						return res.status(200).json({ status: true, msg: 'account successfully activated' });
					}
				);
			else {
				try {
					await collection.updateOne(
						{ email: user_data.head },
						{ $set: { 'users.$[elem].activated': true } },
						{ multi: true, arrayFilters: [ { 'elem.email': data.email } ] }
					);
					await user_Collection.updateOne({ _id: objectId(req.params.id) }, { $set: { activated: true } });
				} catch (error) {
					console.log(error);
					return res.json({ status: false, msg: 'unable to activate account' }, error);
				}
				return res.status(200).json({ status: true, msg: 'account successfully activated' });
			}
		else {
			client.close();
			console.log('haha');
			return res.json({ status: false, msg: 'unable to activate account' });
		}
	});
};
