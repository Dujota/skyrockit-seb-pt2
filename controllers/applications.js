// controllers/applications.js

const express = require('express');

const router = express.Router();

const User = require('../models/user.js');

router.get('/', async (req, res) => {
  try {
    // find the user
    const currentUser = await User.findById(req.session.user._id);

    res.render('applications/index.ejs', {
      applications: currentUser.applications,
    });
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

router.get('/new', async (req, res) => {
  res.render('applications/new.ejs');
});

router.post('/', async (req, res) => {
  try {
    // find the user
    const currentUser = await User.findById(req.session.user._id);
    // add the app to the applications array on the user object
    currentUser.applications.push(req.body);
    // save the changes to the user record.
    await currentUser.save();
    // redirect usr to index page
    res.redirect(`/users/${currentUser._id}/applications`);
  } catch (err) {
    console.log(err);
    res.redirect('/');
  }
});

router.get('/:applicationId', async (req, res) => {
  try {
    // Look up the user from req.session
    const currentUser = await User.findById(req.session.user._id);
    // Find the application by the applicationId supplied from req.params
    const application = currentUser.applications.id(req.params.applicationId);
    // Render the show view, passing the application data in the context object
    res.render('applications/show.ejs', {
      application,
    });
  } catch (error) {
    // If any errors, log them and redirect back home
    console.log(error);
    res.redirect('/');
  }
});

router.delete('/:applicationId', async (req, res) => {
  try {
    // Look up the user from req.session
    const currentUser = await User.findById(req.session.user._id);
    // Use the Mongoose .deleteOne() method to delete
    // an application using the id supplied from req.params
    currentUser.applications.id(req.params.applicationId).deleteOne();
    // Save changes to the user
    await currentUser.save();
    // Redirect back to the applications index view
    res.redirect(`/users/${currentUser._id}/applications`);
  } catch (error) {
    // If any errors, log them and redirect back home
    console.log(error);
    res.redirect('/');
  }
});

// EDIT
router.get('/:applicationId/edit', async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);
    const application = currentUser.applications.id(req.params.applicationId);
    res.render('applications/edit.ejs', {
      application,
    });
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

router.put('/:applicationId', async (req, res) => {
  try {
    // Find the user from req.session
    const currentUser = await User.findById(req.session.user._id);
    // Find the current application from the id supplied by req.params
    const application = currentUser.applications.id(req.params.applicationId);
    // Use the Mongoose .set() method
    // this method updates the current application to reflect the new form
    // data on `req.body`
    application.set(req.body);
    // Save the current user
    await currentUser.save();
    // Redirect back to the show view of the current application
    res.redirect(`/users/${currentUser._id}/applications/${req.params.applicationId}`);
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

module.exports = router;
