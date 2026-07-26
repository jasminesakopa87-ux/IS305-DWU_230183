/*
  Program: Dining Meal Booking Feature
  Student Name: Jasmine Sakopa
  Student ID: 230183
  Date: 24 July 2026
  Description: A JavaScript program demonstrating classes,
  objects, constructors, private fields and methods.
*/

// MealBooking.js
// IS305 - Assessment Task 1, Part 2
// Represents a single meal booking made by a student.

// Meal prices (Kina) - used by calculateTotal()
const MEAL_PRICES = {
  Breakfast: 10.00,
  Lunch: 15.00,
  Dinner: 20.00,
};

class MealBooking {
  // ---- Private fields ----
  #studentId;
  #studentName;
  #mealDate;
  #mealType;
  #quantity;
  #dietaryNote;
  #bookingStatus;

  // ---- Constructor ----
  constructor({ studentId, studentName, mealDate, mealType, quantity, dietaryNote }) {
    MealBooking.validate({ studentId, studentName, mealDate, mealType, quantity });

    this.#studentId = studentId.trim();
    this.#studentName = studentName.trim();
    this.#mealDate = mealDate.trim();
    this.#mealType = mealType.trim();
    this.#quantity = Number(quantity);
    this.#dietaryNote = dietaryNote && dietaryNote.trim() !== "" ? dietaryNote.trim() : "None";
    this.#bookingStatus = "Pending";
  }

  // ---- Static validation method ----
  static validate({ studentId, studentName, mealDate, mealType, quantity }) {
    const errors = [];

    if (!studentId || studentId.toString().trim() === "") {
      errors.push("Student ID is required.");
    }

    if (!studentName || studentName.toString().trim() === "") {
      errors.push("Student name is required.");
    }

    if (!mealDate || mealDate.toString().trim() === "") {
      errors.push("Meal date is required.");
    }

    const validMealTypes = Object.keys(MEAL_PRICES);
    if (!mealType || !validMealTypes.includes(mealType.toString().trim())) {
      errors.push(`Meal type must be one of: ${validMealTypes.join(", ")}.`);
    }

    const qty = Number(quantity);
    if (!Number.isInteger(qty) || qty < 1) {
      errors.push("Quantity must be a whole number of at least 1.");
    }

    if (errors.length > 0) {
      throw new Error(errors.join(" "));
    }
  }

  // ---- Getters ----
  get studentId() { return this.#studentId; }
  get studentName() { return this.#studentName; }
  get mealDate() { return this.#mealDate; }
  get mealType() { return this.#mealType; }
  get quantity() { return this.#quantity; }
  get dietaryNote() { return this.#dietaryNote; }
  get bookingStatus() { return this.#bookingStatus; }

  // ---- Setters ----
  set quantity(value) {
    const qty = Number(value);
    if (!Number.isInteger(qty) || qty < 1) {
      console.log("Error: Quantity must be a whole number of at least 1.");
      return;
    }
    this.#quantity = qty;
  }

  set dietaryNote(value) {
    this.#dietaryNote = value && value.trim() !== "" ? value.trim() : "None";
  }

  // ---- Calculation method ----
  calculateTotal() {
    const pricePerMeal = MEAL_PRICES[this.#mealType];
    if (pricePerMeal === undefined) {
      console.log("Error: Cannot calculate total, meal type is invalid.");
      return 0;
    }
    return pricePerMeal * this.#quantity;
  }

  // ---- Controlled status-change methods ----
  confirmBooking() {
    if (this.#bookingStatus !== "Pending") {
      console.log(`Error: Booking cannot be confirmed because its status is "${this.#bookingStatus}".`);
      return;
    }
    this.#bookingStatus = "Confirmed";
  }

  cancelBooking() {
    if (this.#bookingStatus === "Cancelled") {
      console.log("Error: Booking is already cancelled.");
      return;
    }
    this.#bookingStatus = "Cancelled";
  }

  // ---- Summary method ----
  getSummary() {
    return (
      "========================================\n" +
      "             BOOKING RECEIPT\n" +
      "========================================\n" +
      `Student: ${this.#studentName} (${this.#studentId})\n` +
      `Meal: ${this.#mealType} x ${this.#quantity}\n` +
      `Date: ${this.#mealDate}\n` +
      `Dietary note: ${this.#dietaryNote}\n` +
      `Status: ${this.#bookingStatus}\n` +
      `Total cost: K${this.calculateTotal().toFixed(2)}\n` +
      "========================================"
    );
  }
}

module.exports = MealBooking;