const express = require('express');
const morgan = require('morgan');
const { check, validationResult } = require("express-validator"); // validation middleware
const dao = require('./dao');

const PORT = 3001;
app = new express();

app.use(morgan('dev'));
app.use(express.json());


// Get the list of all tasks
app.get('/api/tasks', async (req, res) => {
    try {
        const tasks = await dao.listTasks();
        res.json(tasks);
    }
    catch (err) {
        res.status(500).end();
    }
});

// Tasks filter API
app.get('/api/tasks/filter/:filter', async (req, res) => {
    try {
        const filtered = await dao.listTasksFiltered(req.params.filter);
        if (filtered.error)
            res.status(404).json(filtered);
        else
            res.json(filtered);
    }
    catch (err) {
        res.status(500).end();
    }
});

// Get task by ID
app.get('/api/tasks/:id', async (req, res) => {
    try {
        const task = await dao.getTask(req.params.id);
        if (task.error)
            res.status(404).json(task);
        else
            res.json(task);
    }
    catch (err) {
        res.status(500).end();
    }
})

// Create task
app.post('/api/tasks',
    [
        check("description").isLength({ max: 40 }),
        check("urgent").isBoolean(),
        check("private").isBoolean(),
        check("deadline").isDate({ format: "YYYY-MM-DD", strictMode: true }),
    ],
    async (req, res) => {
        const newtask = {
            description: req.body.description,
            important: req.body.urgent,
            private: req.body.private,
            deadline: req.body.deadline
        };
        try {
            await dao.createTask(newtask);
            res.status(201).end();
        }
        catch (err) {
            res.status(503).json({ error: `Database error during creation of task ${task.description}` });
        }
    })

// Update task
app.put('/api/tasks/:id',
    [
        check("id").isInt({ min: 1, max: 99 }),
        check("description").isLength({ max: 40 }),
        check("important").isBoolean(),
        check("completed").isInt({ min: 0, max: 1 }),
        check("private").isBoolean(),
        check("deadline").isDate({ format: "YYYY-MM-DD", strictMode: true }),
    ],
    async (req, res) => {
        const task = req.body;

        try {
            await dao.updateTask(task);
            res.status(200).end();
        }
        catch (err) {
            res.status(503).json({ error: `Database error while updating ${req.params.id}` });
        }
    })

// Mark task as completed/uncompleted
app.put('/api/tasks/:id/:mark',
    [
        check("id").isInt({ min: 1, max: 99 }),
        check("description").isLength({ max: 40 }),
        check("important").isBoolean(),
        check("completed").isInt({ min: 0, max: 1 }),
        check("private").isBoolean(),
        check("deadline").isDate({ format: "YYYY-MM-DD", strictMode: true }),
    ], 
    async (req, res) => {
        const task = await dao.getTask(req.params.id);
        if (task.error)
            res.status(404).json({ error: `Task with id=${req.params.id} not found!` });
        try {
            await dao.markTask(req.params.id, req.params.mark);
            res.status(200).end();
        }
        catch (err) {
            res.status(503).json({ error: `Error while marking task ${req.params.id}` });
        }
    })

app.delete('/api/tasks/:id', async (req, res) => {
    try {
        await dao.deleteTask(req.params.id);
        res.status(204).end();
    }
    catch (err) {
        res.status(503).json({ error: `Database error while deleting!` });
    }
})
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}/`));