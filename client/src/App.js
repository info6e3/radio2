import React from 'react';
import './styles/App.css';
import Radio from "./components/Radio";
import Main from "./components/Main";
import RadioAdmin from "./components/RadioAdmin";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';


function App() {
    return (
        <div className="App">
            <Router>
                <Routes>
                    <Route exact path={"/"} element={<Main/>}/>
                    <Route exact path={"/radio"} element={<Radio/>}/>
                    <Route path={"/radio/admin"} element={<RadioAdmin/>}/>
                </Routes>
            </Router>
        </div>
    );
}

export default App;