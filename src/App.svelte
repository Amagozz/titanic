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
      console.log(data);
      passengers = data
        .filter((row) => row.Survived !== undefined && row.Sex && row.Pclass)
        .map((row, index) => ({
          id: index + 1,
          sex: (row.Sex === "female" ? "female" : "male") as Sex,
          pclass: Number(row.Pclass) as PClass,
          survived:
            row.Survived === "1" ||
            row.Survived === "true" ||
            row.Survived === 1,
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

  $: midIndex = Math.ceil(filteredPassengers.length / 2);
  $: backPassengers = filteredPassengers.slice(0, midIndex);
  $: frontPassengers = filteredPassengers.slice(midIndex);
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
        <button on:click={resetVoyage}> Reiniciar </button>
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
    <!-- MITAD TRASERA -->
    <div class="ship-half back">
      <div class="ship-deck deck-back"></div>
      <div class="windows">
        {#each backPassengers as p (p.id)}
          <div
            class={`window ${p.survived ? "survived" : "dead"}`}
            title={`#${p.id} | ${p.sex} | clase ${p.pclass} | ${p.survived ? "sobrevive" : "muere"}`}
          ></div>
        {/each}
      </div>
    </div>

    <!-- MITAD DELANTERA -->
    <div class="ship-half front">
      <div class="ship-deck deck-front"></div>
      <div class="windows">
        {#each frontPassengers as p (p.id)}
          <div
            class={`window ${p.survived ? "survived" : "dead"}`}
            title={`#${p.id} | ${p.sex} | clase ${p.pclass} | ${p.survived ? "sobrevive" : "muere"}`}
          ></div>
        {/each}
      </div>
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

<style lang="scss">
    @import "css/style.scss";
</style>
