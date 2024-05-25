import { BrowserRouter as Router, Route, Switch, Routes } from "react-router-dom";
import "./App.css";
import { HomePage } from "../pages/HomePage";


function App() {
  return (
    <>
      <div className="App">
        <Routes>

          <Route path="/">
            <HomePage/>
          </Route>  
          <Route path="/notes">
            <HomePage/>
          </Route>  
        </Routes>

      </div>
      
    </>
  );
}

export default App;
