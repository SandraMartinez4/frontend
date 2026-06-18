import { useState, useEffect } from "react";
import axios from "../services/api";
import Navbar from "../components/Navbar";

function Profile() {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });
  const [fontFamily, setFontFamily] = useState(user?.font_family || "Arial");
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (!user?.id) return;

    const fetchUser = async () => {
      try {
        const response = await axios.get(`/get_user.php?id=${user.id}`);
        if (response.data) {
          setUser(response.data);
          setFontFamily(response.data.font_family || "Arial");
          localStorage.setItem("user", JSON.stringify(response.data));
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchUser();
  }, [user?.id]);

  useEffect(() => {
    document.body.style.fontFamily = fontFamily;
  }, [fontFamily]);

  const handleFontChange = async (newFont) => {
    if (!user?.id) return;

    try {
      const response = await axios.post("/update_user_font.php", {
        user_id: user.id,
        font_family: newFont,
      });

      if (response.data.success) {
        const updatedUser = { ...user, font_family: newFont };
        setUser(updatedUser);
        setFontFamily(newFont);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setMessage({ type: "success", text: "✅ Tipografía actualizada." });
      } else {
        setMessage({ type: "danger", text: response.data.message || "❌ Error actualizando la tipografía." });
      }
    } catch (error) {
      console.error(error);
      setMessage({ type: "danger", text: "❌ Error actualizando la tipografía." });
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <h1 className="fw-bold mb-4">👤 Perfil</h1>

        {!user ? (
          <div className="alert alert-warning shadow-sm">⚠️ Inicia sesión para ver tu perfil.</div>
        ) : (
          <>
            {message && (
              <div className={`alert alert-${message.type} shadow-sm`}>
                {message.text}
              </div>
            )}

            {/* Tarjeta de información del usuario */}
            <div className="card shadow-lg border-0 rounded-4 p-4 mb-4">
              <div className="d-flex align-items-center mb-3">
                <div
                  className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                  style={{ width: "70px", height: "70px", fontSize: "1.8rem" }}
                >
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="mb-0">{user.name}</h3>
                  <small className="text-muted">{user.email}</small>
                </div>
              </div>

              <hr />

              <p className="mb-2"><strong>Puntos:</strong> <span className="text-success">{user.points}</span></p>
              <p className="mb-2">
                <strong>Estado:</strong>{" "}
                {user.is_premium ? (
                  <span className="badge bg-warning text-dark">👑 Premium</span>
                ) : (
                  <span className="badge bg-secondary">Usuario Gratuito</span>
                )}
              </p>
              {user.premium_expires_at && (
                <p className="mb-0">
                  <strong>Premium activo hasta:</strong>{" "}
                  {new Date(user.premium_expires_at).toLocaleDateString()}
                </p>
              )}
            </div>

            {/* Tarjeta de preferencias */}
            <div className="card shadow-lg border-0 rounded-4 p-4">
              <h4 className="mb-3">⚙️ Preferencias</h4>
              <div className="mb-3">
                <label className="form-label">Tipografía</label>
                <select
                  className="form-select shadow-sm"
                  value={fontFamily}
                  onChange={(e) => handleFontChange(e.target.value)}
                >
                  <option value="Arial">Arial</option>
                  <option value="Georgia">Georgia</option>
                  <option value="'Courier New', Courier, monospace">Courier New</option>
                  <option value="'Segoe UI', Tahoma, Geneva, Verdana, sans-serif">Segoe UI</option>
                  <option value="'Trebuchet MS', sans-serif">Trebuchet MS</option>
                </select>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default Profile;
