import { Schema, model } from "mongoose";

export const cursoPacSchema = new Schema({
  curso: {
    idCurso: { ref: "Curso", type: Schema.Types.ObjectId },
    nombre: {
      type: String,
      min: [2, "Muy corto, got {VALUE}"],
      max: [4, "Max 4emD, got {VALUE}"],
      lowercase: true,
      required: true,
    },
    numero: {
      type: Number,
      required: true,
    },
    letra: {
      type: String,
      maxLength: 1,
      lowercase: true,
      required: true,
    },
    nivel: {
      type: String,
      lowercase: true,
      enum: {
        values: ["prebasica", "basica", "media"],
        message: "{VALUE} no es valido",
      },
    },
  },
  pac: {
    idPac: { ref: "Pac", type: Schema.Types.ObjectId },
    year: {
      type: Number,
      min: [2020, "Min 2020, got {VALUE}"],
      required: true,
    },
    type: {
      type: String,
      lowercase: true,
      enum: {
        values: ["semestre", "trimestre", "otro"],
        message: "{VALUE} no es valido",
      },
      required: true,
    },
    number: {
      type: Number,
      min: [1, "Min 1, got {VALUE}"],
      max: [4, "Max 4, got {VALUE}"],
      required: true,
    },

    fechaInicio: {
      type: Date,
    },
    fechaFin: {
      type: Date,
    },
  },
  idDocente: {
    ref: "User",
    type: Schema.Types.ObjectId,
    required: true,
  },
});

export default model("CursoPac", cursoPacSchema);
