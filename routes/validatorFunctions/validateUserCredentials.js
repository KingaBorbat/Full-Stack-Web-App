// password validation
export function validatePassword(password) {
  // check length
  if (password.length < 8) {
    return false;
  }

  // check if password contains at least a number, an uppercase and a lowercase letter, and a special character
  if (!/[0-9]/.test(password)) {
    return false;
  }
  if (!/[A-Z]/.test(password)) {
    return false;
  }
  if (!/[a-z]/.test(password)) {
    return false;
  }
  if (!/[!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]/.test(password)) {
    return false;
  }
  return true;
}

// username validation
export function validateUsername(username) {
  // check the length
  if (username.length < 5) {
    return false;
  }

  // check if username contains at least one number, an uppercase and a lowercase letter, and doesn't contain space
  if (!/[0-9]/.test(username)) {
    return false;
  }
  if (!/[A-Z]/.test(username)) {
    return false;
  }
  if (!/[a-z]/.test(username)) {
    return false;
  }
  if (/\s/.test(username)) {
    return false;
  }
  return true;
}
