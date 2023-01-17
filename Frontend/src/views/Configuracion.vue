<script>
import { onMounted, reactive } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

export default {
  name: "Home",
  setup() {
    const data = reactive({
      password: "",
      repeatpassword: "",
    });
    const store = useStore();
    const texto = store.state.user;
    const router = useRouter();
    const submit = async () => {
      const response = await fetch(
        "http://localhost:3000/api/auth/changepass",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            password: data.password,
            repeatpassword: data.repeatpassword,
          }),
        }
      );
      await router.push("/");
    };
    return {
      data,
      texto,
      submit,
    };
  },
};
</script>



<template>
  <div class="masterlocal" >
    <div class="leftlocal">
      <img src="../assets/logo.png" alt="Avatar" > 
      <h1>{{texto.nombre}} {{texto.apellidoP}} {{texto.apellidoM}}</h1>
      <p><strong>Email: </strong>{{texto.email}}</p>
      <p><strong>RUT: </strong>{{texto.rut}}</p>    
      <p><strong>Telefono: </strong>{{texto.telefono}}</p>
      <p><strong>Correo apoderado: </strong>{{texto.emailAp}}</p>     
    </div>
    
    
    <div class="rightlocal">
      <form @submit.prevent="submit"  class="form">
        <div class="header">
          <h2 class="a1">Cambiar Contraseña</h2>
          <h4 class="a2">Escriba su nueva Contraseña</h4>
        </div>
        
          <input 
            v-model="data.password"
            type="password"
            class="form-field "
            required="true"
            placeholder="Ingrese su Contraseña"
          />
          <input
            v-model="data.repeatpassword"
            type="password"
            class="form-field "
            required="true"
            placeholder="Repita su Contraseña"
          />

          <button class="button-36 buttonconfig">Confirmar nueva contraseña</button>
      </form>
    </div>
  </div>
</template>
<style scoped src="../assets/css/form.css"></style>
<style scoped>
@import url("https://fonts.googleapis.com/css?family=Rubik:400,500&display=swap");

body {
  font-family: "Rubik", sans-serif;
}
.masterlocal{
  display:flex;
  flex-direction: row;  
  padding: 50px;
  background-color: rgba(255, 153, 0, 0.164);
  justify-content: space-evenly;
  margin: auto;
  margin-top: 20vh;
  flex-wrap: wrap;
  width: 80vw;
}
.leftlocal{
  display: flex;
  flex-direction: column;  
  align-items: center;
  background-color: rgba(127, 255, 212, 0);
  width: 40vw;
}
.leftlocal img{
  border-radius: 50%;
  background-color: rgba(245, 245, 220, 0);
  width: auto;
  height: 10vw;
}
.rightlocal{
  background-color: rgba(0, 255, 255, 0);
  width: 40vw;
}
.rightlocal form{
  display: flex;
  align-items: center;  
  flex-direction: column;
  margin-top: 100px;
  
  width: 40vw;
}

.form-field{
  width: 30vw;
}
.buttonconfig{
  margin-top: 20px;
}
</style>