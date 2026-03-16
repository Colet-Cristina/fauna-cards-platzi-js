# 🌿 Naturaleza en Código: Fauna Ibérica

## Descripción del Proyecto

Este proyecto es una aplicación web interactiva desarrollada como parte del curso `Fundamentos de JavaScript de Platzi`, La aplicación permite explorar parte del catálogo de fauna ibérica protegida, filtrar especies por nombre, familia o estado de conservación, y disfrutar de un juego de memoria (Memory Game) integrado.

# ![Imagen captura pantalla](./src/images/captura.jpg)

## 🚀 Funcionalidades

- **Carga Asíncrona (Fetch):** Los datos no están "hardcodeados"; se consumen desde un archivo externo `./data/data.json`.
- **Sistema de Filtrado Combinado:** Permite buscar por nombre, seleccionar por familia/estado y filtrar por categorías (Checkboxes) de forma simultánea.
- **Contador Dinámico:** Informa al usuario en tiempo real sobre cuántos resultados se muestran del total de la base de datos.
- **Interfaz Reactiva:** Gracias a la pseudo-clase `:has()`, los contenedores de los filtros reaccionan visualmente cuando el input está marcado.
- **Formateo de Datos:** Uso de métodos como `.toUpperCase()` y `.slice()` para normalizar la presentación de los nombres.

## 🎮 Fauna Memory Game

Además del catálogo, he implementado un **juego de memoria interactivo** para poner a prueba tus conocimientos sobre las especies.

- **Progresión de Dificultad:** 4 niveles de dificultad (de 4 a 10 parejas), que escalan dinámicamente según el nivel.
- **Lógica de Estado:** Gestión de partidas mediante contadores de aciertos (`matchedPairs`) y cronómetros controlados (`setInterval`).
- **Persistencia de Datos:** Sistema de récords utilizando `localStorage` para guardar el mejor tiempo por nivel.
- **Interfaz Gamificada:** Tablero generado dinámicamente con CSS Grid, utilizando `auto-fit` para adaptarse a cualquier resolución.

## 🛠️ Tecnologías Utilizadas

### Estructura y Estilo

- **HTML5:** Estructura semántica y formularios accesibles.
- **CSS3 / Sass (SCSS):** - Layout mediante **Flexbox** y **CSS Grid**.
  - Uso de unidades relativas `rem` para accesibilidad.
  - Selectores modernos como `:has()`.
  - **Arquitectura Modular:** Estructura de estilos escalable (`core/`, `components/`, `variables.scss`).

### Lógica (JavaScript ES6+)

Este proyecto se ha desarrollado bajo los estándares de calidad aprendidos en el bootcamp de **Adalab**:

- **Arquitectura:** Implementación de una estructura modular profesional, utilizando el **Adalab Starter Kit** como base para el entorno de compilación (Sass/JS).
- **Refactorización:** El proyecto cuenta con una estructura de estilos modular, priorizando la mantenibilidad y escalabilidad del código.
- **Buenas Prácticas:** Código limpio, uso de control de versiones con Git y metodologías de desarrollo frontend profesional.

## Estructura del proyecto

```text
src/
 ├── scss/
 │    ├── main.scss
 │    ├── core/
 │    └── components/
 └── js/
      └── main.js    # Lógica principal y módulos
```

---

## Instalación y Ejecución

Clona este repositorio.

Instala las dependencias:`npm install`

Inicia el proyecto:`npm run dev`
