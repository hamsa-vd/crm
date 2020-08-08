const { cors, bodyParser, express } = require('./server/requires');
const { tokenAuth } = require('./server/middleware');
const lead = require('./server/routes/lead');
const service = require('./server/routes/service');
const user = require('./server/routes/adduser');
const app = express();
app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => res.sendFile(__dirname + '/server/static/index.html'));

app.post('/api/register', require('./server/routes/register'));

app.post('/api/login', require('./server/routes/login'));

app.patch('/api/activate/:id', require('./server/routes/activate'));

app.post('/api/forgot', require('./server/routes/forgot'));

app.patch('/api/changepass', require('./server/routes/changepass'));

app.put('/api/adduser', tokenAuth, user.add);

app.post('/api/useraccept', user.accept);

app.post('/api/createuser', tokenAuth, require('./server/routes/createuser'));

app.delete('/api/removeuser', tokenAuth, require('./server/routes/removeuser'));

app.get('/api/getdetails', tokenAuth, require('./server/routes/getdetails'));

app.post('/api/createlead', tokenAuth, lead.create);

app.patch('/api/editlead', tokenAuth, lead.edit);

app.put('/api/makecontact/:email', tokenAuth, require('./server/routes/makecontact'));

app.post('/api/startservice', tokenAuth, service.start);

app.patch('/api/editservice', tokenAuth, service.edit);

app.post('/api/checkPass', tokenAuth, user.check);

const port = process.env.PORT || 4200;
app.listen(port, () => console.log(`app is listening at port ${port}....`));
