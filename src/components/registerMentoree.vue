<script setup>
import { useRoute, useRouter } from 'vue-router'
import { ref } from 'vue'
import { apiPost } from '@/helpers/axiosApi'

const router = useRouter()

const mentoreeRegister = ref()
const mentoreeConnect = ref()

const connexion = ref('login')
const fullName = ref()
const email = ref()
const telephone = ref()
const ville = ref()
const adresse = ref()
const password = ref()
const emailConnect = ref()
const passwordConnect = ref()

const apiRegisterMentoree = async () => {
  const response = await apiPost('http://localhost:8000/api/v1/mentoree/register', {
    name: fullName.value,
    email: email.value,
    telephone: telephone.value,
    ville: ville.value,
    adresse: adresse.value,
    password: password.value,
  })
  mentoreeRegister.value = response

  connexion.value = 'login'
}

const getInfo = () => {
  console.log(connexion.value)
  console.log(fullName.value)
  console.log(email.value)
  console.log(telephone.value)
  console.log(ville.value)
  console.log(adresse.value)
  console.log(password.value)
  console.log(emailConnect.value)
  console.log(passwordConnect.value)
}

const connectMentoree = async () => {
  const response = await apiPost('http://localhost:8000/api/v1/mentoree/login', {
    email: emailConnect.value,
    password: passwordConnect.value,
  })
  mentoreeConnect.value = response
  localStorage.setItem('token', mentoreeConnect.value.data.access_token)
  localStorage.setItem('role', mentoreeConnect.value.data.data.roles[0].name)
  localStorage.setItem('user', JSON.stringify(mentoreeConnect.value.data.data))
  
  router.push('/mentoree/profil')
  setTimeout(() => {
    location.reload()
  }, 100)
}

const retour = () => {
  router.back()
}
</script>

<template>
  <div class="register-page">
    <div class="auth-container" v-if="connexion === 'register'">
      <button @click.prevent="retour" class="btn-back">← Retour</button>

      <div class="auth-card">
        <h2 class="auth-title">Mentoree inscription</h2>

        <form @submit.prevent="apiRegisterMentoree" class="auth-form">
          <div class="form-group">
            <label class="form-label" for="fullName">Nom complet</label>
            <input
              type="text"
              id="fullName"
              v-model="fullName"
              class="form-input"
              placeholder="Jean Dupont"
              required
            />
          </div>

          <div class="form-group">
            <label class="form-label" for="email">Email</label>
            <input
              type="email"
              id="email"
              v-model="email"
              class="form-input"
              placeholder="jean@example.com"
              required
            />
          </div>

          <div class="form-group">
            <label class="form-label" for="password">Mot de passe</label>
            <input type="password" v-model="password" class="form-input" required />
          </div>

          <div class="form-group">
            <label class="form-label" for="telephone">Téléphone</label>
            <input
              type="text"
              id="telephone"
              v-model="telephone"
              class="form-input"
              placeholder="+229 XX XX XX XX"
              required
            />
          </div>

          <div class="form-group">
            <label class="form-label" for="ville">Ville</label>
            <input
              type="text"
              id="ville"
              v-model="ville"
              class="form-input"
              placeholder="Cotonou"
              required
            />
          </div>

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
          </div>
          <button type="submit" class="btn-submit">S'inscrire</button>
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

        <form @submit.prevent="connectMentoree" class="auth-form">
          <div class="form-group">
            <label class="form-label" for="emailConnect">Email</label>
            <input
              type="email"
              id="emailConnect"
              class="form-input"
              placeholder="jean@example.com"
              required
              v-model="emailConnect"
            />
          </div>

          <div class="form-group">
            <label class="form-label" for="passwordConnect">Mot de passe</label>
            <input
              type="password"
              class="form-input"
              placeholder="••••••••"
              required
              id="passwordConnect"
              v-model="passwordConnect"
            />
          </div>

          <button type="submit" class="btn-submit">Se connecter</button>
        </form>

        <p class="auth-footer">
          S'inscrire?
          <button @click.prevent="connexion = 'register'" class="link-btn">S'inscrire</button>
        </p>
      </div>
    </div>
  </div>
</template>
