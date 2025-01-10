const bcrypt = require('bcrypt');
const User = require('./models/User'); // Certifique-se de que o caminho está correto

async function createAdmin() {
    const name = 'Admin';
    const email = 'admin@admin.com';
    const plainPassword = 'senha';
    const saltRounds = 10;

    try {
        // Gerar o hash da senha
        const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);

        // Criar o usuário administrador
        const adminUser = await User.create({
            name,
            email,
            password: hashedPassword,
            isAdmin: true
        });

        console.log('Administrador criado com sucesso:', adminUser);
    } catch (err) {
        console.error('Erro ao criar administrador:', err);
    }
}

createAdmin(); 