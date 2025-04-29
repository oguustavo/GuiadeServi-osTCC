const Farmacia = require('../models/Farmacia')
const Mercado = require('../models/Mercado')
const Emprego = require('../models/Emprego')
const EventoCidade = require('../models/EventoCidade')
const User = require('../models/User')
const path = require('path')
const fs = require('fs')

module.exports = class EventosControllers {
    static async showEventos(req, res) {
        res.render('eventos/home', {
            user: req.user || null  
        })
    }

    static async showFarmacias(req, res) {
        try {
            const farmacias = await Farmacia.findAll({
                raw: true
            })
            console.log('Farmácias encontradas:', farmacias)
            res.render('eventos/farmacias', { farmacias })
        } catch (error) {
            console.log(error)
            res.status(500).send('Erro ao buscar farmácias')
        }
    }

    static async showMercados(req, res) {
        try {
            console.log('Buscando estabelecimentos...')
            const estabelecimentos = await Mercado.findAll({
                raw: true
            })
            console.log('Estabelecimentos encontrados:', estabelecimentos)
            res.render('eventos/mercados', { estabelecimentos })
        } catch (error) {
            console.log('Erro ao buscar estabelecimentos:', error)
            res.status(500).send('Erro ao carregar página de mercados e restaurantes')
        }
    }

    static async showEmpregos(req, res) {
        try {
            const vagas = await Emprego.findAll({
                raw: true
            })
            console.log('Vagas encontradas:', vagas)
            res.render('eventos/empregos', { vagas })
        } catch (error) {
            console.log('Erro ao buscar vagas:', error)
            res.status(500).send('Erro ao carregar página de empregos')
        }
    }

    static async showEventosCidade(req, res) {
        try {
            const eventos = await EventoCidade.findAll({
                raw: true
            })
            console.log('Eventos encontrados:', eventos)
            res.render('eventos/eventosCidade', { eventos })
        } catch (error) {
            console.log('Erro ao buscar eventos:', error)
            res.status(500).send('Erro ao carregar página de eventos')
        }
    }

    static async createEvento(req, res) {
        try {
            const { nome, endereco, telefone, tipo, subtipo, dataInicio, dataFim, cargo, empresa, tipoVaga, requisitos, contato, tipoEvento, data, horario, local, descricao, vendaPresencial, linkInscricao } = req.body
            let imagem = null

            if (req.files && req.files.imagem) {
                const file = req.files.imagem
                const fileName = Date.now() + path.extname(file.name)
                const uploadPath = path.join(__dirname, '..', 'public', 'uploads', fileName)

                const uploadsDir = path.join(__dirname, '..', 'public', 'uploads')
                if (!fs.existsSync(uploadsDir)) {
                    fs.mkdirSync(uploadsDir, { recursive: true })
                }

                await file.mv(uploadPath)
                imagem = fileName
            }

            if (tipo === 'farmacia') {
                await Farmacia.create({
                    nome,
                    endereco,
                    telefone,
                    dataInicio,
                    dataFim
                })
                req.flash('success', 'Farmácia cadastrada com sucesso!')
            } else if (tipo === 'estabelecimento') {
                console.log('Dados do estabelecimento:', { nome, endereco, telefone, subtipo, imagem })
                const novoEstabelecimento = await Mercado.create({
                    nome,
                    endereco,
                    telefone,
                    subtipo,
                    imagem
                })
                console.log('Estabelecimento criado:', novoEstabelecimento)
                req.flash('success', 'Estabelecimento cadastrado com sucesso!')
            } else if (tipo === 'vaga') {
                console.log('Dados da vaga:', { cargo, empresa, tipoVaga, requisitos, contato, endereco })
                const novaVaga = await Emprego.create({
                    cargo,
                    empresa,
                    tipoVaga,
                    requisitos,
                    contato,
                    endereco
                })
                console.log('Vaga criada:', novaVaga)
                req.flash('success', 'Vaga cadastrada com sucesso!')
            } else if (tipo === 'evento') {
                console.log('Dados do evento:', { nome, tipoEvento, data, horario, local, descricao, vendaPresencial, linkInscricao, imagem })
                const novoEvento = await EventoCidade.create({
                    nome,
                    tipoEvento,
                    data,
                    horario,
                    local,
                    descricao,
                    vendaPresencial: vendaPresencial === 'on',
                    linkInscricao,
                    imagem
                })
                console.log('Evento criado:', novoEvento)
                req.flash('success', 'Evento cadastrado com sucesso!')
            }

            res.redirect('/admin/dashboard')
        } catch (error) {
            console.log('Erro ao criar evento:', error)
            req.flash('error', 'Erro ao cadastrar item')
            res.redirect('/admin/dashboard')
        }
    }

    static async deleteEvento(req, res) {
        try {
            const { id, tipo } = req.body
            let model

            switch(tipo) {
                case 'farmacia':
                    model = Farmacia
                    break
                case 'estabelecimento':
                    model = Mercado
                    break
                case 'vaga':
                    model = Emprego
                    break
                case 'evento':
                    model = EventoCidade
                    break
                default:
                    throw new Error('Tipo inválido')
            }

            const item = await model.findByPk(id)

            if (item.imagem) {
                const imagePath = path.join(__dirname, '..', 'public', 'uploads', item.imagem)
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath)
                }
            }

            await model.destroy({ where: { id } })
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

    static async showPromocoes(req, res) {
        try {
            res.render('eventos/promocoes')
        } catch (error) {
            console.log('Erro ao carregar página de promoções:', error)
            res.status(500).send('Erro ao carregar página de promoções')
        }
    }

    static async showContatos(req, res) {
        try {
            res.render('eventos/contatos')
        } catch (error) {
            console.log('Erro ao carregar página de contatos:', error)
            res.status(500).send('Erro ao carregar página de contatos')
        }
    }
}