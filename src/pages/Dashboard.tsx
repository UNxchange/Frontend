import React from "react";
import StatCard from "../molecules/StatCard";
import ActivityItem from "../molecules/ActivityItem";
import Alert from "../molecules/Alert";
import { Link } from "react-router-dom";
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken"); // Asumiendo el token con la clave 'authToken'
    // Redirige al usuario a la página de login
    navigate("/login");
  };

  return (
    // Contenedor general solo para el color de fondo de toda la página
    <div className="page-background">
      <header className="main-header">
        <div className="header-content">
          <button onClick={() => navigate("/convenios")}>Convocatorias</button>
          <button onClick={() => navigate("/users")}>
            Administrar Usuarios
          </button>
          <button onClick={handleLogout}>Cerrar sesión</button>
        </div>
      </header>

      {/* El main es el que tendrá los márgenes laterales */}
      <main className="dashboard-main">
        <div>
          <h1
            style={{
              fontSize: "32px",
              fontWeight: "bold",
              color: "#1a202c",
              margin: "0 0 5px 0",
            }}
          >
            Tablero
          </h1>
          <p style={{ color: "#6c757d", marginTop: 0 }}>
            Bienvenido! Esto es lo que ha ocurrido en el sistema.
          </p>
        </div>

        <div className="stats-container">
          <StatCard
            title="Usuarios Totales"
            value="2,847"
            change="+12% desde el último mes"
            color="#3b82f6"
          />
          <StatCard
            title="Convocatorias Activas"
            value="156"
            change="+8% desde el último mes"
            color="#10b981"
          />
          <StatCard
            title="Acuerdos"
            value="1,234"
            change="+5% desde el último mes"
            color="#8b5cf6"
          />
          <StatCard
            title="Reseñas"
            value="4.8"
            change="+0.2 desde el último mes"
            color="#f59e0b"
          />
        </div>

        <div className="content-grid">
          {/* Columna de Actividad Reciente */}
          <div className="content-card">
            <h2
              style={{
                margin: "0 0 5px 0",
                fontSize: "18px",
                color: "#343a40",
              }}
            >
              Actividad Reciente
            </h2>
            <p
              style={{
                margin: "0 0 25px 0",
                fontSize: "14px",
                color: "#6c757d",
              }}
            >
              Últimas actividades y actualizaciones del sistema
            </p>
            <div>
              <ActivityItem
                text="Registro de nuevo usuario"
                time="Hace 2 minutos"
                color="#10b981"
              />
              <ActivityItem
                text="Acuerdo firmado"
                time="Hace 15 minutos"
                color="#3b82f6"
              />
              <ActivityItem
                text="Mantenimiento del sistema programado"
                time="Hace 1 hora"
                color="#f59e0b"
              />
            </div>
          </div>

          {/* Columna de Alertas del Sistema */}
          <div className="content-card">
            <h2
              style={{
                margin: "0 0 5px 0",
                fontSize: "18px",
                color: "#343a40",
              }}
            >
              <span role="img" aria-label="alerta">
                ⚠️
              </span>{" "}
              Alertas del sistema
            </h2>
            <p
              style={{
                margin: "0 0 25px 0",
                fontSize: "14px",
                color: "#6c757d",
              }}
            >
              Notificaciones importantes que requieren atención
            </p>
            <div>
              <Alert
                type="warning"
                message="Se detectó una alta carga del servidor"
                details="Considere escalar recursos"
              />
              <Alert
                type="danger"
                message="Múltiples intentos fallidos"
                details="Desde la dirección IP 192.168.1.1"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
