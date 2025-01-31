import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Define the Task interface to match API response
interface Task {
  id: number;
  name: string;
  description: string;
  creation_date: string;
  finishing_date: string;
  status: string;
  category: string;
}

function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://18.191.107.149:5002/tasks", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data)) {
            setTasks(data);
          } else {
            setError("Received data is not an array of tasks.");
          }
        } else {
          setError("Failed to load tasks.");
        }
      } catch (err) {
        setError("An error occurred while fetching tasks.");
      }
    };

    fetchTasks();
  }, []);

  const handleDelete = async (taskId: number) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`http://18.191.107.149:5002/tasks/${taskId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.ok) {
      setTasks(tasks.filter((task) => task.id !== taskId));
    } else {
      setError("Failed to delete task.");
    }
  };

  const categories = ["All", ...new Set(tasks.map((task) => task.category))];
  const filteredTasks =
    selectedCategory === "All"
      ? tasks
      : tasks.filter((task) => task.category === selectedCategory);

  return (
    <div className="container mt-5">
      <h1 className="text-primary">Your Tasks</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="d-flex justify-content-between mb-3">
        <button
          className="btn btn-primary"
          onClick={() => navigate("/createTask")}
        >
          Create Task
        </button>
        <select
          className="form-select w-auto"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
      <div className="row">
        {filteredTasks.map((task) => (
          <div key={task.id} className="col-md-4 mb-4">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title">{task.name}</h5>
                <p className="card-text">{task.description}</p>
                <p>Category: {task.category}</p>
                <p className="text-muted">
                  <small>
                    Created on: {new Date(task.creation_date).toLocaleString()}
                  </small>
                  <br />
                  <small>
                    Finishing by:{" "}
                    {new Date(task.finishing_date).toLocaleString()}
                  </small>
                </p>
                <span
                  className={`badge bg-$
                    {task.status === "pending" ? "warning" : "success"}`}
                >
                  {task.status}
                </span>
                <br />
                <div className="mt-3 d-flex justify-content-between">
                  <button
                    className="btn btn-sm btn-warning"
                    onClick={() => navigate(`/edittask/${task.id}`)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(task.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {filteredTasks.length === 0 && (
        <h3>No tasks available in this category.</h3>
      )}
    </div>
  );
}

export default Tasks;
