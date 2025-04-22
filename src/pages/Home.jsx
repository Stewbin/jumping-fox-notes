import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import "../styles/Home.css";
import NoteCard from "../components/NoteCard";
import { getNotebookContents } from "../lib/firestore";

export default function Home() {
  const [path, setPath] = useState(["Root"]); // Array of path segments
  // TODO: Get notes from local storage / DB
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
      <Navbar onNewNote={handleNewNote} />
      <div className="container">
        <div className="row">
          <h3 className="m-3">Recent Notebooks</h3>
          {/* Show current working 'directory' */}
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              {path.map((segment, index) => (
                <li
                  className={`breadcrumb-item ${
                    index + 1 < path.length ? "" : "active"
                  }`}
                >
                  {segment}
                </li>
              ))}
            </ol>
          </nav>
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
