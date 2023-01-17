<script>
import { onMounted, reactive, ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import Tabulator from "tabulator-tables";
import Modal from "@/components/modal/Modal.vue";
import vSelect from "vue-select";
export default {
  name: "Cursos",
  components: { Modal, vSelect },
  setup() {
    const data = reactive({});
    const store = useStore();
    const router = useRouter();
    var table;
    const idcursopac = ref("");
    var tableData = [];

    var ajaxConfig2 = {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      credentials: "include",
    };

    onMounted(async () => {
      var PersonalidadIcon = function (cell, formatterParams, onRendered) {
        return "<i class='fas fa-laugh'></i>";
      };
      var ajaxConfig = {
        headers: {
          "Content-type": "application/json",
        },
        credentials: "include",
      };
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
            editor: true,
            headerFilterPlaceholder: "filtrar columna...",
            hozAlign: "center",
            headerHozAlign: "center",
          },
          {
            title: "Correo",
            field: "idDocente.email",
            headerFilter: "input",
            headerFilterPlaceholder: "filtrar columna...",
            width:400,
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
            title: "VerPersonalidad",
            titleFormatter: PersonalidadIcon,
            formatter: PersonalidadIcon,
            tooltip: "Ver datos de personalidad curso",
            width: 70,
            hozAlign: "center",
            headerHozAlign: "center",
            headerSort: false,
            cellClick: async function (e, cell) {              
              await store.dispatch("setCursoPac", { cursoPac: cell.getRow().getData()});
              router.push("personalidadcurso");
            },
          },
        ],
      });

      table.setData(
        "http://localhost:3000/api/cursopacs/getdisponibles",
        {},
        ajaxConfig
      );
    });
    return {
      data,

      tableData,
      idcursopac,
    };
  },
};
</script>

<template>
  <div class="home">
    <div class="navbar"></div>
    <h1>Seleccione un curso para ver los datos de personalidad de este</h1>
    <br />
    <div class="Table" id="example-table"></div>
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
  width: 75vw;
}
.changepass {
  padding-left: 40vw;
}

.navbar {
  display: flex;
  flex-direction: row;
  margin: auto;
  margin-bottom: 2vh;
  width: 80vw;
}

</style>
