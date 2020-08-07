const { mongodb } = require('../requires');
const { transporter, acceptManager } = require('../nodemail');
const mongoClient = mongodb.MongoClient;
const objectId = mongodb.ObjectID;
const mongoUrl = process.env.MONGO_URL;
const dbName = 'crm';

const add = (req, res) => {
	if (req.cadre === 'user') return res.json({ status: false, msg: 'should be a manager to add user' });
	mongoClient.connect(mongoUrl, { useUnifiedTopology: true }, async (err, client) => {
		if (err) return res.json({ status: false, msg: 'refresh and try again', err });
		const db = client.db(dbName);
		const collection = db.collection('managers');
		const user = await collection.findOne({ email: req.body.email });
		let manager = await collection.findOne({ email: req.username });
		try {
			await collection.updateOne(
				{ email: req.username },
				{
					$push: {
						users: { email: user.email, name: `${user.firstname} ${user.lastname}`, activated: false }
					}
				}
			);
		} catch (error) {
			return res.json({ status: false, msg: 'unable to send mail' });
		}
		transporter.sendMail(
			acceptManager(req.body.email, `${manager.firstname} ${manager.lastname}`, user['_id'], manager['_id']),
			(err, info) => {
				if (err) {
					client.close();
					return res.json({ status: false, msg: 'Unable to send email', err });
				} else {
					client.close();
					return res.status(201).json({ status: true, msg: 'successfully added and activation mail sent' });
				}
			}
		);
	});
};

const accept = (req, res) => {
	mongoClient.connect(mongoUrl, { useUnifiedTopology: true }, async (err, client) => {
		if (err) return res.json({ status: false, msg: 'refresh and try again', err });
		const db = client.db(dbName);
		const collection = db.collection('managers');
		const user_Collection = db.collection('users');
		const user = await collection.findOne({ _id: new objectId(req.query.id) });
		if (!user) return res.json({ status: false, msg: 'user not found' });
		try {
			delete user.leads;
			delete user.users, delete user.contacts, delete user.services;
			user.token = '';
			user.cadre = 'user';
			await Promise.all([
				user_Collection.insertOne({ ...user }),
				collection.remove({ _id: new objectId(req.query.id) }),
				collection.updateOne(
					{ _id: req.query.mid },
					{ $set: { 'users.$[elem].activated': true } },
					{ multi: true, arrayFilters: [ { 'elem.email': user.email } ] }
				)
			]);
		} catch (error) {
			client.close();
			return res.json({ status: false, msg: 'retry, Mongo Error', err: error });
		}

		client.close();
		return redirect('https://localhost:3000/login');
	});
};

module.exports = { add, accept };
