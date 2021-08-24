const express = require('express')
const routes = express.Router() 


const SessionController = require('../app/controllers/SearchController')
const UserController = require('../app/controllers/UserController')

const Validator = require('../app/validators/user')


// login/logout
// routes.get('/login', SessionController.loginForm)
// routes.post('/login', SessionController.login)
// routes.post('/login', SessionController.logout)

// reset password / forgot
//routes.get('/forgot-password', SearchController.forgotForm) // forgot = esqueci
// routes.get('/password-reset', SearchController.resetForm)
// routes.post('/forgot-password', SearchController.forgot) 
// routes.post('/password-reset', SearchController.reset) 

// user register UserController
routes.get('/register', UserController.registerForm)
routes.post('/register', Validator.post, UserController.post)

routes.get('/',Validator.show, UserController.show)
routes.put('/',Validator.update, UserController.update)
// routes.delete('/', UserController.delete)



module.exports = routes

