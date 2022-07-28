// Importar dependencias
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Crear la estructura / SCHEMA
const TasksSchema = new Schema({
    routeName: String,
    textObj: String,
    id: String,
    isDone: Boolean,
    toggleEdit: Boolean,
    name: String,
});

module.exports = mongoose.model("Tasks", TasksSchema);

