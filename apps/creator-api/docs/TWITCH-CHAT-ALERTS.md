# Twitch chat alerts

This document describes the Twitch chat alerts feature in the Creator API.

## Overview

Twitch chat alerts are sent on donations received, as they mimic the normal overlay alerts. This is useful for when a streamer misses an alert so they can read it on chat.

## Key Features

- On an incoming donation, use bot (currently idriss_xyz Twitch account) to send a message on the streamers' chat on stream.
- If the bot is a moderator, send a link to idriss site.
- If the bot is not a moderator, send a warning to enable full bot messages once. If ignored, only the first alert message will be sent from now on.

## Data

Twitch oauth token and refresh token are stored for each creator on db now, as they are needed to fetch moderation status for the bot.

```ts
//auth.ts
const { access_token, refresh_token } = tokenResponse.data;
// ...

// store twitch oauth token
await creatorRepo.update(
  { twitchId: twitchUser.id },
  { twitchOauthToken: access_token, twitchRefreshToken: refresh_token },
);
```

A new scope for moderation was introduced on login.ts

```typescript
// auth.ts
const authUrl = `https://id.twitch.tv/oauth2/authorize?${new URLSearchParams({
  client_id: TWITCH_CLIENT_ID!,
  redirect_uri: API_CALLBACK_URI,
  response_type: 'code',
  scope: 'user:read:email user:read:follows moderation:read', // Includes moderation:read
  ...(state && { state }),
})}`;
```

And also a new endpoint

```ts
// moderator-status.ts
router.get(
  '/',
  tightCors,
  verifyToken(),
  async (req: Request, res: Response) => {
    // ...
      // Check moderation status
      const isModerator = await getModerationStatus(creatorName, authToken); // calls Twitch api
```

## Important Setup

**Authorize bot**:
Some steps should be followed on every backend deploy to give our app permission to write on chat on bot account's behalf through code:

1. Be logged in with the bot account (current idriss_xyz account).
2. Navigate to `CREATOR_API_URL/bot-auth/twitch`
3. Accept permisions on Twitch prompt window,
