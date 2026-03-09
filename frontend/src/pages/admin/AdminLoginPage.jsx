import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginAdmin } from "../../api/client";

function AdminLoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await loginAdmin({ username, password });
      localStorage.setItem("adminToken", response.token);
      navigate("/admin");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="auth-page">
      <form className="auth-card" onSubmit={onSubmit}>
        <h2>Ingreso administrador</h2>
        <p>Usa tus credenciales para gestionar la guia comercial.</p>
        <label>
          Usuario
          <input value={username} onChange={(event) => setUsername(event.target.value)} required />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>
        <button type="submit" className="button-link" disabled={loading}>
          {loading ? "Ingresando..." : "Ingresar"}
        </button>
        {error && <p className="error-message">{error}</p>}
      </form>
    </section>
  );
}

export default AdminLoginPage;
