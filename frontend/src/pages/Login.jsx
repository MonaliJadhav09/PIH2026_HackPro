import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {

  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/login", {
        email
      });

      // Login success → go dashboard
      navigate("/dashboard", { state: { user: res.data.user } });

    } catch (error) {

      // If user not found
      if (error.response && error.response.status === 400) {

        setErrorMsg("You haven't registered yet ❗ Redirecting to registration...");

        // Redirect after 2 seconds
        setTimeout(() => {
          navigate("/");
          setTimeout(() => {
            const section = document.getElementById("register-section");
            if (section) {
              section.scrollIntoView({ behavior: "smooth" });
            }
          }, 500);
        }, 2000);

      } else {
        setErrorMsg("Login failed. Try again.");
      }
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(to right, #ffe6f2, #fff0f5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    }}>

      <div className="card p-5 shadow-lg rounded-4 border-0"
           style={{ width: "400px" }}>

        <h3 className="text-center mb-4"
            style={{ color: "#ff4da6" }}>
          🌸 Login
        </h3>

        <form onSubmit={handleLogin}>

          <input
            type="email"
            placeholder="Enter Email"
            className="form-control mb-3 rounded-pill"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button
            className="btn w-100 rounded-pill"
            style={{ background: "#ff4da6", color: "white" }}>
            Login
          </button>

        </form>

        {errorMsg && (
          <p className="text-danger mt-3 text-center">
            {errorMsg}
          </p>
        )}

      </div>

    </div>
  );
}

export default Login;