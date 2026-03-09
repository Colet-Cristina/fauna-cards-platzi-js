# 🌿 Naturaleza en Código: Fauna Ibérica

Este proyecto ha sido desarrollado como parte del Curso `Fundamentos de JavaScript de Platzi`, aplicando conceptos avanzados de gestión de datos asíncronos y diseño responsivo con CSS moderno. La aplicación permite explorar la biodiversidad de la península, filtrando especies por su estado de conservación, familia y tipo.

## 🚀 Funcionalidades

- **Carga Asíncrona (Fetch):** Los datos no están "hardcodeados"; se consumen desde un archivo externo `./data/data.json`.
- **Sistema de Filtrado Combinado:** Permite buscar por nombre, seleccionar por familia/estado y filtrar por categorías (Checkboxes) de forma simultánea.
- **Contador Dinámico:** Informa al usuario en tiempo real sobre cuántos resultados se muestran del total de la base de datos.
- **Interfaz Reactiva:** Gracias a la pseudo-clase `:has()`, los contenedores de los filtros reaccionan visualmente cuando el input está marcado.
- **Formateo de Datos:** Uso de métodos como `.toUpperCase()` y `.slice()` para normalizar la presentación de los nombres.

## 🛠️ Tecnologías Utilizadas

- **HTML5:** Estructura semántica y formularios accesibles.
- **CSS3:** - Layout mediante **Flexbox**.
  - Uso de unidades relativas `rem` para accesibilidad.
  - Selectores modernos como `:has()` para estados de componentes.
- **JavaScript (ES6+):**
  - **Asincronía:** Uso de `fetch` y promesas (`.then`, `.catch`).
  - **Métodos de Array:** `.filter()` para la búsqueda y `.forEach()` para el renderizado.
  - **Desestructuración:** Extracción limpia de propiedades de objetos.
  - **Template Strings:** Interpolación de variables con `` `backticks` `` para generar HTML dinámico.

> [!NOTE]

> [Certificado Platzi](https://platzi.com/evaluacion/123c21dc-ed33-43b4-9586-ed625aa13085/).
