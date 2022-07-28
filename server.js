let bcrypt = require("bcrypt");
var express = require("express");
let jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
var cors = require("cors");
var app = express();
var PORT = process.env.PORT || 4001;
const Tasks = require("./model/tasks");
const ArrTasks = require("./model/arrTasks");
const usersDb = require("./model/usersDb");

dotenv.config();

mongoose
    .connect(process.env.MONGODB_HOST, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then((db) => console.log("db connected"))
    .catch((err) => console.log(err));

// middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.get("/api/characters", async function (req, res) {
    const chars = await Character.find();

    return res.json(chars);
});

app.get("/api/alltasks/:user", async function (req, res) {
    let token = req.params.user;

    let temp = jwt.verify(token, "SECRETPASS", function (err, decoded) {
        return decoded.email;
    });

    if (temp) {
        const chars = await Tasks.find({ routeName: temp });
        console.log(chars)
        return res.json({usuario: temp, tareas: chars});
    } else {
        return res.json({ msg: "No se encontraron personajes con ese nombre" });
    }

    
});

app.post("/api/deletetask", async function (req, res) {
    let idtemp = req.body;
    console.log(idtemp);

    const exist = await Tasks.findOneAndDelete(idtemp);

    if (exist) {
        return res.json(exist);
    } else {
        return res.json({ msg: "No se encontraro tarea con ese id" });
    }
});

app.post("/api/edittask", async function (req, res) {
    let idtemp = req.body;
    console.log(idtemp);

    const exist = await Tasks.findOneAndUpdate(
        { id: idtemp.id },
        { textObj: idtemp.textObj }
    );

    if (exist) {
        return res.json(exist);
    } else {
        return res.json({ msg: "No se encontraro tarea con ese id" });
    }
});

app.post("/api/numberTasks", async function (req, res) {
    let idtemp = req.body;
    console.log(idtemp);

    let today = new Date();

    var weekday = new Array(7);

    weekday[0] = "Lunes";
    weekday[1] = "Martes";
    weekday[2] = "Miercoles";
    weekday[3] = "Jueves";
    weekday[4] = "Viernes";
    weekday[5] = "Friday";
    weekday[6] = "Saturday";

    var day = weekday[today.getDay()];
    console.log(day);

    const exist = await arrTasks.findOneAndUpdate(
        { id: idtemp.id },
        { isDone: idtemp.isDone }
    );

    if (exist) {
        return res.json(exist);
    } else {
        return res.json({ msg: "No se encontraro tarea con ese id" });
    }
});

app.post("/api/checkedtask", async function (req, res) {
    let idtemp = req.body;

    const exist = await Tasks.findOneAndUpdate(
        { id: idtemp.id },
        { isDone: idtemp.isDone }
    );

    if (exist) {
        return res.json(exist);
    } else {
        return res.json({ msg: "No se encontraro tarea con ese id" });
    }
});

app.get("/api/tasks/:user", async function (req, res) {
    let chosen = req.bodyparams.user;

    console.log("user?", chosen);
    console.log(chosen);
    

    const chars = await Tasks.find({ name: chosen });

    if (chars) {
        return res.json(chars);
    } else {
        return res.json({ msg: "No se encontraron personajes con ese nombre" });
    }

    /* for (var i = 0; i < characters.length; i++) {
      if (chosen === characters[i].routeName) {
        return res.json(characters[i]);
      }
    }
  
    return res.json(false);*/
});

app.post("/api/createUser", async function (req, res) {
    let newUser = req.body;
    console.log(newUser.email);
    console.log(newUser.password);

    newUser.password = bcrypt.hashSync(newUser.password, 10);

    const exist = await usersDb.findOne({ mail: newUser.email });

    if (exist) {
        return res.json({ msj: "Existe un usuario con ese correo" });
    } else {
        const char = new usersDb({
            mail: newUser.email,
            password: newUser.password,
        });
        await char.save();
        return res.json({ msj: "Se creó nuevo usuario" });
    }
});

app.post("/api/checkUser", async function (req, res) {
    let checkedUser = req.body;
    console.log(checkedUser.email);
    console.log(checkedUser.password);

    const exist = await usersDb.findOne({ mail: checkedUser.email });

    bcrypt.compare(
        checkedUser.password,
        exist.password,
        function (err, result) {
            const resultTemp = result;
            console.log(resultTemp);
            console.log(exist);
            var token = jwt.sign({ email: checkedUser.email }, "SECRETPASS");
            console.log(token);
            if (exist && resultTemp) {
                return res.json({ conf: true, jwtToken: token });
            } else {
                return res.json({
                    conf: false,
                });
            }
        }
    );
});

app.post("/api/tasks", async function (req, res) {
    // req.body hosts is equal to the JSON post sent from the user
    // This works because of our body parsing middleware
    var newTask = req.body;

    // Using a RegEx Pattern to remove spaces from newCharacter
    // You can read more about RegEx Patterns later https://www.regexbuddy.com/regex.html
    newTask.routeName = newTask.name.replace(/\s+/g, "").toLowerCase();

    console.log(newTask);

    const char = new Tasks(newTask);

    try {
        await char.save();
    } catch (err) {
        console.log(err);
    }

    //  characters.push(newcharacter);

    res.json(newTask);
});

app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});
