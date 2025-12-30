import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const {
  PAYPAL_CLIENT_ID,
  PAYPAL_CLIENT_SECRET,
  PAYPAL_BASE_URL = "https://api-m.sandbox.paypal.com",
  PAYPAL_RETURN_URL,
  PAYPAL_CANCEL_URL,
} = process.env;

// =========================
// Get PayPal Access Token
// =========================
const getAccessToken = async (): Promise<string> => {
  if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
    throw new Error("PayPal credentials are missing");
  }

  const auth = Buffer.from(
    `${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`
  ).toString("base64");

  const response = await axios.post(
    `${PAYPAL_BASE_URL}/v1/oauth2/token`,
    "grant_type=client_credentials",
    {
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  return response.data.access_token;
};

// =========================
// Create PayPal Order
// =========================
interface CreatePayPalOrderParams {
  amount: number;
  description?: string;
}

export const createPayPalOrder = async ({
  amount,
  description,
}: CreatePayPalOrderParams) => {
  const accessToken = await getAccessToken();

  const response = await axios.post(
    `${PAYPAL_BASE_URL}/v2/checkout/orders`,
    {
      intent: "CAPTURE",
      purchase_units: [
        {
          description,
          amount: {
            currency_code: "USD",
            value: amount.toFixed(2),
          },
        },
      ],
      application_context: {
        return_url: PAYPAL_RETURN_URL,
        cancel_url: PAYPAL_CANCEL_URL,
        user_action: "PAY_NOW",
        shipping_preference: "NO_SHIPPING",
      },
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};

// =========================
// Capture PayPal Order
// =========================
export const capturePayPalOrder = async (orderId: string) => {
  const accessToken = await getAccessToken();

  const response = await axios.post(
    `${PAYPAL_BASE_URL}/v2/checkout/orders/${orderId}/capture`,
    {},
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};
