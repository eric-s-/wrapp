# wrapp
Wrapp is a social web app for tracking gift ideas!

Wrapp allows users to create gift lists, add gift ideas to these lists, and view gift ideas that others have posted.
The application allows users to enter gift ideas, and uses the Amazon Product Advertising API to add links and images to the gift list.

Features:

* Secure user management
* Create/delete/edit gift lists
* Create/delete/edit gift ideas
* View all gift ideas that others have posted

Installation:

* clone repo
* cd into project directory
* `npm install`
* Add config folder
* Add config/db.js

	`module.exports = {
       url : 'mongodb://localhost/your-database-name'
   }`
* Add config/config.js

	`module.exports = {
       awsId: '',
       awsSecret: '',
       assocId: '',
       passport_secret: ''
   }`

To Do:

* Enhance UI
* Enhance amazon product advertising API product selection algorithm
* Enable sharing of gifts between lists
* Add shared lists

