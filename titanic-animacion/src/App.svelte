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
<!--npm install -D sass-embedded-->
<style lang="scss">
  @import "scss/styles.scss";
</style>

