import React from "react";
import TaskList from "./TaskList";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./Header";

const Dashboard = () => {
  return (
    <div className="container mt-5">
      <Header />
      <div className="text-center mb-4">
        <h1 className="display-4">Dashboard</h1>
        <p className="lead">Welcome to your task management dashboard.</p>
      </div>
      <TaskList />
    </div>
  );
};

export default Dashboard;
