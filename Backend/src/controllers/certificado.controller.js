import User from "../models/User";
import CursoPac from "../models/CursoPac";
import AsignaturaAlumno from "../models/AsignaturaAlumno";
import CursoAlumno from "../models/CursoAlumno";
import AsignaturaCursoPac from "../models/AsignaturaCursoPac";
import BasePersonalidadCurso from "../models/BasePersonalidadCurso";
import EstadoPersonalidad from "../models/EstadoPersonalidad";
import Asiste from "../models/Asiste";
import Pac from "../models/Pac" ;
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

export const generateCertificado = async (req, res) => {
  try {
    const { certificado, idpac, motivo } = req.body;
    const alumno = req.userId;
    const user = await User.findById(req.userId, { password: 0 });
    if (!user) return res.status(404).json({ message: "No user found" });
    const pac = await Pac.findById(idpac);
    if (!pac) return res.status(404).json({ message: "No existe el periodo" });
    let nombreCompleto =
      user.nombre + " " + user.apellidoP + " " + user.apellidoM;
    var today  = new Date();
    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    var fecha = today.toLocaleDateString("es-CL", options)
    var docDefinition;
    switch (certificado) {
      case 106:
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
              text: "C E R T I F I C A D O",
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
                  ", es alumno regular del "+colegio.NOMBRECOLEGIO.toLowerCase+ ", en el periodo " +
                  pac.year +
                  " " +
                  pac.type +
                  " " +
                  pac.number +
                  ".\n",
              ],
              fontSize: 11,
              alignment: "justify",
              margin: [10, 0],
            },
            {
              text: [
                "Dado a petición del interesado(a) para trámites en " +
                  motivo +
                  ". \n",
              ],
              fontSize: 11,
              alignment: "justify",
              margin: [10, 5],
            },
            {
              alignment: "center",
              columns: [
                {
                  text: " ",
                },
                {
                  image: "src/includes/stamp.png",
                  margin:[0, 50, 80, 0],
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
                  text: [
                    "Sylvia Sepúlveda \n Secretaria UTP "                      
                  ],
                  fontSize: 11,
                  alignment: "center",
                  margin: [10, 5],
                },
              ],
            },
            {
                text: [
                  "Fecha emision: " +
                    fecha +
                    " \n",
                ],
                fontSize: 9,
                alignment: "left",
                margin: [0, 150],
              },
          ],
          defaultStyle: {
            font: "OpenSans",
          },
        };
        break;
      case 304:
        {
          const user = await User.findById(Types.ObjectId(alumno), {
            password: 0,
          });
          if (!user)
            return res.status(404).json({ message: "No user found" });
          let nombreCompleto =
            user.nombre + " " + user.apellidoP + " " + user.apellidoM;
          let listaNotas = [];
          const CursosPeriodo = await CursoPac.find({
            idPac: idpac,
          });
          const asignaturas = await AsignaturaCursoPac.find({
            idCursoPac: { $in: CursosPeriodo },
          });
          const aa = await AsignaturaAlumno.find({
            idAlumno: alumno,
            idAsignaturaCursoPac: { $in: asignaturas },
          });
          await Promise.all(
            aa.map(async (element) => {
              let x = await CalcularNotaAsignatura(
                alumno,
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
                text: "CONCEPCIÓN - CHILE",
                fontSize: 10,
                alignment: "center",
              },
              {
                text: "C E R T I F I C A D O  D E  C O N C E N T R A C I O N  D E  N O T A S",
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
                    pac.year +
                    " " +
                    pac.type +
                    " " +
                    pac.number +
                                       
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
                columns: [
                  {
                    text: " ",
                  },
                  {
                    image: "src/includes/stamp.png",
                    margin: [0, 50, 80, 0],
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
          };}
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

