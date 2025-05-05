import React, { useState, useRef, useEffect } from "react";
import { logOut } from "../lib/firebase";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Avatar.css";
import { onAuthStateChanged } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { FaUpload } from "react-icons/fa6";
import blankAvatar from "../blank avatar.png";
import { storage, auth } from "../lib/firebase";

export default function Avatar({ onToggleDarkMode, darkMode }) {
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
    <>
      {/* Expand offcanvas button */}
      <button
        className="btn btn-link p-0 m-0 border-0"
        type="button"
        data-bs-toggle="offcanvas"
        data-bs-target="#account-settings"
        aria-controls="offcanvasExample"
      >
        <img
          src={profilePic}
          alt="Avatar"
          className="rounded-circle shadow-4"
          id="profile-pic"
        />
      </button>
      {/* Offcanvas */}
      <div
        className="offcanvas offcanvas-end"
        data-bs-scroll="true"
        data-bs-backdrop="true"
        tabIndex="-1"
        id="account-settings"
        aria-labelledby="offcanvasLabel"
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="offcanvasLabel">
            Account
          </h5>
          <button
            type="button"
            className="btn-close text-reset"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body" style={{ textAlign: "center" }}>
          {/* Change Profile Pic */}
          <button
            className="bt profile-btn"
            type="button"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
          >
            <img
              src={profilePic}
              alt="Profile"
              className="profile-image"
              style={{
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
          </button>

          {/* Profile Menu */}
          {true && (
            <div className="profile-menu">
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
            </div>
          )}
          <ul className="list-group list-group-flush mt-3">
            <li className="list-group-item">
              <button className="btn" onClick={onToggleDarkMode}>
                {darkMode ? "🌙 Dark Mode" : "☀️ Light Mode"}
              </button>
            </li>
            <li className="list-group-item">
              <Link className="btn" to={"/404"}>
                Settings
              </Link>
            </li>
            <li className="list-group-item">
              <button
                className="btn"
                onClick={() =>
                  logOut()
                    .then(() => navigate("/"))
                    .catch((error) => console.error(error))
                }
              >
                Log out
              </button>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
