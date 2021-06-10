import './App.css';
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";

import HomePage from "./pages/HomePage";
import FileUploadPage from "./pages/FileUploadPage";
import ModelingPage from "./pages/ModelingPage";
import FilePage from "./pages/FilePage";
import ModelPage from "./pages/ModelPage";

export default function App() {
    return (
        <div>
            <Router>
                <Switch>
                    <Route exact path="/model" component={ModelPage}/>
                    <Route exact path="/file" component={FilePage}/>
                    <Route path="/modeling/:filename" component={ModelingPage}/>
                    <Route path="/upload-file" component={FileUploadPage}/>
                    <Route path="/" component={HomePage}/>
                </Switch>
            </Router>
        </div>
    );
}

