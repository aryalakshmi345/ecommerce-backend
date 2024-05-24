const bcrypt = require('bcrypt')

exports.hashPassword = async(password)=>{
    try{
        const hashedPassword = await bcrypt.hash(password, saltRounds)
    } catch (err){
        console.log(err);
    }
}

exports.comparePassword = async(password,hashedPassword)=>{
    return bcrypt.compare(password,hashedPassword)
}