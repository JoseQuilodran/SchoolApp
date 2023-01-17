<script >
    import {reactive} from 'vue'
    import {useRouter} from "vue-router"
    import {useStore} from "vuex"
   import { notify } from "@kyvg/vue3-notification";

    export default {
    props: {},
    components: {},
    data() {
      return {
        forgot: false,
      };
    },
    setup() {
        const data = reactive({
            email:'admincdscc@localhost',
            password:'algoquesoloeldmindebesaber'
        })
         const router = useRouter();
         const store = useStore();
    const submit = async () => {
      const response = await fetch('http://localhost:3000/api/auth/signIn', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        credentials: 'include',
        body: JSON.stringify(data)
      });     
      if (response.status === 200) {
        notify({
          title: "Inicio de sesion correcto, Bienvenid@",
          type: "success",
        });
         await store.dispatch('setAuth', true);
          await router.push('/');
      } else {
        notify({
          title: "Error en credenciales, por favor intente nuevamente",
          type: "error",
        });
      }
      
    }    
    return {
      data,
      submit,     
    }
    }
    }
</script>



<template>  
  
  <div class="container">
  <form @submit.prevent="submit" class="left_login" >
    <div class="header">
      <h2 class="animation a1">Bienvenido de vuelta</h2>
      <h4 class="animation a2">Ingrese a su cuenta con su correo y contraseña</h4>
    </div>
    <div class="form" >
      <input  v-model="data.email" type="email" class="form-field animation a3" required="true" placeholder="Direccion de correo electronico">
      <input v-model="data.password" type="password" class="form-field animation a4" required="true"  placeholder="Contraseña">
      <p class="animation a5"><router-link to="/forgotpass">Olvide mi contraseña</router-link></p>
      <button class="animation a6">INGRESAR</button>
    </div>
  </form>  

  <div class="right_login"></div>
</div>
 

</template>


<style scoped>


@import url('https://fonts.googleapis.com/css?family=Rubik:400,500&display=swap');


body {
  font-family: 'Rubik', sans-serif;
}

.container {
  display: flex;
  height: 100vh;
}

.left_login {
  overflow: hidden;
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  justify-content: center;
  animation-name: left;
  animation-duration: 1s;
  animation-fill-mode: both;
  animation-delay: 1s;
}

.right_login {
  flex: 1;
  background-color: rgb(231, 231, 231);
  transition: 0.5s;
  background-image: url(../assets/logo.png);
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}



.header > h2 {
  margin: 0;
  color: #5a2518;
}

.header > h4 {
  margin-top: 10px;
  font-weight: normal;
  font-size: 15px;
  color: rgba(0,0,0,.4);
}

.form {
  max-width: 100%;
  display: flex;
  flex-direction: column;
}

.form > p {
  text-align: right;
}

.form > p > a {
  color: #000;
  font-size: 14px;
}



.form-field:focus {
  border-color: #0f7ef1;
}

.form > button {
  padding: 12px 10px;
  border: 0;
  background: linear-gradient(to right, #fea63d 0%,#5a2518 100%); 
  border-radius: 3px;
  margin-top: 10px;
  color: #fff;
  letter-spacing: 1px;
  font-family: 'Rubik', sans-serif;
}

.animation {
  animation-name: move;
  animation-duration: .4s;
  animation-fill-mode: both;
  animation-delay: 2s;
}

.a1 {
  animation-delay: 2s;
}

.a2 {
  animation-delay: 2.1s;
}

.a3 {
  animation-delay: 2.2s;
}

.a4 {
  animation-delay: 2.3s;
}

.a5 {
  animation-delay: 2.4s;
}

.a6 {
  animation-delay: 2.5s;
}

@keyframes move {
  0% {
    opacity: 0;
    visibility: hidden;
    transform: translateY(-40px);
  }

  100% {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }
}

@keyframes left {
  0% {
    opacity: 0;
    width: 0;
  }

  100% {
    opacity: 1;
    padding: 20px 40px;
    width: 440px;
  }
}
</style>