const express = require('express')
const exphbs = require('express-handlebars')
const morgan = require('morgan')
const session = require('express-session')
const bodyParser = require('body-parser')

// express app
const app = express()

// Session
app.set('trust proxy', 1) // trust first proxy
app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60000 },
  })
)

// register view engine
app.engine('.hbs', exphbs({ extname: '.hbs' }))
app.set('view engine', '.hbs')
// app.set('views', 'dirname_of_views')

// public dir
app.use(express.static(__dirname + '/public'))

/* BODY PARSER */

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

/* * * * * * * */

// middleware
app.use(morgan('dev'))

const PORT = 3000

// VIEWS
app.get('/', (req, res) => {
  if (!req.session.user) {
    res.redirect('/login')
  } else {
    res.render('index', { user: req.session.user || 'Auth' })
  }
})
app.get('/login', (req, res) => {
  if (req.session.user) {
    console.log('user here')
    res.redirect('/')
  } else {
    res.render('login', { user: req.session.user || 'Auth' })
  }
})

// AUTH
app.post('/auth/login', (req, res) => {
  res.setHeader('Content-Type', 'text/plain')

  req.session.user = req.body.username

  res.redirect('/')
})

app.get('/auth/logout', (req, res) => {
  req.session.destroy()
  console.log('SESSION DESTROYED')
  res.end()
})

app.listen(PORT, () => {
  console.log('App started at port', PORT)
})
