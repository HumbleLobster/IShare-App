import axios from 'axios';

export default class Validate {
    constructor(){
        this._csrf = document.querySelector('input[name="_csrf"]').value;
        this.usernameField = document.querySelector("#username-register");
        this.passwordField = document.querySelector("#password-register");
        this.emailField = document.querySelector("#email-register");

        this.prevPassword;
        this.intervalPassword = 0;

        this.prevUsername;
        this.intervalUsername = 0;

        this.prevEmail;
        this.intervalEmail = 0;

        this.event();
    }
    
    event(){
        this.usernameField.addEventListener("keyup" , ()=>{
             this.validateUsername();
        });

        this.passwordField.addEventListener("keyup" , ()=>{
            this.validatePassword();
        })

        this.emailField.addEventListener("keyup" , ()=>{
            this.validateEmail();
        });
    }


    validatePassword(){
        clearTimeout(this.intervalPassword);

        if(this.prevPassword !=this.passwordField.value)this.passwordField.setCustomValidity("");

        this.intervalPassword = setTimeout(()=>{

            if(this.passwordField.value && this.prevPassword != this.passwordField.value){
                let input = this.passwordField.value;
                
                const capital = /[QWERTYUIOPASDFGHJKLZXCVBNM]/ ;
                const number = /[0123456789]/;
                const specialSymbols = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
                
                if(input.length<8){
                    this.passwordField.setCustomValidity("password must be 8 character long");
                } else if (!capital.test(input)){
                    this.passwordField.setCustomValidity("password must have atleast one Capital charater");
                } else if (!number.test(input)){
                    this.passwordField.setCustomValidity("password must contain atleast one numeric");
                } else if (!specialSymbols.test(input)){
                    this.passwordField.setCustomValidity("password must have atleast one special symbol");
                } else {
                    this.passwordField.setCustomValidity("");
                }

                this.passwordField.reportValidity();
                this.prevPassword = this.passwordField.value;
            }
        },750)
    }

    validateUsername(){
        clearTimeout(this.intervalUsername);
        if(this.prevUsername !=this.usernameField.value)this.usernameField.setCustomValidity("");
        this.intervalUsername = setTimeout(()=>{
            if(this.usernameField.value && this.prevUsername != this.usernameField.value){
                
                let input = this.usernameField.value;

                var format = /^[a-z0-9]+$/i;
                if(!format.test(input)){
                    this.usernameField.setCustomValidity("Username can contain only letters and numbers");
                    this.usernameField.reportValidity();
                    return;
                }

                axios.post('/username-exist' , {_csrf : this._csrf ,username : input}).then((exist)=>{
                    if(exist.data != "true"){
                        this.usernameField.setCustomValidity("");
                        this.usernameField.reportValidity();
                    } else {
                        this.usernameField.setCustomValidity("username already taken");
                        this.usernameField.reportValidity();
                    }
                }).catch((err)=>{
                    console.log(err);
                });

                this.prevUsername = this.usernameField.value;
            }
        },750)
    }


    validateEmail(){
        clearTimeout(this.intervalEmail);
        if(this.prevEmail !=this.emailField.value)this.emailField.setCustomValidity("");
        this.intervalEmail = setTimeout(()=>{
            if(this.emailField.value && this.prevEmail != this.emailField.value){
                
                let input = this.emailField.value;
                
                const format = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                if(!format.test(input)){
                    this.emailField.setCustomValidity("Enter a valid Email address");
                    this.emailField.reportValidity();
                    return;
                }

                axios.post('/email-exist' , {_csrf : this._csrf ,email : input}).then((exist)=>{
                    console.log(exist.data);
                    if(exist.data != "true"){
                        this.emailField.setCustomValidity("");
                        this.emailField.reportValidity();
                    } else {
                        this.emailField.setCustomValidity("Email address exist. Do you want to Sign-In?");
                        this.emailField.reportValidity();
                    }
                }).catch((err)=>{
                    console.log(err);
                });

                this.prevEmail = this.emailField.value;
            }
        },750)
    }
}

















	
