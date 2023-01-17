<script>
import { onMounted, reactive, ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import Tabulator from "tabulator-tables";
import Modal from "@/components/modal/Modal.vue";
import { notify } from "@kyvg/vue3-notification";
import vSelect from "vue-select";
export default {
  name: "Pac",
  components: { Modal, vSelect },

  setup() {
    const data = reactive({
      year: "",
      type: "",
      number: "",
      fechaInicio:"",
      fechaFin:"",
    });
    const store = useStore();
    const router = useRouter();
    var ajaxConfig = {
        headers: {
          "Content-type": "application/json",
        },
        credentials: "include",
      };
    var table;
    const ultimoYear = ref("");
    const ultimoNumber = ref("");
    const ultimoType = ref("");
    var isModalVisible = ref(false);
    const crearPac = async () => {
      const response = await fetch("http://localhost:3000/api/pacs/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (response.status === 200) {
        notify({
            title: "Creacion de periodo academico exitosa 🎉",
            type: "success",
          });    

       table.setData("http://localhost:3000/api/pacs/getall", {}, ajaxConfig);
      closeModal();
      } else {
        notify({
            title: "Error, vea la consola para mas detalles 🎉",
            type: "error",
          });
      }
    };
    const showModal = () => {
      if (table.getDataCount() != 0) {
        ultimoYear.value = table.getRowFromPosition(0).getData().year;
        ultimoType.value = table.getRowFromPosition(0).getData().type;
        ultimoNumber.value = table.getRowFromPosition(0).getData().number;
      }
      isModalVisible.value = true;
    };
    const closeModal = () => {
      isModalVisible.value = false;
    };
    onMounted(async () => {      

      
      table = new Tabulator("#example-table", {
        height: 600,
        pagination: "local",
        layout: "fitColumns",
        responsiveLayout: "hide",
        langs:{
        "default":{
            "pagination":{
                "first":"Primero", //text for the first page button
                "first_title":"Primera pagina", //tooltip text for the first page button
                "last":"Ultimo",
                "last_title":"Ultima pagina",
                "prev":"Ant.",
                "prev_title":"Pagina anterior",
                "next":"Sig.",
                "next_title":"Pagina siguiente",
            },
        }
      },
        columns: [
          {
            title: "ID",
            field: "_id",
            visible: false,
          },
          {
            title: "Año",
            field: "year",
            headerFilter: "input",
            headerFilterPlaceholder: "filtrar columna...",
            editor: true,
            hozAlign: "center",
            headerHozAlign: "center",
          },
          {
            title: "Periodo",
            field: "number",
            headerFilter: "input",
            headerFilterPlaceholder: "filtrar columna...",
            editor: true,
            hozAlign: "center",
            headerHozAlign: "center",
          },
          {
            title: "Tipo",
            field: "type",
            headerFilter: "input",
            headerFilterPlaceholder: "filtrar columna...",
            editor: true,
            hozAlign: "center",
            headerHozAlign: "center",
          },
        ],
      });
      table.setData("http://localhost:3000/api/pacs/getall", {}, ajaxConfig);
    });
    return {
      data,
      ultimoYear,
      ultimoType,
      ultimoNumber,
      isModalVisible,
      showModal,
      closeModal,
      crearPac,
      ajaxConfig,
    };
  },
};
</script>

<template>
  <div class="home">
    <div class="navbar">
      <button class="button-36" @click="showModal">
        Nuevo Periodo Academico
      </button>
    </div>
    <br />
    <div class="Table" id="example-table"></div>
  </div>
  <Modal v-show="isModalVisible" @close="closeModal">
    <template v-slot:header> </template>
    <template v-slot:body>
      <form @submit.prevent="crearPac" class="editform">
        <div class="header">
          <h2>Nuevo periodo academico</h2>
          <h2>{{data.fechaInicio}}  {{data.fechaFin}}</h2>
          <h4>
            Ingrese los datos para registrar un nuevo periodo academico junto a
            sus cursos
          </h4>
        </div>
        <h4>
          Ultimo periodo registrado: {{ ultimoYear }} {{ ultimoType }}
          {{ ultimoNumber }}
        </h4>
        <div class="form">
          <h3>Ingrese año</h3>
          <input
            class="form-field"
            type="number"
            v-model="data.year"
            :min="ultimoYear"
            :placeholder="ultimoYear"
          />
          <h3>Ingrese numero periodo</h3>
          <input class="form-field" type="number" v-model="data.number" required/>
          <h3>Ingrese tipo de periodo</h3>
          <v-select
            :options="['semestre', 'trimestre', 'otro']"
            placeholder="Ingrese formato periodo"
            v-model="data.type"
          ></v-select>
          <h3>Ingrese la fecha de inicio del periodo</h3>
          <input
            class="form-field"
            type="date"                    
            :min="data.year+'-01-01'"
            :max="data.year+'-12-31'"
            v-model="data.fechaInicio"
            required
          />
          <h3>Ingrese la fecha de termino del periodo</h3>
          <input
            class="form-field"
            type="date"                      
            :min= data.fechaInicio
            :max="data.year+'-12-31'"
            v-model="data.fechaFin"
            required
          />
          <input class="button-36 buttoncreatepac" type="submit" value="Registrar nuevo PAC" />
        </div>
      </form>
    </template>

    <template v-slot:footer> </template>
  </Modal>
</template>

<style src="../assets/tabulator_bootstrap4.min.css"></style>
<style>
@import "https://unpkg.com/vue-select@latest/dist/vue-select.css";
</style>
<style>
@import url("https://fonts.googleapis.com/css?family=Rubik:400,500&display=swap");

body {
  font-family: "Rubik", sans-serif;
}

.Table {
  margin: auto;
  width: 80vw;
}

.navbar {
  display: flex;
  flex-direction: row;
  margin: auto;
  margin-bottom: 2vh;
  width: 80vw;
}
.buttoncreatepac{
  align-self: center;
  width: 20vw;
  margin-top: 20px;
}
</style>
