// src/App.jsx
import { useState, useRef, useEffect } from "react";
import "./index.css"; // o "./App.css"

function TitanicAnimation() {
  // Estados
  const [estado, setEstado] = useState("parado"); // "parado" | "navegando" | "chocando" | "partido"
  const [posX, setPosX] = useState(0);           // posición mientras navega
  const [posColision, setPosColision] = useState(null); // posición donde choca

  // Refs DOM
  const shipRef = useRef(null);
  const icebergRef = useRef(null);

  // 1) Mover el barco mientras está navegando
  useEffect(() => {
    if (estado !== "navegando") return;

    const velocidad = 45; // px por tick
    const intervalo = setInterval(() => {
      setPosX((x) => x + velocidad);
    }, 30);

    return () => clearInterval(intervalo);
  }, [estado]);

  // 1) Mover el barco mientras está navegando
    useEffect(() => {
      if (estado !== "navegando") return;

      const velocidad = 4; // px por tick
      const intervalo = setInterval(() => {
        setPosX((x) => x + velocidad);
      }, 30);

      return () => clearInterval(intervalo);
    }, [estado]); 

  // 2) Detectar colisión (sin tocar posX, para no romper el movimiento)
  useEffect(() => {
    if (estado !== "navegando") return;

    const shipEl = shipRef.current;
    const icebergEl = icebergRef.current;
    if (!shipEl || !icebergEl) return;

    const shipRect = shipEl.getBoundingClientRect();
    const icebergRect = icebergEl.getBoundingClientRect();

    if (shipRect.right >= icebergRect.left) {
      // cuánto se ha metido "de más"
      const solape = shipRect.right - icebergRect.left;
      const xAjustado = posX - solape; // posición corregida para que se toquen justo

      // NO tocamos posX, solo guardamos la posición buena para después
      setPosColision(xAjustado);
      setEstado("chocando"); // esto ya detiene el intervalo de movimiento
    }
  }, [posX, estado]);

  // Botones
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

  // Posición horizontal actual a usar:
  // - navegando → posX
  // - chocando / partido → posColision si existe, si no posX
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
