import {
  form,
  inputPatientName,
  inputPatientAge,
  inputPatientPhone,
  inputAppointmentDate,
  inputAppointmentTime,
  inputPatientSymptoms,
  inputPatientDiagnosis,
  appointmentList,
} from "../utils/selectors.js";

import {
  readInputs,
  addAppointment,
  removeAppointment,
  editAppointment,
  createDB,
} from "../utils/appointmentFunctions.js";

import { UserInterface } from "./UserInterface.js";

class App {
  constructor() {
    this.initApp();
  }

  initApp() {
    createDB(); // crear base de datos indexDB

    // verificar si la base de datos "appointments" con la versión 1 está abierta en el navegador
    if (window.indexedDB.open("appointments", 1)) {
      // cargar citas en el HTML
      UserInterface.ShowAppointmentsInHTML();
    }

    inputPatientName.addEventListener("input", readInputs);
    inputPatientAge.addEventListener("input", readInputs);
    inputPatientPhone.addEventListener("input", readInputs);
    inputAppointmentDate.addEventListener("input", readInputs);
    inputAppointmentTime.addEventListener("input", readInputs);
    inputPatientSymptoms.addEventListener("input", readInputs);
    inputPatientDiagnosis.addEventListener("input", readInputs);

    form.addEventListener("submit", addAppointment);

    appointmentList.addEventListener("click", (e) => {
      if (e.target.id === "remove-button") {
        //obtener el <li></li> de la cita
        const appointment = e.target.parentElement.parentElement;

        //llamamos a removeAppointment con el id del elemento a eliminar
        removeAppointment(Number(appointment.dataset.id));
      } else if (e.target.id === "edit-button") {
        //obtener el <li></li> de la cita
        const appointment = e.target.parentElement.parentElement;

        //llamamos a editAppointment con el id del elemento a editar
        editAppointment(Number(appointment.dataset.id));
      }
    });
  }
}

export { App };
