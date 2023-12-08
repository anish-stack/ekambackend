const sendToken = (user, statusCode, res) => {
  try {
    const token = user.getJwtToken();

    // Set the expiration time to 4 days from now
    const expirationInHours = 4;
    const expirationTime = new Date(Date.now() + expirationInHours * 60 * 60 * 1000);

    const options = {
      expires: expirationTime,
      httpOnly: false,
      secure: true,
    };

    // Set the cookie with the token
    res.cookie('token', token, options);

    // Return the token as JSON in the response
    res.status(statusCode).json({
      success: true,
      login: user,
      token,
    });
  } catch (error) {
    // Handle any errors that might occur
    console.error('Error sending token:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
    });
  }
};

module.exports = sendToken;
