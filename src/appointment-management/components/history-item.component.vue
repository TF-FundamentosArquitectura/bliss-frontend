<script setup>
import {defineProps, ref, onMounted, watch } from 'vue';
import {useRouter} from 'vue-router';
import {Appointment} from '../model/appointment.entity.js';
import {Review} from '../../review/model/review.entity.js';
import {ReviewApiService} from '../../review/services/review.service.js';
import {HistoryApiService} from '../services/client-history.service.js';

const props = defineProps({
  appointment: {
    type: Appointment,
    required: true
  },
  review: {
    type: Review,
    required: false
  }
});

const router = useRouter();
const reviewApiService = new ReviewApiService();
const historyApiService = new HistoryApiService();
const serviceImage = ref('');
const hasReview = ref(false);

const fetchServiceDetails = async () => {
  try {
    const service = await historyApiService.getServiceById(props.appointment.service.id);
    serviceImage.value = service.img;
  } catch (error) {
    console.error('Error fetching services details:', error);
  }
};
const checkReviewExists = async () => {
  try {
    const reviewData = await reviewApiService.getReviewByAppointmentId(props.appointment.id);
    if (reviewData !== null) {
      hasReview.value = true;
    } else {
      hasReview.value = false;
    }
  } catch (error) {
    console.error('Error checking review existence:', error);
    hasReview.value = false;
  }
};

onMounted(() => {
  fetchServiceDetails();
  checkReviewExists();
});

const goToReviewPage = (appointmentId) => {
  router.push({name: 'ReviewManagementPage', params: {appointmentId}});
};

const deleteReview = async (reviewId) => {
  try {
    await reviewApiService.deleteReview(reviewId);
    props.appointment.review = null;
    hasReview.value = false;
  } catch (error) {
    console.error('Error deleting review:', error);
  }
};
watch(() => props.review, (newReview) => {
  hasReview.value = !!newReview;
});

// Helpers for formatting
function formatDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date)) return '';
  return date.toLocaleDateString();
}
function formatTime(timeStr) {
  if (!timeStr) return '';
  // If time is in format "HH:mm", just return it
  if (/^\d{2}:\d{2}$/.test(timeStr)) return timeStr;
  // If time is in ISO format, extract time
  const date = new Date(timeStr);
  if (isNaN(date)) return '';
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
</script>

<template>
  <div class="history-card" :class="appointment.status.toLowerCase()">
    <div class="card-header">
      <img v-if="serviceImage" :src="serviceImage" alt="Service Image" class="service-image"/>
      <div class="service-info">
        <h3 class="service-name">{{ appointment.service.serviceName }}</h3>
        <p class="company-name">
          <span class="icon"><i class="fa fa-building"></i></span>
          {{ appointment.company.name }}
        </p>
      </div>
    </div>
    <div class="history-content">
      <div class="info-row">
        <span class="icon"><i class="fa fa-calendar"></i></span>
        <span class="label">Fecha:</span>
        <span>{{ formatDate(appointment.date) }}</span>
      </div>
      <div class="info-row">
        <span class="icon"><i class="fa fa-info-circle"></i></span>
        <span class="label">Estado:</span>
        <span>
          <span class="status-badge" :class="appointment.status.toLowerCase()">
            {{ appointment.status }}
          </span>
        </span>
      </div>
      <div class="info-row">
        <span class="icon"><i class="fa fa-list"></i></span>
        <span class="label">Requerimientos:</span>
        <span>
          {{
            !appointment.requirements ||
            appointment.requirements.trim() === '' ||
            appointment.requirements.trim().toLowerCase() === 'string'
              ? 'Sin requerimientos'
              : appointment.requirements
          }}
        </span>
      </div>
    </div>
    <div class="card-actions">
      <button class="add-button" v-if="!hasReview" @click="goToReviewPage(appointment.id)">
        <i class="fa fa-star"></i> Agregar reseña
      </button>
      <div class="actions-buttons" v-if="hasReview">
        <button class="edit-button" @click="goToReviewPage(appointment.id)">
          <i class="fa fa-edit"></i> Editar reseña
        </button>
        <button class="delete-button" @click="deleteReview(review.id)">
          <i class="fa fa-trash"></i> Eliminar reseña
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');

.history-card {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  width: 100%;
  max-width: 400px;
  padding: 22px 24px 18px 0;
  border-radius: 16px;
  margin: 0 auto 24px;
  background: #fff;
  box-shadow: 0 4px 18px 0 rgba(55,18,60,0.08);
  border-left: 6px solid #6b5b95;
  transition: box-shadow 0.2s, transform 0.2s;
  position: relative;
}
.history-card.completed {
  border-left: 6px solid #43aa8b;
}
.history-card:hover {
  box-shadow: 0 8px 28px 0 rgba(55,18,60,0.15);
  transform: translateY(-2px) scale(1.01);
}

.card-header {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
.service-image {
  width: 70px;
  height: 70px;
  object-fit: cover;
  border-radius: 12px;
  margin-right: 18px;
  border: 2px solid #ececec;
  background: #f7f7fa;
}
.service-info {
  flex: 1;
}
.service-name {
  font-size: 1.25rem;
  color: #37123C;
  font-weight: 700;
  margin-bottom: 2px;
  letter-spacing: 0.01em;
}
.company-name {
  color: #6b5b95;
  font-size: 1.05rem;
  display: flex;
  align-items: center;
  gap: 6px;
}
.icon {
  color: #b2a4d4;
  margin-right: 5px;
  font-size: 1.1em;
  display: inline-flex;
  align-items: center;
}
.history-content {
  margin-bottom: 14px;
  padding-left: 10px;
}
.info-row {
  display: flex;
  align-items: center;
  margin-bottom: 7px;
  font-size: 1.04rem;
  color: #444;
  gap: 7px;
}
.label {
  font-weight: 500;
  color: #6b5b95;
  margin-right: 2px;
}
.status-badge {
  display: inline-block;
  padding: 2px 10px;
  border-radius: 12px;
  font-size: 0.98em;
  font-weight: 600;
  background: #e6f4ea;
  color: #43aa8b;
  letter-spacing: 0.02em;
  text-transform: capitalize;
}
.status-badge.completed {
  background: #e6f4ea;
  color: #43aa8b;
}
.status-badge.cancelled {
  background: #ffe6e6;
  color: #c1121f;
}
.status-badge.pending {
  background: #fffbe6;
  color: #e09f3e;
}

.card-actions {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 10px;
  width: 100%;
  margin-top: 6px;
}
.actions-buttons {
  display: flex;
  flex-direction: row;
  gap: 10px;
  width: 100%;
}
button {
  width: 100%;
  padding: 10px 0;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.18s, color 0.18s, transform 0.18s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
}
button:active {
  transform: scale(0.98);
}
.add-button {
  background: linear-gradient(90deg, #a1cfff 60%, #b2f5ea 100%);
  color: #004080;
}
.add-button:hover {
  background: linear-gradient(90deg, #b2f5ea 60%, #a1cfff 100%);
}
.edit-button {
  background: #e6f4ea;
  color: #007f5f;
}
.edit-button:hover {
  background: #b2f5ea;
  color: #004d40;
}
.delete-button {
  background: #ffccd5;
  color: #800020;
}
.delete-button:hover {
  background: #ffb3c1;
  color: #a4133c;
}
</style>