import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import TasksNavbar from './components/Navbar_Comp'
import PageContent from './components/Page_Content'
import { BrowserRouter as Router} from 'react-router-dom';
import { Container } from 'react-bootstrap'

function App() {

  return (
    <Router>
      <Container fluid>
        <TasksNavbar />
        <PageContent />
      </Container>
    </Router>
  );
}

export default App;