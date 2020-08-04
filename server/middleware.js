const { jwt } = require('./requires');

function tokenAuth(req, res, next) {
	const authHeader = req.headers['authorization'];
	const token = authHeader && authHeader.split(' ')[1];
	if (token)
		jwt.verify(token, process.env.JWT_SECRET_KEY, (err, { username, cadre }) => {
			if (err) return res.json({ msg: 'token expired re-login' });
			req.username = username;
			req.cadre = cadre;
			console.log(username, cadre);
			next();
		});
	else return res.json({ msg: 'Bearer Authorization required' });
}

module.exports = { tokenAuth };
