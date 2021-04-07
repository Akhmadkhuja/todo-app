const express = require('express')
const app = express()

const fs = require('fs')
const PORT = process.env.PORT || 4000

app.set('view engine', 'pug')
app.use('/static', express.static('public/styles'))
app.use(express.urlencoded({extended: false }))

app.get('/', (req, res) => {
    fs.readFile('./data/todos.json', (err, data) => {
        if (err) throw err

        const todos = JSON.parse(data)

        res.render('home', { todos: todos})
    })
})

app.post('/add' , (req, res) => {
    const formData = req.body

    if (formData.todo.trim() == '') {

        fs.readFile('./data/todos.json', (err, data) => {
            const todos = JSON.parse(data)

            res.render('home', {error: true, todos: todos })
        })
    } else {
        fs.readFile('./data/todos.json', (err, data) => {
            if (err) throw err
            const todos = JSON.parse(data)

            const todo = {
                id: id(),
                description: formData.todo,
                done: false
            }

            todos.push(todo)

            fs.writeFile('./data/todos.json', JSON.stringify(todos), (err) => {
                if (err) throw err

                fs.readFile('./data/todos.json', (err, data) => {
                    if (err) throw err
                    const todos = JSON.parse(data)

                    res.render('home', {success: true, todos: todos })
                })
            })
        })
    }
})

app.get('/:id/delete', (req,res) => {
    const id = req.params.id

    fs.readFile('./data/todos.json', (err, data) => {
        if (err) throw err

        const todos = JSON.parse(data)

        const filteredTodos = todos.filter(todo => todo.id != id)

        fs.writeFile('./data/todos.json', JSON.stringify(filteredTodos), (err) => {
            if (err) throw err

            res.redirect('/')
        })
    })
})

app.get('/:id/update', (req,res) => {
    const id = req.params.id

    fs.readFile('./data/todos.json', (err, data) => {
        if (err) throw err
        const todos = JSON.parse(data)
        const todo = todos.filter(todo => todo.id == id)[0]

        const todoIdx = todos.indexOf(todo)
        const splicedTodo = todos.splice(todoIdx, 1)[0]

        splicedTodo.done = true

        todos.push(splicedTodo)

        fs.writeFile('./data/todos.json', JSON.stringify(todos), (err) => {
            if (err) throw err
            
            res.render('home', {todos: todos})
        })
    })   
})

app.get('/api/v1/todos', (req, res) => {
    fs.readFile('./data/todos.json', (err, data) => {
        if (err) throw err 
        
        const todos = JSON.parse(data)

        res.json(todos)
    })
})

app.listen(PORT, (err) => {
    if (err) throw err

    console.log(`App is running on port ${PORT}`)
})


function id() {
    return '_' + Math.random().toString(20).substr(2, 10);
};