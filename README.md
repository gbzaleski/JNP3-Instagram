## Quick start
- git clone https://github.com/gbzaleski/JNP3-Instagram
- cd JNP-Instagram
- docker-compose build
- docker-compose up

## Cooperation
Project created in cooperation with https://github.com/WiktorSzyc as a final project for JNP3 (Languages and tools of programming pt. 3) course at the University of Warsaw.

## Project description
Project idea is directly based on the Instagram social media - with only its the most important part simplified such as authorisation, user account system, posting pictures, commenting, following, like reactions and user profile customisation.
Frontend was created with React, backend with Node.js and Express.
Whole project is divided into ten indepentent microservices with different tasks - each on separate Docker instantion with its own databases.
Project contains Redis caching system, token verification middleware and load-balancing with Varnish - between two units of frontend applications.
