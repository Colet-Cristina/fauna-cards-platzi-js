"use strict";

// ======= SECCIÓN: MOTOR DE FILTRADO =======

export const getFilteredAnimals = (
  animals,
  searchName,
  searchFamily,
  searchStatus,
  isMammal,
  isBird,
  isAmphibian,
) => {
  return animals.filter((animal) => {
    const matchName = animal.commonName.toLowerCase().includes(searchName);
    const matchFamily =
      searchFamily === "all" || animal.family === searchFamily;
    const matchStatus =
      searchStatus === "all" || animal.status === searchStatus;

    let matchType = true;
    if (isMammal || isBird || isAmphibian) {
      matchType =
        (isMammal && animal.type === "mamifero") ||
        (isBird && animal.type === "ave") ||
        (isAmphibian && animal.type === "anfibio");
    }

    return matchName && matchFamily && matchStatus && matchType;
  });
};
