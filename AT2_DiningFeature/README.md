# IS305 – Dining Meal Booking Feature (AT2)

**Student Name:** Jasmine Sakopa
**Student ID:** 230183
**GitHub Repository URL:** https://github.com/jasminesakopa87-ux/IS305-DWU_230183
## Description
A console-based Node.js application for booking a meal at DWU Dining Services.
Students enter their booking details through the console, and the program
validates the input, prevents duplicate bookings, calculates the total cost,
and lets a booking be confirmed or cancelled. All bookings are stored only in
memory, in a JavaScript array — no database or file storage is used.

## Files Submitted

| File | Purpose |
|---|---|
| `MealBooking.js` | The `MealBooking` class: private fields, constructor, validation, cost calculation, confirm/cancel methods, and the booking receipt. |
| `DiningApp.js` | The console application: menu-driven interface using `readline`, collects user input, stores bookings in an array, prevents duplicates, and displays receipts. |
| `package.json` | Marks this folder as CommonJS so `require()` works correctly. |
| `README.md` | This file. |

## How to Run