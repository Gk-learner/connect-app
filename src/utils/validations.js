const validateSignUpData = (req) => {
  const { firstName, lastName, userId, password } = req.body;

  if (!firstName || !lastName) {
    throw new error("enter user name");
  } else if (firstName.length <= 4) {
    throw new error("length is less than what is expected!");
  }
};

module.exports = { validateSignUpData };
