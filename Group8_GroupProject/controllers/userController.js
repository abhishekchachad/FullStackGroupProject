const User = require('../models/user');
const Appointment = require('../models/appointment');
const moment = require('moment');

const dashboard = (req, res) => {
  if (res.locals.isAuthenticated && res.locals.user.userType === 'Driver') {
    res.render('pages/dashboard', { title: 'Dashboard' });
  }
  else if (res.locals.user.userType === 'Admin') {
    res.render('pages/dashboard', { title: 'Dashboard' });
  }
  else if (res.locals.user.userType === 'Examiner') {
    res.render('pages/dashboard', { title: 'Dashboard' });
  }
  else {
    res.redirect('/login');
  }
};

const g2Page = (req, res) => {
  if (res.locals.isAuthenticated && res.locals.user.userType === 'Driver') {
    const userId = res.locals.user._id;
    const selectedDate = req.query.date || moment().format('YYYY-MM-DD');

    User.findById(userId)
      .then(user => {
        Appointment.find({ date: selectedDate, isTimeSlotAvailable: true })
          .then(appointments => {
            const message = req.session.message;
            delete req.session.message;

            const userAppointment = user.appointment ?
              appointments.find(appointment => appointment._id.toString() === user.appointment.toString())
              : null;

            const hasPersonalInfo = user.firstName && user.lastName && user.licenseNumber && user.age;

            console.log('User object for G2 page:', user);
            res.render('pages/g2',
              {
                title: 'G2 Page',
                user,
                appointments,
                selectedDate,
                message,
                userAppointment,
                hasPersonalInfo
              });
          })
          .catch(err => {
            console.log('Error fetching appointments:', err);
            res.status(500).send('Error fetching appointments');
          });
      })
      .catch(err => {
        console.log('Error fetching user data:', err);
        res.status(500).send('Error fetching user data');
      });
  }
  else {
    res.redirect('/login');
  }
};

const gPage = (req, res) => {
  if (res.locals.isAuthenticated && res.locals.user.userType === 'Driver') {
    const userId = res.locals.user._id;

    User.findById(userId).populate('appointment')
      .then(user => {
        console.log('Fetched user data:', user);

        const message = req.session.message;
        delete req.session.message;

        const hasPersonalInfo = user.firstName && user.lastName && user.licenseNumber && user.age;

        res.render('pages/g',
          {
            title: 'G Page',
            user,
            message,
            hasPersonalInfo
          });
      })
      .catch(err => {
        console.log('Error fetching user data:', err);
        res.status(500).send('Error fetching user data');
      });
  }
  else {
    res.redirect('/login');
  }
};

const saveUserData = (req, res) => {
  if (res.locals.isAuthenticated && res.locals.user.userType === 'Driver') {
    console.log('Request body:', req.body);
    const userId = res.locals.user._id;
    const { firstName, lastName, licenseNumber, age, carMake, carModel, carYear, plateNumber, appointmentId } = req.body;

    const updateData =
    {
      firstName,
      lastName,
      licenseNumber,
      age,
      'carDetails.make': carMake,
      'carDetails.model': carModel,
      'carDetails.year': carYear,
      'carDetails.plateNumber': plateNumber
    };

    if (appointmentId) {
      updateData.appointment = appointmentId;
    }

    User.findByIdAndUpdate(userId, updateData, { new: true })
      .then(updatedUser => {
        if (!updatedUser) return res.status(404).send('User not found');
        console.log('Updated user data:', updatedUser);
        req.session.message = 'User data updated successfully';
        res.redirect('/g');
      })
      .catch(err => {
        console.log('Error updating user data:', err);
        res.status(500).send('Error updating user data');
      });
  }
  else {
    res.redirect('/login');
  }
};

const appointmentPage = (req, res) => {

  if (res.locals.isAuthenticated && res.locals.user.userType === 'Admin') {
    const message = req.session.message;

    res.render('pages/appointment', { title: 'Appointment', message });
  }
  else {
    res.redirect('/login');
  }
};

const bookAppointment = (req, res) => {
  if (res.locals.isAuthenticated && res.locals.user.userType === 'Driver') {
    const userId = res.locals.user._id;
    const { appointmentId } = req.body;

    User.findById(userId)
      .then(user => {
        if (!user.firstName || !user.lastName || !user.licenseNumber || !user.age) {
          return res.status(403).send('Please complete your personal information before booking an appointment.');
        }

        Appointment.findByIdAndUpdate(appointmentId, { isTimeSlotAvailable: false }, { new: true })
          .then(updatedAppointment => {
            if (!updatedAppointment) return res.status(404).send('Appointment not found');
            console.log('Updated appointment data:', updatedAppointment);


            User.findByIdAndUpdate(userId, { appointment: appointmentId }, { new: true })
              .then(updatedUser => {
                if (!updatedUser) return res.status(404).send('User not found');
                console.log('Updated user data:', updatedUser);
                req.session.message = 'Appointment booked successfully';
                res.redirect('/g');
              })
              .catch(err => {
                console.log('Error updating user data:', err);
                res.status(500).send('Error updating user data');
              });
          })
          .catch(err => {
            console.log('Error updating appointment:', err);
            res.status(500).send('Error updating appointment');
          });
      })
      .catch(err => {
        console.log('Error fetching user data:', err);
        res.status(500).send('Error fetching user data');
      });
  }
  else {
    res.redirect('/login');
  }
};

const addAppointment = (req, res) => {
  if (res.locals.isAuthenticated && res.locals.user.userType === 'Admin') {
    const { date, times } = req.body;

    console.log('Received appointment data:', { date, times });

    if (!date || !times) {
      console.log('Missing date or times in request body');
      return res.status(400).send('Missing date or times in request body');
    }

    const appointments = Array.isArray(times) ? times.map(time => (
      {
        date,
        time,
        isTimeSlotAvailable: true
      })) : [{ date, time: times, isTimeSlotAvailable: true }];

    console.log('Appointments to be added:', appointments);

    const timeSlots = Array.isArray(times) ? times : [times];


    Appointment.find({ date, time: { $in: timeSlots } })
      .then(existingAppointments => {
        if (existingAppointments.length > 0) {
          req.session.message = 'This time slot is booked';
          return res.redirect('/appointment');
        }
        else {
          Appointment.insertMany(appointments)
            .then(insertedAppointments => {
              console.log('Appointments added successfully:', insertedAppointments);
              req.session.message = 'Appointments added successfully';
              res.redirect('/appointment');
            })
            .catch(err => {
              console.log('Error adding appointments:', err);
              res.status(500).send('Error adding appointments');
            });
        }
      })
      .catch(err => {
        console.log('Error checking existing appointments:', err);
        res.status(500).send('Error checking existing appointments');
      });
  }
  else {
    res.redirect('/login');
  }
};

const getBookedTimesForDate = (req, res) => {
  const date = req.params.date;

  Appointment.find({ date, isTimeSlotAvailable: false })
    .then(appointments => {
      const bookedTimes = appointments.map(app => app.time);
      console.log('Booked times for date', date, ':', bookedTimes);

      res.json(bookedTimes);
    })
    .catch(err => {
      console.log('Error fetching appointments:', err);
      res.status(500).send('Error fetching appointments');
    });
};

const examinerPage = (req, res) => {

  if (res.locals.isAuthenticated && res.locals.user.userType === 'Examiner') {
    const message = req.session.message;

    res.render('pages/examiner', { title: 'Examiner', message });
  }
  else {
    res.redirect('/login');
  }
};

module.exports =
{
  dashboard,
  g2Page,
  gPage,
  saveUserData,
  appointmentPage,
  addAppointment,
  bookAppointment,
  getBookedTimesForDate,
  examinerPage
};