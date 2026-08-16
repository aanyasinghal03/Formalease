// Maps Firebase auth error codes to friendly, human copy.
// Never shows raw Firebase error strings to the user.
export function friendlyAuthError(error) {
  const code = error?.code || ''

  const messages = {
    'auth/invalid-email': "That email address doesn't look right. Mind double-checking it?",
    'auth/user-not-found': "We couldn't find an account with that email. Want to sign up instead?",
    'auth/wrong-password': "That password doesn't match. Give it another try.",
    'auth/invalid-credential': "Your email or password doesn't match our records. Give it another try.",
    'auth/too-many-requests': "Too many attempts. Please wait a moment before trying again.",
    'auth/network-request-failed': "We couldn't reach the server. Check your connection and try again.",
    'auth/email-already-in-use': "An account with this email already exists. Try logging in instead.",
    'auth/weak-password': "Choose a stronger password — at least 6 characters.",
    'auth/missing-password': "Don't forget to add a password.",
    'auth/user-disabled': "This account has been disabled. Contact support if you think that's a mistake.",
  }

  return messages[code] || "Something went wrong on our end. Please try again in a moment."
}
