import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../services/api";

function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const registerUser = async () => {
    setLoading(true);
    setStatus(null);

    try {
      const response = await axios.post("/register.php", form);

      if (response.data.success) {
        setStatus({
          type: "success",
          text: `🎉 Gracias por el registro, Bienvenid@ a Synotes ${form.name}!`
        });

        // Redirigir después de unos segundos
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else {
        setStatus({
          type: "danger",
          text: response.data.message || "❌ Error al registrar."
        });
      }
    } catch (error) {
      console.error(error);
      setStatus({ type: "danger", text: "❌ Error al registrar." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="fw-bold mb-4 text-primary">📝 Syanotes - Registro</h1>

      {status && (
        <div className={`alert alert-${status.type} shadow-sm`}>
          {status.text}
        </div>
      )}

      <div className="card shadow-lg border-0 rounded-4 p-4">
        <div className="mb-3">
          <label className="form-label">Nombre</label>
          <input
            className="form-control"
            name="name"
            placeholder="Tu nombre"
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Correo</label>
          <input
            className="form-control"
            name="email"
            placeholder="usuario@correo.com"
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Contraseña</label>
          <input
            type="password"
            className="form-control"
            name="password"
            placeholder="********"
            onChange={handleChange}
          />
        </div>

        <button
          className="btn btn-success w-100"
          onClick={registerUser}
          disabled={loading}
        >
          {loading ? " Registrando..." : " Registrarme"}
        </button>
      </div>
    </div>
  );
}

export default Register;
