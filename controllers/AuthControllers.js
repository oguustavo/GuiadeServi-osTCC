const User = require('../models/User')
const bcrypt = require('bcrypt')

module.exports = class AuthControllers{

    static login(req,res){
        res.render('auth/login')
    }
    static async loginPost(req,res){
        const {email,password} = req.body

        const user = await User.findOne({where:{email:email}})

        if(!user){
            req.flash('message', 'Usuário não encontrado')
            req.flash('error', true)
            res.render('auth/login')
            return
        }

        const passwordMatch = bcrypt.compareSync(password,user.password)

        if(!passwordMatch){
            req.flash('message', 'Senha incorreta')
            req.flash('error', true)
            res.render('auth/login')
            return
        }

        req.session.userid = user.id
        req.session.isAdmin = user.isAdmin

        req.flash('message', 'Bem-vindo de volta!')
        req.flash('success', true)
        req.session.save(()=>{
            if (user.isAdmin) {
                res.redirect('/admin/dashboard')
            } else {
                res.redirect('/')
            }
        })
    }
    static register(req, res){
        res.render('auth/register')
    }
    static  async registerPost(req, res){
        const {name, email,password,confirmpassword, matricula} = req.body

        if(password != confirmpassword){
            req.flash('message', 'As senhas não conferem')
            req.flash('error', true)
            res.render('auth/register')
            return
        }

        const checkifUserExist = await User.findOne({where:{email:email}})
        if(checkifUserExist){
            req.flash('message', 'Este email já está em uso')
            req.flash('error', true)
            res.render('auth/register')
            return
        }

        const salt = bcrypt.genSaltSync(10)
        const hashedPassword = bcrypt.hashSync(password, salt)

        const user={
            name,
            email,
            matricula,
            password:hashedPassword
        }
        try{
            const createdUser = await User.create(user)

            req.session.userid = createdUser.id

            req.flash('message', 'Conta criada com sucesso! Bem-vindo!')
            req.flash('success', true)
            req.session.save(()=>{
                res.redirect('/')
            })
        }catch(err){
            console.log(err)
            req.flash('message', 'Erro ao criar conta. Tente novamente.')
            req.flash('error', true)
            res.render('auth/register')
        }
    }

    static logout(req,res){
        req.session.destroy()
        res.redirect('/login')
    }
}