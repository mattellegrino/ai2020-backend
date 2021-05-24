import dayjs from 'dayjs';
import { useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap'

function ModalForm(props) {
    const [form, setForm] = useState(props.edit ? { desc: props.task.description, urgent: props.task.urgent, private: props.task.private, date: props.task.deadline } : {});
    const [errors, setErrors] = useState({});

    const setField = (field, value) => {
        setForm({ ...form, [field]: value });
        //Check and see if errors exist, and remove them from the error object
        if (!!errors[field])
            setErrors({ ...errors, [field]: null });
    }
    const findFormErrors = () => {
        const { desc, date } = form;
        const newErrors = {};

        if (!desc || desc === '') newErrors.desc = 'cannot be blank!';
        else if (!props.edit && props.tasks.filter(t => t.description === desc).length > 0) newErrors.desc = 'Task already in the list!';
        else if(props.edit && props.tasks.find(t => t.description === desc) !== undefined) newErrors.desc = 'Task already in the list!';

        if (dayjs(date) < dayjs().subtract(1, 'day')) newErrors.date = 'Invalid date!';
        return newErrors;
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        const newErrors = findFormErrors();
        if (Object.keys(newErrors).length > 0) {
            // We got errors!
            setErrors(newErrors);
        }
        else {
            let new_Task = {};
            if (props.edit){
                if(form.date.isValid())
                    new_Task = { id: props.task.id, description: form.desc, urgent: form.urgent, private: form.private, deadline: form.date };
                else
                    new_Task = { id: props.task.id, description: form.desc, urgent: form.urgent, private: form.private, deadline: undefined };
            }
                
            else {
                new_Task = { id: props.tasks.length + 1, description: form.desc, urgent: form.urgent, private: form.private, deadline: form.date };
                setForm({});
            }
            props.TaskAdder(new_Task);
            props.handleClose();
        }
    }

    const handleDate = (date) => {
        if (date!==undefined) return date.format('YYYY-MM-DD');
        else return date;
    }
    return (<>
        <Modal show={props.show} onHide={props.handleClose} animation={false}>
            <Modal.Header closeButton>
                {props.edit ? <Modal.Title>Edit task</Modal.Title> : <Modal.Title>Insert a new task</Modal.Title> }
                
            </Modal.Header>
             {props.edit ? <Modal.Body>Compile the form down below to edit a new task.</Modal.Body> : <Modal.Body>Compile the form down below to insert a new task.</Modal.Body>}
            

            <Form>
                <Form.Group className="ml-3 mr-3" controlId="description">
                    <Form.Label className="ml-2">Task Description</Form.Label>
                    <Form.Control type="text" placeholder="Enter description"
                        defaultValue={form.desc} isInvalid={!!errors.desc} onChange={event => setField('desc', event.target.value)} />
                    <Form.Control.Feedback type="invalid"> {errors.desc} </Form.Control.Feedback>
                </Form.Group>
                <Form.Group>
                    <Form.Switch custom id="urgent-switch" label="Urgent" className="ml-5 mb-2" defaultChecked={form.urgent} onChange={event => setField('urgent', event.target.checked)} />
                    <Form.Switch custom id="private-switch" label="Private" className="ml-5 mb-2" defaultChecked={form.private} onChange={event => setField('private', event.target.checked)} />
                   
                </Form.Group>
                <Form.Group className="ml-3 mr-3" controlId="data">
                    <Form.Label className="ml-2">Task Deadline</Form.Label>
                    <Form.Control type="date" isInvalid={!!errors.date} defaultValue={handleDate(form.date)} onChange={event => setField('date', dayjs(event.target.value))} />
                    <Form.Control.Feedback type="invalid"> {errors.date} </Form.Control.Feedback>
                </Form.Group>
            </Form>

            <Modal.Footer>
                <Button variant="danger" size="sm" onClick={props.handleClose}>Cancel</Button>
                <Button variant="success" size="sm" onClick={handleSubmit}> Submit</Button>
            </Modal.Footer>
        </Modal>
    </>
    );
}

export default ModalForm