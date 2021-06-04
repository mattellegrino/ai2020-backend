import { Container, Row, Alert } from 'react-bootstrap'
import SidebarTasks from './Sidebar_Comp'
import { TasksContent } from './Tasks_Content'
import AddTask from './AddButton'
import { useState, useEffect } from 'react'
import { Route, Switch, useLocation, Redirect } from 'react-router'
import { Clock } from 'react-bootstrap-icons'
import API from '../API'
import { LoginForm } from "../LoginForm";

function PageContent() {
    const location = useLocation();
    const [filter, setFilter] = useState(location.state ? location.state.filter : 'All');
    const [tasks, setTasks] = useState([]);
    const [dirty, setDirty] = useState(true);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState(" ");
    const [message, setMessage] = useState(" ");
    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
    const checkAuth = async () => {
      // TODO: qui avremo le info sull'utente dal server, possiamo salvare da qualche parte
      const response = await API.getUserInfo();
      console.log(response);
      setLoggedIn(true);
    };
    checkAuth();
    }, []);

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
    }, [tasks.length, dirty,loggedIn]);

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

    const doLogin = async (credentials) => {
    try {
      const user = await API.login(credentials);
      setLoggedIn(true);
      setMessage({ msg: `Welcome, ${user}!`, type: "success" });
    } catch (err) {
      setMessage({ msg: err, type: "danger" });
    }
  };

  const doLogout = async() => {
      try{
          const log = await API.logout();
          setLoggedIn(false);
          return true;
      }
      catch(err) {
          return false;
      }
  }


    return (
        <Container fluid>
            <Row className="vheight-100">
                {loggedIn ?
                (<SidebarTasks tasks={tasks} handleFilter={handleFilter} filter={filter} doLogout={doLogout}/>):( <span /> )}
                <Switch>
                    <Route path="/login">
                      <>
                      {" "}
                      {loggedIn ? (<Redirect to="/" />) : (<LoginForm login={doLogin} />)}
                      {" "}
                      </>
                    </Route>
                    <Route path="/">
                        {loggedIn ? (<>
                    <Row className="below-nav">{message && (<Alert variant={message.type} onClose={() => setMessage('')} dismissible> {" "}{message.msg}{" "} </Alert>)}</Row>
                        {loading ? (<span className="col-sm-8 col-12 below-nav" > <h1><Clock /> Please wait, loading the list of tasks...</h1> </span>) : 
                        (<TasksContent tasks={tasks} filter={filter} deleteTask={deleteTask} TaskAdder={updateTask} />)} </>) : 
                        ( <Redirect to="/login" />)}
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