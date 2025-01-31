import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Tasks from "./pages/Tasks";
import CreateTask from "./pages/CreateTask";
import Register from "./pages/Register";
import EditTask from "./pages/EditTask";
import Profile from "./pages/Profile";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  return (
    <div>
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={<Login setIsLoggedIn={setIsLoggedIn} />}
        />
        <Route path="/register" element={<Register />} />
        <Route
          path="/tasks"
          element={
            isLoggedIn ? <Tasks /> : <Login setIsLoggedIn={setIsLoggedIn} />
          }
        />
        <Route
          path="/edittask/:taskId"
          element={
            isLoggedIn ? <EditTask /> : <Login setIsLoggedIn={setIsLoggedIn} />
          }
        />

        <Route
          path="/createTask"
          element={
            isLoggedIn ? (
              <CreateTask />
            ) : (
              <Login setIsLoggedIn={setIsLoggedIn} />
            )
          }
        />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </div>
  );
}

export default App;
