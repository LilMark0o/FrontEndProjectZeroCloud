import { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";

function Profile() {
  const [image, setImage] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    const fetchImage = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await axios.get(
          "http://18.191.107.149:5002/get_image",
          {
            headers: { Authorization: `Bearer ${token}` },
            responseType: "blob",
          }
        );

        const imageUrl = URL.createObjectURL(response.data);
        setImage(imageUrl);
      } catch (err) {
        const error = err as AxiosError;
        console.error(
          "Error fetching image:",
          error.response?.data || error.message
        );
      }
    };

    fetchImage();
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!preview) return alert("Please select an image first.");

    const fileInput = document.getElementById("fileInput") as HTMLInputElement;
    const file = fileInput.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);
    const token = localStorage.getItem("token");

    try {
      await axios.post("http://18.191.107.149:5002/upload_image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Image uploaded successfully!");
      setImage(preview);
      setPreview(null);
    } catch (err) {
      const error = err as AxiosError;
      console.error(
        "Error uploading image:",
        error.response?.data || error.message
      );
      alert("Image upload failed: " + (error.response?.data || error.message));
    }
  };

  return (
    <div className="container d-flex flex-column align-items-center p-4">
      <h2 className="fs-4 fw-bold mb-4">Profile</h2>

      {image && (
        <div className="col-8 d-flex justify-content-center my-3">
          <img
            src={image}
            alt="Profile"
            className="w-100 rounded-circle border border-secondary"
            style={{ maxWidth: "300px", height: "300px", objectFit: "cover" }}
          />
        </div>
      )}

      <h3 className="mb-3">Upload a new profile picture</h3>

      <input
        type="file"
        id="fileInput"
        accept="image/*"
        onChange={handleFileChange}
        className="form-control mb-2 w-50"
      />

      {preview && (
        <div className="col-8 d-flex justify-content-center">
          <img
            src={preview}
            alt="Preview"
            className="w-100 rounded-circle border border-secondary"
            style={{ maxWidth: "300px", height: "300px", objectFit: "cover" }}
          />
        </div>
      )}

      <button onClick={handleUpload} className="btn btn-primary mt-2">
        Upload New Profile Picture
      </button>
    </div>
  );
}

export default Profile;
