const express = require('express')
const exphbs = require('express-handlebars')
const session = require('express-session')
const FileStore = require('session-file-store')(session)
const flash = require('express-flash')
const fileUpload = require('express-fileupload')

const app = express()

const conn = require('./db/conn')

const Farmacia = require('./models/Farmacia')
const Mercado = require('./models/Mercado')
const Emprego = require('./models/Emprego')
const EventoCidade = require('./models/EventoCidade')
const User = require('./models/User')
const EventosControllers = require('./controllers/EventosControllers')

const eventosRoutes = require('./routes/eventosRoutes')
const authRoutes = require('./routes/authRoutes')
const adminRoutes = require('./routes/adminRoutes')
const premiumRoutes = require('./routes/premiumRoutes')

app.engine('handlebars', exphbs.engine({
    helpers: {
        formatDate: (date) => {
            return new Date(date).toLocaleDateString('pt-BR');
        },
        formatNumber: (number) => {
            if (!number) return '';
            return new Intl.NumberFormat('pt-BR').format(number);
        },
        formatPhone: (phone) => {
            if (!phone) return '';
            // Remove todos os caracteres não numéricos
            const cleaned = phone.replace(/\D/g, '');
            // Formata o número de telefone no padrão (51) 9 9995-5494
            const match = cleaned.match(/^(\d{2})(\d{1})(\d{4})(\d{4})$/);
            if (match) {
                return `(${match[1]}) ${match[2]} ${match[3]}-${match[4]}`;
            }
            return phone;
        },
        capitalizeFirst: (str) => {
            if (typeof str !== 'string') return '';
            return str.charAt(0).toUpperCase() + str.slice(1);
        },
        isEqual: function(a, b) {
            return a === b;
        },
        section: function(name, options) {
            if (!this._sections) this._sections = {};
            this._sections[name] = options.fn(this);
            return null;
        },
        encodeURIComponent: function(str) {
            return encodeURIComponent(str);
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

app.use(fileUpload({
    createParentPath: true
}))

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

app.use((req, res, next) => {
    if (req.session.userid) {
        res.locals.session = req.session
    }
    next()
})

app.use('/eventos', eventosRoutes)
app.use('/', authRoutes)
app.use('/admin', adminRoutes)
app.use('/', premiumRoutes)
app.get('/', EventosControllers.showEventos)

app.use(express.static('public'))

conn
    .sync() 
    .then(() => {
        app.listen(3000)
        console.log('Servidor rodando na porta 3000')
    })
    .catch((err) => console.log(err))
