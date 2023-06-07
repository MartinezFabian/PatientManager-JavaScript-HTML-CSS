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

export { UserInterface };
