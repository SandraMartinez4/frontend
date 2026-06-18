import { useState, useEffect } from "react";
import axios from "../services/api";
import Navbar from "../components/Navbar";

const rewardItems = [
  { id: "netflix", name: "Netflix", cost: 120, description: "1 mes gratis de Netflix", image: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg" },
  { id: "spotify", name: "Spotify", cost: 100, description: "1 mes gratis de Spotify", image: "https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg" },
  { id: "disney", name: "Disney+", cost: 140, description: "1 mes gratis de Disney+", image: "https://upload.wikimedia.org/wikipedia/commons/3/3e/Disney%2B_logo.svg" },
  { id: "steam", name: "Steam Gift Card", cost: 150, description: "Tarjeta de regalo Steam", image: "https://upload.wikimedia.org/wikipedia/commons/8/83/Steam_icon_logo.svg" }
];

function Rewards() {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [redeeming, setRedeeming] = useState(null);

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
        console.error(error);
      }
    };

    fetchUser();
  }, [user?.id]);

  const redeemReward = async (rewardId, rewardCost) => {
    if (!user?.id) {
      setMessage({ type: "danger", text: "⚠️ Debes iniciar sesión para canjear recompensas." });
      return;
    }

    if (user.points < rewardCost) {
      setMessage({ type: "danger", text: "❌ No tienes suficientes puntos para esta recompensa." });
      return;
    }

    setLoading(true);
    setRedeeming(rewardId);
    setMessage(null);

    try {
      const response = await axios.post("/redeem_reward.php", {
        user_id: user.id,   // 👈 CORREGIDO: ahora se envía user_id
        reward_id: rewardId,
        cost: rewardCost
      });

      if (response.data.success) {
        const updatedUser = {
          ...user,
          points: response.data.points
        };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setMessage({ type: "success", text: `🎉 ${response.data.message}` });
      } else {
        setMessage({ type: "danger", text: response.data.message || "❌ No se pudo canjear la recompensa." });
      }
    } catch (error) {
      console.error(error);
      setMessage({ type: "danger", text: "❌ Error al canjear la recompensa." });
    } finally {
      setLoading(false);
      setRedeeming(null);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <h1 className="mb-4">🎁 Recompensas</h1>

        {message && (
          <div className={`alert alert-${message.type} shadow-sm`}>
            {message.text}
          </div>
        )}

        <div className="card p-3 mb-4 shadow-sm">
          <h3>Saldo</h3>
          <p className="mb-1">
            Puntos disponibles: <strong>{user?.points ?? 0}</strong>
          </p>
          <p className="mb-0 text-muted">
            {user?.is_premium
              ? "🌟 Tienes acceso premium y acumulas más rápido."
              : "✨ Mejora a Premium para obtener más puntos al completar notas."}
          </p>
        </div>

        <div className="row gy-4">
          {rewardItems.map((reward) => (
            <div key={reward.id} className="col-md-6">
              <div className="card h-100 shadow-sm border-0">
                <img src={reward.image} alt={reward.name} className="card-img-top p-3" style={{ maxHeight: "150px", objectFit: "contain" }} />
                <div className="card-body">
                  <h4 className="card-title">{reward.name}</h4>
                  <p className="card-text text-muted">{reward.description}</p>
                  <p className="mb-2">
                    <strong>Costo:</strong> {reward.cost} puntos
                  </p>
                  <button
                    className="btn btn-primary w-100"
                    disabled={loading || (user?.points ?? 0) < reward.cost}
                    onClick={() => redeemReward(reward.id, reward.cost)}
                  >
                    {redeeming === reward.id
                      ? "⏳ Procesando..."
                      : (user?.points ?? 0) >= reward.cost
                        ? "Canjear"
                        : "Puntos insuficientes"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Rewards;
