ons.ready(()=>{
  const navigator = document.querySelector("#navigator");
  if(!isLogged()) navigator.resetToPage('login.html');
  else {
    navigator.resetToPage('home.html');
    
  }
});

document.addEventListener('init',(event)=>{
  var id = event.target.id;
  if(id =="home" || id == "map")
    document.getElementById("userEmail").innerText = "Bienvenido " + localStorage.getItem("email");
});

function index(){
  const navigator = document.querySelector("#navigator");
  navigator.resetToPage('login.html');
}

function gotoRegister(){
  const navigator = document.querySelector("#navigator");
  navigator.resetToPage('register.html');
}

function register(){
  var email = $("#registerEmail").val();
  var password = $("#registerPassword").val();
  var verifyPassword = $("#registerVerifyPassword").val();

  var message="";

  if(email == null || email == "" || email == " "){
    message += "Debe ingresar el email.\n";
  }
  if(password == null || password == "" || password == " "){
    message += "Debe ingresar la contraseña.\n";
  }
  if(!email.includes("@") || !email.includes(".")){
    message +="Debe ingresar un email válido";
  }
  if(password != verifyPassword){
    message +="Las contraseñas deben coincidir";
  }
  else{
    registerService(email, password, ()=>{
      $("#userRegisteredPopOver").show();
    });
  }
}

function continueRegisteredPopOver(){
  $("#userRegisteredPopOver").hide();
  const navigator = document.querySelector("#navigator");
  navigator.resetToPage('login.html');
}

function login(){
  var email = $("#email").val();
  var password = $("#password").val();

  var message="";

  if(email == null || email == "" || email == " "){
    message += "Debe ingresar el email.\n";
  }
  if(password == null || password == "" || password == " "){
    message += "Debe ingresar la contraseña.\n";
  }
  if(!email.includes("@") || !email.includes(".")){
    message +="Debe ingresar un email válido";
  }

  else{
    loginService(email, password, ()=>{
      const navigator = document.querySelector("#navigator");
      getProductsService((products)=>{
          products.forEach((element)=>{
            console.log(element);
          });
      });
      navigator.resetToPage('home.html');
      document.addEventListener('init',(event)=>{
        if(event.target.id =="home")
          document.getElementById("userEmail").innerText = "Bienvenido " + localStorage.getItem("email");
      });      
    });      
  }
}

function goToMap(){
  const navigator = document.querySelector("#navigator");
  navigator.resetToPage('map.html');
}

function goToProducts(){
  const navigator = document.querySelector("#navigator");
  navigator.resetToPage('home.html');
}


function logout(){
  localStorage.clear();
  const navigator = document.querySelector("#navigator");
  navigator.resetToPage('login.html');
}


document.addEventListener('init', function(event) {
  var page = event.target;

  if (page.id === 'map') {
    var map = L.map('mapid').setView([-34.7968596, -56.0694617], 15);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
  } 
});
