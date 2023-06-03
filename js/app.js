// clases

class AppointmentManager {
  #appointments;

  constructor() {
    this.#appointments = [];
  }

  get appointments() {
    return this.#appointments;
  }

  addAppointment(appointment) {
    this.#appointments.push(appointment);
  }
}

class UserInterface {
  static showAlert(message, type) {
    // comprobar si ya existe una alerta actualmente
    const alertExist = document.querySelector(".form__alert");

    if (alertExist) {
      return;
    }

    // crear alerta
    const alert = document.createElement("div");
    alert.classList.add("form__alert");

    if (type === "error") {
      alert.classList.add("form__alert--error");
    } else {
      alert.classList.add("form__alert--success");
    }

    //crear el texto de la alerta
    const alertText = document.createElement("P");
    alertText.textContent = message;
    alertText.classList.add("form__alert-text");

    //agregar el texto a la alerta
    alert.appendChild(alertText);

    //obtener el contenedor
    const container = document.querySelector(".main__patient");

    //agregar la alerta al contenedor
    container.appendChild(alert);

    //eliminar la alerta luego de 2 segundos
    setTimeout(() => {
      alert.remove();
    }, 2000);
  }

  static ShowAppointmentsInHTML(appointments) {
    const appointmentList = document.querySelector("#appointments");

    // limpiamos las citas actuales en el HTML para evitar duplicados
    UserInterface.clearHTML(appointmentList);

    // agregar citas al HTML

    appointments.forEach((appointment) => {
      const {
        id,
        patientName,
        patientAge,
        patientPhone,
        date,
        time,
        patientSymptoms,
        patientDiagnosis,
      } = appointment;

      appointmentList.insertAdjacentHTML(
        "afterbegin",
        `
          <li data-id="${id}" class="appointment">
            <h3 class="appointment__patient-name">${patientName}</h3>

            <p class="appointment__label">Edad</p>
            <p class="appointment__data">${patientAge}</p>

            <p class="appointment__label">Teléfono</p>
            <p class="appointment__data"> +${patientPhone}</p>

            <p class="appointment__label">Fecha de la cita</p>
            <p class="appointment__data">${date} a las ${time}</p>

            <p class="appointment__label">Síntomas</p>
            <p class="appointment__data"> ${patientSymptoms} </p>

            <p class="appointment__label">Diagnóstico</p>
            <p class="appointment__data"> ${patientDiagnosis} </p>

            <div class="appointment__btn">
              <button id="edit-button" class="btn btn--edit">Editar</button>
              <button id="remove-button" class="btn btn--remove">Eliminar</button>
            </div>
        </li>
      `
      );
    });
  }

  static clearHTML(appointmentList) {
    // mientras el elemento appointmentList tenga un primer hijo
    while (appointmentList.firstChild) {
      //eliminar el primer hijo del elemento appointmentList
      appointmentList.removeChild(appointmentList.firstChild);
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  main();
});

function main() {
  // variables/constantes
  const form = document.querySelector(".form");
  const inputPatientName = document.querySelector("#patient-name");
  const inputPatientAge = document.querySelector("#patient-age");
  const inputPatientPhone = document.querySelector("#patient-phone");
  const inputAppointmentDate = document.querySelector("#appointment-date");
  const inputAppointmentTime = document.querySelector("#appointment-time");
  const inputPatientSymptoms = document.querySelector("#patient-symptoms");
  const inputPatientDiagnosis = document.querySelector("#patient-diagnosis");
  const appointmentList = document.querySelector("#appointments");

  //objetos

  const appointment = {
    patientName: "",
    patientAge: "",
    patientPhone: "",
    date: "",
    time: "",
    patientSymptoms: "",
    patientDiagnosis: "",
  };

  const appointmentManager = new AppointmentManager();

  //funciones

  registerEventListeners();

  function registerEventListeners() {
    inputPatientName.addEventListener("input", readInputs);
    inputPatientAge.addEventListener("input", readInputs);
    inputPatientPhone.addEventListener("input", readInputs);
    inputAppointmentDate.addEventListener("input", readInputs);
    inputAppointmentTime.addEventListener("input", readInputs);
    inputPatientSymptoms.addEventListener("input", readInputs);
    inputPatientDiagnosis.addEventListener("input", readInputs);
    form.addEventListener("submit", addAppointment);
  }

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

    // generar un id único para la cita
    appointment.id = Date.now();

    // creamos una copia del objeto appointment y la agregamos al array appointments
    appointmentManager.addAppointment({ ...appointment });

    //mostrar citas en HTML
    UserInterface.ShowAppointmentsInHTML(appointmentManager.appointments);

    // mostrar alerta
    UserInterface.showAlert("¡La cita fue creada con éxito!", "success");

    // reiniciar form
    form.reset();

    // reiniciar objeto appointment
    for (key in appointment) {
      appointment[key] = "";
    }
  }
}
