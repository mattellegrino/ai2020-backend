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

const API = {RetrieveTaskList, addTaskDB};
export default API;