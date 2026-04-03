const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;

  if (!firstName || typeof firstName !== "string") {
    throw new Error("First name is required.");
  }
  const fn = firstName.trim();
  if (fn.length < 4) {
    throw new Error("First name must be at least 4 characters.");
  }
  if (fn.length > 50) {
    throw new Error("First name is too long.");
  }

  if (lastName != null && typeof lastName === "string" && lastName.length > 50) {
    throw new Error("Last name is too long.");
  }

  if (!emailId || typeof emailId !== "string") {
    throw new Error("Email is required.");
  }
  const email = emailId.trim().toLowerCase();
  if (!validator.isEmail(email)) {
    throw new Error("Invalid email address.");
  }

  if (!password || typeof password !== "string") {
    throw new Error("Password is required.");
  }
  if (!validator.isStrongPassword(password)) {
    throw new Error(
      "Use a stronger password: at least 8 characters with uppercase, lowercase, number, and symbol."
    );
  }

  req.body.firstName = fn;
  req.body.lastName =
    lastName && typeof lastName === "string" ? lastName.trim() : lastName;
  req.body.emailId = email;
};

const validateEditprofileData = (req) => {
  const allowedEditFields = [
    "firstName",
    "lastName",
    "age",
    "gender",
    "photoUrl",
    "skills",
    "about",
  ];

  if (!req.body || Object.keys(req.body).length === 0) {
    console.log("Request body is empty or invalid");
    return false;
  }
  const isEditAllowed = Object.keys(req.body).every((field) =>
    allowedEditFields.includes(field)
  );
  console.log(isEditAllowed);
  return isEditAllowed;
};

module.exports = { validateSignUpData, validateEditprofileData };
