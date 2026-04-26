const btn = document.getElementById("seleccionesBtn")
const menu = document.getElementById("seleccionesMenu")

async function cargarSelecciones() {
  try {
    const response = await fetch("/info/teams.json")
    const selecciones = await response.json()

    selecciones.forEach((nombre) => {
      const item = document.createElement("button")
      item.textContent = nombre
      item.className =
        "block w-full text-left px-4 py-2 rounded-lg text-[#4CAF50] hover: bg - [#4CAF50] hover: text - [#134e4a] active: bg - [#4CAF50] active: text - [#134e4a]transition"

      item.onclick = () => {
        const items = menu.querySelectorAll("button")
        items.forEach(i => i.classList.remove("bg-[#4CAF50]", "text-[#134e4a]"))

        item.classList.add("bg-[#4CAF50]", "text-[#134e4a]")

        setTimeout(() => {
          window.location.href =
            `seleccion.html?nombre=${encodeURIComponent(nombre)}`
        }, 150)
      }

      menu.appendChild(item)
    })
  } catch (error) {
    console.error("Error cargando selecciones:", error)
  }
}

btn.onclick = () => {
  menu.classList.toggle("hidden")
}

document.addEventListener("click", (e) => {
  if (!btn.contains(e.target) && !menu.contains(e.target)) {
    menu.classList.add("hidden")
  }
})

cargarSelecciones()