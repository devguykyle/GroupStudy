const Course = require('../models/Course');
const User = require('../models/User');
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
        Course.find({ id: req.params.id }, (err, course) => {
            if (err) throw err;
            res.render('pages/course/detail', { course });
        });
    });

    app.get('/course/edit/:id', (req, res) => {
        isLoggedIn(req, res);

        Course.updateOne({ id: req.courseId }, {resourceId: {
            link: req.link,
            resourceType: req.type,
            description: req.description,
        }}, (err, course) => {
            if (err) throw err;
            res.render('pages/course/edit', { course });
        });
    });

    app.get('/course/resource/delete/:id', (req, res) => {
        isLoggedIn(req, res);

        const resourceId = ObjectId();

        Course.updateOne({ id: req.courseId }, { $set: { resourceId: {
            link: req.link,
            resourceType: req.type,
            description: req.description,
        }}}, (err, course) => {
            if (err) throw err;
            res.render('pages/course/edit', { course });
        });
    });

    // add an existing course
    app.post('/addCourse', (req, res) => {
        isLoggedIn(req, res);

        User.updateOne({ id: req.session.id }, { $push: { enrollments: req.courseId }}, (err, user) => {
            if (err) throw err;
            res.redirect('/myCourses', { user: user.username, courses: user.enrollments });
        });
    });

    // create a new course
    app.get('/createCourse', async (req, res) => {
        await isLoggedIn(req, res);

        let user = {
            name: req.session.username,
            id: req.session.id,
        };

        res.render('pages/course/create', { user: user });
    });

    app.post('/createCourse', (req, res) => {
        console.log(req.body)
        const course = new Course({
            title: req.body.title,
            description: req.body.description,
            creatorId: req.session.id,
        });

        course.save((err, course) => {
            if (err) throw err;
            res.redirect('/course', 302, {course: course})
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