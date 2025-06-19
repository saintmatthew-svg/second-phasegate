import axios from "axios";

const baseurl = "http://localhost:3020";

const getAllToDo = (setToDo) => {
  axios
    .get(baseurl)
    .then(({ data }) => {
      console.log("data ---->", data);
      setToDo(data);
    })
    .catch((err) => console.log(err));
};

const addToDo = (text, setText, setToDo) => {
  axios
    .post(`${baseurl}/save`, { text })
    .then(() => {
      setText("");
      getAllToDo(setToDo);
    })
    .catch((err) => console.log(err));
};

const updateToDo = (toDoId, text, setToDo) => {
  axios
    .post(`${baseurl}/update`, { _id: toDoId, text })
    .then(() => getAllToDo(setToDo))
    .catch((err) => console.log(err));
};

const deleteToDo = (toDoId, setToDo) => {
  axios
    .post(`${baseurl}/delete`, { _id: toDoId })
    .then(() => getAllToDo(setToDo))
    .catch((err) => console.log(err));
};

const toggleComplete = (toDoId, setToDo) => {
  axios
    .post(`${baseurl}/toggle`, { _id: toDoId })
    .then(() => getAllToDo(setToDo))
    .catch((err) => console.log(err));
};

export { getAllToDo, addToDo, updateToDo, deleteToDo, toggleComplete };