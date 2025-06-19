<script>
import CompanyDetailProfile from "../components/company-detail-profile.component.vue";
import { CompanyDetailApiService } from "../services/company-detail-api.service.js";

export default {
  name: "company-detail-page",
  components: { CompanyDetailProfile },
  data() {
    return {
      companies: []
    };
  },
  async created() {
    const api = new CompanyDetailApiService();
    try {
      const response = await api.getCompanies();
      this.companies = response.data;
    } catch (e) {
      this.companies = [];
    }
  }
};
</script>

<template>
  <div>
    <company-detail-profile
      v-for="company in companies"
      :key="company.id"
      :companyId="company.id"
    />
  </div>
</template>

<style scoped>

</style>