import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function CreateTask() {
  const [taskName, setTaskName] = useState("");
  const [description, setDescription] = useState("");
  const [finishingDate, setFinishingDate] = useState("");
  const [categoryId, setCategoryId] = useState<number | "">(""); // Initially no category selected
  const [categories, setCategories] = useState<any[]>([]); // Store categories
  const [status, setStatus] = useState("Initiation");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Fetch categories when the component is mounted
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://18.191.107.149:5002/categories", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const data = await response.json();
          setCategories(data); // Set categories to state
        } else {
          setError("Failed to load categories.");
        }
      } catch (err) {
        setError("An error occurred while fetching categories.");
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!categoryId) {
      setError("Please select a category.");
      return;
    }

    const token = localStorage.getItem("token");

    const taskData = {
      name: taskName,
      description,
      creation_date: new Date().toISOString(), // Current date and time as creation date
      finishing_date: finishingDate,
      status: status,
      category_id: categoryId, // Send selected category_id
    };

    try {
      const response = await fetch("http://18.191.107.149:5002/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(taskData),
      });

      if (response.ok) {
        navigate("/tasks"); // Navigate back to tasks page
      } else {
        setError("Failed to create task.");
      }
    } catch (err) {
      setError("An error occurred while creating the task.");
    }
  };

  return (
    <div className="container mt-5">
      <h1>Create New Task</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="taskName" className="form-label">
            Task Name
          </label>
          <input
            type="text"
            id="taskName"
            className="form-control"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <textarea
            id="description"
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="finishingDate" className="form-label">
            Finishing Date
          </label>
          <input
            type="datetime-local"
            id="finishingDate"
            className="form-control"
            value={finishingDate}
            onChange={(e) => setFinishingDate(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="categoryId" className="form-label">
            Category
          </label>
          <select
            id="categoryId"
            className="form-select"
            value={categoryId}
            onChange={(e) => setCategoryId(Number(e.target.value))}
            required
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="status" className="form-label">
            Status
          </label>
          <select
            id="status"
            className="form-select"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
          >
            <option value="Initiation">Initiation</option>
            <option value="Pending">Pending</option>
            <option value="Finished">Finished</option>
          </select>
        </div>

        <button type="submit" className="btn btn-primary">
          Create Task
        </button>
      </form>
    </div>
  );
}

export default CreateTask;
