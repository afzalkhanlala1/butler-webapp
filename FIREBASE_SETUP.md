# Firebase Setup Guide for Butler Webapp

This guide will walk you through setting up Firebase Authentication with Google Sign-In for your Butler webapp.

## Prerequisites

- A Google account
- Node.js and npm/yarn installed
- Your React project (already set up)

## Step 1: Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter a project name (e.g., "butler-webapp")
4. Choose whether to enable Google Analytics (recommended)
5. Click "Create project"

## Step 2: Enable Authentication

1. In your Firebase project console, click on "Authentication" in the left sidebar
2. Click "Get started"
3. Go to the "Sign-in method" tab
4. Click on "Google" provider
5. Enable Google authentication by toggling the switch
6. Add your authorized domain (localhost for development, your domain for production)
7. Click "Save"

## Step 3: Get Firebase Configuration

1. In the Firebase console, click on the gear icon (⚙️) next to "Project Overview"
2. Select "Project settings"
3. Scroll down to the "Your apps" section
4. Click the web icon (</>)
5. Register your app with a nickname (e.g., "butler-webapp")
6. Copy the Firebase configuration object

## Step 4: Set Up Environment Variables

1. Create a `.env` file in your project root (if it doesn't exist)
2. Add your Firebase configuration as environment variables:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

**Important:** Replace the values with your actual Firebase configuration values.

## Step 5: Configure Google OAuth

1. In the Firebase console, go to Authentication > Sign-in method
2. Click on "Google" provider
3. Add your authorized domains:
   - For development: `localhost`
   - For production: your actual domain
4. Save the changes

## Step 6: Set Up Firestore Database (Optional but Recommended)

1. In the Firebase console, click on "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" for development
4. Select a location closest to your users
5. Click "Done"

## Step 7: Security Rules

### Firestore Security Rules

Update your Firestore security rules to allow authenticated users:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow users to read and write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Allow authenticated users to read public data
    match /public/{document=**} {
      allow read: if request.auth != null;
    }
  }
}
```

## Step 8: Testing the Setup

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:5173/login`
3. Try signing in with Google
4. Check the Firebase console to see if the user was created

## Step 9: Production Deployment

### Environment Variables for Production

When deploying to production, make sure to:

1. Set up environment variables in your hosting platform
2. Add your production domain to authorized domains in Firebase
3. Update security rules for production

### Vercel Deployment Example

If using Vercel:

1. Go to your project settings in Vercel
2. Add environment variables in the "Environment Variables" section
3. Deploy your project

### Netlify Deployment Example

If using Netlify:

1. Go to Site settings > Environment variables
2. Add your Firebase environment variables
3. Deploy your project

## Step 10: Additional Configuration

### Custom User Profile

You can extend the user profile by storing additional data in Firestore:

```typescript
// Example: Store user profile data
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const createUserProfile = async (user: User, additionalData: any) => {
  if (!user) return;

  const userRef = doc(db, 'users', user.uid);
  
  const userData = {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    createdAt: new Date(),
    ...additionalData
  };

  await setDoc(userRef, userData);
};
```

### Error Handling

The authentication functions include error handling, but you might want to add specific error messages:

```typescript
const getErrorMessage = (error: any) => {
  switch (error.code) {
    case 'auth/user-not-found':
      return 'No account found with this email address.';
    case 'auth/wrong-password':
      return 'Incorrect password.';
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters.';
    case 'auth/popup-closed-by-user':
      return 'Sign-in popup was closed before completing.';
    default:
      return 'An error occurred during authentication.';
  }
};
```

## Troubleshooting

### Common Issues

1. **"Firebase App named '[DEFAULT]' already exists"**
   - This usually happens when Firebase is initialized multiple times
   - Make sure you're only calling `initializeApp` once

2. **"auth/unauthorized-domain"**
   - Add your domain to the authorized domains in Firebase console
   - For development, make sure `localhost` is added

3. **"auth/popup-blocked"**
   - Ensure popups are not blocked by the browser
   - Check if you're running on HTTPS in production

4. **Environment variables not loading**
   - Make sure your `.env` file is in the project root
   - Restart your development server after adding environment variables
   - Verify that variable names start with `VITE_`

### Debug Mode

To enable debug mode for Firebase:

```typescript
// Add this to your firebase.ts file for development
if (import.meta.env.DEV) {
  console.log('Firebase config:', firebaseConfig);
}
```

## Security Best Practices

1. **Never commit your `.env` file to version control**
2. **Use environment variables for all sensitive configuration**
3. **Set up proper Firestore security rules**
4. **Enable only the authentication methods you need**
5. **Regularly review your Firebase project settings**
6. **Monitor authentication logs in the Firebase console**

## Next Steps

After completing this setup:

1. Test all authentication flows (sign up, sign in, sign out)
2. Implement user profile management
3. Add password reset functionality
4. Set up email verification
5. Implement role-based access control if needed
6. Add analytics and monitoring

## Support

If you encounter any issues:

1. Check the [Firebase Documentation](https://firebase.google.com/docs)
2. Review the [Firebase Authentication Guide](https://firebase.google.com/docs/auth)
3. Check the [Vite Environment Variables Guide](https://vitejs.dev/guide/env-and-mode.html)
4. Review the console for any error messages

## Files Created/Modified

- `src/pages/Login.tsx` - Login page with Google authentication
- `src/pages/Signup.tsx` - Signup page with Google authentication
- `src/lib/firebase.ts` - Firebase configuration and authentication functions
- `src/contexts/AuthContext.tsx` - Authentication context for state management
- `src/components/auth/ProtectedRoute.tsx` - Route protection component
- `src/App.tsx` - Updated with authentication routes and context
- `src/components/layout/TopNav.tsx` - Updated with user menu and sign out
- `.env` - Environment variables file (you need to create this)

Make sure to create the `.env` file with your actual Firebase configuration values before testing the authentication.
