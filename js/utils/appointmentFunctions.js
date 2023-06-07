import { UserInterface } from "../classes /UserInterface.js";
import { AppointmentManager } from "../classes /AppointmentManager.js";
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

const appointmentManager = new AppointmentManager();

let editMode = false;

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

    // creamos una copia del objeto appointment y llamar a editAppointment para editar
    appointmentManager.editAppointment({ ...appointment });

    // mostrar alerta
    UserInterface.showAlert("¡La cita fue editada con éxito!", "success");

    // modificar texto del button
    document.querySelector("#add-button").textContent = "Agregar cita";

    editMode = false;
  } else {
    // crear una nueva cita

    // generar un id único para la cita
    appointment.id = Date.now();

    // creamos una copia del objeto appointment y la agregamos al array appointments
    appointmentManager.addAppointment({ ...appointment });

    // mostrar alerta
    UserInterface.showAlert("¡La cita fue creada con éxito!", "success");
  }

  //mostrar citas en HTML
  UserInterface.ShowAppointmentsInHTML(appointmentManager.appointments);

  // reiniciar form
  form.reset();

  // reiniciar objeto appointment
  for (let key in appointment) {
    appointment[key] = "";
  }
}

function removeAppointment(id) {
  //eliminar cita del array
  appointmentManager.removeAppointment(id);

  //mostrar alerta
  UserInterface.showAlert("La cita se eliminó correctamente", "success");

  //actualizar citas en HTML
  UserInterface.ShowAppointmentsInHTML(appointmentManager.appointments);
}

function editAppointment(id) {
  // obtener cita a editar buscando por id
  const appointmentToEdit = appointmentManager.appointments.find(
    (appointment) => appointment.id === id
  );

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

export { readInputs, addAppointment, removeAppointment, editAppointment };
