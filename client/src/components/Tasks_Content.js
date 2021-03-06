import { ListGroup, ListGroupItem, Container, Button, Form, ButtonGroup } from 'react-bootstrap';
import { PersonSquare, Trash } from 'react-bootstrap-icons'
import dayjs from 'dayjs'
import AddTask from './AddButton';
import API from '../API'
import { Alert } from 'react-bootstrap';

function TasksContent(props) {

    var isToday = require('dayjs/plugin/isToday')
    dayjs.extend(isToday)

    var isBetween = require("dayjs/plugin/isBetween");
    dayjs.extend(isBetween);
    
    return (
        <Container className="col-sm-8 col-12 below-nav">
            <h1><strong>Filter Selected: </strong><i>{props.filter}</i></h1>

            <Alert variant="warning" >Note: Use the checkbox provided for each task to mark/unmark the task as completed/uncompleted</Alert>
           
            <ListGroup variant="flush">
                {
                    props.tasks.filter(task => {
                        if (props.filter === 'All')
                            return true;
                        else if (props.filter === 'Important')
                            return task.urgent == true;
                        else if (props.filter === 'Today')
                            return task.deadline ? task.deadline.isToday() === true : false;
                        else if (props.filter === 'Next7Days')
                            return task.deadline ? task.deadline.isBetween(dayjs(), dayjs().add(7, 'day')) === true : false;
                        else if (props.filter === 'Private')
                            return task.private == true;
                        return false;
                    })
                        .map((t) => <TaskRow key={t.id}
                            task={t}
                            tasks={props.tasks}
                            deleteTask={props.deleteTask}
                            TaskAdder={props.TaskAdder}
                        />)
                }
            </ListGroup>
        </Container>
    );
}

function TaskRow(props) {
    let statusClass = null;
    switch (props.task.status) {
        case 'added':
            statusClass = 'bg-success';
            break;
        case 'updated':
            statusClass = 'bg-warning';
            break;
        case 'deleted':
            statusClass = 'bg-danger';
            break;
        default:
            break;
    }
    return (<>
        <ListGroupItem className={statusClass}>
            <Container className="d-flex justify-content-between">
                <TaskRowData task={props.task} />
                <ButtonGroup>
                    <AddTask task={props.task} tasks={props.tasks} edit={true} TaskAdder={props.TaskAdder}></AddTask>
                    <Button variant="outline-danger" size="sm" onClick={() => props.deleteTask(props.task.id)}> <Trash size={12} /> </Button>
                </ButtonGroup>
            </Container>
        </ListGroupItem>
    </>);
}

function TaskRowData(props) {

    const handleCheckbox = async (ev) => {
        if(ev===true){
            props.task.completed = 1;
        }
        else props.task.completed = 0;
        API.markTask(props.task);
        return props.task.completed;
    }

    return (<>
        <Form.Check>
            <Form.Check.Input type="checkbox" defaultChecked={!!props.task.completed} id={props.task.id} onChange={event => handleCheckbox(event.target.checked)}/>
            {
                props.task.urgent ? <Form.Check.Label htmlFor={props.task.id} className="colore">{props.task.description}</Form.Check.Label> :
                    <Form.Check.Label htmlFor={props.task.id} >{props.task.description}</Form.Check.Label>
            }
        </Form.Check>
        {
            props.task.private ? '' : <PersonSquare size={25} />
        }
        {
            props.task.deadline ? <div>{props.task.deadline.format('DD/MM/YYYY HH:mm')}</div> : <small> </small>
        }

    </>
    );
}

export { TasksContent };
