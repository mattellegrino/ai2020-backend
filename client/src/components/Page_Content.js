import { Container, Row, Alert } from 'react-bootstrap'
import SidebarTasks from './Sidebar_Comp'
import { TasksContent } from './Tasks_Content'
import AddTask from './AddButton'
import { useState, useEffect } from 'react'
import { Route, Switch, useLocation } from 'react-router'
import { Clock } from 'react-bootstrap-icons'
import API from '../API'

function PageContent() {
    const location = useLocation();
    const [filter, setFilter] = useState(location.state ? location.state.filter : 'All');
    const [tasks, setTasks] = useState([]);
    const [dirty, setDirty] = useState(true);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        const getTasks = async () => {
            const list = await API.RetrieveTaskList();
            setTasks(list);
        }
        if (dirty) {
            getTasks().then(() => {
                setLoading(false);
                setDirty(false);
            }).catch(err => {
                setErrorMsg("Impossible to load the list of tasks! Please, try again later...");
                console.error(err);
            });;
        }
    }, [tasks.length, dirty]);

    const handleFilter = (new_f) => {
        setFilter(new_f);

        API.RetrieveTaskListFiltered(new_f)
        .then(() => {
            setDirty(true);
        }).catch(err => handleErrors(err));
    }

    const handleErrors = (err) => {
        if (err.errors)
            setErrorMsg(err.errors[0].msg + ': ' + err.errorrs[0].param);
        else
            setErrorMsg(err.error);
        setDirty(true);
    }
    /* DB-SAVING TASKS*/
    const TaskAdder = (task) => {
        task.status = 'added';
        setTasks(tasks => [...tasks, task]);

        API.addTaskDB(task)
            .then(() => {
                setDirty(true);
            }).catch(err => handleErrors(err));
    }

    const deleteTask = (id) => {
        // set temporary deleted task
        setTasks(oldTasks => {
            return oldTasks.map( t => {
                if(t.id === id)
                    return {...t, status: 'deleted'};
                else return t;
            });
        });

        API.deleteTask(id)
            .then(() => {
                setDirty(true);
            }).catch(err => handleErrors(err));
    }
    const updateTask = (task) => {
        // set temporary updated task
        setTasks(tasks => {
            return tasks.map(t => {
                if (t.id === task.id)
                    return { id: task.id, description: task.description, urgent: task.urgent, private: task.private, deadline: task.deadline, status: 'updated' };
                else
                    return t;
            });
        });
        API.updateTask(task)
            .then(() => {
                setDirty(true);
            }).catch(err => handleErrors(err));
    };


    return (
        <Container fluid>
            <Row className="vheight-100">
                <SidebarTasks tasks={tasks} handleFilter={handleFilter} filter={filter} />
                <Switch>
                    <Route path="/">
                        <Row className="below-nav">{errorMsg && <Alert variant='danger' onClose={() => setErrorMsg('')} dismissible> {errorMsg} </Alert>}</Row>
                        {loading ? <span className="col-sm-8 col-12 below-nav" > <h1><Clock /> Please wait, loading the list of tasks...</h1> </span>
                            : <TasksContent tasks={tasks} filter={filter} deleteTask={deleteTask} TaskAdder={updateTask} />
                        }
                    </Route>
                    <Route exact path="/All">
                        <Row>{errorMsg && <Alert variant='danger' onClose={() => setErrorMsg('')} dismissible> {errorMsg} </Alert>}</Row>
                        {loading ? <span className="col-sm-8 col-12 below-nav" > <h1><Clock /> Please wait, loading the list of tasks...</h1> </span>
                            : <TasksContent tasks={tasks} filter={filter} deleteTask={deleteTask} TaskAdder={updateTask} />
                        }
                    </Route>
                    <Route exact path="/Important">
                        <TasksContent tasks={tasks} filter={filter} deleteTask={deleteTask} TaskAdder={updateTask} />
                    </Route>
                    <Route exact path="/Today">
                        <TasksContent tasks={tasks} filter={filter} deleteTask={deleteTask} TaskAdder={updateTask} />
                    </Route>
                    <Route exact path="/Next7Days">
                        <TasksContent tasks={tasks} filter={filter} deleteTask={deleteTask} TaskAdder={updateTask} />
                    </Route>
                    <Route exact path="/Private">
                        <TasksContent tasks={tasks} filter={filter} deleteTask={deleteTask} TaskAdder={updateTask} />
                    </Route>
                </Switch>
                <AddTask tasks={tasks} TaskAdder={TaskAdder}></AddTask>
            </Row>
        </Container >
    );

}

export default PageContent;