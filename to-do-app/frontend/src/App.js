import { useEffect, useState } from "react";
import ToDo from "./components/ToDo";
import { getAllToDo, addToDo, updateToDo, deleteToDo } from "./utils/HandleApi";

function App() {
  const [toDo, setToDo] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    getAllToDo(setToDo);
  }, []);

  return (
    <div className="App">
      <div className="container">
        <h1>ToDo App</h1>

        <div className="top">
          <input
            type="text"
            placeholder="Add ToDo..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <div 
            className="add" 
            onClick={() => addToDo(text, setText, setToDo)}>✔️Add
          </div>
        </div>

        <div className="list">
          {toDo.map((item) => (
            <ToDo 
              key={item._id} 
              text={item.text} 
              updateMode={() => {
                const newText = prompt("Update todo", item.text);
                if (newText) {
                  updateToDo(item._id, newText, setToDo);
                }
              }}
              deleteToDo={() => deleteToDo(item._id, setToDo)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;