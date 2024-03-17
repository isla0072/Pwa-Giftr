# PWA Giftr

## Overview
Giftr is a progressive web app (PWA) designed for efficient gift tracking and idea generation, enabling users to create and manage gift lists for friends and family. The app emphasizes an offline-first approach, ensuring functionality even without an internet connection, and utilizes caching strategies for storing data locally.

## Features
- **Home Screen**: Displays a sorted list of people by their upcoming birthdays, with options to edit or view gift ideas.
- **Add/Edit Person Screen**: Allows adding new people or editing existing ones, including their name and date of birth.
- **Gift List Screen**: Shows a list of gift ideas for a selected person, with the ability to delete ideas.
- **Add Gift Screen**: Facilitates adding new gift ideas, including the idea's description and associated details.
- **Offline Capability**: Utilizes service workers and caches to ensure the app remains functional offline.

## Data Management
- Data is stored in JSON files within caches, ensuring easy export and import of individual person data.
- A "Single Source of Truth" approach is employed, where data is fetched once and then stored locally in the app for performance optimization.

## Technologies Used
- HTML, CSS, and JavaScript for core development.
- Service Workers and Cache API for offline functionality.
- Responsive design techniques for a seamless experience across devices.

## Credits
Developed as a midterm project for the FullStack: FrontEnd Development course.

## Getting Started
To use the app, simply visit the deployed URL. For development, clone the repository, and ensure you have a basic server setup to serve the app over HTTPS, as service workers require a secure context.

```bash
git clone <https://github.com/isla0072/Pwa-Giftr>
