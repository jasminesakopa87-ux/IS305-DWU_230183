/*
  Program: Dining Meal Booking Feature
  Student Name: Jasmine Sakopa
  Student ID: 230183
  Date: 24 July 2026
  Updated: 10 August 2026 (Lab 2 Part 2 - refactored to use a Student object)
  Description: A JavaScript program demonstrating classes,
  objects, constructors, private fields and methods.
*/

// MealBooking.js
// IS305 - Assessment Task 2 (Lab 2), Part 2
// Represents a single meal booking made by a student.
// Credit-level change: MealBooking no longer stores student ID/name
// directly - it stores a reference to a Student object instead.

const Student = require("./Student");

// Meal prices (Kina) - used by calculateTotal()
const MEAL_PRICES = {
  Breakfast: 10.00,
  Lunch: 15.00,
  Dinner: 20.00,
};

class MealBooking {
  // ---- Private fields ----
  #student;
  #mealDate;
  #mealType;
  #quantity;
  #dietaryNote;
  #bookingStatus;

  // ---- Constructor ----
  constructor({ student, mealDate, mealType, quantity, dietaryNote }) {
    MealBooking.validate({ student, mealDate, mealType, quantity });

    this.#student = student;
    this.#mealDate = mealDate.toString().trim();
    this.#mealType = mealType.toString().trim();
    this.#quantity = Number(quantity);
    this.#dietaryNote = dietaryNote && dietaryNote.toString().trim() !== "" ? dietaryNote.toString().trim() : "None";
    this.#bookingStatus = "Pending";
  }

  // ---- Static validation method ----
  static validate({ student, mealDate, mealType, quantity }) {
    const errors = [];

    // Credit-level requirement: verify a valid Student object was provided.
    if (!(student instanceof Student) || !student.studentId || !student.firstName || !student.lastName) {
      errors.push("A valid Student object (with ID, first name and last name) is required.");
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
  get student() { return this.#student; }
  // Convenience passthroughs so callers don't need to reach into #student
  get studentId() { return this.#student.studentId; }
  get studentName() { return this.#student.getFullName(); }
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
    this.#dietaryNote = value && value.toString().trim() !== "" ? value.toString().trim() : "None";
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

  // ---- Summary method (uses the connected Student object) ----
  getSummary() {
    return (
      "========================================\n" +
      "             BOOKING RECEIPT\n" +
      "========================================\n" +
      `Student: ${this.#student.getFullName()} (${this.#student.studentId})\n` +
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
