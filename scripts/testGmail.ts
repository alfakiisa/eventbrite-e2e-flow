import fs from 'fs';
import { google } from 'googleapis';

async function run() {

  const credentials = JSON.parse(
    fs.readFileSync('credentials.json', 'utf8')
  );

  const token = JSON.parse(
    fs.readFileSync('token.json', 'utf8')
  );

  const auth = new google.auth.OAuth2(
    credentials.installed.client_id,
    credentials.installed.client_secret,
    credentials.installed.redirect_uris[0]
  );

  auth.setCredentials(token);

  const gmail = google.gmail({
    version: 'v1',
    auth
  });

  const messages =
    await gmail.users.messages.list({
      userId: 'me',
      maxResults: 5
    });

  console.log(messages.data.messages);
}

run();