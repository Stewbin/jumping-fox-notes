import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function MenuBar({
  onFileNew,
  onFileSave,
  onFileDelete,
  darkMode,
}) {
  // File
  const [isFileMenuOpen, setFileMenuOpen] = useState(false);
  const toggleFileMenu = () => {
    setFileMenuOpen((prev) => !prev);
  };
  // File > Open
  const [isOpenMenuOpen, setOpenMenuOpen] = useState(false);
  const toggleOpenMenu = () => {
    const savedNotes = JSON.parse(localStorage.getItem("notes") || "[]");
    setAllNotes(savedNotes);
    setOpenMenuOpen((prev) => !prev);
  };
  const [allNotes, setAllNotes] = useState([]);
  const dropdownRef = useRef(null);

  // Handle click outside for file dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setFileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="navbar top-bar">
      <button classname="home-btn">
        <Link to="/home" className="nav-link">
          Home
        </Link>
      </button>

      <div className="dropdown" ref={dropdownRef}>
        <button className="dropbtn" onClick={toggleFileMenu}>
          File
        </button>
        {isFileMenuOpen && (
          <div className="dropdown-content">
            <button> n/a</button>
            <button onClick={onFileNew}>New</button>
            <button onClick={toggleOpenMenu}>Open</button>
            {isOpenMenuOpen && (
              <div className="open-dropdown">
                {allNotes.length === 0 ? (
                  <div className="note-item">No saved notes</div>
                ) : (
                  allNotes.map((note) => (
                    <div
                      key={note.id}
                      className="note-item"
                      onClick={() => {
                        // openNewTab(note);
                        setOpenMenuOpen(false);
                        setFileMenuOpen(false);
                      }}
                    >
                      {note.name}
                    </div>
                  ))
                )}
              </div>
            )}
            <button onClick={onFileSave}>Save</button>
            <button onClick={onFileDelete}>Delete</button>
          </div>
        )}
      </div>
      <div className="dropdown">
        <button className="dropbtn">Edit</button>
      </div>
    </nav>
  );
}
