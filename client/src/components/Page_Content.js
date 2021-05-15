import { Container, Row } from 'react-bootstrap'
import SidebarTasks from './Sidebar_Comp'
import { TasksContent } from './Tasks_Content'
import AddTask from './AddButton'
import { useState } from 'react'
import { Route, Switch, useLocation } from 'react-router'


function PageContent(props) {
    const location = useLocation();

    const [tasks, setTasks] = useState([...props.tasks]);
    const [filter, setFilter] = useState(location.state ? location.state.filter : 'All');

    const handleFilter = (new_f) => {
        setFilter(new_f);
    }

    const TaskAdder = (task) => {
        setTasks(tasks => [...tasks, task]);
    }
    const deleteTask = (id) => {
        setTasks((tasks) => tasks.filter(t => t.id !== id))
    }
    const updateTask = (task) => {
        setTasks(tasks => {
            return tasks.map(t => {
                if (t.id === task.id)
                    return { id: task.id, description: task.description, urgent: task.urgent, private: task.private, deadline: task.deadline };
                else
                    return t;
            });
        });
    };
    return (
        <Container fluid>
            <Row className="vheight-100">
                <SidebarTasks tasks={tasks} handleFilter={handleFilter} filter={filter} />
                <Switch>
                    <Route exact path="/">
                        <TasksContent tasks={tasks} filter={filter} deleteTask={deleteTask} TaskAdder={updateTask} />
                    </Route>
                    <Route exact path="/All">
                        <TasksContent tasks={tasks} filter={filter} deleteTask={deleteTask} TaskAdder={updateTask} />
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