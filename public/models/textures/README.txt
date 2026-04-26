El modelo tiene 3 materiales, en THREE.JS deberían importarse las texturas del modelo como un array de materiales, se ocupan los 3 materiales:

AGUILA

Material1: Pelaje del águila, usa las texturas M_Eagle. El roughness es M_Eagle_specularglossiness


CAMISA

material2: Aquí esta la textura del águila con camisa pero sin el logo, se usa la textura del nombre de la selección seguido de "diffuse": EJ. "Mexico_Eagle_diffuse". Usa de normal map el que esta editado: "M_Eagle_normal_edited" y el rought_map es "M_Eagle_rough"

Material2: Material de la camisa que si tiene el logo: "Mexico_Eagle_diffuse2", los normal maps y ropugh maps son los mismos que el del material 2.