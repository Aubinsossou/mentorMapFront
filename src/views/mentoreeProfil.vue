<script setup>
import { useRoute, useRouter } from 'vue-router'
import { onMounted, ref, nextTick } from 'vue'
import { apiGet, apiPost, apiDelete } from '@/helpers/axiosApi'

const router = useRouter()
const route = useRoute()

const map = ref(null)
const marker = ref(null)
const listMentor = ref()
const domaine = ref()
const mentoree = ref()
const userLogout = ref()
const adresse = ref()

/* Les domaines  */
const apiGetDomaine = async () => {
  const response = await apiGet('https://mentormap.projet.sbs/public/api/v1/domaine/index')
  domaine.value = response
  console.log('domaine.value: ', domaine.value)
}

/* check mentoree  */
const checkMentoree = async () => {
  const response = await apiGet('https://mentormap.projet.sbs/public/api/v1/mentoree/getmentoree')
  mentoree.value = response
  console.log('mentoree.value: ', mentoree.value)
}

/* Selectionner son adresse */

async function rechercherAdresse() {
  if (!adresse.value) return

  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(adresse.value)}`

  const res = await fetch(url)
  const data = await res.json()

  if (!data.length) {
    marker.value.bindPopup('Adresse introuvable').openPopup()
    return
  }

  const lat = parseFloat(data[0].lat)
  const lon = parseFloat(data[0].lon)

  map.value.setView([lat, lon], 15)

  /*  if (!marker.value) {
    marker.value = L.marker.value([lat, lon]).addTo(map.value)
  } else {
    marker.value.setLatLng([lat, lon])
  } */
}

/* Zone de carte */

const displayCArte = async () => {
  await nextTick()

  map.value = L.map('map').setView([9.3077, 2.3158], 7)

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map.value)

  // map.value.on('click', movMarker)
}

/* Liste mentor  */

const apiGetMentors = async () => {
  const response = await apiGet('https://mentormap.projet.sbs/public/api/v1/mentor/listmentor')
  listMentor.value = response

  listMentor.value.data.forEach((coordonnee) => {
    console.log('listMentor.value.data: ', listMentor.value.data[1])
    const mentor = L.marker([coordonnee.latitude, coordonnee.longitude]).addTo(map.value)

    mentor
      .bindTooltip(
        `
      <b>${coordonnee.name}</b><br>
      Domaine : ${coordonnee.domaines?.map((d) => d.name).join('<br> ') ?? 'Non renseigné'}<br>
      Email : ${coordonnee.email}
  `,
        { permanent: true, direction: 'top' },
      )
      .on('click', () => {
        router.push('/mentor/profil/detail/' + coordonnee.id)
      })

    console.log('Bonjour ', coordonnee.longitude)
  })

  console.log('listMentor.value: ', listMentor.value)
}

const logout = () => {
  const response = apiDelete('https://mentormap.projet.sbs/public/api/v1/mentoree/logout')
  userLogout.value = response
  console.log('userLogout.value: ', userLogout.value)

  localStorage.removeItem('token')
  localStorage.removeItem('role')
  localStorage.removeItem('user')
  router.push('/')
}

onMounted(async () => {
  await checkMentoree()
  displayCArte()
  apiGetMentors()
  apiGetDomaine()
})
</script>

<template>
  <div class="mentor-app">
    <!-- Dashboard Mentee (Recherche de mentor) -->
    <div class="dashboard">
      <header class="dashboard-header" v-if="mentoree">
        <div class="container" style="display: flex; justify-content: space-between">
          <div class="logo">
            <span class="logo-icon">🎓</span>
            <span class="logo-text">Mentor MAP</span>
          </div>
          <div class="user-menu">
            <span class="user-name">{{ mentoree.data.name }}</span>
            <button @click="logout" class="btn-logout">Déconnexion</button>
          </div>
        </div>
      </header>

      <div class="dashboard-content">
        <div class="container">
          <h1 class="page-title">🔍 Trouver votre mentor</h1>

          <!-- Filtres de recherche -->
          <div class="search-section" v-if="domaine">
            <div class="search-card">
              <div class="search-row">
                <div class="search-field">
                  <label class="search-label">Domaine</label>
                  <select class="search-input">
                    <option value="">Tous les domaines</option>
                    <option value="developpement" v-for="domaine in domaine.data">
                      {{ domaine.name }}
                    </option>
                  </select>
                </div>

                <div class="search-field">
                  <label class="search-label">Ville</label>
                  <input type="text" class="search-input" placeholder="Cotonou" v-model="adresse" />
                </div>

                <button @click="rechercherAdresse" class="btn-search">
                  <span>🔍</span>
                  <span>Rechercher</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Liste des mentors -->
          <!-- <div class="mentors-grid">
            <div  class="mentor-card">
              <div class="mentor-avatar">
                {{  }}
              </div>

              <div class="mentor-info">
                <h3 class="mentor-name">{{ }}</h3>
                <p class="mentor-domain">{{  }}</p>
                <p class="mentor-location">📍 {{ }}</p>
                <p class="mentor-distance">📏 {{  }} km de vous</p>
                <p class="mentor-experience">💼 {{ }} ans d'expérience</p>
                <p class="mentor-price">💰 {{ }} FCFA/heure</p>

                <div class="mentor-rating">
                  <span class="stars">⭐⭐⭐⭐⭐</span>
                  <span class="rating-count">({{ }} avis)</span>
                </div>
              </div>

              <button @click="selectMentor(mentor)" class="btn-contact">Contacter</button>
            </div>
          </div>

          <div  class="empty-state">
            <div class="empty-icon">🔍</div>
            <h3>Aucun mentor trouvé</h3>
            <p>Essayez de modifier vos critères de recherche</p>
          </div> -->
        </div>
      </div>
    </div>
  </div>

  <div id="map" style="height: 800px; margin: 0px 50px 100px 50px"></div>
</template>
