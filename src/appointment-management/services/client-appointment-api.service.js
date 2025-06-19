import http from "../../shared/services/http-common.js";


export class ClientAppointmentApiService {

    /**
     * Get all appointments By user id
     * @returns {Promise<axios.AxiosResponse<any>>}
     */
    getAppointmentsByUserId(userId) {
        return http.get(`/appointments/${userId}`);
    }

    /**
     * Create an appointment
     * @param appointment
     */

    createAppointment(appointment) {
        console.log("POST /appointments payload:", appointment); // <-- Agregado para depuración
        return http.post('/appointments', appointment);
    }

}