const { Pool } = require("pg") // aqui desistrutura o objeto pool

module.exports = new Pool({
    user: 'postgres',
    password: '1234',
    host: 'localhost',
    port: 5432,
    database: "launchstoredb"
})