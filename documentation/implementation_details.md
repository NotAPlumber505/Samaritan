# Samaritain Implementation Documentation
This document outlines and explains the implementation of the samaritain app in different tech stacks<br>
Table of Contents:<br>
[UI/UX](#uiux)<br>
[Front-End](#front-end)<br>
[Back-End](#back-end)<br>
[Post-MVP](#postmvp)<br>


## <a id="uiux"></a>UI/UX
### Basic Elements
#### Homescreen
- Top of homescreen says: ``"Text or Dial 911 for any emergencies. The Distress button is NOT a replacement for requesting emergency services"``
- Button that says Emergency and:
    - When pressed, bypasses silent mode on phone to make a super loud noise, vibrates, and counts down for 10 seconds before sending to Emergency sent screen and sending out an emergency
    - Top area of screen has a cancel button
    - Area below screen has a new red bar that when swiped, immedietly sends emergency. Should say "Swipe to immedietly send emergency"
- Navbar on bottom of the screen with
    - Home Icon
    - Alerts Icon
#### Emergency Screen
- Has a list of questions with clickable answers, which are:
  - Do you require 911 to be dialed for you [YES|NO]
  - What's the nature of the emergency? [Medical|Other]
    - If medical is chosen, these questions appear
    - Choose the most relevant situation: [CHOKING|UNRESPONSIVE|ALLERGY|OTHER]
  - Is this emergency for you? [YES|NO]
  - Provide any other details you'd like below:
  - TEXTFIELD
- Appears for samaritain responders as well, plus a map to where the emergency is
#### Profile Page
- Allows to opt in or out of being a samaritan 
## <a id="front-end"></a>Front-End 
Behind-the-scenes logic of the UI.
- No logins, ever. On first boot, generates a ECDSA key pair and sends it to POST /user. The back-end replies with the created User-ID.
- Emergency calls can be sent and canceled via API (Check JSON Structures file).
- Changes to the emergency are communicated via websocket. Making changes debounces for 3 seconds.
- Clicking on Emergency notification sends you to emergency details and allowing it to be accepted and can be unaccepted after. Also connects to a websocket for updates.
- Opting in should send API request to change user details
- Follow JSON format found on JSON structures documentation

## <a id="back-end"></a>Back-End
- Has API Endpoints for all actions the user can take.
- Only sends out notifications/Only allows emergencies form
- Verifies actions that require identity using ECDSA public key from that user id (View JSON documentation for)


## Database
Stores Users Table with columns id and ecdsa public key.

## <a id="postmvp"></a>Post MVP
- A radius option for how far away the distress call should call for people below the button as a slider.
- Navbar now features a profile where the user can input their own details, which is informed to be provided in the distress call if they choose YES for "is this emergency for you?", only shown when a emergency is accepted.
- Loading indication" of time going down for emergency button (Vertical/Horizontal color change across the button?)
- Voice Recording attached to the emergency call

## Important Post MVP
Look into creating another application that detects when a person falls from a video feed, and sends out a notification to samaritains with the video feed to confirm to see if it's an emergency or not/
