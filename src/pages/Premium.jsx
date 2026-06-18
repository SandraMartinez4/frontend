import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

function Premium() {
  const [status, setStatus] = useState(null);

  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch (error) {
    console.warn("Usuario en localStorage inválido:", error);
  }

  if (!user) {
    return (
      <>
        <Navbar />
        <div className="container mt-4">
          <div className="alert alert-warning">
            Debes iniciar sesión para acceder a Premium.
          </div>
          <Link className="btn btn-primary" to="/register">
            Ir a registro
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <h1 className="fw-bold mb-4">👑 Activar Premium</h1>
        <div className="card p-4 shadow-lg border-0 rounded-4">
          {status && (
            <div className={`alert alert-${status.type} shadow-sm`}>
              {status.message}
            </div>
          )}

          <p className="mb-3">
            💳 Precio: <strong>99 pesos</strong> — Acceso Premium por 30 días
          </p>

          {/* Botón oficial de PayPal */}
          <PayPalScriptProvider options={{ 
  "client-id": "AX8oxNu0iaqbUfmQHMbK_qvQWYhRNHRW2pyGUel48JrQxHXDfFZbfVQMp5-0YtPsUbbfJBGynxtXJChu",
  currency: "MXN"
}}>
  <PayPalButtons
    style={{ layout: "vertical" }}
    createOrder={async () => {
      const res = await fetch("/paypal_create_order.php", { method: "POST" });
      const data = await res.json();
      return data.id; // orderID correcto
    }}
    onApprove={async (data) => {
      const res = await fetch("/paypal_capture_order.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderID: data.orderID, user_id: user.id })
      });
      const result = await res.json();

      if (result.success) {
        const updatedUser = { ...user, is_premium: 1 };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setStatus({
          type: "success",
          message: `${result.message} Precio: ${result.precio}.`
        });
      } else {
        setStatus({ type: "danger", message: result.message || "Error procesando el pago." });
      }
    }}
    onError={(err) => {
      console.error("Error PayPal:", err);
      setStatus({ type: "danger", message: "❌ Error en el pago con PayPal." });
    }}
  />
</PayPalScriptProvider>


          <Link className="btn btn-link mt-3 d-inline-block" to="/dashboard">
            Volver a Synotes
          </Link>
        </div>
      </div>
    </>
  );
}

export default Premium;
