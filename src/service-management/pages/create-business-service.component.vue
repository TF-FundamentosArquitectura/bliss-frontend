<script>
import { defaultBusinessId, defaultClientId } from "../../router/index.js";
import { ServiceApiService } from "../services/service-api.service.js";
import { CategoryApiService } from "../services/category-api.service.js";

export default {
  name: "create-business-service",
  data() {
    return {
      serviceName: null,
      price: null,
      description: null,
      selectedCategory: null,
      categories: [],
      specialists: [
        { name: '' }
      ],
      imageUrl: "", // Nuevo campo para el URL de la imagen
      duration: null, // Nuevo campo para duración
    }
  },
  methods: {
    getRandomInt(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min;

    },
    addSpecialistField() {
      this.specialists.push({ name: '' });
    },
    removeSpecialistField(index) {
      this.specialists.splice(index, 1);
    },
    async createService() {
      const serviceData = {
        companyId: defaultBusinessId,
        categoryId: this.selectedCategory ? parseInt(this.selectedCategory.name) : null,
        name: this.serviceName,
        description: this.description,
        price: this.price,
        duration: this.duration || this.getRandomInt(40, 120), // Usa duración ingresada o aleatoria
        imageUrl: this.imageUrl || "https://res.cloudinary.com/dbdoazcrx/image/upload/v1727333993/ulxogsmo1ynfnaxxmxiv.webp",
        specialist: this.specialists.map(s => s.name).filter(n => n.trim() !== '')
      };
      try {
        const serviceApiService = new ServiceApiService();
        console.log('Service Data:', serviceData);
        const response = await serviceApiService.createService(serviceData);
        this.$toast.add({
          severity: 'success',
          summary: 'Service Created',
          detail: 'Your services has been created successfully.',
          life: 3000
        });
        this.$router.push({ name: 'BusinessMyServices', params: { id: defaultClientId } });
      } catch (error) {
        this.$toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'There was an error creating the services.',
          life: 3000
        });
      }
    },
    async fetchCategories() {
      const categoriesApiService = new CategoryApiService();
      try {
        let response = await categoriesApiService.getCategories();
        this.categories = response.data.map(category => ({
          cname: category.name,
          name: category.id
        }));
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    },
  },
  created() {
    this.fetchCategories()
  }
}
</script>

<template>
  <div style="margin-top: 40px">
    <div class="grid nested-grid" style="display: flex; justify-content: center;">
      <div class="col-4">
        <div class="grid" style="width: fit-content;">
          <div class="col-12" style="width: fit-content;">
            <pv-card class="w-auto p-5 custom-card-1" style="max-width: 400px">
              <template #header>
                <div>
                  <i class="pi pi-credit-card" style="font-size: 5rem" />
                </div>
                <p style="font-weight: bold">{{ $t('createBusinessText.workAtTheSpeed') }}</p>
              </template>
              <template #content style="padding: 0">
                <p>{{ $t('createBusinessText.gradualAccumulation') }}</p>
              </template>
              <template #footer>
                <pv-button icon="pi pi-angle-right" icon-pos="right" :label="$t('createBusinessText.learnMore')"
                  severity="secondary" class="bg-white-alpha-10" style="color: #37123C" />
              </template>
            </pv-card>
          </div>
          <div class="col-12" style="width: fit-content;">
            <pv-card class="w-auto p-5 custom-card-2" style="max-width: 400px">
              <template #header>
                <div>
                  <i class="pi pi-credit-card" style="font-size: 5rem" />
                </div>
                <p>{{ $t('createBusinessText.workAtTheSpeed') }}</p>
              </template>
              <template #content>
                <p>{{ $t('createBusinessText.gradualAccumulation') }}</p>
              </template>
              <template #footer>
                <pv-button icon="pi pi-angle-right" icon-pos="right" :label="$t('createBusinessText.learnMore')"
                  severity="secondary" class="bg-white-alpha-10" style="color: #37123C" />
              </template>
            </pv-card>
          </div>
        </div>
      </div>
      <div class="col-8" style="width: fit-content;">
        <pv-card class="p-5 custom-card-3 bg-gray-50" style="max-width: 700px">
          <template #header>
            <div>
              <h2 class="title">{{ $t('createBusinessService.title') }}</h2>
            </div>
          </template>
          <template #content>
            <div style="text-align: left">
              <h2 style="font-weight: normal;">{{ $t('createBusinessService.serviceName') }}</h2>
              <pv-input-text type="text" v-model="serviceName" :placeholder="$t('createBusinessText.nameYourService')"
                style="width: 100%" class="custom-text-input" />
            </div>
            <div style="text-align: left">
              <h2 style="font-weight: normal;">{{ $t('createBusinessService.categories') }}</h2>
              <pv-cascade-select v-model="selectedCategory" :options="categories" optionLabel="cname"
                optionGroupLabel="name" optionGroupChildren="children"
                :placeholder="$t('createBusinessText.selectCategory')" style="width: 100%"
                class="custom-cascade-select" />
            </div>
            <div style="text-align: left; margin-top: 20px">
              <h2 style="font-weight: normal;">{{ $t('createBusinessService.specialists') }}</h2>
              <div v-for="(specialist, index) in specialists" :key="index" class="flex items-center gap-3 mb-2">
                <pv-input-text v-model="specialist.name" :placeholder="$t('createBusinessText.enterSpecialistName')"
                  style="flex: 1;" class="custom-text-input" />
                <pv-button v-if="specialists.length > 1" icon="pi pi-times" @click="removeSpecialistField(index)"
                  severity="danger" rounded outlined />
              </div>
              <pv-button icon="pi pi-plus" @click="addSpecialistField" severity="secondary" rounded outlined
                class="mt-2" />
            </div>
            <div style="text-align: left">
              <h2 style="font-weight: normal;">{{ $t('createBusinessService.upload') }}</h2>
              <pv-input-text
                v-model="imageUrl"
                :placeholder="$t('createBusinessText.enterImageUrl')"
                style="width: 100%"
                class="custom-text-input"
              />
              <div v-if="imageUrl" style="margin-top: 10px;">
                <img :src="imageUrl" alt="Vista previa" style="max-width: 100%; max-height: 200px; border-radius: 8px;" />
              </div>
            </div>
            <div style="text-align: left">
              <h2 style="font-weight: normal;">Duración (minutos)</h2>
              <pv-input-number v-model="duration" :min="1" :max="600" :step="1"
                :placeholder="'Ingrese la duración en minutos'" style="width: 100%" />
            </div>
            <div style="text-align: left">
              <h2 style="font-weight: normal;">{{ $t('createBusinessService.price') }}</h2>
              <pv-input-number v-model="price" inputId="currency-us" :min="0" mode="currency" currency="USD"
                locale="en-US" fluid :placeholder="$t('createBusinessText.setPrice')" />
            </div>
            <div style="text-align: left">
              <h2 style="font-weight: normal;">{{ $t('createBusinessService.description') }}</h2>
              <pv-textarea v-model="description" rows="10" cols="75"
                style="background-color: white; color: black; width: 100%"
                :placeholder="$t('createBusinessText.addDescription')" />
            </div>
          </template>
          <template #footer>
            <pv-button :label="$t('createBusinessService.createService')" class="mt-5"
              style="background-color: #37123C; color: white" @click="createService" />
          </template>
        </pv-card>
      </div>
    </div>
  </div>
</template>

<style scoped>
.title {
  font-family: 'Tajawal', sans-serif;
  font-weight: normal;
  font-size: 3rem;
  margin-top: 0;
  margin-bottom: 10px;
}

.custom-card-1 {
  font-family: 'Montserrat', sans-serif;
  color: #37123C;
  background: #D5CAF0;
}

.custom-card-2 {
  font-family: 'Montserrat', sans-serif;
  color: #37123C;
  background: #D9D9D9;
}

.custom-card-3 {
  font-family: 'Montserrat', sans-serif;
  color: #37123C;
}

.custom-text-input {
  background-color: #ffffff;
  color: black;
}

.custom-cascade-select {
  background-color: #ffffff;
}
</style>