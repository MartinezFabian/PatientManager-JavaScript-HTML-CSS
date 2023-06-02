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
  }

  function readInputs(e) {
    appointment[e.target.name] = e.target.value;

    console.log(appointment);
  }
}
