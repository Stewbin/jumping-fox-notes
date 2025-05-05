import React from "react";
import { logOut } from "../lib/firebase";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Avatar.css";

export default function Avatar({ profilePic, onToggleDarkMode, darkMode }) {
  const navigate = useNavigate();
  return (
    <>
      {/* Trigger button */}
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
        data-bs-backdrop="false"
        tabIndex="-1"
        id="account-settings"
        aria-labelledby="offcanvasLabel"
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="offcanvasLabel">
            Hello User!
          </h5>
          <button
            type="button"
            className="btn-close text-reset"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body">
          <ul className="list-group list-group-flush">
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
