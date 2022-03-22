const User = require('../models/User');
const bcrypt = require('bcrypt');

module.exports = (app) => {
    app.get('/signUp', (req, res) => {
        res.render('pages/signUp');
    });

    app.post('/signUp', (req, res) => {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
            if (err) throw err;

            const newUser = new User({ 
                username: req.body.username,
                password: hash,
                email: req.body.email,
            });

            newUser.save((err, user) => {
                if (err) throw err;
                
                req.session.username = user.username;
                req.session.user_id = user._id;
                req.session.loggedIn = true;

                res.redirect('/courses');
            });
        });
    });
}