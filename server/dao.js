'use strict';

const sqlite = require ('sqlite3');

const db = new sqlite.Database('tasks.db', (err) => {
  if(err) throw err;
});

exports.listTasks = () =>{

return new Promise ((resolve,reject)=> {
    const sql = 'SELECT * FROM tasks';
    db.all(sql,[], (err,rows)=> {
         if (err) {
        reject(err);
        return;
      }
      const tasks = rows.map((c)=> ({id: c.id, description: c.description, important: c.important, private: c.private, urgent: c.urgent, deadline: c.deadline}));
      resolve(tasks);
    });
});
    
}
/*
exports.listTasksbyFilter = () => {
 const sql = 

}*/