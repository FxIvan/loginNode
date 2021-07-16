const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const salRounds = 10



const UserSchema = new mongoose.Schema({
    username: {type:String, required: true, unique: true},
    password: {type:String, required:true}
})

/*Antes que se guarde los datos en la base de datos*/

UserSchema.pre('save', function(next){
    if(this.isNew){ /* || this.isModified('password')  <- saque este por que me daba error, este significa si si es modificado la password */
        const user = this;

        bcrypt.hash(user.password, salRounds, function(err, hashedPassword){ /* ERROR IMPORTANTE ME aparece : -> data and hash arguments required  es porque en mongoose solo se acepta function() y no arrow function */
            if(err){
                next(err)
            }else{
                user.password = hashedPassword;
                next()
            }
        })
    }else{
        next()
    }
})

/* COMPARAR EL USUARIO*/

UserSchema.methods.passwordContrasena = function(password, callback){
    bcrypt.compare(password, this.password, function(err,same){
        if(err){
            callback(err)
        }else{
            callback(err,same)
        }
    })
}


module.exports = mongoose.model('User', UserSchema);