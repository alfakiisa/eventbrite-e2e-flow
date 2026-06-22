import fs from 'fs';
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

const code = '4/0AdkVLPwoqNUgwf7gKk2IdJxjinAYsj6d0qa58s-6gmyoo5Moo8BVZ_otM7mu1Aex8bF4dg&scope=https://www.googleapis.com/auth/gmail.readonly';

async function run() {
  const { tokens } =
    await oauth2Client.getToken(code);

  fs.writeFileSync(
    'token.json',
    JSON.stringify(tokens)
  );

  console.log('Token saved');
}

run();