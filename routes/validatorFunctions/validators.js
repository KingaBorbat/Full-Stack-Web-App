// Form input validators

// year validation: check if it's given and if it's between 1970 and 2024
export function validateYear(year) {
  const typeYear = typeof year;
  if (typeYear === 'string') {
    if (year.trim() === '') {
      return { valid: false, message: 'Year field cannot remain empty!' };
    }
    const numYear = parseInt(year, 10);
    if (year.replace(/[0-9]/gi, '').length > 0 || numYear < 1970 || numYear > 2024) {
      return {
        valid: false,
        message: 'Year must be a number between 1970 and 2024!',
      };
    }
  } else if (year instanceof Number) {
    if (year == null) {
      return { valid: false, message: 'Year field cannot remain empty!' };
    }

    if (year < 1970 || year > 2024) {
      return {
        valid: false,
        message: 'Year must be a number between 1970 and 2024!',
      };
    }
  }
  return { valid: true };
}

// title validation: check if it's given and if it's at least 3 characters long
export function validateTitle(title) {
  if (title.trim() === '') {
    return { valid: false, message: 'Title field cannot remain empty!' };
  }
  if (title.length < 3) {
    return {
      valid: false,
      message: 'Title name cannot be shorter than 3  characters!',
    };
  }
  return { valid: true };
}

// description validation: check if it's given and if it's at least 50 characters long
export function validateDescription(description) {
  if (description.trim() === '') {
    return { valid: false, message: 'Description field cannot remain empty!' };
  }
  if (description.length < 50) {
    return {
      valid: false,
      message: 'Description must be at least 50 characters!!',
    };
  }
  return { valid: true };
}

// genre validation: checks if it's given and if it's at least 3 characters long
export function validateGenre(genre) {
  if (genre.trim() === '') {
    return { valid: false, message: 'Genre field cannot remain empty!!' };
  }
  if (genre.length < 3) {
    return {
      valid: false,
      message: 'Genre name cannot be shorter than 3  characters!',
    };
  }
  return { valid: true };
}

// cover image validation: check if there was an image uploaded
export function validateCoverPhoto(photo) {
  if (!photo || photo.size === 0) {
    return { valid: false, message: 'You must upload a cover photo!' };
  }
  return { valid: true };
}

// validation for search inputs, if they're given
export function validateFilters(title, genre, minYear, maxYear) {
  console.log('Validating filters');
  if (title) {
    const titleValidation = validateTitle(title);
    if (!titleValidation.valid) {
      return { valid: false, message: titleValidation.message };
    }
  }
  if (genre) {
    const genreValidation = validateGenre(genre);
    if (!genreValidation.valid) {
      return { valid: false, message: genreValidation.message };
    }
  }
  if (minYear) {
    const minyearValidation = validateYear(minYear);
    if (!minyearValidation.valid) {
      return { valid: false, message: minyearValidation.message };
    }
  }
  if (maxYear) {
    const maxyearValidation = validateYear(maxYear);
    if (!maxyearValidation.valid) {
      return { valid: false, message: maxyearValidation.message };
    }
  }
  return { valid: true };
}

// validation for new movie inputs: returns false and a message if there's an invalid input
export function validateInputs(title, description, genre, year, coverPhoto) {
  console.log('Validate inputs.');
  const titleValidation = validateTitle(title);
  const descriptionValidation = validateDescription(description);
  const genreValidation = validateGenre(genre);
  const yearValidation = validateYear(year);
  const photoValidation = validateCoverPhoto(coverPhoto);
  if (!titleValidation.valid) {
    return { valid: false, message: titleValidation.message };
  }
  if (!descriptionValidation.valid) {
    return { valid: false, message: descriptionValidation.message };
  }
  if (!yearValidation.valid) {
    return { valid: false, message: yearValidation.message };
  }
  if (!genreValidation.valid) {
    return { valid: false, message: genreValidation.message };
  }

  if (!photoValidation.valid) {
    return { valid: false, message: photoValidation.message };
  }
  return { valid: true };
}

// validation for movie modification
export function validateEditInputs(title, description, genre, year) {
  console.log('Validate inputs.');
  const titleValidation = validateTitle(title);
  const descriptionValidation = validateDescription(description);
  const genreValidation = validateGenre(genre);
  const yearValidation = validateYear(year);
  if (!titleValidation.valid) {
    return { valid: false, message: titleValidation.message };
  }
  if (!descriptionValidation.valid) {
    return { valid: false, message: descriptionValidation.message };
  }
  if (!genreValidation.valid) {
    return { valid: false, message: genreValidation.message };
  }
  if (!yearValidation.valid) {
    return { valid: false, message: yearValidation.message };
  }
  return { valid: true };
}

// validation for review inputs
export function validateReviewInputs(points, review) {
  console.log('Validating review inputs');
  const typePoints = typeof points;
  if (points == null) {
    return { valid: false, message: 'Points field cannot be empty!' };
  }
  if (!typePoints == 'number' || points <= 0 || points > 10) {
    return {
      valid: false,
      message: 'Points must be a number between 1 and 10!',
    };
  }
  if (review.trim() === '') {
    return { valid: false, message: 'Review field cannot be empty!' };
  }
  if (review.length < 10) {
    return {
      valid: false,
      message: 'Review should contain at least 10 characters!',
    };
  }
  return { valid: true };
}
