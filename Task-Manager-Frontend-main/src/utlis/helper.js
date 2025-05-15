export const catchError = (error) => {
  const { response } = error;

  if (response) {
    const { status, data } = response;
    // Check if the response contains HTML (e.g., returned as a string containing HTML tags)
    if (typeof data === "string" && data.trim().startsWith("<!DOCTYPE html>")) {
      return {
        message: `Unexpected HTML response received. Status: ${status}.`,
        success: false,
      };
    }

    // If response data exists and is an object, return it
    if (data) {
      return {
        message: data.message || "An error occurred.",
        success: false,
        data,
      };
    }

    // Default case for a response without data
    return {
      message: `Request failed with status code ${status}.`,
      success: false,
    };
  }

  // Handle errors without a response (e.g., network errors)
  return {
    message: error.message || "An unknown error occurred.",
    success: false,
  };
};


export const formatDate = (isoDate) => {
  const date = new Date(isoDate);

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const year = date.getFullYear();

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
};


