ons.ready(()=>{
  const navigatorComponent = document.querySelector("#navigator");
  if(!isLogged()) navigatorComponent.resetToPage('login.html');
  else {
    navigatorComponent.resetToPage('home.html');
    getProducts();
  }
});

document.addEventListener('init', (event)=>{
  var id = event.target.id;
  if(id =="home" || id == "map"){
    document.getElementById("userEmail").innerText = "Bienvenido " + localStorage.getItem("email");
  }
});
function index(){
  const navigatorComponent = document.querySelector("#navigator");
  navigatorComponent.resetToPage('login.html');
}

function gotoRegister(){
  const navigatorComponent = document.querySelector("#navigator");
  navigatorComponent.resetToPage('register.html');
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
  const navigatorComponent = document.querySelector("#navigator");
  navigatorComponent.resetToPage('login.html');
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
      goToProducts();
      document.addEventListener('init',(event)=>{
        if(event.target.id =="home")
          document.getElementById("userEmail").innerText = "Bienvenido " + localStorage.getItem("email");
      });      
    });      
  }
}

function getProducts(search){
  getProductsService((products)=>{
    $("#productsList").html('');
    $("#productsList").append(`                                    
                              <tr>
                                <th></th>
                                <th>Nombre</th>
                                <th>Precio</th>
                                <th>Número de sucursales</th>
                                <th>Descripción</th>                                
                              </tr>`
                            );
      products.forEach((element)=>{
        console.log(element);
        if(search == null){
          $("#productsList").append(`
          <tr>
            <td><img src="${element.photo}" width="80" height="80"></td>
            <td>${element.name}</td>
            <td>${element.price}</td>
            <td>${element.branches.length}</td>
            <td>${element.description}</td>            
            <td><ons-button onClick='goToMap(${JSON.stringify(element.branches)})'>Ver sucursales</ons-button></td>
          </tr>
        `);
        }
        else{
          if(element.name.toLowerCase().includes(search.selector.toLowerCase()))
              $("#productsList").append(`
                                    <tr>
                                      <td><img src="${element.photo}" width="100" height="100"></td>
                                      <td>${element.name}</td>
                                      <td>${element.price}</td>
                                      <td>${element.branches.length}</td>
                                      <td>${element.description}</td>                                      
                                      <td><ons-button onClick='goToMap(${JSON.stringify(element.branches)})'>Ver sucursales</ons-button></td>
                                    </tr>
                                  `);
        }      
      });
  });
}

function goToProducts(){
  const navigatorComponent = document.querySelector("#navigator");
  navigatorComponent.resetToPage('home.html');
  getProducts();
}


function logout(){
  localStorage.clear();
  const navigatorComponent = document.querySelector("#navigator");
  navigatorComponent.resetToPage('login.html');
}

function drawMap(branches, maxDistance){
    window.navigator.geolocation.getCurrentPosition(function(pos){
    var crd = pos.coords;
    var map = L.map("mapid").setView([crd.latitude, crd.longitude], 15);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    if(branches != null){
        branches.forEach(function(suc){
          if(distance(crd.latitude, crd.longitude, suc.latitude, suc.longitude,"K") < maxDistance){
            L.marker([suc.latitude, suc.longitude]).addTo(map)
            .bindPopup(`${suc.name}`);
          }
        });
    }
  }, function(err){
      ons.navigator.toast("No se pudo obtener su ubicación. Se mostrarán todas las sucursales.",{"timeout":3000});
      var map = L.map("mapid").setView([-34.8511158, -56.1232877], 12);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);
      products.forEach(function(prod){
        prod.branches.forEach(function(suc){
          L.marker([suc.latitude, suc.longitude]).addTo(map)
          .bindPopup(`${suc.name}`);
        })
      });
  }, {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
  });
}

function goToMap(_branches){
  var branches = _branches;
  var maxDistance = parseInt($("#maxDistance").val());
  const navigatorComponent = document.querySelector("#navigator");
  navigatorComponent.resetToPage('map.html');
  drawMap(branches, maxDistance);
}


function distance(lat1, lon1, lat2, lon2, unit) {
	if ((lat1 == lat2) && (lon1 == lon2)) {
		return 0;
	}
	else {
		var radlat1 = Math.PI * lat1/180;
		var radlat2 = Math.PI * lat2/180;
		var theta = lon1-lon2;
		var radtheta = Math.PI * theta/180;
		var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
		if (dist > 1) {
			dist = 1;
		}
		dist = Math.acos(dist);
		dist = dist * 180/Math.PI;
		dist = dist * 60 * 1.1515;
		if (unit=="K") { dist = dist * 1.609344 }
		if (unit=="N") { dist = dist * 0.8684 }
		return dist;
	}
}

