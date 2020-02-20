function loginService(_email, _password, _do){
    $.ajax({
        type:"POST",
        url:"http://tiendanatural2020.herokuapp.com/api/user/login",
        data: {
            "email": _email,
            "password": _password,
        },
        datatype:"json",
        success:(response)=>{
            var userLogged = JSON.parse(response);

            localStorage.setItem("id", userLogged._id);
            localStorage.setItem("email", userLogged.email);
            localStorage.setItem("password", userLogged.password);
            _do();
        },
        error:(xml, status, error)=>{
            console.log(error);
        }
    });
}

function isLogged(){
    if(localStorage.getItem("id") != null) return true;
    else return false;
}

function registerService(_email, _password, _do){
    $.ajax({
        type:"POST",
        url:"http://tiendanatural2020.herokuapp.com/api/user/register",
        data: {
            "email": _email,
            "password": _password,
        },
        datatype:"json",
        success:(response)=>{
            console.log(response);
            var userRegistered = JSON.parse(response);
            console.log(userRegistered);
            _do();
        },
        error:(xml, status, error)=>{
            console.log(error);
        }
    });
}

function getProductsService(_do){
    $.ajax({
        type:"GET",
        url:"http://tiendanatural2020.herokuapp.com/api/product/all",
        datatype:"json",
        success:(response)=>{
            var products = JSON.parse(response);
            _do(products);
        },
        error:(xml, status, error)=>{
            console.log(error);
        }
    });
}