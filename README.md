# Helping Hands - Work that Works for You

Helping Hands is a full-stack web application that allows contract workers to seamlessly integrate work into their unique schedules and lifestyle. 

The platform allows workers to conveniently access job opportunities and reserve work that fits their availability, making it easier to maintain a work-life balance. Helping Hands simplifies the job searching process by presenting contract workers with tailored job opportunities that align with their occupation, skillset, and availability. 

This application is designed with Simply Serving LLC in mind and caters to their requested features that may be unique to them. Helping Hands is constructed with the intention that this application can be scalable and mold to each company's unique needs.

**Live Website:** [Helping-Hands.io](https://www.helping-hands.io/)

![Feature Section for Helping-Hands.io](/imgs/profileExample.png)

## How It's Made

**Tech Used:** JavaScript, Node.js, Express, MongoDB, EJS, TailwindCSS, Passport.js, Twilio, Cloudinary.

Helping Hands' codebase is structured using the Model-View-Controller architecture paradigm. 

**Registeration** 

![Registration Form for Helping-Hands.io](/imgs/signupForm.png)

Users are able to securely register and login using Passport.js' local strategy. When creating an account, users are able to opt-in to the SMS job availability feature by providing their phone number; this feature, utilizing Twilio, allows administrators to notify opted-in users of newly posted job opportunities open for reservation. Furthermore, upon creation of a user's account, they are requested to select the applicable occupation that correctly depicts their role (e.g. Waitstaff, Bartender, Chef).

**Reservation**

All upcoming events are presented in a list-view with key-information in the date, hours, location, and quantity of requested staff being displayed. Open events are noted with a green icon, while events that meet the requested staff quantity are noted with a red icon. Events noted with a star icon are events that have been reserved by the logged-in user.

Detailed event descriptions are accessible from the feed page. Additional details (e.g. uniform, caterer, map image) are displayed on the event's page. Users can identify if the respective event aligns with their schedule and attempt to reserve their desire occupation for the event. Upon a reservation request, the application will take several factors into consideration:

* Desired occupation role availability (e.g. Waitstaff Requested: 0)
* Existing reservation by the user for the same event
* Date/time conflict among other reserved events
* User's only being permitted to reserve the occupation role that applies to them

If all the relevant conditions are satisfied, the user's reservation request will be approved, and the event will populate appropriately in their profile for future reference. Data is stored in both the User (eventsReserved property) and Event (staffReserved property) models in the MongoDB database.

**Administrators**

The Administrator dashboard is accessible only to assigned administrators who have been granted access via the created authRole middleware. Once granted access, administrators are able to perform various functions, including creating new job postings, notifying SMS alert opted-in users of new events, awarding the 'Simply the Best' award to contract workers, and accessing the names, email addresses, and phone numbers (if opted in) of all contract workers for easy communication.

On specific event listings, administrators are displayed a table of succussfully reserved contract workers that include the worker's name, email, and reserved occupation. Additionally, administrators are able to delete job postings if deemed necessary. 

## Optimizations
As time permits, there are additional optimizations, improvements, and additional features that will be added to Helping Hands. 

Additional features and optimizations include:

* Application will be migrated to a React-based framework to enable dynamic reloading.
* Users will be able to unreserve an event 7 days prior to the event's date.
* When an event has met the requested staff quantity, users who remain interested will be able to be put on a waitlist that will automatically reserve the event on a first-come-first-serve basis should a spot be unreserved.
* Upcoming events will be able to be sorted by selected occupation role and availability.
* Utilizing Google Calendar API for users to seamlessly add event's date and time to their calendars.
* Users will be given a staff tier property assigned by the administrator. Certain events will require a user to be a specific tier to be able to view and reserve the event.
* Adminstrators will be given a tier (e.g. Head Adminstrator). Certain permissions will be granted to higher tier adminstrators, such as promoting other users to adminstrator.
* Users will be able to report their arrival and departure hours to an adminstrator following the conclusion of an event.
* Reminders via SMS and/or email 24 hours prior to an event.
* Employers will have the ability to create 'Employer Accounts' that will enable their companies to post event information and request staff.

## Lessons Learned
* Developed the ability to create reusable and abstracted code to improve the overall usability and readability of the codebase.
* Placed significant emphasis on application's responsiveness among all screen sizes.
* Familiarized with Tailwind CSS to create a unique, straightforward aesthetic that fit the desired request from Simply Serving.
* Practiced user authentication and validation through Passport.js.
* Learned how to send opted-in users SMS updates via Twilio.
* Learned how to to integrate map images seamlessly using Cloudinary.
* Consistently sought feedback from other developers in both front-end and back-end development, while actively searching for best practices.