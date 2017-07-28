const express = require('express')
const exphbs = require('express-handlebars')
const expressValidator = require('express-validator')
const session = require('express-session')
const bodyParser = require('body-parser')
const users = require('./users')
const app = express()

console.log(users)

// Configure view
app.engine('handlebars', exphbs())
app.set('views', './views')
app.set('view engine', 'handlebars')
// Configure statc files/ directory
app.use(express.static('Public'))
// Configure parser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: false
}))
// Validate information
app.use(expressValidator())

// Session Middleware
app.use(session({
  secret: 'farts',
  resave: false,
  saveUninitialized: true
}))

app.use((req, res, next) => {
  if (!req.session.users) {
    req.session.users = []
  }
  next()
})


app.get("/", (req, res) => {
  req.session.users.length === 0 ? res.redirect('/login') : res.render('home', {
    info: req.session.users
  })
})

app.get('/login', (req, res) => {
  req.session.users.length === 0 ? res.render('login') : res.redirect('/')
})

app.post("/login/auth", (req, res) => {
  // Validates that form has been entered correctly
  req.checkBody("userName", "Please provide a username").notEmpty();
  req.getValidationResult().then(function(result) {
    var errorsArray = result.array()
    if (errorsArray.length > 0) {
      res.render('login', {
        errors: errorsArray
      })
    } else {
      //Checks for existing username and password
      for (var i = 0; i < users.length; i++) {
        if (req.body.userName === users[i].userName && req.body.password === users[i].password) {
          (req.session.users).push(users[i])
          res.redirect('/')
        }
      }
    }
  })
})



// Port config
app.listen(3000, function() {
  console.log("listening on port 3000...")
})
