<script>
import { onMounted, reactive, ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import Tabulator from "tabulator-tables";
import Modal from "@/components/modal/Modal.vue";
import vSelect from "vue-select";
import { notify } from "@kyvg/vue3-notification";
export default {
  name: "Informes",
  components: { Modal, vSelect },

  setup() {
    const data = reactive({});
    const seleccionInforme = ref(1106);
    const store = useStore();
    const router = useRouter();
    var isModalVisible = ref(false);
    const idcursopac = ref("");
    const idalumno = ref("");
    const nombrecursopac = ref("");
    const añocursopac = ref("");
    const periodocursopac = ref("");

    var table;
    var ajaxConfig = {
      headers: {
        "Content-type": "application/json",
      },
      credentials: "include",
    };
    var tableAlumnos;
    const showModal = () => {
      tableAlumnos.setData(
        "http://localhost:3000/api/cursoalumnos/getalumnoscursopac",
        { idcursopac: idcursopac.value },
        ajaxConfig2
      );
      isModalVisible.value = true;
    };
    const closeModal = () => {
      idalumno.value = "";
      idcursopac.value = "";
      isModalVisible.value = false;
    };
    var ajaxConfig2 = {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      credentials: "include",
    };
    const InformePDF = async () => {
      const response = await fetch(
        "http://localhost:3000/api/informes/getpdf",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            idcursopac: idcursopac.value,
            idalumno: idalumno.value,
            informe: seleccionInforme.value,
          }),
        }
      )
        .then((response) => {
          if (response.ok) {
            return response.blob();
          }
          return Promise.reject(response);
        })
        .then((blob) => {
          var url = window.URL.createObjectURL(blob);
          var a = document.createElement("a");
          a.href = url;
          a.download = "Informe.pdf";
          document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
          a.click();
          a.remove(); //afterwards we remove the element again
          notify({
            title: "Informe generado correctamente 🎉",
            type: "success",
          });
        })
        .catch((error) => {
          notify({
            title: "Error, vea la consola para mas detalles 🎉",
            type: "error",
          });
        });
    };
    onMounted(async () => {
      var printIcon = function (cell, formatterParams, onRendered) {
        //plain text value
        return "<i class='fa fa-users'></i>";
      };
      var PdfIcon = function (cell, formatterParams, onRendered) {
        //plain text value
        return "<i class='fa fa-file-pdf'></i>";
      };
      var ExcelIcon = function (cell, formatterParams, onRendered) {
        //plain text value
        return "<i class='fa fa-file-excel'></i>";
      };
      var MailBulkIcon = function (cell, formatterParams, onRendered) {
        //plain text value
        return "<i class='fa fa-mail-bulk'></i>";
      };
      var MailIcon = function (cell, formatterParams, onRendered) {
        //plain text value
        return "<i class='fa fa-envelope'></i>";
      };
      table = new Tabulator("#example-table", {
        height: 820,
        pagination: "local",
        layout: "fitColumns",
        responsiveLayout: "hide",
        ajaxContentType: "json",
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
            title: "Curso",
            field: "curso.nombre",
            headerFilter: "input",
            headerFilterPlaceholder: "filtrar columna...",
            hozAlign: "center",
            headerHozAlign: "center",
          },
          {
            title: "Periodo",
            field: "nonyear",
            mutator: function (value, data, type, mutatorParams, cell) {
              return data.pac.year + " - " + data.pac.number;
            },
            headerFilter: "input",
            headerFilterPlaceholder: "filtrar columna...",
            hozAlign: "center",
            headerHozAlign: "center",
          },
          {
            title: "Profesor Jefe",
            field: "non",
            mutator: function (value, data, type, mutatorParams, cell) {
              return (
                data.idDocente.nombre +
                " " +
                data.idDocente.apellidoP +
                " " +
                data.idDocente.apellidoM
              );
            },
            headerFilter: "input",
            headerFilterPlaceholder: "filtrar columna...",
            hozAlign: "center",
            headerHozAlign: "center",
          },
          {
            title: "Correo",
            field: "idDocente.email",
            headerFilter: "input",
            headerFilterPlaceholder: "filtrar columna...",
            hozAlign: "center",
            headerHozAlign: "center",
            widthGrow: 3,
          },
          {
            title: "Rut",
            field: "idDocente.rut",
            headerFilter: "input",
            headerFilterPlaceholder: "filtrar columna...",
            hozAlign: "center",
            headerHozAlign: "center",
          },

          {
            formatter: printIcon,
            width: 40,
            hozAlign: "center",
            cellClick: function (e, cell) {
              idcursopac.value = cell.getRow().getData()._id;
              nombrecursopac.value = cell.getRow().getData().curso.nombre;
              añocursopac.value = cell.getRow().getData().pac.year;
              periodocursopac.value = cell.getRow().getData().pac.number;
              showModal();
            },
          },

          {
            formatter: PdfIcon,
            width: 40,
            hozAlign: "center",
            cellClick: function (e, cell) {
              idcursopac.value = cell.getRow().getData()._id;
              InformePDF();
            },
          },
          {
            formatter: MailBulkIcon,
            width: 40,
            hozAlign: "center",
            cellClick: function (e, cell) {
              alert(
                "Printing row data for: " + cell.getRow().getData().username
              );
            },
          },
        ],
      });
      table.setData(
        "http://localhost:3000/api/cursopacs/getall",
        {},
        ajaxConfig
      );

      tableAlumnos = new Tabulator("#tableAlumnos", {
        ajaxContentType: "json",
        height: 600,

       
        
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
            field: "idAlumno._id",
            visible: false,
          },

          {
            title: "Nombre",
            field: "idAlumno.nombre",
            headerFilter: "input",
            headerFilterPlaceholder: "filtrar columna...",
            
          },
          ,
          {
            title: "Apellido P",
            field: "idAlumno.apellidoP",
            headerFilter: "input",
            headerFilterPlaceholder: "filtrar columna...",
            
          },
          ,
          {
            title: "Apellido M",
            field: "idAlumno.apellidoM",
            headerFilter: "input",
            headerFilterPlaceholder: "filtrar columna...",
            
          },
          {
            title: "Rut",
            field: "idAlumno.rut",
            headerFilter: "input",
            headerFilterPlaceholder: "filtrar columna...",
           
          },

          {
            title: "Correo",
            field: "idAlumno.email",
            width:400,
            headerFilter: "input",
            headerFilterPlaceholder: "filtrar columna...",
            
          },
          {
            title: "Correo apoderado",
            field: "idAlumno.emailAp",
            headerFilter: "input",
            headerFilterPlaceholder: "filtrar columna...",
            
          },
          {
            formatter: PdfIcon,
            width: 40,
            hozAlign: "center",
            cellClick: function (e, cell) {
              idalumno.value = cell.getRow().getData().idAlumno._id;

              InformePDF();
            },
          },
          {
            formatter: MailIcon,
            width: 40,
            hozAlign: "center",
            cellClick: function (e, cell) {
              alert(
                "Printing row data for: " + cell.getRow().getData().username
              );
            },
          },
        ],
      });
    });
    return {
      data,
      seleccionInforme,
      ajaxConfig,
      isModalVisible,
      showModal,
      closeModal,
      ajaxConfig2,
      idcursopac,
      idalumno,
      nombrecursopac,
      periodocursopac,
      añocursopac,
      tableAlumnos,
      table,
      InformePDF,
    };
  },
};
</script>

<template>
  <div class="home">
    <div class="navbar"></div>
    <h1>Informes</h1>
    <h2>Seleccione que tipo de informe desea generar:</h2>
    <div class="selectdiv">
      <v-select
        class="select"
        :options="[
          { value: 1106, label: 'Informe Notas' },
          { value: 3104, label: 'Informe Personalidad' },
        ]"
        :reduce="(x) => x.value"
        placeholder="Seleccione el tipo de informe"
        v-model="seleccionInforme"
      >
        <template #search="{ attributes, events }">
          <input
            class="vs__search form-field"
            :required="!seleccionInforme"
            v-bind="attributes"
            v-on="events"
          />
        </template>
      </v-select>
    </div>

    <h3>Seleccione que accion tomar en la fila del curso correspondiente:</h3>
    <br />
    <div class="Table" id="example-table"></div>
  </div>
  <Modal class="" v-show="isModalVisible" @close="closeModal">
    <template v-slot:header> </template>

    <template v-slot:body>
      <form @submit.prevent="editSelected" class="editform">
        <div class="header">
          <h2>Seleccione un alumno para generar su informe:</h2>
          <h3>{{ nombrecursopac }} {{ añocursopac }}-{{ periodocursopac }}</h3>
        </div>
        <div class="form">
          <div class="TableModalInf" id="tableAlumnos"></div>
        </div>
      </form>
    </template>

    <template v-slot:footer> </template>
  </Modal>
</template>
<style src="../assets/tabulator_bootstrap4.min.css"></style>
<style src="../assets/vue-select.css"></style>
<style>
@import url("https://fonts.googleapis.com/css?family=Rubik:400,500&display=swap");

body {
  font-family: "Rubik", sans-serif;
}

.Table {
  margin: auto;
  width: 80vw;
}
.changepass {
  padding-left: 40vw;
}
.selectdiv {
  margin: auto;
  width: 50vw;
  background-color: white;
}

.navbar {
  display: flex;
  flex-direction: row;
  margin: auto;
  margin-bottom: 2vh;
  width: 80vw;
}

.vs__clear {
  visibility: hidden;
}
.modal{
  margin-left: 100px;
}
.TableModalInf {
  margin: auto;
  padding: 10px 20px;
  width: 65vw;
}
</style>
