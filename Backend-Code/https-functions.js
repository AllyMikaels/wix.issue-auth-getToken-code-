import { google } from 'googleapis';
import { getSecret } from 'wix-secrets-backend';
import crypto from 'crypto'

export async function getAuthUrl() {
 
 const googleClientSecret = await getSecret('Client1');
 
 const googleConfig = {
  clientId: '967944416678-njio8l8bd2jpf88rj3a9g6balvjji150.apps.googleusercontent.com',
  clientSecret: googleClientSecret,
  redirect: 'https://www.gbccs.org/_functions/getAuth'
 };

 const authConnection = new google.auth.OAuth2(
  googleConfig.clientId,
  googleConfig.clientSecret,
  googleConfig.redirect
 );

 const scope = [
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile',
 ];
  
  const state = crypto.randomBytes(16).toString('hex')

 const authUrl = authConnection.generateAuthUrl({
  access_type: 'offline', 
  prompt: 'consent',
  scope: scope,
  state: state
 });

 return {state,authUrl};
}

console.log
