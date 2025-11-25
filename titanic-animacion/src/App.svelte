<script lang="ts">
  type Phase = "idle" | "sailing" | "sinking" | "sunk";
  let phase: Phase = "idle";

  // ventanas de ejemplo, para que se vean “lucecitas”
  const dummyWindows = Array.from({ length: 20 }, (_, i) => i);

  function startVoyage() {
    if (phase === "idle" || phase === "sunk") {
      phase = "sailing";
    }
  }

  function resetVoyage() {
    phase = "idle";
  }

  function handleAnimationEnd() {
    if (phase === "sailing") {
      phase = "sinking";
    } else if (phase === "sinking") {
      phase = "sunk";
    }
  }
</script>

<main class="page">
  <h1>Titanic – Demo de animación</h1>

  <section class="controls">
    <div class="buttons">
      <button
        on:click={startVoyage}
        disabled={phase === "sailing" || phase === "sinking"}
      >
        Iniciar viaje
      </button>
      <button on:click={resetVoyage}> Reiniciar </button>
    </div>
  </section>

  <section class="scene">
    <div class="iceberg"></div>

    <div class={`ship ship-${phase}`} on:animationend={handleAnimationEnd}>
      <div class="ship-body">
        <div class="ship-half back">
          <div class="ship-deck deck-back"></div>
          <div class="windows">
            {#each dummyWindows.slice(0, 10) as w}
              <div class="window survived"></div>
            {/each}
          </div>
        </div>

        <div class="ship-half front">
          <div class="ship-deck deck-front"></div>
          <div class="windows">
            {#each dummyWindows.slice(10) as w}
              <div class="window dead"></div>
            {/each}
          </div>
        </div>
      </div>
      <div class="ship-name">TITANIC</div>
    </div>
  </section>
</main>

<style>
  :global(body) {
    margin: 0;
    font-family:
      system-ui,
      -apple-system,
      BlinkMacSystemFont,
      "Segoe UI",
      sans-serif;
    background: radial-gradient(
      circle at top,
      #001328 0,
      #000814 40%,
      #02020a 100%
    );
    color: #f4f4f4;
  }

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

  .controls {
    display: flex;
    justify-content: center;
  }

  .buttons {
    display: flex;
    gap: 0.75rem;
  }

  button {
    padding: 0.4rem 0.8rem;
    border-radius: 999px;
    border: none;
    cursor: pointer;
    background: #0d6efd;
    color: white;
    font-weight: 600;
  }

  button[disabled] {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .scene {
    position: relative;
    width: 100%;
    max-width: 900px;
    height: 260px;
    margin: 0 auto;
    border-radius: 16px;
    background: linear-gradient(to top, #00111f 0, #002b4f 55%, #02101f 100%);
    overflow: hidden;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
  }

  .iceberg {
    position: absolute;
    right: 5%;
    bottom: 0;
    width: clamp(80px, 18vw, 120px);
    height: clamp(130px, 30vw, 180px);
    background: linear-gradient(to top, #6dd5fa, #ffffff);
    clip-path: polygon(50% 0%, 100% 40%, 85% 100%, 15% 100%, 0 40%);
    box-shadow: -10px 0 30px rgba(0, 0, 0, 0.5);
  }

  .ship {
    position: absolute;
    bottom: 35px;
    /*   left: 30%; */
    width: 260px;
    height: 90px;
    display: flex;
    flex-direction: column;
    align-items: center;
    transform-origin: center;
  }

  /* Fase inicial: centro de la escena */
  .ship-idle {
    left: 30%;
  }

  /* Desde que empieza a navegar hasta que se hunde: pegado al iceberg */
  .ship-sailing,
  .ship-sinking,
  .ship-sunk {
    left: 38%; /* ajusta para que quede justo antes del iceberg */
  }

  .ship-sailing {
    animation: sail 5s linear forwards;
  }

  .ship-sunk {
    opacity: 0;
    pointer-events: none;
  }

  .ship-body {
    position: relative;
    width: 100%;
    height: 70px;
    display: flex;
    overflow: visible;
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

  .windows {
    position: absolute;
    bottom: 10px;
    left: 10%;
    right: 10%;
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
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
    background: #ffd447;
  }

  .window.dead {
    background: #8b5a2b;
  }

  .ship-name {
    margin-top: 2px;
    font-size: 0.7rem;
    letter-spacing: 0.2em;
    color: #f8f0c8;
  }

  @keyframes sail {
    from {
      left: 30%;
      bottom: 35px;
    }
    to {
      left: 38%;
      bottom: 35px;
    }
  }

  .ship-sinking .ship-half.back {
    animation: sinkBack 4s ease-in forwards;
  }

  .ship-sinking .ship-half.front {
    animation: sinkFront 4s ease-in forwards;
  }

  .ship-sinking {
    /* el contenedor se queda quieto en el punto de choque */
  }

  @keyframes sinkBack {
    from {
      transform: translate(0, 0) rotate(0deg);
      opacity: 1;
    }
    to {
      transform: translate(-40px, 160px) rotate(-25deg);
      opacity: 0;
    }
  }

  @keyframes sinkFront {
    from {
      transform: translate(0, 0) rotate(0deg);
      opacity: 1;
    }
    to {
      transform: translate(40px, 180px) rotate(25deg);
      opacity: 0;
    }
  }
</style>
