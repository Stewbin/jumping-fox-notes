import React from "react";
import { FaFolder } from "react-icons/fa";

export default function NoebookCard({ name, tags, onClick }) {
  return (
    <div className="card w-100 position-relative">
      <div className="card-body">
        <FaFolder />
        <h5 className="card-title d-inline">{name}</h5>
        Tags:
        <ul className="list-group list-group-flush">
          <li key={0} className="list-group-item">
            {tags.map((tag, i) => (
              <span key={i} className="badge rounded-pill bg-info">
                {tag}
              </span>
            ))}
          </li>
        </ul>
        <button
          className="stretched-link btn btn-link p-0 m-0 border-0"
          onClick={onClick}
        ></button>
      </div>
    </div>
  );
}
