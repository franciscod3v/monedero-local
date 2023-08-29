const btnFiltroFechas = document.getElementById("filtro-tiempo");
const btnFiltroCategoria = document.getElementById("filtro-categoria");

const obtenerPrespuestoLocal = () => {
  return localStorage.getItem("presupuesto");
};

const enviarPresupuestoAlLocalStorage = (datoSerializado) => {
  localStorage.setItem("presupuesto", datoSerializado);
};

const serializarDatos = (datoSinSerializar) => {
  return JSON.stringify(datoSinSerializar);
};

const deserializarDatos = (datoSerializado) => {
  return JSON.parse(datoSerializado);
};

const obtenerFiltroFechas = () => {
  return btnFiltroFechas.value;
};

const obtenerFiltroCategoria = () => {
  return btnFiltroCategoria.value;
};

const obtenerTransacciones = (presupuesto) => {
  let listaDeTransacciones = [];
  listaDeTransacciones = presupuesto.transacciones;
  return listaDeTransacciones;
};

//Funcion que aplicará filtros 2 veces, usamos como parametro a un objeto, retornará un Array con transacciones filtradas por Fecha y Categoria
const aplicarFiltros = (presupuesto) => {
  const filtroFechas = obtenerFiltroFechas(); //Obtenemos el valor seleccionado del filtro de fechas
  const filtroCategoria = obtenerFiltroCategoria(); //Obtenemos el valor seleccionado del filtro de categoria

  //Declaramos un Array que guardará las transacciones Filtradas por Fecha
  const transacciones = presupuesto.transacciones.filter((transaccion) => {
    const fechaTransaccion = new Date(transaccion.fecha); // Declaramos una variable FechaTransaccion para almacenar las fechas de cada transaccion
    fechaTransaccion.setUTCHours(fechaTransaccion.getUTCHours() + 5); //Ajustamos la fecha obtenida de la transaccion a la zona horaria
    const hoy = new Date(); //Declaramos una constante hoy donde almacenaremos la fecha de hoy
    hoy.setHours(0, 0, 0, 0); // Reiniciar a medianoche para comparaciones precisas

    // Aplicando filtro de fechas
    if (filtroFechas === "Hoy") {
      return fechaTransaccion.toDateString() === hoy.toDateString(); //Retornamos los objetos transaccion si su atributo fechaTransaccion es igual a hoy
    } else if (filtroFechas === "Semana") {
      const unaSemanaAtras = new Date(hoy); //Declaramos un constante con el dia de hoy
      unaSemanaAtras.setDate(unaSemanaAtras.getDate() - 7); //Le quitamos siete días a la constante
      return fechaTransaccion >= unaSemanaAtras; //Retornamos los objetos transaccion cuya fechaTransaccion sea menor a 7 dias desde hoy
    } else if (filtroFechas === "Mes") {
      return (
        fechaTransaccion.getMonth() === hoy.getMonth() &&
        fechaTransaccion.getFullYear() === hoy.getFullYear() //Retornamos los objetos transaccion cuyo mes y año sea el mismo que el de la variable hoy
      );
    } else if (filtroFechas === "Año") {
      return fechaTransaccion.getFullYear() === hoy.getFullYear(); //Retornamos los objetos transaccion cuyo año sea el mismo que el de hoy
    }

    return true; // Si el filtro de fechas es "Todos"
  });

  // Aplicando filtro de categoría al Array que ya pasó por el filtro de Fechas
  if (filtroCategoria === "Ingresos") {
    //Si el valor del filtroCategoria es Ingresos
    return transacciones.filter(
      (transaccion) => transaccion.tipo === "Ingreso"
    ); //Retornamos el Array filtrado por tipo de Transaccion = Ingreso
  } else if (filtroCategoria === "Gastos") {
    return transacciones.filter((transaccion) => transaccion.tipo === "Gasto"); //Retornamos el Array filtrado por tipo de Transaccion = Gasto
  }

  return transacciones; // Si el filtro de categoría es "Todos", retornamos el Array tal y como estaba
};

const actualizarInterfaz = (transaccionesFiltradas) => {
  const seccionListaTransacciones = document.querySelector(
    ".seccion-lista-transacciones"
  ); //Guardamos el contenedor seccion-lista-transacciones
  seccionListaTransacciones.innerHTML = ""; // Limpiar la lista actual

  transaccionesFiltradas.forEach((transaccion) => {
    const contenedorTransaccion = document.createElement("div");
    contenedorTransaccion.classList.add(
      "contenedor-transaccion",
      "transaccion-modelo"
    );
    const contenedorCategoriaImporte = document.createElement("div");
    contenedorCategoriaImporte.classList.add("contenedor-categoria-importe");
    const categoriaTransaccion = document.createElement("p");
    categoriaTransaccion.classList.add("categoria-transaccion");
    categoriaTransaccion.textContent = transaccion.categoria;
    contenedorCategoriaImporte.appendChild(categoriaTransaccion);

    const importeTransaccion = document.createElement("span");
    importeTransaccion.classList.add("importe-transaccion");
    if (transaccion.tipo === "Ingreso") {
      importeTransaccion.classList.add("importe-ingreso");
    } else {
      importeTransaccion.classList.add("importe-gasto");
    }
    if (transaccion.tipo === "Ingreso") {
      importeTransaccion.textContent = "+" + transaccion.importe;
    } else {
      importeTransaccion.textContent = "-" + transaccion.importe;
    }
    contenedorCategoriaImporte.appendChild(importeTransaccion);

    const contenedorDescripcionFecha = document.createElement("div");
    contenedorDescripcionFecha.classList.add("contenedor-descripcion-fecha");

    const descripcionTransaccion = document.createElement("p");
    descripcionTransaccion.classList.add("descripcion-transaccion");
    descripcionTransaccion.textContent = transaccion.descripcion;
    contenedorDescripcionFecha.appendChild(descripcionTransaccion);

    const fechaTransaccion = document.createElement("span");
    fechaTransaccion.classList.add("fecha-transaccion");
    fechaTransaccion.textContent = transaccion.fecha;
    contenedorDescripcionFecha.appendChild(fechaTransaccion);

    // Construir el contenido de la transacción aquí (categoría, importe, descripción, fecha)
    // Puedes usar transaccion.categoria, transaccion.importe, transaccion.descripcion, transaccion.fecha, etc.

    contenedorTransaccion.appendChild(contenedorCategoriaImporte);

    contenedorTransaccion.appendChild(contenedorDescripcionFecha);

    seccionListaTransacciones.appendChild(contenedorTransaccion);
  });
};

const actualizarPaginaTransacciones = () => {
  let presupuestoObtenidoSinSerializar = obtenerPrespuestoLocal();
  let presupuesto = deserializarDatos(presupuestoObtenidoSinSerializar);

  if (presupuesto === null) {
    console.log("No hay compras");
  } else {
    const transaccionesFiltradas = aplicarFiltros(presupuesto);
    actualizarInterfaz(transaccionesFiltradas);
  }
};

document.addEventListener("DOMContentLoaded", () => {
  // Inicializar página trayendo los contenidos del Local Storage
  actualizarPaginaTransacciones();

  // Escuchar el cambio en el selector de filtro de tiempo
  btnFiltroFechas.addEventListener("change", () => {
    actualizarPaginaTransacciones();
  });

  // Escuchar el cambio en el selector de filtro de categoría
  btnFiltroCategoria.addEventListener("change", () => {
    actualizarPaginaTransacciones();
  });
});
