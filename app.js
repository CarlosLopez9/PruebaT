const express = require('express');
const bodyParser = require('body-parser');
const req = require('express/lib/request');
const res = require('express/lib/response');
const app = express();
const port = process.env.port || 5000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const users = [
    {id: 1,firstName: 'Tony', lastName: "Ramirez", email: 'tony@gmail.com'},
    {id: 2,firstName: 'Andres', lastName: "Hernandez", email: 'andres@gmail.com'},
    {id: 3,firstName: 'Maria', lastName: "Lopez", email: 'maria@gmail.com'},
    {id: 4,firstName: 'Royner', lastName: "Cascante", email: 'royner@gmail.com'},
    {id: 5,firstName: 'Marco', lastName: "Gomez", email: 'marco@gmail.com'}
];

const todos = [
    {id:1,title:"Universidad",keywords:"estudios",userId:1},
    {id:2,title:"Casa",keywords:"oficio",userId:2},
    {id:3,title:"Trabajo",keywords:"necesario",userId:3},
    {id:4,title:"Personal",keywords:"orden",userId:4}
];

const tasks = [
    {id:1,title:"Terminar Tesis",completed:0,todoId:1,userId:1},
    {id:2,title:"Limpiar la cochera",completed:1,todoId:2,userId:2},
    {id:3,title:"Terminar de programar",completed:1,todoId:3,userId:3},
    {id:4,title:"Entrevistar a los Estudiantes",completed:0,todoId:4,userId:4}
];

const Mensaje = [
    "El usuario no se encuentra registrado",
    "Ingrese todos los datos antes de guardar y / o verifique si los datos son correctos",
    "El id no se encuentra en la tabla",
    "Ingrese un id que esté en la tabla todos"
]

app.get('/',(_,res) => {
    res.send('Prueba');
});

app.get('/users',(_, res) => {
    res.json({ users });
});

app.get('/users/:id',(req, res) => {
    const {id} = req.params;
    const user = users.filter((user) => user.id == id)[0];
    try{
        if(user.id) res.json({user});
    }catch(e){
        res.json(Mensaje[0]);
    }
    
});

app.post('/users',(req, res) => {
    const { firstName, lastName, email } = req.body;
    if(firstName && lastName && email){
        var id = 1;
        do{
            var cont = 0;
            users.forEach(x =>{
                if(x.id == id) cont++;
            });
            if(cont == 0) cont = -1;
            else id++;
        }while(cont != -1);
        users.push({id, firstName, lastName, email });
        res.json(users[users.length-1]);
    }else{
        res.json(Mensaje[1]);
    }
});

app.get('/users/:id/todos',(req, res) => {
    const {id} = req.params,
    todo = todos.filter(todo => todo.userId == id);
    try {
        if(todo.length != 0) res.json(todo);
        else throw "Exception";
    } catch (e) {
        res.json(Mensaje[2]);
    }
});

app.get('/todos/:id',(req, res) => {
    const {id} = req.params,
    todo = todos.filter(todo => todo.id == id)[0],
    task = tasks.filter(task => task.todoId == id);
    try {
        if(todo.id) {
            if (task.length != 0) res.json({todo, task});
            else res.json({todo});
        }
    } catch (e) {
        res.json(Mensaje[2]);
    }
});

app.post('/todos/:id/task',(req, res) => {
    let {id} = req.params;
    const { title, completed } = req.body;
    var id2 = 1,userId = 0,todoId = 0;
    switch (Verifica(id)) {
        case 1: res.json(Mensaje[3]); break;
        case 2: userId = users[0].id;
        case 3: 
            if(userId == 0) userId = parseInt(id);
            if(title && completed || !completed){
                do{
                    var cont = 0;
                    tasks.forEach(x =>{
                        if(x.id == id2) cont++;
                    });
                    if(cont == 0) cont = -1;
                    else id2++;
                }while(cont != -1);
                id = parseInt(id);todoId = parseInt(id);id = id2;
                tasks.push({id, title, completed, todoId, userId });
                res.json(tasks[tasks.length-1]);
            }else{
                res.json(Mensaje[1]);
            }
            break;
    }
}); 

app.listen(port,() => {
    console.log(`Puerto Servidor: ${port} `);
});

function Verifica(id){
    var cont = 0;
    const todo = todos.filter(todo => todo.id == id)[0],
    user = users.filter(x => x.id == id)[0];
    try {
        if (todo.id){
            cont = 1;
            if (user.id) cont = 2;
        }
    } catch (e) {
        switch (cont) {
            case 0: return 1; break;
            case 1: return 2; break;
        }
    }
    return 3;
}