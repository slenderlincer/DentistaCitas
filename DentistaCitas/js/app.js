//Variables
const nombreInput = document.querySelector('#nombre');
const telefonoInput = document.querySelector('#telefono');
const fechaInput = document.querySelector('#fecha');
const horaInput = document.querySelector('#hora');
const motivoInput = document.querySelector('#motivo');

let editando;

//UI
const formulario = document.querySelector('#nueva-cita');
const contenedorCitas = document.querySelector('#citas');

class Citas{
    constructor(){
        this.citas = [];
    };

    agregarCita(cita){
        this.citas = [...this.citas, cita];
    };

    eliminarCita(id){
        this.citas = this.citas.filter(cita => cita.id !== id);
    };

    actualizarCita(citaActualizada){
        //si la cita actual es igual a la cita actualizada, se reescribe todo el contenido, de lo contrario se mantiene igual
        this.citas = this.citas.map(cita => cita.id === citaActualizada.id? citaActualizada: cita)
    };
};

class UI{
    imprimirAlerta(mensaje, tipo){
        //Crear div del mensaje
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('text-center', 'alert', 'd-block', 'col-12');

        //Agregar clase de alerta en base al tipo de error
        if(tipo === 'error'){
            divMensaje.classList.add('alert-danger')
        }else{
            divMensaje.classList.add('alert-success')
        };

        //Crear el mensaje de error
        divMensaje.textContent = mensaje

        //Agregar al DOM
        document.querySelector('#contenido').insertBefore(divMensaje, document.querySelector('.agregar-cita'));
        
        setTimeout(() => {
            divMensaje.remove();
        },3000);
    };

    imprimirCitas({citas}){
        this.limpiarHTML();

        citas.forEach(cita => {
            const {nombre, telefono, fecha, hora, motivo, id} = cita;

            const divCita = document.createElement('div');
            divCita.classList.add('cita', 'p-3');
            divCita.dataset.id = id;

            const nombreParrafo = document.createElement('h2');
            nombreParrafo.classList.add('card-title', 'font-weight-bolder')
            nombreParrafo.textContent = nombre;

            const telefonoParrafo = document.createElement('p');
            telefonoParrafo.innerHTML = `
            <span class = "font-weight-bolder">Telefono: </span>${telefono}
            `;

            const fechaParrafo = document.createElement('p');
            fechaParrafo.innerHTML = `
            <span class = "font-weight-bolder">Fecha: </span>${fecha}
            `;

            const horaParrafo = document.createElement('p');
            horaParrafo.innerHTML = `
            <span class = "font-weight-bolder">Hora: </span>${hora}
            `;
            
            const motivoParrafo = document.createElement('p');
            motivoParrafo.innerHTML = `
            <span class = "font-weight-bolder">Motivos: </span>${motivo}
            `;

            const btnEliminarCita = document.createElement('button');
            btnEliminarCita.classList.add('btn', 'btn-danger', 'mr-2');
            btnEliminarCita.innerHTML = `Eliminar <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>`;

            btnEliminarCita.onclick = () => eliminarCita(id);

            const btnEditarCita = document.createElement('button');
            btnEditarCita.classList.add('btn', 'btn-info', 'mr-2');
            btnEditarCita.innerHTML = `Editar <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
        </svg>`;

            btnEditarCita.onclick = () => cargarEdicion(cita);

            divCita.appendChild(nombreParrafo);
            divCita.appendChild(telefonoParrafo);
            divCita.appendChild(fechaParrafo);
            divCita.appendChild(horaParrafo);
            divCita.appendChild(motivoParrafo);
            divCita.appendChild(btnEliminarCita)
            divCita.appendChild(btnEditarCita)

            contenedorCitas.appendChild(divCita);

        });
    };

    limpiarHTML(){
        while(contenedorCitas.firstChild){
            contenedorCitas.removeChild(contenedorCitas.firstChild);
        };
    };
};

const ui = new UI();

const administrarCitas = new Citas();

//Eventos
eventListeners();

function eventListeners(){
    //Asigna un evento a cada input

    nombreInput.addEventListener('input', datosCita);
    telefonoInput.addEventListener('input', datosCita);
    fechaInput.addEventListener('input', datosCita);
    horaInput.addEventListener('input', datosCita);
    motivoInput.addEventListener('input', datosCita);

    //Validar el formulario
    formulario.addEventListener('submit', validarForm);
};

//Objeto Principal
const citaObj = {
    nombre: '',
    telefono: '',
    fecha: '',
    hora: '',
    motivo: ''
};

//Funciones

//Se llena el objeto principal con los datos del formulario
function datosCita(e){
    citaObj[e.target.name] = e.target.value;
};

//Valida y agrega una nueva cita en la clase de citas
function validarForm(e){
    e.preventDefault();

    //Extraer la info del objeto de citas
    const {nombre, telefono, fecha, hora, motivo} = citaObj;

    //Validar
    if(nombre === '' || telefono === '' || fecha === '' || hora === '' || motivo === ''){
        ui.imprimirAlerta('Todos Los Campos Son Obligatorios', 'error');
        
        return;
    };

    if(editando){
        ui.imprimirAlerta('Editado Correctamente');

        //pasa el objeto de la cita a edicion
        administrarCitas.actualizarCita({...citaObj});

        //Devolver el texto del boton a su texto original
        formulario.querySelector('button[type = "submit"]').textContent = "Agendar Cita";

        //Quitar modo edicion
        editando = false;
    }else{
        citaObj.id = Date.now();

        //Creando una cita
        administrarCitas.agregarCita({...citaObj});

        //Mensaje de agregado correctamente
        ui.imprimirAlerta('Se Agrego Correctamente')
    };

    //Resetear el objeto
    resetearObjeto();

    //resetear el formulario
    formulario.reset();

    //Mostrar el HTML
    ui.imprimirCitas(administrarCitas);
};

//Funcion para resetear el objeto
function resetearObjeto(){
    citaObj.nombre = '';
    citaObj.telefono = '';
    citaObj.fecha = '';
    citaObj.hora = '';
    citaObj.motivo = '';
};

function eliminarCita(id){
    administrarCitas.eliminarCita(id);

    ui.imprimirAlerta('Se elimino correctamente');

    ui.imprimirCitas(administrarCitas);
};

function cargarEdicion(cita){
    const {nombre, telefono, fecha, hora, motivo, id} = cita;

    //Llenar los input
    nombreInput.value = nombre;
    telefonoInput.value = telefono;
    fechaInput.value = fecha;
    horaInput.value = hora;
    motivoInput.value = motivo;

    //Llenar el objeto
    citaObj.nombre = nombre;
    citaObj.telefono = telefono;
    citaObj.fecha = fecha;
    citaObj.hora = hora;
    citaObj.motivo = motivo;
    citaObj.id = id;

    //Cambiar texto de boton
    formulario.querySelector('button[type = "submit"]').textContent = "Guardar Cambios"

    editando = true;
};
