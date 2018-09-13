const express = require('express')
const http = require('http')
const path = require('path')
const logger = require('morgan')
const bodyParser = require('body-parser')

const app = express()

/*
projeto
	mostrar log de request na telas

	/ -> onde ficará a home page.
	/editar -> edita e envia.
	/postar -> salva no array e mostra no inicio do blog.
	/gerenciar -> gerencia do blog como nova postagem e editar.

	caso venha um caminho não conhecido -> 404 error
*/

//definir motor de views
app.set('views', path.resolve(__dirname, "views"))
app.set('view engine', 'ejs')

//middleware
app.use(bodyParser.urlencoded({ extended: false }))

app.use(logger('dev'))

const postagens = [{
	titulo: "Bem vindo ao Express.js",
	postagem: "O express é um Framework para o server-side.",
	endereco: "/postagem1",
	dataPostagem: new Date()
}]

app.locals.postagens = postagens

app.get('/', (require, response) => {
	response.render('index')
})
app.use((require, response) => {
	response.status(404).send("Não foi encontrado esta página.")
})

http.createServer(app).listen(3000, () =>
	console.log('Servidor rodando na porta 3000.')
)