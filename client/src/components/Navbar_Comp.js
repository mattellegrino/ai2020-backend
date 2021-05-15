import { Navbar, Form, FormControl, Button } from 'react-bootstrap'
import { PersonCircle, Check2All } from 'react-bootstrap-icons'

function TasksNavbar() {
    return (
        <Navbar expand="sm" variant="dark" fixed="top" className="bg-dark">
            <Navbar.Toggle aria-controls="#navCollapse" />
            <NavbarLogo />
            <NavbarSearch />
            <NavbarUserLog />
        </Navbar>
    );
}

function NavbarLogo() {
    return (
        <Navbar.Brand href="/">
            <Check2All size={30} /><i>ToDoManager</i>
        </Navbar.Brand>
    );
}

function NavbarSearch() {
    return (
        <Form inline className="mx-auto d-none d-md-block">
            <FormControl type="text" placeholder="Search" />
            <Button variant="outline-success" className="mx-auto"> Search</Button>
        </Form>
    );
}

function NavbarUserLog() {
    return (
        <Navbar.Brand href="/" inline="true" className="nav ml-md-auto">
            <PersonCircle color="green" size={30} />
        </Navbar.Brand>
    );
}

export default TasksNavbar