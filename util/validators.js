module.exports.validateRegisterInput = (
    username,
    email,
    password,
    confirmPassword
)=>{
    const errors = {};
    if(username.trim() === ""){
        errors.username = "Username must not be empty!";
    }
    if(email.trim() === ""){
        errors.email = "Email must not be empty!";
    }else{
        const regEx = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
        if(!email.match(regEx)){
            errors.email = "Enter a valid email address!";
        }
    }

    if(password === ""){
        errors.password = "password must not be empty!";
    }else if(password !== confirmPassword){
        errors.confirmPassword = "Passwords must be match";
    }

    return {
        errors,
        valid:Object.keys(errors).length < 1
    }
}

module.exports.validateLoginInput = (username,password)=>{
    const errors = {};

    if(username.trim() === ""){
        errors.username = "Username must not be empty!";
    }

    if(password.trim() === ""){
        errors.Password = "Password must not be empty!";
    }

    return {
        errors,
        valid:Object.keys(errors).length < 1
    }
}