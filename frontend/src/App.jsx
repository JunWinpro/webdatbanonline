import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import { HomePage } from "../pages/HomePage";
import { ErrorPage } from "../pages/ErrorPage";
import { ContactPage } from "../pages/Contact";
import Navbar from "./components/Navbar";

function App() {
  return (
    <>
    <Navbar />
    <div className="App">
      <Routes>
        <Route path="/" element={<HomePage />}/>
        <Route path="/contact" element={<ContactPage />} />
        <Route path="*" element={<ErrorPage />} />

      </Routes>
      </div>
    </>
  );
}

export default App;