<script>
import { useAuthenticationStore } from "../services/authentication.store.js";

export default {
  name: "sign-up",
  data() {
    return {
      authenticationStore: useAuthenticationStore(),
      optionsRole: ["Client", "Bussiness"],
      // comunes
      email: "",
      password: "",
      role: "",

      // cliente
      firstName: "",
      lastName: "",
      phone: "",
      dni: "",
      address: "",
      city: "",
      birthDate: "",

      // business
      businessName: "",
      ruc: "",
      websiteUrl: "",
      phoneNumber: "",
      description: ""
    };
  },
  methods: {
    onSignUp() {
      if (this.role === "Client") {
        const clientData = {
          firstName: this.firstName,
          lastName: this.lastName,
          password: this.password,
          email: this.email,
          phone: this.phone,
          dni: this.dni,
          address: this.address,
          city: this.city,
          birthDate: this.birthDate,
          role: this.role
        };
        this.authenticationStore.signUp(clientData, this.$router);
      } else if (this.role === "Bussiness") {
        const businessData = {
          name: this.businessName,
          ruc: this.ruc,
          email: this.email,
          websiteUrl: this.websiteUrl,
          phoneNumber: this.phoneNumber,
          description: this.description,
          password: this.password,
          role: this.role
        };
        this.authenticationStore.signUp(businessData, this.$router);
      }
    },
    redirectToSignIn() {
      this.$router.push({ name: "sign-in" });
    }
  }
};
</script>

<template>
  <div class="flex align-items-center justify-content-center">
    <pv-card>
      <template #header>
        <h3>Sign Up</h3>
      </template>

      <template #content>
        <form @submit.prevent="onSignUp">
          <div class="p-fluid">

            <!-- Comunes -->
            <div class="flex gap-5">
              <div class="field mt-5">
                <pv-float-label>
                  <label for="email">Email</label>
                  <pv-input-text id="email" v-model="email" />
                </pv-float-label>
              </div>
              <div class="field mt-5">
                <pv-float-label>
                  <label for="password">Password</label>
                  <pv-input-text id="password" type="password" v-model="password" />
                </pv-float-label>
              </div>
            </div>

            <!-- Rol -->
            <div class="field mt-5">
              <label for="role">Role</label>
              <pv-select id="role" v-model="role" :options="optionsRole" placeholder="Select a Role" />
            </div>

            <!-- CLIENTE -->
            <div v-if="role === 'Client'">
              <div class="flex gap-5">
                <div class="field mt-5">
                  <pv-float-label>
                    <label for="firstName">First Name</label>
                    <pv-input-text id="firstName" v-model="firstName" />
                  </pv-float-label>
                </div>
                <div class="field mt-5">
                  <pv-float-label>
                    <label for="lastName">Last Name</label>
                    <pv-input-text id="lastName" v-model="lastName" />
                  </pv-float-label>
                </div>
              </div>
              <div class="flex gap-5">
                <div class="field mt-5">
                  <pv-float-label>
                    <label for="phone">Phone</label>
                    <pv-input-text id="phone" v-model="phone" />
                  </pv-float-label>
                </div>
                <div class="field mt-5">
                  <pv-float-label>
                    <label for="dni">DNI</label>
                    <pv-input-text id="dni" v-model="dni" />
                  </pv-float-label>
                </div>
              </div>
              <div class="flex gap-5">
                <div class="field mt-5">
                  <pv-float-label>
                    <label for="city">City</label>
                    <pv-input-text id="city" v-model="city" />
                  </pv-float-label>
                </div>
                <div class="field mt-5">
                  <pv-float-label>
                    <label for="address">Address</label>
                    <pv-input-text id="address" v-model="address" />
                  </pv-float-label>
                </div>
              </div>
              <div class="field mt-5">
                <label>Birth Date</label>
                <pv-datepicker v-model="birthDate" showIcon iconDisplay="input" />
              </div>
            </div>

            <!-- BUSINESS -->
            <div v-else-if="role === 'Bussiness'">
              <div class="field mt-5">
                <pv-float-label>
                  <label for="businessName">Business Name</label>
                  <pv-input-text id="businessName" v-model="businessName" />
                </pv-float-label>
              </div>
              <div class="field mt-5">
                <pv-float-label>
                  <label for="ruc">RUC</label>
                  <pv-input-text id="ruc" v-model="ruc" />
                </pv-float-label>
              </div>
              <div class="field mt-5">
                <pv-float-label>
                  <label for="websiteUrl">Website URL</label>
                  <pv-input-text id="websiteUrl" v-model="websiteUrl" />
                </pv-float-label>
              </div>
              <div class="field mt-5">
                <pv-float-label>
                  <label for="phoneNumber">Phone Number</label>
                  <pv-input-text id="phoneNumber" v-model="phoneNumber" />
                </pv-float-label>
              </div>
              <div class="field mt-5">
                <pv-float-label>
                  <label for="description">Description</label>
                  <pv-input-text id="description" v-model="description" />
                </pv-float-label>
              </div>
            </div>

            <!-- Botones -->
            <div class="p-field mt-5 flex justify-content-around">
              <pv-button type="button" severity="secondary" @click="redirectToSignIn">Sign In</pv-button>
              <pv-button type="submit">Sign Up</pv-button>
            </div>

          </div>
        </form>
      </template>
    </pv-card>
  </div>
</template>

<style scoped></style>
