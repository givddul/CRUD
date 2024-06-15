import express from 'express'
import logger from 'morgan'
import session from 'express-session'
import snippetRoute from './route/snippet_route.js'
import userRoute from './route/user_route.js'

const app = express()
app.set('view engine', 'ejs')

// Enable the session
app.use(session({
  cookie: { maxAge: 600000 },
  resave: false,
  saveUninitialized: true,
  secret: 'keyboard cat'
}))

app.use((req, res, next) => {
  res.data = {}
  res.data.flashMessage = null
  if (req.session && req.session.flashMessage) {
    res.data.flashMessage = req.session.flashMessage
    req.session.flashMessage = null
  }
  next()
})

app.use((req, res, next) => {
  res.locals.user = req.session.user
  next()
})

app.use(logger('dev'))
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use('/user', userRoute)
app.use('/snippet', snippetRoute)

// If non of the routs above match, we will respond with a 404 Not Found
app.use((req, res) => {
  res.status(404).send('404 Not Found: The requested resource could not be found.')
})

// Lastly, the 500 Internal Server Error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('500 Internal Server Error: Something went wrong on the server.')
})

export default (port = 3000) => {
  app.listen(port, () => {
    const border = `\n ${'-'.repeat(49)}\n`
    console.log(`${border}| Link to my CRUD website: http://localhost:${port}/snippet |${border}`)
  })
}
