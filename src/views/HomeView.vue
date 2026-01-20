<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Header from '@/components/Header.vue'


const adresse = ref()

const router = useRouter()
let coordonnee = ref(null)

const devenirMentor = () => {
  router.push('/mentor/register')
}
const map = ref(null)

onMounted(() => {

})


const chercherMentor = () => {
  router.push('mentoree/register')
}
</script>
<template>
  <div class="mentor-app">
    <div class="home-page">
      <Header titre="Mentor Map"></Header>
      <!-- Hero Section -->
      <section class="hero">
        <div class="container">
          <div class="hero-content">
            <h1 class="hero-title">Trouvez votre mentor idéal près de chez vous</h1>
            <p class="hero-subtitle">
              Connectez-vous avec des experts dans votre domaine et boostez votre carrière
            </p>

            <div class="hero-buttons">
              <button @click.prevent="chercherMentor" class="btn-hero btn-mentee">
                <span class="btn-icon"></span>
                <span>Trouver un mentor</span>
              </button>
              <button @click.prevent="devenirMentor()" class="btn-hero btn-mentor">
                <span class="btn-icon"></span>
                <span>Devenir mentor</span>
              </button>
            </div>
          </div>

          <div class="hero-image">
            <div class="illustration">🤝</div>
          </div>
        </div>
      </section>

      <section class="features">
        <div class="container">
          <h2 class="section-title">Comment ça marche ?</h2>
          <p class="section-subtitle">Trois étapes simples pour connecter mentors et mentorés</p>
          <div class="features-grid">
            <div class="feature-card">
              <div class="feature-icon">📍</div>
              <h3>Proximité</h3>
              <p>
                Trouvez des mentors près de chez vous grâce à notre système de géolocalisation
                avancé
              </p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">💼</div>
              <h3>Expertise</h3>
              <p>
                Choisissez parmi une large gamme de domaines professionnels adaptés à vos besoins
              </p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">⭐</div>
              <h3>Qualité</h3>
              <p>Consultez les avis et notations pour faire le meilleur choix de mentor</p>
            </div>
          </div>
        </div>
      </section>
    </div>

   
  </div>
  
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

ul{
  list-style: none;
}
a{
  text-decoration: none;
}
.mentor-app {
  /*min-height: 100vh;*/
  background: #f8f9fa;
}

/* Header */
.header {
  background: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 20px 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;

  justify-content: space-between;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.5rem;
  font-weight: 700;
  color: #2563eb;
}

.logo-icon {
  font-size: 2rem;
}

.nav {
  display: flex;
  gap: 15px;
  align-items: center;
}

.nav-link {
  background: none;
  border: none;
  color: #64748b;
  font-weight: 600;
  cursor: pointer;
  padding: 8px 16px;
  transition: color 0.3s;
}

.nav-link:hover {
  color: #2563eb;
}

.btn-primary {
  background: linear-gradient(135deg, #2563eb, #1e40af);
  color: white;
  border: none;
  padding: 10px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.3s;
}

.btn-primary:hover {
  transform: translateY(-2px);
}

/* Hero Section */
.hero {
  padding: 100px 0 120px;
  background: linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #60a5fa 100%);
  position: relative;
  overflow: hidden;
}

.hero::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
}

.hero .container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: center;
  position: relative;
  z-index: 1;
}

.hero-title {
  font-size: 3.5rem;
  color: white;
  margin-bottom: 24px;
  line-height: 1.2;
  font-weight: 800;
  text-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.hero-subtitle {
  font-size: 1.3rem;
  color: rgba(255, 255, 255, 0.95);
  margin-bottom: 48px;
  line-height: 1.6;
}

.hero-buttons {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.btn-hero {
  padding: 18px 36px;
  border-radius: 16px;
  border: none;
  font-size: 1.15rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  position: relative;
  overflow: hidden;
}

.btn-hero::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s;
}

.btn-hero:hover::before {
  left: 100%;
}

.btn-mentee {
  background: white;
  color: #1e40af;
}

.btn-mentor {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  border: 3px solid white;
}

.btn-hero:hover {
  transform: translateY(-6px) scale(1.02);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.25);
}

.btn-icon {
  font-size: 1.8rem;
}

.hero-image {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.illustration {
  font-size: 18rem;
  animation: float 4s ease-in-out infinite;
  filter: drop-shadow(0 20px 40px rgba(0, 0, 0, 0.3));
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0) rotate(-5deg);
  }
  50% {
    transform: translateY(-30px) rotate(5deg);
  }
}

/* Features */
.features {
  padding: 100px 0;
  background: #f8fafc;
}

.features .container {
  width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.section-title {
  text-align: center;
  font-size: 3rem;
  color: #1e293b;
  margin-bottom: 16px;
  font-weight: 800;
}

.section-subtitle {
  text-align: center;
  font-size: 1.2rem;
  color: #64748b;
  margin-bottom: 70px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;
  max-width: 1100px;
  margin: 0 auto;
}

.feature-card {
  text-align: center;
  padding: 50px 35px;
  background: white;
  border-radius: 24px;
  border: 2px solid #e2e8f0;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.feature-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 5px;
  background: linear-gradient(90deg, #2563eb, #10b981);
  transform: scaleX(0);
  transition: transform 0.4s;
}

.feature-card:hover::before {
  transform: scaleX(1);
}

.feature-card:hover {
  transform: translateY(-12px);
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.12);
  border-color: #2563eb;
}

.feature-icon {
  font-size: 5rem;
  margin-bottom: 24px;
  display: inline-block;
  transition: transform 0.4s;
}

.feature-card:hover .feature-icon {
  transform: scale(1.15) rotate(5deg);
}

.feature-card h3 {
  font-size: 1.8rem;
  color: #1e293b;
  margin-bottom: 16px;
  font-weight: 700;
}

.feature-card p {
  color: #64748b;
  line-height: 1.8;
  font-size: 1.05rem;
}

/* Auth Pages */
.auth-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  padding: 40px 20px;
}

.btn-back {
  background: white;
  border: 2px solid #e2e8f0;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 20px;
  transition: all 0.3s;
}

.btn-back:hover {
  border-color: #2563eb;
  color: #2563eb;
}

.auth-card {
  background: white;
  border-radius: 20px;
  padding: 40px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
}

.auth-title {
  font-size: 2rem;
  text-align: center;
  color: #1e293b;
  margin-bottom: 30px;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-weight: 600;
  color: #334155;
}

.form-input,
.form-textarea {
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #2563eb;
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
  font-family: inherit;
}

.btn-submit {
  background: linear-gradient(135deg, #2563eb, #1e40af);
  color: white;
  border: none;
  padding: 14px;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 10px;
  transition: transform 0.3s;
}

.btn-submit:hover {
  transform: translateY(-2px);
}

.auth-footer {
  text-align: center;
  margin-top: 20px;
  color: #64748b;
}

.link-btn {
  background: none;
  border: none;
  color: #2563eb;
  font-weight: 600;
  cursor: pointer;
  text-decoration: underline;
}

/* Dashboard */
.dashboard-header {
  background: linear-gradient(135deg, #2563eb, #1e40af);
  color: white;
  padding: 20px 0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.dashboard-header .logo {
  color: white;
}

.user-menu {
  display: flex;
  align-items: center;
  gap: 20px;
}

.user-name {
  font-weight: 600;
}

.btn-logout {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid white;
  padding: 8px 20px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-logout:hover {
  background: white;
  color: #2563eb;
}

.dashboard-content {
  padding: 40px 0;
}

.page-title {
  font-size: 2.5rem;
  color: #1e293b;
  margin-bottom: 40px;
}

/* Search Section */
.search-section {
  margin-bottom: 40px;
}

.search-card {
  background: white;
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.search-row {
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 20px;
  align-items: end;
}

.search-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.search-label {
  font-weight: 600;
  color: #334155;
}

.search-input {
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
}

.btn-search {
  background: linear-gradient(135deg, #2563eb, #1e40af);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: transform 0.3s;
}

.btn-search:hover {
  transform: translateY(-2px);
}

/* Mentors Grid */
.mentors-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 30px;
}

.mentor-card {
  background: white;
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  gap: 15px;
  transition: transform 0.3s;
}

.mentor-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.mentor-avatar {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #2563eb, #1e40af);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: 700;
  margin: 0 auto;
}

.mentor-name {
  font-size: 1.5rem;
  color: #1e293b;
  text-align: center;
}

.mentor-domain {
  color: #2563eb;
  font-weight: 600;
  text-align: center;
}

.mentor-location,
.mentor-distance,
.mentor-experience,
.mentor-price {
  color: #64748b;
  font-size: 0.95rem;
}

.mentor-rating {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.stars {
  color: #fbbf24;
}

.rating-count {
  color: #64748b;
  font-size: 0.9rem;
}

.btn-contact {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  border: none;
  padding: 12px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.3s;
}

.btn-contact:hover {
  transform: translateY(-2px);
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  margin-bottom: 40px;
}

.stat-card {
  background: white;
  border-radius: 16px;
  padding: 30px;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.stat-icon {
  font-size: 3rem;
  margin-bottom: 15px;
}

.stat-value {
  font-size: 2.5rem;
  font-weight: 700;
  color: #2563eb;
  margin-bottom: 10px;
}

.stat-label {
  color: #64748b;
  font-weight: 500;
}

/* Profile Card */
.profile-card {
  background: white;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  margin-bottom: 40px;
}

.profile-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 30px;
}

.profile-item {
  display: flex;
  gap: 10px;
}

.profile-label {
  font-weight: 600;
  color: #334155;
}

.profile-value {
  color: #64748b;
}

.profile-bio {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 30px;
}

.bio-text {
  color: #64748b;
  line-height: 1.6;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
}

.btn-edit-profile {
  background: linear-gradient(135deg, #2563eb, #1e40af);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.3s;
}

.btn-edit-profile:hover {
  transform: translateY(-2px);
}

/* Requests */
.requests-card {
  background: white;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.requests-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.request-item {
  display: flex;
  gap: 20px;
  align-items: center;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 12px;
}

.request-avatar {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 700;
  flex-shrink: 0;
}

.request-info {
  flex: 1;
}

.request-name {
  font-size: 1.2rem;
  color: #1e293b;
  margin-bottom: 8px;
}

.request-message {
  color: #64748b;
  margin-bottom: 5px;
}

.request-date {
  color: #94a3b8;
  font-size: 0.85rem;
}

.request-actions {
  display: flex;
  gap: 10px;
}

.btn-accept,
.btn-decline {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.3s;
}

.btn-accept {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
}

.btn-decline {
  background: #ef4444;
  color: white;
}

.btn-accept:hover,
.btn-decline:hover {
  transform: scale(1.05);
}

/* Empty States */
.empty-state {
  text-align: center;
  padding: 80px 20px;
}

.empty-icon {
  font-size: 5rem;
  margin-bottom: 20px;
  opacity: 0.5;
}

.empty-state h3 {
  font-size: 1.5rem;
  color: #1e293b;
  margin-bottom: 10px;
}

.empty-state p {
  color: #64748b;
}

.empty-state-small {
  text-align: center;
  padding: 40px;
  color: #64748b;
}

/* Responsive */
@media (max-width: 768px) {
  .hero .container {
    grid-template-columns: 1fr;
  }

  .illustration {
    font-size: 8rem;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }

  .search-row {
    grid-template-columns: 1fr;
  }

  .mentors-grid {
    grid-template-columns: 1fr;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .profile-grid {
    grid-template-columns: 1fr;
  }

  .request-item {
    flex-direction: column;
    text-align: center;
  }

  .request-actions {
    width: 100%;
    flex-direction: column;
  }

  .btn-accept,
  .btn-decline {
    width: 100%;
  }

  .hero-buttons {
    flex-direction: column;
  }

  .btn-hero {
    width: 100%;
    justify-content: center;
  }
}


.loader-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.5); /* semi-transparent */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  backdrop-filter: blur(2px); /* flou joli derrière */
}

.loader-spinner {
  width: 60px;
  height: 60px;
  border: 6px solid #f3f3f3; /* couleur claire */
  border-top: 6px solid #007bff; /* couleur accent */
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
