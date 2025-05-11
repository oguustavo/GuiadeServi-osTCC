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
            const { tipo, nome, endereco, telefone, dataInicio, dataFim, subtipo, imagem, cargo, empresa, tipoVaga, requisitos, contato, tipoEvento, data, horario, local, descricao, vendaPresencial, linkInscricao } = req.body

            if (tipo === 'farmacia') {
                await Farmacia.create({
                    nome,
                    endereco,
                    telefone,
                    dataInicio,
                    dataFim
                })
                return res.json({
                    success: true,
                    message: '✨ Farmácia cadastrada com sucesso!'
                });
            } else if (tipo === 'estabelecimento') {
                await Mercado.create({
                    nome,
                    endereco,
                    telefone,
                    subtipo,
                    imagem
                })
                return res.json({
                    success: true,
                    message: '✨ Estabelecimento cadastrado com sucesso!'
                });
            } else if (tipo === 'vaga') {
                await Emprego.create({
                    cargo,
                    empresa,
                    tipoVaga,
                    requisitos,
                    contato,
                    endereco
                })
                return res.json({
                    success: true,
                    message: '✨ Nova vaga cadastrada com sucesso!'
                });
            } else if (tipo === 'evento') {
                await EventoCidade.create({
                    nome,
                    tipoEvento,
                    data,
                    horario,
                    local,
                    descricao,
                    vendaPresencial: vendaPresencial === 'on',
                    linkInscricao,
                    imagem,
                    contato
                })
                return res.json({
                    success: true,
                    message: '✨ Evento cadastrado com sucesso!'
                });
            }
        } catch (error) {
            console.log('Erro ao criar evento:', error)
            return res.json({
                success: false,
                message: '❌ Erro ao cadastrar. Por favor, tente novamente.'
            });
        }
    }

    static async deleteEvento(req, res) {
        try {
            const { id, tipo } = req.body
            let model
            let itemName = ''

            switch(tipo) {
                case 'farmacia':
                    model = Farmacia
                    itemName = 'Farmácia'
                    break
                case 'estabelecimento':
                    model = Mercado
                    itemName = 'Estabelecimento'
                    break
                case 'vaga':
                    model = Emprego
                    itemName = 'Vaga'
                    break
                case 'evento':
                    model = EventoCidade
                    itemName = 'Evento'
                    break
                default:
                    throw new Error('Tipo inválido')
            }

            const item = await model.findByPk(id)
            if (!item) {
                return res.json({
                    success: false,
                    message: '❌ Item não encontrado'
                });
            }

            if (item.imagem) {
                const imagePath = path.join(__dirname, '..', 'public', 'uploads', item.imagem)
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath)
                }
            }

            await model.destroy({ where: { id } })
            return res.json({
                success: true,
                message: ` ${itemName} excluído com sucesso!`
            });
        } catch (error) {
            console.log('Erro ao excluir:', error)
            return res.json({
                success: false,
                message: '❌ Erro ao excluir. Por favor, tente novamente.'
            });
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