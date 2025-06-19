import React from 'react';
import { BiEdit } from "react-icons/bi";
import { AiFillDelete } from "react-icons/ai";

const ToDo = ({ text, completed, toggleComplete, updateMode, deleteToDo }) => {
  return (
    <div className={`todo ${completed ? "completed" : ""}`}>
      <div className="todo-content">
        <input 
          type="checkbox" 
          checked={completed} 
          onChange={toggleComplete}
        />
        <div className="text">{text}</div>
      </div>
      <div className="icons">
        <BiEdit className="editIcon" onClick={updateMode} />
        <AiFillDelete className="deleteIcon" onClick={deleteToDo} />
      </div>
    </div>
  );
};

export default ToDo;

