import React, { useState, useEffect,useRef } from "react";
import "../styles/Home.css";
import NoteCard from "../components/NoteCard";
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Navbar from '../components/Navbar';

export default function Home({ onOpenNote, darkMode }) {
  const [notes, setNotes] = useState([]);

  const [user, setUser] = useState(null);
  const [profilePic, setProfilePic] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const fileInputRef = useRef(null);

  const openNewTab = (note) => {
    window.open(`/Editor/${note.id}`, "_blank");
  };

  useEffect(() => {
    const saved = localStorage.getItem("notes");
    setNotes(JSON.parse(saved) ?? []);
    // pullNotes()
    //   .then((saved) => setNotes(saved))
    //   .catch((error) => console.error(error));
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

    // pushNote(newNote, "");
    const updatedNotes = [...notes, newNote];
    setNotes(updatedNotes);
    localStorage.setItem("notes", JSON.stringify(updatedNotes));
  };

  // Fetch profile picture if user is authenticated
  const fetchProfilePicture = async (userId) => {
    try {
      const storage = getStorage();
      const profilePicRef = ref(storage, `userImages/${userId}/profile`);
      const url = await getDownloadURL(profilePicRef);
      setProfilePic(url);
    } catch (error) {
      console.log("No profile picture found or error fetching it:", error);
      // Use default avatar when no picture is found
      setProfilePic(null);
    }
  };
  // Handle profile picture upload
  const handleProfilePicUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file is an image and under 2MB
    if (!file.type.includes("image/")) {
      alert("Please select an image file");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert("Image must be less than 2MB");
      return;
    }

    if (!user) {
      alert("You need to be logged in to upload a profile picture");
      return;
    }

    try {
      const storage = getStorage();
      const storageRef = ref(storage, `userImages/${user.uid}/profile`);

      // Show upload progress (you could add a loading state here)
      const snapshot = await uploadBytes(storageRef, file);
      console.log("Uploaded profile picture!");

      // Get and set the new profile picture URL
      const downloadURL = await getDownloadURL(snapshot.ref);
      setProfilePic(downloadURL);

      // Hide the profile menu after successful upload
      setShowProfileMenu(false);
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      alert("Failed to upload profile picture. Please try again.");
    }
  };

  // Trigger file input click
  const handleUploadButtonClick = () => {
    fileInputRef.current.click();
  };

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchProfilePicture(currentUser.uid);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSearch = (event, searchText) => {
    const filteredNotes = notes.filter((note) => note.name === searchText);
    setNotes(filteredNotes);
  };
  return (
    <>
      <Navbar onNewNote={handleNewNote} onSearch={handleSearch} />
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
