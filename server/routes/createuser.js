const { mongodb, bcrypt } = require('../requires');
const { transporter, activateOptions } = require('../nodemail');
const mongoClient = mongodb.MongoClient;
const mongoUrl = process.env.MONGO_URL;
const dbName = 'crm';

module.exports = (req, res) => {
	if (req.cadre === 'user') return res.json({ status: false, msg: "You Don't have authorization" });
	mongoClient.connect(mongoUrl, { useUnifiedTopology: true }, async (err, client) => {
		if (err) return res.json({ status: false, msg: 'refresh and try again', err });
		const db = client.db(dbName);
		const collection = db.collection('managers');
		const user_Collection = db.collection('users');
		const collections = await db.listCollections({}, { nameOnly: true }).toArray();
		let data = false;
		if (collections.some((v) => v.name === 'users'))
			data = await user_Collection.findOne({ email: req.body.email });
		if (data) return res.json({ status: false, msg: 'user already exists', err });
		bcrypt.hash(req.body.password, 10, async function(err, hash) {
			if (err) return res.json({ status: false, msg: 'internal error try again', err });
			const forManager = {
				email: req.body.email,
				name: `${req.body.firstname} ${req.body.lastname}`,
				activated: false
			};
			try {
				await Promise.all([
					collection.updateOne({ email: req.username }, { $push: { users: forManager } }),
					user_Collection.insertOne({
						...req.body,
						activated: false,
						head: req.username,
						cadre: 'user',
						password: hash
					})
				]);
			} catch (error) {
				console.log(error);
				return res.json({ status: false, msg: 'Mongo Error', error });
			}
			data = await user_Collection.findOne({ email: req.body.email });
			transporter.sendMail(activateOptions(req.body.email, data['_id']), (err, info) => {
				if (err) {
					collection.remove({ _id: data['_id'] });
					client.close();
					return res.json({ status: false, msg: 'Unable to send email', err });
				} else {
					client.close();
					return res.status(201).json({ status: true, msg: 'successfully added and activation mail sent' });
				}
			});
		});
	});
};
