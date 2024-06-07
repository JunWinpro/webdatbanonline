import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import { HomePage } from "./pages/HomePage.jsx";
import { ErrorPage } from "./pages/ErrorPage.jsx";
import { ContactPage } from "./pages/Contact.jsx";
import Navbar from "./components/HomePage/Navbar.jsx";

function App() {
  return (
    <>
    <Navbar/>
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