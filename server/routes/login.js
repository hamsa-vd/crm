const { mongodb, jwt, bcrypt } = require('../requires');
const mongoClient = mongodb.MongoClient;
const mongoUrl = process.env.MONGO_URL;
const dbName = 'crm';

module.exports = (req, res) => {
	mongoClient.connect(mongoUrl, { useUnifiedTopology: true }, async (err, client) => {
		if (err) return res.json({ status: false, msg: 'internal error, refresh and try again', err });
		const db = client.db(dbName);
		const collections = await db.listCollections({}, { nameOnly: true }).toArray();
		const collection = db.collection('managers');
		const user_Collection = db.collection('users');
		let hash = false,
			manager_data = true,
			user_data = false;
		if (collections.some((v) => v.name === 'users')) {
			[ manager_data, user_data ] = await Promise.all([
				collection.findOne({ email: req.body.username }),
				user_Collection.findOne({ email: req.body.username })
			]);
			hash = manager_data || user_data;
		} else {
			manager_data = await collection.findOne({ email: req.body.username });
			hash = manager_data;
		}
		if (hash)
			if (hash.activated)
				bcrypt.compare(req.body.password, hash.password, async function(err, result) {
					if (err) {
						client.close();
						return res.status().json({ status: false, msg: 'invalid password' });
					}
					console.log(req.body.username);
					const token = jwt.sign(
						{ username: req.body.username, cadre: hash.cadre },
						process.env.JWT_SECRET_KEY
					);
					if (Object.keys(hash).includes('users'))
						await collection.updateOne({ email: req.body.username }, { $set: { token: token } });
					else await user_Collection.updateOne({ email: req.body.username }, { $set: { token: token } });
					client.close();
					return res.status(200).json({
						status: true,
						msg: 'successfully logged in',
						out: { username: req.body.username, token: token, cadre: hash.cadre }
					});
				});
			else {
				client.close();
				return res.json({ status: false, msg: 'activate your account' });
			}
		else {
			client.close();
			return res.json({ status: false, msg: "username doesn't exist" });
		}
	});
};
