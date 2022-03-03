const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const HomeController = require('./controllers/HomeController');
const SessionController = require('./controllers/SessionController');
const UserController = require('./controllers/UserController');
const CourseController = require('./controllers/CourseController');

const app = express();
app.set('view engine', 'ejs');
app.set('views', './views');

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8888');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// app.get('/', (req, res) => {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.render('pages/home', { msg: 'Home Page' });
// });

// controllers
HomeController(app);
SessionController(app);
UserController(app);
CourseController(app);

app.listen(8000, () => {
  console.log('Running server on http://localhost:8000/');
});