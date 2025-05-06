import React, { useState } from "react";
import { FaSun,FaMoon } from "react-icons/fa";
// import "../styles/MenuBar.css";
import fox from "../fox.svg";

export default function MenuBar({
  onFileNew,
  onFileSave,
  onFileDelete,
  darkMode,
  onToggleDarkMode,
  openNewNote,
  navigateToHome,
}) {
  const [allNotes, setAllNotes] = useState([]);
  return (
    <nav
      className={
        "navbar navbar-expand sticky-top " +
        (darkMode ? "navbar-dark bg-dark" : "navbar-light bg-light")
      }
    >
      <div className="container-fluid">
        <ul className="navbar-nav flex-row">
          {/* File Dropdown */}
          <li className="nav-item dropdown me-3">
            <button
              className="nav-link active dropdown-toggle"
              data-bs-toggle="dropdown"
              data-bs-auto-close="outside"
            >
              File
            </button>
            <ul
              className={
                "dropdown-menu " + (darkMode ? "dropdown-menu-dark" : "")
              }
            >
              <li>
                <button className="dropdown-item"> n/a</button>
              </li>
              <li>
                <button onClick={onFileNew} className="dropdown-item">
                  New
                </button>
              </li>
              <li>
                <button onClick={onFileSave} className="dropdown-item">
                  Save
                </button>
              </li>
              <li>
                <button onClick={onFileDelete} className="dropdown-item">
                  Delete
                </button>
              </li>
            </ul>
          </li>
          {/* Open Dropdown */}
          <li className="nav-item dropdown me-3">
            <button
              className="dropdown-toggle nav-link active"
              onClick={() =>
                setAllNotes(JSON.parse(localStorage.getItem("notes") ?? "[]"))
              }
              data-bs-toggle="dropdown"
              data-bs-auto-close="outside"
            >
              Open
            </button>
            <ul
              className={`dropdown-menu ${
                darkMode ? "dropdown-menu-dark" : ""
              }`}
            >
              {allNotes.map((note) => (
                <li
                  key={note.id}
                  className="dropdown-item"
                  onClick={() => {
                    openNewNote(note.id, note.name);
                  }}
                >
                  {note.name}
                </li>
              )) ?? <li className="dropdown-item">No saved notes</li>}
            </ul>
          </li>
          {/* Edit Dropdown */}
          <li className="nav-item dropdown">
            <button className="nav-link active">Edit</button>
          </li>
           {/* Dark mode button */}
           <li className="nav-item ms-3 mt-1">
           <button
           className={`btn btn-sm ${
           darkMode ? "btn-outline-light" : "btn-outline-dark"
           }`}
           onClick={onToggleDarkMode}
           >
           {darkMode ? <FaSun /> : <FaMoon />}
            </button>
          </li>
        </ul>

        {/* Fox brand */}
        <button
          className="navbar-brand bg-transparent border-0"
          onClick={navigateToHome}
        >
          <img src={fox} alt="Jumping Fox Notes" className="logo me-2" />
          Jumping Fox
        </button>
      </div>
    </nav>
  );
}
