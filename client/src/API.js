import dayjs from 'dayjs';

async function RetrieveTaskList() {
    // call GET /api/tasks
    const response = await fetch('/api/tasks');
    const list = await response.json();
    if(response.ok)
        return list.map((t) =>
        ({ id: t.id, description: t.description, urgent: t.urgent, private: t.private, deadline: t.deadline ? dayjs(t.deadline) : undefined, completed: t.completed, user: t.user }));
    else throw list;
}

function addTaskDB(task){
    // call POST /api/tasks
    return new Promise((resolve, reject) => {
        const f = {id: task.id, description: task.description, urgent: task.urgent ? 1 : 0, private: task.private ? 1 : 0, deadline: task.deadline ? task.deadline.format('YYYY-MM-DD') : undefined};
       fetch('/api/tasks', {
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify(f),
        }).then((response) => {
            if(response.ok)
                resolve();
            else{
                response.json().then( obj => reject(obj));
            }
        }).catch(err => reject({error: 'Communication problems!!'}))
    })
}

function deleteTask(id){
    // call DELETE /api/tasks/:id
    return new Promise((resolve, reject) => {
        fetch('/api/tasks/' + id, {
            method: 'DELETE',
        }).then((response) => {
            if(response.ok){
                resolve(null);
            }else{
                // analyze the source of the error
                response.json()
                .then((message) => { reject(message); }) // error message in response body
                .catch(() => { reject({error: "Cannot parse response from server. "}) });
            }
        }).catch(() => { reject({ error: "Cannot communicate with the server. "}) }); // connection errors 
    })
}


function updateTask(task) {
// call PUT /api/tasks/:id
return new Promise((resolve, reject) => {

 fetch(`api/tasks/${task.id}`, {
     method: 'PUT',
     headers: {'Content-Type': 'application/json'},
     body: JSON.stringify({id: task.id, description: task.description, important: task.urgent, completed: task.completed, private: task.private, deadline: task.deadline})
 }).then((response)=> {
     if(response.ok) {
         resolve(null);
     }

     else {
         //analyze and return the error
         
         response.json().then((obj)=> {reject(obj);})
     }
 }).catch(err => {reject({'error': 'Cannot communicate with the server'})});

 })


}


const API = {RetrieveTaskList, addTaskDB, updateTask};
export default API;