import './App.css';
import {BrowserRouter as Router, Switch, Route} from "react-router-dom"
import HomePage from "./pages/HomePage";
import FilePage from "./pages/FilePage";

function App() {
  return (
      <div>
        <Router>
          <Switch>
            <Route path="/file" component={FilePage}/>
            <Route path="/" component={HomePage}/>
          </Switch>
        </Router>
      </div>
  );
}

export default App;
