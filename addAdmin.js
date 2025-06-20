const bcrypt = require('bcryptjs');
const User = require('./models/User'); 

async function createAdmin() {
    const name = 'Admin';
    const email = 'admin@admin.com';
    const plainPassword = 'senha';
    const saltRounds = 10;

    try {
        const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);

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