import { useEffect, useState } from "react";
import ToDo from "./components/ToDo";
import Modal from "./components/Modal";
import { getAllToDo, addToDo, updateToDo, deleteToDo, toggleComplete } from "./utils/HandleApi";

function App() {
  const [toDo, setToDo] = useState([]);
  const [text, setText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentToDo, setCurrentToDo] = useState(null);
  const [filter, setFilter] = useState("all"); // 'all', 'completed', 'active'

  useEffect(() => {
    getAllToDo(setToDo);
  }, []);

  const filteredTodos = toDo.filter(todo => {
  if (filter === "all") return true;
  if (filter === "completed") return todo.completed === true;
  if (filter === "active") return todo.completed === false;
  return true;
});

useEffect(() => {
  console.log("Current filter:", filter);
  console.log("All todos:", toDo);
  console.log("Filtered todos:", filteredTodos);
}, [filter, toDo]);

  const openModal = (item) => {
    setCurrentToDo(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentToDo(null);
  };

  const saveToDo = (newText) => {
    if (currentToDo) {
      updateToDo(currentToDo._id, newText, setToDo);
      closeModal();
    }
  };

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
            onClick={() => addToDo(text, setText, setToDo)}
          >
            ✔️Add
          </div>
        </div>

        <div className="list">
          {filteredTodos.map((item) => (
            <ToDo 
              key={item._id} 
              text={item.text} 
              completed={item.completed}
              toggleComplete={() => toggleComplete(item._id, setToDo)}
              updateMode={() => openModal(item)}
              deleteToDo={() => deleteToDo(item._id, setToDo)}
            />
          ))}
        </div>

        <Modal 
          show={isModalOpen} 
          handleClose={closeModal} 
          handleSave={saveToDo} 
          initialText={currentToDo ? currentToDo.text : ""} 
        />
      </div>
    </div>
  );
}

export default App;