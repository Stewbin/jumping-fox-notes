import React from "react";
import {
  FaFileMedical,
  FaFolderPlus,
  FaMagnifyingGlass,
} from "react-icons/fa6";
import fox from "../fox.svg";
import Avatar from "./Avatar";

export default function Navbar({
  onNewNote,
  onSearch,
  darkMode,
  toggleDarkMode,
}) {
  return (
    <nav className="navbar navbar-expand-md navbar-light bg-light sticky-top">
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
          {/* Create-buttons */}
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
          <ul className="navbar-nav">
            <li key={4} className="nav-item">
              <Avatar darkMode={darkMode} onToggleDarkMode={toggleDarkMode} />
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
