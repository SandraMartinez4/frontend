import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "../services/api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const loginUser = async () => {
    setLoading(true);
    setStatus(null);

    try {
      const response = await axios.post("/login.php", { email, password });

      if (response.data.success) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
        setStatus({ type: "success", text: "✅ Inicio de sesión exitoso. Redirigiendo..." });
        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
      } else {
        setStatus({ type: "danger", text: response.data.message || "❌ Credenciales incorrectas." });
      }
    } catch (error) {
      console.error(error);
      setStatus({ type: "danger", text: "❌ Error al iniciar sesión." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: 420 }}>
      <h1 className="fw-bold mb-4 text-primary">🔐 Iniciar sesión</h1>

      {status && (
        <div className={`alert alert-${status.type} shadow-sm`}>
          {status.text}
        </div>
      )}

      <div className="card shadow-lg border-0 rounded-4 p-4">
        <div className="mb-3">
          <label className="form-label">Correo</label>
          <input
            className="form-control"
            value={email}
            placeholder="usuario@correo.com"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Contraseña</label>
          <input
            type="password"
            className="form-control"
            value={password}
            placeholder="********"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          className="btn btn-primary w-100"
          onClick={loginUser}
          disabled={loading}
        >
          {loading ? " Iniciando..." : "Iniciar Sesión"}
        </button>

        <p className="mt-3 text-center">
          ¿No tienes cuenta?{" "}
          <Link to="/register" className="fw-bold text-decoration-none">
            Regístrate aquí
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
