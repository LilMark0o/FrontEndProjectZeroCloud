import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from "axios"; // Import AxiosError

// Define the type for the props
interface LoginProps {
  setIsLoggedIn: (isLoggedIn: boolean) => void;
}

function Login({ setIsLoggedIn }: LoginProps) {
  const [username, setUsername] = useState<string>(""); // Renamed to setUsername
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is already logged in by looking for a token
    if (localStorage.getItem("token")) {
      // If a token exists, navigate to the home page
      navigate("/");
    }
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://18.191.107.149:5002/login",
        {
          username,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json", // Ensure header is set correctly
          },
        }
      );

      localStorage.setItem("token", response.data.token);
      setIsLoggedIn(true);
      navigate("/");
    } catch (err) {
      console.error(err);
      console.log(err);
      setError("Login failed");
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-primary">Login</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleLogin}>
        <div className="mb-3">
          <label htmlFor="username" className="form-label">
            Username
          </label>
          <input
            type="text"
            className="form-control"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)} // Corrected the setter
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
