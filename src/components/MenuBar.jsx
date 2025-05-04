import React, { useState } from "react";
// import "../styles/MenuBar.css";

export default function MenuBar({
  onFileNew,
  onFileSave,
  onFileDelete,
  darkMode,
  openNewNote,
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
                <button
                  className="dropdown-item"
                  onClick={() => alert("TODO: Bring up search modal?")}
                >
                  Open
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
                    openNewNote(note);
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
        </ul>
      </div>
    </nav>
  );
}
