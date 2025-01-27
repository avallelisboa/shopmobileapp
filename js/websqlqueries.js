var db = window.openDatabase("shop_db", 1.0, "shop_db", 1024*1024*5);

function saveSearchDB(userId, description){
    db.transaction((tx)=>{
        var query ="CREATE TABLE IF NOT EXISTS SEARCHES(userId, searchDate, description)";
        tx.executeSql(query);
        var query2 =`INSERT INTO SEARCHES(userId, searchDate, description) VALUES('${userId}','${moment().format("d-M-YYYY")}','${description}')`;
        tx.executeSql(query2);
    },(err)=>{
        return err;
    },(tx, result)=>{
       console.log("The create query was done correctly");
    });
}

function getSearchesDB(userId, _do){
    var res;
    db.transaction((tx)=>{
        var query= `SELECT * FROM SEARCHES WHERE userId = "${userId}" ORDER BY searchDate DESC`;
        tx.executeSql(query,[],(tx, result)=>{
            res = result.rows;
        },(err)=>{
            console.log(err);
        });
    },(err)=>{
        console.log(err);
    },(tx, result)=>{
        _do(res);
    });
}