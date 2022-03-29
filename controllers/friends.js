const mysql = require("../db/db.js")

exports.showFriends = function (id, callback) {
    return new Promise(function (resolve, reject) {
        try {
            mysql.db.query('SELECT * FROM friends WHERE id_user = ?', id, (error, results) => {
                if (error) {
                    reject( error);
                }
                if (!results) {
                    return reject(JSON.parse('{"friends":[]}'));
                } else {
                    const data = JSON.parse(JSON.stringify(results[0]));
                    const friends = data.friends.split('-');
                    return resolve(JSON.parse(JSON.stringify({ 'friends': friends })));
                }

            })
        } catch (error) {
            return reject(JSON.parse('{"friends":[]}'));
        }
    });
}

