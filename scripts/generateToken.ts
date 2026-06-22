import fs from 'fs';
import readline from 'readline';
import { google } from 'googleapis';

const credentials = JSON.parse(
  fs.readFileSync('credentials.json', 'utf8')
);

const { client_secret, client_id, redirect_uris } =
  credentials.installed;

const oauth2Client = new google.auth.OAuth2(
  client_id,
  client_secret,
  redirect_uris[0]
);

const SCOPES = [
  'https://www.googleapis.com/auth/gmail.readonly'
];

const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: SCOPES
});

console.log(authUrl);