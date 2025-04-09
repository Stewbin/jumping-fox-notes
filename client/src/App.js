import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "./styles/App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import MainEditor from "./pages/Editor";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/Editor" element= {<MainEditor />}/>
    </Routes>
  );
}

export default App;
