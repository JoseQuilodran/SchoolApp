<script>
import { onMounted, reactive, ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import Tabulator from "tabulator-tables";
import Modal from "@/components/modal/Modal.vue";
import vSelect from "vue-select";
import { notify } from "@kyvg/vue3-notification";
export default {
  name: "RegistroAsignatura",
  components: { Modal, vSelect },

  setup() {
    var isModalVisible = ref(false);
    var ajaxConfig = {
      headers: {
        "Content-type": "application/json",
      },
      credentials: "include",
    };    
    const modalData = reactive({      
      nombre: "",
      codigo: "",      
    });
    const clearModaldata = () => {
      nombre = "";
      codigo = "";     
    };
    const store = useStore();
    const router = useRouter();
    var table;
    const showModal = () => {
      isModalVisible.value = true;
    };
    const closeModal = () => {
      isModalVisible.value = false;
    };
    const editTable = async () => {
      let asignaturas = [];
      let editedCells = table.getEditedCells();
      editedCells.map(function (x) {
        let row = x.getRow().getData();
        asignaturas.push({
          _id: row._id,
          nombre: row.nombre,
          codigo: row.codigo,
        });
      });

      const response = await fetch(
        "http://localhost:3000/api/asignaturas/update",
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(asignaturas),
        }
      );
      if (response.status === 200) {
        notify({
            title: "Actualizacion de asignaturas base exitosa 🎉",
            type: "success",
          });
        
      } else {
        notify({
            title: "Error, vea la consola para mas detalles",
            type: "error",
          });
      }
      table.setData("http://localhost:3000/api/asignaturas/getall", {}, ajaxConfig);
    };
    const createAsignatura = async () => {
      const response = await fetch(
        "http://localhost:3000/api/asignaturas/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(modalData),
        }
      );
      if (response.status === 200) {
        notify({
            title: "Creacion asignatura exitosa 🎉",
            type: "success",
          });
        
        table.setData("http://localhost:3000/api/asignaturas/getall", {}, ajaxConfig);
        closeModal();
      } else {
        notify({
            title: "Error, vea la consola para mas detalles 🎉",
            type: "error",
          });
      }
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
            title: "Nombre",
            field: "nombre",
            headerFilter: "input",
            headerFilterPlaceholder: "filtrar columna...",
            editor: true,
          },
          {
            title: "Codigo.",
            field: "codigo",
            headerFilter: "input",
            headerFilterPlaceholder: "filtrar columna...",
            editor: true,
          },
          
        ],
      });
      table.setData("http://localhost:3000/api/asignaturas/getall", {}, ajaxConfig);
    });
    return {
      modalData,
      clearModaldata,
      isModalVisible,
      ajaxConfig,
      createAsignatura,
      showModal,
      closeModal,
      editTable,      
    };
  },
};
</script>



<template>
  <div class="home" >
    <div class="navbar">
      <button
        class="button-36"
        @click="showModal"
      >
        Registrar nueva asignatura
      </button>
      <button class="button-36" @click="editTable">Modificacion Masiva</button>
    </div>

    <div class="Table" id="example-table"></div>
    <Modal v-show="isModalVisible" @close="closeModal">
      <template v-slot:header> </template>

      <template v-slot:body>
        <form @submit.prevent="createAsignatura" class="formulario">
          <div class="header">
            <h2>Registrar nueva asignatura</h2>
            <h4>Ingrese los datos de la nueva asignatura base</h4>
          </div>
          <div class="form">            
              <input
                v-model="modalData.nombre"
                type="text"
                class="form-field"
                required="true"
                placeholder="Ingrese nombre completo asignatura"
              />
              <input
                v-model="modalData.codigo"
                type="text"
                class="form-field"
                required="true"
                placeholder="Ingrese codigo unico asignatura"
              />       
                 
              <button class="button-36 regasigbutton">Confirmar registro</button>
          </div>
        </form>
      </template>

      <template v-slot:footer> </template>
    </Modal>
  </div>
</template>

<style>
@import url("https://fonts.googleapis.com/css?family=Rubik:400,500&display=swap");

body {
  font-family: "Rubik", sans-serif;
}

.Table {
  margin: auto;
  width: 80vw;
}

.formulario {
  width: 40vw;
}
.nombre_completo {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.regasigbutton{
  width: 20vw;
  align-self: center;
  margin-top: 30px;
}
</style>