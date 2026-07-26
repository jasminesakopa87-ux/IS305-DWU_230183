/*
  Program: Dining Meal Booking Feature
  Student Name: Jasmine Sakopa
  Student ID: 230183
  Date: 24 July 2026
  Description: A JavaScript program demonstrating classes,
  objects, constructors, private fields and methods.
*/

// DiningApp.js
// IS305 - Assessment Task 1, Part 2
// Interactive console application for booking meals.
// Bookings are stored only in memory, in a JavaScript array (no database).

const readline = require("readline");
const { stdin, stdout } = require("process");
const MealBooking = require("./MealBooking");

const rl = readline.createInterface({ input: stdin, output: stdout });

// Wraps the classic callback-based rl.question() in a Promise
// so it can be used cleanly with async/await.
function ask(promptText) {
  return new Promise((resolve) => rl.question(promptText, resolve));
}

// All bookings are stored here, in memory only.
const bookings = [];

// Checks the array for an existing booking with the same
// student ID, meal date and meal type (the duplicate rule).
function isDuplicate(studentId, mealDate, mealType) {
  return bookings.some(
    (b) =>
      b.studentId === studentId.trim() &&
      b.mealDate === mealDate.trim() &&
      b.mealType === mealType.trim()
  );
}

// Asks the user for all the details needed for one booking.
async function collectBookingInput() {
  console.log("========================================");
  console.log("       DWU DINING MEAL BOOKING");
  console.log("========================================");

  const studentId = await ask("Student ID: ");
  const studentName = await ask("Student name: ");
  const mealDate = await ask("Meal date: ");
  const mealType = await ask("Meal type (Breakfast/Lunch/Dinner): ");
  const quantityInput = await ask("Quantity: ");
  const dietaryNote = await ask("Dietary note: ");

  return {
    studentId,
    studentName,
    mealDate,
    mealType,
    quantity: quantityInput,
    dietaryNote,
  };
}

// Handles creating a new booking: validate -> check duplicate -> create -> store.
async function addBooking() {
  const data = await collectBookingInput();

  try {
    MealBooking.validate(data);

    if (isDuplicate(data.studentId, data.mealDate, data.mealType)) {
      throw new Error(
        `Duplicate booking: Student ${data.studentId} already has a ${data.mealType} booking on ${data.mealDate}.`
      );
    }

    const booking = new MealBooking(data);
    bookings.push(booking);

    console.log("\n========================================");
    console.log("          BOOKING CREATED");
    console.log(booking.getSummary());
  } catch (err) {
    console.log("\nError: " + err.message);
  }
}

// Lists all bookings currently stored, numbered for selection.
function listBookings() {
  if (bookings.length === 0) {
    console.log("\nNo bookings have been made yet.");
    return;
  }
  console.log("\n--- Current Bookings ---");
  bookings.forEach((b, index) => {
    console.log(
      `${index + 1}. ${b.studentName} (${b.studentId}) - ${b.mealType} on ${b.mealDate} - Status: ${b.bookingStatus}`
    );
  });
}

// Asks the user which booking number to act on, returns the MealBooking object.
async function selectBooking(actionLabel) {
  listBookings();
  if (bookings.length === 0) return null;

  const answer = await ask(`Enter the booking number to ${actionLabel}: `);
  const index = Number(answer) - 1;

  if (!Number.isInteger(index) || index < 0 || index >= bookings.length) {
    console.log("Error: That is not a valid booking number.");
    return null;
  }
  return bookings[index];
}

async function confirmBookingFlow() {
  const booking = await selectBooking("confirm");
  if (!booking) return;
  booking.confirmBooking();
  console.log("\n" + booking.getSummary());
}

async function cancelBookingFlow() {
  const booking = await selectBooking("cancel");
  if (!booking) return;
  booking.cancelBooking();
  console.log("\n" + booking.getSummary());
}

// Displays the main menu and returns the user's choice.
async function showMenu() {
  console.log("\n========================================");
  console.log("           MAIN MENU");
  console.log("========================================");
  console.log("1. Add a new booking");
  console.log("2. Confirm a booking");
  console.log("3. Cancel a booking");
  console.log("4. View all bookings");
  console.log("5. Exit");
  return ask("Select an option (1-5): ");
}

// Main application loop.
async function main() {
  let running = true;

  while (running) {
    const choice = (await showMenu()).trim();

    switch (choice) {
      case "1":
        await addBooking();
        break;
      case "2":
        await confirmBookingFlow();
        break;
      case "3":
        await cancelBookingFlow();
        break;
      case "4":
        listBookings();
        break;
      case "5":
        running = false;
        console.log("\nGoodbye!");
        break;
      default:
        console.log("\nError: Please choose a valid option (1-5).");
    }
  }

  rl.close();
}

// Run the program, catching any unexpected error so it never crashes silently.
main().catch((err) => {
  console.log("\nAn unexpected error occurred: " + err.message);
  rl.close();
});