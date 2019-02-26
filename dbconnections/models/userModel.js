const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

//const mongooseLogs = require('mongoose-activitylogs');


const saltRounds = 10;  // or another integer in that ballpark



const server = process.env.PPMV_SERVER
const database = process.env.PPMV_NAME
const user = process.env.PPMV_USERNAME
const password = process.env.PPMV_PASSWORD

mongoose.connect(`mongodb://${user}:${password}@${server}/${database}`, { useNewUrlParser: true },function(err) {
    if (err) {throw err
    } else{
        console.log('You connected to a database')
    }
});

let userSchema =new mongoose.Schema({  

    firstName: {type: String, required: true, trim: true,},
    lastName: {type: String, required: true, trim: true,},
    password: {type: String, required: true, trim: true,},
    userPhoneNumber: { 
        type: String,
        required: true,
        trim: true,
        validate: {
            isAsync: true,
            validator: function(value, isValid) {
                const self = this;
                return self.constructor.findOne({ userPhoneNumber: value })
                .exec(function(err, user){
                    if(err){
                        throw err;
                    }
                    else if(user) {
                        if(self.id === user.id) {  // if finding and saving then it's valid even for existing name
                            return isValid(true);
                        }
                        return isValid(false);  
                    }
                    else{
                        return isValid(true);
                    }
      
                })
            },
            message:  'User already exist',
        },
    },
    createdAt: { type: Date, required: true, default: Date.now }
});

// hash user password before saving into database
userSchema.pre('save', function(next){
this.password = bcrypt.hashSync(this.password, saltRounds);
next();
});


module.exports = mongoose.model('User', userSchema);



