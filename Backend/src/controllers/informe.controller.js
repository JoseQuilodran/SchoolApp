import User from "../models/User";
import CursoPac from "../models/CursoPac";
import AsignaturaAlumno from "../models/AsignaturaAlumno";
import CursoAlumno from "../models/CursoAlumno";
import AsignaturaCursoPac from "../models/AsignaturaCursoPac";
import BasePersonalidadCurso from "../models/BasePersonalidadCurso";
import EstadoPersonalidad from "../models/EstadoPersonalidad";
import Asiste from "../models/Asiste";
import { Types } from "mongoose";
import colegio from "../colegio";
var fonts = {
  OpenSans: {
    normal: "src/includes/fonts/OpenSans-Regular.ttf",
    bold: "src/includes/fonts/OpenSans-Bold.ttf",
    italics: "src/includes/fonts/OpenSans-Italic.ttf",
    bolditalics: "src/includes/fonts/OpenSans-BoldItalic.ttf",
  },
};

import PdfPrinter from "pdfmake";
import { createWriteStream } from "fs";
import { notStrictEqual } from "assert";
import Curso from "../models/Curso";
var printer = new PdfPrinter(fonts);

export const generateInforme = async (req, res) => {
  try {
    const { informe, idcursopac, idalumno } = req.body;

    const cursopac = await CursoPac.findById(idcursopac);
    if (!cursopac)
      return res.status(404).json({ message: "No existe el periodo curso" });

    var today = new Date();
    var options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    var fecha = today.toLocaleDateString("es-CL", options);

    var docDefinition = {};
    switch (informe) {
      case 1106: //informe notas
        if (idalumno) {
          {
            const user = await User.findById(Types.ObjectId(idalumno), {
              password: 0,
            });
            if (!user)
              return res.status(404).json({ message: "No user found" });
            let nombreCompleto =
              user.nombre + " " + user.apellidoP + " " + user.apellidoM;
            let listaNotas = [];
            const CursosPeriodo = await CursoPac.find({
              idPac: cursopac.pac.idPac,
            });
            const asignaturas = await AsignaturaCursoPac.find({
              idCursoPac: { $in: CursosPeriodo },
            });
            const aa = await AsignaturaAlumno.find({
              idAlumno: idalumno,
              idAsignaturaCursoPac: { $in: asignaturas },
            });
            await Promise.all(
              aa.map(async (element) => {
                let x = await CalcularNotaAsignatura(
                  idalumno,
                  element.idAsignaturaCursoPac._id
                );
                listaNotas.push(x);
              })
            );
            let promedioFinal = 0;
            listaNotas.forEach((element) => {
              promedioFinal += element[1];
            });
            promedioFinal = promedioFinal / listaNotas.length;
            let promedioRound = Math.round(promedioFinal * 10) / 10;
            listaNotas.push([
              { text: "Promedio final periodo:", bold: true },
              { text: promedioRound, bold: true },
            ]);
            let asistencia = await CalcularAsistenciaAlumno(idalumno,idcursopac);
            
            docDefinition = {
              content: [
                {
                  image: "src/includes/logocdscc.png",
                  width: 50,
                },
                {
                  text: colegio.NOMBRECOLEGIO,
                  fontSize: 12,
                  bold: true,
                  alignment: "center",
                },
                {
                  text: "Unidad de Admisión y Registro Académico Estudiantil",
                  fontSize: 10,
                  alignment: "center",
                },
                {
                  text: colegio.UBICACION,
                  fontSize: 10,
                  alignment: "center",
                },
                {
                  text: "I N F O R M E  D E  N O T A S",
                  fontSize: 15,
                  bold: true,
                  alignment: "center",
                  margin: [0, 20],
                },
                {
                  text: [
                    "La Unidad de Admisión y Registro Académico Estudiantil que suscribe certifica que " +
                      nombreCompleto +
                      ", RUT " +
                      user.rut +
                      ", obtuvo las siguientes notas, en el periodo " +
                      cursopac.pac.year +
                      " " +
                      cursopac.pac.type +
                      " " +
                      cursopac.pac.number +
                      ", en el curso " +
                      cursopac.curso.nombre +
                      ":\n",
                  ],
                  fontSize: 11,
                  alignment: "justify",
                  margin: [10, 0],
                },
                {
                  alignment: "center",
                  margin: [50, 50, 0, 0],
                  table: {
                    widths: [300, 100],
                    headerRows: 1,
                    body: [
                      [
                        { text: "Asignatura", bold: true },
                        { text: "Nota", bold: true },
                      ],
                    ].concat(listaNotas),
                  },
                },
                {
                  alignment: "center",
                  
                  margin: [50, 10, 0, 0],
                  table: {
                    
                    headerRows: 1,
                    body: [
                      [
                        { text: "Dias asistidos", bold: true },
                        { text: "Dias ausentes", bold: true },
                        { text: "Dias justificados", bold: true },
                        { text: "Porcentaje asistencia", bold: true },
                      ]
                    ].concat(asistencia),
                  },
                },
                {
                  alignment: "center",
                  columns: [
                    {
                      text: " ",
                    },
                    {
                      image: "src/includes/stamp.png",
                      margin: [0, 10, 80, 0],
                      width: 100,
                    },
                  ],
                },
                {
                  alignment: "center",
                  columns: [
                    {
                      text: " ",
                    },
                    {
                      text: ["Sylvia Sepúlveda \n Secretaria UTP "],
                      fontSize: 11,
                      alignment: "center",
                      margin: [10, 5],
                    },
                  ],
                },
                {
                  text: ["Fecha emision: " + fecha + " \n"],
                  fontSize: 9,
                  alignment: "left",
                  margin: [0, 50,0,0],
                },
              ],
              defaultStyle: {
                font: "OpenSans",
              },
            };
          }
        } else {
          //caso informe notas curso entero
          {
            const AlumnosCurso = await CursoAlumno.find({
              idCursoPac: idcursopac,
            });

            let contentAll = [];
            await Promise.all(
              AlumnosCurso.map(async (element) => {
                const user = await User.findById(
                  Types.ObjectId(element.idAlumno),
                  { password: 0 }
                );
                if (!user)
                  return res.status(404).json({ message: "No user found" });
                let nombreCompleto =
                  user.nombre + " " + user.apellidoP + " " + user.apellidoM;
                let listaNotas = [];
                const CursosPeriodo = await CursoPac.find({
                  idPac: cursopac.pac.idPac,
                });
                const asignaturas = await AsignaturaCursoPac.find({
                  idCursoPac: { $in: CursosPeriodo },
                });
                const aa = await AsignaturaAlumno.find({
                  idAlumno: element.idAlumno,
                  idAsignaturaCursoPac: { $in: asignaturas },
                });
                await Promise.all(
                  aa.map(async (element) => {
                    let x = await CalcularNotaAsignatura(
                      element.idAlumno,
                      element.idAsignaturaCursoPac._id
                    );
                    listaNotas.push(x);
                  })
                );
                let promedioFinal = 0;
                listaNotas.forEach((element) => {
                  promedioFinal += element[1];
                });
                promedioFinal = promedioFinal / listaNotas.length;
                let promedioRound = Math.round(promedioFinal * 10) / 10;
                listaNotas.push([
                  { text: "Promedio final periodo:", bold: true },
                  { text: promedioRound, bold: true },
                ]);
                let asistencia = await CalcularAsistenciaAlumno(element.idAlumno,idcursopac);
                contentAll.push(
                  {
                    image: "src/includes/logocdscc.png",
                    width: 50,
                  },
                  {
                    text: colegio.NOMBRECOLEGIO,
                    fontSize: 12,
                    bold: true,
                    alignment: "center",
                  },
                  {
                    text: "Unidad de Admisión y Registro Académico Estudiantil",
                    fontSize: 10,
                    alignment: "center",
                  },
                  {
                    text: colegio.UBICACION,
                    fontSize: 10,
                    alignment: "center",
                  },
                  {
                    text: "I N F O R M E  D E  N O T A S",
                    fontSize: 15,
                    bold: true,
                    alignment: "center",
                    margin: [0, 20],
                  },
                  {
                    text: [
                      "La Unidad de Admisión y Registro Académico Estudiantil que suscribe certifica que " +
                        nombreCompleto +
                        ", RUT " +
                        user.rut +
                        ", obtuvo las siguientes notas, en el periodo " +
                        cursopac.pac.year +
                        " " +
                        cursopac.pac.type +
                        " " +
                        cursopac.pac.number +
                        ", en el curso " +
                        cursopac.curso.nombre +
                        ":\n",
                    ],
                    fontSize: 11,
                    alignment: "justify",
                    margin: [10, 0],
                  },
                  {
                    alignment: "center",
                    margin: [50, 50, 0, 0],
                    table: {
                      widths: [300, 100],
                      headerRows: 1,
                      body: [
                        [
                          { text: "Asignatura", bold: true },
                          { text: "Nota", bold: true },
                        ],
                      ].concat(listaNotas),
                    },
                  },
                  {
                    alignment: "center",
                    
                    margin: [50, 10, 0, 0],
                    table: {
                      
                      headerRows: 1,
                      body: [
                        [
                          { text: "Dias asistidos", bold: true },
                          { text: "Dias ausentes", bold: true },
                          { text: "Dias justificados", bold: true },
                          { text: "Porcentaje asistencia", bold: true },
                        ]
                      ].concat(asistencia),
                    },
                  },
                  {
                    alignment: "center",
                    columns: [
                      {
                        text: " ",
                      },
                      {
                        image: "src/includes/stamp.png",
                        margin: [0, 10, 80, 0],
                        width: 100,
                      },
                    ],
                  },
                  {
                    alignment: "center",
                    columns: [
                      {
                        text: " ",
                      },
                      {
                        text: ["Sylvia Sepúlveda \n Secretaria UTP "],
                        fontSize: 11,
                        alignment: "center",
                        margin: [10, 5],
                      },
                    ],
                  },
                  {
                    text: ["Fecha emision: " + fecha + " \n"],
                    fontSize: 9,
                    alignment: "left",
                    margin: [0, 50,0,0],
                    pageBreak: "after",
                  }
                );
              })
            );

            docDefinition = {
              content: contentAll,
              defaultStyle: {
                font: "OpenSans",
              },
            };
          }
        }
        break;
      case 3104: //informe notas
        if (idalumno) {
          {
            const user = await User.findById(Types.ObjectId(idalumno), {
              password: 0,
            });
            if (!user)
              return res.status(404).json({ message: "No user found" });
            let nombreCompleto =
              user.nombre + " " + user.apellidoP + " " + user.apellidoM;
            let listaPersonalidad = await CalcularPersonalidadAlumno(
              idalumno,
              idcursopac
            );

            docDefinition = {
              content: [
                {
                  image: "src/includes/logocdscc.png",
                  width: 50,
                },
                {
                  text: colegio.NOMBRECOLEGIO,
                  fontSize: 12,
                  bold: true,
                  alignment: "center",
                },
                {
                  text: "Unidad de Admisión y Registro Académico Estudiantil",
                  fontSize: 10,
                  alignment: "center",
                },
                {
                  text: colegio.UBICACION,
                  fontSize: 10,
                  alignment: "center",
                },
                {
                  text: "I N F O R M E  D E  P E R S O N A L I D A D",
                  fontSize: 15,
                  bold: true,
                  alignment: "center",
                  margin: [0, 15],
                },
                {
                  text: [
                    "La Unidad de Admisión y Registro Académico Estudiantil que suscribe certifica que " +
                      nombreCompleto +
                      ", RUT " +
                      user.rut +
                      ", mostro las siguientes aptitudes en el periodo " +
                      cursopac.pac.year +
                      " " +
                      cursopac.pac.type +
                      " " +
                      cursopac.pac.number +
                      ":\n",
                  ],
                  fontSize: 11,
                  alignment: "justify",
                  margin: [10, 0],
                },
                {
                  alignment: "center",
                  margin: [50, 10, 0, 0],
                  table: {
                    widths: [300, 100],
                    headerRows: 1,
                    body: [
                      [
                        { text: "Criterio a evaluar", bold: true },
                        { text: "Evaluacion", bold: true },
                      ],
                    ].concat(listaPersonalidad),
                  },
                },
                {
                  alignment: "center",
                  columns: [
                    {
                      text: " ",
                    },
                    {
                      image: "src/includes/stamp.png",
                      margin: [0, 5, 80, 0],
                      width: 100,
                    },
                  ],
                },
                {
                  alignment: "center",
                  columns: [
                    {
                      text: " ",
                    },
                    {
                      text: ["Sylvia Sepúlveda \n Secretaria UTP "],
                      fontSize: 11,
                      alignment: "center",
                      margin: [10, 5],
                    },
                  ],
                },
                {
                  text: ["Fecha emision: " + fecha + " \n"],
                  fontSize: 9,
                  alignment: "left",
                  margin: [0, 10],
                },
              ],
              defaultStyle: {
                font: "OpenSans",
              },
            };
          }
        } else {
          //caso informe Personalidad curso entero
          {
            const AlumnosCurso = await CursoAlumno.find({
              idCursoPac: idcursopac,
            });

            let contentAll = [];
            await Promise.all(
              AlumnosCurso.map(async (element) => {
                const user = await User.findById(
                  Types.ObjectId(element.idAlumno),
                  { password: 0 }
                );
                if (!user)
                  return res.status(404).json({ message: "No user found" });
                let nombreCompleto =
                  user.nombre + " " + user.apellidoP + " " + user.apellidoM;
                let listaPersonalidad = await CalcularPersonalidadAlumno(
                  element.idAlumno,
                  idcursopac
                );

                contentAll.push(
                  {
                    image: "src/includes/logocdscc.png",
                    width: 50,
                  },
                  {
                    text: colegio.NOMBRECOLEGIO,
                    fontSize: 12,
                    bold: true,
                    alignment: "center",
                  },
                  {
                    text: "Unidad de Admisión y Registro Académico Estudiantil",
                    fontSize: 10,
                    alignment: "center",
                  },
                  {
                    text: colegio.UBICACION,
                    fontSize: 10,
                    alignment: "center",
                  },
                  {
                    text: "I N F O R M E  D E  P E R S O N A L I D A D",
                    fontSize: 15,
                    bold: true,
                    alignment: "center",
                    margin: [0, 10],
                  },
                  {
                    text: [
                      "La Unidad de Admisión y Registro Académico Estudiantil que suscribe certifica que " +
                        nombreCompleto +
                        ", RUT " +
                        user.rut +
                        ", mostro las siguientes aptitudes en el periodo " +
                        cursopac.pac.year +
                        " " +
                        cursopac.pac.type +
                        " " +
                        cursopac.pac.number +
                        ":\n",
                    ],
                    fontSize: 11,
                    alignment: "justify",
                    margin: [10, 0],
                  },
                  {
                    alignment: "center",
                    margin: [50, 10, 0, 0],
                    table: {
                      widths: [300, 100],
                      headerRows: 1,
                      body: [
                        [
                          { text: "Criterio a evaluar", bold: true },
                          { text: "Evaluacion", bold: true },
                        ],
                      ].concat(listaPersonalidad),
                    },
                  },
                  {
                    alignment: "center",
                    columns: [
                      {
                        text: " ",
                      },
                      {
                        image: "src/includes/stamp.png",
                        margin: [0, 15, 80, 0],
                        width: 100,
                      },
                    ],
                  },
                  {
                    alignment: "center",
                    columns: [
                      {
                        text: " ",
                      },
                      {
                        text: ["Sylvia Sepúlveda \n Secretaria UTP "],
                        fontSize: 11,
                        alignment: "center",
                        margin: [10, 5],
                      },
                    ],
                  },
                  {
                    text: ["Fecha emision: " + fecha + " \n"],
                    fontSize: 9,
                    alignment: "left",
                    margin: [0, 5],
                    pageBreak: "after",
                  }
                );
              })
            );

            docDefinition = {
              content: contentAll,
              defaultStyle: {
                font: "OpenSans",
              },
            };
          }
        }
        break;
      default:
        break;
    }

    var options = {
      // ...
    };

    var pdfDoc = printer.createPdfKitDocument(docDefinition, options);
    res.setHeader("Content-type", "application/pdf");
    res.setHeader("Content-disposition", 'inline; filename="nice.pdf"');
    pdfDoc.pipe(res);
    pdfDoc.end();

    return res.status(200);
  } catch (error) {
    return res.status(401).json({ message: "error!", error: error.message });
  }
};

export const CalcularNotaAsignatura = async (idalumno, idacp) => {
  try {
    const acpfound = await AsignaturaCursoPac.findById(Types.ObjectId(idacp)); //contiene esquema notas
    const aafound = await AsignaturaAlumno.find({
      idAsignaturaCursoPac: idacp,
      idAlumno: idalumno,
    }); //contiene notas
    let esquemaNotas = acpfound.esquemaNotas;
    let notas = aafound[0].notas;
    let Normal = [];
    let Sumativa = [[], [], [], [], [], [], [], [], [], []];

    for (let index = 0; index < 10; index++) {
      if (esquemaNotas[index * 2 + 1] == 0) {
        break;
      } else if (esquemaNotas[index * 2 + 1] == 1) {
        Normal.push(parseFloat(notas[index]));
      } else if (esquemaNotas[index * 2 + 1] == 2) {
        Sumativa[esquemaNotas[index * 2] - 1].push(parseFloat(notas[index]));
      }
    }

    for (let index = 0; index < 10; index++) {
      if (Sumativa[index].length !== 0) {
        let promedioSumativa =
          Sumativa[index].reduce((a, b) => a + b, 0) / Sumativa[index].length;
        let s = Sumativa[index].reduce((a, b) => a + b, 0);
        Normal.push(Math.round(promedioSumativa * 10) / 10);
      }
    }
    let promedioNotas = Normal.reduce((a, b) => a + b, 0) / Normal.length;
    let x = Math.round(promedioNotas * 10) / 10;
    return [acpfound.asignatura.nombre, x];
  } catch (error) {
    console.error(error);
    return -1;
  }
};

export const CalcularPersonalidadAlumno = async (idalumno, idcursopac) => {
  try {
    const alumnoCurso = await CursoAlumno.find({
      idAlumno: idalumno,
      idCursoPac: idcursopac,
    }); //contiene estadoPersonalidad
    const basesCurso = await BasePersonalidadCurso.find({
      idCursoPac: idcursopac,
    }).sort({ orden: 1 }); //criterios curso

    const estadosPersonalidad = await EstadoPersonalidad.find(); //estados posibles
    let estadomap = new Map();
    estadosPersonalidad.map(function (obj) {
      estadomap.set(obj.codigo, obj.descripcion);
      return;
    });

    let Personalidad = [];
    const estados = alumnoCurso[0].estadoPersonalidad;

    basesCurso.forEach((element) => {
      let x = estados[element.orden]; //contiene codigo

      Personalidad.push([
        { text: element.basepersonalidad.descripcion, fontSize: 9 },
        { text: estadomap.get(x), fontSize: 9 },
      ]);
    });
    
    return Personalidad;
  } catch (error) {
    console.error(error);
    return -1;
  }
};

export const CalcularAsistenciaAlumno = async (idalumno, idcursopac) => {
  try {
    const asistenciaAlumnoCurso = await Asiste.find({
      idAlumno: idalumno,
      idCursoPac: idcursopac,
    }).sort({ numeroSemana: "asc" }); //contiene semanas

    let asistidos = 0;
    let ausentes = 0;
    let justificado = 0;
    await Promise.all(
      asistenciaAlumnoCurso.map(async (element) => {
        let estados = element.estadoSemana;
        estados.forEach((obj) => {
          switch (obj) {
            case 1:
              asistidos = asistidos + 1;
              break;
            case 2:
              ausentes = ausentes + 1;
              break;
            case 3:
              justificado = justificado + 1;
              break;
            default:
              break;
          }
        });
      })
    );
    let porcentaje = (100*(asistidos+justificado))/(asistidos+ausentes+justificado)
    porcentaje= Math.round(porcentaje * 10) / 10;
    let Asistencia = [];

    Asistencia.push([
      { text: asistidos, fontSize: 9 },
      { text:ausentes, fontSize: 9 },
      { text:justificado, fontSize: 9 },
      { text:porcentaje+"%", fontSize: 9, bold: true, },]
    );
   
    return Asistencia;
  } catch (error) {
    console.error(error);
    return -1;
  }
};
