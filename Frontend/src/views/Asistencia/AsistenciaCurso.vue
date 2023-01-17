<script>
import { onMounted, reactive, ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import Tabulator from "tabulator-tables";
import Modal from "@/components/modal/Modal.vue";
import vSelect from "vue-select";
import { notify } from "@kyvg/vue3-notification";
export default {
  name: "Asignaturas",
  components: { Modal, vSelect },

  setup() {
    var isModalVisible = ref(false);
    const data = reactive({});
    const store = useStore();
    const router = useRouter();
    var fecha = ref("");
    var fechaFormateada = ref("");
    var minPeriodo = ref("");
    var maxPeriodo = ref("");
    var table;
    var estadosAsistencia = [
        {
          value: 0,
          label: "N/C",
        },
        {
          value: 1,
          label: "Presente",
        },
        {
          value: 2,
          label: "Ausente",
        },
        {
          value: 3,
          label: "Justificado",
        },
      ];
    var ajaxConfig2 = {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      credentials: "include",
    };
    const editTable = async () => {
      let result = [];
      let editedCells = table.getEditedCells();
      editedCells.map(function (x) {
        let row = x.getRow().getData();
        result.push({
          _id: row.idAlumno._id,
          semana: [
            row.estadoSemana[0],
            row.estadoSemana[1],
            row.estadoSemana[2],
            row.estadoSemana[3],
            row.estadoSemana[4],
            row.estadoSemana[5],
            row.estadoSemana[6],
          ],
        });
      });

      const response = await fetch("http://localhost:3000/api/asiste/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          fecha: fecha.value,
          idCursoPac: store.state.cursoPac._id,
          asistencia: result,
        }),
      });
      if (response.status === 200) {
        notify({
          title: "Actualizacion de notas exitosa 🎉",
          type: "success",
        });
        table
        .setData(
          "http://localhost:3000/api/asiste/getasistesemana",
          { idCursoPac: store.state.cursoPac._id, fecha: store.state.fecha },
          ajaxConfig2
        )
        .then(() => {
          fecha.value = table.getRowFromPosition(0).getData().fechaSemana;
          fechaFormateada.value = new Date(fecha.value)
            .toISOString()
            .slice(0, 10);
          minPeriodo.value = new Date(store.state.cursoPac.pac.fechaInicio)
            .toISOString()
            .slice(0, 10);
          maxPeriodo.value = new Date(store.state.cursoPac.pac.fechaFin)
            .toISOString()
            .slice(0, 10);
        });
      } else {
        notify({
          title: "Error, vea la consola para mas detalles 🎉",
          type: "error",
        });
      }
    };
    const irFecha = () => {
      store.dispatch("setFecha", { fecha: fechaFormateada });
      table
        .setData(
          "http://localhost:3000/api/asiste/getasistesemana",
          { idCursoPac: store.state.cursoPac._id, fecha: store.state.fecha },
          ajaxConfig2
        )
        .then(() => {
          fecha.value = table.getRowFromPosition(0).getData().fechaSemana;
          fechaFormateada.value = new Date(fecha.value)
            .toISOString()
            .slice(0, 10);
        });
    };
    onMounted(async () => {
      var printIcon = function (cell, formatterParams, onRendered) {
        //plain text value
        return "<i class='fa fa-users'></i>";
      };
      var notasIcon = function (cell, formatterParams, onRendered) {
        //plain text value
        return "<i class='fa fa-pencil-ruler'></i>";
      };
      var ajaxConfig = {
        headers: {
          "Content-type": "application/json",
        },
        credentials: "include",
      };
      var headerMenu = [
        {
          label: "Editar evaluacion",
          action: function (e, column) {},
        },
      ];
      function asisteLookup(cell) {
         var val = cell.getValue();
          
        let x = estadosAsistencia.find((element) => element.value == val);
        switch (x.label) {
          case 'Presente':
            cell.getElement().style.backgroundColor = "#99ff33";
            break;
          case 'Ausente':
            cell.getElement().style.backgroundColor = "#ff7575";
            break;
          case 'Justificado':
            cell.getElement().style.backgroundColor = "#d3ff75";
            break;
          default:
            break;
        }
        return x.label;
      
      }
      
      
      table = new Tabulator("#example-table", {
        
        
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
        ajaxContentType: "json",

        columns: [
          {
            title: "ID",
            field: "_id",
            visible: false,
          },
          {
            title: "Nombre",
            field: "idAlumno.nombre",
            headerFilter: "input",
            headerFilterPlaceholder: "filtrar columna...",
          },
          {
            title: "Apellido P.",
            field: "idAlumno.apellidoP",
            headerFilter: "input",
            headerFilterPlaceholder: "filtrar columna...",
          },
          {
            title: "Apellido M.",
            field: "idAlumno.apellidoM",
            headerFilter: "input",
            headerFilterPlaceholder: "filtrar columna...",
          },
          {
            title: "RUT",
            field: "idAlumno.rut",
            headerFilter: "input",
            headerFilterPlaceholder: "filtrar columna...",
          },

          {
            title: "Lunes",
            editor: "select",
            field: "estadoSemana.0",
            editorParams: {
              values: estadosAsistencia,             
            },
            hozAlign: "center",
            headerHozAlign: "center",
            formatter: asisteLookup,
          },
          ,
          {
            title: "Martes",
            editor: "select",
            field: "estadoSemana.1",
            editorParams: {
              values: estadosAsistencia,             
            },
            hozAlign: "center",
            headerHozAlign: "center",
            formatter: asisteLookup,
          },
          {
            title: "Miercoles",
            field: "estadoSemana.2",
            editor: "select",
            editorParams: {
              values: estadosAsistencia,             
            },
            hozAlign: "center",
            headerHozAlign: "center",
            formatter: asisteLookup,
          },

          {
            title: "Jueves",
            field: "estadoSemana.3",
            editor: "select",
            editorParams: {
              values: estadosAsistencia,             
            },
            hozAlign: "center",
            headerHozAlign: "center",
            formatter: asisteLookup,
          },
          {
            title: "Viernes",
            field: "estadoSemana.4",
            editor: "select",
            editorParams: {
              values: estadosAsistencia,             
            },
            hozAlign: "center",
            headerHozAlign: "center",
            formatter: asisteLookup,
          },
          {
            title: "Sabado",
            field: "estadoSemana.5",
            editor: "select",
            editorParams: {
              values: estadosAsistencia,             
            },
            hozAlign: "center",
            headerHozAlign: "center",
            formatter: asisteLookup,
          },
          {
            title: "Domingo",
            field: "estadoSemana.6",
            editor: "select",
            editorParams: {
              values: estadosAsistencia,             
            },
            hozAlign: "center",
            headerHozAlign: "center",
            formatter: asisteLookup,
          },
        ],
      });
      table
        .setData(
          "http://localhost:3000/api/asiste/getasistesemana",
          { idCursoPac: store.state.cursoPac._id, fecha: store.state.fecha },
          ajaxConfig2
        )
        .then(() => {
          fecha.value = table.getRowFromPosition(0).getData().fechaSemana;
          fechaFormateada.value = new Date(fecha.value)
            .toISOString()
            .slice(0, 10);
          minPeriodo.value = new Date(store.state.cursoPac.pac.fechaInicio)
            .toISOString()
            .slice(0, 10);
          maxPeriodo.value = new Date(store.state.cursoPac.pac.fechaFin)
            .toISOString()
            .slice(0, 10);
        });
    });
    return {
      data,
      isModalVisible,
      ajaxConfig2,
      editTable,
      fecha,
      fechaFormateada,
      minPeriodo,
      maxPeriodo,
      irFecha,
      estadosAsistencia
    };
  },
};
</script>

<template>
  <div class="home">
    <div class="navbar">
      <button class="button-36" @click="editTable">
        Confirmar cambios asistencia
      </button>
    </div>

    <h1>
      Asistencia {{ $store.state.cursoPac.curso.nombre }}
      {{ $store.state.cursoPac.nonyear }}
    </h1>
    <h2>Profesor Jefe: {{ $store.state.cursoPac.non }}</h2>
    <h3>Semana del {{ fechaFormateada }}</h3>
    <div class="time">
      <input
        class="date form-field"
        type="date"
        v-model="fechaFormateada"
        :min="minPeriodo"
        :max="maxPeriodo"
      />
      <button class="button-36" @click="irFecha">Ir a semana</button>
    </div>
    <div class="Table" id="example-table"></div>
  </div>
</template>

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
.changepass {
  padding-left: 40vw;
}
.time {
  margin-bottom: 20px;
}
.navbar {
  display: flex;
  flex-direction: row;
  margin: auto;
  margin-bottom: 2vh;
  width: 80vw;
}
.form-field {
  height: 46px;
  width: inherit;
  padding: 0 16px;
  border: 2px solid #ddd;
  border-radius: 4px;
  font-family: "Rubik", sans-serif;
  outline: 0;
}
.date {
  margin: 0 10px 0 10px;
}
</style>
