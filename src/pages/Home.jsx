import React, { useState, useEffect } from "react";
import "../styles/Home.css";
import NoteCard from "../components/NoteCard";
import Navbar from "../components/Navbar";
import { pullNotes, pushNote } from "../lib/firestore";

export default function Home() {
  const [notes, setNotes] = useState([]);
  const openNewTab = (note) => {
    window.open(`/Editor/${note.id}`, "_blank");
  };

  useEffect(() => {
    // const saved = localStorage.getItem("notes");
    // setNotes(JSON.parse(saved));
    pullNotes()
      .then((saved) => setNotes(JSON.parse(saved)))
      .catch((error) => console.error(error));
  }, []);
  const handleNewNote = () => {
    const name = prompt("Enter note name:");
    if (!name) return;

    const newNote = {
      name,
      content: "",
      tags: [],
      timestamp: new Date(),
    };

    newNote["id"] = pushNote(newNote);
    const updatedNotes = [...notes, newNote];
    setNotes(updatedNotes);
    // localStorage.setItem("notes", JSON.stringify(updatedNotes));
  };

  const handleSearch = (event, searchText) => {
    const filteredNotes = notes.filter((note) => note.name === searchText);
    setNotes(filteredNotes);
  };
  return (
    <>
      <Navbar onNewNote={handleNewNote} onSearch={handleSearch} />
      <div className="container">
        <div className="row">
          <h3 className="m-3">Recent Notes</h3>
        </div>
        <div className="row">
          {notes.map((note) => (
            <div key={note.id} className="col-lg-2 col-md-3 col-sm-6">
              <NoteCard
                id={note.id}
                title={note.name}
                tags={note.tags}
                timestamp={new Date()}
                onClick={() => openNewTab(note)}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
