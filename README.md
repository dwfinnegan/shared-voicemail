# Shared-Voicemail Widget
This project is intended as a sample widget to provide a visual Message Waiting Indicator (MWI) on a "shared" Webex Calling voicemail box for agents using the Webex Contact Center (WxCC) desktop. 


## Introduction
It is common for contact centers to offer an option to leave a voicemail either after hours or during periods of high call volume.   Depending on the agent's phone configuration, it might not be possible to have a MWI light on the agent's phone or the agent might not have an deskphone altogether.

This widget provides the following features:
1. Message Waiting Indicator (MWI) with unread message count
2. Click to dial the voicemail pilot number

> Note:  The voicemail box is required to be a licensed user.  Today it's not possible to use a virtual-line for the voicemail box and receive notification through the webhook.

> Note: The click to dial is not able set the ANI for the voicemail box.  For this reason, the agent will have to enter the voicemail extension and pin when calling in.

## How it works

This widget requires the use of some Google cloud services to function efficiently.  The following process happens whenever a voicemail is marked read or a new message is received.  

1.  Webex Calling (WxC) triggers a webhook when a "telephony_mwi" updated event occurs
2.  A cloud function receives the Webhook and updates a Firestore DB with the number of unread messages
3.  The widget(s) maintains a real-time connection to the Firestore DB for updates

```
WxC Webhook -> Cloud Function -> Firestore DB <- Widget(s)
```

## Getting Started
Requirements: Node.js, NPM, a Webex Calling & Webex Contact Center tenant, Google Cloud Functions, Firebase, & any cloud storage/cdn

### First create the cloud function and the firestore db.

1.  There are numerous settings for building a cloud function.  Google is also in the process of migrating cloud functions to cloud run functions.  Check Google's [documentation](https://cloud.google.com/functions/docs) for instructions on how to create a cloud run function.

> Note: It is recommended to use the same Google Cloud Project for the Cloud Function and Firebase, otherwise you will have to configure service accounts and permissions between them.   

2.  Create an unauthenticated cloud function using the ```index.js``` and ```package.json``` files provided in the in the cloud-functions folder.

3. Create a Firestore DB with using the default database name and a collection named ```sharedVoicemail``` and set the rules using the ```firestore.rules``` file provided in the cloud-firestore folder. Check Google's [documentation](https://cloud.google.com/firestore/docs) for instructions on how to create a Firebase Firestore DB. 

4. Add a firebase web app.  This enables the real-time connection between the widget and Firestore.  You will need to copy the firebaseConfig from this step to the firebase.js file in a later step.

### Next create the Webex Calling Webhook.

1.  Log into ```https://developer.webex.com/docs/api/v1/webhooks/create-a-webhook``` with the use Webex userid of the "shared" voicemail box.

2. Fill out the required fields and submit to create a new webhook.
- name  *(this is used as the key for the Firestore DB, suggest something like sharedVoicemail1052)*
- targetUrl *(this is the public url for the cloud function created above)*
- resource  *(telephony_mwi)*
- event *(updated)*

### Next build the shared-voicemail widget

1. Download this project or ```git clone https//github.com/dwfinnegan/shared-voicemail```

2. From the project directory ```run npm install```

3. Copy your firebaseConfig to the ```src/firebase.js``` file

4. Run ```npm run build``` to build the widget for deployment.

5. Copy the build file from ```dist/assets``` folder to your preferred cloud storage.

> Note: The prject will not run in dev mode, as the desktop SDK only work when used in the agent desktop.

### Last upload the desktop layout File

1. Add the widget template from the desktop-layout folder to the ```advancedHeader``` section of your desktop layout JSON file.

2. Set the following fields in the widget template:

- webhookname   *(name from the webex calling webhook, must match case)*
- voicemaildn   *(the ANI that you want to use when calling voicemail, must be a valid WxCC DN)*
- voicemailpilot  *(the number to dial for voicemail)*
- entrypointid  *(the entry point id to use when making the call to voicemial)*
- script  *(the location where you upload to the script to cloud storage)*

2. Update this desktop layout and ensure its associated to the correct team.

## Changelog

#### [0.1.0] - 2024-09-18
- Initial project commit