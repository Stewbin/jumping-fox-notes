import React, { useState, useEffect } from "react";
import "../styles/Home.css";
import NoteCard from "../components/NoteCard";
import Navbar from "../components/Navbar";
import { pullNotes, pushNote } from "../lib/firestore";

export default function Home({ onOpenNote, darkMode, localOnly }) {
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [originalNotes, setOriginalNotes] = useState([]);

  // Retrieve stored notes
  useEffect(() => {
    if (localOnly) {
      const saved = localStorage.getItem("notes");
      const parsedNotes = JSON.parse(saved) ?? [];
      console.log(parsedNotes);

      setFilteredNotes(parsedNotes);
      setOriginalNotes(parsedNotes);
    } else {
      pullNotes()
        .then((saved) => {
          setFilteredNotes(saved);
          setOriginalNotes(saved);
        })
        .catch((error) => console.error(error));
    }
    setFilteredNotes(parsedNotes);
    setOriginalNotes(parsedNotes);
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

    const updatedNotes = [...originalNotes, newNote];
    setFilteredNotes(updatedNotes);
    setOriginalNotes(updatedNotes);
    if (localOnly) {
      localStorage.setItem("notes", JSON.stringify(updatedNotes));
    } else {
      pushNote(newNote, "");
    }
  };

  const handleSearch = (event, searchText) => {
    // Log to verify the search is being called
    console.log("Searching for:", searchText);

    if (!searchText || searchText.trim() === "") {
      console.log("Empty search, showing all notes");
      setFilteredNotes(originalNotes);
      return;
    }

    const searchLower = searchText.toLowerCase().trim();

    // Filter notes that match either by name or by tags
    const filtered = originalNotes.filter((note) => {
      // Check if the note name contains the search text
      const nameMatch = note.name.toLowerCase().includes(searchLower);

      // Check if any of the tags contain the search text
      const tagMatch =
        note.tags &&
        Array.isArray(note.tags) &&
        note.tags.some((tag) => tag.toLowerCase().includes(searchLower));

      // Return true if either name or tags match
      return nameMatch || tagMatch;
    });

    console.log("Search results:", filtered.length, "notes found");
    setFilteredNotes(filtered);
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
          {filteredNotes?.map((note) => (
            <div key={note.id} className="col-lg-2 col-md-3 col-sm-6">
              <NoteCard
                id={note.id}
                title={note.name}
                tags={note.tags}
                timestamp={new Date(note.timestamp)}
                onOpenNote={() => onOpenNote(note.id, note.name)}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
