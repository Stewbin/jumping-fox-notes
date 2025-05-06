import React, { useState, useRef, useEffect, createElement } from "react";
import "../styles/NoteCard.css";
import placeholder from "../placeholder image.jpg";

/**
 * @param {string} title - Title of the note
 * @param {string} id - ID of note
 * @param {string[]} tags - Tags the note has
 * @param {Date} lastModified - Date object of last modification
 * @returns {JSX.Element}
 */
export default function NoteCard({
  title,
  tags,
  lastModified,
  onOpenNote,
  createdAt,
}) {
  // TODO: Find a way to render content of notes for preview

  // const [notePreview, setNotePreview] = useState(placeholder);
  // const previewRef = useRef();
  // useEffect(() => {
  //   if (!previewRef.current) return;
  //   if (!content) return;
  // }, [content]);

  return (
    <>
      <button
        className="btn p-0 my-3 border-0"
        type="button"
        onClick={onOpenNote}
      >
        <div className="card w-100" style={{ minWidth: "300px" }}>
          <img
            src={placeholder}
            alt="Preview of note"
            className="card-img-top border"
          />
          <div className="card-body">
            <h5 className="card-title">{title}</h5>
            <p className="card-text">
              Last modified: {lastModified}
              <br />
              Created: {createdAt}
            </p>
          </div>
          <ul className="list-group list-group-flush">
            <li key={0} className="list-group-item">
              {tags?.map((tag, i) => (
                <span key={i} className="badge rounded-pill bg-info">
                  {tag}
                </span>
              ))}
            </li>
          </ul>
        </div>
      </button>
    </>
  );
}
