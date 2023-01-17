import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import store from '../store/index.js'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../views/Dashboard.vue')
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/About.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/logout',
    name: 'Logout',
    component: () => import('../views/Logout.vue')
  },
  {
    path: '/forgotpass',
    name: 'ForgotPass',
    component: () => import('../views/ForgotPass.vue')
  },
  {
    path: '/configuracion',
    name: 'Configuracion',
    component: () => import('../views/Configuracion.vue')
  },
  {
    path: '/resetpass/:token',
    name: 'ResetPass',
    component: () => import('../views/ResetPass.vue'),
    props: true,
  },
  {
    path: '/usuarios',
    name: 'Usuarios',
    component: () => import('../views/Usuarios.vue'),
  },
  {
    path: '/asignaturas',
    name: 'Asignaturas',
    component: () => import('../views/Asignaturas.vue'),
  },
  {
    path: '/usuarios/crearusuarios',
    name: 'CrearUsuarios',
    component: () => import('../views/Usuarios/CrearUsuarios.vue'),
  }
  ,
  {
    path: '/asignaturas/notas',
    name: 'Notas',
    component: () => import('../views/Asignaturas/Notas.vue'),
  },
  ,
  {
    path: '/asistencia',
    name: 'Asistencia',
    component: () => import('../views/Asistencia.vue'),
  },
  {
    path: '/personalidad',
    name: 'Personalidad',
    component: () => import('../views/Personalidad.vue'),
  },
  {
    path: '/cursos',
    name: 'Cursos',
    component: () => import('../views/Cursos.vue'),
  }
  ,
  {
    path: '/informes',
    name: 'Informes',
    component: () => import('../views/Informes.vue'),
  }
  ,
  {
    path: '/pac',
    name: 'Pac',
    component: () => import('../views/Pac.vue'),
  }
  ,
  {
    path: '/registroasignaturas',
    name: 'RegistroAsignaturas',
    component: () => import('../views/RegistroAsignaturas.vue'),
  }
  ,
  {
    path: '/asistenciacurso',
    name: 'AsistenciaCurso',
    component: () => import('../views/Asistencia/AsistenciaCurso.vue'),
  }
  ,
  {
    path: '/personalidadcurso',
    name: 'PersonalidadCurso',
    component: () => import('../views/Personalidad/PersonalidadCurso.vue'),
  }
  ,
  {
    path: '/certificados',
    name: 'Certificados',
    component: () => import('../views/Certificados.vue'),
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})
router.beforeEach((to, from, next) => {
  if ((to.name !== 'Login' && to.name !== 'ResetPass' && to.name !== 'ForgotPass') && !store.state.authentified) next({ name: 'Login' })
  else next()
})
export default router
