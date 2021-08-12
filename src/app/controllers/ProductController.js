const { formatPrice, date } = require('../../lib/utils')

const Category = require('../models/Category')
const Product = require('../models/Product')
const File = require('../models/Files')
const db = require('../../config/db')

module.exports = {
  
    create(req, res) {
        // Pegar Categorias
        Category.all()
        .then(function(results) {

            const categories = results.rows
            return res.render("products/create.njk", { categories })
        }).catch(function(err) {
            throw new Error(err)
        })
    },
    // Post = Salvar
    async post(req, res) {
        // Logica de Salvar
        // essa parte verifica se o formulario ta vazio
        const keys = Object.keys(req.body)

        for (key of keys) {
            if (req.body[key] == "") {
                return res.send('Please, fill all fields!')
            }
        }

        // Verifica se tem imagem
        if (req.files.length == 0)
            return res.send('Por favor envie pelo menos uma imagem')            

        // pega os produtos
        let results = await Product.create(req.body)
        const productId = results.rows[0].id

        // Cria as imagens
        const filePromise = req.files.map(file => File.create({...file, product_id: productId}));
        await Promise.all(filePromise)

        return res.redirect(`products/${productId}/edit`)

    },

    async show(req, res) {

        // find = achar
    let results = await Product.find(req.params.id) // pega os dados do banco
    const product = results.rows[0] // pega o produto na primeira linha

    if(!product) return res.send("Produto não encontrado") // se o produto não for achado aparece essa linha

    const { day, hour, minutes, month } = date(product.updated_at) // pega o dia hora minutos e mes do utils.js

    product.published = { // manda para o front end
    day: `${day}/${month}`,
    hour: `${hour}h${minutes}`,
    }

    // configura os preços
    product.oldPrice = formatPrice(product.old_price)
    product.price = formatPrice(product.price) //product vai para o front end   

    // Vai fazer a galeria de imagem
    results = await Product.files(product.id) // pega as imagem do banco da tabela files pelo product.id
    const files = results.rows.map(file => ({
        ...file,                    // replace faz tira o plublic e deixa vazio                  
        src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
    }))

    return res.render("products/show", { product, files })
    },

    async edit(req, res) {
         // pega os produtos
         let results = await Product.find(req.params.id)
         const product = results.rows[0]

         if (!Product) return res.send("Produto não encontrado!")

         product.old_price = formatPrice(product.old_price)
         product.price = formatPrice(product.price)
 
         
        //get categories
        results = await Category.all()
        const categories = results.rows

        // get imagens
        // vai para pagina product files e pega as imagens 
        results = await Product.files(product.id)
        // seleciona todas as imagens
        let files = results.rows
        // fazer os caminhos das imagens ex: https://
        files = files.map(file => ({
            ...file,                    // replace faz tira o plublic e deixa vazio                  
            src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
        }))
        
        return res.render("products/edit.njk", { product, categories, files })
    },

//     async put(req, res) {

//         // essa parte verifica se o formulario ta vazio
//         const keys = Object.keys(req.body)

//         for (key of keys) {
//             if (req.body[key] == "" && key != "removed_files") {
//                 return res.send('Please, fill all fields!')
//             }
//       }

//       if (req.files.length !=0) {
//           const newFilesPromise = req.files.map(file => 
//               File.create({...file, product_id: req.body.id}))
          
//           await Promise.all(newFilesPromise)    
//       }

//       if (req.body.removed_files) {
//           // 1,2,3
//           const removedFiles = req.body.removed_files.split(",") // [1,2,3]
//           const lastIndex = removedFiles.length - 1
//           removedFiles.splice[lastIndex, 1] // [1,2,3]

//           const removedFilesPromise = removedFiles.map(id => File.delete(id))

//           await Promise.all(removedFilesPromise)
//       }

//       req.body.price = req.body.price.replace(/\D/g, "")

//       if (req.body.old_price != req.body.price) {
//           const oldProduct = await Product.find(req.body.id)
//           req.body.old_price = oldProduct.rows[0].price
//       }  

//       await Product.update(req.body)
      
//       return res.redirect(`/products/${req.body.id}`)
//   },



async put (req, res) {
    const keys = Object.keys(req.body)
    for (key of keys) {
      if (req.body[key] == "" && key != "removed_files") {
        return res.send('Please, fill all fields!')
      }
    }

    if (req.body.removed_files) {
      const removedFiles = req.body.removed_files.split(",")
      const lastIndex = removedFiles.length -1
      removedFiles.splice(lastIndex, 1)

      const removedFilesPromise = removedFiles.map(id => File.delete(id))
      await Promise.all(removedFilesPromise)
    }

    if (req.files.length != 0) {
      const oldFiles = await Product.files(req.body.id)
      const totalFiles = oldFiles.rows.length + req.files.length

      if(totalFiles <= 6) {

        const newFilePromise = req.files.map(file => {
          File.create({...file, product_id: req.body.id})
  
        })
        await Promise.all(newFilePromise)
      }

    }

    

    req.body.price = req.body.price.replace(/\D/g, "")
    if(req.body.old_price != req.body.price){
      const oldProduct = await Product.find(req.body.id)
      req.body.old_price = oldProduct.rows[0].price 
    }
    await Product.update(req.body)
    return res.redirect(`/products/${req.body.id}`)
  },


    async delete(req, res) {

        await Product.delete(req.body.id)    
      
      return res.redirect('/products/create')
    }    

}