import { UserInterface } from "../classes /UserInterface.js";

import {
  form,
  inputPatientName,
  inputPatientAge,
  inputPatientPhone,
  inputAppointmentDate,
  inputAppointmentTime,
  inputPatientSymptoms,
  inputPatientDiagnosis,
} from "./selectors.js";

let editMode = false;

let DB;

const appointment = {
  patientName: "",
  patientAge: "",
  patientPhone: "",
  date: "",
  time: "",
  patientSymptoms: "",
  patientDiagnosis: "",
};

// leer valores ingresados en los inputs y guardarlos en el objeto appointment
function readInputs(e) {
  appointment[e.target.name] = e.target.value;
}

// validar y agregar una nueva cita
function addAppointment(e) {
  e.preventDefault(); //prevenir el comportamiento predeterminado del evento submit

  const { patientName, patientAge, patientPhone, date, time, patientSymptoms, patientDiagnosis } =
    appointment;

  // validar cita

  if (
    patientName === "" ||
    patientAge === "" ||
    patientPhone === "" ||
    date === "" ||
    time === "" ||
    patientSymptoms === ""
  ) {
    UserInterface.showAlert("Debes rellenar todos los campos obligatorios", "error");
    return;
  }

  if (isNaN(patientPhone) || patientPhone.length < 7) {
    UserInterface.showAlert("El número de teléfono ingresado no es válido", "error");
    return;
  }

  // agregar texto por defecto si no se completo el campo opcional de diagnostico

  if (patientDiagnosis === "") {
    appointment.patientDiagnosis = "Diagnóstico pendiente";
  }

  if (editMode) {
    // editar cita

    // editar en indexedDB

    // iniciamos una transacción en la base de datos con el objeto DB y especificamos que será de escritura y lectura.
    const transaction = DB.transaction("appointments", "readwrite");

    // Obtenemos el objectStore "appointments" de la transacción.
    const appointmentStore = transaction.objectStore("appointments");

    // actualizamos el objeto "appointment" en el objectStore "appointments".
    appointmentStore.put(appointment);

    transaction.oncomplete = function () {
      // mostrar alerta
      UserInterface.showAlert("¡La cita fue editada con éxito!", "success");

      // modificar texto del button
      document.querySelector("#add-button").textContent = "Agregar cita";

      editMode = false;
    };

    transaction.onerror = function () {
      console.log("Error al editar cita");
    };
  } else {
    // crear una nueva cita

    // generar un id único para la cita
    appointment.id = Date.now();

    // insertar appointment a indexDB

    // abrir transaction de lectura y escritura en el objectStore "appointments"
    const transaction = DB.transaction("appointments", "readwrite");

    // obtener una referencia al objectStore "appointments"
    const appointmentStore = transaction.objectStore("appointments");

    // agregar el objeto appointment al appointmentStore en indexDB
    const addAppointmentRequest = appointmentStore.add(appointment);

    // manejar error

    addAppointmentRequest.onerror = function (e) {
      console.log("Error al agregar la cita", e.target.error);
    };

    // manejar éxito

    addAppointmentRequest.onsuccess = function (e) {
      console.log("Cita agregada con éxito", e.target.result);

      // mostrar alerta
      UserInterface.showAlert("¡La cita fue creada con éxito!", "success");
    };
  }

  //mostrar citas en HTML
  UserInterface.ShowAppointmentsInHTML();

  // reiniciar form
  form.reset();

  // reiniciar objeto appointment
  for (let key in appointment) {
    appointment[key] = "";
  }
}

function removeAppointment(id) {
  //eliminar cita del array

  // Abrir una transacción de lectura/escritura en la base de datos "appointments"
  const transaction = DB.transaction("appointments", "readwrite");
  const appointmentStore = transaction.objectStore("appointments");

  appointmentStore.delete(id);

  transaction.oncomplete = function () {
    //mostrar alerta
    UserInterface.showAlert("La cita se eliminó correctamente", "success");

    //actualizar citas en HTML
    UserInterface.ShowAppointmentsInHTML();
  };

  transaction.onerror = function () {
    console.log("Error al eliminar cita");
  };
}

function editAppointment(id) {
  // Abrir una transacción de lectura/escritura en la base de datos "appointments"
  const transaction = DB.transaction("appointments", "readwrite");
  const appointmentStore = transaction.objectStore("appointments");

  // Obtener la cita a editar utilizando el ID como clave
  const request = appointmentStore.get(id);

  request.onsuccess = function (e) {
    const appointmentToEdit = e.target.result;

    if (appointmentToEdit) {
      // rellenar los inputs con los valores actuales de la cita
      inputPatientName.value = appointmentToEdit.patientName;
      inputPatientAge.value = appointmentToEdit.patientAge;
      inputPatientPhone.value = appointmentToEdit.patientPhone;
      inputAppointmentDate.value = appointmentToEdit.date;
      inputAppointmentTime.value = appointmentToEdit.time;
      inputPatientSymptoms.value = appointmentToEdit.patientSymptoms;
      inputPatientDiagnosis.value = appointmentToEdit.patientDiagnosis;

      // rellenar el obj appointment con los valores de appointmentToEdit
      appointment.id = appointmentToEdit.id;
      appointment.patientName = appointmentToEdit.patientName;
      appointment.patientAge = appointmentToEdit.patientAge;
      appointment.patientPhone = appointmentToEdit.patientPhone;
      appointment.date = appointmentToEdit.date;
      appointment.time = appointmentToEdit.time;
      appointment.patientSymptoms = appointmentToEdit.patientSymptoms;
      appointment.patientDiagnosis = appointmentToEdit.patientDiagnosis;

      // modificar texto del button
      document.querySelector("#add-button").textContent = "Guardar Cambios";

      editMode = true;
    }
  };
}

//crear la base de datos indexDB
function createDB() {
  const dbName = "appointments";
  const dbVersion = 1;

  // crear la base de datos
  const openRequest = indexedDB.open(dbName, dbVersion);

  openRequest.onerror = function (e) {
    console.log("Error al abrir la base de datos ", e.target.errorCode);
  };

  openRequest.onsuccess = function (e) {
    DB = e.target.result;
    console.log("Base de datos abierta con éxito ", DB);
  };

  // definir estructura de la base de datos
  openRequest.onupgradeneeded = function (e) {
    const db = e.target.result;

    // definir "appointments" que es el equivalente a una tabla en bd relacionales
    const appointmentStore = db.createObjectStore("appointments", {
      keyPath: "id",
      autoIncrement: true,
    });

    // crear el equivalente a columnas de una tabla en bd relacionales
    appointmentStore.createIndex("id", "id", { unique: true });
    appointmentStore.createIndex("patientName", "patientName", { unique: false });
    appointmentStore.createIndex("patientAge", "patientAge", { unique: false });
    appointmentStore.createIndex("patientPhone", "patientPhone", { unique: false });
    appointmentStore.createIndex("date", "date", { unique: false });
    appointmentStore.createIndex("time", "time", { unique: false });
    appointmentStore.createIndex("patientSymptoms", "patientSymptoms", { unique: false });
    appointmentStore.createIndex("patientDiagnosis", "patientDiagnosis", { unique: false });
  };
}

export { readInputs, addAppointment, removeAppointment, editAppointment, createDB, DB };
