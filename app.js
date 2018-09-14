const express = require('express')
const http = require('http')
const path = require('path')
const logger = require('morgan')
const bodyParser = require('body-parser')

const app = express()

//definir motor de views
app.set('views', path.resolve(__dirname, "views"))
app.set('view engine', 'ejs')

//middleware
app.use(bodyParser.urlencoded({ extended: false }))

app.use(logger('dev'))

const postagens = []

app.locals.postagens = postagens

app.get('/', (require, response) => {
	response.render('index')
})

app.get('/write', (request, response) => {
	response.render('write')
})

//gerarIndereco:: Number -> String
const gerarIndereco = number => {
	return '/postagem' + number
}

app.post('/write', (request, response) => {
	if (!request.body.titulo)
		return response.status(400).send('Postagem não foi encontrada')
	postagens.push({
		titulo: request.body.titulo,
		corpo: request.body.corpo,
		endereco: gerarIndereco(postagens.length + 1),
		dataPostagem: new Date 
	})
	response.redirect('/')
})

//this middleware take the url request and search in 'postagens' array.
app.use((request, response) => {
	if (postagens.find(postagem =>
		postagem.endereco === request.url ? true : false )) {
		
		let postar = postagens.filter(item => {
			if (item.endereco === request.url) return true
		})[0]
		
		app.locals.postar = postar
		
		response.render('read')
	} else {
		response.status(404).render('404')
	}
})

http.createServer(app).listen(3000, () =>
	console.log('Servidor rodando na porta 3000.')
)