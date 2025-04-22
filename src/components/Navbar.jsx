import React from "react";
import {
  FaFileMedical,
  FaFolderPlus,
  FaMagnifyingGlass,
} from "react-icons/fa6";
import fox from "../fox.svg";
import { RxAvatar } from "react-icons/rx";

export default function Navbar({ onNewNote, onNewNotebook }) {
  return (
    <nav className="navbar navbar-expand-md navbar-light bg-light sticky-top">
      <div className="container">
        <a className="navbar-brand" href="/">
          <img src={fox} alt="Jumping Fox Notes" className="logo" />
        </a>
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
              <button className="btn invisi-btn" onClick={onNewNotebook}>
                <FaFolderPlus />
                New Notebook
              </button>
            </li>
          </ul>
          <form className="d-flex">
            <input
              className="form-control me-2"
              type="search"
              placeholder="Search"
              aria-label="Search"
            />
            <button className="btn btn-outline-success" type="submit">
              <FaMagnifyingGlass />
            </button>
          </form>
          <ul className="navbar-nav">
            <li key={4} className="nav-item">
              <button className="btn" type="button">
                <RxAvatar style={{ fontSize: "2em" }} />
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
