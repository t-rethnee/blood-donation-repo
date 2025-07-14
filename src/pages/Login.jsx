import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router";
import { AuthContext } from "../provider/AuthProvider";
import Swal from "sweetalert2";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { loginUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
  e.preventDefault();
  setError("");

  try {
    const userCredential = await loginUser(email, password);

    // ✅ Save email to localStorage for dashboard access
    localStorage.setItem("userEmail", email);

    Swal.fire({
      icon: "success",
      title: "Login Successful",
      showConfirmButton: false,
      timer: 1500,
    });

    navigate("/");
  } catch (err) {
    setError("Invalid credentials or user not found.");
  }
};


  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-bold text-red-600 mb-4 text-center">Login</h2>

      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          className="w-full border rounded px-3 py-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border rounded px-3 py-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          type="submit"
          className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
        >
          Login
        </button>
      </form>

      <p className="text-center text-sm mt-4">
        Don't have an account?{" "}
        <Link to="/register" className="text-red-600 underline">Register here</Link>
      </p>
    </div>
  );
};

export default Login;
