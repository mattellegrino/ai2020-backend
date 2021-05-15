import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from 'react-bootstrap'
import dayjs from 'dayjs'
import './App.css';
import { BrowserRouter as Router} from 'react-router-dom';

import TasksNavbar from './components/Navbar_Comp'
import PageContent from './components/Page_Content'


const myTasks = [
  { id: 1, description: 'Complete BigLab', urgent: false, private: true, deadline: dayjs('2021-05-01') },
  { id: 2, description: 'Implement website', urgent: true, private: true, deadline: dayjs('2021-04-19') },
  { id: 3, description: 'Call Manager', urgent: false, private: false, deadline: dayjs('2021-04-26') },
  { id: 4, description: 'Complete English Assignment', urgent: false, private: true, deadline: undefined }
];

function App() {

  return (
    <Router>
      <Container fluid>
        <TasksNavbar />
        <PageContent tasks={myTasks} />
      </Container>
    </Router>
  );
}

export default App;