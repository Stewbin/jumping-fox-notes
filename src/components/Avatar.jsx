import React, { useState, useRef, useEffect } from "react";
import { logOut } from "../lib/firebase";
import { useNavigate } from "react-router-dom";
import "../styles/Avatar.css";
import { onAuthStateChanged } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { FaUpload } from "react-icons/fa6";
import blankAvatar from "../blank avatar.png";
import { storage, auth } from "../lib/firebase";

export default function Avatar({
  onToggleDarkMode,
  darkMode,
  onToggleLocalOnly,
  localOnly,
}) {
  const navigate = useNavigate();
  const [profilePic, setProfilePic] = useState(blankAvatar);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [user, setUser] = useState(null);
  const fileInputRef = useRef(null);

  // Fetch profile picture if user is authenticated
  const fetchProfilePicture = async (userId) => {
    try {
      const profilePicRef = ref(storage, `userImages/${userId}/profile`);
      const url = await getDownloadURL(profilePicRef);
      setProfilePic(url);
    } catch (error) {
      console.log("No profile picture found or error fetching it:", error);
      // Use default avatar when no picture is found
      setProfilePic(blankAvatar);
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
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchProfilePicture(currentUser.uid);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div id="avatar">
      {/* Change Profile Pic */}
      <button
        className="bt profile-btn"
        type="button"
        onClick={() => setShowProfileMenu(!showProfileMenu)}
      >
        <img src={profilePic} alt="Profile" className="profile-image" />
      </button>

      {/* Profile Menu */}
      {showProfileMenu && (
        <div className="profile-menu">
          {/* Upload profile pic */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleProfilePicUpload}
            accept="image/*"
            style={{ display: "none" }}
          />
          <button
            className="profile-menu-item"
            onClick={handleUploadButtonClick}
          >
            <FaUpload /> Upload Profile Picture
          </button>
          {/* Toggle Dark mode */}
          <button className="btn profile-menu-item" onClick={onToggleDarkMode}>
            {darkMode ? "🌙 Dark Mode" : "☀️ Light Mode"}
          </button>
          {/* Toggle local storage only */}
          <button className="btn profile-menu-item" onClick={onToggleLocalOnly}>
            Local storage only {localOnly && "✔️"}
          </button>
          {/* Logout */}
          <button
            className="btn profile-menu-item"
            onClick={() =>
              logOut()
                .then(() => navigate("/"))
                .catch((error) => console.error(error))
            }
          >
            Log out
          </button>
        </div>
      )}
    </div>
  );
}
