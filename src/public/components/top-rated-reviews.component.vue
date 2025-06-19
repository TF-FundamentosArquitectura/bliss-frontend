<script>
import { ReviewApiService } from "../../review/services/review.service.js";

export default {
  name: "top-rated-reviews",
  data() {
    return {
      topRatedReviews: [],
      loading: false,
      error: null
    };
  },
  methods: {
    async loadTopRatedReviews() {
      const reviewApiService = new ReviewApiService();
      this.loading = true;
      this.error = null;
      try {
        const reviewsResponse = await reviewApiService.getReviews();
        const reviews = reviewsResponse.data;

        const sortedReviews = reviews.sort((a, b) => b.rating - a.rating);
        const topReviews = sortedReviews.slice(0, 5);

        this.topRatedReviews = topReviews.map((review) => {
          const userImage = review.imageUrl || "";
          const comment = review.comments || "";
          const appointment = review.appointment || {};
          const serviceName = appointment.serviceName || "";
          const companyName = appointment.companyName || "";
          const reservationStartTime = appointment.reservationStartTime || "";
          return {
            ...review,
            userImage,
            comment,
            serviceName,
            companyName,
            reservationStartTime
          };
        });
      } catch (error) {
        this.error = "Error loading top rated reviews";
        console.error("Error loading top rated reviews:", error);
      } finally {
        this.loading = false;
      }
    },
    getStars(rating) {
      return "★".repeat(rating) + "☆".repeat(5 - rating);
    }
  },
  mounted() {
    this.loadTopRatedReviews();
  }
};
</script>

<template>
  <div class="top-rated-reviews-container">
    <h2 class="p-text-center title">{{ $t('topRatedReviews.title') }}</h2>
    <div v-if="loading" class="loading">{{ $t('loading') }}</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else class="reviews-content">
      <div v-if="topRatedReviews.length === 0" class="no-reviews">
        {{ $t('topRatedReviews.noReviews') }}
      </div>
      <div v-else v-for="review in topRatedReviews" :key="review.id" class="review-card">
        <pv-card class="p-shadow-4">
          <template #content>
            <div class="p-card-content p-text-center content-text">
              <div class="user-image-container">
                <img
                  v-if="review.userImage"
                  :src="review.userImage"
                  alt="User Image"
                  class="user-image"
                />
                <div v-else class="user-image-placeholder">
                  <span>👤</span>
                </div>
              </div>
              <div class="appointment-info">
                <div v-if="review.serviceName"><b>Servicio:</b> {{ review.serviceName }}</div>
                <div v-if="review.companyName"><b>Empresa:</b> {{ review.companyName }}</div>
              </div>
              <div class="stars">{{ getStars(review.rating) }}</div>
              <p class="review-comment">
                "{{ review.comment || 'Sin comentario disponible' }}"
              </p>
            </div>
          </template>
        </pv-card>
      </div>
    </div>
  </div>
</template>

<style scoped>
.top-rated-reviews-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.reviews-content {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: center;
}
.p-shadow-4 {
  background: #FFFFFF;
}
.review-card {
  width: 22rem;
  min-height: 14rem;
  overflow: hidden;
  margin: 1rem;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
  transition: transform 0.2s;
}
.review-card:hover {
  transform: translateY(-4px) scale(1.03);
}
.content-text {
  color: #222;
}
.p-text-center {
  text-align: center;
  color: #000000;
  margin-bottom: 16px;
}
.title {
  font-size: 2.5rem;
  text-decoration: underline;
  margin-bottom: 1.5rem;
}
.stars {
  color: #FFD700;
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}
.user-image-container {
  display: flex;
  justify-content: center;
  margin-bottom: 0.5rem;
}
.user-image {
  width: 64px;
  height: 64px;
  object-fit: cover;
  border-radius: 50%;
  border: 2px solid #eee;
}
.user-image-placeholder {
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #eee;
  border-radius: 50%;
  font-size: 2rem;
  margin-bottom: 0.5rem;
}
.user-name {
  font-weight: bold;
  margin-bottom: 0.5rem;
}
.review-comment {
  font-style: italic;
  margin: 0.5rem 0;
}
.loading, .error, .no-reviews {
  text-align: center;
  font-size: 1.2rem;
  margin: 2rem 0;
}
.appointment-info {
  margin-bottom: 0.5rem;
  font-size: 1rem;
  color: #444;
}
</style>