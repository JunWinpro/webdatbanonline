import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import { HomePage } from "../pages/HomePage";
import { ErrorPage } from "../pages/ErrorPage";
import { ContactPage } from "../pages/Contact";


function App() {
  return (
    <>
      <Routes>
        <topnav></topnav>
        <Route path="/" element={<HomePage />}/>
        <Route path="/contact" element={<ContactPage />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </>
  );
}

export default App;