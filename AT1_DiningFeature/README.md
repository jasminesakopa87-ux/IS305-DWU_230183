# DWU Dining Meal Booking Feature – AT1

**Student Name:** Jasmine SAKOPA  
**Student ID:** DWU230183
**GitHub Repository:** https://github.com/your-username/IS305-DWU_230183  

## Description

A console-based JavaScript application that allows a student to book a meal.  
It demonstrates:
- Object-oriented programming with classes, private fields, getters/setters.
- Validation of all input fields.
- Prevention of duplicate bookings (same student, same meal type, same date).
- Calculation of total cost based on meal type and quantity.
- Persistent in‑memory storage using an array (no database).

## Files and Their Purpose

| File | Purpose |
|------|---------|
| `MealBooking.js` | Defines the `MealBooking` class with private fields, constructor, getters/setters, `calculateTotal()`, and `getSummary()`. |
| `DiningApp.js` | Main console app that prompts user input, validates data, checks duplicates, stores bookings, and displays summaries. |
| `package.json` | Sets the project as an ES module (required for `import`/`export`). |
| `README.md` | This file – contains project overview, instructions, and testing summary. |

## How to Run

1. Ensure you have [Node.js](https://nodejs.org/) installed (version 12 or higher).
2. Open a terminal and navigate to the project folder (`AT1_DiningFeature`).
3. Run the following command:
   ```bash
   node DiningApp.js