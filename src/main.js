import { mexicoData, japonData, tunezData, sudafricaData, coreaData, colombiaData, uruguayData, espanaData, uzbekistanData, bosniaData, dinamarcaData, galesData } from './teamsData.js'
const teamDataMap = {
  Mexico: mexicoData,
  Japan: japonData,
  Tunez: tunezData,
  SA: sudafricaData,
  KS: coreaData,
  Colombia: colombiaData,
  Uruguay: uruguayData,
  Spain: espanaData,
  Uzbekistan: uzbekistanData,
  Bosnia: bosniaData,
  Denmark: dinamarcaData,
  Gales: galesData
}
import * as THREE from "three"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
import { MindARThree } from "mind-ar/dist/mindar-image-three.prod.js"

let arStarted = false
let mixer = null
let moveAction = null
let isMoving = false

// let particles = null
// let particleVertices = []
let particles = []

const clock = new THREE.Clock()
const textureLoader = new THREE.TextureLoader()
let eagleModel = null
const textureCache = {}
const startButton = document.querySelector("#startAR")
const appContainer = document.querySelector("#app")
const mainContent = document.querySelector("main")
const footerContent = document.querySelector("footer")
const header = document.querySelector("header")
const tutorialBtn = document.querySelector("#tutorialBtn")
let currentTeam = "Mexico"

//reinterpretar keys del modelo para que funcionen en la seccion de la seleccion
const teamNameMap = {
  "Mexico": "México",
  "SA": "Sudáfrica",
  "Colombia": "Colombia",
  "Uzbekistan": "Uzbekistán",
  "KS": "Corea del Sur",
  "Uruguay": "Uruguay",
  "Spain": "España",
  "Japan": "Japón",
  "Tunez": "Túnez",
  "Bosnia": "Bosnia",
  "Denmark": "Dinamarca",
  "Gales": "Gales"
};

startButton.addEventListener("click", async () => {
  if (arStarted) return
  arStarted = true
  const loadingScreen = createLoadingScreen()
  header.style.display = "none"
  mainContent.style.display = "none"
  footerContent.style.display = "none"
  appContainer.style.display = "block"
  appContainer.style.visibility = "hidden"

  tutorialBtn.style.display = "none"

  const mindarThree = new MindARThree({ container: appContainer, imageTargetSrc: "/targetstest.mind" })
  const { renderer, scene, camera } = mindarThree

  //await preloadTextures()

  renderer.setClearColor(0x000000, 0)
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 0.5

  scene.add(new THREE.HemisphereLight(0xffffff, 0xffffff, 1.2))
  const dirLight = new THREE.DirectionalLight(0xffffff, 1.0)
  dirLight.position.set(1, 2, 2)
  scene.add(dirLight)

  // Anchors
  const anchors = [mindarThree.addAnchor(0),
  mindarThree.addAnchor(1),
  mindarThree.addAnchor(2),
  mindarThree.addAnchor(3),
  mindarThree.addAnchor(4),
  mindarThree.addAnchor(5),
  mindarThree.addAnchor(6),
  mindarThree.addAnchor(7),
  mindarThree.addAnchor(8),
  mindarThree.addAnchor(9),
  mindarThree.addAnchor(10),
  mindarThree.addAnchor(11),
  ]

  // UI
  const closeButton = createCloseButton()
  const uiContainer = createUIContainer()

  const mainButtonsRow = document.createElement("div")
  mainButtonsRow.className = "flex gap-3 flex-wrap justify-center md:justify-end"

  const topLeftButtons = document.createElement("div")
  topLeftButtons.className = `
fixed top-6 left-6 flex gap-3 z-[999998]
`
  const menu = document.createElement("div")
  menu.className = `
mt-4 w-full md:w-80 hidden relative
bg-[#134e4a]/95 backdrop-blur-md
rounded-2xl shadow-2xl p-4
text-[#4CAF50]
border border-[#4CAF50]/20
`
  uiContainer.appendChild(menu)

  const closeMenuButton = document.createElement("button")
  closeMenuButton.innerText = "✕"
  closeMenuButton.className = `
absolute top-3 right-3 text-[#4CAF50]
text-lg hover:text-white transition
`
  menu.appendChild(closeMenuButton)

  const optionsContainer = document.createElement("div")
  optionsContainer.className = "flex flex-col gap-3 mt-6"
  menu.appendChild(optionsContainer)

  // Botones principales
  const interactButton = createButton("Interactuar", "", () => {
    interactButton.classList.add("hidden")
    menu.classList.remove("hidden")
    renderInitialMenu()
  })
  mainButtonsRow.appendChild(interactButton)


  const moveButton = createButton("Muévete", "", () => toggleMove(moveButton))
  topLeftButtons.appendChild(moveButton)

  const particleButton = createButton("Efectos", "", () => toggleParticles(particleButton, anchors))
  topLeftButtons.appendChild(particleButton)

  closeMenuButton.onclick = () => {
    menu.classList.add("hidden")
    interactButton.classList.remove("hidden")
  }

  document.body.appendChild(closeButton)
  uiContainer.appendChild(mainButtonsRow)
  document.body.appendChild(topLeftButtons)

  const initialOptions = [
    "Muéstrame más información",
    "Hazme una trivia",
    "Muéstrame videos relacionados",
    "Quiero ver imágenes",
    "Ver estadísticas"
  ]

  function renderMenuContent(option) {
    optionsContainer.innerHTML = ""
    const backButton = document.createElement("button")
    backButton.innerText = "← Volver"
    backButton.className = `
bg-[#4CAF50]/50 text-[#134e4a]
py-2 rounded-xl
hover:bg-[#4CAF50] hover:text-[#134e4a]
transition
`
    backButton.onclick = () => renderInitialMenu()
    optionsContainer.appendChild(backButton)

    const data = teamDataMap[currentTeam]
    if (!data) {
      const errorMsg = document.createElement("div")
      errorMsg.innerText = "Datos no disponibles"
      optionsContainer.appendChild(errorMsg)
      return
    }

    if (option === "Muéstrame más información") {
      const img = document.createElement("img")
      img.src = data.info.imagen
      img.className = "w-32 rounded-xl mb-3 mx-auto"
      optionsContainer.appendChild(img)
      const infoText = document.createElement("p")
      infoText.innerText = data.info.texto
      infoText.className = "text-[#4CAF50]/90 text-sm"
      optionsContainer.appendChild(infoText)
    }

    if (option === "Quiero ver imágenes") {
      const imagesLink = document.createElement("a")
      imagesLink.href = `/seleccion.html?nombre=${teamNameMap[currentTeam]}&seccion=Imágenes`
      imagesLink.innerText = "Ir a Imágenes"
      imagesLink.className = `
block text-center py-3 rounded-xl
bg-[#4CAF50]/20 text-[#4CAF50]
hover:bg-[#4CAF50] hover:text-[#134e4a]
transition
`
      optionsContainer.appendChild(imagesLink)
    }

    if (option === "Hazme una trivia") {
      let currentQuestion = 0
      function showQuestion(index) {
        optionsContainer.innerHTML = ""
        const q = data.trivia[index]
        const questionDiv = document.createElement("div")
        questionDiv.className = "mb-4"
        const questionText = document.createElement("p")
        questionText.innerText = `${index + 1}. ${q.pregunta}`
        questionText.className = "font-semibold mb-2 text-[#4CAF50]"
        questionDiv.appendChild(questionText)
        q.opciones.forEach((opt) => {
          const optBtn = document.createElement("button")
          optBtn.innerText = opt
          optBtn.className = `
block w-full text-left px-3 py-2
bg-[#4CAF50]/20 text-[#4CAF50]
rounded-xl mb-1
hover:bg-[#4CAF50] hover:text-[#134e4a]
transition
`
          optBtn.onclick = () => {
            if (opt === q.correcta) {
              optBtn.classList.add("bg-[#4CAF50]", "text-[#134e4a]")
              currentQuestion++
              if (currentQuestion < data.trivia.length) showQuestion(currentQuestion)
              else {
                optionsContainer.innerHTML = ""
                const doneMsg = document.createElement("p")
                doneMsg.innerText = "¡Has terminado la trivia!"
                doneMsg.className = "text-[#4CAF50] font-bold text-center mb-4"
                optionsContainer.appendChild(doneMsg)
                const backBtn = document.createElement("button")
                backBtn.innerText = "Volver al menú"
                backBtn.className = `
      w-full py-3 rounded-xl
      bg-[#4CAF50]/20 text-[#4CAF50]
      hover:bg-[#4CAF50] hover:text-[#134e4a]
      active:scale-95 transition
    `
                backBtn.onclick = () => renderInitialMenu()
                optionsContainer.appendChild(backBtn)
              }
            } else {
              optBtn.classList.add("bg-red-500", "text-white")
            }
          }
          questionDiv.appendChild(optBtn)
        })
        optionsContainer.appendChild(questionDiv)
      }
      showQuestion(currentQuestion)
    }

    if (option === "Muéstrame videos relacionados") {
      const videoLink = document.createElement("a")
      videoLink.href = `/seleccion.html?nombre=${teamNameMap[currentTeam]}&seccion=Videos`
      videoLink.innerText = "Ir a Videos"
      videoLink.className = `
block text-center py-3 rounded-xl
bg-[#4CAF50]/20 text-[#4CAF50]
hover:bg-[#4CAF50] hover:text-[#134e4a]
transition
`
      optionsContainer.appendChild(videoLink)
    }

    if (option === "Ver estadísticas") {
      data.estadisticas.forEach((stat) => {
        const statDiv = document.createElement("div")
        statDiv.className = `
bg-[#134e4a]/50 text-[#4CAF50]
rounded-xl px-3 py-2 mb-2
text-sm border border-[#4CAF50]/20
`
        statDiv.innerText = `${stat.nombre}: ${stat.valor}`
        optionsContainer.appendChild(statDiv)
      })
    }
  }

  function renderInitialMenu() {
    optionsContainer.innerHTML = ""
    initialOptions.forEach((text) => {
      const btn = document.createElement("button")
      btn.innerText = text
      btn.className = `
bg-[#4CAF50]/20 text-[#4CAF50]
py-3 rounded-xl
hover:bg-[#4CAF50] hover:text-[#134e4a]
active:scale-95 transition
`
      btn.onclick = () => renderMenuContent(text)
      optionsContainer.appendChild(btn)
    })
  }

  await new Promise((resolve, reject) => {
    const loader = new GLTFLoader()

    loader.load(
      "/models/aguila.gltf",
      (gltf) => {
        eagleModel = gltf.scene
        eagleModel.scale.set(0.005, 0.005, 0.005)
        eagleModel.position.set(0, 0, 0.1)

        if (gltf.animations.length > 0) {
          mixer = new THREE.AnimationMixer(eagleModel)
          moveAction = mixer.clipAction(gltf.animations[0])
          moveAction.loop = THREE.LoopRepeat
          moveAction.clampWhenFinished = false
          moveAction.enabled = true
          moveAction.paused = true
        }

        let currentAnchor = null
        anchors.forEach((anchor, i) => {
          anchor.onTargetFound = () => {
            uiContainer.classList.remove("hidden")
            if (currentAnchor !== anchor) {
              if (currentAnchor) currentAnchor.group.remove(eagleModel)
              anchor.group.add(eagleModel)
              currentAnchor = anchor
            }
            if (i === 0) setTeam("Mexico")
            else if (i === 1) setTeam("Japan")
            else if (i === 2) setTeam("Colombia")
            else if (i === 3) setTeam("Spain")
            else if (i === 4) setTeam("Uruguay")
            else if (i === 5) setTeam("Tunez")
            else if (i === 6) setTeam("KS")
            else if (i === 7) setTeam("SA")
            else if (i === 8) setTeam("Bosnia")
            else if (i === 9) setTeam("Denmark")
            else if (i === 10) setTeam("Uzbekistan")
            else if (i === 11) setTeam("Gales")
          }
          anchor.onTargetLost = () => resetUI(moveButton, particleButton, interactButton, uiContainer, menu, anchors)
        })

        resolve()
      },
      undefined,
      reject
    )
  })

  await mindarThree.start()

  const video = appContainer.querySelector("video")
  await new Promise((resolve) => {
    if (video.readyState >= 2) resolve()
    else video.onloadeddata = resolve
  })
  appContainer.style.visibility = "visible"
  loadingScreen.remove()

  document.body.style.overflow = "hidden"
  applyFullscreen(renderer, camera)

  renderer.setAnimationLoop(() => {
    const delta = clock.getDelta()
    if (mixer) mixer.update(delta)
    if (particles.length > 0) updateParticles()
    renderer.render(scene, camera)
  })

  window.addEventListener("keydown", (e) => {
    const keys = {
      "1": "Mexico", "2": "Japan", "3": "Colombia", "4": "Spain",
      "5": "Uruguay", "6": "Tunez", "7": "KS", "8": "SA",
      "9": "Bosnia", "0": "Denmark", "q": "Uzbekistan", "w": "Gales"
    }
    if (keys[e.key]) setTeam(keys[e.key])
  })
  window.addEventListener("resize", () => applyFullscreen(renderer, camera))
  window.addEventListener("orientationchange", () => setTimeout(() => applyFullscreen(renderer, camera), 300))
})

// --- Funciones auxiliares ---
function createLoadingScreen() {
  const loader = document.createElement("div")

  loader.id = "loading-screen"

  loader.innerHTML = `
    <div class="loading-spinner"></div>
    <p style="margin-top:20px; font-size:18px;">
      Cargando...
    </p>
  `

  loader.style.position = "fixed"
  loader.style.top = "0"
  loader.style.left = "0"
  loader.style.width = "100%"
  loader.style.height = "100%"
  loader.style.background = "rgba(0,0,0,0.5)"
  loader.style.display = "flex"
  loader.style.flexDirection = "column"
  loader.style.justifyContent = "center"
  loader.style.alignItems = "center"
  loader.style.zIndex = "9999999"
  loader.style.color = "#4CAF50"

  const style = document.createElement("style")
  style.innerHTML = `
    .loading-spinner {
      width: 70px;
      height: 70px;
      border: 6px solid rgba(255,255,255,0.15);
      border-top: 6px solid #4CAF50;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `

  document.head.appendChild(style)
  document.body.appendChild(loader)

  return loader
}

async function loadTeamTextures(team) {
  if (textureCache[team]) return textureCache[team]

  const loadTexture = (path) => {
    return new Promise((resolve, reject) => {
      textureLoader.load(
        path,
        (texture) => {
          texture.flipY = false
          texture.encoding = THREE.sRGBEncoding
          resolve(texture)
        },
        undefined,
        (error) => reject(error)
      )
    })
  }

  try {
    const diffuse = await loadTexture(`/models/textures/${team}_Eagle_diffuse.webp`)
    const diffuse2 = await loadTexture(`/models/textures/${team}_Eagle_diffuse2.webp`)

    textureCache[team] = {
      diffuse,
      diffuse2
    }

    console.log(`Texturas cargadas: ${team}`)

    return textureCache[team]
  } catch (error) {
    console.error(`Error cargando texturas de ${team}`, error)
    return null
  }
}

async function preloadTextures() {
  const teams = [
    "Mexico", "Japan", "Colombia", "Spain",
    "Uruguay", "Tunez", "KS", "SA",
    "Bosnia", "Denmark", "Uzbekistan", "Gales"
  ]

  const loadTexture = (path) => {
    return new Promise((resolve, reject) => {
      textureLoader.load(
        path,
        (texture) => {
          texture.flipY = false
          texture.encoding = THREE.sRGBEncoding
          resolve(texture)
        },
        undefined,
        (error) => reject(error)
      )
    })
  }

  for (const team of teams) {
    try {
      const diffuse = await loadTexture(`/models/textures/${team}_Eagle_diffuse.webp`)
      const diffuse2 = await loadTexture(`/models/textures/${team}_Eagle_diffuse2.webp`)

      textureCache[team] = {
        diffuse,
        diffuse2
      }

      console.log(`Texturas cargadas: ${team}`)
    } catch (error) {
      console.error(`Error cargando texturas de ${team}`, error)
    }
  }
}

// function setTeam(team) {
//   currentTeam = team
//   if (!eagleModel) return
//   const tex = textureCache[team]
//   eagleModel.traverse((child) => {
//     if (child.isMesh) {
//       const mats = Array.isArray(child.material) ? child.material : [child.material]
//       mats.forEach(m => {
//         if (m.name === "M_Rope_Eagle") m.map = tex.diffuse
//         if (m.name === "M_Eagle_Logo") m.map = tex.diffuse2
//         m.needsUpdate = true
//       })
//     }
//   })
// }

async function setTeam(team) {
  currentTeam = team

  if (!eagleModel) return

  const loadingScreen = createLoadingScreen()

  eagleModel.visible = false

  const tex = await loadTeamTextures(team)

  if (!tex) {
    eagleModel.visible = true
    loadingScreen.remove()
    return
  }

  eagleModel.traverse((child) => {
    if (child.isMesh) {
      const mats = Array.isArray(child.material)
        ? child.material
        : [child.material]

      mats.forEach((m) => {
        if (m.name === "M_Rope_Eagle") {
          m.map = tex.diffuse
        }

        if (m.name === "M_Eagle_Logo") {
          m.map = tex.diff2 || tex.diffuse2
        }

        m.needsUpdate = true
      })
    }
  })

  eagleModel.visible = true

  loadingScreen.remove()
}


function createButton(text, bgClass, onClick) {
  const btn = document.createElement("button")
  btn.innerText = text
  btn.className = `
px-5 py-2 rounded-full shadow-lg
text-[#4CAF50]
bg-[#134e4a]/90 backdrop-blur-md
border border-[#4CAF50]/30
hover:bg-[#4CAF50] hover:text-[#134e4a]
active:scale-95 transition
`
  btn.onclick = onClick
  return btn
}

function createCloseButton() {
  const btn = document.createElement("button")
  btn.innerText = "✕"
  btn.className = `
fixed top-5 right-5 w-12 h-12 rounded-full
bg-[#134e4a] text-[#4CAF50]
border border-[#4CAF50]/40
flex items-center justify-center
shadow-xl z-[999999]
hover:bg-[#4CAF50] hover:text-[#134e4a]
transition
`
  btn.onclick = () => location.reload()
  return btn
}

function createUIContainer() {
  const container = document.createElement("div")
  container.className = `
fixed bottom-6 left-1/2 -translate-x-1/2
w-full max-w-md
flex flex-col items-center gap-3
z-[999998] hidden px-4
md:left-auto md:translate-x-0 md:right-6 md:items-end
`
  document.body.appendChild(container)
  return container
}

function toggleMove(button) {
  if (!moveAction) return

  isMoving = !isMoving

  if (isMoving) {
    moveAction.play()
    moveAction.paused = false

    button.innerText = "Sin movimiento"

    button.style.backgroundColor = "#4CAF50"
    button.style.color = "#134e4a"

  } else {
    moveAction.paused = true

    button.innerText = "Muévete"

    button.style.backgroundColor = "#134e4a"
    button.style.color = "#4CAF50"
  }
}

function initParticles(activeAnchors) {
  const particleCount = 80

  const colors = [
    0xff0000, // rojo
    0x00ff00, // verde
    0x0000ff, // azul
    0xffff00, // amarillo
    0xff00ff, // rosa
    0x00ffff  // cyan
  ]

  const baseX = eagleModel.position.x
  const baseY = eagleModel.position.y
  const baseZ = eagleModel.position.z

  particles = []

  for (let i = 0; i < particleCount; i++) {

    const geometry = new THREE.PlaneGeometry(0.02, 0.02)

    const material = new THREE.MeshBasicMaterial({
      color: colors[Math.floor(Math.random() * colors.length)],
      side: THREE.DoubleSide
    })

    const mesh = new THREE.Mesh(geometry, material)

    mesh.position.set(
      baseX + (Math.random() - 0.5) * 0.5,
      baseY + Math.random() * 0.5 + 0.2,
      baseZ + (Math.random() - 0.5) * 0.5
    )

    mesh.userData = {
      speed: Math.random() * 0.01 + 0.005,
      rotationSpeed: Math.random() * 0.1
    }

    particles.push(mesh)

    activeAnchors.forEach(a => a.group.add(mesh))
  }
}

function removeParticles(anchors) {
  if (!particles.length) return

  particles.forEach(p => {
    anchors.forEach(a => a.group.remove(p))
    p.geometry.dispose()
    p.material.dispose()
  })

  particles = []
}

function toggleParticles(button, anchors) {
  if (!eagleModel) return

  const currentAnchor = anchors.find(a => a.group.children.includes(eagleModel))
  if (!currentAnchor) return

  if (particles.length === 0) {

    initParticles([currentAnchor])

    button.innerText = "Sin efectos"
    button.style.backgroundColor = "#4CAF50"
    button.style.color = "#134e4a"

  } else {

    removeParticles([currentAnchor])

    button.innerText = "Efectos"
    button.style.backgroundColor = "#134e4a"
    button.style.color = "#4CAF50"

  }
}

function updateParticles() {
  particles.forEach(p => {

    p.position.y -= p.userData.speed

    p.rotation.x += p.userData.rotationSpeed
    p.rotation.y += p.userData.rotationSpeed

    if (p.position.y < 0) {
      p.position.y = 0.6
      p.position.x = (Math.random() - 0.5) * 0.5
      p.position.z = (Math.random() - 0.5) * 0.5
    }

  })
}

function resetUI(moveBtn, particleBtn, interactBtn, uiContainer, menu, anchors) {

  uiContainer.classList.add("hidden")
  menu.classList.add("hidden")
  interactBtn.classList.remove("hidden")

  // RESET MOVIMIENTO
  moveBtn.innerText = "Muévete"
  moveBtn.style.backgroundColor = "#134e4a"
  moveBtn.style.color = "#4CAF50"

  if (moveAction) moveAction.paused = true
  isMoving = false

  // RESET EFECTOS
  particleBtn.innerText = "Efectos"
  particleBtn.style.backgroundColor = "#134e4a"
  particleBtn.style.color = "#4CAF50"

  if (particles && anchors) {
    removeParticles(anchors)
  }
}
function applyFullscreen(renderer, camera) {
  const video = appContainer.querySelector("video")
  const width = window.innerWidth
  const height = window.innerHeight
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(width, height, false)
  renderer.domElement.style.position = "absolute"
  renderer.domElement.style.top = "0"
  renderer.domElement.style.left = "0"
  renderer.domElement.style.width = "100%"
  renderer.domElement.style.height = "100%"
  camera.aspect = width / height
  camera.updateProjectionMatrix()
  if (video) {
    video.style.position = "absolute"
    video.style.top = "0"
    video.style.left = "0"
    video.style.width = "100%"
    video.style.height = "100%"
    video.style.objectFit = "cover"
  }
}