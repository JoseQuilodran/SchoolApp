<script>
import { onMounted, reactive ,ref} from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import Vue from 'vue'
import vSelect from 'vue-select'
import { notify } from "@kyvg/vue3-notification";

export default {
  name: "Crearusuarios",
  components: {vSelect },
  
  setup() {
    const data = reactive({
      nombre: "",
      apellidoP: "",
      apellidoM:"",
      email:"",
      emailAp:"",
      telefono:"",
      rut: "",
      password: "",
      repeatpassword: "",
      rol: "",
      comuna:"",      
    });
    const comunas=ref();
    const store = useStore();
    const texto = store.state.user;
    const router = useRouter();
    onMounted(
      async () => {
      const response = await fetch("http://localhost:3000/api/comunas/getall", {
        headers: { "Content-Type": "application/json" },
        credentials: "include",        
      });
      comunas.value = await response.json();

    });
    const submit = async () => {
      const response = await fetch("http://localhost:3000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          nombre: data.nombre,
          apellidoP: data.apellidoP,
          apellidoM: data.apellidoM,
          email: data.email,
          emailAp: data.emailAp,
          telefono:data.telefono,
          rut: data.rut,
          password: data.password,
          repeatpassword: data.repeatpassword,
          rol: data.rol,
          comuna:data.comuna.nombre,
        }),
      });

      if (response.status === 200) {
        notify({
          title: "Registro de usuario exitoso 🎉",
          type: "success",
        });
        router.push("/usuarios")
      } else {
        notify({
          title: "Error, vea la consola para mas detalles 🎉",
          type: "error",
        });
      }
    };
    return {
      data,
      texto,
      submit,
      comunas,
    };
  },
};
</script>



<template>
  <div class="home">    
      <form @submit.prevent="submit" class="newuserform">
        <div class="header">
          <h1>Registrar Nuevo Usuario</h1>
          <h4>Escriba los datos del nuevo usuario</h4>
        </div>
        <div class="form">
          <input
            v-model="data.nombre"
            type="text"
            class="form-field"
            required="true"
            placeholder="Ingrese nombre usuario"
          />
          <input
            v-model="data.apellidoP"
            type="text"
            class="form-field"
            required="true"
            placeholder="Ingrese apellido paterno"
          />
          <input
            v-model="data.apellidoM"
            type="text"
            class="form-field"
            required="true"
            placeholder="Ingrese apellido materno"
          />
          <input
            v-model="data.rut"
            type="text"
            class="form-field"
            required="true"
            placeholder="Ingrese su rut"
            pattern="[1-9][0-9]{6,9}-[\dkK]"
          />
          <input
            v-model="data.email"
            type="email"
            class="form-field"
            required="true"
            placeholder="Ingrese su Correo"
          />
          <input
            v-model="data.emailAp"
            type="email"
            class="form-field"         
            placeholder="Ingrese correo contacto apoderado"
          />
          <input
            v-model="data.telefono"
            type="text"
            class="form-field"            
            placeholder="Ingrese telefono contacto"
          />          
          <input
            v-model="data.password"
            type="password"
            class="form-field"
            required="true"
            placeholder="Ingrese su Contraseña"
          />
          <input
            v-model="data.repeatpassword"
            type="password"
            class="form-field"
            required="true"
            placeholder="Repita su Contraseña"
          />
          <br>
         <h5>Selecione rol:</h5>
         <v-select :options="['usuario', 'docente', 'coordinador']" placeholder="Ingrese rol usuario" v-model="data.rol">
          <template #search="{attributes, events}">
            <input
              class="vs__search"
              :required="!data.rol"
              v-bind="attributes"
              v-on="events"
            />
          </template>
        </v-select>                        
        <h5>Selecione comuna:</h5>          
         <v-select :options=comunas label="nombre"  placeholder="Ingrese comuna" v-model="data.comuna">
          <template #search="{attributes, events}">
            <input
              class="vs__search"
              :required="!data.comuna"
              v-bind="attributes"
              v-on="events"
            />
          </template>
        </v-select>

          <button class="button-36 buttoncu">Confirmar creacion usuario</button>
        </div>
      </form>
      
    
  </div>
</template>
<style scoped src="../../assets/css/form.css"></style>

<style>
@import 'https://unpkg.com/vue-select@latest/dist/vue-select.css';
</style>
<style scoped>

body {
  font-family: "Rubik", sans-serif;
}
.newuserform{  
  width: 50vw;
  margin: auto;
  margin-top: 5vh;
}
.v-select{
  background-color: rgb(243, 243, 243);
}
.newuserform h5{ 
  text-align: left;
}
.buttoncu{
  align-self: center;
  margin-top: 20px;
}

</style>