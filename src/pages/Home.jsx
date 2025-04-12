import React, { useState, useEffect} from "react";
import {
  FaFileMedical,
  FaFolderPlus,
  FaMagnifyingGlass,
} from "react-icons/fa6";
import fox from "../fox.svg";
import { RxAvatar } from "react-icons/rx";
import "../styles/Home.css";
import NoteCard from "../components/NoteCard";
import { useNavigate } from "react-router-dom";

export default function Home() {
  // TODO: Get notes from local storage / DB
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("notes");
    if (saved) {
      setNotes(JSON.parse(saved));
    }
  }, []);
  const handleNewNote = () => {
    const name = prompt("Enter note name:");
    if (!name) return;

    const newNote = {
      id: Date.now().toString(), // Simple timestamp ID
      name,
      content: "",
      tags: [],
    };

    const updatedNotes = [...notes, newNote];
    setNotes(updatedNotes);
    localStorage.setItem("notes", JSON.stringify(updatedNotes));
  };

  return (
    <>
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
                <button className="btn invisi-btn" onClick={handleNewNote}>
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
      <div className="container">
        <div className="row">
          <h3 className="m-3">Recent Notebooks</h3>
        </div>
        <div className="row">
          {notes.map((note) => (
            <div key={note.id} className="col-lg-2 col-md-3 col-sm-6">
              <NoteCard
                id={note.id}
                title={note.name}
                tags={note.tags}
                lastModified={new Date()}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
