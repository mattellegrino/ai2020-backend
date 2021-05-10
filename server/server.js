const express = require('express');
const morgan = require ('morgan');
const PORT = 3001;
const dao = require('./dao');

app = new express();

app.get('/api/tasks', (req,res)=>{

dao.listTasks()
.then(tasks => res.json(tasks))
.catch(() => res.status(500).end());
})

app.listen(PORT, ()=>console.log(`Server running on http://localhost:${PORT}/`));