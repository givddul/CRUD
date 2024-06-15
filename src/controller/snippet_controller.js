import { snippetModel } from '../model/snippet.js'

export const controller = {

  create: async (req, res, next) => {
    try {
      const code = req.body.code
      const userId = req.session.user ? req.session.user._id : null

      await snippetModel.create(code, userId)
      res.redirect('/snippet')
    } catch (error) {
      next(error)
    }
  },

  isLoggedIn: (req, res, next) => {
    // checks if the user is logged in by checking if the session contains a user
    if (req.session && req.session.user) {
      next()
    } else {
      // req.session.flashMessage = 'Unauthorized. Please login to continue.';
      res.status(403).send('Forbidden: Unauthorized access.')
    }
  },

  read: async (req, res, next) => {
    try {
      const snippets = await snippetModel.readAll()
      res.render('read', { texts: snippets, flashMessage: res.data.flashMessage })
    } catch (error) {
      next(error)
    }
  },

  update: async (req, res, next) => {
    try {
      const { id } = req.params
      const newCode = req.body.code
      const snippet = await snippetModel.findById(id)

      // checks if the user is the owner of the snippet
      if (snippet.userId._id.toString() === req.session.user._id.toString()) {
        await snippetModel.update(id, newCode)
        res.redirect('/snippet')
      } else {
        res.status(403).send('Forbidden: Unauthorized access.')

        // req.session.flashMessage = 'Unauthorized to update this snippet.'
        // res.redirect('/snippet/read')
      }
    } catch (error) {
      next(error)
    }
  },

  delete: async (req, res, next) => {
    try {
      const { id } = req.params
      const snippet = await snippetModel.findById(id)

      // checks if the user is the owner of the snippet
      if (snippet.userId._id.toString() === req.session.user._id.toString()) {
        await snippetModel.delete(id)
        res.redirect('/snippet')
      } else {
        res.status(403).send('Forbidden: Unauthorized access.')

        // req.session.flashMessage = 'Unauthorized to delete this snippet.'
        // res.redirect('/snippet/read')
      }
    } catch (error) {
      next(error)
    }
  },

  showCreateForm: (req, res) => {
    res.render('create')
  },

  showUpdateForm: async (req, res, next) => {
    try {
      const { id } = req.params
      const snippet = await snippetModel.findById(id)
      res.render('update', { text: snippet, flashMessage: res.data.flashMessage })
    } catch (error) {
      next(error)
    }
  }
}
