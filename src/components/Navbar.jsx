import React, { useState } from "react";
import {
  FaFileMedical,
  FaFolderPlus,
  FaMagnifyingGlass,
} from "react-icons/fa6";
import fox from "../fox.svg";
import Avatar from "./Avatar";

export default function Navbar({ onNewNote, onSearch, darkMode }) {
  const [searchText, setSearchText] = useState("");

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Make sure we're explicitly calling search with the current text
    console.log("Form submitted with search text:", searchText);
    onSearch(e, searchText);
  };

  const handleSearchChange = (e) => {
    const text = e.target.value;
    setSearchText(text);
    // Apply search on each keystroke
    onSearch(e, text);
  };

  return (
    <nav
      className={
        "navbar navbar-expand-md sticky-top " +
        (darkMode ? "bg-dark" : "bg-light")
      }
      data-bs-theme={darkMode ? "dark" : "light"}
    >
      <div className="container ">
        <span className="navbar-brand">
          <img src={fox} alt="Jumping Fox Notes" className="logo" />
        </span>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li key={1} className="nav-item">
              <button className="btn invisi-btn" onClick={onNewNote}>
                <FaFileMedical />
                New Note
              </button>
            </li>
            <li key={2} className="nav-item">
              <button className="btn invisi-btn">
                <FaFolderPlus />
                New Notebook
              </button>
            </li>
          </ul>

          {/* Search bar */}
          <form className="d-flex" onSubmit={handleSearchSubmit}>
            <div className="input-group">
              <input
                className="form-control me-2"
                type="search"
                placeholder="Search by name or tags"
                aria-label="Search"
                value={searchText}
                onChange={handleSearchChange}
              />
              <div className="input-group-append">
                <button className="btn btn-outline-success" type="submit">
                  <FaMagnifyingGlass />
                </button>
              </div>
            </div>
          </form>
          <ul className="navbar-nav">
            <li key={4} className="nav-item"></li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
