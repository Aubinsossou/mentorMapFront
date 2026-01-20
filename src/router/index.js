import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import RegisterMentor from '@/components/registerMentor.vue'
import RegisterMentoree from '@/components/registerMentoree.vue'
import profilMentor from '@/views/profilMentor.vue'
import MentoreeProfil from '@/views/mentoreeProfil.vue'
import ProfilMentorDetail from '@/views/profilDetailMentor.vue'
import DashboardAdmin from '@/views/dashboardAdmin.vue'
import vueTeste from '@/views/vueTeste.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/vueteste',
      name: 'vueTeste',
      component: vueTeste,
      meta: { requiresAuth: true }

    },
    {
      path: '/dashboard/admin',
      name: 'dashboardAdmin',
      component: DashboardAdmin,
      meta: { requiresAuth: true }

    },

    {
      path: '/mentor/register',
      name: 'mentor_register',
      component: RegisterMentor,

    },
    {
      path: '/mentoree/register',
      name: 'mentoree_register',
      component: RegisterMentoree,
    },
    {
      path: '/mentoree/profil',
      name: 'mentoree_Profil',
      component: MentoreeProfil,
      meta: { requiresAuth: true, role: "mentoree" }

    },
    {
      path: '/mentor/profil',
      name: 'mentorProfil',
      component: profilMentor,
      meta: { requiresAuth: true, role: "mentor" }

    },
    {
      path: '/mentor/profil/detail/:id',
      name: 'mentorProfilDetail',
      component: ProfilMentorDetail,
      meta: { requiresAuth: true, role: "mentoree" }

    },

  ],
})

export default router

router.beforeEach((to, from, next) => {

  const token = localStorage.getItem("token")
  const userRole = localStorage.getItem("role")

  if (to.meta.requiresAuth && !token) {
    //return next("/")
    router.back();

  }
    if (to.meta.requiresAuth && !token) {
    return next("/")
   
  }
  if (!to.meta.requiresAuth && token) {
    router.back();
  }

  if (to.meta.role && to.meta.role !== userRole) {
    //alert("Mauvais role vous etes trop faible pour acceder a cette route")
    return router.back()
  }
  next()
})

