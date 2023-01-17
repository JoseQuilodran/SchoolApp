
<template>
  <h1>The sidebar is {{ $store.state.collapsed ? 'closed' : 'open' }}</h1>
  <p>{{texto}}</p> 
  <p>{{permit}}</p> 
</template>

<script>
import {useStore} from "vuex"
import {onMounted, ref } from 'vue'


export default {
  computed: {    
    
    permit() {    
      const store = useStore()
      let day
      switch (store.state.user.rol.nombre) {
        
        case 'coordinador':
          day = "coordiniwis";
          break;
        case 'docente':
          day = "docentiwis";
          break;
        case 'usuario':
          day = "usuariwiw";
          break;
          case 'administrador':
          day = "Adminiwis";
          break;
      }  
      return day
    }
  },
  setup() {
    const store = useStore()
    const texto = ref('No FUNCIONA!')
    
    texto.value = `Si se ve funciona ${JSON.stringify(store.state.user.rol)} email ${store.state.user.email}`;
    return { 
      texto
     
     }
  }
}
</script>
