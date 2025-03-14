import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./Header";

const AddTask = () => {
  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    deadline: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskData({ ...taskData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      window.location.href = "/";
      return;
    }

    const task = {
      ...taskData,
      assignee: user.username,
      group: user.group,
    };

    axios
      .post("http://localhost:5000/tasks", task)
      .then((response) => {
        alert("Task added successfully!");
        setTaskData({
          title: "",
          description: "",
          deadline: "",
        });
      })
      .catch((error) => {
        alert("Error adding task: " + error.message);
      });
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="container mt-5">
      <Header />
      <div className="card p-4 shadow-sm">
        <h2 className="text-center mb-4">Add Task</h2>
        <form onSubmit={handleSubmit} className="mt-4">
          <div className="mb-3">
            <label htmlFor="title" className="form-label">Task Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={taskData.title}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="description" className="form-label">Description</label>
            <textarea
              id="description"
              name="description"
              value={taskData.description}
              onChange={handleChange}
              className="form-control"
              rows="4"
              required
            ></textarea>
          </div>
          <div className="mb-3">
            <label htmlFor="deadline" className="form-label">Deadline</label>
            <input
              type="date"
              id="deadline"
              name="deadline"
              value={taskData.deadline}
              onChange={handleChange}
              className="form-control"
              min={today}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100 mt-3">Add Task</button>
        </form>
      </div>
    </div>
  );
};

export default AddTask;
