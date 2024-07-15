const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 5555;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/morTodolist')
.then(() => console.log('MongoDB connected...'))
.catch(err => console.error(err));

const todoSchema = new mongoose.Schema({
  id: { type: String, required: true },
  todo: { type: String, required: true },
  isCompleted: { type: Boolean, default: false }
});

const Todo = mongoose.model('Todo', todoSchema);

// Routes
app.get('/todos', async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/todos', async (req, res) => {
  try {
    const newTodo = new Todo({
      id: req.body.id,
      todo: req.body.todo,
      isCompleted: req.body.isCompleted
    });
    await newTodo.save();
    res.json(newTodo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedTodo = await Todo.findOneAndUpdate({ id }, req.body, { new: true });
    res.json(updatedTodo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Todo.findOneAndDelete({ id });
    res.json({ message: 'Todo deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
