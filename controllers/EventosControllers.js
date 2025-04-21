const Evento = require('../models/Evento')
const User = require('../models/User')
const path = require('path')
const fs = require('fs')

module.exports = class EventosControllers {
    static async showEventos(req, res) {
        res.render('eventos/home', {
            user: req.user || null  // Passa o usuário para a view
        })
    }

    static async showFarmacias(req, res) {
        try {
            const farmacias = await Evento.findAll({
                where: {
                    tipo: 'farmacia'
                },
                raw: true
            })
            console.log('Farmácias encontradas:', farmacias) // Para debug
            res.render('eventos/farmacias', { farmacias })
        } catch (error) {
            console.log(error)
            res.status(500).send('Erro ao buscar farmácias')
        }
    }

    static async showMercados(req, res) {
        try {
            console.log('Buscando estabelecimentos...')
            const estabelecimentos = await Evento.findAll({
                where: {
                    tipo: 'estabelecimento'
                },
                raw: true
            })
            console.log('Estabelecimentos encontrados:', estabelecimentos)
            res.render('eventos/mercados', { estabelecimentos })
        } catch (error) {
            console.log('Erro ao buscar estabelecimentos:', error)
            res.status(500).send('Erro ao carregar página de mercados e restaurantes')
        }
    }

    static async createEvento(req, res) {
        try {
            const { nome, endereco, telefone, tipo, subtipo, dataInicio, dataFim } = req.body
            let imagem = null

            // Handle file upload if present
            if (req.files && req.files.imagem) {
                const file = req.files.imagem
                const fileName = Date.now() + path.extname(file.name)
                const uploadPath = path.join(__dirname, '..', 'public', 'uploads', fileName)

                // Create uploads directory if it doesn't exist
                const uploadsDir = path.join(__dirname, '..', 'public', 'uploads')
                if (!fs.existsSync(uploadsDir)) {
                    fs.mkdirSync(uploadsDir, { recursive: true })
                }

                await file.mv(uploadPath)
                imagem = fileName
            }

            // Create event based on type
            if (tipo === 'farmacia') {
                await Evento.create({
                    nome,
                    endereco,
                    telefone,
                    tipo,
                    dataInicio,
                    dataFim
                })
                req.flash('success', 'Farmácia cadastrada com sucesso!')
            } else if (tipo === 'estabelecimento') {
                console.log('Dados do estabelecimento:', { nome, endereco, telefone, tipo, subtipo, imagem })
                const novoEstabelecimento = await Evento.create({
                    nome,
                    endereco,
                    telefone,
                    tipo,
                    subtipo,
                    imagem
                })
                console.log('Estabelecimento criado:', novoEstabelecimento)
                req.flash('success', 'Estabelecimento cadastrado com sucesso!')
            }

            res.redirect('/admin/dashboard')
        } catch (error) {
            console.log('Erro ao criar evento:', error)
            req.flash('error', 'Erro ao cadastrar estabelecimento')
            res.redirect('/admin/dashboard')
        }
    }

    static async deleteEvento(req, res) {
        try {
            const { id } = req.body
            const evento = await Evento.findByPk(id)

            if (evento.imagem) {
                const imagePath = path.join(__dirname, '..', 'public', 'uploads', evento.imagem)
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath)
                }
            }

            await Evento.destroy({ where: { id } })
            req.flash('success', 'Item removido com sucesso!')
            res.redirect('/admin/dashboard')
        } catch (error) {
            console.log(error)
            res.status(500).send('Erro ao excluir item')
        }
    }

    static async showOnibus(req, res) {
        try {
            res.render('eventos/onibus')
        } catch (error) {
            console.log(error)
            res.status(500).send('Erro ao carregar página de ônibus')
        }
    }

    static async showOutrosServicos(req, res) {
        try {
            res.render('eventos/outrosServicos')
        } catch (error) {
            console.log(error)
            res.status(500).send('Erro ao carregar página de outros serviços')
        }
    }
}