/*
  Program: Dining Meal Booking Feature
  Student Name: Jasmine SAKOPA
  Student ID: 230183
  Date: 17 July 2026
  Description: Console application that allows students to book meals,
  validates input, prevents duplicate bookings, and displays summaries.
*/

// DiningApp.js
import MealBooking from './MealBooking.js';
import readline from 'readline';

// Set up readline for async/await style prompts
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Helper to promisify readline.question
function question(prompt) {
  return new Promise(resolve => rl.question(prompt, resolve));
}

// Global array to store all bookings
const bookings = [];

// ---------- Validation Functions ----------
function isValidStudentId(id) {
  return id && id.trim().length > 0;
}

function isValidStudentName(name) {
  return name && name.trim().length > 0;
}

function isValidDate(date) {
  // Simple format check: YYYY-MM-DD
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(date)) return false;
  const d = new Date(date);
  return d instanceof Date && !isNaN(d);
}

function isValidMealType(type) {
  return Object.keys(MealBooking.MEAL_PRICES).includes(type);
}

function isValidQuantity(qty) {
  const num = Number(qty);
  return Number.isInteger(num) && num > 0;
}

// Duplicate check: same student, same meal type, same date
function isDuplicate(studentId, mealDate, mealType) {
  return bookings.some(b =>
    b.studentId === studentId &&
    b.mealDate === mealDate &&
    b.mealType === mealType
  );
}

// ---------- Main Program ----------
async function main() {
  console.log('\n=== DWU Dining Meal Booking System ===\n');

  let running = true;
  while (running) {
    console.log(`
Menu:
1. Make a booking
2. View all bookings
3. Exit
`);
    const choice = await question('Enter your choice (1-3): ');
    
    switch (choice.trim()) {
      case '1':
        await makeBooking();
        break;
      case '2':
        viewAllBookings();
        break;
      case '3':
        running = false;
        console.log('Goodbye!');
        break;
      default:
        console.log('Invalid choice. Please enter 1, 2, or 3.');
    }
  }
  rl.close();
}

// ---------- Make a Booking ----------
async function makeBooking() {
  console.log('\n--- New Booking ---');

  // Collect and validate student ID
  let studentId;
  do {
    studentId = await question('Student ID: ');
    if (!isValidStudentId(studentId)) {
      console.log('Student ID cannot be empty.');
    }
  } while (!isValidStudentId(studentId));

  // Student name
  let studentName;
  do {
    studentName = await question('Student Name: ');
    if (!isValidStudentName(studentName)) {
      console.log('Name cannot be empty.');
    }
  } while (!isValidStudentName(studentName));

  // Meal date
  let mealDate;
  do {
    mealDate = await question('Meal Date (YYYY-MM-DD): ');
    if (!isValidDate(mealDate)) {
      console.log('Invalid date format. Please use YYYY-MM-DD.');
    }
  } while (!isValidDate(mealDate));

  // Meal type
  let mealType;
  const types = Object.keys(MealBooking.MEAL_PRICES).join(', ');
  do {
    mealType = await question(`Meal Type (${types}): `);
    // Capitalise first letter to match keys
    const formatted = mealType.charAt(0).toUpperCase() + mealType.slice(1).toLowerCase();
    if (isValidMealType(formatted)) {
      mealType = formatted; // assign correct case
      break;
    }
    console.log(`Invalid meal type. Choose from: ${types}`);
  } while (true);

  // Quantity
  let quantity;
  do {
    const qtyStr = await question('Quantity (number): ');
    if (isValidQuantity(qtyStr)) {
      quantity = parseInt(qtyStr, 10);
      break;
    }
    console.log('Quantity must be a positive integer.');
  } while (true);

  // Dietary note (optional)
  const dietaryNote = await question('Dietary Note (optional, press Enter to skip): ');

  // Duplicate check
  if (isDuplicate(studentId, mealDate, mealType)) {
    console.log('\n❌ Duplicate booking detected!');
    console.log(`You already have a booking for ${mealType} on ${mealDate}.`);
    return;
  }

  // Create booking object
  const booking = new MealBooking({
    studentId,
    studentName,
    mealDate,
    mealType,
    quantity,
    dietaryNote: dietaryNote || ''
  });

  // Save to array
  bookings.push(booking);
  console.log('\n✅ Booking confirmed!');
  console.log(booking.getSummary());
}

// ---------- View All Bookings ----------
function viewAllBookings() {
  if (bookings.length === 0) {
    console.log('\nNo bookings yet.');
    return;
  }
  console.log(`\n--- All Bookings (${bookings.length}) ---`);
  bookings.forEach((b, index) => {
    console.log(`\n#${index + 1}`);
    console.log(b.getSummary());
  });
}

// Start the application
main().catch(err => {
  console.error('Unexpected error:', err);
  rl.close();
});