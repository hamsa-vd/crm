const { mongodb, bcrypt } = require('../requires');
const mongoClient = mongodb.MongoClient;
const mongoUrl = process.env.MONGO_URL;
const dbName = 'crm';

module.exports = (req, res) => {
	if (req.cadre === 'user') return res.json({ status: false, msg: "you don't have Authorization" });
	mongoClient.connect(mongoUrl, { useUnifiedTopology: true }, async (err, client) => {
		if (err) return res.json({ status: false, msg: 'Mongo error', err });
		const db = client.db(dbName);
		const collection = db.collection('managers');
		const user_Collection = db.collection('users');
		const manager_data = await collection.findOne({ email: req.username });
		bcrypt.compare(manager_data.password, req.body.password, async (err, result) => {
			if (err) return res.json({ status: false, msg: 'server error, try again !!' });
			try {
				await Promise.all([
					collection.updateOne({ email: req.username }, { $pull: { users: { email: req.body.email } } }),
					user_Collection.remove({ email: req.body.email })
				]);
				client.close();
			} catch (error) {
				console.log(error);
				return res.json({ status: true, msg: 'unable to remove user, retry!!' });
			}
			return res.json({ status: true, msg: `successfully deleted user:${req.body.email}` });
		});
	});
};
