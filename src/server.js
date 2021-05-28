/* ================ Esse bloco chama as outros aquivos ===================== */
                                                                            //
const express = require('express')                                          //
const nunjucks = require('nunjucks') //chama o nunjucks                     //
const routes = require("../src/routes")                                     //         
const methodOverride = require('method-override')                           //
                                                                            //
const server = express()                                                    //
                                                                             //
/* ========================================================================== */

/* todos os arquvos use ou os miduer */
server.use(express.urlencoded ({ extended:true })) /* essa linha e responsavel por req.body */
server.use(express.static('public'))
server.use(methodOverride('_method'))
server.use(routes) // 04



server.set("view engine", "njk")

nunjucks.configure("src/app/views", {
    express: server,
    autoescape: false,
    noCache: true
})

// aqui configura a porta http://localhost:5000/
server.listen(5000, function() {
    console.log("server is running")
})