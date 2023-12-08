const axios = require('axios');
const isntamojo = require('instamojo-nodejs')



const instamojoApiUrl = 'https://api.instamojo.com/oauth2/token/';
const instamojoPaymentRequestUrl = 'https://api.instamojo.com/v2/payment_requests/';

exports.genToken = async (req, res) => {
  try {
    const response = await axios.post(
      instamojoApiUrl,
      {
        client_id: "GDC4xGOtIamRHDnUyky7dsoky26JccJoNyETjHj4",
        client_secret: "LNXvCXss3kzhjY18RNZ2Mzaw2lvDwyjaIBZGcEqZCrVrgfKho9TxHu0v09vw1FK0igPrm0XuaGVp859jEsv3nU95yspu1p9TsK67RUgcJvbnVKJW1JPwg6NjzBysRipH",
        grant_type: 'client_credentials',
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    // Extract the access token from the response
    const accessToken = response.data.access_token;

    // Use the access token for making authorized API requests
    console.log('Instamojo OAuth token:', accessToken);

    // Call createPayment function with the obtained token
    await createPayment(req, res, accessToken);
  } catch (error) {
    console.error('Error generating Instamojo OAuth token:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};

async function createPayment(req, res, token) {
  try {
    // Retrieve the OAuth token from the request headers
    const accessToken = token;

    // Create a payment request
    const paymentRequestData = {
      amount: 100, // Replace with the actual amount
      purpose: 'Payment for your order', // Replace with the purpose of the payment
      buyer_name: 'John Doe', // Replace with the name of the payer
      email: 'john.doe@example.com', // Replace with the email of the payer
      phone: '1234567890', // Replace with the phone number of the payer
    };

    // Make a POST request to create the payment request
    const paymentResponse = await axios.post(instamojoPaymentRequestUrl, paymentRequestData, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    console.log('Instamojo Payment Response:', paymentResponse.data);

    return res.status(200).json({
      success: true,
      paymentRequest: paymentResponse.data,
    });
  } catch (error) {
    console.error('Error creating Instamojo payment request:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
}
