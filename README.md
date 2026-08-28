# GreenPath Navigator

Lovable AI Prompt — GreenPulse Prototype

Build a modern web application prototype called GreenPulse — an intelligent emergency traffic coordination system that creates a dynamic green corridor for ambulances.

The goal of this prototype is to demonstrate the complete workflow:

User Registration → Ambulance/Emergency Request → Critical Alert → Automatic Route Calculation → Upcoming Signal Detection → Time-based Signal Coordination → Nearby Vehicle Alerts → Traffic Admin Dashboard → Ambulance Reaches Hospital → Signals Return to Normal

This is a prototype/simulation, so do NOT attempt to control real traffic signals or use real emergency services. Simulate the traffic network, vehicles, ambulance movement and traffic signals through the web interface.

1. Overall Concept

GreenPulse should not be presented as merely an ambulance tracking application.

The key feature is:

GreenPulse automatically calculates an emergency route and coordinates multiple upcoming traffic signals based on the ambulance's predicted arrival time, while also warning nearby vehicles and minimizing disruption to normal traffic.

Example:

AMBULANCE
   ↓
Current Location
   ↓
Emergency/Critical Status
   ↓
GreenPulse calculates optimal route
   ↓
Upcoming intersections identified
   ↓
ETA calculated for every intersection
   ↓
Signals scheduled according to ETA
   ↓
Nearby vehicles receive warning
   ↓
Traffic controller receives corridor activation
   ↓
Ambulance passes intersections
   ↓
Signals automatically return to normal

2. User Types

Create three types of users:

A. Ambulance / Emergency Vehicle User

Can:

 Register

 Login

 Enter ambulance/vehicle details

 Enter current location

 Select hospital destination

 Select emergency level:

 Normal

 Urgent

 Critical

 Start emergency trip

 View automatically calculated route

 View upcoming traffic signals

 View estimated arrival time

 View corridor activation status

 See alerts sent to nearby vehicles

B. Normal Vehicle User

Can:

 Register

 Login

 View their current simulated location

 See nearby emergency alerts

 Receive warning when an ambulance is approaching

 See approximate direction of the ambulance

 Receive message such as:

🚨 Emergency vehicle approaching. Please give way and avoid blocking the upcoming intersection.

The normal vehicle does NOT control traffic signals.

C. Traffic Admin / Signal Controller

Can:

 Login to admin dashboard

 View active emergency vehicles

 View their routes

 View traffic signals

 See signal status

 See upcoming emergency corridors

 See scheduled green windows

 Monitor traffic density

 View emergency alerts

 See corridor activation/deactivation

The admin should be able to see what GreenPulse is automatically planning.

3. Landing Page

Create a professional landing page for GreenPulse.

Hero section:

GreenPulse

Intelligent Emergency Green Corridors

Subtitle:

Coordinate traffic signals dynamically to help emergency vehicles reach critical destinations faster.

Buttons:

Get Started

View Demo

Show a visual representation:

🚑 → 🟢 🚦 → 🟢 🚦 → 🟢 🚦 → 🏥

Include sections:

 How It Works

 Emergency Corridor

 Real-Time Signal Coordination

 Nearby Vehicle Alerts

 Traffic-Aware Routing

 Dashboard Preview

Use a modern smart-city/transportation design.

4. Authentication

Create:

Register

Fields:

 Full Name

 Email

 Password

 Phone

 User Type

If user selects:

Ambulance

show additional fields:

 Ambulance ID

 Vehicle Registration Number

 Hospital/Organization

 Emergency Vehicle Verification Status

If user selects:

Normal Vehicle

show:

 Vehicle Registration Number

If user selects:

Traffic Admin

show admin credentials.

For the prototype, authentication can be simulated if a real backend is not available.

5. Ambulance Dashboard

Create a dedicated ambulance dashboard.

Display:

Current Status

Ambulance ID: AMB-102
Status: CRITICAL
Destination: City Hospital

Add buttons:

Start Emergency Trip

and

End Emergency Trip

When the user starts an emergency trip, ask:

Select destination hospital

Then automatically start the GreenPulse workflow.

6. Emergency Level

Create three emergency states:

🟢 Normal

🟡 Urgent

🔴 Critical

If the ambulance selects:

CRITICAL

activate the GreenPulse emergency workflow.

Display:

🔴 CRITICAL EMERGENCY — GreenPulse Corridor Activation Initiated

7. Automatic Route Calculation

This is one of the MOST IMPORTANT features.

Do not make the ambulance user manually choose a route.

Once the destination hospital is selected:

GreenPulse automatically calculates the route.

For the prototype, create a simulated road network.

Example:

Ambulance
    |
    A
   / \
  B   C
  |   |
  D---E
   \ /
    F
    |
 Hospital

The system should select the best route based on:

 Distance

 Traffic density

 Estimated travel time

 Number of intersections

 Emergency priority

Display:

Optimal Emergency Route Found

Example:

AMB-102

Start
 ↓
Intersection I1
 ↓
Intersection I2
 ↓
Intersection I5
 ↓
Intersection I7
 ↓
City Hospital

8. Signal Coordination

This is the CORE GreenPulse feature.

After calculating the route, identify all traffic signals on that route.

For example:

SignalDistanceAmbulance ETAPlanned ActionSignal 01400m25 secPrepare GREENSignal 02850m52 secSchedule GREENSignal 031.2km78 secSchedule GREENSignal 041.7km110 secSchedule GREEN

Create a visual timeline:

NOW
│
├── 25 sec → 🚦 Signal 01 → GREEN
│
├── 52 sec → 🚦 Signal 02 → GREEN
│
├── 78 sec → 🚦 Signal 03 → GREEN
│
└──110 sec → 🚦 Signal 04 → GREEN

The system should simulate the signals changing automatically as the ambulance moves.

9. Green Corridor Visualization

Create a live map-style interface.

Show:

 Roads

 Intersections

 Traffic lights

 Ambulance

 Hospital

 Normal vehicles

 Emergency route

The emergency route should be visually highlighted.

Traffic signals should display:

🔴 Red
🟡 Yellow
🟢 Green

When GreenPulse activates the corridor:

🚑
 ↓
🟢 I1
 ↓
🟢 I2
 ↓
🟢 I3
 ↓
🟢 I4
 ↓
🏥

Display:

GREEN CORRIDOR ACTIVE

10. Nearby Vehicle Alerts

When an ambulance enters an emergency corridor, simulate alerts being sent to normal vehicles near the route.

Example notification:

🚨 Emergency Vehicle Alert
Ambulance approaching from 350m.
Please give way and avoid blocking the intersection.

Show a notification panel containing:

🚨 12 vehicles notified
🚨 3 intersections affected
🚨 Emergency route active

Normal vehicle users should see these alerts on their dashboard.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/46e6f613-14d2-432e-b175-38c2011c50f5).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
