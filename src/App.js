import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import DrawingEditor from "./DrawingEditor";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";
import MainEditor from "./pages/Editor";
import TabsContainer from "./pages/TabsContainer";
import error404 from "./error-404.png";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/DrawingEditor" element={<DrawingEditor />} />
        <Route path="/Editor/:id" element={<MainEditor />} />
        <Route path="/home" element={<TabsContainer />} />
        <Route
          path="/404"
          element={
            <img
              className="container-fluid vh-100"
              src={error404}
              alt="error-404"
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
