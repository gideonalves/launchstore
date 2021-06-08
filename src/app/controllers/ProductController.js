// pega o formatPrice do utils
const { formatPrice } = require("../../lib/utils") 

// exporta tudo que ta dentro do arquivo category
const Category = require('../models/Category') 
const Product = require('../models/Product') 

module.exports = {

    // pagina criar
    create(req, res) {
        // Pegar as Categorias
        Category.all()
        //then = então
        .then(function(results) {

            const categories = results.rows
                                     // categories vai para o front end ex: categories.name 
            return res.render("products/create.njk", { categories })          
         // catch = pegar   
        }).catch(function(err) {
            throw new Error(err)
        })
    },

    async post(req, res) {
    // Logica de Salvar
         // essa parte verifica se o formulario ta vazio -------------------
         const keys = Object.keys(req.body)

         for (key of keys) {
             if (req.body[key] == "") {
                 return res.send('Please, fill all fields!')
             }
         }
     //-----------------------------------------------------------------
        let results = await Product.create(req.body)
        const productId = results.rows[0].id

         return res.redirect(`products/${productId}`)        
    },

    async edit(req, res) {
        let results = await Product.find(req.params.id)
        const product = results.rows[0]
        
        if(!product) return res.send("Não a Produto!")

        product.old_price = formatPrice(product.old_price)
        product.price = formatPrice(product.price) // formata o preço

        results = await Category.all()
        const categories = results.rows
        
        return res.render("products/edit.njk", { product, categories })
    },

    async put(req, res) {

          // essa parte verifica se o formulario ta vazio
          const keys = Object.keys(req.body)

          for (key of keys) {
              if (req.body[key] == "") {
                  return res.send('Please, fill all fields!')
              }
        }

        req.body.price = req.body.price.replace(/\D/g, "")

        if (req.body.old_price != req.body.price) {
            const oldProduct = await Product.find(req.body.id)
            req.body.old_price = oldProduct.rows[0].price
        }  

        await Product.update(req.body)
        
        return res.redirect(`/products/${req.body.id}/edit`)
    },

    async delete(req, res) {

        await Product.delete(req.body.id)    
      
      return res.redirect('/products/create')
    }
    

}

