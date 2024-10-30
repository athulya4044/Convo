export default function stripSpecialCharacters(email) {
    // Using regex to match the part before '@' and remove special characters
    const username = email.split("@")[0]; // Get the part before '@'
    const strippedUsername = username.replace(/[^a-zA-Z0-9]/g, ""); // Retain only alphabets & numbers
  
    return strippedUsername;
  }
  