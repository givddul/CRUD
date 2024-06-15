import express from 'express'
import { controller } from '../controller/user_controller.js'

const router = express.Router()

router.get('/login', controller.login)
router.post('/login', controller.loginProcess)
router.get('/logout', controller.logout)
router.get('/register', controller.registerForm)
router.post('/register', controller.register)

export default router
