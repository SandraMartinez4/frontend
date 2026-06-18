import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
 Home,
 NotebookPen,
 Trophy,
 Crown,
 LogOut
}
from "lucide-react";
function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Función para verificar y actualizar el usuario
  const checkUser = () => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    // 1. Verificar el usuario al montar el componente
    checkUser();

    // 2. Escuchar cambios en el localStorage desde otras pestañas/ventanas
    window.addEventListener("storage", checkUser);

    // 3. Crear un evento personalizado para capturar el login/logout en la misma pestaña
    window.addEventListener("authChange", checkUser);

    // Limpiar los listeners al desmontar el componente
    return () => {
      window.removeEventListener("storage", checkUser);
      window.removeEventListener("authChange", checkUser);
    };
  }, []);



  
  const handleLogout = () => {
    localStorage.removeItem("user");
    
    // Actualizamos el estado local inmediatamente sin recargar la página
    setUser(null); 
    
    // (Opcional) Notificar a otros componentes que el auth cambió
    window.dispatchEvent(new Event("authChange"));
    
    navigate("/login");
  };
return (
  <nav
    className="navbar navbar-expand-lg shadow-sm"
    style={{
      background: "linear-gradient(90deg, #afe5f6, #7c3aed)",
    }}
  >
    <div className="container">

      <Link
        className="navbar-brand fw-bold text-white"
        to="/"
      >
        <NotebookPen size={22} className="me-2" />
        Syanotes
      </Link>

      <div className="d-flex flex-wrap gap-2">

        <Link
          className="btn btn-light"
          to="/"
        >
          <Home size={18} className="me-1" />
          Inicio
        </Link>

        <Link
          className="btn btn-light"
          to="/notes"
        >
          <NotebookPen size={18} className="me-1" />
          Notas
        </Link>

        <Link
          className="btn btn-light"
          to="/rewards"
        >
          <Trophy size={18} className="me-1" />
          Recompensas
        </Link>

        <Link
          className="btn btn-warning"
          to="/premium"
        >
          <Crown size={18} className="me-1" />
          Premium
        </Link>

        <Link
          className="btn btn-light"
          to="/profile"
        >
          Perfil
        </Link>

        {user ? (
          <button
            className="btn btn-danger"
            onClick={handleLogout}
          >
            <LogOut size={18} className="me-1" />
            Salir
          </button>
        ) : (
          <Link
            className="btn btn-success"
            to="/login"
          >
            Iniciar sesión
          </Link>
        )}

      </div>
    </div>
  </nav>
);
}

export default Navbar;