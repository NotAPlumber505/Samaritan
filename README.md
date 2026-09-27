# Samaritan

**Connect people who can help with people who need help.**

Ever find yourself in a bind, but no one comes to mind? With Samaritan, you can request help with the press of a button and connect with nearby people who are willing to respond.

## Inspiration

We wanted to build an application that encourages people to help one another. One of the biggest concerns in an emergency is not knowing who to turn to when no one is nearby. Samaritan was created to help bridge that gap.

## What It Does

Samaritan allows users to:

* Request help during a medical emergency
* Select the type of emergency they are experiencing
* Notify nearby responders
* Track the responder's location in real time
* Opt in as a Samaritan and help others in need

## Tech Stack

* **React Native + Expo** — Mobile UI/UX and frontend logic
* **TypeScript** — Frontend development
* **Spring Boot + Java** — Backend logic and API endpoints
* **WebSockets** — Real-time emergency updates and location tracking
* **Tiger Data** — Database and user data storage
* **Firebase** — Push notification service

## How We Built It

React Native and Expo allowed us to quickly build a mobile application that works across Android and iOS. TypeScript was used for the frontend logic and user interface.

For the backend, we used Spring Boot with Java to create our API endpoints and WebSocket connections for real-time updates. Tiger Data was used for database storage, while Firebase handled push notifications.

## Challenges

One of our biggest challenges was handling user information without spending too much of our limited development time building a full authentication system.

To keep development moving, we used hashed keys with local storage to distinguish and store user information between devices.

## Accomplishments

Building a full-stack mobile application in under two days was a major accomplishment for our team.

We were able to bring together:

* Mobile frontend
* Backend APIs
* Real-time WebSockets
* Location tracking
* Database storage
* Push notifications

More importantly, we built an application centered around people helping people.

## What We Learned

We learned how many different systems have to work together to build a real-time application. Connecting the frontend, backend, database, WebSockets, location services, and notifications required us to think about the application as one complete system rather than a collection of individual features.

We also learned how important it is to make practical decisions and prioritize functionality when working under a tight deadline.

## What's Next

Future improvements for Samaritan could include:

* User authentication and account management
* Improved emergency verification
* Detailed responder profiles
* More types of assistance requests
* Improved geographic matching
* Faster and more reliable emergency notifications
* Additional security and privacy features

Our goal is to make Samaritan a community where getting help in an emergency can be as simple as pressing a button.
