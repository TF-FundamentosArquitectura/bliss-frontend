<script>
import LanguageSwitcher from "./language-switcher.component.vue";
import { defaultBusinessId } from '../../router/index.js';
import { useAuthenticationStore } from '../../iam/services/authentication.store.js';
export default {
  components: { LanguageSwitcher },
  data() {
    return {
      drawer: false,
    };
  },
  computed: {
    authStore() {
      return useAuthenticationStore();
    },
    userType() {
      return this.authStore.currentRole;
    },
    userId() {
      return this.authStore.currentUserId;
    },
    items() {
      if (this.userType === 'Client') {
        return [
          { label: this.$t('toolbar.home'), to: '/home' },
          { label: this.$t('toolbar.services'), to: '/client-services' },
          { label: this.$t('toolbar.schedule'), to: `/schedule/${this.userId}` },
          { label: this.$t('toolbar.myServices'), to: `/client-myservices/${this.userId}` }
        ];
      } else {
        return [
          { label: this.$t('toolbar.home'), to: '/homeBusiness' },
          // { label: this.$t('toolbar.myServices'), to: `/business-myservices/${this.userId}` },
          { label: this.$t('toolbar.myServicesBussiness'), to: `/business-my-services/${defaultBusinessId}` },
          // { label: this.$t('toolbar.schedule'), to: `/business-schedule/${this.userId}` }
          { label: this.$t('toolbar.schedule'), to: `/business-schedule/${this.userId}` }
        ];
      }
    }
  },
  methods: {
    toggleDrawer() {
      this.drawer = !this.drawer;
    },
    changeUserType(type) {
      this.userType = type;
    },
    handleLogout() {
      localStorage.removeItem('token');
      this.$router.push({ name: 'sign-in' });
    }
  }
};
</script>

<template>
  <header class="header-toolbar">
    <pv-toolbar style="padding: 5px; background-color: #D1E4FA; border-style: none;">
      <template #start>
        <div class="flex items-center gap-2">
          <div class="flex justify-content-center p-3 mr-8">
            <a style="font-family: 'Tajawal', sans-serif; color: #37123c; font-weight: bold; font-size: 30px">
              BLISS
            </a>
          </div>
        </div>
      </template>
      <template #center>
        <div class="flex items-center gap-2">
          <router-link v-for="item in items" :key="item.label" v-slot="{ navigate, href }" :to="item.to" custom>
            <pv-button :href="href" class="custom-button" @click="navigate" text plain>
              <p style="color: #37123c; margin:0;">{{ item.label }}</p>
            </pv-button>
          </router-link>
        </div>
      </template>
      <template #end>
        <pv-button class="custom-button" icon="pi pi-search" text style="color: #37123c" />
        <pv-button class="custom-button" icon="pi pi-shopping-cart" text style="color: #37123c" />
        <pv-button class="custom-button" icon="pi pi-heart" text style="color: #37123c" />
        <div class="flex items-center gap-3 m-2">
          <language-switcher />
          <button @click="handleLogout" style="background-color: #37123c; color:#D1E4FA;">{{ $t('toolbar.logout')
          }}</button>
        </div>
      </template>
    </pv-toolbar>
  </header>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@200;300;400;500;700;800;900&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&family=Tajawal:wght@200;300;400;500;700;800;900&display=swap');

.header-toolbar {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  height: 60px;
}

.custom-button:hover {
  background-color: #D1E4FA !important;
}

.custom-button {
  font-family: 'Montserrat', sans-serif;
  font-size: 15px;
}
</style>