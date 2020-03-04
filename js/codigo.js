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
  if(id =="home" || id == "map" || id == "searches"){
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
  localStorage.removeItem("searchResult");

  getProductsService((products)=>{
    $("#productsList").html('');
        if(search == null){
          localStorage.setItem("searchResult", JSON.stringify(products));
          products.forEach((element)=>{        
          $("#productsList").append(`
            <ons-list-item>
              <figure class="left">
                <img src="${element.photo}" width="60" height="60"></td>
              </figure>
              <div>
                <p>${element.name}</p>
                <p>${element.description}</p>
                <p>Precio: ${element.price}</p>
                <p>Cantidad de sucursales: ${element.branches.length}</p>     
              </div>
              <ons-button onClick='goToMap(${JSON.stringify(element.branches)})'>Ver sucursales</ons-button>
            </ons-list-item>
          `);
        });
        }
        else{
          var filteredProducts = new Array();
          products.forEach((element)=>{
            if(element.name.toLowerCase().includes(search.selector.toLowerCase()))
             {       
                filteredProducts.push(element);
               
                $("#productsList").append(`
                    <ons-list-item class="list-item">
                      <figure class="left">
                        <img src="${element.photo}" width="60" height="60">
                      </figure>
                      <div>
                          <p>${element.name}</p>                          
                          <p>${element.description}</p>
                          <p>Precio: ${element.price}</p>
                          <p>Cantidad de sucursales: ${element.branches.length}</p>          
                      </div>
                      <ons-button onClick='goToMap(${JSON.stringify(element.branches)})'>Ver sucursales</ons-button>
                    </ons-list-item>
                  `);
             }
          });
          localStorage.setItem("searchResult", JSON.stringify(filteredProducts));
        }      
      
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

function saveSearch(description){
  saveSearchDB(localStorage.getItem("id"), description);
  $("#searchDescription").val('');
}

function goToSearch(){
  const navigatorComponent = document.querySelector("#navigator");
  navigatorComponent.resetToPage('searches.html');
}

document.addEventListener('init', (event)=>{
  var id = event.target.id;
  if(id =="searches"){
      $("#searchesList").html('');
      getSearchesDB(localStorage.getItem("id"),(res)=>{
        var l = res.length;
        for(var i = 0; i < l; i++){
          $("#searchesList").append(`

                  <ons-list-item class="list-item">
                    <div>
                        <p>${res[i].description}</p>                          
                        <p>${res[i].searchDate}</p>          
                    </div>
                  </ons-list-item>
          
          `);
        }
      });
  }
});


function goToProductScan(){
  const navigatorComponent = document.querySelector("#navigator");
  navigatorComponent.resetToPage('scancode.html');
  document.addEventListener('init',(event)=>{
    var page = event.target.id;
    if(page == "scancode") scanCode();
  });
}

function scanCode(){
  cordova.plugins.barcodeScanner.scan(
    function (result) {

        $("#productScannedList").html('');

        $("#productScannedList").append(`
            <ons-list-item class="list-item">
              <div>
                  ${result.text}        
              </div>
            </ons-list-item>
        `);

     /*   alert("We got a barcode\n" +
              "Result: " + result.text + "\n" +
              "Format: " + result.format + "\n" +
              "Cancelled: " + result.cancelled);*/
    },
    function (error) {
        alert("Scanning failed: " + error);
    }
 );
}