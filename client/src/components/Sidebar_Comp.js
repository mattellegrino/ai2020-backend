import { Nav, ListGroup } from 'react-bootstrap'

import { Link } from 'react-router-dom';

function SidebarTasks(props) {
    const activate = (v) => {
        if (v === props.filter)
            return "list-group-item-action active";
        else return "";
    }
   

    return (
        <Nav hidden="md" className="d-md-block col-sm-4 col-12 bg-light below-nav" >
            <ListGroup variant="flush">
                <Link to={{
                    pathname: '/All',
                    state: {filter: 'All'}
                }} className="text-light" ><ListGroup.Item action variant={activate('All')} onClick={() => props.handleFilter('All')}> All </ListGroup.Item></Link>
                <Link to={{
                    pathname: '/Important',
                    state: {filter: 'Important'}
                }} className="text-light"><ListGroup.Item action variant={activate('Important')} onClick={() => props.handleFilter('Important')}> Important </ListGroup.Item></Link>
                <Link to={{
                    pathname: '/Today',
                    state: {filter: 'Today'}
                }} className="text-light"><ListGroup.Item action variant={activate('Today')} onClick={() => props.handleFilter('Today')}> Today </ListGroup.Item></Link>
                <Link to={{
                    pathname: '/Next7Days',
                    state: {filter: 'Next7Days'}
                }} className="text-light"><ListGroup.Item action variant={activate('Next 7 Days')} onClick={() => props.handleFilter('Next7Days')}> Next 7 Days </ListGroup.Item></Link>
                <Link to={{
                    pathname: '/Private',
                    state: {filter: 'Private'}
                }} className="text-light"><ListGroup.Item action variant={activate('Private')} onClick={() => props.handleFilter('Private')}> Private </ListGroup.Item></Link>
            </ListGroup>
        </Nav>
    );
}

export default SidebarTasks;
