const User = require('../models/User');
const bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports  = (app) => {
    app.post('/login', async (req, res) => {
        user = await User.findOne({ username: req.body.username });
        
        console.log(user);
        bcrypt.compare(req.body.password, user.password, (err, result) => {
            if (err) throw err;

            if (result == true) {
                req.session.username = user.username;
                req.session.id = user._id;
                req.session.loggedIn = true;
            }

            res.redirect('/courses');
        });
    });

    app.get('/logout', (req, res) => {
        req.session.destroy();
        res.redirect('/');
    });
}