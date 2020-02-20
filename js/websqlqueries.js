
      var db = window.openDatabase("Products", "1.0", "BD Products", 1024 * 1024 * 5);


      function addProducts(id, name, description, price, photo){
        db.transaction((tx)=>{
          tx.executeSql("CREATE TABLE IF NOT EXISTS Product(id,name, description, price, photo)");
          tx.executeSql(`INSERT INTO persona (id,name, description, price, photo) VALUES ('${id}',${name}, ${description}, ${price}, ${photo})`);
        }, (error)=>{

        }, (results)=>{

        });
      }

      function queryGetProducts(tx){
        tx.executeSql("SELECT * FROM persona",[],successObtenerPersona,error);
      }


      