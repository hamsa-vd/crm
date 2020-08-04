const { cors, bodyParser, express } = require('./server/requires');
const { router } = require('./server/router');
const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(router);

const port = process.env.PORT || 4200;
app.listen(port, () => console.log(`app is listening at port ${port}....`));
