import React, { useState } from "react";
import { useNavigate } from "react-router";
import { saveSession } from "../auth/Auth_token.jsx";

const Login = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function clicked(e) {
    e.preventDefault();

    if (!name || !password) {
      setError("Enter username and password");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: name, password }),
      });

      if (response.status === 401) {
        setError("Enter Correct Credentials");
        setPassword("");
        return;
      }
      if (response.status === 400) {
        setError("Username and password are required");
        return;
      }
      if (response.status === 403) {
        setError("Login not permitted on this device");
        return;
      }
      if (!response.ok) {
        setError("Server error, try again");
        navigate("/config");
        // return;
      }

      const result = await response.json();

      if (result.Flag && result.Data?.token) {
        saveSession(result.Data.token, result.Data.valid_for); // 1800 s
        navigate("/config");
      } else {
        setError("Login failed");
      }
    } catch (err) {
      console.log(err.message);
      setError("Connection to the Server Lost");   // network failure
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login_div">
      <div>
        <img src="vguard_logo.svg" alt="No image" className="w-[180px] h-auto block mx-auto mb-6 mix-blend-lighten" />
      </div>
      <form onSubmit={clicked}>
        <div className="login_username">
          <div>UserName</div>
          <input
            type="text"
            placeholder="Enter Your UserName"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="login_password">
          <div>Password</div>
          <input
            type="text"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="login_submit">
          <button disabled={loading}>{loading ? "Please wait..." : "Submit"}</button>
        </div>
        {error && <div className="error">{error}</div>}
      </form>
    </div>
  );
};

export default Login;