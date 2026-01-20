<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { apiDelete, apiGet, apiPost, apiPut } from '@/helpers/axiosApi'

const router = useRouter()
const route = useRoute()
const loading = ref()

const mentorConnect = ref()
const userLogout = ref()
const connexion = ref()
const domaineList = ref()

const apiDisplayCarte = ref()
const coordonneeMentor = ref()
const map = ref()
const marker = ref()
const getDemandeMentoree = ref()

const getMentor = async () => {
   loading.value = true
  const response = await apiGet('https://mentormap.projet.sbs/public/api/v1/mentor/getMentor')
  mentorConnect.value = response
  console.log('mentorConnect.value: ', mentorConnect.value)
   loading.value = false
}

const apiGetDomaine = async () => {
  const response = await apiGet('https://mentormap.projet.sbs/public/api/v1/domaine/index')
  domaineList.value = response
  console.log('domaineList.value: ', domaineList.value)
}

const modifyProliMentor = () => {
  connexion.value = 'register'
}

const logout = () => {
  const response = apiDelete('https://mentormap.projet.sbs/public/api/v1/mentor/logout')
  userLogout.value = response
  console.log('userLogout.value: ', userLogout.value)

  localStorage.removeItem('token')
  localStorage.removeItem('role')
  localStorage.removeItem('user')
  router.push('/')
}

const apiGetDemandeMentor = async () => {
  const response = await apiGet(
    'https://mentormap.projet.sbs/public/api/v1/mentor/getdemandementor/' + mentorConnect.value.data.id,
  )
  getDemandeMentoree.value = response
}

const displayCArte = async () => {
  apiDisplayCarte.value = true

  await nextTick()

  map.value = L.map('map').setView(
    [mentorConnect.value.data.latitude, mentorConnect.value.data.longitude],
    7,
  )
  /* console.log('mentorConnect.value.data.longitude: ', mentorConnect.value.data.longitude);
  console.log('mentorConnect.value.data.latitude: ', mentorConnect.value.data.latitude);
 */
  marker.value = L.marker([
    mentorConnect.value.data.longitude,
    mentorConnect.value.data.latitude,
  ]).addTo(map.value)
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map.value)

  map.value.on('click', movMarker)
}

const movMarker = (e) => {
  console.log("j'ai ete clique")
  if (marker.value === null) {
    marker.value = L.marker([e.latlng.lat, e.latlng.lng]).addTo(map.value)
  } else {
    marker.value.setLatLng([e.latlng.lat, e.latlng.lng])
    coordonneeMentor.value = {
      latitude: e.latlng.lat,
      longitude: e.latlng.lng,
    }
    mentorConnect.value.data.latitude = e.latlng.lat
    mentorConnect.value.data.longitude = e.latlng.lng
  }
}

const currentStep = ref(1)
const searchLanguage = ref('')
const listDomaine = ref()
const displayChoiceDomaine = ref(false)
const listChoiceDomaine = ref([])
const listChoiceLangages = ref([])
const updateMentor = ref()
const demandeMentoreeAccepte = ref()
const storeDomaineMentor = ref()
const demandeMentoreeRefuser = ref()

const apiListDomaine = async () => {
  const response = await apiGet('https://mentormap.projet.sbs/public/api/v1/domaine/index')
  listDomaine.value = response
  console.log('listDomaine.value: ', listDomaine.value)
}

// Domaines

const selectedDomains = ref([])

const selectedLanguages = ref([])

const consoledh = () => {
  // console.log('selectedDomains: ', selectedDomains.value)

  console.log('selectedLanguages: ', selectedLanguages.value)

  selectedDomains.value.forEach((element) => {
    listChoiceDomaine.value.push({
      mentor_id: mentorConnect.value.data.id,
      domaine_id: element,
    })
  })
  selectedLanguages.value.forEach((element) => {
    listChoiceLangages.value.push({
      mentor_id: mentorConnect.value.data.id,
      langage_id: element,
    })
  })
  console.log('listChoiceDomaine.value: ', listChoiceDomaine.value)
  console.log('listChoiceLangages.value: ', listChoiceLangages.value)
}

// Computed

const canGoNext = computed(() => {
  if (currentStep.value === 1) return selectedDomains.value.length > 0
  if (currentStep.value === 2) return selectedLanguages.value.length > 0
  return true
})

const canSubmit = computed(() => {
  return selectedDomains.value.length > 0 && selectedLanguages.value.length > 0
})

// Methods
const toggleDomain = (id) => {
  const index = selectedDomains.value.indexOf(id)
  if (index > -1) {
    selectedDomains.value.splice(index, 1)
  } else {
    selectedDomains.value.push(id)
  }
}

const toggleLanguage = (id) => {
  const index = selectedLanguages.value.indexOf(id)
  if (index > -1) {
    selectedLanguages.value.splice(index, 1)
  } else {
    selectedLanguages.value.push(id)
  }
}

const nextStep = () => {
  if (canGoNext.value && currentStep.value < 2) {
    currentStep.value++
  }
}

const previousStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

console.log(route.path)

onMounted(async () => {
  await apiListDomaine()

  await getMentor()
  await apiGetDomaine()
  await apiGetDemandeMentor()
})

const getInfo = () => {
  console.log('Nom ', mentorConnect.value.data.name)
  console.log('Telephone ', mentorConnect.value.data.telephone)
  console.log('email ', mentorConnect.value.data.email)
  console.log('ville ', mentorConnect.value.data.ville)
  console.log('longitude ', mentorConnect.value.data.longitude)
  console.log('latitude ', mentorConnect.value.data.latitude)
  console.log('Experience ', mentorConnect.value.data.experience_annees)
  console.log('Bio ', mentorConnect.value.data.bio)
  console.log('Tarif horaire ', mentorConnect.value.data.tarif_horaire)
}

const apiStoreDomaineMentor = async () => {
  selectedDomains.value.forEach((element) => {
    listChoiceDomaine.value.push({
      mentor_id: mentorConnect.value.data.id,
      domaine_id: element,
    })
  })
  selectedLanguages.value.forEach((element) => {
    listChoiceLangages.value.push({
      mentor_id: mentorConnect.value.data.id,
      langage_id: element,
    })
  })
  const response = await apiPost('https://mentormap.projet.sbs/public/api/v1/mentor/store/domainelangage', {
    listDomaineMentor: listChoiceDomaine.value,
    listLangageMentor: listChoiceLangages.value,
  })
  storeDomaineMentor.value = response
  console.log(' storeDomaineMentor.value: ', storeDomaineMentor.value)
  location.reload()
}

/* Modifier info mentor */

const apiUpdateMentor = async () => {
  const response = await apiPut('https://mentormap.projet.sbs/public/api/v1/mentor/update', {
    name: mentorConnect.value.data.name,
    email: mentorConnect.value.data.email,
    telephone: mentorConnect.value.data.telephone,
    ville: mentorConnect.value.data.ville,
    latitude: coordonneeMentor.value.latitude,
    longitude: coordonneeMentor.value.longitude,
    experience_annees: mentorConnect.value.data.experience_annees,
    bio: mentorConnect.value.data.bio,
    tarif_horaire: mentorConnect.value.data.tarif_horaire,
  })
  updateMentor.value = response
  console.log('updateMentor.value: ', updateMentor.value)
  location.reload()
}

/*Accepter demande de mentoree */

const apiDemandeMentoreeAccepte = async (id) => {
  const response = await apiPut('https://mentormap.projet.sbs/public/api/v1/mentor/acceptedemande/' + id)
  demandeMentoreeAccepte.value = response
  location.reload()
}

/*Refuser demande de mentoree */

const apiRefuserDemandeMentoree = async (id) => {
  const response = await apiPut('https://mentormap.projet.sbs/public/api/v1/mentor/refuseredemande/' + id)
  demandeMentoreeRefuser.value = response
  location.reload()
}
</script>

<template>
  <div id="global-loader" class="loader-overlay" v-if="loading">
    <div class="loader-spinner"></div>
  </div>

  <div v-else>
    <!-- Dashboard Mentor -->
    <div class="mentor-app">
      <div class="dashboard" v-if="mentorConnect">
        <header class="dashboard-header">
          <div class="container" style="display: flex; justify-content: space-between">
            <div class="logo">
              <span class="logo-icon">🎓</span>
              <span class="logo-text">Mentor MAP</span>
            </div>
            <div class="user-menu">
              <span class="user-name">{{ mentorConnect.data.name }}</span>
              <button @click="logout" class="btn-logout">Déconnexion</button>
            </div>
          </div>
        </header>

        <div class="dashboard-content">
          <div class="container">
            <h1 class="page-title">{{ mentorConnect.data.name }} Profil Mentor</h1>

            <!-- Stats -->
            <div class="stats-grid">
              <div class="stat-card">
                <div class="stat-icon">👥</div>
                <div class="stat-value">{{ mentorConnect.numberMentoree }}</div>
                <div class="stat-label">Nombre mentoree</div>
              </div>
              <div class="stat-card">
                <div class="stat-icon">⭐</div>
                <div class="stat-value">4.8</div>
                <div class="stat-label">Note moyenne</div>
              </div>
              <div class="stat-card">
                <div class="stat-icon">💰</div>
                <div class="stat-value">45,000</div>
                <div class="stat-label">Revenus (FCFA)</div>
              </div>
            </div>

            <!-- Profil -->
            <div class="profile-card">
              <h2 class="section-title">📋 Mes Informations</h2>

              <div class="profile-grid">
                <div class="profile-item">
                  <span class="profile-label">Nom :</span>
                  <span class="profile-value">{{ mentorConnect.data.name }}</span>
                </div>
                <div class="profile-item">
                  <span class="profile-label">Email :</span>
                  <span class="profile-value">{{ mentorConnect.data.email }}</span>
                </div>
                <div class="profile-item">
                  <span class="profile-label">Téléphone :</span>
                  <span class="profile-value">{{ mentorConnect.data.telephone }}</span>
                </div>
                <div class="profile-item">
                  <span class="profile-label">Ville :</span>
                  <span class="profile-value">{{ mentorConnect.data.ville }}</span>
                </div>
                <div class="profile-item">
                  <span class="profile-label">Domaine :</span>
                  <span class="profile-value">{{ mentorConnect.data.domaine ?? null }}</span>
                </div>
                <div class="profile-item">
                  <span class="profile-label">Expérience :</span>
                  <span class="profile-value">{{ mentorConnect.data.experience_annees }} ans</span>
                </div>
                <div class="profile-item">
                  <span class="profile-label">Tarif :</span>
                  <span class="profile-value">{{ mentorConnect.data.tarif_horaire }} FCFA/h</span>
                </div>
              </div>

              <div class="profile-bio">
                <span class="profile-label">Bio :</span>
                <p class="bio-text">{{ mentorConnect.data.bio }}</p>
              </div>

              <div style="display: flex; justify-content: space-between">
                <button class="btn-edit-profile" @click.prevent="modifyProliMentor()">
                  Modifier et completer mon profil
                </button>
                <button class="btn-edit-profile" @click.prevent="displayChoiceDomaine = true">
                  choisir vos domaine et compétence
                </button>
              </div>
            </div>

            <div class="skills-selector-page" v-show="displayChoiceDomaine">
              <div class="main-container">
                <div class="form-card">
                  <h1 class="page-title">Définissez vos compétences</h1>
                  <p class="page-subtitle">
                    Aidez les mentorés à mieux vous trouver en précisant vos domaines d'expertise
                  </p>

                  <!-- Étape 1: Domaines principaux -->
                  <div v-show="currentStep === 1" class="step-content">
                    <h2 class="section-title">
                      <span class="number-badge">1</span>
                      Vos domaines d'expertise
                    </h2>
                    <p class="section-subtitle">
                      Sélectionnez tous les domaines dans lesquels vous pouvez accompagner
                    </p>

                    <div class="domains-grid" v-if="listDomaine">
                      <div
                        v-for="domaine in listDomaine.data"
                        :key="domaine.id"
                        class="domain-card"
                        :class="{ selected: selectedDomains.includes(domaine.id) }"
                        @click="toggleDomain(domaine.id)"
                      >
                        <div class="domain-name">{{ domaine.name }}</div>
                      </div>
                    </div>
                  </div>

                  <!-- Étape 2: Langages de programmation -->
                  <div v-show="currentStep === 2" class="step-content">
                    <h2 class="section-title">
                      <span class="number-badge">2</span>
                      Langages de programmation
                    </h2>
                    <p class="section-subtitle">
                      Choisissez les langages que vous maîtrisez (minimum 1)
                    </p>

                    <div class="tags-container" v-if="listDomaine">
                      <div
                        v-for="lang in listDomaine.langages"
                        :key="lang.id"
                        class="tag-item"
                        :class="{ selected: selectedLanguages.includes(lang.id) }"
                        @click="toggleLanguage(lang.id)"
                      >
                        <span class="tag-name">{{ lang.langage }}</span>
                      </div>
                    </div>
                  </div>

                  <!-- Buttons -->
                  <div class="buttons-section">
                    <button v-if="currentStep > 1" @click="previousStep" class="btn-secondary">
                      Précédent
                    </button>

                    <button
                      v-if="currentStep < 2"
                      @click="nextStep"
                      class="btn-primary"
                      :disabled="!canGoNext"
                    >
                      Suivant
                    </button>

                    <button
                      v-if="currentStep === 2"
                      @click="apiStoreDomaineMentor"
                      class="btn-submit"
                      :disabled="!canSubmit"
                    >
                      Valider mes compétences
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Demandes -->
            <div class="requests-card">
              <h2 class="section-title">📬 Demandes de mentorat</h2>

              <div
                class="requests-list"
                v-if="getDemandeMentoree.data.length > 0"
                v-for="demandeMentoree in getDemandeMentoree.data"
              >
                <div class="request-item">
                  <div class="request-avatar">{{}}</div>
                  <div class="request-info">
                    <h3 class="request-name">{{ demandeMentoree.mentoree.name }}</h3>
                    <p class="request-message">{{}}</p>
                    <p class="request-date">{{ demandeMentoree.mentoree.created_at }}</p>
                  </div>
                  <div class="request-actions">
                    <button
                      class="btn-accept"
                      @click="apiDemandeMentoreeAccepte(demandeMentoree.mentoree.id)"
                    >
                      Accepter
                    </button>
                    <button
                      class="btn-decline"
                      @click.prevent="apiRefuserDemandeMentoree(demandeMentoree.mentoree.id)"
                    >
                      Refuser
                    </button>
                  </div>
                </div>
              </div>

              <div class="empty-state-small" v-else>
                <p>Aucune demande pour le moment</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="auth-container" v-if="connexion === 'register'">
      <button @click.prevent="retour" class="btn-back">← Retour</button>

      <div class="auth-card">
        <h2 class="auth-title">{{}}</h2>

        <form @submit.prevent="apiUpdateMentor" class="auth-form" v-if="mentorConnect">
          <div class="form-group">
            <label class="form-label" for="fullName">Nom complet</label>
            <input
              type="text"
              id="fullName"
              v-model="mentorConnect.data.name"
              class="form-input"
              required
            />
          </div>

          <div class="form-group">
            <label class="form-label" for="email">Email</label>
            <input
              type="email"
              id="email"
              v-model="mentorConnect.data.email"
              class="form-input"
              required
            />
          </div>

          <!--  <div class="form-group">
          <label class="form-label" for="password">Mot de passe</label>
          <input type="password" v-model="mentorConnect.data.password" class="form-input" required />
        </div> -->

          <div class="form-group">
            <label class="form-label" for="telephone">Téléphone</label>
            <input
              type="text"
              id="telephone"
              v-model="mentorConnect.data.telephone"
              class="form-input"
              required
            />
          </div>

          <div class="form-group">
            <label class="form-label" for="ville">Ville</label>
            <input
              type="text"
              id="ville"
              v-model="mentorConnect.data.ville"
              class="form-input"
              required
            />
          </div>

          <div class="mentor-fields">
            <!--  <div class="form-group">
            <label class="form-label">Domaine d'expertise</label>
            <select class="form-input" required v-model="mentorConnect.data.domaine">
              <option :value="mentorConnect.data.domaine" style="text-align: center" disabled>
                -- Sélectionner votre domaine--
              </option>
              <option :value="domaine.id" v-for="domaine in domaineList.data" :key="domaine.id">
                {{ domaine.name }}
              </option>
            </select>
          </div> -->

            <div class="form-group">
              <label class="form-label" for="experience_annees">Expérience (années)</label>
              <input
                type="number"
                class="form-input"
                id="experience_annees"
                v-model="mentorConnect.data.experience_annees"
                min="1"
                required
              />
            </div>

            <div class="form-group">
              <label class="form-label" for="bio">Bio</label>
              <textarea
                class="form-textarea"
                id="bio"
                v-model="mentorConnect.data.bio"
                placeholder="Parlez de votre parcours..."
                required
              ></textarea>
            </div>

            <div class="form-group">
              <label class="form-label" for="tarif_horaire">Tarif horaire (FCFA)</label>
              <input
                type="number"
                class="form-input"
                placeholder="5000"
                required
                id="tarif_horaire"
                v-model="mentorConnect.data.tarif_horaire"
              />
            </div>
          </div>

          <button class="btn-submit" @click.prevent="displayCArte">Choisissez votre adresse</button>
          <button type="submit" class="btn-submit">Modifier</button>
        </form>
      </div>
    </div>
    <div id="map" v-show="apiDisplayCarte" style="height: 800px; margin: 0px 50px 100px 50px"></div>
  </div>
</template>

<style scoped>
.mentors-selection-view {
  min-height: 100vh;
  background: #f8fafc;
}

/* En-tête */
.page-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 60px 20px 40px;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
}

.header-content h1 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 10px;
}

.header-content p {
  font-size: 1.1rem;
  opacity: 0.9;
  margin-bottom: 30px;
}

/* Barre de recherche et filtres */
.search-filters {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.search-bar {
  flex: 1;
  min-width: 300px;
  position: relative;
}

.search-bar i {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #64748b;
}

.search-bar input {
  width: 100%;
  padding: 12px 15px 12px 45px;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  background: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.filters {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.filters select {
  padding: 12px 15px;
  border: none;
  border-radius: 8px;
  background: white;
  color: #374151;
  font-size: 14px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  min-width: 150px;
}

/* Contenu principal */
.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 30px;
}

/* Sidebar des filtres */
.filters-sidebar {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  height: fit-content;
  position: sticky;
  top: 20px;
}

.filter-section {
  margin-bottom: 24px;
  padding-bottom: 24px;
  border-bottom: 1px solid #e2e8f0;
}

.filter-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.filter-section h3 {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 16px;
}

/* Styles pour les checkboxes et radio buttons */
.checkbox-label,
.radio-label {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  cursor: pointer;
  font-size: 14px;
  color: #475569;
}

.checkbox-label input,
.radio-label input {
  display: none;
}

.checkmark,
.radiomark {
  width: 18px;
  height: 18px;
  border: 2px solid #cbd5e1;
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.radiomark {
  border-radius: 50%;
}

.checkbox-label input:checked + .checkmark {
  background: #3b82f6;
  border-color: #3b82f6;
}

.checkbox-label input:checked + .checkmark:after {
  content: '✓';
  color: white;
  font-size: 12px;
}

.radio-label input:checked + .radiomark {
  border-color: #3b82f6;
}

.radio-label input:checked + .radiomark:after {
  content: '';
  width: 8px;
  height: 8px;
  background: #3b82f6;
  border-radius: 50%;
}

/* Filtre prix */
.price-range {
  margin-bottom: 10px;
  font-weight: 600;
  color: #1e293b;
}

.range-slider {
  position: relative;
}

.slider {
  width: 100%;
  margin: 10px 0;
}

.reset-filters {
  width: 100%;
  margin-top: 20px;
}

/* Grille des mentors */
.mentors-grid {
  min-height: 500px;
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.results-header h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e293b;
}

.sort-options {
  display: flex;
  align-items: center;
  gap: 10px;
}

.sort-options label {
  color: #64748b;
  font-size: 14px;
}

.sort-options select {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: white;
  color: #374151;
}

/* Liste des mentors */
.mentors-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
}

.mentor-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
}

.mentor-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.card-header {
  padding: 20px 20px 0;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.mentor-avatar {
  position: relative;
}

.mentor-avatar img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.online-indicator {
  position: absolute;
  bottom: 5px;
  right: 5px;
  width: 12px;
  height: 12px;
  background: #10b981;
  border: 2px solid white;
  border-radius: 50%;
}

.mentor-badges {
  display: flex;
  gap: 8px;
}

.badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
}

.badge.verified {
  background: #dbeafe;
  color: #1e40af;
}

.badge.pro {
  background: #fef3c7;
  color: #92400e;
}

.card-body {
  padding: 20px;
}

.mentor-name {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 4px;
}

.mentor-title {
  color: #64748b;
  font-size: 14px;
  margin-bottom: 12px;
}

.mentor-rating {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.stars .fa-star {
  margin-right: 2px;
}

.stars .active {
  color: #f59e0b;
}

.stars .inactive {
  color: #e5e7eb;
}

.rating-value {
  font-weight: 600;
  color: #1e293b;
}

.reviews-count {
  color: #64748b;
  font-size: 14px;
}

.mentor-bio {
  color: #64748b;
  line-height: 1.5;
  margin-bottom: 16px;
  font-size: 14px;
}

.mentor-skills {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 16px;
}

.skill-tag {
  padding: 4px 8px;
  background: #f1f5f9;
  color: #475569;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
}

.mentor-stats {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-top: 1px solid #f1f5f9;
}

.stat {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #64748b;
}

.stat i {
  color: #3b82f6;
}

.card-footer {
  padding: 16px 20px 20px;
  border-top: 1px solid #f1f5f9;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pricing {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.price {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
}

.duration {
  color: #64748b;
  font-size: 14px;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 6px;
}

.btn-primary {
  background: #3b82f6;
  color: white;
}

.btn-primary:hover {
  background: #2563eb;
}

.btn-outline {
  background: white;
  color: #64748b;
  border: 1px solid #d1d5db;
}

.btn-outline:hover {
  background: #f9fafb;
  border-color: #9ca3af;
}

.btn-secondary {
  background: #6b7280;
  color: white;
}

.btn-secondary:hover {
  background: #4b5563;
}

/* État vide */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #64748b;
}

.empty-state i {
  font-size: 64px;
  margin-bottom: 16px;
  color: #cbd5e1;
}

.empty-state h3 {
  font-size: 1.5rem;
  margin-bottom: 8px;
  color: #374151;
}

.empty-state p {
  margin-bottom: 20px;
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-top: 40px;
}

.pagination-btn {
  padding: 8px 16px;
  border: 1px solid #d1d5db;
  background: white;
  color: #374151;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;
}

.pagination-btn:hover:not(:disabled) {
  background: #f9fafb;
  border-color: #9ca3af;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-numbers {
  display: flex;
  gap: 8px;
}

.page-number {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
}

.page-number:hover {
  background: #f9fafb;
}

.page-number.active {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

/* Responsive */
@media (max-width: 1024px) {
  .main-content {
    grid-template-columns: 1fr;
  }

  .filters-sidebar {
    position: static;
  }
}

@media (max-width: 768px) {
  .page-header {
    padding: 40px 15px 30px;
  }

  .header-content h1 {
    font-size: 2rem;
  }

  .search-filters {
    flex-direction: column;
  }

  .search-bar {
    min-width: auto;
  }

  .filters {
    flex-direction: column;
  }

  .filters select {
    min-width: auto;
  }

  .mentors-list {
    grid-template-columns: 1fr;
  }

  .results-header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }

  .pagination {
    flex-direction: column;
    gap: 12px;
  }
}

.logo-icon {
  font-size: 2rem;
}

/* Main Container */
.main-container {
  margin-bottom: 30px;
}

.form-card {
  background: white;
  border-radius: 24px;
  padding: 40px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
}

/* Progress */
.progress-section {
  margin-bottom: 40px;
}

.progress-bar {
  height: 12px;
  background: #e2e8f0;
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 12px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #2563eb, #3b82f6);
  border-radius: 6px;
  transition: width 0.5s ease;
}

.progress-text {
  text-align: center;
  color: #64748b;
  font-weight: 600;
  font-size: 0.95rem;
}

/* Title */
.page-title {
  font-size: 2.5rem;
  color: #1e293b;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.title-icon {
  font-size: 3rem;
}

.page-subtitle {
  color: #64748b;
  font-size: 1.1rem;
  margin-bottom: 40px;
  line-height: 1.6;
}

/* Step Content */
.step-content {
  margin-bottom: 40px;
}

.section-title {
  font-size: 1.8rem;
  color: #1e293b;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 700;
}

.number-badge {
  background: linear-gradient(135deg, #2563eb, #1e40af);
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: 700;
}

.section-subtitle {
  color: #64748b;
  margin-bottom: 30px;
  font-size: 1rem;
}

/* Domains Grid */
.domains-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 20px;
}

.domain-card {
  padding: 24px;
  border: 3px solid #e2e8f0;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  background: white;
}

.domain-card:hover {
  border-color: #2563eb;
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(37, 99, 235, 0.15);
}

.domain-card.selected {
  border-color: #2563eb;
  background: linear-gradient(135deg, #eff6ff, #dbeafe);
}

.domain-icon {
  font-size: 3rem;
  margin-bottom: 12px;
}

.domain-name {
  font-size: 1.2rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 8px;
}

.domain-desc {
  color: #64748b;
  font-size: 0.9rem;
}

.checkmark {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 32px;
  height: 32px;
  background: #2563eb;
  color: white;
  border-radius: 50%;
  display: none;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: 700;
}

.domain-card.selected .checkmark {
  display: flex;
}

/* Search Box */
.search-box {
  margin-bottom: 24px;
  position: relative;
}

.search-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.3rem;
}

.search-input {
  width: 100%;
  padding: 14px 16px 14px 50px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.search-input:focus {
  outline: none;
  border-color: #2563eb;
}

/* Tags */
.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.tag-item {
  padding: 12px 20px;
  border: 2px solid #e2e8f0;
  border-radius: 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  background: white;
}

.tag-item:hover {
  border-color: #2563eb;
  transform: translateY(-2px);
}

.tag-item.selected {
  background: linear-gradient(135deg, #2563eb, #3b82f6);
  color: white;
  border-color: #2563eb;
}

.tag-icon {
  font-size: 1.2rem;
}

.tag-name {
  font-weight: 600;
}

.tag-check {
  display: none;
  font-weight: 700;
}

.tag-item.selected .tag-check {
  display: inline;
}

/* Tech Categories */
.tech-categories {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.tech-category {
  padding: 20px;
  background: #f8fafc;
  border-radius: 12px;
}

.category-title {
  font-size: 1.3rem;
  color: #1e293b;
  margin-bottom: 16px;
  font-weight: 700;
}

/* Selections Summary */
.selections-summary {
  background: linear-gradient(135deg, #f0fdf4, #dcfce7);
  border: 2px solid #86efac;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 30px;
}

.summary-title {
  font-size: 1.3rem;
  color: #166534;
  margin-bottom: 16px;
  font-weight: 700;
}

.summary-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.summary-item strong {
  color: #166534;
  display: block;
  margin-bottom: 8px;
}

.selected-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.selected-badge {
  background: white;
  color: #166534;
  padding: 8px 12px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  border: 2px solid #86efac;
}

.remove-btn {
  background: #ef4444;
  color: white;
  border: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s;
}

.remove-btn:hover {
  transform: scale(1.2);
}

/* Buttons */
.buttons-section {
  display: flex;
  gap: 16px;
  justify-content: flex-end;
}

.btn-primary,
.btn-secondary,
.btn-submit {
  padding: 14px 32px;
  border-radius: 12px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
}

.btn-primary {
  background: linear-gradient(135deg, #2563eb, #1e40af);
  color: white;
}

.btn-secondary {
  background: white;
  color: #2563eb;
  border: 2px solid #2563eb;
}

.btn-submit {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
}

.btn-primary:hover,
.btn-submit:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(37, 99, 235, 0.3);
}

.btn-secondary:hover {
  background: #eff6ff;
}

.btn-primary:disabled,
.btn-submit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

/* Responsive */
@media (max-width: 768px) {
  .form-card {
    padding: 24px;
  }

  .page-title {
    font-size: 2rem;
  }

  .domains-grid {
    grid-template-columns: 1fr;
  }

  .buttons-section {
    flex-direction: column;
  }

  .btn-primary,
  .btn-secondary,
  .btn-submit {
    width: 100%;
  }
}
</style>
