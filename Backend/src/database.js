import mongoose from 'mongoose'
mongoose.connect("mongodb://localhost/cdsccdb") //ip local o en red del servidor de mongoose, en este caso no habian credenciales
    .then(db => console.log('Db is connected'))
    .catch(error => console.log(error))