const API_URL = "http://localhost:3000/mascotas";

/* Función para registrar una mascota */
async function registrarMascota(event) {
    event.preventDefault();

    let mascota = {
        idmascota: document.getElementById("idmascota").value,
        ruac: document.getElementById("ruac").value || null,
        nombre: document.getElementById("nombre").value,
        raza: document.getElementById("raza").value,
        tamanio: document.getElementById("tamanio").value,
        genero: document.getElementById("genero").value,
        collar: document.getElementById("collar").value,  // 🔹 Se envía como string "true" o "false"
        descripcion: document.getElementById("descripcion").value,
        chip: document.getElementById("chip").value || null
    };

    let response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mascota)
    });

    let result = await response.json();
    let mensajeDiv = document.getElementById("mensaje");
    mensajeDiv.innerHTML = response.ok ? `✅ ${result.message}` : `❌ Error: ${result.error}`;
    mensajeDiv.style.color = response.ok ? "green" : "red";
}

/*Función para obtener y listar todas las mascotas en "Bajas" */
async function listarMascotas() {
    let listaMascotas = document.getElementById("lista-mascotas");
    if (!listaMascotas) return; // Evita error si la función se ejecuta en otra página

    let response = await fetch(API_URL);
    let mascotas = await response.json();

    listaMascotas.innerHTML = "<ul>";
    mascotas.forEach(mascota => {
        listaMascotas.innerHTML += `<li>ID: ${mascota.idmascota} - Nombre: ${mascota.nombre} - Raza: ${mascota.raza}</li>`;
    });
    listaMascotas.innerHTML += "</ul>";
}

/*Función para eliminar una mascota */
async function eliminarMascota() {
    let id = document.getElementById("idbaja").value;

    if (!id) {
        alert("⚠️ Ingresa un ID para eliminar.");
        return;
    }

    let response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    let result = await response.json();

    alert(response.ok ? `✅ ${result.message}` : `❌ Error: ${result.error}`);
    listarMascotas(); // Recargar lista
}

/*Función para cargar los datos de una mascota en "Cambios" */
async function cargarMascota() {
    let id = document.getElementById("idmodificar").value;

    if (!id) {
        alert("⚠️ Ingresa un ID para buscar.");
        return;
    }

    let response = await fetch(`${API_URL}/${id}`);
    let mascota = await response.json();

    if (!response.ok) {
        alert(`❌ Error: ${mascota.error}`);
        return;
    }

    document.getElementById("formulario-modificacion").style.display = "block";
    document.getElementById("nombreNuevo").value = mascota.nombre;
    document.getElementById("razaNueva").value = mascota.raza;
    document.getElementById("tamanioNuevo").value = mascota.tamanio;
    document.getElementById("generoNuevo").value = mascota.genero;
    document.getElementById("collarNuevo").value = mascota.collar.toString();
    document.getElementById("descripcionNueva").value = mascota.descripcion;
    document.getElementById("chipNuevo").value = mascota.chip;
}

/*Función para modificar una mascota */
async function modificarMascota() {
    let id = document.getElementById("idmodificar").value;

    if (!id) {
        alert("⚠️ Ingresa un ID para modificar.");
        return;
    }

    let mascota = {
        nombre: document.getElementById("nombreNuevo").value,
        raza: document.getElementById("razaNueva").value,
        tamanio: document.getElementById("tamanioNuevo").value,
        genero: document.getElementById("generoNuevo").value,
        collar: document.getElementById("collarNuevo").value, // 🔹 Se envía como string "true" o "false"
        descripcion: document.getElementById("descripcionNueva").value,
        chip: document.getElementById("chipNuevo").value || null
    };

    let response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mascota)
    });

    let result = await response.json();
    alert(response.ok ? `✅ ${result.message}` : `❌ Error: ${result.error}`);
}

/*Ejecutar "listarMascotas()" solo en bajas.html */
document.addEventListener("DOMContentLoaded", listarMascotas);
