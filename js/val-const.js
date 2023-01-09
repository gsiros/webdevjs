function checkPasswords(form){
    password1 = form.usrpswd1.value;
    password2 = form.usrpswd2.value;

    // If Not same return False.    
    if (password1 != password2) {
        alert ("Τα συνθηματικά δεν ταιριάζουν... δοκιμάστε ξανά.")
        return false;
    }

   return true;
}

function checkAge(form){
    const age = new Date(form.birthday.value);
    const datenow = new Date();

    var diff = datenow.getTime() - age.getTime();
    if (Math.floor(diff/(1000 * 60 * 60 * 24 * 365.25)) >= 18){
        return true;
    }
    alert("Η εγγραφή χρήστη επιτρέπεται μόνο σε άτομα άνω των 18 ετών.")
    return false;
}