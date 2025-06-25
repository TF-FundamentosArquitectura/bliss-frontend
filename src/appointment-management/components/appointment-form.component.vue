<script>
import { Service } from "../../shared/model/service.entity.js";
import { defaultClientId } from "../../router/index.js";

export default {
  name: "appointment-form",
  components: {},
  props: {
    service: Service
  },
  data() {
    return {
      date: new Date(),
      time: new Date(),
      requirements: null,
      selectedSpecialist: null,
    }
  },
  methods: {
    buildAppointmentFromFormData() {
      let nowDate = new Date();
      nowDate = nowDate.toISOString();
      let bookingDate = this.date.toISOString();
      let bookingTime = `${this.time.getHours().toString().padStart(2, '0')}:${this.time.getMinutes().toString().padStart(2, '0')}`;
      return {
        userId: defaultClientId,
        serviceId: this.service.id,
        companyId: this.service.company.id,
        reservationDate: nowDate,
        status: "PENDING",
        date: bookingDate,
        time: bookingTime,
        requirements: this.requirements,
        specialist: this.selectedSpecialist
      };
    },
    emitBookingEvent() {
      let appointmentData = this.buildAppointmentFromFormData();
      console.log("Appointment to send:", appointmentData); // <-- Agregado para depuración
      this.$emit('booking-event', appointmentData);
    },
    confirmBooking() {
      this.$confirm.require({
        message: 'Are you sure u want to book ' + this.service.name + ' services ?',
        header: 'Confirmation',
        icon: 'pi pi-calendar-clock',
        rejectProps: {
          label: 'Cancel',
          severity: 'secondary',
          outlined: true
        },
        acceptProps: {
          label: 'Book'
        },
        accept: () => {
          this.emitBookingEvent()
        }
      });
    }
  }
}
</script>

<template>
  <pv-confirm-dialog />
  <pv-card>
    <template #title>
      Make An Appointment
    </template>
    <template #content>
      <div>
        <label class="font-bold block mb-2"> Any requirements? </label>
        <pv-textarea v-model="requirements" rows="6" cols="30" class="w-full" />
      </div>
      <div v-if="service && service.specialist?.length" class="mb-4">
        <label for="specialist" class="block mb-2 font-semibold">Choose a Specialist:</label>
        <select id="specialist" v-model="selectedSpecialist" class="p-2 border rounded w-full">
          <option disabled value="">-- Please select --</option>
          <option v-for="(spec, index) in service.specialist" :key="index" :value="spec">
            {{ spec }}
          </option>
        </select>
      </div>
      <div class="mt-5">
        <div class="flex-auto">
          <label class="font-bold block mb-2"> Select Date </label>
          <pv-datepicker v-model="date" readonly />
          <div class="card flex justify-center">
            <pv-datepicker v-model="date" inline showWeek class="w-full sm:w-[30rem]" />
          </div>
        </div>
        <div class="flex-auto">
          <label class="font-bold block mb-2"> Select Time </label>
          <pv-datepicker v-model="time" timeOnly readonly />
          <div class="card flex justify-center">
            <pv-datepicker v-model="time" inline timeOnly fluid class="w-full sm:w-[30rem]" />
          </div>
        </div>
      </div>
    </template>
    <template #footer>
      <pv-button label="Book Now" icon="pi pi-check" icon-pos="right" @click="confirmBooking()" />
    </template>
  </pv-card>
</template>

<style scoped></style>