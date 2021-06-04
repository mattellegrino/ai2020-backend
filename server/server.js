const express = require('express');
const morgan = require('morgan');
const { check, validationResult } = require("express-validator"); // validation middleware
const dao = require('./dao');
const PORT = 3001;
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy; // username+psw
const session = require('express-session');
const userDao = require('./user-dao');


/*** Set up Passport ***/
passport.use(new LocalStrategy(
  function(username, password, done) {
    userDao.getUser(username, password).then((user) => { 
      if (!user)
        return done(null, false, { message: 'Incorrect username and/or password.' });
  
      return done(null, user);
    });
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => { 
  userDao.getUserById(id).then((user) => {
    done(null, user); // req.user
  })
  .catch((err) => {
    done(err, null);
  });
});



app = new express();
app.use(morgan('dev'));
app.use(express.json());



const isLoggedIn = (req, res, next) => {
  if(req.isAuthenticated()) {
      console.log("autenticato");
    return next();
  }

  else {
  console.log("non autenticato");
  return res.status(400).json({error: 'Not authorized'});
}
}

// enable sessions in Express
app.use(session({
  // set up here express-session
  secret: 'una frase segreta da non condividere con nessuno e da nessuna parte, usata per firmare il cookie Session ID',
  resave: false,
  saveUninitialized: false,
}));

// init Passport to use sessions
app.use(passport.initialize()); 
app.use(passport.session());


// Get the list of all tasks
/*app.get('/api/tasks', async (req, res) => {
    console.log(req.isAuthenticated());
    if(req.isAuthenticated()) {
    try {

            const tasks = await dao.listTasks();
            res.json(tasks);
    }
    catch (err) {
        res.status(500).end();
    }
}
});*/


app.get('/api/tasks',isLoggedIn, (req,res) => {
    dao.listTasks()
    .then(tasks => res.json(tasks))
    .catch(() => res.status(500).end());
})


// Tasks filter API
app.get('/api/tasks/filter/:filter', isLoggedIn, async (req, res) => {
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
app.get('/api/tasks/:id', isLoggedIn, async (req, res) => {
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
        check("deadline").isDate({ format: "YYYY-MM-DD HH:mm", strictMode: true }).optional(),
    ], isLoggedIn,
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
        check("id").isInt(),
        check("description").isLength({ max: 40 }),
        check("important").isBoolean(),
        check("completed").isInt({ min: 0, max: 1 }),
        check("private").isBoolean(),
        check("deadline").isDate({ format: "YYYY-MM-DD HH:mm", strictMode: true }).optional(),
    ],isLoggedIn,
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
        check("id").isInt(),
        check("description").isLength({ max: 40 }),
        check("important").isBoolean(),
        check("completed").isInt({ min: 0, max: 1 }),
        check("private").isBoolean(),
        check("deadline").isDate({ format: "YYYY-MM-DD HH:mm", strictMode: true }).optional(),
    ], isLoggedIn,
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

app.delete('/api/tasks/:id',isLoggedIn, async (req, res) => {
    try {
        await dao.deleteTask(req.params.id);

        res.status(204).end();
    }
    catch (err) {
        res.status(503).json({ error: `Database error while deleting!` });
    }
})

/*** User APIs ***/
app.post('/api/sessions', passport.authenticate('local'), (req, res) => {
  res.json(req.user);
});

app.get('/api/sessions/current', (req, res) => {
    console.log(req.isAuthenticated());
  if(req.isAuthenticated())
    res.json(req.user);
  else
    res.status(401).json({error: 'Not authenticated'});
})

app.post('/api/logout', (req, res) => {
req.logout();
res.end();
});


/*** Other express-related instructions ***/



app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}/`));