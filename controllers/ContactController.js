const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'gustavosoaresok@gmail.com', // seu email
        pass: 'sua_senha_de_app' // você precisará gerar uma senha de aplicativo no Gmail
    }
});

class ContactController {
    static showContactPage(req, res) {
        res.render('contato');
    }

    static async sendEmail(req, res) {
        const { name, email, phone, subject, message } = req.body;

        const mailOptions = {
            from: email,
            to: 'gustavosoaresok@gmail.com',
            subject: `Novo contato: ${subject}`,
            html: `
                <h2>Novo contato do site</h2>
                <p><strong>Nome:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Telefone:</strong> ${phone}</p>
                <p><strong>Assunto:</strong> ${subject}</p>
                <p><strong>Mensagem:</strong></p>
                <p>${message}</p>
            `
        };

        try {
            await transporter.sendMail(mailOptions);
            req.flash('success', 'Mensagem enviada com sucesso! Em breve entraremos em contato.');
            res.redirect('/contato');
        } catch (error) {
            console.error('Erro ao enviar email:', error);
            req.flash('error', 'Erro ao enviar mensagem. Por favor, tente novamente.');
            res.redirect('/contato');
        }
    }
}

module.exports = ContactController; 