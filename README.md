# Project Location
This project can be found at [neuroflow.stevenml.com](neuroflow.stevenml.com) and will run the same as if it were run on a local system.

# Deployment Changes
This webapp has already been deployed in a production environment at [neuroflow.stevenml.com](neuroflow.stevenml.com). This uses both nginx and uWSGI to host the app and handle multiple requests at once. In terms of development, I would change all the backend endpoints to be seperate from the frontend app by starting all endpoints with /api/. This way it would not result in any errors on the backend when tryin to access a backend endpoint such as when you refresh while on the mood page. I would also add a lot more styling to the webapp using scss.

# Install Instructions
To run this you must first install nodejs and npm. Then you can go into the root directory for the project and type the following command:
```
npm i
npm run start
```
This will download all the necessary libraries and then start the React app.

Then to run the backend you must install the following python libraries:
```
Flask
flask_praetorian
flask_sqlalchemy
flask_cors
```
After this, open a browser and navigate to:
```
localhost:3000
```
and then you will be using the webapp.

You can make a new account on the create account tab or log in with the default:
```
Username: admin
Password: admin
```
That the database is initialized with. After logging in you will be redirrected to the mood page where you can click a mood and click submit to send it to the backend where it will be stored in teh database and returned along with the rest of the moods. To find the source code for these folders look in Pages/mood.py