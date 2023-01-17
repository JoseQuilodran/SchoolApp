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
    var table;
    const alumnosCurso = ref([]);
    const baseCurso = ref([]);
    const estados = ref([]);
    const alumnoSeleccionado = ref("");
    const alumnoSelect = ref("");
    const ajaxConfig2 = {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      credentials: "include",
    };
    const cargarAlumno = () => {
      alumnoSeleccionado.value = alumnoSelect.value;
      table.setData(
        "http://localhost:3000/api/basepersonalidadcurso/getalumno",
        {
          idcursopac: store.state.cursoPac._id,
          idalumno: alumnoSeleccionado.value._id,
        },
        ajaxConfig2
      );
    };
    const updatePersonalidad = async () => {
      let data = table.getData();
      let array = [];
      data.forEach((element) => {
        array.push(element[2]);
      });
      console.log(array);
      const response = await fetch(
        "http://localhost:3000/api/cursoalumnos/updatepersonalidadalumno",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            idcursopac: store.state.cursoPac._id,
            idalumno: alumnoSeleccionado.value._id,
            estados: array,
          }),
        }
      );
      if (response.status === 200) {
        notify({
          title: "Actualizacion de datos personalidad alumno exitosa 🎉",
          type: "success",
        });
       
      } else {
        notify({
            title: "Error, vea la consola para mas detalles 🎉",
            type: "error",
          });
      }
    };
    onMounted(async () => {
      const response = await fetch(
        "http://localhost:3000/api/cursoalumnos/getlistadoalumnoscursopac",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ idcursopac: store.state.cursoPac._id }),
        }
      )
        .then((response) => response.json())
        .then((data) => (alumnosCurso.value = data));

      const response2 = await fetch(
        "http://localhost:3000/api/estadopersonalidad/getall",
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      )
        .then((response2) => response2.json())
        .then((data) => (estados.value = data));

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

      function estadosLookup(cell) {
        var val = cell.getValue();

        let x = estados.value.find((element) => element.value == val);
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
            title: "orden",
            field: "0",
            visible: false,
            editor: true,
          },
          {
            title: "Criterio",
            field: "1",
            headerFilter: "input",
            headerFilterPlaceholder: "filtrar columna...",
            editor: true,
          },
          ,
          {
            title: "Valor",
            editor: "select",
            field: "2",
            editorParams: { values: estados.value },
            hozAlign: "center",
            headerHozAlign: "center",
            formatter: estadosLookup,
          },
        ],
      });
    });
    return {
      data,
      isModalVisible,
      alumnosCurso,
      alumnoSeleccionado,
      cargarAlumno,
      estados,
      updatePersonalidad,
      alumnoSelect,
    };
  },
};
</script>

<template>
  <div class="home">
    <div class="navbar"></div>

    <h1>
      Datos Personalidad {{ $store.state.cursoPac.curso.nombre }}
      {{ $store.state.cursoPac.pac.year }}-{{
        $store.state.cursoPac.pac.number
      }}
    </h1>
    <h3>
      Profesor Jefe: {{ $store.state.cursoPac.idDocente.nombre }}
      {{ $store.state.cursoPac.idDocente.apellidoP }}
      {{ $store.state.cursoPac.idDocente.apellidoM }}
    </h3>
    <h2 v-if="alumnoSeleccionado !== ''">
      Alumno actual: {{ alumnoSeleccionado.nombre }}
      {{ alumnoSeleccionado.apellidoP }} {{ alumnoSeleccionado.apellidoM }}
    </h2>

    <div class="time">
      <form action="">
        <v-select
          :options="alumnosCurso"
          label="nombre"
          placeholder="Seleccione alumno"
          v-model="alumnoSelect"
        >
          <template #option="{ nombre, apellidoP, apellidoM, rut }">
            <p style="margin: 0">
              {{ nombre }} {{ apellidoP }} {{ apellidoM }} RUT:{{ rut }}
            </p>
          </template>
          <template #selected-option="{ nombre, apellidoP, apellidoM, rut }">
            <p style="margin: 0">
              {{ nombre }} {{ apellidoP }} {{ apellidoM }} RUT:{{ rut }}
            </p>
          </template>
          <template #search="{ attributes, events }">
            <input
              class="vs__search"
              :required="!alumnoSeleccionado"
              v-bind="attributes"
              v-on="events"
            />
          </template>
        </v-select>
      </form>
      <button class="button-36" @click="cargarAlumno">Cambiar alumno</button>
    </div>
    <div style="margin-bottom: 20px"><button class="confirmar button-36" @click="updatePersonalidad">
      Confirmar cambios
    </button>
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
.time {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.time form {
  width: 50vw;
}


.deshacer {
  background: linear-gradient(to right, #b90c0c 0%, #e20606 100%);
}
</style>
