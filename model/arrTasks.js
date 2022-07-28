// Importar dependencias
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const arrTasksSchema = new Schema({
    name: String,
    Lunes: Number,
    Martes: Number, 
    Miercoles: Number, 
    Jueves: Number, 
    Viernes: Number, 
    Sabado: Number, 

});

module.exports = mongoose.model("ArrTasks", arrTasksSchema);