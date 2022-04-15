const db = require("../db/db.js")

exports.showProfileData = function (id) {
    return new Promise(function (resolve, reject) {
        db.query('SELECT * FROM users WHERE id = ?', id, (error, results) => {
            if (error) {
                return reject(error);
            }
            if (!results) {
                return reject(JSON.parse('{"data":[]}'));
            } else {
                console.log(results);
                //const data = JSON.parse(JSON.stringify(results[0]));
                return resolve(JSON.parse(JSON.stringify({ 'data': friends })));
            }

        });
    });
}

