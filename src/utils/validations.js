const validateSignUpData = (req) => {
  const { firstName, lastName, userId, password, gender } = req.body;

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
    "age",
    "gender",
    "photoUrl",
    "skills",
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
