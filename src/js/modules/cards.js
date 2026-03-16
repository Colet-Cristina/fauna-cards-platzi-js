"use strict";

// ======= SECCIÓN: LÓGICA DE LAS CARTAS =======

// Lógica de volteo
export const flipCard = (card, selectedCards, checkMatchCallback) => {
  if (
    selectedCards.length < 2 &&
    !card.querySelector(".card-inner").classList.contains("is-flipped")
  ) {
    card.querySelector(".card-inner").classList.add("is-flipped");
    selectedCards.push(card);

    if (selectedCards.length === 2) {
      checkMatchCallback(); // Función que comprueba las coincidencias
    }
  }
};
