import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";




import pkg from "../package.json";

import userRoutes from "./routes/user.routes";
import authRoutes from "./routes/auth.routes";
import resetTokenRoutes from "./routes/reset.routes";
import pacRoutes from "./routes/pac.routes";
import cursopacRoutes from "./routes/cursopac.routes";
import asignaturacursopacRoutes from "./routes/asignaturacursopac.routes";
import asignaturaRoutes from "./routes/asignatura.routes";
import comunaRoutes from "./routes/comuna.routes";
import asisteRoutes from "./routes/asiste.routes";
import cursoalumnoRoutes from "./routes/cursoalumno.routes";
import asignaturaalumnoRoutes from "./routes/asignaturaalumno.routes";
import basepersonalidadRoutes from "./routes/basePersonalidad.routes";
import basepersonalidadcursoRoutes from "./routes/basePersonalidadCurso.routes";
import estadopersonalidadRoutes from "./routes/estadoPersonalidad.routes";
import certificadoRoutes from "./routes/certificado.routes";
import informeRoutes from "./routes/informe.routes";

import { createroles, createAdmin} from "./libs/initialSetup";
const app = express();
createroles();
createAdmin();


app.set("pkg", pkg);
app.set("port", process.env.PORT || 3000);
app.set("json spaces", 4);

app.use(cookieParser());
const corsOptions = {
  credentials:true,
  origin: "http://localhost:8080",
};
app.use(cors(corsOptions));
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.get("/", (req, res) => {
  res.json({
    message: "Welcome to my Products API",
    name: app.get("pkg").name,
    version: app.get("pkg").version,
    description: app.get("pkg").description,
    author: app.get("pkg").author,
  });
});



app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/reset", resetTokenRoutes);
app.use("/api/pacs", pacRoutes);
app.use("/api/cursopacs", cursopacRoutes);
app.use("/api/asignaturas", asignaturaRoutes);
app.use("/api/acp", asignaturacursopacRoutes);
app.use("/api/comunas", comunaRoutes);
app.use("/api/asiste", asisteRoutes);
app.use("/api/cursoalumnos", cursoalumnoRoutes);
app.use("/api/asignaturaalumno", asignaturaalumnoRoutes);
app.use("/api/basepersonalidad", basepersonalidadRoutes);
app.use("/api/basepersonalidadcurso", basepersonalidadcursoRoutes);
app.use("/api/estadopersonalidad", estadopersonalidadRoutes);
app.use("/api/certificados", certificadoRoutes);
app.use("/api/informes", informeRoutes);
export default app;