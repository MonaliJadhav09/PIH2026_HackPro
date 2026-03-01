import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

function Dashboard() {

  const location = useLocation();
  const user = location.state?.user;

  const [history, setHistory] = useState([]);
  const [scoreData, setScoreData] = useState(null);
  const [appointment, setAppointment] = useState("");
  const [savedAppointment, setSavedAppointment] = useState(null);

  const [formData, setFormData] = useState({
    bp: "",
    sugar: "",
    hemoglobin: "",
    weight: "",
    exercise: false
  });

  useEffect(() => {
    if (user) {
      fetchData();
      fetchAppointment();
    }
  }, [user]);

  const fetchData = async () => {
    const historyRes = await axios.get(`http://localhost:5000/health-history/${user._id}`);
    setHistory(historyRes.data);

    const scoreRes = await axios.get(`http://localhost:5000/score/${user._id}`);
    setScoreData(scoreRes.data);
  };

  const fetchAppointment = async () => {
    const res = await axios.get(`http://localhost:5000/appointment/${user._id}`);
    setSavedAppointment(res.data);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post("http://localhost:5000/add-health", {
      ...formData,
      userId: user._id
    });
    fetchData();
  };

  const saveAppointment = async () => {
    if (!appointment) return;
    await axios.post("http://localhost:5000/add-appointment", {
      userId: user._id,
      date: appointment
    });
    fetchAppointment();
  };

  const chartData = {
    labels: history.map((_, i) => `Entry ${i + 1}`),
    datasets: [
      {
        label: "BP",
        data: history.map((h) => h.bp),
        borderColor: "#ff4da6",
        tension: 0.4
      },
      {
        label: "Score",
        data: history.map((h) => h.score),
        borderColor: "#28a745",
        tension: 0.4
      }
    ]
  };

  const renderReminder = () => {
    if (!savedAppointment) return null;

    const today = new Date();
    const appDate = new Date(savedAppointment.date);
    const diffTime = appDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) {
      return (
        <p className="text-danger fw-bold mt-3">
          🚨 Appointment is Today! Visit hospital immediately.
        </p>
      );
    }

    if (diffDays <= 3) {
      return (
        <p className="text-warning fw-bold mt-3">
          ⚠ Appointment in {diffDays} days. Be prepared.
        </p>
      );
    }

    return (
      <p className="text-success fw-bold mt-3">
        ✅ Next Appointment: {appDate.toDateString()}
      </p>
    );
  };

  if (!user) return <h3>No user</h3>;

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(to right, #ffe6f2, #fff0f5)",
      padding: "40px"
    }}>

      <div className="container">

        <div className="text-center mb-5">
          <h1 style={{ color: "#ff4da6", fontWeight: "bold" }}>
            🌸 Welcome {user.name}
          </h1>
          <p className="text-muted">Smart Pregnancy Monitoring Dashboard</p>
        </div>

        {/* PROFILE */}
        <div className="card shadow-lg p-4 mb-4 rounded-4 border-0">
          <h5 className="text-danger">👩 Profile</h5>
          <p><b>Age:</b> {user.age}</p>
          <p><b>Email:</b> {user.email}</p>
          <p><b>Month:</b> {user.pregnancyMonth}</p>
        </div>

        {/* HEALTH FORM */}
        <div className="card shadow-lg p-4 mb-4 rounded-4 border-0">
          <h5 className="text-danger">🩺 Add Health Details</h5>
          <form onSubmit={handleSubmit}>
            <input name="bp" placeholder="Blood Pressure"
              className="form-control mb-2 rounded-pill"
              onChange={handleChange} required />

            <input name="sugar" placeholder="Sugar Level"
              className="form-control mb-2 rounded-pill"
              onChange={handleChange} required />

            <input name="hemoglobin" placeholder="Hemoglobin"
              className="form-control mb-2 rounded-pill"
              onChange={handleChange} required />

            <input name="weight" placeholder="Weight"
              className="form-control mb-2 rounded-pill"
              onChange={handleChange} required />

            <div className="form-check mb-3">
              <input type="checkbox" name="exercise"
                className="form-check-input"
                onChange={handleChange} />
              <label className="form-check-label">
                Doing Regular Exercise
              </label>
            </div>

            <button className="btn w-100 rounded-pill"
              style={{ background: "#ff4da6", color: "white" }}>
              Submit Health Data
            </button>
          </form>
        </div>

        {/* SCORE */}
        {scoreData && (
          <div className="card shadow-lg p-4 mb-4 rounded-4 border-0 text-center">
            <h5 className="text-danger">🌟 Healthy Baby Score</h5>
            <h1 style={{
              color: scoreData.status === "Excellent" ? "#28a745" :
                scoreData.status === "Moderate" ? "#ffc107" :
                  "#dc3545"
            }}>
              {scoreData.score}/100
            </h1>
            <p>Status: {scoreData.status}</p>
          </div>
        )}

        {/* GRAPH */}
        {history.length > 0 && (
          <div className="card shadow-lg p-4 mb-4 rounded-4 border-0">
            <h5 className="text-danger">📊 Health Trend</h5>
            <Line data={chartData} />
          </div>
        )}

        {/* APPOINTMENT */}
        <div className="card shadow-lg p-4 mb-4 rounded-4 border-0">
          <h5 className="text-danger">📅 Next Appointment</h5>

          <input
            type="date"
            className="form-control rounded-pill mt-2"
            value={appointment}
            onChange={(e) => setAppointment(e.target.value)}
          />

          <button
            className="btn mt-3 rounded-pill"
            style={{ background: "#ff4da6", color: "white" }}
            onClick={saveAppointment}
          >
            Save Appointment
          </button>

          {renderReminder()}
        </div>

        <div className="text-center mt-5 text-muted">
          🌸 AaiCare — Preventive Pregnancy Monitoring System
        </div>

      </div>
    </div>
  );
}

export default Dashboard;