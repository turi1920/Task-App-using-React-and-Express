import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userRole, setUserRole] = useState("");
  const [username, setUsername] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      const userGroup = user.group;
      setUserRole(user.role); 
      setUsername(user.username);

      axios
        .get("http://localhost:5000/tasks")
        .then((response) => {
          const filteredTasks = response.data.filter(
            (task) => task.group === userGroup
          );
          const tasksWithCompletionInfo = filteredTasks.map((task) => {
            const completedBy = localStorage.getItem(`task-completed-by-${task.id}`);
            return { ...task, completedBy };
          });
          setTasks(tasksWithCompletionInfo);
          setLoading(false);
        })
        .catch((err) => {
          setError("Failed to fetch tasks.");
          setLoading(false);
        });
    }
  }, []);

  const handleDone = (taskId) => {
    localStorage.setItem(`task-completed-by-${taskId}`, username);

    axios
      .put(`http://localhost:5000/tasks/${taskId}`, {
        status: "Completed",
        completedBy: username,
      })
      .then(() => {
        setTasks(
          tasks.map((task) =>
            task.id === taskId
              ? { ...task, status: "Completed", completedBy: username }
              : task
          )
        );
      })
      .catch((err) => {
        console.error("Failed to update task status", err);
      });
  };

  const handlePending = (taskId) => {
    if (userRole === "admin") {
      localStorage.removeItem(`task-completed-by-${taskId}`);

      axios
        .put(`http://localhost:5000/tasks/${taskId}`, {
          status: "Pending",
          completedBy: null,
        })
        .then(() => {
          setTasks(
            tasks.map((task) =>
              task.id === taskId ? { ...task, status: "Pending", completedBy: null } : task
            )
          );
        })
        .catch((err) => {
          console.error("Failed to update task status", err);
        });
    }
  };

  const handleDelete = (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      axios
        .delete(`http://localhost:5000/tasks/${taskId}`)
        .then(() => {
          localStorage.removeItem(`task-completed-by-${taskId}`);
          setTasks(tasks.filter((task) => task.id !== taskId));
        })
        .catch((err) => {
          console.error("Failed to delete task", err);
        });
    }
  };

  if (loading) {
    return <div className="text-center">Loading tasks...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="container mt-5">
      <h2 className="text-center">Tasks for Your Group</h2>
      <div className="mt-4">
        {tasks.length === 0 ? (
          <div className="alert alert-info">No tasks available for your group.</div>
        ) : (
          <table className="table table-striped table-bordered">
            <thead className="thead-dark">
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Assignee</th>
                <th>Deadline</th>
                <th>Status</th>
                <th>Completed By</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task.id}>
                  <td>{task.title}</td>
                  <td>{task.description}</td>
                  <td>{task.assignee}</td>
                  <td>{task.deadline}</td>
                  <td>{task.status}</td>
                  <td>{task.completedBy || "-"}</td>
                  <td>
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => handleDone(task.id)}
                      disabled={task.status === "Completed"}
                    >
                      Done
                    </button>
                    {userRole === "admin" && (
                      <>
                        <button
                          className="btn btn-warning btn-sm ml-2"
                          onClick={() => handleDelete(task.id)}
                        >
                          Delete
                        </button>
                        <button
                          className="btn btn-secondary btn-sm ml-2"
                          onClick={() => handlePending(task.id)}
                        >
                          Pending
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default TaskList;
