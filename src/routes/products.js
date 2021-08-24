const express = require('express')
const routes = express.Router() 
const multer = require('../app/middlewares/multer')

const ProductController = require('../app/controllers/ProductController')
const SearchController = require('../app/controllers/SearchController')

const { onlyUsers } = require('../app/middlewares/session')

// Search
routes.get('/search', SearchController.index)

// Products
routes.get("/create", onlyUsers, ProductController.create)
routes.get('/:id', ProductController.show)
routes.get('/:id/edit', ProductController.edit)

routes.post('/', multer.array("photos", 6), ProductController.post)
routes.put('/', multer.array("photos", 6), ProductController.put)
routes.delete('/', ProductController.delete)



module.exports = routes

