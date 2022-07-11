import { response } from 'wix-http-functions';
import { google } from 'googleapis';
import { authentication } from 'wix-members-backend';
import { getSecret } from 'wix-secrets-backend';
import { fetch } from 'wix-fetch';

export async function get_getAuth(request) {

 const googleClientSecret = await getSecret('Client1');
 const googleConfig = {
  clientId: '(clientID).apps.googleusercontent.com',
  clientSecret: googleClientSecret,
  redirect: 'https://www.gbccs.org/_functions/getAuth'
 };

 const code = await request.query.code
 const state = await request.query.state

 const auth = new google.auth.OAuth2(
  googleConfig.clientSecret,
  googleConfig.clientId,
  googleConfig.redirect
 );

 const auth2 = await auth.getToken(code);
 const tokens = auth2.tokens;

 const userInfoRes = await fetch(`https://www.googleapis.com/oauth2/v2/userinfo?alt=json&access_token=${tokens.access_token}`, { "method": "get" })

 if (!userInfoRes.ok) {
  console.log("cound not get user info using access token")
 }

 const userInfo = (await userInfoRes.json())
 const useremail = userInfo.email
 const profilePicture = userInfo.picture

 const sessiontoken = await authentication.generateSessionToken(useremail);

 return response({
  status: 302,
  headers: { 'Location': `https://www.gbccs.org/signed-in?sessiontoken=${sessiontoken}&responseState=${state}&profilepic=${profilePicture}` }
 });
}

console.log
