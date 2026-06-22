import { getLatestEventbriteEmail } from "./gmailClient";

const OTP_REGEX = /\b\d{6}\b/;

function decodeBody(data: string) {
  return Buffer.from(data, "base64").toString("utf8");
}

function extractBody(payload: any): string {
  // Case 1: plain body
  if (payload?.body?.data) {
    return payload.body.data;
  }

  // Case 2: multipart email (most common)
  if (payload?.parts?.length) {
    for (const part of payload.parts) {
      if (part?.body?.data) {
        return part.body.data;
      }
    }
  }

  return "";
}

export async function waitForEventbriteOtp(timeout = 60000) {
  const start = Date.now();

  while (Date.now() - start < timeout) {
    try {
      const email = await getLatestEventbriteEmail();

      const bodyData = extractBody(email.data.payload);

      if (!bodyData) {
        throw new Error("No email body found");
      }

      const decoded = decodeBody(bodyData);

      const match = decoded.match(OTP_REGEX);

      if (match) {
        return match[0];
      }

    } catch (err) {
      // ignore and retry
    }

    await new Promise((r) => setTimeout(r, 5000));
  }

  throw new Error("OTP not received in time");
}