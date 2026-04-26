import * as THREE from "three"

export function createUI(ctx) {

  const {
    anchor, setTeam,
    getMoveAction, setIsMoving, getIsMoving,
    getParticles, setParticles,
    particleVertices
  } = ctx

  const closeButton = document.createElement("button")
  closeButton.innerText = "✕"
  document.body.appendChild(closeButton)

  const uiContainer = document.createElement("div")
  document.body.appendChild(uiContainer)

  const interactButton = document.createElement("button")
  interactButton.innerText = "Interactuar"
  uiContainer.appendChild(interactButton)

  const moveButton = document.createElement("button")
  moveButton.innerText = "Muévete"
  uiContainer.appendChild(moveButton)

  moveButton.onclick = () => {
    const moveAction = getMoveAction()
    if (!moveAction) return

    const isMoving = !getIsMoving()
    setIsMoving(isMoving)

    if (isMoving) {
      moveAction.paused = false
      moveAction.play()
    } else {
      moveAction.paused = true
    }
  }

  const particleButton = document.createElement("button")
  particleButton.innerText = "Efectos"
  uiContainer.appendChild(particleButton)

  particleButton.onclick = () => {

    let particles = getParticles()

    if (!particles) {

      const geometry = new THREE.BufferGeometry()
      const verts = []

      for (let i = 0; i < 200; i++) {
        verts.push(Math.random(), Math.random(), Math.random())
      }

      geometry.setAttribute("position", new THREE.Float32BufferAttribute(verts, 3))
      const material = new THREE.PointsMaterial({ size: 0.01 })

      particles = new THREE.Points(geometry, material)
      anchor.group.add(particles)

      setParticles(particles)

    } else {

      anchor.group.remove(particles)
      particles.geometry.dispose()
      particles.material.dispose()
      setParticles(null)

    }
  }

  window.addEventListener("keydown", (e) => {

    if (e.key === "1") setTeam("Mexico")
    if (e.key === "2") setTeam("Japan")
    if (e.key === "3") setTeam("Colombia")
    if (e.key === "4") setTeam("Spain")
    if (e.key === "5") setTeam("Uruguay")
    if (e.key === "6") setTeam("Tunez")
    if (e.key === "7") setTeam("KS")
    if (e.key === "8") setTeam("SA")
    if (e.key === "9") setTeam("Bosnia")
    if (e.key === "0") setTeam("Denmark")
    if (e.key === "q") setTeam("Uzbekistan")
    if (e.key === "w") setTeam("Gales")

  })

}