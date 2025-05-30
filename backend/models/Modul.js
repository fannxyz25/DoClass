const mongoose = require('mongoose');
const { Schema } = mongoose;

const ModulSchema = new Schema({
    judul: {
        type: String,
        required: [true, 'Judul modul harus diisi']
    },
    deskripsi: {
        type: String,
        required: [true, 'Deskripsi modul harus diisi']
    },
    fileUrl: {
        type: String,
        required: [true, 'File modul harus diupload']
    },
    fileName: {
        type: String,
        required: [true, 'Nama file harus ada']
    },
    fileType: {
        type: String,
        required: [true, 'Tipe file harus ada']
    },
    fileSize: {
        type: Number,
        required: [true, 'Ukuran file harus ada']
    },
    kelasId: { 
        type: Schema.Types.ObjectId, 
        ref: 'Kelas',
        required: [true, 'Kelas harus ditentukan']
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Pembuat modul harus ditentukan']
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Modul', ModulSchema);