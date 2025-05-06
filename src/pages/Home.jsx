import React, { useState, useEffect } from "react";
import "../styles/Home.css";
import NoteCard from "../components/NoteCard";
import Navbar from "../components/Navbar";

export default function Home({ onOpenNote, darkMode }) {
  const [notes, setNotes] = useState([]);
  
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [originalNotes, setOriginalNotes] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("notes");
    const parsedNotes = JSON.parse(saved) ?? [];
    setNotes(parsedNotes);
    setFilteredNotes(parsedNotes);
    setOriginalNotes(parsedNotes);
  }, []);
  const handleNewNote = () => {
    const name = prompt("Enter note name:");
    if (!name) return;
    
    const newNote = {
      name,
      content: "",
      tags: [],
      timestamp: new Date(),
      audios: [],
      id: Date.now(),
    };
    
    const updatedNotes = [...originalNotes, newNote];
    setNotes(updatedNotes);
    setFilteredNotes(updatedNotes);
    setOriginalNotes(updatedNotes);
    localStorage.setItem("notes", JSON.stringify(updatedNotes));
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
      const tagMatch = note.tags && Array.isArray(note.tags) && note.tags.some(tag => 
        tag.toLowerCase().includes(searchLower)
      );
      
      // Return true if either name or tags match
      return nameMatch || tagMatch;
    });
    
    console.log("Search results:", filtered.length, "notes found");
    setFilteredNotes(filtered);
  };

  return (
    <>
      <Navbar onNewNote={handleNewNote} onSearch={handleSearch} />
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