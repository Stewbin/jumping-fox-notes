import React, { useState, useEffect, useRef} from "react";
import {
  FaFileMedical,
  FaFolderPlus,
  FaMagnifyingGlass,
  FaCamera,
  FaUpload
} from "react-icons/fa6";
import fox from "../fox.svg";
import { RxAvatar } from "react-icons/rx";
import "../styles/Home.css";
import NoteCard from "../components/NoteCard";
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";


export default function Home() {
  // TODO: Get notes from local storage / DB
  const navigate = useNavigate();
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
    if (!file.type.includes('image/')) {
      alert('Please select an image file');
      return;
    }
    
    if (file.size > 2 * 1024 * 1024) {
      alert('Image must be less than 2MB');
      return;
    }
    
    if (!user) {
      alert('You need to be logged in to upload a profile picture');
      return;
    }
    
    try {
      const storage = getStorage();
      const storageRef = ref(storage, `userImages/${user.uid}/profile`);
      
      // Show upload progress (you could add a loading state here)
      const snapshot = await uploadBytes(storageRef, file);
      console.log('Uploaded profile picture!');
      
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
              <li key={4} className="nav-item position-relative">
                <button 
                  className="btn profile-btn" 
                  type="button"
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                >
                  {profilePic ? (
                    <img 
                      src={profilePic} 
                      alt="Profile" 
                      className="profile-image"
                      style={{ width: '2em', height: '2em', borderRadius: '50%', objectFit: 'cover' }}
                    />
                  ) : (
                    <RxAvatar style={{ fontSize: "2em" }} />
                  )}
                </button>
                
                {/* Profile Menu */}
                {showProfileMenu && (
                  <div className="profile-menu">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleProfilePicUpload}
                      accept="image/*"
                      style={{ display: 'none' }}
                    />
                    <button 
                      className="profile-menu-item"
                      onClick={handleUploadButtonClick}
                    >
                     <FaUpload /> Upload Profile Picture
                    </button>
                  </div>
                )}
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
                onClick={() => openNewTab(note)}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}