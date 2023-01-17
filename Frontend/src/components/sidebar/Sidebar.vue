<script>
import SidebarLink from '@/components/sidebar/SidebarLink'
import {onMounted, ref } from 'vue'
import {useRouter} from "vue-router"
import {useStore} from "vuex"
export default {
  props: {},
  components: {SidebarLink },
  setup() {
    const router = useRouter();
    const store = useStore();
      onMounted(async () => {
      
    });
  },
  data() {
    return {
      hover: false,
    };
  },
  computed: {    
    
    colormode() {    
      const store = useStore()
      let color      
      switch (store.state.user.rol.nombre) {
        
        case 'coordinador':
          color = "#50c878";
          break;
        case 'docente':
          color = "#4184a4";
          break;
        case 'usuario':
          color = '#5a2518';
          break;
        case 'administrador':
         // color = '#D22B2B';
         color= '#5a2518';
          break;
        default:
          color= '#ffffff';
      }  
      return color
    }
  },
  methods: {
    userToggle() {
      this.hover = !this.hover
      console.log(this.hover);
    }
  }
}
</script>

<template>
  <div class="sidebar" :style="{ width: $store.getters.getSidebarWidth, backgroundColor:colormode}">
    <h1>
      <span v-if="$store.state.collapsed">
        <div>C</div>
        <div>G</div>
        <div>A</div>
      </span>
      <span v-else> 
        <div style="white-space: nowrap;"> Colegio del</div>
        <div>GENRICO</div>
        <div>AQUI</div></span>
      
    </h1>

    <SidebarLink to="/" icon="fas fa-home">Inicio</SidebarLink>    
    <SidebarLink to="/usuarios"  icon="fas fa-user-cog" v-if="$store.state.user.rol.nombre ==='administrador'||$store.state.user.rol.nombre ==='coordinador'">Usuarios</SidebarLink> 
    <SidebarLink to="/pac"   icon="fas fa-file-signature" v-if="$store.state.user.rol.nombre ==='administrador'" >Pac</SidebarLink>
    <SidebarLink to="/cursos"  icon="fas fa-landmark">Cursos</SidebarLink>
    <SidebarLink to="/registroasignaturas"  icon="fas fa-book-medical" v-if="$store.state.user.rol.nombre ==='administrador'">RegistroAsignatura</SidebarLink>
    <SidebarLink to="/asignaturas"  icon="fas fa-book" >Asignaturas</SidebarLink>
    <SidebarLink to="/asistencia"   icon="fas fa-clipboard-check" v-if="$store.state.user.rol.nombre !=='usuario'" >Asistencia</SidebarLink>
    <SidebarLink to="/personalidad"   icon="fas fa-laugh" v-if="$store.state.user.rol.nombre !=='usuario'" >Personalidad</SidebarLink>
    <SidebarLink to="/informes"   icon="fas fa-file-export"  >Informes</SidebarLink>      
    <SidebarLink to="/certificados"   icon="fas fa-file-pdf" v-if="$store.state.user.rol.nombre ==='usuario'" >Certificados</SidebarLink>    
    <SidebarLink to="/configuracion" class="tobottom" icon="fas fa-user-cog">Configuracion</SidebarLink>
    <SidebarLink to="/logout"   icon="fas fa-times-circle" >Cerrar Sesion</SidebarLink>
       
    
    <span
      class="collapse-icon"
      :class="{ 'rotate-180': $store.state.collapsed}"
      @click="$store.commit('toggleCollapsed')"
    >
      <i class="fas fa-angle-double-left" />
    </span>
  </div>
</template>

<style>
:root {
  --sidebar-bg-color: #5a2518;
  --sidebar-item-hover: #fea63d;
  --sidebar-item-active: #fea63d;
}
</style>

<style scoped>
.sidebar {
  color: white; 

  float: left;
  position: fixed;
  z-index: 1;
  top: 0;
  left: 0;
  bottom: 0;
  padding: 0.5em;

  transition: 0.3s ease;

  display: flex;
  flex-direction: column;
}

.sidebar h1 {
  height: 3.5em;
}

.collapse-icon {
  
  padding: 0.75em;

  color: rgba(255, 255, 255, 0.7);

  transition: 0.2s linear;
}
.tobottom{ 
  margin-top: auto;  
}



.rotate-180 {
  transform: rotate(180deg);
  transition: 0.2s linear;
}


</style>
