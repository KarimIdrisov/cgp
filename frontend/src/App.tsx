import './App.css';
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";
import HomePage from "./pages/HomePage";
import FilePage from "./pages/FilePage";
import ModelingPage from "./pages/ModelingPage";
import GramsPage from "./pages/GramsPage";

function App() {
    return (
        <div>
            <Router>
                <Switch>
                    <Route path="/grams/:filename" component={GramsPage}/>
                    <Route path="/modeling/:filename" component={ModelingPage}/>
                    <Route path="/file" component={FilePage}/>
                    <Route path="/" component={HomePage}/>
                </Switch>
            </Router>
        </div>
    );
}

export default App;

