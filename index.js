const { cors, bodyParser, express } = require('./server/requires');
const { tokenAuth } = require('./server/middleware');
const lead = require('./server/routes/lead');
const service = require('./server/routes/service');
const app = express();
app.use(bodyParser.json());
app.use(cors());

app.post('/api/register', require('./server/routes/register'));

app.post('/api/login', require('./server/routes/login'));

app.get('/api/activate/:id', require('./server/routes/activate'));

app.post('/api/forgot', require('./server/routes/forgot'));

app.post('/api/changepass', require('./server/routes/changepass'));

app.post('/api/createuser', tokenAuth, require('./server/routes/createuser'));

app.post('/api/removeuser', tokenAuth, require('./server/routes/removeuser'));

app.get('/api/getdetails', tokenAuth, require('./server/routes/getdetails'));

app.post('/api/cretalead', tokenAuth, lead.create);

app.post('/api/editlead', tokenAuth, lead.edit);

app.post('/api/makecontact', tokenAuth, require('./server/routes/makecontact'));

app.post('/api/startservice', tokenAuth, service.start);

app.post('/api/endservice', tokenAuth, service.end);

const port = process.env.PORT || 4200;
app.listen(port, () => console.log(`app is listening at port ${port}....`));
