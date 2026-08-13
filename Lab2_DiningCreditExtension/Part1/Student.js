/*
  Program: Dining Meal Booking Feature - Lab 2 Extension
  Student Name: Jasmine Sakopa
  Student ID: 230183
  Date: 10 August 2026
  Description: Student class demonstrating classes, objects,
  constructors, private fields, getters/setters and encapsulation.
*/

// Student.js
// IS305 - Assessment Task 2 (Lab 2), Part 1
// Represents a student's identity, independent of any booking.

class Student {
  // ---- Private fields ----
  #studentId;
  #firstName;
  #lastName;

  // ---- Constructor ----
  constructor(studentId, firstName, lastName) {
    this.#studentId = "";
    this.#firstName = "";
    this.#lastName = "";

    // Route through the setters so validation runs on creation too.
    this.studentId = studentId;
    this.firstName = firstName;
    this.lastName = lastName;
  }

  // ---- Getters ----
  get studentId() { return this.#studentId; }
  get firstName() { return this.#firstName; }
  get lastName() { return this.#lastName; }

  // ---- Setters with validation ----
  set studentId(newId) {
    if (newId && newId.toString().trim().length > 0) {
      this.#studentId = newId.toString().trim();
    } else {
      console.log("Update rejected: Student ID cannot be empty.");
    }
  }

  set firstName(newFirstName) {
    if (newFirstName && newFirstName.toString().trim().length > 0) {
      this.#firstName = newFirstName.toString().trim();
    } else {
      console.log("Update rejected: First name cannot be empty.");
    }
  }

  set lastName(newLastName) {
    if (newLastName && newLastName.toString().trim().length > 0) {
      this.#lastName = newLastName.toString().trim();
    } else {
      console.log("Update rejected: Last name cannot be empty.");
    }
  }

  // ---- Business methods ----
  getFullName() {
    return `${this.#firstName} ${this.#lastName}`;
  }

  displayInfo() {
    const output =
      "========================================\n" +
      "             STUDENT DETAILS\n" +
      "========================================\n" +
      `Student ID: ${this.#studentId}\n` +
      `Student Name: ${this.getFullName()}\n` +
      "========================================";
    console.log(output);
    return output;
  }
}

module.exports = Student;
