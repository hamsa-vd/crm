const { express, mongodb, bcrypt, jwt } = require('./requires');
const router = express.Router();
const { transporter, activateOptions, forgotOptions } = require('./nodemail');
const { tokenAuth } = require('./middleware');
const mongoClient = mongodb.MongoClient;
const objectId = mongodb.ObjectID;
const mongoUrl = process.env.MONGO_URL;
const dbName = 'crm';
router.post('/api/register', (req, res) => {
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
					users: []
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
});
router.post('/api/login', (req, res) => {
	mongoClient.connect(mongoUrl, async (err, client) => {
		if (err) return res.json({ status: false, msg: 'internal error, refresh and try again', err });
		const db = client.db(dbName);
		const collection = db.collection('managers');
		const user_Collection = db.collection('users');
		const [ manager_data, user_data ] = await Promise.all([
			collection.findOne({ email: req.body.username }),
			user_Collection.findOne({ email: req.body.username })
		]);
		const hash = manager_data || user_data;
		if (hash)
			if (hash.activated)
				bcrypt.compare(req.body.password, hash.password, async function(err, result) {
					if (err) {
						client.close();
						return res.status().json({ status: false, msg: 'invalid password' });
					}
					const token = jwt.sign({ username: req.body.username }, process.env.JWT_SECRET_KEY);
					if (Object.keys(hash).includes('users'))
						await collection.updateOne({ email: req.body.username }, { $set: { token: token } });
					else await user_Collection.updateOne({ email: req.body.username }, { $set: { token: token } });
					client.close();
					return res.status(200).json({
						status: true,
						msg: 'successfully logged in',
						out: { username: req.body.username, token: token }
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
});

router.get('/api/activate/:id', (req, res) => {
	mongoClient.connect(mongoUrl, async (err, client) => {
		if (err) return res.json({ status: false, msg: 'refresh and try again', err });
		const db = client.db(dbName);
		const collection = db.collection('managers');
		const user_Collection = db.collection('users');
		const [ manager_data, user_data ] = await Promise.all([
			collection.findOne({ _id: new objectId(req.params.id) }),
			user_Collection.findOne({ _id: new objectId(req.params.id) })
		]);
		const data = manager_data || user_data;
		if (data)
			if (manager_data)
				collection.updateOne(
					{ _id: new objectId(req.params.id) },
					{ $set: { activated: true } },
					(err, result) => {
						if (err) {
							client.close();
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
						{ arrayFilters: { 'elem.email': data.email } }
					);
					await user_Collection.updateOne({ _id: objectId(req.params.id) }, { $set: { activated: true } });
				} catch (error) {
					return res.json({ status: false, msg: 'unable to activate account' }, error);
				}
				return res.status(200).json({ status: true, msg: 'account successfully activated' });
			}
		else {
			client.close();
			return res.json({ status: false, msg: 'unable to activate account' });
		}
	});
});
router.post('/api/forgot', (req, res) => {
	mongoClient.connect(mongoUrl, async (err, client) => {
		if (err) return res.json({ status: false, msg: 'refresh and try again', err });
		const db = client.db(dbName);
		const collection = db.collection('managers');
		const user_Collection = db.collection('users');
		const [ managers_data, users_data ] = await Promise.all([
			collection.findOne({ email: req.body.email }),
			user_Collection.findOne({ email: req.body.email })
		]);
		const data = managers_data || users_data;
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
});

router.post('/api/changepass', (req, res) => {
	mongoClient.connect(mongoUrl, async (err, client) => {
		if (err) return res.json({ status: false, msg: 'refresh and try again', err });
		const db = client.db(dbName);
		const collection = db.collection('managers');
		const user_Collection = db.collection('users');
		const [ managers_data, users_data ] = await Promise.all([
			collection.findOne({ _id: new objectId(req.body.id) }),
			user_Collection.findOne({ _id: new objectId(req.body.id) })
		]);
		const data = managers_data || users_data;
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
				else {
					await Promise.all([
						user_Collection.updateOne({ _id: new objectId(req.body.id) }, { $set: { password: hash } }),
						collection.updateOne(
							{ email: users_data.head },
							{ $set: { 'users.$elem.password': hash } },
							{ arrayFilters: { 'elem.email': users_data.email } }
						)
					]);
				}
			});
		} else {
			client.close();
			return res.json({ status: false, msg: 'no such id is found' });
		}
	});
});

router.get('/api/all', (req, res) => {
	mongoClient.connect(mongoUrl, async (err, client) => {
		if (err) return res.json({ status: false, msg: 'refresh and try again', err });
		const db = client.db(dbName);
		const collection = db.collection('managers');
		const data = await collection.find({}).toArray();
		client.close();
		return res.json({ status: true, out: data });
	});
});

router.post('/api/create', (req, res) => {
	mongoClient.connect(mongoUrl, async (err, client) => {
		if (err) return res.json({ status: false, msg: 'refresh and try again', err });
		const db = client.db(dbName);
		const collection = db.collection('managers');
		const user_Collection = db.collection('users');
		let data = user_Collection.findOne({ email: req.username });
		if (!data) return res.json({ status: false, msg: 'user already exists', err });
		collection.updateOne({ email: req.username }, { $push: { users: req.body } });
		user_Collection.insertOne({ ...req.body, activated: false });
		data = await user_Collection.findOne({ email: req.body.email });
		await transporter.sendMail(activateOptions(req.body.email, data['_id']), (err, info) => {
			if (err) {
				collection.remove({ _id: data['_id'] });
				return res.json({ status: false, msg: 'Unable to send email', err });
			} else return res.status(201).json({ status: true, msg: 'successfully added and activation mail sent' });
		});
		return res.json({ status: false, msg: 'successfully added but activation mail not sent' });
	});
});

router.get('api/details', (req, res) => {
	mongoClient.connect(mongoUrl, async (err, client) => {
		if (err) return res.json({ status: false, msg: 'internal server error' });
		const db = client.db(dbName);
		const collection = db.collection('managers');
		const user_Collection = db.collection('users');
		const [ managers_data, users_data ] = await Promise.all([
			collection.findOne({ email: req.email }),
			user_Collection.findOne({ email: req.email })
		]);
		if (managers_data) {
			for (let i of managers_data.users) delete i.password;
			return req.json({ status: true, data: managers_data.users, msg: 'data received', create: true });
		}
		const head_data = await collection.findOne({ email: users_data.head });
		for (let i of head_data.users) delete i.password;
		return res.json({ status: true, data: head_data.users, msg: 'data received', create: false });
	});
});

module.exports = { router };
