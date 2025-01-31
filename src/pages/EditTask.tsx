import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

// Define the Task interface
interface Task {
  id: number;
  name: string;
  description: string;
  finishing_date: string;
  status: string;
}

function EditTask() {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();
  const [task, setTask] = useState<Task | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `http://18.191.107.149:5002/tasks/${taskId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setTask({
            ...data,
            finishing_date: data.finishing_date
              ? new Date(data.finishing_date).toISOString().slice(0, 16)
              : "",
          });
        } else {
          setError("Failed to load task.");
        }
      } catch (err) {
        setError("An error occurred while fetching task.");
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [taskId]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    if (task) {
      setTask({ ...task, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!task) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://18.191.107.149:5002/tasks/${taskId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: task.name,
            description: task.description,
            finishing_date: task.finishing_date,
            status: task.status,
          }),
        }
      );

      if (response.ok) {
        navigate("/");
      } else {
        setError("Failed to update task.");
      }
    } catch (err) {
      setError("An error occurred while updating task.");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!task) return <div className="alert alert-warning">Task not found.</div>;

  return (
    <div className="container mt-5">
      <h1 className="text-primary">Edit Task</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input
            type="text"
            className="form-control"
            name="name"
            value={task.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            className="form-control"
            name="description"
            value={task.description}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Finishing Date</label>
          <input
            type="datetime-local"
            className="form-control"
            name="finishing_date"
            value={task.finishing_date}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Status</label>
          <select
            className="form-control"
            name="status"
            value={task.status}
            onChange={handleChange}
            required
          >
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <button type="submit" className="btn btn-success">
          Save Changes
        </button>
        <button
          type="button"
          className="btn btn-secondary ms-2"
          onClick={() => navigate("/")}
        >
          Cancel
        </button>
      </form>
    </div>
  );
}

export default EditTask;
