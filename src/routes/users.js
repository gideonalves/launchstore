const express = require('express')
const routes = express.Router() 


const SessionController = require('../app/controllers/SessionController')
const UserController = require('../app/controllers/UserController')

const UserValidator = require('../app/validators/user')
const SessionValidator = require('../app/validators/session')

// login/logout
routes.get('/login', SessionController.loginForm)
routes.post('/login',SessionValidator.login, SessionController.login)
routes.post('/logout', SessionController.logout)

// reset password / forgot
// routes.get('/forgot-password', SearchController.forgotForm) // forgot = esqueci
// routes.get('/password-reset', SearchController.resetForm)
// routes.post('/forgot-password', SearchController.forgot) 
// routes.post('/password-reset', SearchController.reset) 

// user register UserController
routes.get('/register', UserController.registerForm)
routes.post('/register', UserValidator.post, UserController.post)

routes.get('/', UserValidator.show, UserController.show)
routes.put('/', UserValidator.update, UserController.update)
// routes.delete('/', UserController.delete)



module.exports = routes

