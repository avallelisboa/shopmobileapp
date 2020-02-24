var db = window.openDatabase("shop_db", 1.0, "shop_db", 1024*1024*5);

function saveSearch(userId, searchDate, description){
    db.transaction((tx)=>{
        var query ="CREATE TABLE IF NOT EXISTS SEARCHES(id PRIMARYKEY AUTOINCREMENT, userId, searchDate, description)";
        tx.executeSql(query,(tx, result)=>{
            var query2 =`INSERT INTO SEARCHES(userId, userDate, description) VALUES('${userId}','${searchDate}','${description}')`;
            tx.executeSql(query2,(tx, result)=>{

            },(err)=>{
                console.log(err);
            })
        },(err)=>{
            console.log(err);
        });
    },(err)=>{
        console.log(err);
    },()=>{
        console.log("The insert query was done correctly");
    });
}

function getSearches(userId){
    db.transaction((tx)=>{
        var query= `SELECT * FROM SEARCHES WHERE userId = ${userId}`;
        tx.executeSql(query,(tx, result)=>{
            return result;
        },(err)=>{
            console.log(err);
        });
    },(err)=>{
        console.log(err);
    },()=>{
        console.log("The select query was done correctly");
    });
}