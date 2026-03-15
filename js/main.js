"use strict";

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

//Variables que cambian y guardan la información
let animals = [];

// Cartas del juego, cuantas salen y parejas hacertadas
let selectedCards = [];
let currentLevel = 6;
let matchedPairs = 0;

// Contador
let timer; // Guarda el tiempo
let seconds = 0; // Cuenta los segundos

// Traemos los datos con fetch
const getData = () => {
  fetch("./data/data.json")
    .then((response) => {
      if (!response.ok) throw new Error("Error al recibir los datos");
      return response.json();
    })
    .then((data) => {
      animals = data; // Guardamos los datos en la variable
      renderAnimals(animals); // Pintamos catálogo
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

  html += `<div class="game-board">`;

  gameData.forEach((animal) => {
    html += `
      <section class="game-card" data-id="${animal.commonName}" tabindex="0">
        <div class="card-inner">
            <div class="card-front">?</div>
            <div class="card-back"><img class="card-game" src="./images/${animal.image}"></div>
        </div>
      </section>`;
  });

  html += `</div>`;

  app.innerHTML = html;
};
// Lógica de volteo
const flipCard = (card) => {
  if (
    selectedCards.length < 2 &&
    !card.querySelector(".card-inner").classList.contains("is-flipped")
  ) {
    card.querySelector(".card-inner").classList.add("is-flipped");
    selectedCards.push(card);
    if (selectedCards.length === 2) checkMatch();
  }
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
      saveRecord(seconds, currentLevel);
      showNextLevelButton();
    }
  } else {
    // Si no coinciden.
    setTimeout(() => {
      c1.querySelector(".card-inner").classList.remove("is-flipped");
      c2.querySelector(".card-inner").classList.remove("is-flipped");
      selectedCards = [];
    }, 500);
  }
};
//  Muestra el botón de siguiente nivel al ganar y los mensajes del cronómetro
const showNextLevelButton = () => {
  const container = document.querySelector("#next-level-container");
  if (container) {
    const recordKey = `bestTime_${currentLevel}`;
    const savedRecord = localStorage.getItem(recordKey);

    let recordHTML = "";

    // Lógica del récord
    if (seconds <= parseInt(savedRecord)) {
      recordHTML = `<p class="recordMessage js_recordMessage">¡NUEVO RÉCORD DEL NIVEL!</p>`;
    } else {
      recordHTML = `<p class="message js_message">Récord actual del nivel: ${savedRecord}s</p>`;
    }

    container.innerHTML = `
      <p class="js_message">¡Nivel completado en ${seconds} segundos!</p>
      ${recordHTML}
      <button class="btn-next js_btnNext">Pasar al siguiente nivel</button>
    `;
  }
};

// Cronómetro
const startTimer = () => {
  seconds = 0;
  const timerElement = document.querySelector(".js_timer");

  timer = setInterval(() => {
    seconds++;
    if (timerElement) {
      timerElement.innerHTML = seconds;
    }
  }, 1000);
};

// Detener cronómetro
const stopTimer = () => {
  clearInterval(timer);
};
// ========= FIN LÓGICA DE JUEGO =========

// =============================== SECCIÓN DE FUNCIONES ====================================

//  Función para pintar las tarjetas. Recibe el array
const renderAnimals = (data, totalCount = animals.length) => {
  let htmlContent = "";
  // Contador
  if (counter) {
    counter.innerHTML = `Mostrando <strong>${data.length}</strong> de <strong>${totalCount}</strong> animales`;
  }
  data.forEach((animal) => {
    // Desestructuración para un código más limpio
    const {
      commonName,
      scientificName,
      habitat,
      family,
      image,
      type,
      status,
      description,
    } = animal;

    const displayTitle = commonName.toUpperCase();
    const scientificFormat =
      scientificName.charAt(0).toUpperCase() + scientificName.slice(1);

    // Lógica de colores
    let textColor = "";
    switch (
      true // Usamos 'true' para ver condiciones en cada caso
    ) {
      case status.includes("EX"):
        textColor = "#000000";
        break;
      case status.includes("EW"):
        textColor = "#545454";
        break;
      case status.includes("CR"):
        textColor = "#D20000";
        break;
      case status.includes("EN"):
        textColor = "#FF6600";
        break;
      case status.includes("VU"):
        textColor = "#FFCC00";
        break;
      case status.includes("NT"):
        textColor = "#CCE226";
        break;
      case status.includes("LC"):
        textColor = "#60C659";
        break;
      case status.includes("DD"):
        textColor = "#D1D1C6";
        break;
      default:
        textColor = "#382920"; // Marrón base por defecto
    }

    const statusStyle = `color: ${textColor}; font-weight: bold;`;

    htmlContent += `
      <section class="card">
        <h3 class="card-title js_cardTitle">${displayTitle}</h3>

        <p class="card-scientific"><i>${scientificFormat}</i></p> 

        <img src="./images/${image}" alt="${commonName}" class="card-img js_cardImg">

        <p class="card-category js_cardCategory"> ${family} </p>

        <p class="card-habitat js_cardHabitat"> 
          <strong>Población principal:</strong> ${habitat}.
        </p>

        <p class="description js_descripyion">${description}.</p>
        <p class="status" style="${statusStyle}">${status}</p>
      </section>
    `;
  });

  app.innerHTML =
    htmlContent ||
    `<img class="no-results-img" src="./images/not-found.png" alt="No hay resultados">`;
};

//  Función para la lógica de filtrado

const applyFilters = () => {
  const searchName = inputName.value.toLowerCase();
  const searchFamily = selectFamily.value;
  const searchStatus = selectStatus.value;

  const isMammal = checkMammal.checked;
  const isBird = checkBird.checked;
  const isAmphibian = checkAmphibian.checked;

  const filteredAnimals = animals.filter((animal) => {
    // Filtro Nombre
    const matchName = animal.commonName.toLowerCase().includes(searchName);

    // Filtro Familia
    const matchFamily =
      searchFamily === "all" || animal.family === searchFamily;

    // Filtro Estado
    const matchStatus =
      searchStatus === "all" || animal.status === searchStatus;

    // Filtro Checkbox
    let matchType = true;
    if (isMammal || isBird || isAmphibian) {
      matchType =
        (isMammal && animal.type === "mamifero") ||
        (isBird && animal.type === "ave") ||
        (isAmphibian && animal.type === "anfibio");
    }

    return matchName && matchFamily && matchStatus && matchType;
  });

  renderAnimals(filteredAnimals);
};

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
  renderAnimals(animals);
};
// Función para comparar tiempos
//Clave única por nivel
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
    flipCard(card);
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
