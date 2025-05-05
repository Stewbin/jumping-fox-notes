import React from "react";
import {
  FaFileMedical,
  FaFolderPlus,
  FaMagnifyingGlass,
} from "react-icons/fa6";
import fox from "../fox.svg";
import { RxAvatar } from "react-icons/rx";

export default function Navbar({ onNewNote, onSearch }) {
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
          {/* Search bar */}
          <form className="d-flex" onSubmit={onSearch}>
            <div className="input-group">
              <input
                className="form-control me-2"
                type="search"
                placeholder="Search"
                aria-label="Search"
              />
              <div className="input-group-append">
                <button className="btn btn-outline-success" type="submit">
                  <FaMagnifyingGlass />
                </button>
              </div>
            </div>
          </form>
          {/* Avatar */}
          <button className="btn btn-link p-0 m-0 border-0" type="button">
            <RxAvatar style={{ fontSize: "2em" }} />
          </button>
          <ul className="navbar-nav">
            <li key={4} className="nav-item"></li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
