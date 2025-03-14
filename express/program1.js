const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

let tasks = [
  {
    id: 1,
    title: "Complete React Project",
    description: "Work on the React-based task manager project.",
    assignee: "turi",
    group: "Wipro",
    deadline: "2025-03-20",
    status: "Pending",
  },
  {
    id: 2,
    title: "Prepare Presentation",
    description: "Prepare slides for the GL group meeting.",
    assignee: "user2",
    group: "GL",
    deadline: "2025-03-21",
    status: "Pending",
  },
  {
    id: 3,
    title: "Fix Backend Bug",
    description: "Resolve the API issue in the task manager app.",
    assignee: "wipro",
    group: "Wipro",
    deadline: "2025-03-18",
    status: "In Progress",
  },
  {
    id: 4,
    title: "Team Meeting",
    description: "Conduct a team meeting for project updates.",
    assignee: "admin2",
    group: "GL",
    deadline: "2025-03-19",
    status: "Pending",
  },
  {
    id: 5,
    title: "Update Documentation",
    description: "Update the project documentation",
    assignee: "user3",
    group: "Wipro",
    deadline: "2025-03-22",
    status: "Pending",
  },
];

let users = [
  { id: 1, username: "wipro", password: "wipro123", role: "admin", group: "Wipro" },
  { id: 2, username: "admin2", password: "admin123", role: "admin", group: "GL" },
  { id: 3, username: "turi", password: "turi", role: "user", group: "Wipro" },
  { id: 4, username: "user2", password: "user123", role: "user", group: "GL" },
  { id: 5, username: "user3", password: "user123", role: "user", group: "Wipro" },
  { id: 6, username: "user4", password: "user123", role: "user", group: "GL" },
  { id: 7, username: "user5", password: "user123", role: "user", group: "Wipro" },
];

// Login endpoint
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (user) {
    res.json({ id: user.id, username: user.username, role: user.role, group: user.group });
  } else {
    res.status(401).json({ error: "Invalid username or password" });
  }
});

// Get all tasks
app.get("/tasks", (req, res) => {
  res.json(tasks);
});

// Add a new task
app.post("/tasks", (req, res) => {
  const newTask = { id: Date.now(), ...req.body, status: "Pending" };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

// Delete a task
app.delete("/tasks/:id", (req, res) => {
  const { id } = req.params;
  tasks = tasks.filter((task) => task.id !== parseInt(id));
  res.status(204).send();
});

// Update task status
app.put("/tasks/:id", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  tasks = tasks.map((task) =>
    task.id === parseInt(id) ? { ...task, status } : task
  );
  res.json(tasks.find((task) => task.id === parseInt(id)));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
