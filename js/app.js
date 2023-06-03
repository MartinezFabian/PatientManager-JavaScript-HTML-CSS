// clases

class AppointmentManager {
  #appointments;

  constructor() {
    this.#appointments = [];
  }

  get appointments() {
    return this.#appointments;
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
    e.preventDefault();

    const { patientName, patientAge, patientPhone, date, time, patientSymptoms, patientDiagnosis } =
      appointment;

    // validar

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
    } else if (isNaN(patientPhone) || patientPhone.length < 7) {
      UserInterface.showAlert("El número de teléfono ingresado no es válido", "error");
      return;
    }
  }
}
