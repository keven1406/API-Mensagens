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

//serv to public docs
const publicPath = path.resolve(__dirname, 'public')
app.use(express.static(publicPath))

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

const gerarData = novaData => {
	const data = [
		novaData.getDate(),
		"0" + (novaData.getMonth() + 1),
		novaData.getFullYear()
	]
	return data.join(" - ")
}

app.post('/write', (request, response) => {
	if (!request.body.titulo)
		return response.status(400).send('Postagem não foi encontrada')
	postagens.push({
		titulo: request.body.titulo,
		corpo: request.body.corpo,
		endereco: gerarIndereco(postagens.length + 1),
		dataPostagem: gerarData((new Date()))
	})
	response.redirect('/')
})

//Create User
const usuarios = []

//Register
app.get('/register', (request, response) => {
	response.render('register')
})

app.post('/register', (request, response) => {
	usuarios.push({
		usuario: request.body.user,
		senha: request.body.password,
		createdAt: new Date()
	})
	response.redirect('/login')
})

//login
app.get('/login', (request, response) => {
	response.render('login')
})

const procurarUser = usuario => usuarioSalvo => {
	console.log('true ou false: ', usuarioSalvo, 'request', usuario.body.user, usuario.body.password )
	if ((usuarioSalvo.usuario == usuario.body.user) && (usuarioSalvo.senha === usuario.body.password))
		return true	
}

app.post('/login', (request, response) => {
	if(usuarios.find(procurarUser(request))) response.render('admin')
	else response.status(404).render('404')
})

//this middleware take the url request and search in 'postagens' array.
app.use((request, response, next) => {
	if (postagens.find(postagem =>
		postagem.endereco === request.url ? true : false )) {
		
		let postar = postagens.filter(item => {
			if (item.endereco === request.url) return true
		})[0]
		app.locals.postar = postar
		
		response.render('read')
	}
	next() 
})

app.use((request, response) =>
	response.status(404).render('404')
)

http.createServer(app).listen(3000, '192.168.1.10', () =>
	console.log('Servidor rodando na porta 3000.')
)