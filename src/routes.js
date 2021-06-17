const express = require('express')
const routes = express.Router() // 01 routes sera responsavel por todas as rotas
const multer = require('./app/middlewares/multer')

const ProductController = require('./app/controllers/ProductController')

// Rotas
routes.get('/', function(req, res) {  // 02
    // nessa rota oque muda é o "redirect"
    return res.render("layout.njk") 
})

routes.get('/products/create', ProductController.create)
routes.get('/products/:id', ProductController.show)
routes.get('/products/:id/edit', ProductController.edit)

routes.post('/products', multer.array("photos", 6), ProductController.post)
routes.put('/products', multer.array("photos", 6), ProductController.put)
routes.delete('/products', ProductController.delete)



// Alias
routes.get('/ads/create', function(req, res) { 
    return res.redirect("/products/create") 
})




module.exports = routes



// HTTP VERBS
// GET: Recerber RESOURCE
//POST: Criar ou Salvar criar um novo RESOURCE com dados enviados
//PUT: Atualizar RESOURCE
//DELETE: deletar RESOURCE

// aqui o module exporta as routes