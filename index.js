const express = require('express');
const path = require('path');
const bodyParser =  require('body-parser');
const app = express()

const bcrypt = require('bcrypt');
const mongoose = require('mongoose')
const User = require('./user')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static(path.join(__dirname, 'public')));

const user = 'almendraIvan'
const password ='42727117ivan'
const dbName = 'loginNodeBase'
const uri =`mongodb+srv://${user}:${password}@cluster0.om4w0.mongodb.net/${dbName}?retryWrites=true&w=majority`

const port = process.env.PORT || 3001
//mongodb+srv://almendra:<42727117ivan>@cluster0.om4w0.mongodb.net/loginNodeBase?retryWrites=true&w=majority
//almendra 42727117ivan
const mongo_url = `mongodb://localhost:27017/login`   /*mongodb://localhost:27017/login*/

mongoose.connect(uri,{useNewUrlParser: true, useUnifiedTopology: true}, function(err){
    if(err){
        throw err;
    }else{
        console.log(`Conexion establecida ${uri}`)
    }
    app.listen(port, () => {
        console.log(`Estas conectado al puerto ${port}`)
    })
})

app.post('/register', (req,res)=>{
    const {username , password} = req.body;

    const user = new User({username,password})

    user.save(err=>{ /* guardar nuevo archivo, en caso de error hacemo esto */
        if(err){
            res.status(500).send(`ERROR AL REGISTRAR AL USUARIO ${err}`)
        }else{
            res.status(200).send('REGISTRO EXITOSO')
        }
    })
})

app.post('/authenticate', (req,res)=>{
    const {username , password} = req.body;
     User.findOne({username},(err, user)=>{/* sirve para comparar me pide un parametro para comparar y despues mi collback*/
        if(err){
            res.status(500).send(`ERROR AL AUTENTICAR AL USUARIO`)
        }else if(!user){
            res.status(500).send('EL USUARIO NO EXISTE')
        }else{
            user.passwordContrasena(password, (err,result)=>{
                if(err){
                    res.status(500).send(`ERROR AL AUTENTICAR ${err}`)
                }else if(result){ /* si el resultado es true muestra lo siguiente */
                    res.status(200).send('USUARIO AUTENTICADO CORRECTAMENTE')
                }else{
                    res.status(500).send('USUARIO Y/O CONTRASEÑA INCORRECTA')
                }
            })
        }
    })
})

app.listen(3000,()=>{
    console.log('server started')
})

module.exports = app;