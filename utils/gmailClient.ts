// utils/gmailClient.ts

import fs from "fs";
import { google } from "googleapis";

function getAuth() {
  const credentials = JSON.parse(
    fs.readFileSync("auth/credentials.json", "utf8")
  );

  const token = JSON.parse(
    fs.readFileSync("auth/token.json", "utf8")
  );

  const auth = new google.auth.OAuth2(
    credentials.installed.client_id,
    credentials.installed.client_secret,
    credentials.installed.redirect_uris[0]
  );

  auth.setCredentials(token);
  return auth;
}

export async function getLatestEventbriteEmail() {
  const gmail = google.gmail({
    version: "v1",
    auth: getAuth(),
  });

  const res = await gmail.users.messages.list({
    userId: "me",
    q: 'from:noreply@order.eventbrite.com newer_than:1d',
    maxResults: 1,
  });

  const messageId = res.data.messages?.[0]?.id;

  if (!messageId) {
    throw new Error("No Eventbrite email found");
  }

  return gmail.users.messages.get({
    userId: "me",
    id: messageId,
  });
}