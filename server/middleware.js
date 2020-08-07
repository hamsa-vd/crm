const { jwt } = require('./requires');

function tokenAuth(req, res, next) {
	const authHeader = req.headers['authorization'];
	const token = authHeader && authHeader.split(' ')[1];
	console.log(token);
	if (token) {
		jwt.verify(token, process.env.JWT_SECRET_KEY, (err, a) => {
			if (err) return res.json({ msg: 'token expired re-login' });
			console.log(a);
			req.username = a.username;
			req.cadre = a.cadre;
			next();
		});
	} else return res.json({ msg: 'Bearer Authorization required' });
}

module.exports = { tokenAuth };
