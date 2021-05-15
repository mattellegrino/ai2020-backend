import { useState } from 'react';
import { Button } from 'react-bootstrap'
import { PencilSquare } from 'react-bootstrap-icons'

import ModalForm from './ModalForm'


function AddTask(props) {
    const [show, setShow] = useState(false);

    const handleClose = () => (setShow(false));
    const handleShow = () => (setShow(true));

    return (<>
        {props.edit ?
            <>
                <Button type="submit" variant="outline-info" size="sm" onClick={handleShow}> <PencilSquare size={12} /> </Button>
                <ModalForm task={props.task} tasks={props.tasks} show={show} handleShow={handleShow} handleClose={handleClose} TaskAdder={props.TaskAdder} edit={props.edit}/>
            </>
            :
            <>
                <Button type="submit" className="btn btn-lg btn-success fixed-right-bottom" onClick={handleShow} >&#43;</Button>
                <ModalForm tasks={props.tasks} show={show} handleShow={handleShow} handleClose={handleClose} TaskAdder={props.TaskAdder} edit={false}/>
            </>
        }</>);
}
export default AddTask;
