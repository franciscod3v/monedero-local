const btnAgregarTransaccion = document.getElementById("add-btn"); //Botón Abrir Ventana de Agregar Transacción
const ventanaPrincipal = document.getElementById("seccion-main"); //Ventana principal
const ventanaTransacciones = document.getElementById("seccion-transacciones"); //Ventana transacciones
const btnGuardarTransaccion = document.getElementById("btnGuardarTransaccion"); //Boton Guardar Transacción
const ventanaAgregarTransaccion = document.getElementById(
  "agregar-transaccion"
); //Ventana agregar transacción
const btnCerrarAgregarTransaccion = document.getElementById(
  "btn-cerrar-agregar-transaccion"
); //Boton cerrar agregar transaccación
const btnAgregarIngresos = document.getElementById("opcion-ingresos"); //Botón agregar ingresos en Ventana Agregar Transacción
const btnAgregarGastos = document.getElementById("opcion-gastos"); //Botón agregar gastos en Ventana Agregar Transacción

let balanceTotal = document.getElementById("balance-total"); //Balance total
let ingresosTotales = document.getElementById("total-ingresos"); //Ingresos totales
let gastosTotales = document.getElementById("total-gastos"); //Gastos totales

//Función que abre Ventana para ingresar transaccion
const desplegarVentanaAgregarTransaccion = () => {
  btnAgregarTransaccion.addEventListener("click", () => {
    ventanaPrincipal.classList.add("segundo-plano");
    ventanaTransacciones.classList.add("segundo-plano");
    ventanaAgregarTransaccion.classList.remove("desactive");
  });
};
//Boton que cierra Ventana para ingresar transacción
const cerrarVentanaAgregarTransaccion = () => {
  btnCerrarAgregarTransaccion.addEventListener("click", () => {
    ventanaPrincipal.classList.remove("segundo-plano");
    ventanaTransacciones.classList.remove("segundo-plano");
    ventanaAgregarTransaccion.classList.add("desactive");
  });
};
//Funcionan para seleccionar Ingresos o Gastos
const seleccionarAgregarIngresosOGastos = () => {
  btnAgregarIngresos.addEventListener("click", () => {
    btnAgregarIngresos.classList.add("seleccionado");
    btnAgregarGastos.classList.remove("seleccionado");
  });
  btnAgregarGastos.addEventListener("click", () => {
    btnAgregarGastos.classList.add("seleccionado");
    btnAgregarIngresos.classList.remove("seleccionado");
  });
};
//Funcion que calcula el Balance total
const calcularBalanceTotal = (presupuesto) => {
  let totalIngresos = 0;
  for (const ingreso of presupuesto.ingresos) {
    totalIngresos += ingreso.importe;
  }

  let totalGastos = 0;
  for (const gasto of presupuesto.gastos) {
    totalGastos += gasto.importe;
  }

  presupuesto.balanceTotal = totalIngresos - totalGastos;
};
//Funcion que calcula los ingresos totales
const calcularIngresosTotales = (presupuesto) => {
  let totalIngresos = 0;
  for (const ingreso of presupuesto.ingresos) {
    totalIngresos += ingreso.importe;
  }
  return totalIngresos;
};
//Funcion que calcula los gastos totales
const calcularGastosTotales = (presupuesto) => {
  let totalGastos = 0;
  for (const gasto of presupuesto.gastos) {
    totalGastos += gasto.importe;
  }
  return totalGastos;
};
//Funcion que convierte un objeto a String en formato JSON y lo retorna
const serializarInfo = (datosSinSerializar) => {
  return JSON.stringify(datosSinSerializar);
};
//Función que envia un String en formato JSON  al Local Storage
const enviarDatosAlLocalStorage = (datoSerializado) => {
  localStorage.setItem("presupuesto", datoSerializado);
};
//Funcion que actualiza el balance, ingresos y gastos en la pantalla principal
const actualizarPantallaPrincipal = (datosObtenidosLocalStorage) => {
  let balanceTotal = document.getElementById("balance-total");
  let ingresosTotales = document.getElementById("total-ingresos");
  let gastosTotales = document.getElementById("total-gastos");
  if (datosObtenidosLocalStorage !== null) {
    balanceTotal.textContent = datosObtenidosLocalStorage.balanceTotal;
    ingresosTotales.textContent = calcularIngresosTotales(
      datosObtenidosLocalStorage
    );
    gastosTotales.textContent = calcularGastosTotales(
      datosObtenidosLocalStorage
    );
  } else {
    balanceTotal.textContent = 0;
    ingresosTotales.textContent = 0;
    gastosTotales.textContent = 0;
  }
};
//Función que limpia el formulario de agregar transacciones
const limpiarFormulario = () => {
  const importeInput = document.getElementById("input-importe"); //Elemento Importe Input
  const categoriaInput = document.getElementById("input-categoria"); //Elemento Categoria
  const descripcionInput = document.getElementById("input-descripcion"); //Elemento Descripción
  const fechaInput = document.getElementById("input-fecha"); //Elemento Fecha Input
  importeInput.value = "";
  categoriaInput.value = "";
  descripcionInput.value = "";
  fechaInput.value = "";
  btnAgregarIngresos.classList.remove("seleccionado");
  btnAgregarGastos.classList.remove("seleccionado");
};
//Función que cierra ventana para ingresar transacción luego de agregar Transacción
const cerrarVentanaDespuesDeTransaccion = () => {
  ventanaPrincipal.classList.remove("segundo-plano");
  ventanaTransacciones.classList.remove("segundo-plano");
  ventanaAgregarTransaccion.classList.add("desactive");
};

/********************************* ACTUALIZAR SECCION DE TRANSACCACIONES RECIENTES ****************************************/

const aplicarFiltrosRecientes = (presupuesto) => {
  const filtroDeFechaSeleccionado = document.querySelector(
    ".filtro-item.item-seleccionado"
  ).textContent;

  const transaccionesPorFecha = presupuesto.transacciones.filter(
    (transaccion) => {
      const fechaTransaccion = new Date(transaccion.fecha); // Declaramos una variable FechaTransaccion para almacenar las fechas de cada transaccion
      fechaTransaccion.setUTCHours(fechaTransaccion.getUTCHours() + 5); //Ajustamos la fecha obtenida de la transaccion a la zona horaria
      const hoy = new Date(); //Declaramos una constante hoy donde almacenaremos la fecha de hoy
      hoy.setHours(0, 0, 0, 0); // Reiniciar a medianoche para comparaciones precisas

      // Aplicando filtro de fechas
      if (filtroDeFechaSeleccionado === "Hoy") {
        return fechaTransaccion.toDateString() === hoy.toDateString(); //Retornamos los objetos transaccion si su atributo fechaTransaccion es igual a hoy
      } else if (filtroDeFechaSeleccionado === "Semana") {
        const unaSemanaAtras = new Date(hoy); //Declaramos un constante con el dia de hoy
        unaSemanaAtras.setDate(unaSemanaAtras.getDate() - 7); //Le quitamos siete días a la constante
        return fechaTransaccion >= unaSemanaAtras; //Retornamos los objetos transaccion cuya fechaTransaccion sea menor a 7 dias desde hoy
      } else if (filtroDeFechaSeleccionado === "Mes") {
        return (
          fechaTransaccion.getMonth() === hoy.getMonth() &&
          fechaTransaccion.getFullYear() === hoy.getFullYear() //Retornamos los objetos transaccion cuyo mes y año sea el mismo que el de la variable hoy
        );
      } else if (filtroDeFechaSeleccionado === "Año") {
        return fechaTransaccion.getFullYear() === hoy.getFullYear(); //Retornamos los objetos transaccion cuyo año sea el mismo que el de hoy
      }

      return true; // Si el filtro de fechas es "Todos"
    }
  );
  return transaccionesPorFecha;
};

const actualizarInterfazSeccionTransaccionesRecientes = (
  transaccionesRecientesFiltradas
) => {
  const seccionListaTransacciones = document.querySelector(
    ".contenedor-transacciones"
  );
  seccionListaTransacciones.innerHTML = "";
  const ultimas4Transacciones = transaccionesRecientesFiltradas.slice(-4);
  ultimas4Transacciones.forEach((transaccion) => {
    const contenedorTransaccionReciente = document.createElement("div");
    contenedorTransaccionReciente.classList.add("transaccion-card");
    const contenedorIconoMonedaMonto = document.createElement("div");
    contenedorIconoMonedaMonto.classList.add("contenedor-icono-moneda-monto");
    const iconoTransaccion = document.createElement("i");
    if (transaccion.tipo === "Ingreso") {
      iconoTransaccion.classList.add(
        "bi",
        "bi-arrow-up-circle-fill",
        "icono-ingreso"
      );
    } else {
      iconoTransaccion.classList.add(
        "bi",
        "bi-arrow-down-circle-fill",
        "icono-gasto"
      );
    }
    contenedorIconoMonedaMonto.appendChild(iconoTransaccion);
    const monedaTransaccion = document.createElement("span");
    monedaTransaccion.classList.add("transaccion-moneda");
    monedaTransaccion.textContent = "$";
    contenedorIconoMonedaMonto.appendChild(monedaTransaccion);
    const montoTransaccion = document.createElement("span");
    montoTransaccion.classList.add("monto-transaccion");
    montoTransaccion.textContent = transaccion.importe;
    contenedorIconoMonedaMonto.appendChild(montoTransaccion);
    const categoriaTransaccion = document.createElement("p");
    categoriaTransaccion.classList.add("categoria-transaccion");
    categoriaTransaccion.textContent = transaccion.tipo;
    contenedorTransaccionReciente.appendChild(contenedorIconoMonedaMonto);
    contenedorTransaccionReciente.appendChild(categoriaTransaccion);
    seccionListaTransacciones.appendChild(contenedorTransaccionReciente);
  });
};

/********************************* GUARDAR TRANSACCIÓN EN LOCAL STORAGE ******************************/

//Funcion que agrega un escuchador al botón Registrar
const guardarTransaccion = () => {
  btnGuardarTransaccion.addEventListener("click", () => {
    /**Obtener datos del formulario */
    const importeInput = parseFloat(
      document.getElementById("input-importe").value
    ); //Valor del Input Importe
    const categoriaInput = document.getElementById("input-categoria").value; //Valor Categoria
    const descripcionInput = document.getElementById("input-descripcion").value; //Valor Descripción
    const fechaInput = document.getElementById("input-fecha").value; //Valor Fecha Input
    //Función que ingresa el objeto transacción en el objeto Presupuesto
    const ingresarTransaccion = (presupuesto) => {
      if (btnAgregarIngresos.classList.contains("seleccionado")) {
        const transaccion = {
          tipo: "Ingreso",
          importe: importeInput,
          categoria: categoriaInput,
          descripcion: descripcionInput,
          fecha: fechaInput,
        };
        presupuesto.transacciones.push(transaccion);
        presupuesto.ingresos.push(transaccion);
        presupuesto.categorias.ingresos.push(transaccion.categoria);
      } else if (btnAgregarGastos.classList.contains("seleccionado")) {
        const transaccion = {
          tipo: "Gasto",
          importe: importeInput,
          categoria: categoriaInput,
          descripcion: descripcionInput,
          fecha: fechaInput,
        };
        presupuesto.transacciones.push(transaccion);
        presupuesto.gastos.push(transaccion);
        presupuesto.categorias.gastos.push(transaccion.categoria);
      } else {
        console.log("Selecciona categoria");
      }
    };

    /** Obtener String del LocalStorage con la información del presupuesto*/
    const obtenerPresupuesto = localStorage.getItem("presupuesto");
    if (obtenerPresupuesto !== null) {
      try {
        //Convertir el String obtenido en formato JSON a un objeto
        const presupuestoObtenido = JSON.parse(obtenerPresupuesto);
        if (
          presupuestoObtenido.hasOwnProperty("transacciones") &&
          presupuestoObtenido.hasOwnProperty("ingresos") &&
          presupuestoObtenido.hasOwnProperty("gastos") &&
          presupuestoObtenido.hasOwnProperty("categorias") &&
          presupuestoObtenido.hasOwnProperty("balanceTotal")
        ) {
          //Ingresamos transacción en el objeto presupuestoObtenido
          ingresarTransaccion(presupuestoObtenido);
          //Calculamos el balance del objeto presupuestoObtenido con la nueva transacción incluida
          calcularBalanceTotal(presupuestoObtenido);
          //Le damos formato JSON al presupuesto actualizado
          const presupuestoSerializado = serializarInfo(presupuestoObtenido);
          //Lo enviamos al LocalStorage
          enviarDatosAlLocalStorage(presupuestoSerializado);
          //Actualizamos la pantalla con el objeto presupuestoObtenido ya que tiene la última transacción
          actualizarPantallaPrincipal(presupuestoObtenido);
          //Limpiamos el formulario
          limpiarFormulario();
          //Cerramos ventana transacción
          cerrarVentanaDespuesDeTransaccion();
          window.location.reload();
        } else {
          console.log("Hay datos pero no tienen el mismo orden");
        }
      } catch (error) {
        console.log("Error al parsear objeto presupuesto", error);
      }
    } else {
      /**Aplica solo si es la primera vez que guarda la info ya que el key presupuesto retornará null*/
      /* Objeto presupuesto a guardar en Local Storage */
      const nuevoPresupuesto = {
        transacciones: [],
        ingresos: [],
        gastos: [],
        categorias: {
          ingresos: [],
          gastos: [],
        },
        balanceTotal: 0,
      };
      //Ingresamos transacción en el objeto nuevo Presupuesto
      ingresarTransaccion(nuevoPresupuesto);
      //Calculamos el balance del objeto nuevo Prespuesto
      calcularBalanceTotal(nuevoPresupuesto);
      //Creamos un String para guardar el objeto nuevoPresupuesto en formato JSON
      const presupuestoSerializado = serializarInfo(nuevoPresupuesto);
      //Enviar el String en formato JSON al LocalStorage
      enviarDatosAlLocalStorage(presupuestoSerializado);
      //Limpiar el formulario
      limpiarFormulario();
      //Actualiza la pantalla principal con la info del objeto nuevo presupuesto
      actualizarPantallaPrincipal(nuevoPresupuesto);
      //Cerramos ventana transacción
      cerrarVentanaDespuesDeTransaccion();
      window.location.reload();
    }
  });
};

document.addEventListener("DOMContentLoaded", () => {
  //Creamos una variable para guardar el String en formato JSON obtenido del LocalStorage
  let datosObtenidosLocalStorage = localStorage.getItem("presupuesto");
  //Convertirmos el String obtenido del Local Storage a Objeto para poder manipularlo
  let datosObtenidosLocalStorageEnObjeto = JSON.parse(
    datosObtenidosLocalStorage
  );
  //Actualizamos pantalla con el objeto obtenido dle Local Storage
  actualizarPantallaPrincipal(datosObtenidosLocalStorageEnObjeto);
  //Invocamos función que manipula el botón agregar transacción
  desplegarVentanaAgregarTransaccion();
  //Invocamos función que el botón cerrarVentanaAgregar funciones
  cerrarVentanaAgregarTransaccion();
  //Invocamos función que permite el cambio de Ingresos y Gastos
  seleccionarAgregarIngresosOGastos();
  //Invocamos función que permite guardar una transacción
  guardarTransaccion();
  const transaccionesIniciales = aplicarFiltrosRecientes(
    datosObtenidosLocalStorageEnObjeto
  );
  actualizarInterfazSeccionTransaccionesRecientes(transaccionesIniciales);

  document.querySelectorAll(".filtro-item").forEach((filtro) => {
    filtro.addEventListener("click", () => {
      document
        .querySelector(".filtro-item.item-seleccionado")
        .classList.remove("item-seleccionado");
      filtro.classList.add("item-seleccionado");
      const transacciones = aplicarFiltrosRecientes(
        datosObtenidosLocalStorageEnObjeto
      );

      actualizarInterfazSeccionTransaccionesRecientes(transacciones);
    });
  });
});
