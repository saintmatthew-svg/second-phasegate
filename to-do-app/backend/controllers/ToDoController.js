const ToDoModel = require('../models/ToDoModel')

module.exports = {
  getToDo: async (req, res) => {
    try {
      const toDo = await ToDoModel.find()
      res.send(toDo)
    } catch (err) {
      console.log(err)
      res.status(500).send("Error fetching todos")
    }
  },

  saveToDo: async (req, res) => {
    const { text } = req.body
    try {
      const data = await ToDoModel.create({text})
      console.log("Added Successfully...")
      res.send(data)
    } catch (err) {
      console.log(err)
      res.status(500).send("Error saving todo")
    }
  },

  updateToDo: async (req, res) => {
    const {_id, text} = req.body
    try {
      await ToDoModel.findByIdAndUpdate(_id, {text})
      res.send("Updated successfully...")
    } catch (err) {
      console.log(err)
      res.status(500).send("Error updating todo")
    }
  },

  deleteToDo: async (req, res) => {
    const {_id} = req.body
    try {
      await ToDoModel.findByIdAndDelete(_id)
      res.send("Deleted successfully...")
    } catch (err) {
      console.log(err)
      res.status(500).send("Error deleting todo")
    }
  },

  toggleComplete: async (req, res) => {
    const {_id} = req.body
    try {
      const todo = await ToDoModel.findById(_id)
      await ToDoModel.findByIdAndUpdate(_id, {completed: !todo.completed})
      res.send("Toggled successfully...")
    } catch (err) {
      console.log(err)
      res.status(500).send("Error toggling todo")
    }
  }
}