'use strict';

const sqlite = require('sqlite3');

const db = new sqlite.Database('tasks.db', (err) => {
    if (err) throw err;
})

// GET the list of all tasks
exports.listTasks = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM tasks';
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            const tasks = rows.map((t) =>
                ({ id: t.id, description: t.description, urgent: t.important, private: t.private, deadline: t.deadline, completed: t.completed, user: t.user }));
            resolve(tasks);
        })
    })
}

// GET the list of tasks that satisfy a filter
exports.listTasksFiltered = (filter) => {
    return new Promise((resolve, reject) => {
        let sql = '';
        if (filter === "Important")
            sql = 'SELECT * FROM tasks WHERE important=1';
        else if (filter === "Private")
            sql = 'SELECT * FROM tasks WHERE private=1';
        else if (filter === "Completed")
            sql = 'SELECT * FROM tasks WHERE completed=1';
        else if (filter == "Today")
            sql = `SELECT * FROM tasks WHERE date(deadline) == date('now')`
        else if (filter === "Next7Days")
            sql = `SELECT * FROM tasks WHERE date(deadline) >= date('now', '+1 day') AND date(deadline) <= date('now', '+8 day')`

        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            const tasks = rows.map((t) =>
                ({ id: t.id, description: t.description, important: t.important, private: t.private, deadline: t.deadline, completed: t.completed, user: t.user }));  
            resolve(tasks);
        })
    })
}

// GET the task given the id
exports.getTask = (id) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM tasks WHERE id = ?`;
        db.get(sql, [id], (err, row) => {
            if (err) {
                reject(err);
                return;
            }
            if (row === undefined)
                resolve({ error: 'Task not found!' });
            else {
                const task = { id: row.id, description: row.description, important: row.important, private: row.private, deadline: row.deadline, completed: row.completed, user: row.user };
                resolve(task)
            }
        })
    })
}

// POST to create a new task in the db
exports.createTask = (task) => {
    // create default time
    if(task.deadline!==undefined){
        if(task.deadline.search(":") === -1)
            task.deadline = task.deadline.concat(" 23:59");
    }
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO tasks(description, important, private, deadline, completed, user) VALUES(?, ?, ?, STRFTIME(?), 0, 1)';
        db.run(sql, [task.description, task.important, task.private, task.deadline], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.lastID);
        });
    });
};

// PUT to update an existing task
exports.updateTask = (task) => {
    return new Promise((resolve, reject) => {
        const sql = `UPDATE tasks SET description=?, important=?, private=?, deadline=STRFTIME('%Y-%m-%d %H:%M', ?), completed=? WHERE id = ?`;
        db.run(sql, [task.description, task.important, task.private, task.deadline, task.completed, task.id], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.lastID);
        });
    });
};

// mark an existing task as completed/uncompleted
exports.markTask = (id, completed) => {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE tasks SET completed = ? WHERE id = ?';
        db.run(sql, [completed, id], (err) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.lastID);
        })
    })
}

// delete an existing task
exports.deleteTask = (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM tasks WHERE id = ?';
        db.run(sql, [id], (err) => {
            if (err) {
                reject(err);
                return;
            } else
                resolve(null);

        });
    });
};
