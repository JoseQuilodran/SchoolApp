<template>
  
</template>

<script>
import {onMounted, ref } from 'vue'
import {useStore} from "vuex"
import {useRouter} from "vue-router"
export default {
  name: 'Logout',
  setup(){     
    const store = useStore()
    const router = useRouter()
    onMounted(async () => {
      try {
         const response = await fetch('http://localhost:3000/api/auth/signout', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},        
          credentials: 'include'  
        });    
          store.dispatch("clearAll");   
          await store.dispatch('setAuth', false);
          sessionStorage.removeItem('vuex');
          
          await router.push('/');   
      } catch (e) {
        console.log(e);
        store.dispatch("clearAll"); 
        await store.dispatch('setAuth', false);
        sessionStorage.removeItem('vuex');
        await router.push('/');
        
      }
   });
    return {
     
    }
  }
}
</script>
