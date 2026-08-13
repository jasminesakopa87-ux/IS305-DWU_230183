/*
  Program: Dining Meal Booking Feature
  Student Name: Jasmine Sakopa
  Student ID: 230183
  Date: 24 July 2026
  Updated: 10 August 2026 (Lab 2 Part 2 - Student/MealBooking integration)
  Description: Console application that allows students to book meals,
  validates input, prevents duplicate bookings, and displays summaries.
*/

// DiningApp.js
// IS305 - Assessment Task 2 (Lab 2), Part 2
// Bookings and students are stored only in memory (no database).

const readline = require("readline");
const { stdin, stdout } = require("process");
const MealBooking = require("./MealBooking");
const Student = require("./Student");

const rl = readline.createInterface({ input: stdin, output: stdout });

// Wraps the classic callback-based rl.question() in a Promise
// so it can be used cleanly with async/await.
function ask(promptText) {
  return new Promise((resolve) => rl.question(promptText, resolve));
}

// All students and bookings are stored here, in memory only.
const students = [];
const bookings = [];

// ---------- Helper lookups ----------
function findStudentById(id) {
  const target = id.toString().trim();
  return students.find((s) => s.studentId === target);
}

// Checks the array for an existing booking with the same
// student ID, meal date and meal type (the duplicate rule).
function isDuplicate(studentId, mealDate, mealType) {
  return bookings.some(
    (b) =>
      b.studentId === studentId.toString().trim() &&
      b.mealDate === mealDate.toString().trim() &&
      b.mealType === mealType.toString().trim()
  );
}

// ---------- Student Registration ----------
async function registerStudent() {
  console.log("\n--- Student Registration ---");
  const studentId = await ask("Student ID: ");
  const firstName = await ask("First name: ");
  const lastName = await ask("Last name: ");

  const student = new Student(studentId, firstName, lastName);

  // Student's own setters reject empty values (leaving fields blank).
  // Treat an incomplete object as a failed registration.
  if (!student.studentId || !student.firstName || !student.lastName) {
    console.log("\nError: Student ID, first name and last name are all required. Registration cancelled.");
    return null;
  }

  if (findStudentById(student.studentId)) {
    console.log(`\nError: A student with ID ${student.studentId} is already registered.`);
    return null;
  }

  students.push(student);
  console.log("\nStudent registered successfully.");
  student.displayInfo();
  return student;
}

// ---------- Add a Booking (connected to a Student object) ----------
async function addBooking() {
  console.log("\n========================================");
  console.log("       DWU DINING MEAL BOOKING");
  console.log("========================================");

  const studentId = await ask("Enter the Student ID for this booking: ");
  let student = findStudentById(studentId);

  if (!student) {
    console.log("\nNo student found with that ID.");
    const wantsRegister = (await ask("Register this student now? (y/n): ")).trim().toLowerCase();
    if (wantsRegister === "y") {
      student = await registerStudent();
    }
    if (!student) {
      console.log("\nBooking cancelled: a valid student is required.");
      return;
    }
  }

  const mealDate = await ask("Meal date: ");
  const mealType = await ask("Meal type (Breakfast/Lunch/Dinner): ");
  const quantityInput = await ask("Quantity: ");
  const dietaryNote = await ask("Dietary note: ");

  try {
    if (isDuplicate(student.studentId, mealDate, mealType)) {
      throw new Error(
        `Duplicate booking: ${student.getFullName()} already has a ${mealType.trim()} booking on ${mealDate.trim()}.`
      );
    }

    const booking = new MealBooking({ student, mealDate, mealType, quantity: quantityInput, dietaryNote });
    bookings.push(booking);

    console.log("\n========================================");
    console.log("          BOOKING CREATED");
    console.log(booking.getSummary());
  } catch (err) {
    console.log("\nError: " + err.message);
  }
}

// ---------- List all bookings ----------
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

// ---------- Task 3: Student Booking History ----------
// Receives a Student object and the booking array, and displays that
// student's details once, all their bookings, the count and combined cost.
function displayBookingHistory(student, allBookings) {
  const studentBookings = allBookings.filter((b) => b.student === student);

  console.log("\n========================================");
  console.log("          STUDENT INFORMATION");
  console.log("========================================");
  console.log(`Student ID: ${student.studentId}`);
  console.log(`Student Name: ${student.getFullName()}`);
  console.log("========================================");

  console.log("\n========================================");
  console.log("            BOOKING HISTORY");
  console.log("========================================");

  if (studentBookings.length === 0) {
    console.log("No bookings found for this student.");
    console.log("========================================");
    return;
  }

  let combinedCost = 0;
  studentBookings.forEach((b, index) => {
    const cost = b.calculateTotal();
    combinedCost += cost;
    console.log(`${index + 1}. ${b.mealType} - ${b.mealDate}`);
    console.log(`   Quantity: ${b.quantity}`);
    console.log(`   Status: ${b.bookingStatus}`);
    console.log(`   Cost: K${cost.toFixed(2)}`);
  });

  console.log(`\nTotal Bookings: ${studentBookings.length}`);
  console.log(`Combined Cost: K${combinedCost.toFixed(2)}`);
  console.log("========================================");
}

async function viewBookingHistoryFlow() {
  const studentId = await ask("Enter the Student ID to view booking history: ");
  const student = findStudentById(studentId);
  if (!student) {
    console.log("\nError: No student found with that ID.");
    return;
  }
  displayBookingHistory(student, bookings);
}

// ---------- Task 4: Controlled Student Updates ----------
// Because every MealBooking stores a reference to the same Student object,
// updating the student's name here is immediately reflected in every
// existing booking summary - no booking data needs to be touched.
async function updateStudentFlow() {
  const studentId = await ask("Enter the Student ID to update: ");
  const student = findStudentById(studentId);
  if (!student) {
    console.log("\nError: No student found with that ID.");
    return;
  }

  console.log(`\nCurrent name: ${student.getFullName()}`);
  const newFirstName = await ask("New first name (press Enter to keep current): ");
  const newLastName = await ask("New last name (press Enter to keep current): ");

  if (newFirstName.trim() !== "") student.firstName = newFirstName;
  if (newLastName.trim() !== "") student.lastName = newLastName;

  console.log("\nStudent updated. New details:");
  student.displayInfo();

  console.log("\nExisting bookings for this student now show the updated name:");
  displayBookingHistory(student, bookings);
}

// ---------- Main Menu ----------
async function showMenu() {
  console.log("\n========================================");
  console.log("           MAIN MENU");
  console.log("========================================");
  console.log("1. Register a new student");
  console.log("2. Add a new booking");
  console.log("3. Confirm a booking");
  console.log("4. Cancel a booking");
  console.log("5. View all bookings");
  console.log("6. View a student's booking history");
  console.log("7. Update a student's name");
  console.log("8. Exit");
  return ask("Select an option (1-8): ");
}

// Main application loop.
async function main() {
  let running = true;

  while (running) {
    const choice = (await showMenu()).trim();

    switch (choice) {
      case "1":
        await registerStudent();
        break;
      case "2":
        await addBooking();
        break;
      case "3":
        await confirmBookingFlow();
        break;
      case "4":
        await cancelBookingFlow();
        break;
      case "5":
        listBookings();
        break;
      case "6":
        await viewBookingHistoryFlow();
        break;
      case "7":
        await updateStudentFlow();
        break;
      case "8":
        running = false;
        console.log("\nGoodbye!");
        break;
      default:
        console.log("\nError: Please choose a valid option (1-8).");
    }
  }

  rl.close();
}

// Run the program, catching any unexpected error so it never crashes silently.
main().catch((err) => {
  console.log("\nAn unexpected error occurred: " + err.message);
  rl.close();
});
