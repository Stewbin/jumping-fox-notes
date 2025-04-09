import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Home from "./pages/Home";
import DrawingEditor from "./DrawingEditor";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";
import MainEditor from "./pages/Editor";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Home />} /> {/* Added Home route */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/DrawingEditor" element={<DrawingEditor />} />
        <Route path="/Editor" element={<MainEditor />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
