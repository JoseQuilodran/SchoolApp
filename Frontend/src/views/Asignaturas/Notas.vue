<script>
import { onMounted, reactive, ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import Tabulator from "tabulator-tables";
import Modal from "@/components/modal/Modal.vue";
import vSelect from "vue-select";
import { notify } from "@kyvg/vue3-notification";

export default {
  name: "Notas",
  components: { Modal, vSelect },

  setup() {
    var isModalPonderacionVisible = ref(false);
    var isModalEliminarNotaVisible = ref(false);
    var ajaxConfig = {
      headers: {
        "Content-type": "application/json",
      },
      credentials: "include",
    };
    var gruposSumativas = ref([1]);
    const ConfirmarEliminar=ref('Eliminar');
    const NotaSeleccionada=ref('');
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
    const evaluacionesData = ref([
      [1, ""],
      [0, ""],
      [0, ""],
      [0, ""],
      [0, ""],
      [0, ""],
      [0, ""],
      [0, ""],
      [0, ""],
      [0, ""],
    ]);
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
    let index = 1;
    let last = 1;
    var ajaxConfig2 = {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      credentials: "include",
    };
    const showModalPonderacion = () => {
      gruposSumativas.value.splice(0, gruposSumativas.value.length);
      gruposSumativas.value.push(1);
      let max = 1;
      let test = 0;
      isModalPonderacionVisible.value = true;

      for (index = 1; index <= 11; index++) {
        test = store.state.esquemaNotas[(index - 1) * 2 + 1];
        if (test == 1 || test == 2) {
          if (test == 2) {
            //caso sumativa, ver max grupo
            let grupo = store.state.esquemaNotas[(index - 1) * 2];
            if (grupo >= max) {
              max = grupo;
            }
          }
          let nota = document.getElementById(index.toString());
          nota.style.display = "flex";
        } else {
          last = index - 1;
          if (last >= 10) {
            let btn = document.getElementById("agregarEvaluacion");
            btn.style.display = "none";
          }
          break;
        }
      }
      for (let index = 2; index <= max + 1; index++) {
        gruposSumativas.value.push(index);
      }
    };
    const showModalEliminarNota = (x) => {
      NotaSeleccionada.value=x;
      isModalEliminarNotaVisible.value=true;
    };
    const closeModalPonderacion = () => {
      isModalPonderacionVisible.value = false;
    };
    const closeModalEliminarNota = () => {
       isModalEliminarNotaVisible.value=false;
    };
    const addEvaluacion = () => {
      if (index - 1 == last) {
        let btn = document.getElementById("eliminarEvaluacion");
        btn.style.display = "flex";
      }
      if (index <= 10) {
        let nota = document.getElementById(index.toString());
        nota.style.display = "flex";

        index++;
        if (index > 10) {
          let btn = document.getElementById("agregarEvaluacion");
          btn.style.display = "none";
        }
      }
    };
    const removeEvaluacion = () => {
      let nota = document.getElementById((index - 1).toString());
      nota.style.display = "none";

      index--;
      if (index <= 10) {
        let btn = document.getElementById("agregarEvaluacion");
        btn.style.display = "flex";
      }

      if (index - 1 <= last) {
        let btn = document.getElementById("eliminarEvaluacion");
        btn.style.display = "none";
      }
    };
    const deleteNota = async () => {
     const response =  await fetch(
        "http://localhost:3000/api/acp/deletenota",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            idacp: store.state.idAsignatura,
            nota: NotaSeleccionada.value,
          }),
        }
      );
      if (response.status === 200) {
        router.go(0);
        notify({
          title: "Eliminacion de notas exitosa 🎉",
          type: "success"
        });
        
      } else {
        notify({
            title: "Error, vea la consola para mas detalles 🎉",
            type: "error",
          });
      }    
    };
    const editTable = async () => {
      let result = [];
      let editedCells = table.getEditedCells();
      editedCells.map(function (x) {
        let row = x.getRow().getData();
        result.push({
          _id: row.idAlumno._id,
          notas: [
            row.notas[0].$numberDecimal,
            row.notas[1].$numberDecimal,
            row.notas[2].$numberDecimal,
            row.notas[3].$numberDecimal,
            row.notas[4].$numberDecimal,
            row.notas[5].$numberDecimal,
            row.notas[6].$numberDecimal,
            row.notas[7].$numberDecimal,
            row.notas[8].$numberDecimal,
            row.notas[9].$numberDecimal,
          ],
        });
      });

      const response = await fetch(
        "http://localhost:3000/api/asignaturaalumno/update",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            acp: store.state.idAsignatura,
            notas: result,
          }),
        }
      );
      if (response.status === 200) {
        notify({
          title: "Actualizacion de notas exitosa 🎉",
          type: "success"
        });
        table.setData(
        "http://localhost:3000/api/asignaturaalumno/getnotasasignatura",
        { acp: store.state.idAsignatura },
        ajaxConfig2
      );
      } else {
        notify({
            title: "Error, vea la consola para mas detalles 🎉",
            type: "error",
          });
      }
    };

    const updateEsquema = async () => {
      var esquema2array = [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      ];
      for (let index = 0; index < 10; index++) {
        if (evaluacionesData.value[index][1] == "normal") {
          esquema2array[index * 2 + 1] = 1;
          esquema2array[index * 2] = 0;
        } else if (evaluacionesData.value[index][1] == "sumativa") {
          esquema2array[index * 2 + 1] = 2;
          esquema2array[index * 2] = evaluacionesData.value[index][0];
        } else {
          break;
        }
      }
      const response = await fetch(
        "http://localhost:3000/api/acp/updateesquema",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            idacp: store.state.idAsignatura,
            esquemanotas: esquema2array,
          }),
        }
      );
      if (response.status === 200) {
        notify({
            title: "Actualizacion de esquema de notas exitosa 🎉",
            type: "success",
          });      
          
          router.go(0);
             
      } else {
        notify({
            title: "Error, vea la consola para mas detalles 🎉",
            type: "error",
          });
      }
    };
    onMounted(async () => {
      console.log('ke');
      try {
        const response = await fetch(
          "http://localhost:3000/api/acp/getesquema",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
              idacp: store.state.idAsignatura,
            }),
          }
        );

        if (response.status === 200) {
          const content = await response.json();
          store.dispatch("setEsquemaNotas", {
            esquemaNotas: content[0].esquemaNotas,
          });
        }
      } catch (e) {}
      var headerMenu = [
        {
          label: "Eliminar Evaluacion",
          action: function (e, column) {
            showModalEliminarNota(parseInt(column.getField().charAt(6)));            
          },
        },
      ];

      function notasLookup(cell) {
        var val = parseFloat(cell.getValue());
        if (val < 4) {
          cell.getElement().style.color="#FF0000"
        }
        else{cell.getElement().style.color="#000000"}
        if (val == 0) {
          val = "";
        }
        return val;
      }

      table = new Tabulator("#tablaNotas", {
        height: 800,
        layout: "fitData",

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
          ,
          {
            title: "Nota1",
            field: "notas.0.$numberDecimal",
            headerFilter: "input",
            headerFilterPlaceholder: "filtrar columna...",
            editor: true,
            validator: ["required", "numeric", "min:0", "max:7"],
            headerMenu: headerMenu,
            formatter: notasLookup,
            editor: "number",
            hozAlign: "center",
            headerHozAlign: "center",
          },
          ,
          {
            title: "Nota2",
            field: "notas.1.$numberDecimal",
            headerFilter: "input",
            headerFilterPlaceholder: "filtrar columna...",
            editor: true,
            validator: ["required", "numeric", "min:0", "max:7"],
            headerMenu: headerMenu,
            formatter: notasLookup,
            editor: "number",
            hozAlign: "center",
            headerHozAlign: "center",
          },
          ,
          {
            title: "Nota3",
            field: "notas.2.$numberDecimal",
            headerFilter: "input",
            headerFilterPlaceholder: "filtrar columna...",
            editor: true,
            validator: ["required", "numeric", "min:0", "max:7"],
            headerMenu: headerMenu,
            formatter: notasLookup,
            editor: "number",
            hozAlign: "center",
            headerHozAlign: "center",
          },
          ,
          {
            title: "Nota4",
            field: "notas.3.$numberDecimal",
            headerFilter: "input",
            headerFilterPlaceholder: "filtrar columna...",
            editor: true,
            validator: ["required", "numeric", "min:0", "max:7"],
            headerMenu: headerMenu,
            formatter: notasLookup,
            editor: "number",
            hozAlign: "center",
            headerHozAlign: "center",
          },
          {
            title: "Nota5",
            field: "notas.4.$numberDecimal",
            headerFilter: "input",
            headerFilterPlaceholder: "filtrar columna...",
            editor: true,
            validator: ["required", "numeric", "min:0", "max:7"],
            headerMenu: headerMenu,
            formatter: notasLookup,
            editor: "number",
            hozAlign: "center",
            headerHozAlign: "center",
          },
          {
            title: "Nota6",
            field: "notas.5.$numberDecimal",
            headerFilter: "input",
            headerFilterPlaceholder: "filtrar columna...",
            editor: true,
            validator: ["required", "numeric", "min:0", "max:7"],
            headerMenu: headerMenu,
            formatter: notasLookup,
            editor: "number",
            hozAlign: "center",
            headerHozAlign: "center",
          },
          {
            title: "Nota7",
            field: "notas.6.$numberDecimal",
            headerFilter: "input",
            headerFilterPlaceholder: "filtrar columna...",
            editor: true,
            validator: ["required", "numeric", "min:0", "max:7"],
            headerMenu: headerMenu,
            formatter: notasLookup,
            editor: "number",
            hozAlign: "center",
            headerHozAlign: "center",
          },
          {
            title: "Nota8",
            field: "notas.7.$numberDecimal",
            headerFilter: "input",
            headerFilterPlaceholder: "filtrar columna...",
            editor: true,
            validator: ["required", "numeric", "min:0", "max:7"],
            headerMenu: headerMenu,
            formatter: notasLookup,
            editor: "number",
            hozAlign: "center",
            headerHozAlign: "center",
          },
          {
            title: "Nota9",
            field: "notas.8.$numberDecimal",
            headerFilter: "input",
            headerFilterPlaceholder: "filtrar columna...",
            editor: true,
            validator: ["required", "numeric", "min:0", "max:7"],
            headerMenu: headerMenu,
            formatter: notasLookup,
            editor: "number",
            hozAlign: "center",
            headerHozAlign: "center",
          },
          {
            title: "Nota10",
            field: "notas.9.$numberDecimal",
            headerFilter: "input",
            headerFilterPlaceholder: "filtrar columna...",
            editor: true,
            validator: ["required", "numeric", "min:0", "max:7"],
            headerMenu: headerMenu,
            formatter: notasLookup,
            editor: "number",
            hozAlign: "center",
            headerHozAlign: "center",
          },
        ],
      });
      table.setData(
        "http://localhost:3000/api/asignaturaalumno/getnotasasignatura",
        { acp: store.state.idAsignatura },
        ajaxConfig2
      );

      var cols = table.getColumns(true);
      for (let index = 0; index < 10; index++) {
        if (store.state.esquemaNotas[index * 2 + 1] == 1) {
          evaluacionesData.value[index][1] = "normal";
        } else if (store.state.esquemaNotas[index * 2 + 1] == 2) {
          evaluacionesData.value[index][1] = "sumativa";
          evaluacionesData.value[index][0] =
            store.state.esquemaNotas[index * 2];
        } else {
          cols[index + 5].hide();
        }
      }
    });

    return {
      modalData,
      clearModaldata,
      isModalPonderacionVisible,
      isModalEliminarNotaVisible,
      ajaxConfig,
      showModalPonderacion,
      showModalEliminarNota,
      closeModalPonderacion,
      closeModalEliminarNota,
      editTable,
      addEvaluacion,
      removeEvaluacion,
      store,
      index,
      last,
      evaluacionesData,
      gruposSumativas,
      updateEsquema,
      ConfirmarEliminar,
      NotaSeleccionada,
      deleteNota,
    };
  },
};
</script>

<template>
  <div class="home" >
    <div class="navbar">
      <button class="button-36" @click="editTable">Modificacion Masiva</button>
      <button class="button-36" @click="showModalPonderacion">
        Modificar Evaluaciones
      </button>
    </div>

    <div class="Table" id="tablaNotas"></div>
    <Modal v-show="isModalPonderacionVisible" @close="closeModalPonderacion">
      <template v-slot:header> </template>
      <template v-slot:body>
        <div class="header">
          <h2>Registrar datos evaluacion</h2>
          <h3>Seleccione tipo evaluacion y si es sumativa, su grupo</h3>
        </div>
        <div class="botonesNotas">
          <button
            id="agregarEvaluacion"
            class="button-36"
            @click="addEvaluacion"
          >
            Agregar evaluacion
          </button>
          <button
            id="eliminarEvaluacion"
            class="button-36 eliminarEvaluacion"
            @click="removeEvaluacion"
          >
            Eliminar nueva evaluacion
          </button>
        </div>
        <form @submit.prevent="updateEsquema" class="editform">
          <div class="form">
            <div id="evaluaciones">
              <div class="evaluacion" id="1">
                <h3>Nota 1:</h3>
                <v-select
                  class="form-select"
                  :options="['normal', 'sumativa']"
                  placeholder="Ingrese tipo evaluacion"
                  v-model="evaluacionesData[0][1]"
                ></v-select>
                <h4 v-if="evaluacionesData[0][1] == 'sumativa'">Grupo:</h4>
                <v-select
                  v-if="evaluacionesData[0][1] == 'sumativa'"
                  class="form-select"
                  :options="gruposSumativas"
                  placeholder="Seleccione Grupo Sumativas"
                  v-model="evaluacionesData[0][0]"
                ></v-select>
              </div>
              <div class="evaluacion" id="2">
                <h3>Nota 2:</h3>
                <v-select
                  class="form-select"
                  :options="['normal', 'sumativa']"
                  placeholder="Ingrese tipo evaluacion"
                  v-model="evaluacionesData[1][1]"
                ></v-select>
                <h4 v-if="evaluacionesData[1][1] == 'sumativa'">Grupo:</h4>
                <v-select
                  v-if="evaluacionesData[1][1] == 'sumativa'"
                  class="form-select"
                  :options="gruposSumativas"
                  placeholder="Seleccione Grupo Sumativas"
                  v-model="evaluacionesData[1][0]"
                ></v-select>
              </div>
              <div class="evaluacion" id="3">
                <h3>Nota 3:</h3>
                <v-select
                  class="form-select"
                  :options="['normal', 'sumativa']"
                  placeholder="Ingrese tipo evaluacion"
                  v-model="evaluacionesData[2][1]"
                  min="1"
                ></v-select>
                <h4 v-if="evaluacionesData[2][1] == 'sumativa'">Grupo:</h4>
                <v-select
                  v-if="evaluacionesData[2][1] == 'sumativa'"
                  class="form-select"
                  :options="gruposSumativas"
                  placeholder="Seleccione Grupo Sumativas"
                  v-model="evaluacionesData[2][0]"
                ></v-select>
              </div>
              <div class="evaluacion" id="4">
                <h3>Nota 4:</h3>
                <v-select
                  class="form-select"
                  :options="['normal', 'sumativa']"
                  placeholder="Ingrese tipo evaluacion"
                  v-model="evaluacionesData[3][1]"
                ></v-select>
                <h4 v-if="evaluacionesData[3][1] == 'sumativa'">Grupo:</h4>
                <v-select
                  v-if="evaluacionesData[3][1] == 'sumativa'"
                  class="form-select"
                  :options="gruposSumativas"
                  placeholder="Seleccione Grupo Sumativas"
                  v-model="evaluacionesData[3][0]"
                ></v-select>
              </div>
              <div class="evaluacion" id="5">
                <h3>Nota 5:</h3>
                <v-select
                  class="form-select"
                  :options="['normal', 'sumativa']"
                  placeholder="Ingrese tipo evaluacion"
                  v-model="evaluacionesData[4][1]"
                ></v-select>
                <h4 v-if="evaluacionesData[4][1] == 'sumativa'">Grupo:</h4>
                <v-select
                  v-if="evaluacionesData[4][1] == 'sumativa'"
                  class="form-select"
                  :options="gruposSumativas"
                  placeholder="Seleccione Grupo Sumativas"
                  v-model="evaluacionesData[4][0]"
                ></v-select>
              </div>
              <div class="evaluacion" id="6">
                <h3>Nota 6:</h3>
                <v-select
                  class="form-select"
                  :options="['normal', 'sumativa']"
                  placeholder="Ingrese tipo evaluacion"
                  v-model="evaluacionesData[5][1]"
                ></v-select>
                <h4 v-if="evaluacionesData[5][1] == 'sumativa'">Grupo:</h4>
                <v-select
                  v-if="evaluacionesData[5][1] == 'sumativa'"
                  class="form-select"
                  :options="gruposSumativas"
                  placeholder="Seleccione Grupo Sumativas"
                  v-model="evaluacionesData[5][0]"
                ></v-select>
              </div>
              <div class="evaluacion" id="7">
                <h3>Nota 7:</h3>
                <v-select
                  class="form-select"
                  :options="['normal', 'sumativa']"
                  placeholder="Ingrese tipo evaluacion"
                  v-model="evaluacionesData[6][1]"
                ></v-select>
                <h4 v-if="evaluacionesData[6][1] == 'sumativa'">Grupo:</h4>
                <v-select
                  v-if="evaluacionesData[6][1] == 'sumativa'"
                  class="form-select"
                  :options="gruposSumativas"
                  placeholder="Seleccione Grupo Sumativas"
                  v-model="evaluacionesData[6][0]"
                ></v-select>
              </div>
              <div class="evaluacion" id="8">
                <h3>Nota 8:</h3>
                <v-select
                  class="form-select"
                  :options="['normal', 'sumativa']"
                  placeholder="Ingrese tipo evaluacion"
                  v-model="evaluacionesData[7][1]"
                ></v-select>
                <h4 v-if="evaluacionesData[7][1] == 'sumativa'">Grupo:</h4>
                <v-select
                  v-if="evaluacionesData[7][1] == 'sumativa'"
                  class="form-select"
                  :options="gruposSumativas"
                  placeholder="Seleccione Grupo Sumativas"
                  v-model="evaluacionesData[7][0]"
                ></v-select>
              </div>
              <div class="evaluacion" id="9">
                <h3>Nota 9:</h3>
                <v-select
                  class="form-select"
                  :options="['normal', 'sumativa']"
                  placeholder="Ingrese tipo evaluacion"
                  v-model="evaluacionesData[8][1]"
                ></v-select>
                <h4 v-if="evaluacionesData[8][1] == 'sumativa'">Grupo:</h4>
                <v-select
                  v-if="evaluacionesData[8][1] == 'sumativa'"
                  class="form-select"
                  :options="gruposSumativas"
                  placeholder="Seleccione Grupo Sumativas"
                  v-model="evaluacionesData[8][0]"
                ></v-select>
              </div>
              <div class="evaluacion" id="10">
                <h3>Nota 10:</h3>
                <v-select
                  class="form-select"
                  :options="['normal', 'sumativa']"
                  placeholder="Ingrese tipo evaluacion"
                  v-model="evaluacionesData[9][1]"
                ></v-select>
                <h4 v-if="evaluacionesData[9][1] == 'sumativa'">Grupo:</h4>
                <v-select
                  v-if="evaluacionesData[9][1] == 'sumativa'"
                  class="form-select"
                  :options="gruposSumativas"
                  placeholder="Seleccione Grupo Sumativas"
                  v-model="evaluacionesData[9][0]"
                ></v-select>
              </div>
            </div>

            <input
              type="submit"
              class="button-36 confirmarEsquema"
              value="Confirmar cambios evaluaciones"
            />
          </div>
        </form>
      </template>

      <template v-slot:footer> </template>
    </Modal>

    <Modal v-show="isModalEliminarNotaVisible" @close="closeModalEliminarNota">
      <template v-slot:header> </template>
      <template v-slot:body>
        <form @submit.prevent="deleteNota" class="editform">
        <div class="header">
          <h2>Elimimar nota numero:{{NotaSeleccionada+1}} de asignatura</h2>         
          <h3>Escriba "Elimimar" para confirmar eliminacion de la evaluacion de la asignatura, junto a las notas de los alumnos en esta</h3>
        </div>
        <div class="form eliminarNota">          
          <input  v-model="ConfirmarEliminar" type="text" class="form-field" required="true" placeholder="Escriba Eliminar">
          <input  type="submit" v-if="ConfirmarEliminar=='Eliminar'" class="button-36" value="Confirmar eliminacion">
        </div>
      </form>
      
      </template>

      <template v-slot:footer> </template>
    </Modal>
  </div>
</template>
<style src="../../assets/tabulator_bootstrap4.min.css"></style>

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

.editform {
  width: 40vw;
}
.nombre_completo {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.navbar {
  display: flex;
  flex-direction: row;
  margin: auto;
  margin-bottom: 2vh;
  width: 80vw;
}
.evaluaciones {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.evaluacion {
  background-color: rgb(214, 214, 214);
  border: 1px solid rgb(110, 110, 110);
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  margin-top: 1px;
  display: none;
}

.evaluacion h3 {
  margin: 12px 0px 12px 20px;
}
.evaluacion .form-field {
  height: 30px;
  margin-top: 0px;
}
.form-select {
  width: 40%;
  padding: 0 16px;
}
.form-select .vs__search::placeholder,
.form-select .vs__dropdown-toggle {
  background-color: white;
  height: 30px;
}

.form-select .vs__dropdown-menu {
  width: 90%;
  margin-left: 16px;
}

.botonesNotas {
  margin-bottom: 10px;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}

.eliminarEvaluacion {
  display: none;
  background-color: rgb(207, 74, 74);
}

.confirmarEsquema {
  margin: auto;
  margin-top: 20px;
  width: 50%;
}
.eliminarNota .button-36{
  align-self: center;
  width: 50%;
}
.vs__clear {
  visibility: hidden;
}
</style>
