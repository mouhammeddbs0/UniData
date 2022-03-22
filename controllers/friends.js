const mysql = require("../db/db.js")

exports.showFriends = function (id,callback){
    try {
          mysql.db.query('SELECT * FROM friends WHERE id_user = ?', id,(error, results) => {
            if (error){ 
              throw error;
            }
            if (!results) {
                return callback(JSON.parse('{"friends":[]}'));
            } else {
                const data = JSON.parse(JSON.stringify(results[0]));
                const friends = data.friends.split('-');
                return callback(JSON.parse(JSON.stringify({'friends':friends})));
            }

        })
    } catch (error) {
        return callback(JSON.parse('{"friends":[]}'));
    }
    return callback(JSON.parse('{"friends":[]}'));
}

