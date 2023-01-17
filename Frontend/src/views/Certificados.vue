<script>
import { onMounted, reactive, ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import Tabulator from "tabulator-tables";
import Modal from "@/components/modal/Modal.vue";
import vSelect from "vue-select";
import { notify } from "@kyvg/vue3-notification";
export default {
  name: "Certificados",
  components: { Modal, vSelect },

  setup() {
    var isModalVisible = ref(false);
    var ajaxConfig = {
      headers: {
        "Content-type": "application/json",
      },
      credentials: "include",
    };
    var periodos =  ref([]);
    const periodoSeleccionado =  ref('');
    const seleccionCertificado =  ref('');
    const seleccionMotivo =  ref('');
    const store = useStore();
    const router = useRouter();
  


    const SolicitudCertificado = async () => {
     
      const response = await fetch(
        "http://localhost:3000/api/certificados/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
           
          body: JSON.stringify({certificado:seleccionCertificado.value,idpac:periodoSeleccionado.value,motivo:seleccionMotivo.value}),
        }
      ).then((response) => {
          if (response.ok) {
            return response.blob();
          }
          return Promise.reject(response);
        })
        .then((blob) => {
          var url = window.URL.createObjectURL(blob);
          var a = document.createElement("a");
          a.href = url;
          a.download = "Certificado.pdf";
          document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
          a.click();
          a.remove(); //afterwards we remove the element again
          notify({
            title: "Certificado generado correctamente 🎉",
            type: "success",
          });
        })
        .catch((error) => {
          notify({
            title: "Error, vea la consola para mas detalles 🎉",
            type: "error",
          });
        });
      
      }
    onMounted(async () => {
      const response = await fetch("http://localhost:3000/api/cursoalumnos/getperiodos", {
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      periodos.value = await response.json();

      

      
    });
    return {     
      ajaxConfig,
      seleccionCertificado,
      periodos,
      periodoSeleccionado,
      SolicitudCertificado,
      seleccionMotivo,
    };
  },
};
</script>



<template>
  <div class="certificados">    
    <h1>Solicitud Certificados</h1>
    <h2>Por favor, seleccione que tipo de certificado desea solicitar:</h2>
     <v-select
          class="select"
          :options="[{value:106, label :'Certificado alumno regular'},{value:304, label :'Certificado concentracion notas'}]"   
          :reduce="x => x.value"       
          placeholder="Seleccione el tipo de certificado"
          v-model="seleccionCertificado"
        >    
      <template #search="{ attributes, events }">
            <input
              class="vs__search form-field"
              :required="!seleccionCertificado"
              v-bind="attributes"
              v-on="events"
            />
          </template>      
      </v-select>
      <v-select
          class="select"
          v-if="seleccionCertificado !==''"
          :options=periodos
          :reduce="x => x.idPac" 
          label="year"
          placeholder="Seleccione el periodo academico"
          v-model="periodoSeleccionado"
        >          
        <template #option="{ year, type, number}">
            <p style="margin: 0">
              {{ year }} {{ type }} {{ number }} 
            </p>
          </template>
          <template #selected-option="{ year, type, number}">
            <p style="margin: 0">
             {{ year }} {{ type }} {{ number }}            
            </p>
          </template>
          <template #search="{ attributes, events }">
            <input
              class="vs__search form-field"
              :required="!periodoSeleccionado"
              v-bind="attributes"
              v-on="events"
            />
          </template>
          
      </v-select>
      <v-select
          class="select"
          :options="['Fondo Nacional de Salud FONASA','Junta Nacional de Auxilio Escolar y Becas JUNAEB','Ministerio de Educación MINEDUC','Trabajo apoderados','Postulacion Becas']"      
          placeholder="Seleccione el motivo del certificado (Opcional)"
          v-model="seleccionMotivo"
          v-if="seleccionCertificado === 106"
        >        
        <template #search="{ attributes, events }">
            <input
              class="vs__search form-field"             
              v-bind="attributes"
              v-on="events"
            />
          </template>    
      </v-select>
    <button class="button-36" @click="SolicitudCertificado" v-if="periodoSeleccionado !==''">Generar certificado</button>

    
  </div>
</template>
<style src="../assets/tabulator_bootstrap4.min.css"></style>

<style src="../assets/vue-select.css"></style>
<style>
@import url("https://fonts.googleapis.com/css?family=Rubik:400,500&display=swap");

body {
  font-family: "Rubik", sans-serif;
}
.certificados{
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  margin: auto;
  padding: 250px;
  width: 40vw;
}
.form-field{
  width: 20vw;
}
.select{
  margin-bottom: 10px;  
}
.button-36{
  margin-top: 20px;
  align-self: center;
}

</style>