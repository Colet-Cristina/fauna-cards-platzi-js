"use strict";

// SECCIÓN DE QUERY-SELECTOR ========================================

const app = document.querySelector("#app");

// Filtros de texto y select
const inputName = document.querySelector(`.js_searchName`);
const selectFamily = document.querySelector(`.js_searchFamily`);
const selectStatus = document.querySelector(`.js_searchStatus`);

// Filtros de checkbox
const checkMammal = document.querySelector(`.js_checkMammal`);
const checkBird = document.querySelector(`.js_checkBird`);
const checkAmphibian = document.querySelector(`.js_checkAmphibian`);

// Botón de reset
const resetBtn = document.querySelector(`.js_resetBtn`);

//Contador
const counter = document.querySelector(`.js_counter`);

// SECCIÓN DE DATOS  ===============================================

// Array vacío
let animals = [];

// Traemos los datos con fetch
const getData = () => {
  fetch("./data/data.json")
    .then((response) => {
      if (!response.ok) throw new Error("Error al recibir los datos");
      return response.json();
    })
    .then((data) => {
      animals = data; // Guardamos los datos en la variable
      renderAnimals(animals); // Pintamos
    })
    .catch((error) => {
      console.error("Hubo un fallo:", error);
      app.innerHTML = `<p>Error al cargar la base de datos de fauna.</p>`;
    });
};

// SECCIÓN DE FUNCIONES =============================================

//  Función para pintar las tarjetas.
//  Recibe el array

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
    // Dentro de tu forEach en renderAnimals:

    let textColor = "";

    switch (
      true // Usamos 'true' para evaluar condiciones en cada caso
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
    `<p class="no-results">No se han encontrado especies que coincidan con los filtros.</p>`;
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
// SECCIÓN DE EVENTOS ===============================================

const handleInputFilter = () => {
  const searchTerm = inputName.value;

  // Estructura Condicional
  // Validación de longitud mínima para evitar búsquedas erráticas
  if (searchTerm.length > 0 && searchTerm.length < 2) {
    counter.innerHTML = "Escribe al menos 2 letras...";
    return;
  }

  applyFilters();
};

const handleReset = (event) => {
  event.preventDefault();
  // Reseteamos el formulario
  inputName.value = "";
  selectFamily.value = "all";
  selectStatus.value = "all";
  checkMammal.checked = false;
  checkBird.checked = false;
  checkAmphibian.checked = false;
  // Repintamos todo
  renderAnimals(animals);
};

inputName.addEventListener("input", handleInputFilter);
selectFamily.addEventListener("change", handleInputFilter);
selectStatus.addEventListener("change", handleInputFilter);

[checkMammal, checkBird, checkAmphibian].forEach((checkbox) => {
  checkbox.addEventListener("change", handleInputFilter);
});

if (resetBtn) {
  resetBtn.addEventListener("click", handleReset);
}

// SECCIÓN DE ACCIONES AL CARGAR LA PÁGINA
getData();
