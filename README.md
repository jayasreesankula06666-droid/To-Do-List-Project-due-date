# Student To-Do List 📝

A beginner-friendly to-do list web app made with HTML, CSS, and JavaScript.

## Features
- Add tasks with a required due date and time
- Automatically show when each task was added
- Highlight overdue tasks
- Mark tasks as completed
- Delete tasks
- Save tasks in browser local storage
- Responsive layout for mobile and desktop
- Existing tasks from the earlier version remain available; they may show no due date until replaced or updated

## Project files
- `index.html` — page structure and task/due-date form
- `style.css` — styling and responsive layout
- `script.js` — task functionality, dates, overdue status, and local storage

## Run locally
1. Download or clone this repository.
2. Open `index.html` in a web browser.
3. Enter a task and choose its due date and time, then select **Add task**.

No installation or build step is required.

## Publish with GitHub Pages
1. Upload all project files to the root of your GitHub repository, replacing the old versions.
2. Open **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Select the `main` branch and `/(root)`, then save.
5. Wait for GitHub Pages to publish the site. The URL will appear in the Pages settings.

## Note
Dates and times are shown in the browser's local time zone. Tasks are saved in the current browser on the current device and do not automatically sync between devices. This project does not send notifications when a task is due.
