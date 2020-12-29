const express = require("express");
const app = express();
const dotenv = require ("dotenv");
const mongoose = require("mongoose");

//models
const TodoTask = require("./models/TodoTask");

dotenv.config ();

app.use("/static", express.static("public"));
app.use(express.urlencoded ({extended: true}));

//connection to db

mongoose.set("useFindAndModify", false);

mongoose.connect(process.env.DB_CONNECT, { useUnifiedTopology: true,useNewUrlParser: true}, () => {
    console.log("Connected to db!");
    app.listen(3000, () => console.log("Server Up and running"));
});

//view engine configuration

app.set("view engine", "ejs");

//GET method 1
// app.get('/',(req, res) => {
//     // res.send('Hello World!');
//     res.render('todo.ejs');
// });

// GET METHOD 2
app.get("/", (req, res) => {
    TodoTask.find({}, (err, tasks) => {
        res.render("todo.ejs", { todoTasks: tasks });
    });
});

//POST method 1

// app.post ('/', (req, res) => {
//     console.log (req.body);
// });

//POST METHOD 2

app.post('/',async function (req, res){
    const todoTask = new TodoTask({
        content: req.body.content
    });

    try {
        await todoTask.save();
        res.redirect("/");
    } catch (err) {
        throw err;
        // res.redirect("/");
    }
});

//UPDATE

app.route("/edit/:id")
    .get((req, res) => {

    const id = req.params.id;

    TodoTask.find({}, (err, tasks) => {
        res.render("todoEdit.ejs", { todoTasks: tasks, idTask: id });
    });
})

.post((req, res) => {
    const id = req.params.id;
    TodoTask.findByIdAndUpdate(id, { content: req.body.content }, err => {
        if (err) return res.send(500, err);
        res.redirect("/");
    });
});

//DELETE

app.route("/remove/:id").get((req, res) => {
    const id = req.params.id;
    TodoTask.findByIdAndRemove(id, err => {
        if (err) return res.send(500, err);
        res.redirect("/");
    });
});
