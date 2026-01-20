<script setup>
import { onMounted, ref, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { apiGet, apiPost } from '@/helpers/axiosApi'
import { formatDate } from '@/helpers/axiosApi'

const route = useRoute()
const router = useRouter()

const id = ref(route.params.id)
const mentors = ref()
const mentoree = ref()
const map = ref()
const marker = ref()
const loading = ref()
const dejaAssociate = ref({ dejaAssocied: false })

const demandeOfMentor = ref()

const checkIdMentor = async () => {
  loading.value = true
  const response = await apiGet('https://mentormap.projet.sbs/public/api/v1/mentor/showmentor/' + id.value)
  mentors.value = response
  console.log('mentor.value: ', mentors.value)
  loading.value = false
}

const checkMentoree = async () => {
  loading.value = true

  const response = await apiGet('https://mentormap.projet.sbs/public/api/v1/mentoree/getmentoree')
  mentoree.value = response.data
  console.log('mentoree.value: ', mentoree.value)
  loading.value = false
}

const demandeMentor = (id) => {
  loading.value = true

  const response = apiPost('https://mentormap.projet.sbs/public/api/v1/mentoree/demandementor', {
    mentors_id: id,
    mentoree_id: mentoree.value.id,
  })
  demandeOfMentor.value = response
  console.log(' demandeOfMentor.value: ', demandeOfMentor.value)
  loading.value = false
}

const goBack = () => {
  router.push('/mentoree/profil')
}

const contactMentor = () => {
  alert('Demande de contact envoyée à ' + mentor.value.name)
}

const displayCArte = async () => {
  //loading.value = true

  await nextTick()
  map.value = L.map('map').setView([mentors.value.data.latitude, mentors.value.data.longitude], 8)

  marker.value = L.marker([mentors.value.data.latitude, mentors.value.data.longitude]).addTo(
    map.value,
  )
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map.value)
  // loading.value = false
}

/* Get if mentor deja associate mentoree */

const associate = async () => {
  loading.value = true

  const response = await apiGet(
    'https://mentormap.projet.sbs/public/api/v1/mentoree/associatementor/' + mentors.value.data.id,
  )
  dejaAssociate.value = response
  console.log('dejaAssociate.value: ', dejaAssociate.value)
  loading.value = false
}

onMounted(async () => {
  await checkIdMentor()
  await checkMentoree()
  displayCArte()
  await associate()
})
</script>

<template>
  <div id="global-loader" class="loader-overlay" v-if="loading">
    <div class="loader-spinner"></div>
  </div>

  <div class="mentor-profile-page" v-if="mentors">
    <!-- Header -->
    <header class="profile-header">
      <div class="container">
        <button @click="goBack" class="btn-back">
          <span>←</span>
          <span>Retour</span>
        </button>
        <div class="header-logo">
          <span class="logo-icon">🎓</span>
          <span class="logo-text">Mentor MAP</span>
        </div>
      </div>
    </header>

    <!-- Hero Profile Section -->
    <section class="hero-profile">
      <div class="container">
        <div class="hero-content">
          <div class="mentor-avatar-large">{{}}</div>
          <div class="hero-info">
            <h1 class="mentor-name-large" v-if="mentors">{{ mentors.data.name }}</h1>
            <p class="mentor-title">{{ mentors.data.name }}</p>
            <div class="hero-stats">
              <div class="stat-item">
                <span class="stat-icon">📍</span>
                <span>{{ mentors.data.ville }}</span>
              </div>
              <div class="stat-divider">•</div>
              <div class="stat-item">
                <span class="stat-icon">💼</span>
                <span>{{ mentors.data.experience_annees }} ans d'expérience</span>
              </div>
              <div class="stat-divider">•</div>
              <div class="stat-item">
                <span class="stat-icon">👥</span>
                <span>{{ mentors.numberMentoree }} mentorés</span>
              </div>
            </div>
            <div class="rating-large">
              <div class="stars">⭐⭐⭐⭐⭐</div>
              <span class="rating-value">{{ 4.5 }}/5</span>
              <span class="rating-count">({{ 32 }} avis)</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Main Content -->
    <div class="container main-content">
      <div class="content-grid">
        <!-- Colonne gauche -->
        <div class="left-column">
          <!-- À propos -->
          <div class="card">
            <h2 class="card-title">
              <span class="title-icon">👤</span>
              À propos
            </h2>
            <p class="bio-text">{{ mentors.data.bio }}</p>
          </div>

          <!-- Domaine de compétence -->
          <div class="card" v-if="mentors">
            <h2 class="card-title">
              <span class="title-icon">📅</span>
              Domaine de compétence
            </h2>
            <div class="availability-list">
              <div
                v-for="mentor in mentors.data.domaines"
                :key="mentors.data.id"
                class="availability-item"
              >
                <span class="day">{{ mentor.name }}</span>
                <span class="hours">{{ formatDate(mentor.created_at) }}</span>
              </div>
            </div>
          </div>

          <!-- Compétences  -->
          <div class="card" v-if="mentors">
            <h2 class="card-title">
              <span class="title-icon">🎯</span>
              Compétences
            </h2>
            <div style="display: flex">
              <div class="skills-grid" v-for="langage in mentors.data.langages">
                <span class="skill-badge" style="margin-right: 7px">
                  {{ langage.langage }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Colonne droite -->
        <div class="right-column">
          <!-- Card de réservation -->
          <div class="card booking-card">
            <div class="price-section">
              <div class="price">{{ mentors.data.tarif_horaire }} FCFA</div>
              <div class="price-label">par heure</div>
            </div>

            <div class="booking-info">
              <div class="info-item">
                <span class="info-icon">⏱️</span>
                <span>Session de 1h minimum</span>
              </div>
              <div class="info-item">
                <span class="info-icon">📱</span>
                <span>En ligne ou en présentiel</span>
              </div>
              <div class="info-item">
                <span class="info-icon">💳</span>
                <span>Paiement sécurisé</span>
              </div>
            </div>

            <button
              v-if="dejaAssociate"
              class="btn-contact-large"
              v-show="!dejaAssociate.dejaAssocied"
              @click.prevent="demandeMentor(mentors.data.id)"
            >
              <span></span>
              <span>Faire une demande</span>
            </button>
            <button @click="contactMentor" class="btn-secondary">
              <span class="btn-icon"></span>
              <span>Contacter le mentor</span>
            </button>
          </div>

          <!-- Localisation -->
          <div class="card">
            <h2 class="card-title">
              <span class="title-icon">📍</span>
              Localisation
            </h2>
            <div class="location-info">
              <div class="location-item">
                <span class="location-label">Ville</span>
                <span class="location-value">{{ mentors.data.ville }}</span>
              </div>
              <div class="location-item">
                <span class="location-label">Distance</span>
                <span class="location-value">{{ 225 }} km de vous</span>
              </div>
              <div class="map-placeholder">
                <div id="map" style="height: 100%"></div>
              </div>
            </div>
          </div>

          <!-- Garanties -->
          <div class="card guarantees-card">
            <h2 class="card-title">
              <span class="title-icon">✅</span>
              Nos garanties
            </h2>
            <div class="guarantees-list">
              <div class="guarantee-item">
                <span class="guarantee-icon">🛡️</span>
                <span>Profil vérifié</span>
              </div>
              <div class="guarantee-item">
                <span class="guarantee-icon">💯</span>
                <span>Satisfait ou remboursé</span>
              </div>
              <div class="guarantee-item">
                <span class="guarantee-icon">🔒</span>
                <span>Paiement sécurisé</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.mentor-profile-page {
  min-height: 100vh;
  background: #f8fafc;
}

/* Header */
.profile-header {
  background: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  padding: 20px 0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.profile-header .container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.btn-back {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f1f5f9;
  border: none;
  padding: 10px 20px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  color: #334155;
}

.btn-back:hover {
  background: #e2e8f0;
  transform: translateX(-4px);
}

.header-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.3rem;
  font-weight: 700;
  color: #2563eb;
}

.logo-icon {
  font-size: 1.8rem;
}

/* Hero Profile */
.hero-profile {
  background: linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #60a5fa 100%);
  padding: 60px 0;
  color: white;
}

.hero-content {
  display: flex;
  gap: 40px;
  align-items: center;
}

.mentor-avatar-large {
  width: 180px;
  height: 180px;
  background: white;
  color: #2563eb;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 5rem;
  font-weight: 700;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
  flex-shrink: 0;
}

.hero-info {
  flex: 1;
}

.verified-badge {
  display: inline-block;
  background: rgba(16, 185, 129, 0.9);
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 16px;
}

.mentor-name-large {
  font-size: 3rem;
  margin-bottom: 8px;
  font-weight: 800;
}

.mentor-title {
  font-size: 1.5rem;
  opacity: 0.95;
  margin-bottom: 24px;
}

.hero-stats {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.05rem;
}

.stat-icon {
  font-size: 1.3rem;
}

.stat-divider {
  opacity: 0.5;
}

.rating-large {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 1.1rem;
}

.stars {
  font-size: 1.5rem;
}

.rating-value {
  font-weight: 700;
  font-size: 1.3rem;
}

.rating-count {
  opacity: 0.9;
}

/* Main Content */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.main-content {
  padding: 40px 20px;
}

.content-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 30px;
  margin-bottom: 40px;
}

/* Cards */
.card {
  background: white;
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  margin-bottom: 24px;
}

.card-title {
  font-size: 1.5rem;
  color: #1e293b;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 700;
}

.title-icon {
  font-size: 1.8rem;
}

.bio-text {
  color: #475569;
  line-height: 1.8;
  font-size: 1.05rem;
}

/* Compétences */
.skills-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.skill-badge {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: white;
  padding: 10px 20px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.95rem;
}

/* Disponibilités */
.availability-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.availability-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #f8fafc;
  border-radius: 10px;
}

.day {
  font-weight: 600;
  color: #1e293b;
}

.hours {
  color: #64748b;
}

/* Langues */
.languages-list {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.language-badge {
  background: #f1f5f9;
  color: #334155;
  padding: 10px 20px;
  border-radius: 20px;
  font-weight: 600;
}

/* Booking Card */
.booking-card {
  position: sticky;
  top: 100px;
  border: 2px solid #e2e8f0;
}

.price-section {
  text-align: center;
  padding: 20px 0;
  border-bottom: 2px solid #f1f5f9;
  margin-bottom: 20px;
}

.price {
  font-size: 2.5rem;
  font-weight: 800;
  color: #2563eb;
  margin-bottom: 5px;
}

.price-label {
  color: #64748b;
  font-size: 1rem;
}

.booking-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #475569;
}

.info-icon {
  font-size: 1.3rem;
}

.btn-contact-large {
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, #2563eb, #1e40af);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 700;
  font-size: 1.1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 12px;
  transition: all 0.3s;
}

.btn-contact-large:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(37, 99, 235, 0.3);
}

.btn-contact-large:disabled {
  background-color: #c0c0c0; /* gris clair */
  cursor: not-allowed; /* indique que c’est désactivé */
  opacity: 0.7; /* légèrement transparent */
}

.btn-secondary {
  width: 100%;
  padding: 14px;
  background: white;
  color: #2563eb;
  border: 2px solid #2563eb;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s;
}

.btn-secondary:hover {
  background: #eff6ff;
}

.btn-icon {
  font-size: 1.3rem;
}

/* Localisation */
.location-info {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.location-item {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #f1f5f9;
}

.location-label {
  color: #64748b;
  font-weight: 500;
}

.location-value {
  color: #1e293b;
  font-weight: 600;
}

.map-placeholder {
  background: #f1f5f9;
  border-radius: 12px;
  height: 200px;
  z-index: 100000
  ;
}

.map-icon {
  font-size: 4rem;
  margin-bottom: 12px;
  opacity: 0.5;
}

/* Garanties */
.guarantees-card {
  background: linear-gradient(135deg, #f0fdf4, #dcfce7);
  border: 2px solid #86efac;
}

.guarantees-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.guarantee-item {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #166534;
  font-weight: 600;
}

.guarantee-icon {
  font-size: 1.5rem;
}

/* Reviews Section */
.reviews-section {
  margin-top: 40px;
}

.reviews-summary {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 40px;
  margin-bottom: 40px;
  padding-bottom: 30px;
  border-bottom: 2px solid #f1f5f9;
}

.summary-score {
  text-align: center;
}

.big-score {
  font-size: 4rem;
  font-weight: 800;
  color: #2563eb;
  margin-bottom: 12px;
}

.stars-large {
  font-size: 1.8rem;
  margin-bottom: 8px;
}

.reviews-count {
  color: #64748b;
  font-size: 1rem;
}

.rating-bars {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.rating-bar-item {
  display: grid;
  grid-template-columns: 80px 1fr 50px;
  align-items: center;
  gap: 16px;
}

.bar-label {
  color: #64748b;
  font-size: 0.95rem;
}

.bar {
  height: 10px;
  background: #f1f5f9;
  border-radius: 5px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #fbbf24, #f59e0b);
  border-radius: 5px;
}

.bar-count {
  color: #64748b;
  font-weight: 600;
  text-align: right;
}

/* Reviews List */
.reviews-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.review-item {
  padding: 24px;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.review-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.reviewer-avatar {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #2563eb, #1e40af);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 700;
  flex-shrink: 0;
}

.reviewer-info {
  flex: 1;
}

.reviewer-name {
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 4px;
}

.review-date {
  color: #64748b;
  font-size: 0.9rem;
}

.review-stars {
  font-size: 1.2rem;
}

.review-text {
  color: #475569;
  line-height: 1.7;
  font-size: 1.05rem;
}

/* Responsive */
@media (max-width: 1024px) {
  .content-grid {
    grid-template-columns: 1fr;
  }

  .booking-card {
    position: static;
  }

  .reviews-summary {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .hero-content {
    flex-direction: column;
    text-align: center;
  }

  .mentor-avatar-large {
    width: 140px;
    height: 140px;
    font-size: 4rem;
  }

  .mentor-name-large {
    font-size: 2rem;
  }

  .hero-stats {
    justify-content: center;
  }

  .card {
    padding: 20px;
  }
}
</style>
