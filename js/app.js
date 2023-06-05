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

  removeAppointment(id) {
    this.#appointments = this.#appointments.filter((appointment) => appointment.id !== id);
  }

  editAppointment(newAppointment) {
    this.#appointments = this.#appointments.map((appointment) => {
      if (appointment.id === newAppointment.id) {
        return newAppointment;
      } else {
        return appointment;
      }
    });
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
  const inputPatientAge = document.querySelector("#patient-age");
  const inputPatientName = document.querySelector("#patient-name");
  const inputPatientPhone = document.querySelector("#patient-phone");
  const inputAppointmentDate = document.querySelector("#appointment-date");
  const inputAppointmentTime = document.querySelector("#appointment-time");
  const inputPatientSymptoms = document.querySelector("#patient-symptoms");
  const inputPatientDiagnosis = document.querySelector("#patient-diagnosis");
  const appointmentList = document.querySelector("#appointments");

  let editMode = false;

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
    for (key in appointment) {
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
}
