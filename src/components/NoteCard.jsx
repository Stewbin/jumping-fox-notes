import React from "react";
import "../styles/NoteCard.css";
import error404 from "../error-404.png";
import { Link } from "react-router-dom";

/**
 * @param {string} title - Title of the note
 * @param {string} id - ID of note
 * @param {string[]} tags - Tags the note has
 * @param {Date} lastModified - Date object of last modification
 * @returns {JSX.Element}
 */
export default function NoteCard({ title, id, tags, lastModified }) {
  // TODO: Change `tags` for `tagIDs`
  return (
    <div
      className="card w-100"
      onClick={() => console.log("I'm being clicked!!")}
    >
      <Link to={`/Editor/${id}`} className="stretched-link"></Link>
      <img
        src={error404}
        alt="Preview of note"
        className="card-img-top border"
      />
      <div className="card-body">
        <h5 className="card-title">{title}</h5>
        <p className="card-text">
          Last modified: {lastModified.toLocaleString()}
        </p>
      </div>
      <ul className="list-group list-group-flush">
        <li key={0} className="list-group-item">
          {tags.map((tag,i) => (
            <span key = {i} className="badge rounded-pill bg-info">{tag}</span>
          ))}
        </li>
      </ul>
    </div>
  );
}
