// Importar dependencias
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const usersSchema = new Schema({
    mail: String,
    password: String
});

module.exports = mongoose.model("usersDb", usersSchema);