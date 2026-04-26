import * as THREE from "three"

const textureCache = {}

let shirtDiffuse = null
let shirtDiffuse2 = null

export function preloadTextures(textureLoader) {

  const teams = [
    "Mexico", "Japan", "Colombia", "Spain", "Uruguay",
    "Tunez", "KS", "SA", "Bosnia", "Denmark", "Uzbekistan", "Gales"
  ]

  teams.forEach(team => {

    const diffuse = textureLoader.load(`/models/textures/${team}_Eagle_diffuse.png`)
    const diffuse2 = textureLoader.load(`/models/textures/${team}_Eagle_diffuse2.png`)

    diffuse.flipY = false
    diffuse.encoding = THREE.sRGBEncoding

    diffuse2.flipY = false
    diffuse2.encoding = THREE.sRGBEncoding

    textureCache[team] = {
      diffuse,
      diffuse2
    }

  })
}

export function setTeam(team, eagleModel) {

  const tex = textureCache[team]
  if (!tex) return

  shirtDiffuse = tex.diffuse
  shirtDiffuse2 = tex.diffuse2

  if (!eagleModel) return

  eagleModel.traverse((child) => {

    if (child.isMesh) {

      const materials = Array.isArray(child.material)
        ? child.material
        : [child.material]

      materials.forEach((mat) => {

        if (mat.name === "M_Rope_Eagle") {
          mat.map = shirtDiffuse
        }

        if (mat.name === "M_Eagle_Logo") {
          mat.map = shirtDiffuse2
        }

        mat.needsUpdate = true

      })

    }

  })
}