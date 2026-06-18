import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "../services/api";
import Navbar from "../components/Navbar";

function Dashboard() {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    if (!user?.id) return;

    const fetchUser = async () => {
      try {
        const response = await axios.get(`/get_user.php?id=${user.id}`);
        if (response.data) {
          setUser(response.data);
          localStorage.setItem("user", JSON.stringify(response.data));
        }
      } catch (error) {
        console.error("Error cargando usuario:", error);
      }
    };

    fetchUser();
  }, [user?.id]);

  if (!user) {
    return (
      <>
        <Navbar />
        <div className="container mt-4">
          <div className="alert alert-warning shadow-sm">
            ⚠️ No se encontró información del usuario.
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <h1 className="fw-bold mb-4">👋 Bienvenido a <span className="text-primary">Syanotes</span></h1>

        <div className="card shadow-lg border-0 rounded-4 p-4">
          <div className="d-flex align-items-center mb-3">
            <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: "60px", height: "60px", fontSize: "1.5rem" }}>
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="mb-0">{user.name}</h3>
              <small className="text-muted">{user.email}</small>
            </div>
          </div>

          <hr />

          <div className="row text-center mb-3">
            <div className="col-md-4">
              <h5 className="text-muted">Puntos</h5>
              <p className="fw-bold fs-4 text-success">{user.points}</p>
            </div>
            <div className="col-md-4">
              <h5 className="text-muted">Estado</h5>
              {user.is_premium ? (
                <p className="fw-bold text-warning fs-5">👑 Premium</p>
              ) : (
                <p className="fw-bold text-secondary fs-5">Usuario Gratuito</p>
              )}
            </div>
            <div className="col-md-4">
              <h5 className="text-muted">Acciones</h5>
              {!user.is_premium ? (
                <Link className="btn btn-warning btn-sm shadow-sm" to="/premium">
                  Comprar Premium 👑
                </Link>
              ) : (
                <span className="badge bg-success">Activo</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
