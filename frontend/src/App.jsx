import { Routes, Route, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import bgImage from "./img1.jpg";

function App() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    email: "",
    bloodGroup: "",
    pregnancyMonth: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/register", formData);

      alert("User Registered Successfully 🎉");

      // reset form
      setFormData({
        name: "",
        age: "",
        email: "",
        bloodGroup: "",
        pregnancyMonth: "",
      });

      // 🔥 redirect to login
      navigate("/login");

    } catch (err) {
      alert("Error registering user ❌");
    }
  };

  return (
    <Routes>

      {/* ================= HOME ================= */}
      <Route
        path="/"
        element={
          <div
            style={{
              minHeight: "100vh",
              backgroundImage: `url(${bgImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >

            {/* NAVBAR */}
            <nav
              className="navbar navbar-expand-lg px-4 py-3 shadow-sm"
              style={{
                background: "rgba(255,255,255,0.95)",
                backdropFilter: "blur(8px)"
              }}
            >
              <div className="container-fluid">
                <span
                  className="navbar-brand fw-bold fs-4"
                  style={{ color: "#ff4da6", cursor: "pointer" }}
                  onClick={() => navigate("/")}
                >
                  🌸आईCare
                </span>

                <div className="ms-auto">
                  <button
                    className="btn btn-outline-danger rounded-pill me-2 px-4"
                    onClick={() => navigate("/login")}
                  >
                    Login
                  </button>

                  <button
                  
                    className="btn btn-danger rounded-pill px-4"
                    onClick={() =>
                      document
                        .getElementById("register-section")
                        .scrollIntoView({ behavior: "smooth" })
                    }
                  >
                    Register
                  </button>
                </div>
              </div>
            </nav>

            {/* HERO */}
            <div
              className="d-flex flex-column justify-content-center align-items-center text-center text-white"
              style={{
                backgroundColor: "rgba(0,0,0,0.55)",
                minHeight: "70vh",
                padding: "3rem"
              }}
            >
              <h1 className="display-4 fw-bold">
                Smart Pregnancy Care for Healthy Babies
              </h1>

              <p className="lead mt-3 mb-4">
                Monitor health, track baby growth & never miss appointments.
              </p>

              <button
                className="btn btn-danger btn-lg rounded-pill px-5"
                onClick={() => navigate("/login")}
              >
                Get Started
              </button>
            </div>

            {/* REGISTER FORM */}
            <div id="register-section" className="container py-5">
              <div className="row justify-content-center">
                <div className="col-md-6">

                  <div
                    className="card shadow-lg p-5 rounded-4 border-0"
                    style={{ background: "rgba(255,255,255,0.95)" }}
                  >
                    <h3 className="text-center text-danger fw-bold mb-4">
                      Register Now
                    </h3>

                    <form onSubmit={handleSubmit}>

                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        placeholder="Full Name"
                        className="form-control mb-3 rounded-pill"
                        onChange={handleChange}
                        required
                      />

                      <input
                        type="number"
                        name="age"
                        value={formData.age}
                        placeholder="Age"
                        className="form-control mb-3 rounded-pill"
                        onChange={handleChange}
                        required
                      />

                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        placeholder="Email"
                        className="form-control mb-3 rounded-pill"
                        onChange={handleChange}
                        required
                      />

                      <input
                        type="text"
                        name="bloodGroup"
                        value={formData.bloodGroup}
                        placeholder="Blood Group"
                        className="form-control mb-3 rounded-pill"
                        onChange={handleChange}
                        required
                      />

                      <input
                        type="number"
                        name="pregnancyMonth"
                        value={formData.pregnancyMonth}
                        placeholder="Pregnancy Month (1-9)"
                        className="form-control mb-4 rounded-pill"
                        onChange={handleChange}
                        required
                      />

                      <button className="btn btn-danger w-100 rounded-pill">
                        Register
                      </button>

                    </form>

                  </div>

                </div>
              </div>
            </div>

            <footer className="text-center p-4 bg-light">
              🌸 AaiCare — Smart Pregnancy Monitoring System
            </footer>

          </div>
        }
      />

      {/* LOGIN */}
      <Route path="/login" element={<Login />} />

      {/* DASHBOARD */}
      <Route path="/dashboard" element={<Dashboard />} />

    </Routes>
  );
}

export default App;