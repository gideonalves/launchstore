const User = require('../models/User')
const { formatCep, formatCpfCnpj } = require('../../lib/utils')
const { update } = require('../models/Product')

module.exports = {
    registerForm(req, res) {
        return res.render("user/register")
    },

    async show(req, res) {
    //    aqui
        const { user } = req 

        user.cpf_cnpj = formatCpfCnpj(user.cpf_cnpj)
        user.cep = formatCep(user.cep)

        return res.render('user/index', { user })
    },

    async post(req, res) {
        try {
            const userId = await User.create(req.body)
            console.log(userId);
            // return res.send({userId})
            req.session.userId = userId
            // return res.send(req.session)
            return res.redirect('/users')    
            
        } catch (error) {
            return res.send({error})
            
        }

        
        // return res.send("passous")
    },

    async update(req, res) {
        try {
            const { user } = req
            let { name, email, cpf_cnpj, cep, address } = req.body

            cpf_cnpj = cpf_cnpj.replace(/\D/g, "")
            cep = cep.replace(/\D/g, "")

            await User.update(user.id, {
                name, 
                email, 
                cpf_cnpj, 
                cep, 
                address
            })

            return res.render("user/index", {
                user: req.body,
                success: "Conta atualizada com sucesso!"
            })
            
        } catch (error) {
            console.error(error)
            return res.render("user/index", {
                error: "Algum erro aconteceu!"
            })
        }
    }

}