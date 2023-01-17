<script>
import { onMounted, reactive, ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import Tabulator from "tabulator-tables";
import Modal from "@/components/modal/Modal.vue";
import vSelect from "vue-select";
import { notify } from "@kyvg/vue3-notification";
export default {
  name: "Usuarios",
  components: { Modal, vSelect },

  setup() {
    var isModalVisible = ref(false);
    var ajaxConfig = {
      headers: {
        "Content-type": "application/json",
      },
      credentials: "include",
    };
    const comunas = ref([]);
    const modalData = reactive({
      _id: "",
      nombre: "",
      apellidoP: "",
      apellidoM: "",
      email: "",
      emailAp: "",
      telefono: "",
      rut: "",
      rol: "",
      comuna: "",
    });
    const clearModaldata = () => {
      _id = "";
      nombre = "";
      apellidoP = "";
      apellidoM = "";
      email = "";
      emailAp = "";
      telefono = "";
      rut = "";
      rol = "";
      comuna = "";
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
      let result = [];
      let editedCells = table.getEditedCells();
      editedCells.map(function (x) {
        let row = x.getRow().getData();
        result.push({
          _id: row._id,
          nombre: row.nombre,
          apellidoP: row.apellidoP,
          apellidoM: row.apellidoM,
          email: row.email,
          emailAp: row.emailAp,
          telefono: row.telefono,
          rut: row.rut,
          rol: row.rol.nombre,
          comuna: row.idComuna.nombre,
        });
      });

      const response = await fetch(
        "http://localhost:3000/api/users/updateusers",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(result),
        }
      );
      if (response.status === 200) {
        notify({
            title: "Actualizacion de usuarios exitosa 🎉",
            type: "success",
          });        
      } else {
        notify({
            title: "Error, vea la consola para mas detalles 🎉",
            type: "error",
          });
      }
      table.setData("http://localhost:3000/api/users/getusers", {}, ajaxConfig);
    };
    const editSelected = async () => {
      let result = [];
      result.push(modalData);
      const response = await fetch(
        "http://localhost:3000/api/users/updateusers",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(result),
        }
      );
      if (response.status === 200) {
        notify({
            title: "Actualizacion de usuarios exitosa 🎉",
            type: "success",
          });    
        table.setData(
          "http://localhost:3000/api/users/getusers",
          {},
          ajaxConfig
        );
        closeModal();
      } else {
        notify({
            title: "Error, vea la consola para mas detalles 🎉",
            type: "error",
          });
      }
    };
    onMounted(async () => {
      const response = await fetch("http://localhost:3000/api/comunas/getall", {
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      comunas.value = await response.json();

      var editIcon = function (cell, formatterParams, onRendered) {
        //plain text value
        return "<i class='fa fa-edit'></i>";
      };

      table = new Tabulator("#example-table", {
        height: 800,
        pagination: "local",
        //layout: "fitColumns",
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
            title: "Apellido P.",
            field: "apellidoP",
            headerFilter: "input",
            headerFilterPlaceholder: "filtrar columna...",
            editor: true,
          },
          {
            title: "Apellido M.",
            field: "apellidoM",
            headerFilter: "input",
            headerFilterPlaceholder: "filtrar columna...",
            editor: true,
          },
          {
            title: "Email",
            field: "email",
            headerFilter: "input",
            headerFilterPlaceholder: "filtrar columna...",
            editor: true,
          },
          {
            title: "RUT",
            field: "rut",
            headerFilter: "input",
            headerFilterPlaceholder: "filtrar columna...",
            editor: true,
          },
          {
            title: "Email apoderado",
            field: "emailAp",
            headerFilter: "input",
            headerFilterPlaceholder: "filtrar columna...",
            editor: true,
          },
          {
            title: "Telefono",
            field: "telefono",
            headerFilter: "input",
            headerFilterPlaceholder: "filtrar columna...",
            editor: true,
          },
          {
            title: "Comuna",
            field: "idComuna.nombre",
            headerFilter: "input",
            headerFilterPlaceholder: "filtrar columna...",
          },
          {
            title: "Rol",
            field: "rol.nombre",
            headerFilter: "select",
            headerFilterPlaceholder: "filtrar columna...",
            headerFilterParams: { values: true },
            editor: "select",
            editorParams: {
              values: true, //create list of values from all values contained in this column
              sortValuesList: "asc", //if creating a list of values from values:true then choose how it should be sorted
              defaultValue: "usuario", //set the value that should be selected by default if the cells value is undefined
              elementAttributes: {
                maxlength: "10", //set the maximum character length of the input element to 10 characters
              },
              verticalNavigation: "hybrid", //navigate to new row when at the top or bottom of the selection list
            },
          },
          {
            formatter: editIcon,
            width: 40,
            hozAlign: "center",
            cellClick: function (e, cell) {
              (modalData._id = cell.getRow().getData()._id),
                (modalData.nombre = cell.getRow().getData().nombre),
                (modalData.apellidoP = cell.getRow().getData().apellidoP),
                (modalData.apellidoM = cell.getRow().getData().apellidoM),
                (modalData.email = cell.getRow().getData().email),
                (modalData.emailAp = cell.getRow().getData().emailAp),
                (modalData.telefono = cell.getRow().getData().telefono),
                (modalData.rut = cell.getRow().getData().rut),
                (modalData.rol = cell.getRow().getData().rol.nombre),
                (modalData.comuna = cell.getRow().getData().idComuna.nombre),
                showModal();
            },
          },
        ],
      });
      table.setData("http://localhost:3000/api/users/getusers", {}, ajaxConfig);
    });
    return {
      modalData,
      clearModaldata,
      isModalVisible,
      ajaxConfig,
      showModal,
      closeModal,
      editTable,
      editSelected,
      comunas,
    };
  },
};
</script>



<template>
  <div class="home">
    <div class="navbar">
      <button
        class="button-36"
        @click="$router.push('/usuarios/crearusuarios')"
      >
        Registrar Usuario
      </button>
      <button class="button-36" @click="editTable">Modificacion Masiva</button>
    </div>

    <div class="Table" id="example-table"></div>
    <Modal v-show="isModalVisible" @close="closeModal">
      <template v-slot:header> </template>

      <template v-slot:body>
        <form @submit.prevent="editSelected" class="formuusuario">
          <div class="header">
            <h2>Editar datos usuario</h2>
            <h4>modifique los datos del usuario selecionado</h4>
          </div>
          <div class="form">
            <div class="nombre_completo">
              <input
                v-model="modalData.nombre"
                type="text"
                class="form-field"
                required="true"
                placeholder="Ingrese nombre usuario"
              />
              <input
                v-model="modalData.apellidoP"
                type="text"
                class="form-field"
                required="true"
                placeholder="Ingrese apellido paterno"
              />
              <input
                v-model="modalData.apellidoM"
                type="text"
                class="form-field"
                required="true"
                placeholder="Ingrese apellido materno"
              />
            </div>

            <input
              v-model="modalData.rut"
              type="text"
              class="form-field"
              required="true"
              placeholder="Ingrese su rut"
            />
            <input
              v-model="modalData.email"
              type="email"
              class="form-field"
              required="true"
              placeholder="Ingrese su Correo"
            />
            <input
              v-model="modalData.emailAp"
              type="email"
              class="form-field"
              placeholder="Ingrese correo contacto apoderado"
            />
            <input
              v-model="modalData.telefono"
              type="text"
              class="form-field"
              placeholder="Ingrese telefono contacto"
            />

            <h5>Selecione rol:</h5>
            <v-select
              :options="['usuario', 'docente', 'coordinador', 'administrador']"
              placeholder="Ingrese rol usuario"
              v-model="modalData.rol"
            >
            </v-select>
            <h5>Selecione comuna:</h5>
            <v-select
              :options="comunas"
              label="nombre"
              placeholder="Ingrese comuna"
              v-model="modalData.comuna"
            >
            </v-select>

            <button class="button-36 confirmarusuario">Confirmar cambios</button>
          </div>
        </form>
      </template>

      <template v-slot:footer> </template>
    </Modal>
  </div>
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

.formuusuario {
  width: 40vw;
}
.nombre_completo {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.nombre_completo input{
  width: 11vw;
}
.navbar {
  display: flex;
  flex-direction: row;
  margin: auto;
  margin-bottom: 2vh;
  width: 80vw;
}
.confirmarusuario{
  align-self: center;
  width: 20vw;
  margin-top:30px
}
</style>