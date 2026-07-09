# ResQLink — How It All Works

This document explains ResQLink in plain language — no code, just what the app actually does and how the pieces connect. If you're new to the project, read this top to bottom.

---

## 1. What is ResQLink?

ResQLink is an ambulance booking system, like Uber but for emergency medical transport. It has three parts:

- **A mobile app** (Flutter) — used by patients, drivers, and paramedics.
- **A backend server** (NestJS) — the "brain" that stores data and makes decisions.
- **An admin dashboard** (a website) — used by staff to manage everything.

---

## 2. The Four Types of Users

| Role | What they do |
|---|---|
| **Patient (USER)** | Books an ambulance, tracks it live, chats with the driver, pays, and rates the ride. |
| **Driver** | Drives the ambulance. Gets ride alerts, accepts/rejects them, shares live location, chats with the patient. |
| **Paramedic** | A medical professional who rides along on "consultant" trips. Gets pulled into the ride automatically alongside their paired driver. |
| **Admin** | Manages the whole system from a dashboard — users, ambulances, verifications, live tracking, and more. Nobody can sign themselves up as an Admin — that account type has to be set up directly in the system. |

---

## 3. Booking a Ride (Patient's Journey)

1. **Sign up / Log in** — with an email or phone number.
2. **Set pickup & destination** — the app grabs your GPS location automatically for pickup, and you search for where you're going.
3. **Choose ambulance type:**
   - **Only Ambulance (Basic)** — PKR 200 base + PKR 50/km
   - **Ambulance with Consultant** — PKR 500 base + PKR 100/km (this one brings a paramedic along)
4. **Choose how to pay** — Cash, Card, or Wallet (JazzCash / EasyPaisa / Bank Transfer).
5. **See the fare and tap Book.**
6. The moment you tap Book, the system instantly shows you a "finding driver" screen — and behind the scenes, it starts **automatically hunting for the best available driver** for you. You don't wait for a human to do this. See the next section for how that works.

---

## 4. The Smart Auto-Dispatch System (This Is the Cool Part)

Think of it like having an intelligent, tireless dispatcher working 24/7, who never sleeps and never gets it wrong:

> **The moment a ride is booked, the system automatically looks at every available ambulance and driver nearby, calculates who is actually closest to the patient, and instantly sends the request to that one driver — no phone calls, no manual matching, no waiting for a human operator.**

Here's what happens step by step:

1. The system finds all **ambulances of the right type** (Basic or Consultant) that are currently free.
2. It finds all **drivers** who are active, not already busy on another ride, and haven't already turned this specific ride down before.
3. It calculates the real distance from each candidate to the patient's pickup point and **automatically picks the nearest one** — both the nearest free ambulance and the nearest free driver.
4. It sends that driver a ride alert and gives them **2 minutes** to respond.
5. If nobody at all is available, the patient gets an SMS letting them know.

### What happens if a driver doesn't respond? (Automatic Reallocation)

This is the part that makes the system feel genuinely smart. If a driver:
- **Rejects** the ride, or
- **Doesn't respond within 2 minutes,**

...the system doesn't just give up or wait for someone to notice. A background process checks every 30 seconds for any ride that's been waiting too long, and when it finds one, it **automatically**:

1. Marks that driver as "already tried, didn't respond" for this ride (so they won't be offered it again).
2. Frees up the ambulance that was reserved for them.
3. Re-runs the *exact same smart-matching process* described above — which now, because it remembers who already said no, **automatically skips that driver and finds the next-nearest available one.**

This repeats **on its own, without any human involvement**, driver after driver, until someone accepts — or until the system genuinely runs out of available drivers, at which point it tells the patient no one is available right now.

In short: **you never have to manually reassign a ride because a driver went silent — the system already did it for you, automatically, within seconds of the timeout.** This same instant reassignment also kicks in immediately (not waiting 30 seconds) if a driver actively taps "Reject."

---

## 5. Driver's Journey

1. **Go online** — the driver's app shows "You are Online — Ready to accept ride requests" and quietly checks for new rides every few seconds.
2. **Get an alert** — when the smart-dispatch system picks them, a popup appears showing the pickup location and ride type, with big **Yes / No** buttons. If the patient cancels while this popup is showing, it automatically closes and lets the driver know — they're never left staring at a dead ride.
3. **Accept** — the app calculates an estimated arrival time and takes the driver into the active ride screen.
4. **Drive & chat** — the driver can message the patient in real time, see the route on a map, and update the ride's progress ("Start Ride," "Complete Ride").
5. **Live location sharing** — once the ride starts, the driver's phone automatically sends its GPS position every 10 seconds, so the patient (and admin) can watch the ambulance move on a live map in real time.
6. **Complete the ride** — the fare is finalized, the ambulance becomes available again for the next patient, and the driver's stats (total rides, rating) update automatically.

---

## 6. Consultant Rides (Driver + Paramedic Together)

For "Ambulance with Consultant" bookings, the system works a little differently:

- Admins can **pre-pair** a specific driver with a specific paramedic ahead of time (one driver, one partner paramedic).
- When a consultant-ride request comes in, the smart-dispatch system doesn't just look for the nearest driver — it looks for the nearest **complete pair** where *both* the driver and their paramedic partner are free.
- Both people get assigned to the ride together, at the same time, automatically.
- Drivers who are paired with a paramedic are automatically reserved for consultant rides — they won't be matched with a plain "Basic" booking. This keeps things clean and avoids a paramedic's driver being pulled away for a simple ride.

---

## 7. Live Chat — Including Group Chat for Consultant Rides

Every ride comes with real-time, instant messaging — no refreshing, no delay, messages appear the moment they're sent.

- **On a Basic ride:** it's a private two-way chat between the patient and the driver.
- **On a Consultant ride:** it automatically becomes a **three-way group chat** — patient, driver, and paramedic can all see and send messages in the same conversation, clearly labeled with who said what. This happens automatically the moment a consultant ride is created — nobody has to manually create a group.
- Only the people actually assigned to that specific ride can join or read its chat — it's fully private to that ride.
- Chat automatically shuts down and locks once the ride is finished or cancelled, keeping things tidy.
- Messages are saved, so if someone reopens the app, their conversation history is still there.

---

## 8. Live GPS Tracking

Once a ride is underway, the ambulance's location updates automatically on a live map — both in the patient's app and on the admin dashboard's fleet map. Every 10 seconds, the driver's phone quietly reports its position, and everyone watching sees the ambulance move in near real time, just like tracking a food delivery.

---

## 9. Payment

Patients can choose Cash, Card, or Wallet (JazzCash/EasyPaisa/Bank Transfer) when booking. The fare is calculated automatically based on distance traveled.

**Important note:** Right now, payment is handled as a status flag in the system (Pending → Paid) rather than a live, real-money transaction through a payment gateway. This is the current, working version of the flow — think of it as the framework being fully built and ready, with the final "connect to a real payment processor" step being a future enhancement rather than something broken today.

---

## 10. Notifications — How Users Get Alerted

- **OTP codes (for verifying your account):** if you signed up with email, you get a styled verification email automatically. If you signed up with a phone number, the system is built to send the code via WhatsApp/SMS, though this channel is temporarily not working and is being looked into.
- Phone numbers are automatically recognized and corrected to the right format no matter how someone types them (with or without the country code, with or without a leading zero) — one less thing anyone has to think about.

---

## 11. Signing Up & Logging In

- You can sign up with **either an email or a phone number** — not both required.
- After signing up, you'll get a one-time code (OTP) automatically sent to verify it's really you.
- **Google Sign-In** is also supported — one tap, and if you don't have an account yet, one is created for you automatically.
- Behind the scenes, once you're logged in, the app is given a secure digital "pass" (a token) that quietly refreshes itself in the background, so you stay logged in without having to keep re-entering your password.

---

## 12. The Admin Dashboard — What Staff Can Do

The admin dashboard is a website where staff manage the entire operation:

| Section | What it's for |
|---|---|
| **Users** | View and manage every account — patients, drivers, paramedics, admins. |
| **Ambulances** | Manage the fleet — add vehicles, set their type and availability status. |
| **Organizations** | Manage the companies/organizations that own ambulances. |
| **Paramedic Profiles** | Review and approve new paramedic sign-ups. |
| **Driver Profiles** | Review and approve new driver sign-ups, and pair drivers with paramedic partners for consultant rides. |
| **Ride Requests** | See every ride ever requested, filter by status, manually create a ride for a patient, or manually reassign one if needed. |
| **Live Tracking** | Watch every active ambulance move on a live map in real time. |
| **Dispatch** | A manual override tool — staff can directly assign a specific ambulance to a ride if they ever need to step in (the automatic system usually handles this on its own, as described in Section 4). |
| **Driver Performance** | See each driver's total rides, average response speed, and rating. |
| **Audit Log** | A record of every action any admin has taken, for accountability. |

---

## 13. Quick Glossary

- **Dispatch** — the process of automatically matching a ride request to the nearest available driver and ambulance.
- **Reallocation / Retry** — what happens automatically when a driver doesn't respond in time; the system reassigns the ride to the next best driver without anyone having to do it manually.
- **WITH_DOCTOR** — the internal name for a "Consultant Ambulance" ride, which includes a paramedic.
- **BASIC** — the internal name for a standard, driver-only ambulance ride.
- **Paired driver** — a driver who's been linked to a specific paramedic partner ahead of time, for consultant rides.

---

## Summary

ResQLink automates the hardest part of running an ambulance service — figuring out, in seconds, who's closest and available, and making sure nobody ever falls through the cracks if a driver doesn't respond. Patients get a live-tracked, chat-enabled ride from booking to drop-off, drivers get clear instructions delivered straight to their phone, and admins get full visibility and control over the entire operation from one dashboard.
