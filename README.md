# FutScan AR

FutScan AR es una aplicación web de realidad aumentada enfocada en selecciones de fútbol, diseñada para ofrecer una experiencia interactiva e inmersiva mediante el reconocimiento de imágenes y modelos 3D.

La aplicación permite visualizar un águila en realidad aumentada con texturas dinámicas según la selección detectada, además de ofrecer contenido complementario como información general, trivias, imágenes, videos y estadísticas de cada equipo.

---

## Características principales

* Realidad aumentada basada en imágenes con MindAR
* Modelo 3D interactivo usando Three.js
* Cambio dinámico de texturas por selección
* Animaciones del modelo 3D
* Sistema de partículas visuales
* Menú interactivo dentro de la experiencia AR
* Trivia por selección
* Visualización de imágenes y videos
* Estadísticas deportivas
* Diseño responsive
* Despliegue en producción con Vercel

---

## Tecnologías utilizadas

* Vite
* JavaScript (ES Modules)
* Three.js
* MindAR
* GLTFLoader
* Tailwind CSS
* HTML5
* CSS3
* Vercel
* GitHub

---

## Estructura del proyecto

```text
FutScan-AR/
│
├── public/
│   ├── models/
│   ├── textures/
│   ├── images/
│   ├── targetstest.mind
│
├── src/
│   ├── main.js
│   ├── team-selection.js
│   ├── teamsData.js
│   ├── style.css
│
├── index.html
├── seleccion.html
├── package.json
├── vite.config.js
└── README.md
```

---

## Instalación local

### 1. Clonar el repositorio

```bash
https://github.com/JuanMTZG584/futscan-ar.git
```

---

### 2. Entrar al proyecto

```bash
cd futscan-ar
```

---

### 3. Instalar dependencias

```bash
npm install
```

---

### 4. Ejecutar el servidor de desarrollo

```bash
npm run dev
```

---

## Requisitos

* Node.js v20 o superior
* Navegador compatible con WebXR / cámara
* Permisos de cámara habilitados

---

## Uso de la aplicación

1. Ingresar a la página principal
2. Presionar el botón **Iniciar AR**
3. Permitir acceso a la cámara
4. Apuntar hacia una imagen objetivo registrada
5. Visualizar el modelo 3D en realidad aumentada
6. Interactuar con las funciones:

   * Información
   * Trivia
   * Videos
   * Imágenes
   * Estadísticas
   * Movimiento
   * Efectos visuales

---

## Despliegue

La aplicación se encuentra desplegada mediante Vercel con integración continua desde GitHub.

Cada cambio enviado al repositorio genera automáticamente una nueva versión en producción.

---

## Autor

Proyecto desarrollado como parte de un sistema interactivo de realidad aumentada aplicado al entorno deportivo.

---

## Licencia

Este proyecto es de uso académico y educativo.
