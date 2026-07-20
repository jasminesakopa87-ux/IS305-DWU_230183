/*
  Program: Dining Meal Booking Feature
  Student Name: Jasmine SAKOPA
  Student ID: 230183
  Date: 17 July 2026
  Description: A JavaScript program demonstrating classes,
  objects, constructors, private fields and methods.
*/

// MealBooking.js
export default class MealBooking {
  // Static price map (used for calculations and validation)
  static MEAL_PRICES = {
    Breakfast: 10.00,
    Lunch: 15.00,
    Dinner: 20.00
  };

  // Private fields
  #studentId;
  #studentName;
  #mealDate;
  #mealType;
  #quantity;
  #dietaryNote;
  #bookingStatus;

  // Constructor using an object parameter
  constructor({ studentId, studentName, mealDate, mealType, quantity, dietaryNote = '' }) {
    this.#studentId = studentId;
    this.#studentName = studentName;
    this.#mealDate = mealDate;
    this.#mealType = mealType;
    this.#quantity = quantity;
    this.#dietaryNote = dietaryNote;
    this.#bookingStatus = 'Pending';
  }

  // ---------- Getters ----------
  get studentId() { return this.#studentId; }
  get studentName() { return this.#studentName; }
  get mealDate() { return this.#mealDate; }
  get mealType() { return this.#mealType; }
  get quantity() { return this.#quantity; }
  get dietaryNote() { return this.#dietaryNote; }
  get bookingStatus() { return this.#bookingStatus; }

  // ---------- Setters with validation ----------
  set studentName(newName) {
    if (newName && newName.trim().length > 0) this.#studentName = newName.trim();
  }

  set mealDate(newDate) {
    if (newDate) this.#mealDate = newDate;
  }

  set mealType(newType) {
    if (Object.keys(MealBooking.MEAL_PRICES).includes(newType)) {
      this.#mealType = newType;
    }
  }

  set quantity(newQty) {
    if (Number.isInteger(newQty) && newQty > 0) this.#quantity = newQty;
  }

  set dietaryNote(note) {
    this.#dietaryNote = note || '';
  }

  set bookingStatus(status) {
    const valid = ['Pending', 'Confirmed', 'Cancelled'];
    if (valid.includes(status)) this.#bookingStatus = status;
  }

  // ---------- Business Methods ----------
  calculateTotal() {
    const price = MealBooking.MEAL_PRICES[this.#mealType] || 0;
    return price * this.#quantity;
  }

  getSummary() {
    const total = this.calculateTotal().toFixed(2);
    return `
Booking Summary
----------------
Student ID   : ${this.#studentId}
Student Name : ${this.#studentName}
Meal Date    : ${this.#mealDate}
Meal Type    : ${this.#mealType}
Quantity     : ${this.#quantity}
Dietary Note : ${this.#dietaryNote || 'None'}
Status       : ${this.#bookingStatus}
Total Cost   : K${total}
`;
  }
}