const db = require("../db/db.js")
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { promisify } = require('util');




exports.login = async (req, res) => {
    try {
        const {email, password} = req.body;

        if (!email || !password) {
            return res.status(400).render('login', {
                message: 'Please provide an email and password'
            })
        } else {
            db.query('SELECT * FROM users WHERE email = ?', [email], async (error, results) => {

                if (results.length < 1) {
                    res.status(401).render('login', {
                        message: 'Email is incorrect'
                    })
                } else {
                    if (!(await bcrypt.compare(password, results[0].password))) {
                        res.status(401).render('login', {
                            message: 'Password is incorrect'
                        })
                    } else {
                        const id = results[0].id;
                        const token = jwt.sign({ id }, process.env.JWT_SECRET, {
                            expiresIn: process.env.JWT_EXPIRES_IN
                        });

                        console.log("The token is: " + token);

                        const cookieOptions = {
                            expires: new Date(
                                Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
                            ),
                            httpOnly: true
                        }

                        res.cookie('jwt', token, cookieOptions);
                        res.status(200).redirect("/");
                    }
                }
            })
        }
    } catch (error) {
        console.log(error);
    }
}

exports.register = async (req, res) => {
    console.log(req.body);

    const {name, email, password, passwordConfirm} = req.body;
    if (!email || !password || !name || !passwordConfirm) {
        return res.status(400).render('register', {
            message: 'Please fill all fields!'
        })
    }
    db.query('SELECT email FROM users WHERE email = ?', [email], async (error, results) => {
        if (error) {
            return res.render('register', {
                message: 'Server error'
            });
        }

        if (results.length > 0) {
            return res.render('register', {
                message: 'That email is already in use'
            })
        } else if (password !== passwordConfirm) {
            return res.render('register', {
                message: 'Both passwords must matc'
            });
        }

        let hashedPassword = await bcrypt.hash(password, 10);

        db.query('INSERT INTO users SET ?', {name: name, email: email, password: hashedPassword}, (error, results) => {
            if (error) {
                return res.render('register', {
                    message: 'Server error'
                });
            } else {
                console.log(results);
                db.query('SELECT id FROM users WHERE email = ?', [email], async (error, results) => {
                    console.log(results);
                    if (results) {
                        const id = results[0].id;

                        const token = jwt.sign({id}, process.env.JWT_SECRET, {
                            expiresIn: process.env.JWT_EXPIRES_IN
                        });

                        console.log("The token is: " + token);

                        const cookieOptions = {
                            expires: new Date(
                                Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
                            ),
                            httpOnly: true
                        }

                        res.cookie('jwt', token, cookieOptions);
                        res.status(200).redirect("/");
                    }
                })
            }
        })
    });
}

exports.isLoggedIn = async (req, res, next) => {
    // console.log(req.cookies);
    if (req.cookies.jwt) {
        try {
            //1) verify the token
            const decoded = await promisify(jwt.verify)(req.cookies.jwt,
                process.env.JWT_SECRET
            );

            console.log(decoded);

            //2) Check if the user still exists
            db.query('SELECT * FROM users WHERE id = ?', [decoded.id], (error, result) => {

                if (!result) {
                    return next();
                }

                req.user = JSON.parse(JSON.stringify(result[0]));
                return next();

            });
        } catch (error) {
            console.log(error);
            return next();
        }
    } else {
        next();
    }
}

exports.logout = (req, res) => {
    res.cookie('jwt', 'logout', {
        expires: new Date(Date.now() +1),
        httpOnly: true
    });

    res.status(200).redirect('/');
}