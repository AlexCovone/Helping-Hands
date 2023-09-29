# Helping Hands - Work that Works for You

![Feature Section for Helping Hands](https://user-images.githubusercontent.com/98838825/232606962-a94066b6-c7e1-4ec9-8847-c1a15aad8eb7.png)

Helping Hands is a full stack web application that allows contract workers to seamlessly integrate work into their unique schedules and lifestyle. 

The platform allows workers to conveniently access job opportunities and reserve work that fits their availability, making it easier to maintain a work-life balance. Helping Hands simplifies the job searching process by presenting contract workers with tailored job opportunities that align with their occupation, skillset, and availability. 

This application is designed and developed for the founder of Simply Serving and Simply Serving LLC and caters to the requested features that may be unique to them. Helping Hands is constructed with the intention that this application can be scalable and molded to each company's unique needs.

**Live Website:** [Helping-Hands.io](https://www.helping-hands.io/)

https://github.com/AlexCovone/Helping-Hands/assets/98838825/7e5592fe-6c3e-497f-8ce7-98de1cbc06e8

## How It's Made

**Tech Used:** JavaScript, Node.js, Express, MongoDB, EJS, TailwindCSS, Passport.js, Twilio, Cloudinary.

Helping Hands' codebase is structured using the Model-View-Controller architecture paradigm. 

### **Registration** 

Users are able to securely register and log in using Passport.js' local strategy. When creating an account, users can opt-in to the SMS job availability feature by providing their phone number; this feature, utilizing Twilio, allows administrators to notify opted-in users of newly posted job opportunities open for reservation. Furthermore, upon creation of a user's account, they are requested to select the applicable occupation that correctly depicts their role (e.g. Waitstaff, Bartender, Chef).

![text-dark-min](https://github.com/AlexCovone/Helping-Hands/assets/98838825/d302ee77-6a45-45a5-935d-669745b7da69)

### **Reservation**

![event](https://github.com/AlexCovone/Helping-Hands/assets/98838825/3fd745b9-b91c-4fd0-8fc8-42ef249725f9)

All upcoming events are presented in a list view with notable information on the date, hours, location, and quantity of requested staff being displayed. Open events are noted with a green icon, while events that meet the requested staff quantity are noted with a red icon. Events noted with a star icon are events that have been reserved by the logged-in user.

Detailed event descriptions are accessible from the feed page. Additional details (e.g. uniform, caterer, map image) are displayed on the event's page. Users can identify if the respective event aligns with their schedule and attempt to reserve their desired occupation for the event. Upon a reservation request, the application will consider several factors:

* Desired occupation role availability (e.g. Waitstaff Requested: 0).
* Existing reservation by the user for the same event.
* Date/time conflict among other reserved events.
* User's only permitted to reserve the occupation role that applies to them.

If all the relevant conditions are satisfied, the user's reservation request will be approved, and the event will populate appropriately in their profile for future reference. Data is stored in both the User (eventsReserved property) and Event (staffReserved property) models in the MongoDB database.

### **Administrators**

![Admin Dashboard](https://github.com/AlexCovone/Helping-Hands/assets/98838825/e863f36a-15cb-46c0-83ce-0b15a099af38)

The Administrator dashboard is accessible only to assigned administrators who have been granted access via the created authRole middleware. Once granted access, administrators can perform various functions, including creating new job postings, notifying SMS alert opted-in users of new events, awarding the 'Simply the Best' award to contract workers, and accessing the names, email addresses, and phone numbers (if opted in) of all contract workers for easy communication.

On specific event listings, administrators have displayed a table of successfully reserved contract workers that includes the worker's name, email, and reserved occupation. Additionally, administrators can delete job postings if deemed necessary. 

## Optimizations
As time permits, there are additional optimizations, improvements, and additional features that will be added to Helping Hands. 

Additional features and optimizations include:

* The application will be migrated to a React-based framework.
* Future UI will incorporate a monthly calendar view populated with all user events, both previous and upcoming.
* Users will be able to unreserve an event 7 days before the event's date.
* Administrators will be able to manually assign a user to an event if need be.
* When an event has met the requested staff quantity, users who remain interested will be able to be put on a waitlist that will automatically reserve the event on a first-come-first-serve basis should a spot be unreserved.
* Upcoming events will be able to be sorted by selected occupation role and availability.
* Utilizing Google Calendar API for users to seamlessly add event dates and times to their calendars.
* Users will be given a staff tier property assigned by the administrator. Certain events will require a user to be in a specific tier to be able to view and reserve the event.
* Administrators will be given a tier (e.g. Head Administrator). Certain permissions will be granted to higher-tier administrators, such as promoting other users to an administrator.
* Users will be able to report their arrival and departure hours to an administrator following the conclusion of an event.
* Reminders via SMS and/or email 24 hours before an event.
* Employers will be able to create 'Employer Accounts' that will enable their companies to post event information and request staff.

## Lessons Learned
* Developed the ability to create reusable and abstracted code to improve the overall usability and readability of the codebase.
* Placed significant emphasis on the application's responsiveness among all screen sizes.
* Familiarized with Tailwind CSS to create a unique, straightforward aesthetic that fits the desired request from Simply Serving.
* Practiced user authentication and validation through Passport.js.
* Learned how to send opted-in users SMS updates via Twilio.
* Learned how to integrate map images seamlessly using Cloudinary.
* Consistently sought feedback from other developers in both front-end and back-end development, while actively searching for best practices.
