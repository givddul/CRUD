import { userModel } from '../model/user.js'

export const controller = {

  registerForm: (req, res) => {
    res.render('register', { flashMessage: res.data.flashMessage })
  },

  register: async (req, res, next) => {
    try {
      const { username, password } = req.body
      const existingUser = await userModel.findByUsername(username)

      if (existingUser) {
        // If the user already exists, set a flash message
        req.session.flashMessage = 'Username already exists. Choose a different username.'
        res.redirect('/user/register')
      } else {
        // If the user does not exist, proceed with registration
        await userModel.createUser(username, password)
        res.redirect('/user/login')
      }
    } catch (error) {
      next(error)
    }
  },

  login: (req, res) => {
    res.render('login', { flashMessage: res.data.flashMessage })
  },

  loginProcess: async (req, res, next) => {
    try {
      const { username, password } = req.body
      const user = await userModel.authenticateUser(username, password)

      if (user) {
        req.session.user = { _id: user._id, username: user.username }
        res.redirect('/snippet/')
      } else {
        req.session.flashMessage = 'Couldn´t find a user with that username and password, please try again'
        res.redirect('/user/login')
      }
    } catch (error) {
      next(error)
    }
  },

  logout: (req, res) => {
    if (req.session) {
      req.session.destroy((err) => {
        if (err) {
          console.error('Session destruction error:', err)
        } else {
          res.redirect('/snippet/')
        }
      })
    } else {
      res.redirect('/snippet/')
    }
  }

}
