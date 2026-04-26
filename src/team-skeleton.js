import { mexicoData, japonData, tunezData, sudafricaData, coreaData, colombiaData, uruguayData, espanaData, uzbekistanData, bosniaData, dinamarcaData, galesData } from './teamsData.js'

const params = new URLSearchParams(window.location.search)
const nombre = params.get("nombre")
const seccion = params.get("seccion") || "Información"

document.getElementById("nombreSeleccion").textContent = nombre || "Selección"



const secciones = {
  "Información": document.getElementById("seccionInformacion"),
  "Trivia": document.getElementById("seccionTrivia"),
  "Imágenes": document.getElementById("seccionImagenes"),
  "Videos": document.getElementById("seccionVideos"),
  "Estadísticas": document.getElementById("seccionEstadisticas")

}

function cambiarContenido(seccion) {

  Object.keys(secciones).forEach((key) => {
    if (key === seccion) secciones[key].classList.remove("hidden")
    else secciones[key].classList.add("hidden")
  })

  if (seccion === "Videos") {

    const firstVideoBtn = document.querySelector(".video-btn")
    const firstFilterBtn = document.querySelector(".filter-btn")

    if (firstVideoBtn) setVideo(1, firstVideoBtn)
    if (firstFilterBtn) setFilter(0, firstFilterBtn)

  }

  if (seccion !== "Videos") {
    video.pause()
  }

}

const navItems = document.querySelectorAll(".nav-item")
navItems.forEach((item) => {
  item.classList.add("hover:text-cyan-400", "transition")
  item.onclick = () => {
    document.querySelector(".nav-item.active")
      ?.classList.remove("active", "text-cyan-400", "border-b-2", "border-cyan-400")
    item.classList.add("active", "text-cyan-400", "border-b-2", "border-cyan-400")
    cambiarContenido(item.textContent)
  }
})

const mobileBtn = document.getElementById("mobileMenuBtn")
const mobileMenu = document.getElementById("mobileMenu")
const opcionesMobile = Object.keys(secciones)

opcionesMobile.forEach((opcion) => {
  const item = document.createElement("button")
  item.textContent = opcion
  item.className = "block w-full text-left px-4 py-2 hover:bg-gray-100 transition"

  item.onclick = () => {
    cambiarContenido(opcion)
    mobileMenu.classList.add("hidden")

    navItems.forEach((navItem) => {
      if (navItem.textContent === opcion) {
        navItem.classList.add("active", "text-cyan-400", "border-b-2", "border-cyan-400")
      } else {
        navItem.classList.remove("active", "text-cyan-400", "border-b-2", "border-cyan-400")
      }
    })
  }

  mobileMenu.appendChild(item)
})


const divider = document.createElement("div")
divider.className = "my-2 border-t"
mobileMenu.appendChild(divider)

const regresar = document.createElement("a")
regresar.href = "index.html"
regresar.textContent = "Regresar"
regresar.className = "block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100 transition"
mobileMenu.appendChild(regresar)

mobileBtn.onclick = () => mobileMenu.classList.toggle("hidden")
document.addEventListener("click", (e) => {
  if (!mobileBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
    mobileMenu.classList.add("hidden")
  }
})

const equipos = {
  "México": mexicoData,
  "Japón": japonData,
  "Túnez": tunezData,
  "Sudáfrica": sudafricaData,
  "Corea del Sur": coreaData,
  "Colombia": colombiaData,
  "Uruguay": uruguayData,
  "España": espanaData,
  "Uzbekistán": uzbekistanData,
  "Bosnia": bosniaData,
  "Dinamarca": dinamarcaData,
  "Gales": galesData
}

const seleccion = equipos[nombre]
if (seleccion) {

  const infoImg = secciones["Información"].querySelector("img")
  const infoText = secciones["Información"].querySelector("p")

  infoImg.src = seleccion.info.imagen
  infoImg.alt = `Imagen de ${nombre}`
  infoText.textContent = seleccion.info.texto

  /* ================= TRIVIA ================= */

  const triviaContainer = secciones["Trivia"].querySelector("div.flex.flex-col.gap-6")
  triviaContainer.innerHTML = ""

  let currentQuestion = 0

  function showQuestion(index) {

    triviaContainer.innerHTML = ""
    const q = seleccion.trivia[index]

    const card = document.createElement("div")
    card.className = "bg-[#134e4a] border border-[#4CAF50]/30 shadow-xl rounded-2xl p-6 w-full"

    const pregunta = document.createElement("p")
    pregunta.className = "font-semibold text-[#4CAF50] mb-4 text-lg"
    pregunta.textContent = `Pregunta ${index + 1}: ${q.pregunta}`

    card.appendChild(pregunta)

    const opcionesDiv = document.createElement("div")
    opcionesDiv.className = "flex flex-col gap-3"

    q.opciones.forEach(opt => {

      const btn = document.createElement("button")

      btn.className = `
        option-btn
        bg-[#4CAF50]/10 text-[#4CAF50]
        rounded-full py-2 px-4
        font-semibold
        hover:bg-[#4CAF50] hover:text-[#134e4a]
        active:scale-95
        transition
      `

      btn.textContent = opt

      btn.onclick = () => {

        if (opt === q.correcta) {

          btn.classList.remove("bg-[#4CAF50]/10", "text-[#4CAF50]")
          btn.classList.add("bg-[#4CAF50]", "text-[#134e4a]")

          currentQuestion++

          if (currentQuestion < seleccion.trivia.length) {
            setTimeout(() => showQuestion(currentQuestion), 600)
          } else {
            setTimeout(() => {
              triviaContainer.innerHTML = `
                <p class="text-[#134e4a] font-bold text-lg text-center">
                  ¡Has terminado la trivia!
                </p>
              `
              setTimeout(() => cambiarContenido("Información"), 2000)
            }, 600)
          }

        } else {

          btn.classList.remove("bg-[#4CAF50]/10")
          btn.classList.add("bg-red-400", "text-white")

        }

      }

      opcionesDiv.appendChild(btn)

    })

    card.appendChild(opcionesDiv)
    triviaContainer.appendChild(card)

  }

  showQuestion(currentQuestion)

  /* ================= ESTADÍSTICAS ================= */

  const estadisticasDiv = secciones["Estadísticas"].querySelector("div.grid")
  estadisticasDiv.innerHTML = ""

  seleccion.estadisticas.forEach(stat => {

    const card = document.createElement("div")

    card.className = `
      bg-[#134e4a]
      border border-[#4CAF50]/30
      shadow-md
      rounded-xl
      p-4
      text-[#4CAF50]
      font-semibold
      text-center
    `

    card.textContent = `${stat.nombre}: ${stat.valor}`

    estadisticasDiv.appendChild(card)

  })

  /* ================= IMÁGENES ================= */

  const imagenesContainer = secciones["Imágenes"].querySelector("div.grid")
  imagenesContainer.innerHTML = ""

  if (seleccion.imagenes) {

    seleccion.imagenes.forEach(src => {

      const img = document.createElement("img")

      img.src = src
      img.alt = `Imagen de ${nombre}`

      img.className = `
        rounded-xl
        border border-[#4CAF50]/20
        shadow-md
        hover:scale-105
        transition
        object-cover
        w-full h-48
      `

      imagenesContainer.appendChild(img)

    })

  }

  const videoBaseName = nombre.toLowerCase().replace(/\s+/g, '')
  const video = document.getElementById("video")
  const videoLoader = document.getElementById("videoLoader")

}

function showVideoLoader() {
  videoLoader.classList.remove("hidden")
}

function hideVideoLoader() {
  videoLoader.classList.add("hidden")
}

window.setVideo = function (num, btn) {
  const videoBaseName = nombre.toLowerCase().replace(/\s+/g, '')

  showVideoLoader()

  video.pause()
  video.src = `videos/${videoBaseName}${num}.mp4`

  video.load()

  video.oncanplay = () => {
    hideVideoLoader()
    video.play()
  }

  document.querySelectorAll(".video-btn").forEach(b => {
    b.classList.remove(
      "bg-[#4CAF50]",
      "text-[#134e4a]"
    )

    b.classList.add(
      "bg-[#4CAF50]/10",
      "text-[#4CAF50]"
    )
  })

  btn.classList.remove(
    "bg-[#4CAF50]/10",
    "text-[#4CAF50]"
  )

  btn.classList.add(
    "bg-[#4CAF50]",
    "text-[#134e4a]"
  )
}



const video = document.getElementById("video")
const canvas = document.getElementById("canvas")
const intensitySlider = document.getElementById("intensity")

const gl = canvas.getContext("webgl")

let currentFilter = 0
let time = 0
let rendering = false

window.setFilter = function (num, btn) {

  currentFilter = num

  document.querySelectorAll(".filter-btn").forEach(b => {

    b.classList.remove(
      "bg-[#4CAF50]",
      "text-[#134e4a]"
    )

    b.classList.add(
      "bg-[#4CAF50]/10",
      "text-[#4CAF50]"
    )

  })

  btn.classList.remove(
    "bg-[#4CAF50]/10",
    "text-[#4CAF50]"
  )

  btn.classList.add(
    "bg-[#4CAF50]",
    "text-[#134e4a]"
  )

}
window.playVideo = function () {
  video.play()
  if (!rendering) {
    rendering = true
    render()
  }
}

window.restartVideo = function () {
  video.currentTime = 0
  video.play()
}

/* === SHADERS === */

const vertexShaderSource = `
attribute vec2 position;
varying vec2 vTex;
void main(){
vTex = (position + 1.0) * 0.5;
gl_Position = vec4(position,0.0,1.0);
}
`

const fragmentShaderSource = `
precision mediump float;

uniform sampler2D tex;
uniform float filterType;
uniform float intensity;
uniform float time;

varying vec2 vTex;

vec3 thermal(float v){
if(v < 0.2) return vec3(0.0,0.0,0.5);
if(v < 0.4) return vec3(0.0,0.5,1.0);
if(v < 0.6) return vec3(0.0,1.0,0.3);
if(v < 0.8) return vec3(1.0,1.0,0.0);
return vec3(1.0,0.0,0.0);
}

float rand(vec2 co){
return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

void main(){

vec2 uv = vTex;
vec4 color;

if(filterType == 1.0){

float size = max(2.0, 200.0 - intensity * 4.0);
uv = floor(uv * size) / size;
color = texture2D(tex, uv);
}

else if(filterType == 2.0){

float offset = 0.002 * intensity;

color =
texture2D(tex, uv) * 0.36 +
texture2D(tex, uv + vec2(offset,0.0)) * 0.16 +
texture2D(tex, uv - vec2(offset,0.0)) * 0.16 +
texture2D(tex, uv + vec2(0.0,offset)) * 0.16 +
texture2D(tex, uv - vec2(0.0,offset)) * 0.16;
}

else if(filterType == 3.0){

color = texture2D(tex, uv);
float gray = (color.r + color.g + color.b) / 3.0;
color = vec4(thermal(gray),1.0);
}

else if(filterType == 4.0){

float y = floor(uv.y * 240.0);
float jitter = rand(vec2(y,time)) * 0.003 * intensity;

vec2 uvR = uv + vec2(jitter,0.0);
vec2 uvB = uv - vec2(jitter,0.0);

float r = texture2D(tex, uvR).r;
float g = texture2D(tex, uv).g;
float b = texture2D(tex, uvB).b;

color = vec4(r,g,b,1.0);

float scan = sin(uv.y * 800.0) * 0.04;
color.rgb -= scan;

float noise = rand(uv + time) * 0.08;
color.rgb += noise;
}

else{
color = texture2D(tex, uv);
}

gl_FragColor = color;
}
`

function createShader(type, source) {
  const shader = gl.createShader(type)
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  return shader
}

const vs = createShader(gl.VERTEX_SHADER, vertexShaderSource)
const fs = createShader(gl.FRAGMENT_SHADER, fragmentShaderSource)

const program = gl.createProgram()
gl.attachShader(program, vs)
gl.attachShader(program, fs)
gl.linkProgram(program)

gl.useProgram(program)

const vertices = new Float32Array([
  -1, -1,
  1, -1,
  -1, 1,
  1, 1
])

const buffer = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)

const position = gl.getAttribLocation(program, "position")
gl.enableVertexAttribArray(position)
gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)

const texture = gl.createTexture()
gl.bindTexture(gl.TEXTURE_2D, texture)

gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)

const filterLocation = gl.getUniformLocation(program, "filterType")
const intensityLocation = gl.getUniformLocation(program, "intensity")
const timeLocation = gl.getUniformLocation(program, "time")

function render() {

  if (video.readyState >= 2) {

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    gl.viewport(0, 0, canvas.width, canvas.height)

    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)

    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      video
    )

    gl.uniform1f(filterLocation, currentFilter)

    const intensity = parseFloat(intensitySlider.value)
    gl.uniform1f(intensityLocation, intensity)

    time += 0.01
    gl.uniform1f(timeLocation, time)

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
  }

  requestAnimationFrame(render)
}

cambiarContenido(seccion)
