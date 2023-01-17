<script>
import { onMounted, reactive, ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import Tabulator from "tabulator-tables";
import Modal from "@/components/modal/Modal.vue";
import vSelect from "vue-select";
import { notify } from "@kyvg/vue3-notification";
export default {
  name: "Cursos",
  components: { Modal, vSelect },
  setup() {
    const data = reactive({});
    const store = useStore();
    const router = useRouter();
    var table;
    var tableAlumnos;
    var tableAsignaturas;
    var isModalVisible = ref(false);
    var isModalDocenteVisible = ref(false);
    var isModalAlumnoVisible = ref(false);
    var isModalEliminarAlumnoVisible = ref(false);
    var isModalAsignaturaCursoVisible = ref(false);
    const idcursopac = ref("");
    const nombrecursopac = ref("");
    const añocursopac = ref("");
    const periodocursopac = ref("");
    const docentes = ref([]);
    const alumnos = ref([]);
    const asignaturasCurso = ref([]);
    const docenteSeleccionado = ref();
    const alumnoSeleccionado = ref();
    const modalEliminarAlumnoData = reactive({
      nombreAlumno: false,
      apellidoPAlumno: false,
      apellidoMAlumno: false,
      rutAlumno: false,
      idAlumno: false,
      eliminar: "",
    });
    var ajaxConfig = {
      headers: {
        "Content-type": "application/json",
      },
      credentials: "include",
    };
    var tableData = [];
    const showModal = () => {
      tableAlumnos.setData(
        "http://localhost:3000/api/cursoalumnos/getalumnoscursopac",
        { idcursopac: idcursopac.value },
        ajaxConfig2
      );
      isModalVisible.value = true;
    };
    const showModalDocente = () => {
      docenteSeleccionado.value = false;
      isModalDocenteVisible.value = true;
    };
    const showModalAlumno = async () => {
      isModalVisible.value = false;
      alumnoSeleccionado.value = false;
      const response = await fetch(
        "http://localhost:3000/api/cursoalumnos/getalumnosdisponiblespac",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ idcursopac: idcursopac.value }),
        }
      )
        .then((response) => response.json())
        .then((data) => (alumnos.value = data));

      isModalAlumnoVisible.value = true;
    };
    const showModalEliminarAlumno = () => {
      closeModal();
      modalEliminarAlumnoData.eliminar = "";
      isModalEliminarAlumnoVisible.value = true;
    };
    const showModalAsignaturaCurso = async () => {
      tableAsignaturas.setData(
        "http://localhost:3000/api/acp/getallcursopac",
        { idcursopac: idcursopac.value },
        ajaxConfig2
      );
      isModalAsignaturaCursoVisible.value = true;
    };
    const closeModal = () => {
      isModalVisible.value = false;
      idcursopac.value = "";
      nombrecursopac.value = "";
      añocursopac.value = "";
      periodocursopac.value = "";
    };
    const closeModalDocente = () => {
      isModalDocenteVisible.value = false;
    };
    const closeModalAlumno = () => {
      isModalAlumnoVisible.value = false;
    };
    const closeModalEliminarAlumno = () => {
      isModalEliminarAlumnoVisible.value = false;
    };
    const closeModalAsignaturaCurso = () => {
      isModalAsignaturaCursoVisible.value = false;
    };
    var ajaxConfig2 = {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      credentials: "include",
    };
    const editDocenteCurso = async () => {
      const response = await fetch(
        "http://localhost:3000/api/cursopacs/update",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            idcursopac: idcursopac.value,
            iddocente: docenteSeleccionado.value._id,
          }),
        }
      );
      if (response.status === 200) {
        notify({
          title: "Actualizacion de usuarios exitosa 🎉",
          type: "success",
        });
        closeModalDocente();
      } else {
        notify({
          title: "Error, vea la consola para mas detalles 🎉",
          type: "error",
        });
      }
      table.setData(
        "http://localhost:3000/api/cursopacs/getall",
        {},
        ajaxConfig
      );
    };
    const createCursoAlumno = async () => {
      const response = await fetch("http://localhost:3000/api/cursoalumnos/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          idcursopac: idcursopac.value,
          idalumno: alumnoSeleccionado.value._id,
        }),
      });
      if (response.status === 200) {
        notify({
          title: "Registro del alumno al curso exitosa 🎉",
          type: "success",
        });
      } else {
        notify({
          title: "Error, vea la consola para mas detalles 🎉",
          type: "error",
        });
      }
      closeModalAlumno();
    };
    const deleteCursoAlumno = async () => {
      const response = await fetch(
        "http://localhost:3000/api/cursoalumnos/delete",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            idcursopac: idcursopac.value,
            idalumno: modalEliminarAlumnoData.idAlumno,
          }),
        }
      );
      if (response.status === 200) {
        notify({
          title: "Eliminacion de alumno del curso exitosa 🎉",
          type: "success",
        });
      } else {
        notify({
          title: "Error, vea la consola para mas detalles 🎉",
          type: "error",
        });
      }
      closeModalEliminarAlumno();
      showModal();
    };
    onMounted(async () => {
      var TeacherIcon = function (cell, formatterParams, onRendered) {
        return "<i class='fa fa-user-edit'></i>";
      };
      var UserIcon = function (cell, formatterParams, onRendered) {
        //plain text value
        return "<i class='fa fa-users'></i>";
      };
      var AsignaturaIcon = function (cell, formatterParams, onRendered) {
        //plain text value
        return "<i class='fa fa-book'></i>";
      };
      var DeleteIcon = function (cell, formatterParams, onRendered) {
        return "<i class='fa fa-user-slash'></i>";
      };

      table = new Tabulator("#example-table", {
        height: 820,
        pagination: "local",
        layout: "fitColumns",
        responsiveLayout: "hide",
        langs: {
          default: {
            pagination: {
              first: "Primero", //text for the first page button
              first_title: "Primera pagina", //tooltip text for the first page button
              last: "Ultimo",
              last_title: "Ultima pagina",
              prev: "Ant.",
              prev_title: "Pagina anterior",
              next: "Sig.",
              next_title: "Pagina siguiente",
            },
          },
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
            title: "Rut",
            field: "idDocente.rut",
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
            title: "ModificarDocente",
            titleFormatter: TeacherIcon,
            formatter: TeacherIcon,
            tooltip: "Cambiar profesor Jefe",
            width: 80,
            hozAlign: "center",
            headerSort: false,
            headerHozAlign: "center",
            cellClick: function (e, cell) {
              idcursopac.value = cell.getRow().getData()._id;
              nombrecursopac.value = cell.getRow().getData().curso.nombre;
              añocursopac.value = cell.getRow().getData().pac.year;
              periodocursopac.value = cell.getRow().getData().pac.number;
              showModalDocente();
            },
          },
          {
            formatter: UserIcon,
            titleFormatter: UserIcon,
            tooltip: "Ver alumnos curso",
            width: 80,
            hozAlign: "center",
            headerSort: false,
            headerHozAlign: "center",
            cellClick: function (e, cell) {
              idcursopac.value = cell.getRow().getData()._id;
              nombrecursopac.value = cell.getRow().getData().curso.nombre;
              añocursopac.value = cell.getRow().getData().pac.year;
              periodocursopac.value = cell.getRow().getData().pac.number;
              showModal();
            },
          },

          {
            formatter: AsignaturaIcon,
            titleFormatter: AsignaturaIcon,
            tooltip: "Ver asignaturas curso",
            width: 80,
            hozAlign: "center",
            headerSort: false,
            headerHozAlign: "center",
            cellClick: function (e, cell) {
              idcursopac.value = cell.getRow().getData()._id;
              nombrecursopac.value = cell.getRow().getData().curso.nombre;
              añocursopac.value = cell.getRow().getData().pac.year;
              periodocursopac.value = cell.getRow().getData().pac.number;
              showModalAsignaturaCurso();
            },
          },
        ],
      });
      if (
        store.state.user.rol.nombre != "administrador" &&
        store.state.user.rol.nombre != "coordinador"
      ) {
        var cols = table.getColumns(true);
        cols[6].hide();
      }
      table.setData(
        "http://localhost:3000/api/cursopacs/getall",
        {},
        ajaxConfig
      );

      tableAlumnos = new Tabulator("#tableAlumnos", {
        ajaxContentType: "json",
        height: 500,

        responsiveLayout: "hide",
        langs: {
          default: {
            pagination: {
              first: "Primero", //text for the first page button
              first_title: "Primera pagina", //tooltip text for the first page button
              last: "Ultimo",
              last_title: "Ultima pagina",
              prev: "Ant.",
              prev_title: "Pagina anterior",
              next: "Sig.",
              next_title: "Pagina siguiente",
            },
          },
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

          {
            title: "Apellido P",
            field: "idAlumno.apellidoP",
            headerFilter: "input",
            headerFilterPlaceholder: "filtrar columna...",
          },

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
            formatter: DeleteIcon,
            width: 40,
            hozAlign: "center",
            headerSort: false,
            cellClick: function (e, cell) {
              modalEliminarAlumnoData.nombreAlumno = cell
                .getRow()
                .getData().idAlumno.nombre;
              modalEliminarAlumnoData.apellidoPAlumno = cell
                .getRow()
                .getData().idAlumno.apellidoP;
              modalEliminarAlumnoData.apellidoMAlumno = cell
                .getRow()
                .getData().idAlumno.apellidoM;
              modalEliminarAlumnoData.rutAlumno = cell
                .getRow()
                .getData().idAlumno.rut;
              modalEliminarAlumnoData.idAlumno = cell
                .getRow()
                .getData().idAlumno._id;
              showModalEliminarAlumno();
            },
          },
        ],
      });
      
      if (
        store.state.user.rol.nombre != "administrador" ||
        store.state.user.rol.nombre != "coordinador"
      ) {
        var colss = tableAlumnos.getColumns(true);
        colss[1].hide();
      }
      const response = await fetch(
        "http://localhost:3000/api/users/getusersrol",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ rol: "docente" }),
        }
      );
      docentes.value = await response.json();

      tableAsignaturas = new Tabulator("#tablaAsignaturas", {
        ajaxContentType: "json",
        height: 600,
        layout: "fitColumns",
        responsiveLayout: "hide",
        langs: {
          default: {
            pagination: {
              first: "Primero", //text for the first page button
              first_title: "Primera pagina", //tooltip text for the first page button
              last: "Ultimo",
              last_title: "Ultima pagina",
              prev: "Ant.",
              prev_title: "Pagina anterior",
              next: "Sig.",
              next_title: "Pagina siguiente",
            },
          },
        },

        columns: [
          {
            title: "id",
            field: "_id",
            visible: false,
            editor: true,
          },
          {
            title: "Nombre Asignatura",
            field: "asignatura.nombre",
            headerFilter: "input",
            headerFilterPlaceholder: "filtrar columna...",
            editor: true,
          },
          {
            title: "Codigo",
            field: "asignatura.codigo",
            headerFilter: "input",
            headerFilterPlaceholder: "filtrar columna...",
            editor: true,
          },
          {
            title: "Profesor",
            field: "nonprofe",
            mutator: function (value, data, type, mutatorParams, cell) {
              return (
                data.idProfesor.nombre +
                " " +
                data.idProfesor.apellidoP +
                " " +
                data.idProfesor.apellidoM
              );
            },
            headerFilter: "input",
            headerFilterPlaceholder: "filtrar columna...",
            editor: true,
          },
          {
            title: "Asistente",
            field: "none",
            mutator: function (value, data, type, mutatorParams, cell) {
              if (data.idAsistente) {
                return (
                  data.idAsistente.nombre +
                  " " +
                  data.idAsistente.apellidoP +
                  " " +
                  data.idAsistente.apellidoM
                );
              }
            },
            headerFilter: "input",
            headerFilterPlaceholder: "filtrar columna...",
            editor: true,
          },
        ],
      });
    });
    return {
      data,
      docentes,
      alumnos,
      asignaturasCurso,
      modalEliminarAlumnoData,
      docenteSeleccionado,
      alumnoSeleccionado,
      isModalVisible,
      isModalDocenteVisible,
      isModalAlumnoVisible,
      isModalEliminarAlumnoVisible,
      isModalAsignaturaCursoVisible,
      showModal,
      closeModal,
      showModalDocente,
      closeModalDocente,
      showModalAlumno,
      closeModalAlumno,
      showModalEliminarAlumno,
      closeModalEliminarAlumno,
      showModalAsignaturaCurso,
      closeModalAsignaturaCurso,
      editDocenteCurso,
      createCursoAlumno,
      deleteCursoAlumno,
      tableData,
      idcursopac,
      nombrecursopac,
      añocursopac,
      periodocursopac,
      ajaxConfig,
    };
  },
};
</script>

<template>
  <div class="home">
    <div class="navbar"></div>
    <br />
    <div class="Table" id="example-table"></div>
  </div>
  <Modal v-show="isModalVisible" @close="closeModal">
    <template v-slot:header> </template>

    <template v-slot:body>
      <button
        style="margin-bottom: 15px"
        v-if="
          $store.state.user.rol.nombre == 'administrador' ||
          $store.state.user.rol.nombre == 'coordinador'
        "
        class="button-36"
        @click="showModalAlumno"
      >
        Registrar alumno
      </button>

      <form @submit.prevent="editSelected" class="editform">
        <div class="header">
          <h2>
            Listado alumnos {{ nombrecursopac }} {{ añocursopac }}-{{
              periodocursopac
            }}:
          </h2>
          <br />
        </div>
        <div class="form">
          <div class="TableModal" id="tableAlumnos"></div>
        </div>
      </form>
    </template>

    <template v-slot:footer> </template>
  </Modal>
  <Modal v-show="isModalDocenteVisible" @close="closeModalDocente">
    <template v-slot:header> </template>

    <template v-slot:body>
      <form @submit.prevent="editDocenteCurso" class="editform">
        <div class="header">
          <h2>
            Cambio profesor jefe curso {{ nombrecursopac }} {{ añocursopac }}-{{
              periodocursopac
            }}
          </h2>
          <h3>Seleccione un nuevo profesor jefe de la lista:</h3>
        </div>
        <div class="formCurso">
          <v-select
            :options="docentes"
            label="nombre"
            placeholder="Seleccione docente"
            v-model="docenteSeleccionado"
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
                :required="!docenteSeleccionado"
                v-bind="attributes"
                v-on="events"
              />
            </template>
          </v-select>

          <button v-if="docenteSeleccionado" class="button-36 buttonCurso">
            Confirmar cambio profesor jefe
          </button>
        </div>
      </form>
    </template>

    <template v-slot:footer> </template>
  </Modal>

  <Modal v-show="isModalAlumnoVisible" @close="closeModalAlumno">
    <template v-slot:header> </template>
    <template v-slot:body>
      <form @submit.prevent="createCursoAlumno" class="editform">
        <div class="header">
          <h2>
            Registrar alumno a Curso: {{ nombrecursopac }} {{ añocursopac }}-{{
              periodocursopac
            }}
          </h2>
          <h3>Seleccione un alumno disponible de la lista:</h3>
        </div>
        <div class="formCurso">
          <v-select
            :options="alumnos"
            label="nombre"
            placeholder="Seleccione alumno"
            v-model="alumnoSeleccionado"
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

          <button v-if="alumnoSeleccionado" class="button-36 buttonCurso">Agregar a Curso</button>
        </div>
      </form>
    </template>

    <template v-slot:footer> </template>
  </Modal>

  <Modal
    v-show="isModalEliminarAlumnoVisible"
    @close="closeModalEliminarAlumno"
  >
    <template v-slot:header> </template>

    <template v-slot:body>
      <form @submit.prevent="deleteCursoAlumno" class="editform">
        <div class="header">
          <h2>Elimimar alumno de curso</h2>
          <h3>
            Curso: {{ nombrecursopac }} {{ añocursopac }}-{{ periodocursopac }}
          </h3>
          <h3>
            Alumno:{{ modalEliminarAlumnoData.nombreAlumno }}
            {{ modalEliminarAlumnoData.apellidoPAlumno }}
            {{ modalEliminarAlumnoData.apellidoMAlumno }}
          </h3>
          <h3>Rut: {{ modalEliminarAlumnoData.rutAlumno }}</h3>
          <h3>Escriba "Elimimar" para confirmar eliminacion</h3>
        </div>
        <div class="form">
          <input
            v-model="modalEliminarAlumnoData.eliminar"
            type="text"
            class="form-field"
            required="true"
            placeholder="Escriba Eliminar"
          />
          <input
            type="submit"
            v-if="modalEliminarAlumnoData.eliminar == 'Eliminar'"
            class="button-36"
            value="Confirmar eliminacion"
          />
        </div>
      </form>
    </template>

    <template v-slot:footer> </template>
  </Modal>

  <Modal
    v-show="isModalAsignaturaCursoVisible"
    @close="closeModalAsignaturaCurso"
  >
    <template v-slot:header> </template>

    <template v-slot:body>
      <form @submit.prevent="editSelected" class="editform">
        <div class="header">
          <h2 style="margin-bottom: 15px">
            Listado asignaturas {{ nombrecursopac }} {{ añocursopac }}-{{
              periodocursopac
            }}:
          </h2>
        </div>
        <div class="form">
          <div class="Table" id="tablaAsignaturas"></div>
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
.TableModal {
  margin: auto;
  padding: 10px 50px;
  width: 52vw;
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

.buttonCurso {
  align-self: center;
  width: 20vw;
  margin-top: 20px;
}
.formCurso {
  margin-bottom: 100px;
}
</style>
