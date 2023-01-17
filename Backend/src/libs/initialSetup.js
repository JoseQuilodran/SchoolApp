import Rol from "../models/Rol";
import User from "../models/User";
import Curso from "../models/Curso";
import Comuna from "../models/Comuna";
import Asignatura from "../models/Asignatura";
import EstadoPersonalidad from "../models/EstadoPersonalidad";
import BasePersonalidad from "../models/BasePersonalidad";
import config from "../config";
import bcrypt  from "bcryptjs";

export const createroles = async () => {
    try {
        const count = await Rol.estimatedDocumentCount() 
        if (count == 0) {
        const values = await Promise.all([
          new Rol({nombre: "usuario" }).save(),
          new Rol({nombre: "docente" }).save(),
          new Rol({nombre: "coordinador"}).save(),
          new Rol({nombre: "administrador"}).save(),
        
          new Curso({nombre: "PKA", numero:"-1", letra:"A", nivel:"PreBasica" }).save(),
          new Curso({nombre: "PKB", numero:"-1", letra:"B", nivel:"PreBasica" }).save(),
          new Curso({nombre: "KA", numero:"0", letra:"A", nivel:"PreBasica" }).save(),
          new Curso({nombre: "KB", numero:"0", letra:"B", nivel:"PreBasica" }).save(),
          new Curso({nombre: "1BA", numero:"1", letra:"A", nivel:"Basica" }).save(),
          new Curso({nombre: "1BB", numero:"1", letra:"B", nivel:"Basica" }).save(),  
          new Curso({nombre: "2BA", numero:"2", letra:"A", nivel:"Basica" }).save(),
          new Curso({nombre: "2BB", numero:"2", letra:"B", nivel:"Basica" }).save(),
          new Curso({ nombre: "3BA", numero: "3", letra: "A", nivel: "Basica" }).save(),
          new Curso({ nombre: "3BB", numero: "3", letra: "B", nivel: "Basica" }).save(), 
          new Curso({ nombre: "4BA", numero: "4", letra: "A", nivel: "Basica" }).save(),
          new Curso({ nombre: "4BB", numero: "4", letra: "B", nivel: "Basica" }).save(),
          new Curso({ nombre: "5BA", numero: "5", letra: "A", nivel: "Basica" }).save(),
          new Curso({ nombre: "5BB", numero: "5", letra: "B", nivel: "Basica" }).save(),   
          new Curso({ nombre: "6BA", numero: "6", letra: "A", nivel: "Basica" }).save(),
          new Curso({ nombre: "6BB", numero: "6", letra: "B", nivel: "Basica" }).save(),    
          new Curso({ nombre: "7BA", numero: "7", letra: "A", nivel: "Basica" }).save(),
          new Curso({ nombre: "7BB", numero: "7", letra: "B", nivel: "Basica" }).save(),   
          new Curso({ nombre: "8BA", numero: "8", letra: "A", nivel: "Basica" }).save(),
          new Curso({ nombre: "8BB", numero: "8", letra: "B", nivel: "Basica" }).save(),
          new Curso({ nombre: "1EMA", numero: "1", letra: "A", nivel: "Media" }).save(),
          new Curso({ nombre: "1EMB", numero: "1", letra: "B", nivel: "Media" }).save(),
          new Curso({ nombre: "1EMC", numero: "1", letra: "C", nivel: "Media" }).save(),
          new Curso({ nombre: "1EMD", numero: "1", letra: "D", nivel: "Media" }).save(),
          new Curso({ nombre: "2EMA", numero: "2", letra: "A", nivel: "Media" }).save(),
          new Curso({ nombre: "2EMB", numero: "2", letra: "B", nivel: "Media" }).save(),
          new Curso({ nombre: "2EMC", numero: "2", letra: "C", nivel: "Media" }).save(),
          new Curso({ nombre: "2EMD", numero: "2", letra: "D", nivel: "Media" }).save(),
          new Curso({ nombre: "3EMA", numero: "3", letra: "A", nivel: "Media" }).save(),
          new Curso({ nombre: "3EMB", numero: "3", letra: "B", nivel: "Media" }).save(),
          new Curso({ nombre: "3EMC", numero: "3", letra: "C", nivel: "Media" }).save(),
          new Curso({ nombre: "3EMD", numero: "3", letra: "D", nivel: "Media" }).save(),
          new Curso({ nombre: "4EMA", numero: "4", letra: "A", nivel: "Media" }).save(),
          new Curso({ nombre: "4EMB", numero: "4", letra: "B", nivel: "Media" }).save(),
          new Curso({ nombre: "4EMC", numero: "4", letra: "C", nivel: "Media" }).save(),
          new Curso({ nombre: "4EMD", numero: "4", letra: "D", nivel: "Media" }).save(),  
        
          new Comuna({ nombre:"ARICA",codigotesoreria:"1" }).save(),
          new Comuna({ nombre:"IQUIQUE",codigotesoreria:"2" }).save(),
          new Comuna({ nombre:"HUARA",codigotesoreria:"3" }).save(),
          new Comuna({ nombre:"PICA",codigotesoreria:"4" }).save(),
          new Comuna({ nombre:"POZO ALMONTE",codigotesoreria:"5" }).save(),  
          new Comuna({ nombre:"TOCOPILLA",codigotesoreria:"6" }).save(),
          new Comuna({ nombre:"ANTOFAGASTA",codigotesoreria:"7" }).save(),
          new Comuna({ nombre:"MEJILLONES",codigotesoreria:"8" }).save(),
          new Comuna({ nombre:"CONCEPCION",codigotesoreria:"188" }).save(),
      ])
      console.log(values)
    }
      const countAsignatura = await Asignatura.estimatedDocumentCount() 
        if (countAsignatura == 0) {
        const asignaturaValues = await Promise.all([
          new Asignatura({nombre: "Participación Argumentación en Democracia",codigo:"101" }).save(),
          new Asignatura({nombre: "Matemática 3° Medio",codigo:"102" }).save(),
          new Asignatura({nombre: "Geometría 3D",codigo:"103" }).save(),
          new Asignatura({nombre: "Mundo Global",codigo:"104" }).save(),
          new Asignatura({nombre: "Geografía, territorio y desafíos medioambientales",codigo:"105" }).save(),
          new Asignatura({nombre: "Educación Ciudadana 4° Medio",codigo:"106" }).save(),
          new Asignatura({nombre: "Ciencias para la Ciudadanía",codigo:"107" }).save(),
          new Asignatura({nombre: "Química",codigo:"108" }).save(),
          new Asignatura({nombre: "Ciencias para la Salud",codigo:"109" }).save(),
          new Asignatura({nombre: "Física",codigo:"110" }).save(),
          new Asignatura({nombre: "Inglés 3° Medio",codigo:"111" }).save(),
          new Asignatura({nombre: "Inglés 4° Medio",codigo:"112" }).save(),
          new Asignatura({nombre: "Filosofía 3º Medio",codigo:"113" }).save(),
          new Asignatura({nombre: "Filosofía 4° Medio",codigo:"114" }).save(),
          new Asignatura({nombre: "Filosofía Política",codigo:"115" }).save(),
          new Asignatura({nombre: "Artes Visuales",codigo:"116" }).save(),
          new Asignatura({nombre: "Educación Física 1",codigo:"117" }).save(),
          new Asignatura({nombre: "Ciencias del Ejercicio Físico y Deportivo",codigo:"118" }).save(),
          new Asignatura({nombre: "Lengua y literatura 4º Medio",codigo:"119" }).save(),
          new Asignatura({nombre: "Límites, derivadas e integrales",codigo:"120" }).save(),
          new Asignatura({nombre: "Probabilidades y Estadística Descriptiva e inferencial",codigo:"121" }).save(),
          new Asignatura({nombre: "Biología de los ecosistemas",codigo:"122" }).save(),
               
      ])
      console.log(asignaturaValues)
    }
    const countEstadoPersonalidad = await EstadoPersonalidad.estimatedDocumentCount() 
    if (countEstadoPersonalidad == 0) {
    const estadoPersonalidadValues = await Promise.all([
      new EstadoPersonalidad({descripcion: "Siempre",codigo:"10401" }).save(),  
      new EstadoPersonalidad({descripcion: "Generalmente",codigo:"10402" }).save(),  
      new EstadoPersonalidad({descripcion: "Ocacionalmente",codigo:"10403" }).save(),   
      new EstadoPersonalidad({descripcion: "No evaluado",codigo:"0" }).save(),     
           
    ])
    console.log(estadoPersonalidadValues)
    } 

    const countBasePersonalidad = await BasePersonalidad.estimatedDocumentCount() 
    if (countBasePersonalidad == 0) {
    const basePersonalidadValues = await Promise.all([
      new BasePersonalidad({descripcion: "Llega puntualmente a clases" }).save(),  
      new BasePersonalidad({descripcion: "Cumple con honradez en su vida escolar" }).save(),  
      new BasePersonalidad({descripcion: "Realiza acciones de solidaridad y generosidad" }).save(),  
      new BasePersonalidad({descripcion: "Realiza acciones de solidaridad y generosidad" }).save(),  
      new BasePersonalidad({descripcion: "Manifiesta actitud de respeto hacia las demas personas" }).save(),  
      new BasePersonalidad({descripcion: "Participa en actividades de su curso y establecimiento" }).save(),  
      new BasePersonalidad({descripcion: "Se preocupa de su aseo y presentacion personal" }).save(),  
      new BasePersonalidad({descripcion: "Respeta las normas de seguridad" }).save(),  
      new BasePersonalidad({descripcion: "Es capaz de trabajar en forma colaborativa" }).save(),  
      new BasePersonalidad({descripcion: "Acepta criticas, reconoce sus errores y trata de corregirlos" }).save(),  
      new BasePersonalidad({descripcion: "Es capaz de expresar sus ideas y sentimientos con claridad" }).save(),  
      new BasePersonalidad({descripcion: "Es capaz de solucionar situaciones problematicas" }).save(),  
      new BasePersonalidad({descripcion: "Mantiene actitudes, modales y loenguaje correcto" }).save(),  
      new BasePersonalidad({descripcion: "Actua de acuerdo con las normas del establecimiento" }).save(),
      new BasePersonalidad({descripcion: "Manifiesta actitudes de respeto por la identidad nacional" }).save(),  
      new BasePersonalidad({descripcion: "Utiliza el dialogo como forma de resolver problemas" }).save(),  
      new BasePersonalidad({descripcion: "Cuida y valora su entorno natural" }).save(),  
      new BasePersonalidad({descripcion: "Hace buen uso de las nuevas tecnologias" }).save(),    
           
    ])
    console.log(basePersonalidadValues)
    } 
    


    } catch (error) {
        console.log(error.message)
    }
}

export const createAdmin = async () => {
    
    const user = await User.findOne({ email: "admincdscc@localhost" });
    
    const roles = await Rol.findOne({ nombre: { $in: ["administrador"] } });
    const comuna = await Comuna.findOne({ nombre: { $in: ["CONCEPCION"] } });
  
    if (!user) {
      
      await User.create({
        nombre: "Admin",
        apellidoP:"CDSC",
        apellidoM:"Concepcion",
        email: "admincdscc@localhost",
        password: await bcrypt.hash(config.PALABRA, 10),
        rol: {idRol:roles._id,nombre:roles.nombre},
        rut: "19108724-0",
        habilitado:true,
        idComuna:comuna._id,
      });
      console.log('Admin User Created!')
    }
  };