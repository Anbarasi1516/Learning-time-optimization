# Intelligent Learning Time Optimization Using AI

A beginner-friendly full-stack web application with:
- Frontend: HTML, CSS, JavaScript
- Backend: Java Spring Boot
- Database: MySQL
- REST APIs for authentication, subjects, timetable, and progress tracking
- Chart.js visualizations for dashboard insights

## Project Structure

frontend/
  - index.html
  - style.css
  - main.js

backend/
  - pom.xml
  - src/main/java/com/example/learningoptimization/
    - controller/
    - model/
    - repository/
    - service/
  - src/main/resources/application.properties
  - schema.sql

## Setup Instructions

1. Create a MySQL database named `learning_opt`.
2. Update `backend/src/main/resources/application.properties` with your database username and password.
3. Run the schema file from `backend/schema.sql` if you want explicit table definitions.
4. Start the Spring Boot backend from the `backend/` folder.
5. Open `frontend/index.html` in your browser.
6. Register a new user, add subjects, generate today's plan, and update progress.

## Features

- Login and register with backend authentication
- Subject management with create, update, and delete
- Rule-based AI schedule generation using difficulty, priority, and exam urgency
- Emergency reschedule button for missed study slots
- Progress tracking and dashboard charts
- Daily reminder banner for the study plan
