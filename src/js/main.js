"use strict";
import { startTimer, stopTimer } from "./modules/timer.js";
import { getSeconds } from "./modules/timer.js";
import { flipCard } from "./modules/cards.js";
import { renderAnimals } from "./modules/paint.js";
import { getFilteredAnimals } from "./modules/filters.js";

// =============================== SECCIÓN DE QUERY-SELECTOR ===============================

const app = document.querySelector(".js_appContainer");

const inputName = document.querySelector(`.js_searchName`);
const selectFamily = document.querySelector(`.js_searchFamily`);
const selectStatus = document.querySelector(`.js_searchStatus`);
const checkMammal = document.querySelector(`.js_checkMammal`);
const checkBird = document.querySelector(`.js_checkBird`);
const checkAmphibian = document.querySelector(`.js_checkAmphibian`);
const resetBtn = document.querySelector(`.js_resetBtn`);
const counter = document.querySelector(`.js_counter`);
const gameBtn = document.querySelector(".js_btnGame");
const topBtn = document.querySelector(".js_topBtn");

// =============================== SECCIÓN DE DATOS  ======================================

//Variables globales
let animals = [];

// Cartas del juego, cuantas salen y parejas acertadas
let selectedCards = [];
let currentLevel = 6;
let matchedPairs = 0;

// Traemos los datos del api
const getData = () => {
  fetch("data/api.json")
    .then((response) => {
      if (!response.ok) throw new Error("Error al recibir los datos");
      return response.json();
    })
    .then((data) => {
      animals = data; // Guardamos los datos en la variable
      renderAnimals(animals, animals.length, app, counter); // Pintamos catálogo
    })
    .catch((error) => {
      console.error("Hubo un fallo:", error);
      app.innerHTML = `<p>Error al cargar la base de datos de fauna.</p>`;
    });
};

// ========= LÓGICA DE JUEGO =========

// Alterna entre catálogo y juego
const toggleView = (isGameMode) => {
  const filters = document.querySelector(".js-filters");
  const infoResults = document.querySelector(".js_info-results");
  if (filters) filters.style.display = isGameMode ? "none" : "block";
  if (infoResults) infoResults.style.display = isGameMode ? "none" : "flex";
};
// Mezcla las cartas aleatoriamente
const shuffleArray = (array) => [...array].sort(() => Math.random() - 0.5);

//  Saltar de nivel directamente
const nextLevelAction = () => {
  if (currentLevel === 6) {
    currentLevel = 8;
  } else if (currentLevel === 8) {
    currentLevel = 12;
  } else if (currentLevel === 12) {
    currentLevel = 16;
  } else {
    currentLevel = 6;
  }
  startNewGame(); // Siguiente nivel
};
// Nuevo nivel
const startNewGame = () => {
  matchedPairs = 0; // Reiniciamos contador de aciertos
  selectedCards = [];
  toggleView(true);

  const halfLevel = currentLevel / 2;
  const selectedAnimals = animals.slice(0, halfLevel);
  const gameData = shuffleArray([...selectedAnimals, ...selectedAnimals]);
  renderGame(gameData);
  startTimer(); // Llma al cronómetro
};

// HTML del tablero de juego
const renderGame = (gameData) => {
  let html = `
  <div class="game-controls">
  
    <div id="next-level-container"></div>
    <button class="btn-back js_btnBack">Volver al catálogo</button>
    <div class="game-timer js_gameTimer">
  Tiempo transcurrido: <span class="timer js_timer">0</span> segundos
</div>
  </div>`;
  // añadimos la clase 'level-1'
  const extraClass = currentLevel === 6 ? "level-1" : "";

  html += `<div class="game-board ${extraClass}">`;

  gameData.forEach((animal) => {
    html += `
      <section class="game-card" data-id="${animal.commonName}" tabindex="0">
        <div class="card-inner">
            <div class="card-front">?</div>
            <div class="card-back"><img class="card-game" src="${animal.image}"></div>
        </div>
      </section>`;
  });

  html += `</div>`;

  app.innerHTML = html;
};

// Comprueba que las cartas coincidan
const checkMatch = () => {
  const [c1, c2] = selectedCards;
  if (c1.dataset.id === c2.dataset.id) {
    selectedCards = []; // Acierto
    // Sumar pareja encontrada
    matchedPairs++;

    // Cuando llegamos al total de parejas del nivel actual
    if (matchedPairs === currentLevel / 2) {
      stopTimer(); // Parar cronómetro
      const finalTime = getSeconds();
      saveRecord(finalTime, currentLevel);
      showNextLevelButton(finalTime);
    }
  } else {
    // Si no coinciden, se voltean de nuevo
    setTimeout(() => {
      c1.querySelector(".card-inner").classList.remove("is-flipped");
      c2.querySelector(".card-inner").classList.remove("is-flipped");
      selectedCards = [];
    }, 500);
  }
};
//  Muestra el botón de siguiente nivel al ganar y los mensajes del cronómetro
const showNextLevelButton = (finalTime) => {
  const container = document.querySelector("#next-level-container");
  if (container) {
    const recordKey = `bestTime_${currentLevel}`;
    const savedRecord = localStorage.getItem(recordKey);

    let recordHTML = "";

    // Lógica del récord
    if (savedRecord === null || finalTime <= parseInt(savedRecord)) {
      recordHTML = `<p class="recordMessage">¡NUEVO RÉCORD DEL NIVEL!</p>`;
      recordHTML = `<p class="message js_message">Récord actual del nivel: ${savedRecord}s</p>`;
    }

    container.innerHTML = `
      <p class="js_message">¡Nivel completado en ${finalTime} segundos!</p>
      ${recordHTML}
      <button class="btn-next js_btnNext">Pasar al siguiente nivel</button>
    `;
  }
};

// =============================== SECCIÓN DE FUNCIONES ====================================

//  Función para la lógica de filtrado usando el módulo filters.js
const applyFilters = () => {
  const filteredAnimals = getFilteredAnimals(
    animals,
    inputName.value.toLowerCase(),
    selectFamily.value,
    selectStatus.value,
    checkMammal.checked,
    checkBird.checked,
    checkAmphibian.checked,
  );

  renderAnimals(filteredAnimals, animals.length, app);
};

// Reinicia el juego y los filtros
const handleReset = (event) => {
  if (event) event.preventDefault();

  currentLevel = 6;

  // Limpia los filtros
  inputName.value = "";
  selectFamily.value = "all";
  selectStatus.value = "all";
  checkMammal.checked = false;
  checkBird.checked = false;
  checkAmphibian.checked = false;

  // "Volver a catálogo"
  toggleView(false);
  renderAnimals(animals, animals.length, app);
};

// Función para comparar tiempos y guardarlos
const saveRecord = (time, level) => {
  const recordKey = `bestTime_${level}`;
  const savedRecord = localStorage.getItem(recordKey);

  // Si no hay récord, o si el tiempo actual mejor
  if (!savedRecord || time < parseInt(savedRecord)) {
    localStorage.setItem(recordKey, time);
    return true; // Nuevo récord
  }
  return false; // No se superó
};
// =============================== SECCIÓN DE EVENTOS ======================================

app.addEventListener("click", (event) => {
  // Tarjeta
  const card = event.target.closest(".game-card");
  if (card) {
    flipCard(card, selectedCards, checkMatch);
  }

  // Botón de volver
  const backBtn = event.target.closest(".js_btnBack");
  if (backBtn) {
    handleReset();
  }

  // 3. Botón de siguiente nivel
  const nextBtn = event.target.closest(".js_btnNext");
  if (nextBtn) {
    nextLevelAction();
  }
});

gameBtn.addEventListener("click", () => {
  startNewGame();
});

const handleInputFilter = () => {
  if (inputName.value.length > 0 && inputName.value.length < 2) {
    counter.innerHTML = "Escribe al menos 2 letras...";
    return;
  }
  applyFilters();
};

// Listeners de filtros
inputName.addEventListener("input", handleInputFilter);
selectFamily.addEventListener("change", handleInputFilter);
selectStatus.addEventListener("change", handleInputFilter);

[checkMammal, checkBird, checkAmphibian].forEach((checkbox) => {
  checkbox.addEventListener("change", handleInputFilter);
});
resetBtn.addEventListener("click", handleReset);

//  Evento botón Top
if (topBtn) {
  window.addEventListener("scroll", () => {
    topBtn.style.display = window.scrollY > 300 ? "block" : "none";
  });
  topBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// ======================== SECCIÓN DE ACCIONES AL CARGAR LA PÁGINA ========================
getData();
