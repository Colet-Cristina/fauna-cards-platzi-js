"use strict";
// ======= SECCIÓN: RENDERIZADO DE INTERFAZ =======

//  Función para pintar las tarjetas. Recibe el array
export const renderAnimals = (data, totalCount, container) => {
  const counterElement = document.querySelector(".js_counter");
  let htmlContent = "";
  // Contador
  if (counterElement) {
    counterElement.innerHTML = `Mostrando <strong>${data.length}</strong> de <strong>${totalCount}</strong> animales`;
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

        <img src="${image}" alt="${commonName}" class="card-img js_cardImg">

        <p class="card-category js_cardCategory"> ${family} </p>

        <p class="card-habitat js_cardHabitat"> 
          <strong>Población principal:</strong> ${habitat}.
        </p>

        <p class="description js_descripyion">${description}.</p>
        <p class="status" style="${statusStyle}">${status}</p>
      </section>
    `;
  });

  container.innerHTML =
    htmlContent ||
    `<img class="no-results-img" src="./images/not-found.png" alt="No hay resultados">`;
};
