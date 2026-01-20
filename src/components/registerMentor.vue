<script setup>
import { useRoute, useRouter } from 'vue-router'
import { onMounted, ref, nextTick } from 'vue'
import { apiGet, apiPost } from '@/helpers/axiosApi'

const router = useRouter()

const connexion = ref('login')
const fullName = ref()
const email = ref()
const telephone = ref()
const ville = ref()
const adresse = ref()
const domaine = ref('selection')
const experience_annees = ref()
const bio = ref()
const tarif_horaire = ref()
const password = ref()
const emailConnect = ref()
const passwordConnect = ref()
const mentorRegister = ref()
const mentorConnect = ref()
const getDomaineMentor = ref()
const apiDisplayCarte = ref()
const coordonneeMentor = ref()

let map = ref(null)
let marker = ref(null)

const apiRegisterMentor = async () => {
  const response = await apiPost('http://localhost:8000/api/v1/mentor/register', {
    name: fullName.value,
    email: email.value,
    telephone: telephone.value,
    ville: ville.value,
    experience_annees: experience_annees.value,
    longitude: coordonneeMentor.value.longitude,
    latitude: coordonneeMentor.value.latitude,
    domaine_id: domaine.value,
    bio: bio.value,
    tarif_horaire: tarif_horaire.value,
    password: password.value,
  })
  mentorRegister.value = response

  console.log(' mentorRegister.value: ', mentorRegister.value)

  connexion.value = 'login'
  location.reload()
}

/* Recuperer la localisation de l'utilisateur connecter */

const maPosition = (position) => {
  const infopos = ref('Position déterminée :\n')
  /*   infopos.value += 'Latitude : ' + position.coords.latitude + '\n'
  infopos.value += 'Longitude: ' + position.coords.longitude + '\n'
  infopos.value += 'Altitude : ' + position.coords.altitude + '\n' */
  // document.getElementById("infoposition").innerHTML = infopos;
  coordonneeMentor.value = {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
  }
  console.log("Les informations de l'utilisateur connecter", coordonneeMentor.value)
}

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(maPosition)
}

/* Zone de carte */

const displayCArte = async () => {
  apiDisplayCarte.value = true

  await nextTick()
  //console.log('infoUserConnect.value.Latitude, infoUserConnect.value.Longitude: ', infoUserConnect.value.Latitude, infoUserConnect.value.Longitude);

  map.value = L.map('map').setView([9.3077, 2.3158], 7)

  marker.value = L.marker([
    coordonneeMentor.value.latitude,
    coordonneeMentor.value.longitude,
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
    console.log(e.latlng)
  }

  coordonneeMentor.value = {
    latitude: e.latlng.lat,
    longitude: e.latlng.lng,
  }
  console.log(
    'Latitude',
    coordonneeMentor.value.latitude,
    'Longitude',
    coordonneeMentor.value.longitude,
  )
}

onMounted(async () => {
  apiGetDomaineMentor()
})

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

  coordonneeMentor.value = {
    latitude: parseFloat(data[0].lat),
    longitude: parseFloat(data[0].lon),
  }

  map.value.setView([coordonneeMentor.value.latitude, coordonneeMentor.value.longitude], 15)

  if (!marker.value) {
    marker.value = L.marker
      .value([coordonneeMentor.value.latitude, coordonneeMentor.value.longitude])
      .addTo(map.value)
  } else {
    marker.value.setLatLng([coordonneeMentor.value.latitude, coordonneeMentor.value.longitude])
  }
}

const apiGetDomaineMentor = async () => {
  const response = await apiGet('http://localhost:8000/api/v1/domaine/index')
  getDomaineMentor.value = response
  console.log(' getDomaineMentor.value: ', getDomaineMentor.value)
}

const getInfo = () => {
  console.log(connexion.value)
  console.log(fullName.value)
  console.log(email.value)
  console.log(telephone.value)
  console.log(ville.value)
  console.log(
    'Latitude',
    coordonneeMentor.value.latitude,
    'Longitude',
    coordonneeMentor.value.longitude,
  )

  console.log(domaine.value)
  console.log(experience_annees.value)
  console.log(bio.value)
  console.log(tarif_horaire.value)
  console.log(password.value)
}

const connect = async () => {
  const response = await apiPost('http://localhost:8000/api/v1/mentor/login', {
    email: emailConnect.value,
    password: passwordConnect.value,
  })
  mentorConnect.value = response.data
  console.log(' mentorConnect.value: ', mentorConnect.value)
  localStorage.setItem('token', mentorConnect.value.access_token)
  localStorage.setItem('role', mentorConnect.value.data.roles[0].name)
  localStorage.setItem('user', JSON.stringify(mentorConnect.value.data))
  if (mentorConnect.value.status == 'success') {
    router.push('/mentor/profil')
    setTimeout(() => {
      location.reload()
    }, 100)
  }
}

const retour = () => {
  router.push('/')
}
</script>

<template>
  <!-- Page d'inscription -->
  <div class="register-page">
    <div class="auth-container" v-if="connexion === 'register'">
      <button @click.prevent="retour" class="btn-back">← Retour</button>

      <div class="auth-card">
        <h2 class="auth-title">{{}}</h2>

        <form @submit.prevent="apiRegisterMentor" class="auth-form">
          <div class="form-group">
            <label class="form-label" for="fullName">Nom complet</label>
            <input type="text" id="fullName" v-model="fullName" class="form-input" required />
          </div>

          <div class="form-group">
            <label class="form-label" for="email">Email</label>
            <input type="email" id="email" v-model="email" class="form-input" required />
          </div>

          <div class="form-group">
            <label class="form-label" for="password">Mot de passe</label>
            <input type="password" v-model="password" class="form-input" required />
          </div>

          <div class="form-group">
            <label class="form-label" for="telephone">Téléphone</label>
            <input type="text" id="telephone" v-model="telephone" class="form-input" required />
          </div>

          <div class="form-group">
            <label class="form-label" for="ville">Ville</label>
            <input type="text" id="ville" v-model="ville" class="form-input" required />
          </div>
          <!-- 
          <div class="form-group">
            <label class="form-label" for="adresse">Adresse</label>
            <input
              type="text"
              class="form-input"
              id="adresse"
              v-model="adresse"
              placeholder="Votre adresse complète"
              required
            />
          </div> -->

          <div class="mentor-fields">
            <!-- <div class="form-group">
              <label class="form-label">Domaine d'expertise</label>
              <select class="form-input" required v-model="domaine" v-if="getDomaineMentor">
                <option value="selection" style="text-align: center" disabled>
                  -- Sélectionner votre domaine--
                </option>
                <option :value="domaine.id" v-for="domaine in getDomaineMentor.data">
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
                v-model="experience_annees"
                min="1"
                required
              />
            </div>

            <div class="form-group">
              <label class="form-label" for="bio">Bio</label>
              <textarea
                class="form-textarea"
                id="bio"
                v-model="bio"
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
                v-model="tarif_horaire"
              />
            </div>
          </div>

          <button type="submit" class="btn-submit" v-show="apiDisplayCarte">S'inscrire</button>
          <button class="btn-submit" @click.prevent="displayCArte">Choisissez votre adresse</button>
        </form>

        <p class="auth-footer">
          Déjà inscrit ?
          <button @click.prevent="connexion = 'login'" class="link-btn">Se connecter</button>
        </p>
      </div>
    </div>

    <!-- Se connecter -->

    <div class="auth-container" v-if="connexion === 'login'">
      <button @click.prevent="retour" class="btn-back">← Retour</button>

      <div class="auth-card">
        <h2 class="auth-title">Se connecter</h2>

        <form class="auth-form">
          <div class="form-group">
            <label class="form-label" for="emailConnect">Email :</label>
            <input
              type="email"
              id="emailConnect"
              class="form-input"
              placeholder="example@gmail.com"
              required
              v-model="emailConnect"
            />
          </div>

          <div class="form-group">
            <label class="form-label">Mot de passe</label>
            <input type="password" class="form-input" required v-model="passwordConnect" />
          </div>

          <button type="submit" class="btn-submit" @click.prevent="connect">Se connecter</button>
        </form>

        <p class="auth-footer">
          S'inscrire?
          <button @click.prevent="connexion = 'register'" class="link-btn">S'inscrire</button>
        </p>
      </div>
    </div>
    <div class="search-row" style="margin: 30px 0px 30px 50px" v-show="apiDisplayCarte">
      <input
        v-model="adresse"
        type="text"
        placeholder="Entrez une adresse..."
        class="search-card search-input"
      />
      <div><button @click="rechercherAdresse" class="btn-search">Rechercher</button></div>
    </div>
    <div id="map" v-show="apiDisplayCarte" style="height: 800px; margin: 0px 50px 100px 50px"></div>
  </div>
</template>
