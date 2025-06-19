<script>
import { ServiceApiService } from "../../service-management/services/service-api.service.js";
import { CompanyDetailApiService } from "../services/company-detail-api.service.js";
import { ReviewApiService } from "../../review/services/review.service.js";

export default {
  name: "company-detail-profile",
  data() {
    return {
      services: [],
      company: null,
      avgRating: null,
      reviews: [],
    };
  },
  props: {
    companyId: {
      type: Number,
      required: false,
    },
  },
  methods: {
    async fetchCompanyDetail() {
      const companyDetailApiService = new CompanyDetailApiService();
      const serviceApiService = new ServiceApiService();
      const reviewApiService = new ReviewApiService();

      try {
        const id = this.companyId || this.$route.params.id;
        if (!id) {
          console.error("No company id provided");
          return;
        }

        const companyResponse = await companyDetailApiService.getCompaniesById(id);
        this.company = companyResponse.data;

        const servicesResponse = await serviceApiService.getServices();
        // Filtrar solo los servicios de la compañía actual
        this.services = servicesResponse.data.filter(service => {
          // service.company puede ser objeto o id
          if (service.company && typeof service.company === 'object' && service.company.id !== undefined) {
            return service.company.id === this.company.id;
          } else if (typeof service.company === 'number' || typeof service.company === 'string') {
            return String(service.company) === String(this.company.id);
          }
          return false;
        });

        const reviewsResponse = await reviewApiService.getReviewsByCompanyId(id);
        this.reviews= reviewsResponse.data;
        console.log(this.reviews);

        if (this.reviews.length > 0) {
          const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
          this.avgRating = (totalRating / this.reviews.length).toFixed(2);
        } else {
          this.avgRating = "Not rated yet";
        }
      } catch (error) {
        console.error("Error loading data:", error);
      }
    }
  },
  created() {
    this.fetchCompanyDetail();
  },
};
</script>

<template>
  <div v-if="company" class="profile-container">
    <!-- Card Company -->
    <div class="company-card-wrapper">
      <pv-card class="company-card p-shadow-4">
        <template #header>
          <h1 class="company-title">{{ company.name }}</h1>
        </template>
        <template #content>
          <div class="company-content">
            <div class="image-container">
              <img :src="company.img" alt="Company Image" class="company-img" />
            </div>
            <div class="info-description-container">
              <div class="info-container">
                <p><i class="fa fa-id-card icon"></i> <strong>{{ $t('companyDetail.ruc') }}:</strong> {{ company.ruc }}</p>
                <p><i class="fa fa-envelope icon"></i> <strong>{{ $t('companyDetail.email') }}:</strong> {{ company.email }}</p>
                <p><i class="fa fa-globe icon"></i> <strong>{{ $t('companyDetail.website') }}:</strong>
                  <a :href="company.websiteUrl" target="_blank" class="company-link"> {{ company.websiteUrl }}</a>
                </p>
                <p><i class="fa fa-star icon"></i> <strong>{{ $t('companyDetail.averageRating') }}:</strong> {{ avgRating }}</p>
              </div>
              <div class="description-container">
                <p><strong>{{ $t('companyDetail.description')}}</strong></p>
                <p>{{ company.description }}</p>
              </div>
            </div>
          </div>
        </template>
      </pv-card>
    </div>

    <!-- Card Service -->
    <div class="section">
      <h2 class="section-title">{{ $t('servicesHome.services') }}:</h2>
      <div class="service-cards">
        <div v-for="service in services" :key="service.id" class="service-card-outer">
          <pv-card class="service-card p-shadow-4">
            <template #header>
              <div class="service-img-container">
                <img :src="service.imgUrl" alt="Service Image" class="service-img" />
              </div>
            </template>
            <template #title>
              <span class="service-title">{{service.name}}</span>
            </template>
            <template #content>
              <p class="service-name"><strong>{{ $t('servicesHome.name')}}:</strong> {{service.name}}</p>
              <p class="service-description">{{ service.description }}</p>
            </template>
          </pv-card>
        </div>
      </div>
    </div>

    <!-- card Reviews -->
    <div class="section">
      <h2 class="section-title">Reviews:</h2>
      <div class="review-cards">
        <div v-for="review in reviews" :key="review.id" class="review-card-outer">
          <pv-card class="review-card p-shadow-4">
            <template #content>
              <div class="review-content">
                <div class="review-rating">
                  <i class="fa fa-star review-star"></i> <span>{{ review.rating }}</span>
                </div>
                <p class="review-comment"><i class="fa fa-comment icon"></i> <strong>Comentario:</strong> {{ review.comments }}</p>
                <p class="review-date"><i class="fa fa-calendar icon"></i> <strong>Fecha:</strong> {{review.appointment.reservationDate }} </p>
              </div>
            </template>
          </pv-card>
        </div>
      </div>
    </div>
  </div>
  <p v-else class="not-found">{{ $t('companyDetail.companyNotFound') }}</p>
</template>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');

.profile-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
  padding: 40px 0 60px 0;
  background: linear-gradient(120deg, #f8f7fa 60%, #e0c3fc 100%);
  min-height: 100vh;
}

.company-card-wrapper {
  width: 100%;
  max-width: 900px;
  display: flex;
  justify-content: center;
}

.company-card {
  background: #fff;
  border-radius: 20px;
  border: 1.5px solid #b39de7;
  overflow: hidden;
  transition: box-shadow 0.2s, transform 0.2s;
  box-shadow: 0 6px 24px 0 rgba(55,18,60,0.10);
  padding-bottom: 16px;
}

.company-card:hover {
  box-shadow: 0 12px 32px 0 rgba(55,18,60,0.18);
  transform: translateY(-2px) scale(1.01);
}

.company-title {
  color: #6b5b95;
  font-size: 2.2rem;
  font-weight: 700;
  margin: 24px 0 10px 0;
  text-align: center;
  letter-spacing: 0.02em;
}

.company-content {
  display: flex;
  flex-direction: row;
  gap: 32px;
  align-items: flex-start;
  padding: 24px 18px 0 18px;
}

.image-container {
  min-width: 180px;
  max-width: 220px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
}

.company-img {
  width: 180px;
  height: 180px;
  object-fit: cover;
  border-radius: 16px;
  border: 2.5px solid #b39de7;
  background: #f7f7fa;
  margin-bottom: 10px;
  box-shadow: 0 2px 12px 0 rgba(55,18,60,0.10);
}

.info-description-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.info-container {
  background: #f5fefe;
  border-radius: 12px;
  padding: 18px 22px;
  margin-bottom: 8px;
  box-shadow: 0 2px 8px 0 rgba(55,18,60,0.06);
  color: #37123C;
  font-size: 1.08rem;
}

.icon {
  color: #b39de7;
  margin-right: 7px;
}

.company-link {
  color: #6b5b95;
  text-decoration: underline;
  transition: color 0.18s;
}
.company-link:hover {
  color: #37123C;
}

.description-container {
  background: #f8f7fa;
  border-radius: 12px;
  padding: 16px 20px;
  color: #444;
  font-size: 1.05rem;
  box-shadow: 0 1px 4px 0 rgba(55,18,60,0.04);
}

.section {
  width: 100%;
  max-width: 1100px;
  margin: 0 auto 32px auto;
}

.section-title {
  color: #6b5b95;
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 18px;
  text-align: center;
  letter-spacing: 0.01em;
}

.service-cards {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  justify-content: center;
}

.service-card-outer {
  display: flex;
  justify-content: center;
}

.service-card {
  background: #fff;
  border-radius: 16px;
  border: 1.5px solid #b39de7;
  width: 320px;
  min-height: 320px;
  transition: box-shadow 0.18s, transform 0.18s;
  box-shadow: 0 4px 18px 0 rgba(55,18,60,0.08);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}
.service-card:hover {
  box-shadow: 0 8px 28px 0 rgba(55,18,60,0.15);
  transform: translateY(-2px) scale(1.01);
}

.service-img-container {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f7f7fa;
  padding: 12px 0;
}

.service-img {
  width: 90%;
  height: 160px;
  object-fit: cover;
  border-radius: 12px;
  border: 2px solid #ececec;
  background: #f7f7fa;
}

.service-title {
  color: #37123C;
  font-size: 1.18rem;
  font-weight: 600;
  margin-bottom: 4px;
  display: block;
  text-align: center;
}

.service-name {
  color: #6b5b95;
  font-weight: 500;
  margin-bottom: 4px;
}

.service-description {
  color: #444;
  font-size: 1.01rem;
}

.review-cards {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  justify-content: center;
}

.review-card-outer {
  display: flex;
  justify-content: center;
}

.review-card {
  background: #fff;
  border-radius: 16px;
  border: 1.5px solid #b39de7;
  width: 320px;
  min-height: 120px;
  transition: box-shadow 0.18s, transform 0.18s;
  box-shadow: 0 4px 18px 0 rgba(55,18,60,0.08);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding: 18px 18px 12px 18px;
}
.review-card:hover {
  box-shadow: 0 8px 28px 0 rgba(55,18,60,0.15);
  transform: translateY(-2px) scale(1.01);
}

.review-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.review-rating {
  color: #43aa8b;
  font-size: 1.15rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
}

.review-star {
  color: #ffd700;
  font-size: 1.2em;
}

.review-comment {
  color: #37123C;
  font-size: 1.05rem;
}

.review-date {
  color: #6b5b95;
  font-size: 0.98rem;
}

.not-found {
  color: #c1121f;
  font-size: 1.2rem;
  text-align: center;
  margin-top: 40px;
}

@media (max-width: 1000px) {
  .company-content {
    flex-direction: column;
    align-items: center;
    gap: 18px;
  }
  .info-description-container {
    width: 100%;
    gap: 12px;
  }
  .image-container {
    max-width: 100%;
    margin-bottom: 10px;
  }
}
</style>