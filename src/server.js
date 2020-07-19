const express = require("express")
const server = express()

//Pegar Banco
const db = require("./database/db")

//Config Public
server.use(express.static("public"))

//Habilitar o uso do req.body
server.use(express.urlencoded({extended: true}))

//Utilizando template engine
const nunjucks = require("nunjucks")
nunjucks.configure("src/views", {
    express: server,
    noCache:true,
})

//Config caminhos
server.get( "/", (req, res) => {
   return res.render("index.html")
})

server.get( "/create-point", (req, res) => {
    return res.render("create-point.html")
})
server.post("/savepoint", (req, res)=>{
            const query = `
                INSERT INTO places (
                    image,
                    name,
                    address,
                    address2,
                    state,
                    city,
                    items
                ) VALUES (
                    ?, ?, ?, ?, ?, ?, ?
                );
            `
            const values = [
                req.body.image,
                req.body.name,
                req.body.address,
                req.body.address2,
                req.body.state,
                req.body.city,
                req.body.items,
            ]
        
            function afterInsertData(err){
                if(err){
                     console.log(err)
                     return res.send("Erro no Cadastro!")
                }
                console.log("Cadastrado com Sucesso!")
                console.log(this)
                return res.render("create-point.html", { saved: true })
            }
            db.run(query, values, afterInsertData)
})

server.get( "/search", (req, res) => {
    const search = req.query.search
    if(search == ""){
        return res.render("search-results.html", { total: 0 })
    }
    //pegar dados do banco
    db.all(`SELECT * FROM places WHERE city LIKE '%${search}%'`, function(err, rows){
       if(err){
           return console.log(err)
       }
       const total = rows.length
       //mostrar pagina com dados do banco
        return res.render("search-results.html", { places: rows, total: total })
    })
})

//Ligar Server
server.listen(
    3000,
    console.log("Que a Força esteja com vc!")
)

