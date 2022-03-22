const Course = require('../models/Course');
const User = require('../models/User');
const Resource = require('../models/Resource');
const { ObjectId } = require('bson');

module.exports = (app) => {

    //see all courses
    app.get('/courses', (req, res) => {
        Course.find({}, (err, courses) => {
            if (err) throw err;
            res.render('pages/courses', { courses });
        });
        
    });

    app.get('/course/details/:id', (req, res) => {
        Course.findOne({_id: req.params.id }, (err, course) => {
            if (err) throw err;

            Resource.find({ courseId: req.params.id }, (err, resources) => {
                if (err) throw err

                res.render('pages/course/details', { course, units: resources });
            });
        });
    });

    app.post('/course/resource/add/:id', (req, res) => {
        isLoggedIn(req, res);

        resource = new Resource({
            link: req.body.link,
            description: req.body.description,
            courseId: req.params.id,
        });

        resource.save((err) => {
            if (err) throw err;

            res.redirect(`http://localhost:8000/course/details/${req.params.id}`);
        });
    });


    app.get('/course/resource/delete/:id/:courseId', (req, res) => {
        isLoggedIn(req, res);

        Resource.deleteOne({ _id: req.params.id }, (err) => {
            if (err) throw err;
            res.redirect(`http://localhost:8000/course/details/${req.params.courseId}`);
        });
    });

    // add an existing course
    app.post('/addCourse/:id', (req, res) => {
        isLoggedIn(req, res);

        User.updateOne({ _id: req.session.user_id }, { $push: { enrollments: req.params.id }}, (err, user) => {
            if (err) throw err;
            res.redirect(301, '/myCourses');
        });
    });

    app.get('/myCourses', (req, res) => {
        isLoggedIn(req, res);

        let username;
        let myCourses;

        User.findOne({_id: req.session.user_id}, async (err, user) => {
            if (err) throw err
           await Course.find({
                '_id': { $in: user.enrollments }}, (err, courses) => {
                    if (err) throw err
                    myCourses = courses;
                });
            
            username = user;

            res.render('pages/user/myCourses', { user: username, courses: myCourses });
        })
    })

    // create a new course
    app.get('/createCourse', async (req, res) => {
        await isLoggedIn(req, res);

        let user = {
            name: req.session.username,
            id: req.session.user_id,
        };

        res.render('pages/course/create', { user: user });
    });

    app.post('/createCourse', (req, res) => {
        const course = new Course({
            title: req.body.title,
            description: req.body.description,
            creatorId: req.session.user_id,
        });

        course.save((err, course) => {
            if (err) throw err;
            res.redirect('/courses', 302, {course: course})
        })
    });

    // delete courses
    app.delete('/deleteCourse', (req, res) => {
        Course.deleteOne({ id: req.id }, function (err) {
            if (err) throw err;
            res.send('course deleted');
          });
    });
}

const isLoggedIn = (req, res) => {
    if (req.session.loggedIn !== true) {
        res.redirect('/', 301, { message: 'you must login or create an account'});

        return false;
    }

    return true;
}