const db = require("../db/db.js")

exports.showFriends = function (id) {
    return new Promise(function (resolve, reject) {
        db.query('SELECT * FROM friends WHERE id_user = ?', id, (error, results) => {
            if (error) {
                return reject(error);
            }
            if (!results) {
                return reject(JSON.parse('{"friends":[]}'));
            } else {
                const data = JSON.parse(JSON.stringify(results[0]));
                const friends = data.friends.split('-');
                return resolve(JSON.parse(JSON.stringify({ 'friends': friends })));
            }

        });
    });
}

