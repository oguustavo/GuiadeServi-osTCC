const express = require('express')
const exphbs = require('express-handlebars')
const session = require('express-session')
const FileStore = require('session-file-store')(session)
const flash = require('express-flash')

const app = express()

const conn = require('./db/conn')

//models
const Evento = require('./models/Evento')
const User = require('./models/User')
const EventosControllers = require('./controllers/EventosControllers')

//import routes
const eventosRoutes = require('./routes/eventosRoutes')
const authRoutes = require('./routes/authRoutes')
const adminRoutes = require('./routes/adminRoutes')

app.engine('handlebars', exphbs.engine({
    helpers: {
        formatDate: (date) => {
            return new Date(date).toLocaleDateString('pt-BR');
        }
    }
}))
app.set('view engine', 'handlebars')

app.use(
    express.urlencoded({
        extended: true
    })
)
app.use(express.json())

app.use(
    session({
        name: 'session',
        secret: 'nosso_secret',
        resave: false,
        saveUninitialized: false,
        store: new FileStore({
            logFn: function () { },
            path: require('path').join(require('os').tmpdir(), 'sessions'),
        }),
        cookie: {
            secure: false,
            maxAge: 360000,
            expires: new Date(Date.now() + 360000),
            httpOnly: true
        }
    }),
)

app.use(flash())

// Certificar-se que esta linha está antes das rotas
app.use(express.static('public'))

app.use((req, res, next) => {
    if (req.session.userid) {
        res.locals.session = req.session
    }
    next()
})

app.use('/eventos', eventosRoutes)
app.use('/', authRoutes)
app.use('/admin', adminRoutes)
app.get('/', EventosControllers.showEventos)

//.sync({force:true})
conn
    .sync() // Removido o {force: true}
    .then(() => {
        app.listen(3000)
        console.log('Servidor rodando na porta 3000')
    })
    .catch((err) => console.log(err))
