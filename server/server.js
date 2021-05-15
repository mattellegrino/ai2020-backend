const express = require('express');
const morgan = require('morgan');
const dao = require('./dao');

const PORT = 3001;
app = new express();

app.use(morgan('dev'));
app.use(express.json());


// Get the list of all tasks
app.get('/api/tasks', (req, res) => {

    dao.listTasks()
        .then(tasks => res.json(tasks))
        .catch(() => res.status(500).end());
});

// Tasks filter API
app.get('/api/tasks/filter/:filter', async (req, res) => {
    try{
        const filtered = await dao.listTasksFiltered(req.params.filter);
        if(filtered.error)
            res.status(404).json(filtered);
        else
            res.json(filtered);
    }
    catch(err){
        res.status(500).end();
    }
});

// Get task by ID
app.get('/api/tasks/:id', async (req, res) => {
    try{
        const task = await dao.getTask(req.params.id);
        if(task.error)
            res.status(404).json(task);
        else
            res.json(task);
    }
    catch(err){
        res.status(500).end();
    }
})

// Create task
app.post('/api/tasks', async (req, res) => {
    const newtask = {
        description: req.body.description,
        important: req.body.important,
        private: req.body.private,
        deadline: req.body.deadline
    };
    try{
        await dao.createTask(newtask);
        res.status(201).end();
    }
    catch(err){
        res.status(503).json({error: `Database error during creation of task ${task.description}`});
    }
})

// Update task
app.put('/api/tasks/:id', async (req, res) =>{
    const task = req.body;

    try{
        await dao.updateTask(task);
        res.status(200).end();
    }
    catch(err){
        res.status(503).json({error: `Database error while updating ${req.params.id}`});
    }
})

// Mark task as completed/uncompleted
app.put('/api/tasks/:id/:mark', async (req, res) => {
    const task = await dao.getTask(req.params.id);
    if(task.error)
        res.status(404).json({error: `Task with id=${req.params.id} not found!`});
    try{
        await dao.markTask(req.params.id, req.params.mark);
        res.status(200).end();
    }
    catch(err){
        res.status(503).json({error: `Error while marking task ${req.params.id}`});
    }
})

app.delete('/api/tasks/:id', async (req, res) => {
    const task = await dao.getTask(req.params.id);
    if(task.error)
        res.status(404).json({error: `Task with id=${req.params.id} not found!`});
    try{
        await dao.deleteTask(req.params.id);
        res.status(201).end();
    }
    catch(err){
        res.status(503).json({error: `Database error while deleting!`});
    }
})
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}/`));