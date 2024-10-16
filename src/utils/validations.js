const validateSignUpData = (req) => {
  const { firstName, lastName, userId, password } = req.body;

  if (!firstName || !lastName) {
    throw new error("enter user name");
  } else if (firstName.length <= 4) {
    throw new error("length is less than what is expected!");
  }
};

const validateEditprofileData = (req) => {
  const allowedEditFields = [
    "firstName",
    "lastName",
    "emailId",
    // "photoUrl",
    "about",
    // "skills",
  ];

  const isEditAllowed = Object.keys(req.body).every((field) =>
    allowedEditFields.includes(field)
  );

  return isEditAllowed;
};

module.exports = { validateSignUpData,validateEditprofileData };
