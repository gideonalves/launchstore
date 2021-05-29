const express = require('express')
const routes = express.Router() // 01 routes sera responsavel por todas as rotas


// Rotas
routes.get('/', function(req, res) {  // 02
    // nessa rota oque muda é o "redirect"
    return res.render("layout.njk") 
})

module.exports = routes



// HTTP VERBS
// GET: Recerber RESOURCE
//POST: Criar ou Salvar criar um novo RESOURCE com dados enviados
//PUT: Atualizar RESOURCE
//DELETE: deletar RESOURCE

// aqui o module exporta as routes