const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configuração do Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configuração do storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'guia-servicos', // nome da pasta onde as imagens serão salvas
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif']
    }
});

// Configuração do multer
const upload = multer({ storage: storage });

module.exports = {
    cloudinary,
    upload
}; 