<script>
import Sidebar from '@/components/sidebar/Sidebar'
import Login from '@/views/Login'

import {onMounted, ref } from 'vue'
import {useRouter, route} from "vue-router"
import {useStore} from "vuex"




export default {
  components: { Sidebar , Login },
  setup() {
    const store = useStore()
    
    
    return { }
  }
}
</script>
<template> 
  
  <div v-if="$store.state.authentified" :style="{ 'margin-left': $store.getters.getSidebarWidth }">
    <Sidebar v-if=" $store.state.user !== '' "/> 
    <div :style="{ 'margin-left': '8px' }"><router-view /></div>
  </div>
  
  <router-view  v-else/>
  <notifications />
  
</template>
<style  src="./assets/css/form.css"></style>
<style>@import url("https://fonts.googleapis.com/css?family=Rubik:400,500&display=swap");</style>
<style >

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}



body {
  background-color: #f5f5f5;
}
.tabulator-footer{
 background-color:#fea63d;
}

</style>
