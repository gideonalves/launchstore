const session = require('express-session')
const pgSession = require('connect-pg-simple')(session)
const db = require('./db')

module.exports = session ({
    store: new pgSession({
        pool: db
    }),
    // Senha secreta
    secret: 'hahaha',
    resave: false,
    saveUninitialized: false,
    // guarda por 30 dias
    cookie: {
        maxAge: 30 * 24 * 60 * 60 * 1000
    }
})