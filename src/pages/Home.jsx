import React, { useState, useEffect } from "react";
import "../styles/Home.css";
import NoteCard from "../components/NoteCard";
import Navbar from "../components/Navbar";
import { pullNotes, pushNote } from "../lib/firestore";

export default function Home({ onOpenNote, darkMode, localOnly }) {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    if (localOnly) {
      const saved = localStorage.getItem("notes");
      setNotes(JSON.parse(saved) ?? []);
    } else {
      pullNotes()
        .then((saved) => setNotes(saved))
        .catch((error) => console.error(error));
    }
  }, [localOnly]);

  const handleNewNote = () => {
    const name = prompt("Enter note name:");
    if (!name) return;

    const newNote = {
      id: Date.now(),
      name,
      content: "",
      tags: [],
      audios: [],
      lastModified: new Date(),
    };

    const updatedNotes = [...notes, newNote];
    setNotes(updatedNotes);
    if (localOnly) {
      localStorage.setItem("notes", JSON.stringify(updatedNotes));
    } else {
      pushNote(newNote, "");
    }
  };

  const handleSearch = (event, searchText) => {
    const filteredNotes = notes.filter((note) => note.name === searchText);
    setNotes(filteredNotes);
  };
  return (
    <>
      <Navbar
        onNewNote={handleNewNote}
        onSearch={handleSearch}
        onToggleDarkMode
      />
      <div className={`container ${darkMode ? "dark-mode" : ""}`}>
        <div className="row">
          <h3 className="m-3">Recent Notes</h3>
        </div>
        <div className="row">
          {notes?.map((note) => (
            <div key={note.id} className="col-lg-2 col-md-3 col-sm-6">
              <NoteCard
                id={note.id}
                title={note.name}
                tags={note.tags}
                timestamp={new Date()}
                onOpenNote={() => onOpenNote(note.id, note.name)}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
