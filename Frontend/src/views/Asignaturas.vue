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
    const data = reactive({});
    const store = useStore();
    const router = useRouter();
    var table;
    const pacs = ref([]);
    const cursoPacs = ref([]);
    const asignaturasDisponibles = ref([]);
    const docentes = ref([]);
    const alumnos = ref([]);
    const alumnosDisponiblesAsignatura = ref([]);
    const modalAcpData = reactive({
      pac: false,
      cursopac: false,
      asignatura: false,
      profesor: false,
      asistente: false,
    });
    const modalAcpDocentesData = reactive({
      acp: false,
      pac: false,
      nombrecursopac: false,
      asignatura: false,
      añocursopac: false,
      periodocursopac: false,
      profesor: false,
      asistente: false,
    });
    const modalListadoAlumnosData = reactive({
      idAcp: false,
      nombreasignatura: false,
      periodopac: false,
      yearpac: false,
      cursopac: false,
    });
    const modalAlumnoData = reactive({
      alumnoSeleccionado: false,
    });
    const modalEliminarAlumnoData = reactive({
      nombreAlumno: false,
      apellidoPAlumno: false,
      apellidoMAlumno: false,
      rutAlumno: false,
      idAlumno: false,
      eliminar: "",
    });
    const isModalAsignaturaCursoVisible = ref(false);
    const isModalDocenteVisible = ref(false);
    const isModalListadoAlumnosVisible = ref(false);
    const isModalAlumnoVisible = ref(false);
    const isModalEliminarAlumnoVisible = ref(false);
    var ajaxConfig = {
      headers: {
        "Content-type": "application/json",
      },
      credentials: "include",
    };
    var ajaxConfig2 = {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      credentials: "include",
    };
    const showModalAsignaturaCurso = async () => {
      const pacsResponse = await fetch(
        "http://localhost:3000/api/pacs/getall",
        {
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );
      pacs.value = await pacsResponse.json();
      isModalAsignaturaCursoVisible.value = true;
    };
    const showModalDocente = async () => {
      await fetch("http://localhost:3000/api/users/getusersrol", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ rol: "docente" }),
      })
        .then((response) => response.json())
        .then((data) => (docentes.value = data));
      isModalDocenteVisible.value = true;
    };
    const showModalListadoAlumnos = () => {
      tableAlumnos.setData(
        "http://localhost:3000/api/asignaturaalumno/getalumnosasignatura",
        { acp: modalListadoAlumnosData.idAcp },
        ajaxConfig2
      );
      isModalListadoAlumnosVisible.value = true;
    };
    const showModalAlumno = async () => {
      isModalListadoAlumnosVisible.value = false;
      modalAlumnoData.alumnoSeleccionado = false;
      const response = await fetch(
        "http://localhost:3000/api/asignaturaalumno/getalumnosdisponiblespac",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ acp: modalListadoAlumnosData.idAcp }),
        }
      )
        .then((response) => response.json())
        .then((data) => (alumnosDisponiblesAsignatura.value = data));

      isModalAlumnoVisible.value = true;
    };
    const showModalEliminarAlumno = () => {
      closeModalListadoAlumnos();
      modalEliminarAlumnoData.eliminar = "";
      isModalEliminarAlumnoVisible.value = true;
    };
    const closeModalDocente = () => {
      isModalDocenteVisible.value = false;
    };
    const closeModalListadoAlumnos = () => {
      isModalListadoAlumnosVisible.value = false;
    };
    const closeModalAlumno = () => {
      isModalAlumnoVisible.value = false;
    };
    const closeModalAsignaturaCurso = () => {
      modalAcpData.asignatura=false;
      modalAcpData.profesor=false;
      modalAcpData.asistente=false;
      isModalAsignaturaCursoVisible.value = false;
    };
    const closeModalEliminarAlumno = () => {
      isModalEliminarAlumnoVisible.value = false;
    };
    const editDocentesAcp = async () => {
      const response = await fetch("http://localhost:3000/api/acp/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          idacp: modalAcpDocentesData.acp,
          idprofesor: modalAcpDocentesData.profesor._id,
          idasistente: modalAcpDocentesData.asistente._id,
        }),
      });
      if (response.status === 200) {
        notify({
          title: "Actualizacion de docentes asisgnatura exitosa 🎉",
          type: "success",
        });
      } else {
        notify({
          title: "Error 🎉",
          type: "error",
        });
      }
      table.setData("http://localhost:3000/api/acp/getall", {}, ajaxConfig);
      closeModalDocente();
    };

    const changedPacValue = async () => {
      modalAcpData.cursopac = false;
      modalAcpData.asignatura = false;
      await fetch("http://localhost:3000/api/cursopacs/getallpac", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ idpac: modalAcpData.pac._id }),
      })
        .then((response) => response.json())
        .then((data) => (cursoPacs.value = data));
    };
    const changedCursoPacValue = async () => {
      modalAcpData.asignatura = false;
      await fetch("http://localhost:3000/api/acp/getasignaturasdisponibles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ idcursopac: modalAcpData.cursopac._id }),
      })
        .then((response) => response.json())
        .then((data) => (asignaturasDisponibles.value = data));
    };
    const changedAsignaturaValue = async () => {
      modalAcpData.profesorjefe = false;
      modalAcpData.asistente = false;
      await fetch("http://localhost:3000/api/users/getusersrol", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ rol: "docente" }),
      })
        .then((response) => response.json())
        .then((data) => (docentes.value = data));
    };
    const createAcp = async () => {
      const response = await fetch("http://localhost:3000/api/acp/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          idpac: modalAcpData.pac._id,
          idcursopac: modalAcpData.cursopac._id,
          idasignatura: modalAcpData.asignatura._id,
          idprofesor: modalAcpData.profesor._id,
          idasistente: modalAcpData.asistente._id,
        }),
      });
      if (response.status === 200) {
        notify({
          title: "Creacion asignatura curso periodo exitosa 🎉",
          type: "success",
        });
      } else {
        notify({
          title: "ERROR",
          type: "error",
        });
      }
      table.setData("http://localhost:3000/api/acp/getall", {}, ajaxConfig);
      closeModalAsignaturaCurso();
    };
    const createAsignaturaAlumno = async () => {
      const response = await fetch(
        "http://localhost:3000/api/asignaturaalumno/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            acp: modalListadoAlumnosData.idAcp,
            idalumno: modalAlumnoData.alumnoSeleccionado._id,
          }),
        }
      );
      if (response.status === 200) {
        notify({
          title: "Registro de usuario a asignatura exitosa 🎉",
          type: "success",
        });
        closeModalAlumno();
      } else {
        notify({
          title: "ERROR, vea la consola mas detelles",
          type: "error",
        });
      }
    };
    const deleteAsignaturaAlumno = async () => {
      const response = await fetch(
        "http://localhost:3000/api/asignaturaalumno/delete",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            acp: modalListadoAlumnosData.idAcp,
            idalumno: modalEliminarAlumnoData.idAlumno,
          }),
        }
      );
      if (response.status === 200) {
        notify({
          title: "Eliminacion de usuario de la asignatura exitosa 🎉",
          type: "success",
        });
        closeModalEliminarAlumno();
        showModalListadoAlumnos();
      } else {
        notify({
          title: "ERROR, vea la consola mas detelles",
          type: "error",
        });
      }
    };
    onMounted(async () => {
      var TeacherIcon = function (cell, formatterParams, onRendered) {
        return "<i class='fa fa-user-edit'></i>";
      };
      var UserIcon = function (cell, formatterParams, onRendered) {
        //plain text value
        return "<i class='fa fa-users'></i>";
      };
      var notasIcon = function (cell, formatterParams, onRendered) {
        //plain text value
        return "<i class='fa fa-pencil-ruler'></i>";
      };
      var DeleteIcon = function (cell, formatterParams, onRendered) {
        return "<i class='fa fa-user-slash'></i>";
      };

      var headerMenu = [
        {
          label: "Editar evaluacion",
          action: function (e, column) {},
        },
      ];
      table = new Tabulator("#example-table", {
        height: 600,
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
            title: "Curso",
            field: "idCursoPac.curso.nombre",
            headerFilter: "input",
            headerFilterPlaceholder: "filtrar columna...",
            editor: true,
          },
          {
            title: "Periodo",
            field: "nonyear",
            mutator: function (value, data, type, mutatorParams, cell) {
              return (
                data.idCursoPac.pac.year + " - " + data.idCursoPac.pac.number
              );
            },
            headerFilter: "input",
            headerFilterPlaceholder: "filtrar columna...",
            editor: true,
            hozAlign: "center",
            headerHozAlign: "center",
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
          {
            titleFormatter: notasIcon,
            formatter: notasIcon,
            tooltip: "Ver Notas asignatura",
            width: 40,
            hozAlign: "center",
            headerSort: false,
            cellClick: function (e, cell) {
              store.dispatch("setIdAsignatura", {
                idAsignatura: cell.getRow().getData()._id,
              });
              store.dispatch("setEsquemaNotas", {
                esquemaNotas: cell.getRow().getData().esquemaNotas,
              });
              router.push("/asignaturas/notas");
            },
          },

          {
            title: "ModificarDocente",
            titleFormatter: TeacherIcon,
            formatter: TeacherIcon,
            tooltip: "Cambiar docentes asignatura",
            width: 40,
            hozAlign: "center",
            headerSort: false,
            cellClick: function (e, cell) {
              modalAcpDocentesData.acp = cell.getRow().getData()._id;
              modalAcpDocentesData.asignatura = cell
                .getRow()
                .getData().asignatura.nombre;
              modalAcpDocentesData.nombrecursopac = cell
                .getRow()
                .getData().idCursoPac.curso.nombre;
              modalAcpDocentesData.añocursopac = cell
                .getRow()
                .getData().idCursoPac.pac.year;
              modalAcpDocentesData.periodocursopac = cell
                .getRow()
                .getData().idCursoPac.pac.number;
              showModalDocente();
            },
          },
          {
            formatter: UserIcon,
            titleFormatter: UserIcon,
            width: 40,
            hozAlign: "center",
            tooltip: "Listado alumnos asignatura",
            headerSort: false,
            cellClick: function (e, cell) {
              modalListadoAlumnosData.idAcp = cell.getRow().getData()._id;
              modalListadoAlumnosData.nombreasignatura = cell
                .getRow()
                .getData().asignatura.nombre;
              modalListadoAlumnosData.cursopac = cell
                .getRow()
                .getData().idCursoPac.curso.nombre;
              modalListadoAlumnosData.yearpac = cell
                .getRow()
                .getData().idCursoPac.pac.year;
              modalListadoAlumnosData.periodopac = cell
                .getRow()
                .getData().idCursoPac.pac.number;
              showModalListadoAlumnos();
            },
          },
        ],
      });
      if (
        store.state.user.rol.nombre != "administrador" &&
        store.state.user.rol.nombre != "coordinador"
      ) {
        var cols = table.getColumns(true);
        cols[8].hide();
      }
      table.setData("http://localhost:3000/api/acp/getall", {}, ajaxConfig);

      tableAlumnos = new Tabulator("#tableAlumnos", {
        ajaxContentType: "json",
        height: 600,

        
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
    });

    return {
      data,
      pacs,
      cursoPacs,
      docentes,
      asignaturasDisponibles,
      alumnosDisponiblesAsignatura,
      modalAcpData,
      modalAcpDocentesData,
      modalListadoAlumnosData,
      modalAlumnoData,
      modalEliminarAlumnoData,
      isModalAsignaturaCursoVisible,
      isModalDocenteVisible,
      isModalListadoAlumnosVisible,
      isModalAlumnoVisible,
      isModalEliminarAlumnoVisible,
      showModalAsignaturaCurso,
      showModalDocente,
      showModalListadoAlumnos,
      showModalAlumno,
      showModalEliminarAlumno,
      closeModalAsignaturaCurso,
      closeModalDocente,
      closeModalListadoAlumnos,
      closeModalAlumno,
      closeModalEliminarAlumno,
      changedPacValue,
      changedCursoPacValue,
      changedAsignaturaValue,
      createAcp,
      editDocentesAcp,
      createAsignaturaAlumno,
      deleteAsignaturaAlumno,
    };
  },
};
</script>

<template>
  <div class="home">
    <div class="navbar">
      <button class="button-36 button-curso" @click="showModalAsignaturaCurso">
        Registrar asignatura a curso
      </button>
    </div>
    <div class="Table" id="example-table"></div>
    <Modal
      v-show="isModalAsignaturaCursoVisible"
      @close="closeModalAsignaturaCurso"
    >
      <template v-slot:header> </template>

      <template v-slot:body>
        <form @submit.prevent="editSelected" class="editform">
          <div class="header">
            <h2>Registrar datos Asignatura Curso</h2>
          </div>
          <div class="form">
            <h3>Seleccione Año del curso</h3>
            <v-select
              :options="pacs"
              label="pac.year"
              placeholder="Selecione Periodo Academico"
              v-model="modalAcpData.pac"
              @option:selected="changedPacValue"
            >
              <template #option="{ year, number }">
                <p style="margin: 0">{{ year }}-{{ number }}</p>
              </template>
              <template #selected-option="{ year, number }">
                <p style="margin: 0">{{ year }}-{{ number }}</p>
              </template>
              <template #search="{ attributes, events }">
                <input
                  class="vs__search"
                  :required="!modalAcpData.pac"
                  v-bind="attributes"
                  v-on="events"
                />
              </template>
            </v-select>
            <h3 v-if="modalAcpData.pac">Seleccione Curso:</h3>
            <v-select
              v-if="modalAcpData.pac"
              :options="cursoPacs"
              label="_id"
              :getOptionLabel="(option) => option.curso.nombre"
              placeholder="Selecione curso periodo"
              v-model="modalAcpData.cursopac"
              @option:selected="changedCursoPacValue"
            >
              <template #search="{ attributes, events }">
                <input
                  class="vs__search"
                  :required="!modalAcpData.pac"
                  v-bind="attributes"
                  v-on="events"
                />
              </template>
            </v-select>

            <h3 v-if="modalAcpData.cursopac && modalAcpData.pac">
              Seleccione Asignatura aun no registrada en curso:
            </h3>
            <v-select
              v-if="modalAcpData.cursopac && modalAcpData.pac"
              :options="asignaturasDisponibles"
              label="nombre"
              placeholder="Selecione asignatura"
              v-model="modalAcpData.asignatura"
              @option:selected="changedAsignaturaValue"
            >
              <template #search="{ attributes, events }">
                <input
                  class="vs__search"
                  :required="!modalAcpData.pac"
                  v-bind="attributes"
                  v-on="events"
                />
              </template>
            </v-select>
            <h3
              v-if="
                modalAcpData.cursopac &&
                modalAcpData.pac &&
                modalAcpData.asignatura
              "
            >
              Seleccione profesor asignatura
            </h3>
            <v-select
              v-if="
                modalAcpData.cursopac &&
                modalAcpData.pac &&
                modalAcpData.asignatura
              "
              :options="docentes"
              label="nombre"
              placeholder="Seleccione profesor asignatura"
              v-model="modalAcpData.profesor"
            >
              <template #option="{ nombre, apellidoP, apellidoM, rut }">
                <p style="margin: 0">
                  {{ nombre }} {{ apellidoP }} {{ apellidoM }} RUT:{{ rut }}
                </p>
              </template>
              <template
                #selected-option="{ nombre, apellidoP, apellidoM, rut }"
              >
                <p style="margin: 0">
                  {{ nombre }} {{ apellidoP }} {{ apellidoM }} RUT:{{ rut }}
                </p>
              </template>
              <template #search="{ attributes, events }">
                <input
                  class="vs__search"
                  :required="!modalAcpData.profesor"
                  v-bind="attributes"
                  v-on="events"
                />
              </template>
            </v-select>
            <h3
              v-if="
                modalAcpData.cursopac &&
                modalAcpData.pac &&
                modalAcpData.asignatura
              "
            >
              Seleccione asistente asignatura
            </h3>
            <v-select
              v-if="
                modalAcpData.cursopac &&
                modalAcpData.pac &&
                modalAcpData.asignatura
              "
              :options="docentes"
              label="nombre"
              placeholder="Seleccione asistente asignatura"
              v-model="modalAcpData.asistente"
            >
              <template #option="{ nombre, apellidoP, apellidoM, rut }">
                <p style="margin: 0">
                  {{ nombre }} {{ apellidoP }} {{ apellidoM }} RUT:{{ rut }}
                </p>
              </template>
              <template
                #selected-option="{ nombre, apellidoP, apellidoM, rut }"
              >
                <p style="margin: 0">
                  {{ nombre }} {{ apellidoP }} {{ apellidoM }} RUT:{{ rut }}
                </p>
              </template>
            </v-select>
            <button v-if="modalAcpData.profesor" @click="createAcp" class="button-36 buttonAsignatura">
              Registrar nueva asignatura a curso
            </button>
          </div>
        </form>
      </template>

      <template v-slot:footer> </template>
    </Modal>

    <Modal v-show="isModalDocenteVisible" @close="closeModalDocente">
      <template v-slot:header> </template>

      <template v-slot:body>
        <form @submit.prevent="editDocentesAcp" class="editform">
          <div class="header">
            <h2>
              Modificacion docentes {{ modalAcpDocentesData.asignatura }},
              Curso: {{ modalAcpDocentesData.nombrecursopac }}
              {{ modalAcpDocentesData.añocursopac }}-{{
                modalAcpDocentesData.periodocursopac
              }}
            </h2>
            <h3>Seleccione un nuevo profesor de la lista</h3>
          </div>
          <div class="form">
            <v-select
              :options="docentes"
              label="nombre"
              placeholder="Seleccione profesor"
              v-model="modalAcpDocentesData.profesor"
            >
              <template #option="{ nombre, apellidoP, apellidoM, rut }">
                <p style="margin: 0">
                  {{ nombre }} {{ apellidoP }} {{ apellidoM }} RUT:{{ rut }}
                </p>
              </template>
              <template
                #selected-option="{ nombre, apellidoP, apellidoM, rut }"
              >
                <p style="margin: 0">
                  {{ nombre }} {{ apellidoP }} {{ apellidoM }} RUT:{{ rut }}
                </p>
              </template>
              <template #search="{ attributes, events }">
                <input
                  class="vs__search"
                  :required="!modalAcpDocentesData.profesor"
                  v-bind="attributes"
                  v-on="events"
                />
              </template>
            </v-select>
            <h3>Seleccione un nuevo asistente de la lista</h3>
            <v-select
              :options="docentes"
              label="nombre"
              placeholder="Seleccione profesor"
              v-model="modalAcpDocentesData.asistente"
            >
              <template #option="{ nombre, apellidoP, apellidoM, rut }">
                <p style="margin: 0">
                  {{ nombre }} {{ apellidoP }} {{ apellidoM }} RUT:{{ rut }}
                </p>
              </template>
              <template
                #selected-option="{ nombre, apellidoP, apellidoM, rut }"
              >
                <p style="margin: 0">
                  {{ nombre }} {{ apellidoP }} {{ apellidoM }} RUT:{{ rut }}
                </p>
              </template>
            </v-select>

            <button class="button-36 buttonAsignatura">Confirmar cambios profesores curso</button>
          </div>
        </form>
      </template>

      <template v-slot:footer> </template>
    </Modal>

    <Modal
      v-show="isModalListadoAlumnosVisible"
      @close="closeModalListadoAlumnos"
    >
      <template v-slot:header> </template>

      <template v-slot:body>
        <button
        style="margin-bottom: 20px"
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
            <h2>Listado alumnos  {{ modalListadoAlumnosData.nombreasignatura }}</h2>
            <h3>              
              {{ modalListadoAlumnosData.cursopac }}
              {{ modalListadoAlumnosData.yearpac }}-{{
                modalListadoAlumnosData.periodopac
              }}
            </h3>
          </div>
          <div class="form">
            <div class="TableModalAlumnos" id="tableAlumnos"></div>
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
            <h2>Registrar alumno a Curso:</h2>
            <h3>Seleccione un alumno disponible de la lista:</h3>
          </div>
          <div class="form">
            <v-select label="nombre" placeholder="Seleccione alumno">
              <template #option="{ nombre, apellidoP, apellidoM, rut }">
                <p style="margin: 0">
                  {{ nombre }} {{ apellidoP }} {{ apellidoM }} RUT:{{ rut }}
                </p>
              </template>
              <template
                #selected-option="{ nombre, apellidoP, apellidoM, rut }"
              >
                <p style="margin: 0">
                  {{ nombre }} {{ apellidoP }} {{ apellidoM }} RUT:{{ rut }}
                </p>
              </template>
              <template #search="{ attributes, events }">
                <input class="vs__search" v-bind="attributes" v-on="events" />
              </template>
            </v-select>

            <button>Agregar a Curso</button>
          </div>
        </form>
      </template>

      <template v-slot:footer> </template>
    </Modal>

    <Modal v-show="isModalAlumnoVisible" @close="closeModalAlumno">
      <template v-slot:header> </template>
      <template v-slot:body>
        <form @submit.prevent="createAsignaturaAlumno" class="editform">
          <div class="header">
            <h2>Registrar alumno a 
              {{ modalListadoAlumnosData.nombreasignatura }}, curso:
              {{ modalListadoAlumnosData.cursopac }}
              {{ modalListadoAlumnosData.yearpac }}-{{
                modalListadoAlumnosData.periodopac
              }}
            </h2>
            <h3>Seleccione un alumno disponible de la lista:</h3>
          </div>
          <div class="form">
            <v-select
              :options="alumnosDisponiblesAsignatura"
              label="nombre"
              placeholder="Seleccione alumno"
              v-model="modalAlumnoData.alumnoSeleccionado"
            >
              <template #option="{ nombre, apellidoP, apellidoM, rut }">
                <p style="margin: 0">
                  {{ nombre }} {{ apellidoP }} {{ apellidoM }} RUT:{{ rut }}
                </p>
              </template>
              <template
                #selected-option="{ nombre, apellidoP, apellidoM, rut }"
              >
                <p style="margin: 0">
                  {{ nombre }} {{ apellidoP }} {{ apellidoM }} RUT:{{ rut }}
                </p>
              </template>
              <template #search="{ attributes, events }">
                <input
                  class="vs__search"
                  :required="!modalAlumnoData.alumnoSeleccionado"
                  v-bind="attributes"
                  v-on="events"
                />
              </template>
            </v-select>

            <button class="button-36 buttonAsignatura">Agregar a Curso</button>
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
        <form @submit.prevent="deleteAsignaturaAlumno" class="editform">
          <div class="header">
            <h2>Elimimar alumno de asignatura</h2>
            <h3>Asignatura: {{ modalListadoAlumnosData.nombreasignatura }}</h3>
            <h3>
              Curso: {{ modalListadoAlumnosData.cursopac }}
              {{ modalListadoAlumnosData.yearpac }}-{{
                modalListadoAlumnosData.periodopac
              }}
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
  </div>
</template>

<style>
@import "https://unpkg.com/vue-select@latest/dist/vue-select.css";
</style>
<style src="../assets/tabulator_bootstrap4.min.css"></style>
<style>
@import url("https://fonts.googleapis.com/css?family=Rubik:400,500&display=swap");

body {
  font-family: "Rubik", sans-serif;
}

.Table {
  margin: auto;
  width: 80vw;
}
.TableModalAlumnos {
  margin: auto;
  padding: 10px 50px;
  width: 58vw;
}

.button-curso {
  width: 15vw;
}
.modal {
  height: 80vh;
}
.buttonAsignatura {
  align-self: center;
  width: 20vw;
  margin-top: 20px;
}
.formAsignatura {
  margin-bottom: 100px;
}

</style>
