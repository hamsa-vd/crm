const { jwt } = require('./requires');

function tokenAuth(req, res, next) {
	const authHeader = req.headers['authorization'];
	const token = authHeader && authHeader.split(' ')[1];
	if (token)
		jwt.verify(token, process.env.JWT_SECRET_KEY, (err, username) => {
			if (err) res.json({ msg: 'token expired relogin' });
			req.username = username.username;
			next();
		});
	else return res.json({ msg: 'Bearer Authorization required' });
}

module.exports = { tokenAuth };
