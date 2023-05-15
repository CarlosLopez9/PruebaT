const {Router} = require('express');
const router = Router();

const users = require('../samples/users.json')
const tasks = require('../samples/tasks.json')
const todos = require('../samples/todos.json')
const Mensaje = require('../samples/mensaje.json')

router.get('/',(_,res) => {
    res.send('Prueba');
});

router.get('/users',(_, res) => {
    res.json({ users });
});

router.get('/users/:id',(req, res) => {
    const {id} = req.params;
    const user = users.filter((user) => user.id == id)[0];
    try{
        if(user.id) res.json({user});
    }catch(e){
        res.json(Mensaje[0]);
    }
    
});

router.post('/users',(req, res) => {
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

router.get('/users/:id/todos',(req, res) => {
    const {id} = req.params,
    todo = todos.filter(todo => todo.userId == id);
    try {
        if(todo.length != 0) res.json(todo);
        else throw "Exception";
    } catch (e) {
        res.json(Mensaje[2]);
    }
});

router.get('/todos/:id',(req, res) => {
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

router.post('/todos/:id/task',(req, res) => {
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

module.exports = router;