// src/App.jsx
import { useState, useRef, useEffect } from "react";
import "./index.css"; // o "./App.css"

import { useState, useRef, useEffect } from "react";
import "./index.css";

function TitanicAnimation() {
  const [estado, setEstado] = useState("parado");
  const [posX, setPosX] = useState(0);
  const [posColision, setPosColision] = useState(null);

  const shipRef = useRef(null);
  const icebergRef = useRef(null);

  // useEffect 1: movimiento
  useEffect(() => {
    if (estado !== "navegando") return;

    const velocidad = 4;
    const intervalo = setInterval(() => {
      setPosX((x) => x + velocidad);
    }, 30);

    return () => clearInterval(intervalo);
  }, [estado]);

  // useEffect 2: colisión
  useEffect(() => {
    if (estado !== "navegando") return;

    const shipEl = shipRef.current;
    const icebergEl = icebergRef.current;
    if (!shipEl || !icebergEl) return;

    const shipRect = shipEl.getBoundingClientRect();
    const icebergRect = icebergEl.getBoundingClientRect();

    if (shipRect.right >= icebergRect.left) {
      const solape = shipRect.right - icebergRect.left;
      const xAjustado = posX - solape;

      setPosColision(xAjustado);
      setEstado("chocando");
    }
  }, [posX, estado]);

  const handleZarpar = () => {
    setPosX(0);
    setPosColision(null);
    setEstado("navegando");
  };

  const handleReiniciar = () => {
    setPosX(0);
    setPosColision(null);
    setEstado("parado");
  };

  const xActual = estado === "navegando" ? posX : (posColision ?? posX);

  return (
    <div className="scene">
      <div className="sky">
        <h1 className="title">Animación Titanic React</h1>
        <p className="subtitle">
          El barco zarpa, choca, se parte en dos y se hunde por mitades.
        </p>
      </div>

      <div className="ocean">
        {/* Iceberg */}
        <div className="iceberg" ref={icebergRef}></div>

        {/* Si está partido, mostramos las dos mitades */}
        {estado === "partido" ? (
          <div
            className="ship-split"
            style={{ transform: `translateX(${xActual}px)` }}
          >
            <div className="ship-half ship-half--left" />
            <div className="ship-half ship-half--right" />
          </div>
        ) : (
          // Barco entero mientras no esté partido
          <div
            ref={shipRef}
            className="ship"
            style={{ transform: `translateX(${xActual}px)` }}
          >
            <div
              className={
                estado === "chocando"
                  ? "ship-inner ship-inner--crash"
                  : "ship-inner"
              }
              onAnimationEnd={() => {
                if (estado === "chocando") {
                  setEstado("partido");
                }
              }}
            >
              <div className="ship-body">
                <div className="chimney chimney-1" />
                <div className="chimney chimney-2" />
                <div className="chimney chimney-3" />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="controls">
        <button onClick={handleZarpar}>Zarpar</button>
        <button onClick={handleReiniciar}>Reiniciar</button>
        <span className="status">Estado: {estado}</span>
      </div>

      <p className="hint">
        Esto ya se puede enchufar a datos del Titanic: velocidad, ángulo,
        tamaño, etc. según variables del dataset.
      </p>
    </div>
  );
}

export default TitanicAnimation;
