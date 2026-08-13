# IS305 – Dining Meal Booking System (Lab 2: Dining Booking Credit Extension)

**Student Name:** Jasmine Sakopa
**Student ID:** 230183
**Unit:** IS305 – Object-Oriented Programming
**Technology:** JavaScript (Node.js)
**GitHub Repository:** (https://github.com/jasminesakopa87-ux/IS305-DWU_230183.git)

## How Lab 2 Extends Lab 1

Lab 1 (Pass level) built the `MealBooking` class, which originally stored a
student's ID and name directly inside each booking. Lab 2 (Credit
Extension) keeps all of that working Lab 1 code and improves the design by
introducing a separate `Student` class. Student identity now lives in one
`Student` object, and any number of `MealBooking` objects can be connected
to it — so the same student's details are never duplicated across their
bookings. No new or unrelated application was created; `MealBooking.js` and
`DiningApp.js` are the same files from Lab 1, extended in place.

## Files

| File | Purpose |
|---|---|
| `Student.js` | Represents a student's identity (ID, first name, last name). Added in Lab 2. |
| `MealBooking.js` | Represents a single meal booking, connected to a `Student` object. |
| `DiningApp.js` | Console entry point — menu, input handling, and program flow. |
| `README.md` | This file. |

## The Student Class

`Student.js` defines a class with three private fields: `#studentId`,
`#firstName`, `#lastName`. The constructor accepts these three values and
assigns them using `this`, routed through the class's own setters so
validation runs immediately at creation time. Getters expose the fields for
reading; setters reject any empty value and print a rejection message
instead of accepting it. `getFullName()` combines the first and last name
into one string, and `displayInfo()` prints (and returns) the student's ID
and full name in a formatted block.

## How Student and MealBooking Are Connected

Before Lab 2, `MealBooking` stored a student's ID and name as plain strings
inside each booking. In Lab 2, `MealBooking`'s constructor instead accepts
a `student` parameter — an actual `Student` object — and stores it in a
private field, `#student`. `MealBooking.validate()` checks that a real
`Student` object (with non-empty ID, first name and last name) was
supplied before a booking can be created.

Because `#student` holds a **reference** to the same `Student` object
rather than a copy of its data, several `MealBooking` objects belonging to
one student all point back to that one object. `getSummary()` reads the
student's name and ID live from that reference each time it is called.
This is demonstrated directly in `DiningApp.js`: updating a student's name
(menu option 7) changes nothing on any `MealBooking` object, yet every
existing booking's summary immediately shows the new name the next time it
is displayed, because they were all pointing at the same `Student` object
in memory.

## Object Relationship

```
Student
  ├── studentId, firstName, lastName
  ├── getFullName()
  └── displayInfo()
        │
        │ referenced by
        ▼
MealBooking
  ├── student (reference, not a copy)
  ├── mealDate, mealType, quantity, dietaryNote, bookingStatus
  ├── calculateTotal()
  └── getSummary()
```

## How to Run

```
node DiningApp.js
```

Follow the on-screen menu. A typical flow:
1. Register a student (option 1)
2. Add a booking for that student's ID (option 2)
3. View their booking history (option 6)
4. Update their name (option 7) and view the history again (option 6) to
   see the change reflected in the existing booking

## Tests Completed

| Test | Result |
|---|---|
| Valid Student object | Accepted and displayed correctly via `displayInfo()` |
| Invalid Student information (empty ID/first/last name) | Each field rejected individually with a clear message; registration cancelled overall |
| Student and booking integration | Booking created by ID lookup only — no re-entry of name; summary pulls details from the connected `Student` object |
| Updated student name | Name change reflected immediately in existing booking summaries and booking history (shared reference) |
| Booking history | Correctly filtered per student, with accurate booking count and combined cost |
| Confirm/cancel booking | Status transitions correctly (Pending → Confirmed / Cancelled); rejects invalid transitions |

## Use of AI Tools

Claude (Anthropic) was used as a coding assistant to help design and
extend the `Student` class, refactor `MealBooking` to reference a `Student`
object, and implement `displayBookingHistory()` and the controlled
student-update workflow. All code was reviewed, run, and tested by the
student in a local Node.js environment before submission. Design
decisions (e.g. routing the constructor through setters, storing a
`students` array in `DiningApp.js`) were made in consultation with AI
suggestions and verified against the Lab 2 marking criteria.
