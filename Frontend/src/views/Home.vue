<template>
  <div class="home">
    
    <h1>Bienvenid@ nuevamente, {{texto}}</h1>
    <img class="image" src="@/assets/logo.png" alt="">
    <h2>Seleccione donde quiere trabajar desde la barra lateral</h2>
    <br>
    <small class="corner">Ultima comprobacion:{{hora}}</small>
  </div>
</template>

<script>
// @ is an alias to /src
import { onMounted, ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import Modal from "@/components/modal/Modal.vue"
export default {
  name: "Home",
  components: {Modal },
  data() {
      return {
        isModalVisible: true,
      };
    },
    methods: {
      showModal() {
        this.isModalVisible = true;
      },
      closeModal() {
        this.isModalVisible = false;
      }
    },
  setup() {
    const store = useStore();
    const texto = ref("ERROR");
    const hora=ref("error")
    const router = useRouter();
    
    onMounted(async () => {
      try {
        const response = await fetch("http://localhost:3000/api/users", {
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        const content = await response.json();
        
        if (response.status === 200) {
          await store.dispatch("setUser", { user: content });
          texto.value = `${store.state.user.nombre}  ${store.state.user.apellidoP}  ${store.state.user.apellidoM}`;
          await store.dispatch("setAuth", true);
                   
          
          hora.value=new Date();
        } else {
          store.dispatch("clearAll"); 
          await store.dispatch("setUser", { user: '' });
          await store.dispatch("setAuth", false);
          sessionStorage.removeItem("vuex");
          await router.push("/login");
        }
      } catch (e) {        
        store.dispatch("clearAll"); 
        await store.dispatch("setAuth", false);
        sessionStorage.removeItem("vuex");
        await router.push("/");
      }
    });
    return {
      texto,
      hora,
    };
  },
};
</script>
<style scoped>
.home{
  padding: 50px;
}
.home h2{
  margin-top: 50px;
}
.image{
  height: 50vh;
  width: auto;
}
.corner{
  position: absolute;
  bottom:10px;
  right: 15px  ;
}
</style>