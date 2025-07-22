# How to Remove Early Access Password Authentication

This guide outlines the steps to remove the password-based early access gate from the application. This should be done when the application is ready for public release.

## 1. Modify Backend API (`creator-api`)

The first step is to remove the authentication checks from the backend.

### Edit `apps/creator-api/routes/auth.ts`

Remove the token validation from the `/twitch` endpoint and delete the `/early-access` endpoint entirely.

```diff
--- a/apps/creator-api/routes/auth.ts
+++ b/apps/creator-api/routes/auth.ts
@@ -11,19 +11,6 @@
 
 // Step 1: Redirect user to Twitch for authorization
 router.get('/twitch', (req, res) => {
-  const { token } = req.query;
-
-  if (!token) {
-    res.status(401).send('Unauthorized: Missing early access token.');
-    return;
-  }
-
-  try {
-    jwt.verify(token as string, process.env.EARLY_ACCESS_JWT_SECRET!);
-  } catch (error) {
-    res.status(401).send('Unauthorized: Invalid early access token.');
-    return;
-  }
-
   const authUrl = `https://id.twitch.tv/oauth2/authorize?${new URLSearchParams({
     client_id: TWITCH_CLIENT_ID!,
     redirect_uri: API_CALLBACK_URI,
@@ -94,23 +81,4 @@
   }
 });
 
-router.post('/early-access', (req: Request, res: Response) => {
-  const { password } = req.body;
-
-  if (password !== process.env.EARLY_ACCESS_PASSWORD) {
-    res.status(401).json({ message: 'Incorrect password' });
-    return;
-  }
-
-  // If password is correct, issue a short-lived JWT
-  const token = jwt.sign(
-    { authorized: true },
-    process.env.EARLY_ACCESS_JWT_SECRET!,
-    { expiresIn: '15m' }, // Token is valid for 15 minutes
-  );
-
-  res.status(200).json({ token });
-  return;
-});
-
 export default router;
```

## 2. Modify Frontend Application (`main-landing`)

Next, update the frontend to remove the password modal and related logic.

### A. Update the Authentication Context

In `apps/main-landing/src/app/creators/context/auth-context.tsx`, remove all state related to the password modal and early access token.

```diff
--- a/apps/main-landing/src/app/creators/context/auth-context.tsx
+++ b/apps/main-landing/src/app/creators/context/auth-context.tsx
@@ -9,26 +9,18 @@
   markDonationsAsSeen: () => void;
   oauthError: string | null;
   isLoginModalOpen: boolean;
-  isPasswordModalOpen: boolean;
-  earlyAccessToken: string | null;
   creator: CreatorProfileResponse | null;
   creatorLoading: boolean;
   setCreatorLoading: (loading: boolean) => void;
   setOauthError: (error: string | null) => void;
   clearOauthError: () => void;
   setIsModalOpen: (isOpen: boolean) => void;
-  setIsPasswordModalOpen: (isOpen: boolean) => void;
-  setEarlyAccessToken: (token: string | null) => void;
   setCreator: (creator: CreatorProfileResponse | null) => void;
-  handlePasswordSuccess: () => void;
 };
 
 const AuthContext = createContext<AuthContextType | undefined>(undefined);
 
 export function AuthProvider({ children }: { children: ReactNode }) {
   const [oauthError, setOauthError] = useState<string | null>(null);
-  const [isLoginModalOpen, _setIsModalOpen] = useState(false);
-  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
-  const [earlyAccessToken, setEarlyAccessToken] = useState<string | null>(null);
+  const [isLoginModalOpen, setIsModalOpen] = useState(false);
   const [creator, setCreator] = useState<CreatorProfileResponse | null>(null);
   const [creatorLoading, setCreatorLoading] = useState(true);
   const [donations, setDonations] = useState<DonationData[]>([]);
@@ -52,34 +44,20 @@
     return setOauthError(null);
   };
 
-  const setIsModalOpen = (isOpen: boolean) => {
-    if (isOpen && !earlyAccessToken) {
-      setIsPasswordModalOpen(true);
-    } else {
-      _setIsModalOpen(isOpen);
-    }
-  };
-
-  const handlePasswordSuccess = () => {
-    setIsPasswordModalOpen(false);
-    _setIsModalOpen(true);
-  };
-
   return (
     <AuthContext.Provider
       value={{
         oauthError,
         isLoginModalOpen,
-        isPasswordModalOpen,
-        earlyAccessToken,
         creator,
         creatorLoading,
         setCreatorLoading,
         setOauthError,
         clearOauthError,
         setIsModalOpen,
-        setIsPasswordModalOpen,
-        setEarlyAccessToken,
         setCreator,
-        handlePasswordSuccess,
         donations,
         addDonation,
         newDonationsCount,
```

### B. Update the Hero Section

In `apps/main-landing/src/app/creators/components/hero-section.tsx`, remove the password modal and its related logic.

```diff
--- a/apps/main-landing/src/app/creators/components/hero-section.tsx
+++ b/apps/main-landing/src/app/creators/components/hero-section.tsx
@@ -8,7 +8,6 @@
 import { useStartEarningNavigation } from '../utils';
 
 import { VideoPlayer } from './hero-section/video-player';
 import { LoginModal } from './login-modal';
-import { PasswordModal } from './password-modal';
 
 type Properties = {
   heroButtonReference?: RefObject<HTMLButtonElement>;
@@ -18,22 +17,12 @@
   const {
     isLoginModalOpen,
     setIsModalOpen,
-    isPasswordModalOpen,
-    setIsPasswordModalOpen,
-    earlyAccessToken,
-    handlePasswordSuccess,
   } = useAuth();
-  const originalHandleStartEarningClick = useStartEarningNavigation();
-
-  const handleStartEarningClick = () => {
-    void (earlyAccessToken
-      ? originalHandleStartEarningClick()
-      : setIsPasswordModalOpen(true));
-  };
+  const handleStartEarningClick = useStartEarningNavigation();
 
   return (
     <header
       className={classes(
@@ -81,7 +70,9 @@
             ref={heroButtonReference}
             aria-label="Start earning now"
             suffixIconName="IdrissArrowRight"
-            onClick={handleStartEarningClick}
+            onClick={() => {
+              void handleStartEarningClick();
+            }}
           >
             Start earning now
           </Button>
@@ -99,13 +90,6 @@
         onClose={() => {
           return setIsModalOpen(false);
         }}
       />
-      <PasswordModal
-        isOpened={isPasswordModalOpen}
-        onClose={() => {
-          return setIsPasswordModalOpen(false);
-        }}
-        onSuccess={handlePasswordSuccess}
-      />
     </header>
   );
 };
```

### C. Update the Login Modal

In `apps/main-landing/src/app/creators/components/login-modal/login-modal.tsx`, remove the logic that passes the token to the Twitch URL.

```diff
--- a/apps/main-landing/src/app/creators/components/login-modal/login-modal.tsx
+++ b/apps/main-landing/src/app/creators/components/login-modal/login-modal.tsx
@@ -9,8 +9,6 @@
 
 import { IDRISS_TOROID } from '@/assets';
 
-import { useAuth } from '../../context/auth-context';
-
 type Properties = {
   isOpened: boolean;
   onClose: () => void;
@@ -18,12 +16,9 @@
 
 export const LoginModal = ({ isOpened, onClose }: Properties) => {
-  const { earlyAccessToken } = useAuth();
-
   const handleTwitchLogin = () => {
-    if (!earlyAccessToken) return;
-    window.location.href = `${CREATOR_API_URL}/auth/twitch?token=${earlyAccessToken}`;
+    window.location.href = `${CREATOR_API_URL}/auth/twitch`;
   };
 
   return (
@@ -48,7 +43,6 @@
           aria-label="Login with Twitch"
           prefixIconName="TwitchOutlinedBold"
           onClick={handleTwitchLogin}
-          disabled={!earlyAccessToken}
         >
           Continue with Twitch
         </Button>
```

### D. Delete the Password Modal Component

Remove the password modal file completely.

```bash
rm apps/main-landing/src/app/creators/components/password-modal/password-modal.tsx
```

## 3. Remove Environment Variables

Finally, you can remove the following variables from your `creator-api` environment configuration:
*   `EARLY_ACCESS_PASSWORD`
*   `EARLY_ACCESS_JWT_SECRET`
