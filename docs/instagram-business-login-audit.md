# Instagram Business Login Audit (Oct 2025)

This document reviews the repository implementation against Meta's Business Login for Instagram requirements and highlights gaps and fixes.

References:
- Business Login for Instagram: https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/business-login

## Summary

- Login flow exists in multiple variants: instagram-login-client (Instagram Login), instagram-business-client (implicit), instagram-auth (FB dialog).
- Prior approach used implicit flow (response_type=token). Business Login requires code exchange and server-side long-lived token exchange.
- Added serverless function `api/instagram-token-exchange.js` (Vercel) to handle secure token exchange and long-lived token.
- Frontend updated to call `/api/instagram-token-exchange` and prefer long-lived token when available.

## Requirements vs Implementation

1) Authorization URL and scopes
- Docs require new scope names: instagram_business_basic, instagram_business_content_publish, instagram_business_manage_messages, instagram_business_manage_comments.
- Repo uses new scopes in places. Ensure any usage of deprecated `business_*` scopes is removed.

2) Code exchange for short-lived token (server-side)
- Docs: POST to https://api.instagram.com/oauth/access_token with client_secret.
- Implemented in `api/instagram-token-exchange.js`.

3) Exchange short-lived -> long-lived token (server-side only)
- Docs: GET https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=...&access_token=...
- Implemented in serverless function; returned to client.

4) Refresh long-lived token every ~60 days
- Not implemented. Add a scheduled job or user-triggered refresh calling https://graph.instagram.com/refresh_access_token.

5) Instagram Professional Account + FB Page linkage
- `instagram-business-client.js` attempts Page -> IG mapping using graph.facebook.com. This requires FB Login token (not IG Login). Clarify which login is in use per flow.

6) Webhooks
- Docs recommend webhooks. Not implemented. Optional for MVP.

7) Storage and security
- Access tokens stored in Firestore via `firebaseDb.saveInstagramAccount`. Ensure tokens are encrypted at rest or access-limited and avoid logging tokens.

## Action Items

- Prefer a single login flow. For Business Login, drive users through Authorization Code flow and `/api/instagram-token-exchange`.
- Update `InstagramConnectPage` to request appropriate scopes depending on features; for read-only insights, `instagram_business_basic` is sufficient; messages/comments/publish require app review.
- Add environment variables to Vercel Project Settings (Serverless):
  - IG_APP_ID
  - IG_APP_SECRET
  - IG_REDIRECT_URI (must exactly match configured redirect)
- Implement token refresh endpoint `api/instagram-token-refresh.js` (future work).
- For insights data, prefer `instagram-graph.js` via graph.facebook.com using the IG user id tied to a Page. Add endpoint to resolve Page->IG mapping using FB token when Business Login with FB is used.

## Quality Gates

- Build: untouched. Run `npm run build` to verify.
- Lint: run `npm run lint`.

## Notes

- Remove or gate any implicit flow code paths. Implicit flow is not recommended and may not be supported for required scopes.
- Make sure to update App Dashboard with redirect URI and ensure Advanced Access if serving accounts you do not own.
