const db = require('../../config/db') // conecta com banco de dados
const fs = require('fs') // filesistem 

module.exports = {
        create({filename, path, product_id}) {
            //inserir dados no banco de dados
            const query = `
                INSERT INTO files (
                    name,
                    path,
                    product_id                                  
                ) VALUES ($1, $2, $3)
                RETURNING id
                `
            const values = [
                filename,
                path,
                product_id            
            ]

            return db.query(query, values)
        
    },

    async delete(id) {

            //tentar
            try {
                const result = await db.query(`SELECT * FROM files WHERE id = $1`, [id])
                const file = result.rows[0]
                                  //path = caminho  
                fs.unlinkSync(file.path)
                
                return db.query(`
                     DELETE FROM  files WHERE id = $1
                `, [id])

             //pegar   
            }catch(err){
                console.error(err)
            }
          
    }

}
