<script lang="ts">
  import { onMount } from "svelte";
  import { csvParse } from "d3-dsv";

  type Sex = "male" | "female";
  type PClass = 1 | 2 | 3;

  interface Passenger {
    id: number;
    sex: Sex;
    pclass: PClass;
    survived: boolean;
  }

  let passengers: Passenger[] = [];
  let loading = true;
  let error: string | null = null;

// ojo: aquí todo strings salvo "all"
  let filterSex: "all" | Sex = "all";
  let filterClass: "all" | "" | "1" | "2" | "3" = "all";

  type Phase = "idle" | "sailing" | "sinking" | "sunk";
  let phase: Phase = "idle";


  onMount(async () => {
    try {
      const res = await fetch("/titanic.csv");
      if (!res.ok) throw new Error("No se pudo cargar titanic.csv");

      const text = await res.text();
      const data = csvParse(text); // d3-dsv
      console.log(data)
      passengers = data
        .filter((row) => row.Survived !== undefined && row.Sex && row.Pclass)
        .map((row, index) => ({
          id: index + 1,
          sex: (row.Sex === "female" ? "female" : "male") as Sex,
          pclass: Number(row.Pclass) as PClass,
          survived:
            row.Survived === "1" ||
            row.Survived === "true" ||
            row.Survived === 1
        }));
    } catch (e: any) {
      console.error(e);
      error = e.message ?? "Error cargando Titanic";
    } finally {
      loading = false;
    }
  });

$: filteredPassengers = passengers.filter((p) => {
    const sexOk = filterSex === "all" || p.sex === filterSex;
    const classOk =
      filterClass === "all" ||
      filterClass === "" ||
      String(p.pclass) === filterClass;

    return sexOk && classOk;
  });


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
  <h1>Titanic – Visualización de pasajeros</h1>

  {#if loading}
    <p>Cargando datos del Titanic...</p>
  {:else if error}
    <p style="color: salmon;">{error}</p>
  {:else}
    <section class="controls">
      <div>
        <label>Sexo:</label>
        <select bind:value={filterSex}>
          <option value="all">Todos</option>
          <option value="female">Mujeres</option>
          <option value="male">Hombres</option>
        </select>
      </div>

      <div>
        <label>Clase:</label>
        <select bind:value={filterClass}>
          <option value="all">Todas</option>
          <option value="1">1ª clase</option>
          <option value="2">2ª clase</option>
          <option value="3">3ª clase</option>
        </select>
      </div>

      <div class="buttons">
        <button
          on:click={startVoyage}
          disabled={phase === "sailing" || phase === "sinking"}
        >
          Iniciar viaje
        </button>
        <button on:click={resetVoyage}>
          Reiniciar
        </button>
      </div>
    </section>

    <section class="scene">
      <!-- Glaciar -->
      <div class="iceberg" aria-label="Glaciar"></div>

      <!-- Barco -->
      <div
        class={`ship ship-${phase}`}
        on:animationend={handleAnimationEnd}
        aria-label="Titanic"
      >
        <div class="ship-body">
          <div class="ship-deck"></div>
          <div class="windows">
            {#each filteredPassengers as p (p.id)}
              <div
                class={`window ${p.survived ? "survived" : "dead"}`}
                title={`#${p.id} | ${p.sex} | clase ${p.pclass} | ${p.survived ? "sobrevive" : "muere"}`}
              ></div>
            {/each}
          </div>
        </div>
        <div class="ship-name">TITANIC</div>
      </div>
    </section>

    <section class="legend">
      <h2>Leyenda</h2>
      <p>
        Cada círculo es una ventana/pasajero filtrado.
        <span class="dot survived"></span> Amarillo: sobrevive.
        <span class="dot dead"></span> Marrón: no sobrevive.
      </p>
    </section>
  {/if}
</main>

<style>
  :global(body) {
    margin: 0;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    background: radial-gradient(circle at top, #001328 0, #000814 40%, #02020a 100%);
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
    flex-wrap: wrap;
    gap: 1rem;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.35);
    border-radius: 12px;
    padding: 0.75rem 1rem;
  }

  .controls label {
    font-size: 0.9rem;
    margin-right: 0.4rem;
  }

  .controls select {
    padding: 0.25rem 0.5rem;
    border-radius: 6px;
    border: 1px solid #555;
    background: #111;
    color: #f4f4f4;
  }

  .buttons {
    display: flex;
    gap: 0.5rem;
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

  /* Glaciar a la derecha */
  .iceberg {
    position: absolute;
    right: 5%;
    bottom: 0;
    width: 120px;
    height: 180px;
    background: linear-gradient(to top, #6dd5fa, #ffffff);
    clip-path: polygon(50% 0%, 100% 40%, 85% 100%, 15% 100%, 0 40%);
    box-shadow: -10px 0 30px rgba(0, 0, 0, 0.5);
  }

  /* Barco en estado inicial: quieto hacia el centro */
  .ship {
    position: absolute;
    bottom: 35px;
    left: 30%;         /* 🔹 barco visible, aproximadamente en medio */
    width: 240px;
    height: 90px;
    display: flex;
    flex-direction: column;
    align-items: center;
    transform-origin: center;
  }

  /* Fase navegando: se desplaza hacia el glaciar */
  .ship-sailing {
    animation: sail 6s linear forwards;
  }

  /* Fase hundiéndose tras el choque */
  .ship-sinking {
    animation: sink 4s ease-in forwards;
  }

  .ship-sunk {
    opacity: 0;
    pointer-events: none;
  }

  .ship-body {
    position: relative;
    width: 100%;
    height: 70px;
    background: linear-gradient(to top, #2c2c2c, #111);
    border-radius: 0 0 80px 80px;
    border-top: 4px solid #b88a44;
    overflow: hidden;
  }

  .ship-deck {
    position: absolute;
    top: -16px;
    left: 20%;
    width: 60%;
    height: 16px;
    background: #222;
    border-radius: 8px 8px 0 0;
    border: 2px solid #444;
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
    width: 4px;
    height: 4px;
    border-radius: 50%;
    border: 1px solid #000;
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.6);
  }

  .window.survived {
    background: #ffd447; /* amarillo */
  }

  .window.dead {
    background: #8b5a2b; /* marrón */
  }

  .ship-name {
    margin-top: 2px;
    font-size: 0.7rem;
    letter-spacing: 0.2em;
    color: #f8f0c8;
  }

  .legend {
    max-width: 900px;
    margin: 0 auto;
    font-size: 0.9rem;
    background: rgba(0, 0, 0, 0.45);
    padding: 0.75rem 1rem;
    border-radius: 12px;
  }

  .dot {
    display: inline-block;
    width: 12px;
    height: 12px;
    margin: 0 4px;
    border-radius: 50%;
    vertical-align: middle;
    border: 1px solid #000;
  }

  .dot.survived {
    background: #ffd447;
  }

  .dot.dead {
    background: #8b5a2b;
  }

  /* Animaciones: movemos el barco con 'left' y 'bottom' */

  @keyframes sail {
    from {
      left: 30%;
      bottom: 35px;
    }
    to {
      left: 65%;
      bottom: 35px;
    }
  }

  @keyframes sink {
    from {
      left: 65%;
      bottom: 35px;
      transform: rotate(0deg);
      opacity: 1;
    }
    to {
      left: 70%;
      bottom: -140px; /* se hunde hacia abajo */
      transform: rotate(25deg);
      opacity: 0;
    }
  }

  @media (max-width: 700px) {
    .scene {
      height: 230px;
    }
    .ship {
      width: 200px;
      left: 20%;
    }
    @keyframes sail {
      from {
        left: 20%;
        bottom: 30px;
      }
      to {
        left: 60%;
        bottom: 30px;
      }
    }
    @keyframes sink {
      from {
        left: 60%;
        bottom: 30px;
        transform: rotate(0deg);
      }
      to {
        left: 65%;
        bottom: -140px;
        transform: rotate(25deg);
        opacity: 0;
      }
    }
  }
</style>
