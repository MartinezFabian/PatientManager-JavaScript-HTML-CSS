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

export { AppointmentManager };
