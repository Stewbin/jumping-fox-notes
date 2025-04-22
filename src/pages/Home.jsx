import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import "../styles/Home.css";
import NoteCard from "../components/NoteCard";
import NotebookCard from "../components/NotebookCard";
import { /* pullNotebooks, */ pullNotes } from "../lib/firestore";

export default function Home() {
  const [cwd, setCwd] = useState(["Root"]); // Array of path segments
  // TODO: Get notes from local storage / DB
  const [notes, setNotes] = useState([]);
  const [notebooks, setNotebooks] = useState([
    { name: "ICSI 418Y", tags: ["Computer Science", "Engineering"] },
  ]);
  const openNewTab = (note) => {
    window.open(`/Editor/${note.id}`, "_blank");
  };

  useEffect(() => {
    const saved = localStorage.getItem("notes");
    // const saved = getNotes(cwd);
    if (saved != null) {
      setNotes(JSON.parse(saved));
    }
  }, [cwd]);
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

  const handleClickNotebook = (nbName) => {
    setCwd([...cwd, nbName]);
    setNotes(pullNotes([...cwd, nbName]));
  };
  return (
    <>
      <Navbar onNewNote={handleNewNote} />
      <div className="container">
        <div className="row">
          {/* Show current working 'directory' */}
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              {cwd.map((segment, index) => (
                <li
                  className={`breadcrumb-item ${
                    index + 1 < cwd.length ? "" : "active"
                  }`}
                >
                  {segment}
                </li>
              ))}
            </ol>
          </nav>
        </div>
        <div className="row">
          <h3 className="m-3">Your Notebooks</h3>
        </div>
        <div className="row">
          {notes.map((note) => (
            <div key={note.id} className="col-lg-2 col-md-3 col-sm-6">
              <NoteCard
                id={note.id}
                title={note.name}
                tags={note.tags}
                lastModified={new Date()}
                onClick={() => openNewTab(note)}
              />
            </div>
          ))}
        </div>
        <div className="row">
          <h3 className="m-3">Your Notebooks</h3>
        </div>
        <div className="row">
          {notebooks.map((nb) => (
            <div key={nb.name} className="col-lg-2 col-md-3 col-sm-6">
              <NotebookCard
                name={nb.name}
                tags={nb.tags}
                onClick={handleClickNotebook}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
