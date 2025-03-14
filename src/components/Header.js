import React from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleTaskRedirect = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.role === "admin") {
      navigate("/addtask"); 
    } else {
      navigate("/dashboard"); 
    }
  };

  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="container-fluid bg-dark text-white p-3">
      <div className="d-flex justify-content-between align-items-center">
        <h1 className="m-0">Task Manager</h1>
        <div>
          {user ? (
            <>
              <button
                className="btn btn-light btn-sm me-2"
                onClick={handleTaskRedirect}
              >
                {user.role === "admin" ? "Add Task" : "Dashboard"}
              </button>
              <button className="btn btn-light btn-sm" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <button
              className="btn btn-light btn-sm"
              onClick={() => navigate("/")}
            >
              Login
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
