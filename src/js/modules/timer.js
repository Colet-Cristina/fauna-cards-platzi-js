"use strict";
// ======= SECCIÓN: GESTIÓN DEL TIEMPO =======

// Cronometro
export let timer; // Guarda el tiempo
export let seconds = 0; // Cuenta los segundos

// Cronómetro
export const startTimer = () => {
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
export const stopTimer = () => {
  clearInterval(timer);
};
// Tiempo transcurrido
export const getSeconds = () => {
  return seconds;
};
