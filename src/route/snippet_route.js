import express from 'express'
import { controller } from '../controller/snippet_controller.js'

const router = express.Router()

router.get('/', controller.read)
router.get('/create', controller.showCreateForm)
router.post('/create', controller.create)
router.get('/update/:id', controller.isLoggedIn, controller.showUpdateForm)
router.post('/update/:id', controller.isLoggedIn, controller.update)
router.get('/delete/:id', controller.isLoggedIn, controller.delete)

export default router
