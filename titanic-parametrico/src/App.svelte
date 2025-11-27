<script>
  // Fases: idle -> sailing -> sinking -> sunk
  let phase = "idle";

  // Ventanitas de ejemplo
  const dummyWindows = Array.from({ length: 24 }, (_, i) => i);

  // Controles del panel (valores iniciales)
  let shipStartX = 30;      // %
  let shipCollisionX = 58;  // %
  let icebergRight = 5;     // %
  let sinkBack = 160;       // px
  let sinkFront = 180;      // px

  function startVoyage() {
    if (phase === "idle" || phase === "sunk") {
      phase = "sailing";
    }
  }

  function resetVoyage() {
    phase = "idle";
  }

  function handleAnimationEnd(event) {
    // Solo reaccionamos a la animación del barco, no a cada mitad
    if (!event.currentTarget.classList.contains("ship")) return;

    if (phase === "sailing") {
      phase = "sinking";
    } else if (phase === "sinking") {
      phase = "sunk";
    }
  }
</script>

<main class="page">
  <h1>Titanic - Animación paramétrica</h1>

  <!-- PANEL DE CONTROLES -->
  <section class="controls">
    <div class="buttons">
      <button
        on:click={startVoyage}
        disabled={phase === "sailing" || phase === "sinking"}
      >
        Iniciar viaje
      </button>
      <button on:click={resetVoyage}>Reiniciar</button>
    </div>

    <div class="sliders">
      <div class="control">
        <label>
          Inicio barco (X): {shipStartX}%
          <input type="range" min="0" max="40" step="1" bind:value={shipStartX} />
        </label>
      </div>

      <div class="control">
        <label>
          Choque barco (X): {shipCollisionX}%
          <input type="range" min="30" max="80" step="1" bind:value={shipCollisionX} />
        </label>
      </div>

      <div class="control">
        <label>
          Posición iceberg (derecha): {icebergRight}%
          <input type="range" min="0" max="30" step="1" bind:value={icebergRight} />
        </label>
      </div>

      <div class="control">
        <label>
          Profundidad mitad trasera: {sinkBack}px
          <input type="range" min="80" max="260" step="10" bind:value={sinkBack} />
        </label>
      </div>

      <div class="control">
        <label>
          Profundidad mitad delantera: {sinkFront}px
          <input type="range" min="80" max="300" step="10" bind:value={sinkFront} />
        </label>
      </div>
    </div>

    <p class="hint">
      Fase actual: <strong>{phase}</strong>
    </p>
  </section>

  <!-- ESCENA: aquí inyectamos las CSS vars -->
  <section
    class="scene"
    style={`
      --ship-start-x: ${shipStartX}%;
      --ship-collision-x: ${shipCollisionX}%;
      --iceberg-right: ${icebergRight}%;
      --sink-depth-back: ${sinkBack}px;
      --sink-depth-front: ${sinkFront}px;
    `}
  >
    <div class="iceberg"></div>

    <div
      class={"ship ship-" + phase}
      on:animationend={handleAnimationEnd}
    >
      <div class="ship-body">
        <div class="ship-half back">
          <div class="ship-deck deck-back"></div>
          <div class="windows">
            {#each dummyWindows.slice(0, 12) as w}
              <div class="window survived"></div>
            {/each}
          </div>
        </div>

        <div class="ship-half front">
          <div class="ship-deck deck-front"></div>
          <div class="windows">
            {#each dummyWindows.slice(12) as w}
              <div class="window dead"></div>
            {/each}
          </div>
        </div>
      </div>
      <div class="ship-name">TITANIC</div>
    </div>
  </section>
</main>

<style lang="scss">
  @use "scss/vars.scss" as *;
  
.page {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

h1 {
  text-align: center;
  margin: 0;
}

/* Panel de controles */
.controls {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  align-items: stretch;
  max-width: 900px;
  margin: 0 auto;
  background: rgba(0, 0, 0, 0.35);
  border-radius: 12px;
  padding: 0.75rem 1rem;

  .buttons {
    display: flex;
    gap: 0.75rem;
    justify-content: center;
    flex-wrap: wrap;
  }

  button {
    padding: 0.5rem 1rem;
    border-radius: 999px;
    border: none;
    cursor: pointer;
    background: #0d6efd;
    color: white;
    font-weight: 600;

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  .sliders {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
    gap: 0.75rem;
  }

  .control {
    font-size: 0.85rem;

    label {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
    }

    input[type="range"] {
      width: 100%;
    }
  }

  .hint {
    margin: 0;
    font-size: 0.85rem;
    text-align: center;
    opacity: 0.8;
  }
}

/* ESCENA Y GLACIAR */
.scene {
  position: relative;
  width: 100%;
  max-width: 900px;
  height: 260px;
  margin: 0 auto;
  border-radius: 16px;
  background: linear-gradient(to top, $sea-bottom 0, $sea-top 55%, $sea-mid 100%);
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
}

.iceberg {
  position: absolute;
  right: var(--iceberg-right, $iceberg-right);
  bottom: 0;
  width: $iceberg-width;
  height: $iceberg-height;
  background: linear-gradient(to top, #6dd5fa, #ffffff);
  clip-path: polygon(50% 0%, 100% 40%, 85% 100%, 15% 100%, 0 40%);
  box-shadow: -10px 0 30px rgba(0, 0, 0, 0.5);
}

/* BARCO BASE */
.ship {
  position: absolute;
  bottom: 35px;
  left: var(--ship-start-x, $ship-start-x);
  width: $ship-width;
  height: $ship-height;
  display: flex;
  flex-direction: column;
  align-items: center;
  transform-origin: center;
}

/* FASES */
.ship-idle {
  left: var(--ship-start-x, $ship-start-x);
}

.ship-sailing {
  left: var(--ship-collision-x, $ship-collision-x);
  animation: sail $time-sail linear forwards;
}

.ship-sinking {
  left: var(--ship-collision-x, $ship-collision-x);
}

.ship-sunk {
  left: var(--ship-collision-x, $ship-collision-x);
  opacity: 0;
  pointer-events: none;
}

/* CUERPO PARTIDO */
.ship-body {
  position: relative;
  width: 100%;
  height: 70px;
  display: flex;
}

.ship-half {
  flex: 1;
  position: relative;
  height: 100%;
  background: linear-gradient(to top, #2c2c2c, #111);
  border-top: 4px solid #b88a44;
  overflow: hidden;
}

.ship-half.back {
  border-radius: 0 0 0 80px;
}

.ship-half.front {
  border-radius: 0 0 80px 0;
}

/* CUBIERTAS */
.ship-deck {
  position: absolute;
  top: -16px;
  width: 60%;
  height: 16px;
  background: #222;
  border-radius: 8px 8px 0 0;
  border: 2px solid #444;
}

.deck-back {
  left: 20%;
}

.deck-front {
  left: 10%;
}

/* VENTANAS */
.windows {
  position: absolute;
  bottom: 10px;
  left: 10%;
  right: 10%;
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  justify-content: center;
}

.window {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 1px solid #000;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.6);
}

.window.survived {
  background: $color-survive;
}

.window.dead {
  background: $color-dead;
}

.ship-name {
  margin-top: 2px;
  font-size: 0.7rem;
  letter-spacing: 0.2em;
  color: #f8f0c8;
}

/* ANIMACIÓN NAVEGACIÓN */
@keyframes sail {
  from {
    transform: translateX(
      calc(
        -1 *
          (
            var(--ship-collision-x, #{$ship-collision-x}) -
              var(--ship-start-x, #{$ship-start-x})
          )
      )
    );
  }
  to {
    transform: translateX(0);
  }
}

/* HUNDIMIENTO: se animan sólo las mitades en fase sinking */
.ship-sinking .ship-half.back {
  animation: sinkBack $time-sink ease-in forwards;
}

.ship-sinking .ship-half.front {
  animation: sinkFront $time-sink ease-in forwards;
}

@keyframes sinkBack {
  from {
    transform: translate(0, 0) rotate(0deg);
    opacity: 1;
  }
  to {
    transform: translate(-40px, var(--sink-depth-back, #{$sink-depth-back}))
      rotate(-25deg);
    opacity: 0;
  }
}

@keyframes sinkFront {
  from {
    transform: translate(0, 0) rotate(0deg);
    opacity: 1;
  }
  to {
    transform: translate(40px, var(--sink-depth-front, #{$sink-depth-front}))
      rotate(25deg);
    opacity: 0;
  }
}

/* RESPONSIVE SUAVE */
@media (max-width: 700px) {
  .scene {
    height: 230px;
  }

  .ship {
    bottom: 30px;
    width: 200px;
  }
}
</style>
