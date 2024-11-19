// https://script.google.com/a/macros/kingandking.com/s/AKfycbxbJFfnFSAwbcSiK5KlV7xXnb-0cMi4BBUrh6N79UQ/dev?action=getConfig
// https://script.google.com/a/macros/kingandking.com/s/AKfycbxbJFfnFSAwbcSiK5KlV7xXnb-0cMi4BBUrh6N79UQ/dev?action=reset
// https://script.google.com/a/macros/kingandking.com/s/AKfycbxbJFfnFSAwbcSiK5KlV7xXnb-0cMi4BBUrh6N79UQ/dev?action=getScriptProperties
// https://script.google.com/a/macros/kingandking.com/s/AKfycbxbJFfnFSAwbcSiK5KlV7xXnb-0cMi4BBUrh6N79UQ/dev?action=getUserProperties

// https://script.google.com/a/macros/kingandking.com/s/AKfycbxbJFfnFSAwbcSiK5KlV7xXnb-0cMi4BBUrh6N79UQ/dev?action=getRedirectUrl
// https://script.google.com/a/macros/kingandking.com/s/AKfycbxbJFfnFSAwbcSiK5KlV7xXnb-0cMi4BBUrh6N79UQ/dev?action=getAuthorizationUrl&userId=cking
// https://script.google.com/a/macros/kingandking.com/s/AKfycbxbJFfnFSAwbcSiK5KlV7xXnb-0cMi4BBUrh6N79UQ/dev?action=getAccessToken&userId=cking

// https://script.google.com/macros/d/11eQ43bne6Ud_ItzZBRV6yC3n1uJW1JZg1ictmC6U2x4eM4xkpqcZlvYK/usercallback

REQUIRED = WebAppLibrary.REQUIRED
CONFIG = WebAppLibrary.getConfig()

// doGet thunk
function doGet(e) {
  return WebAppLibrary.doGet.call(this, e)
}

// Initialize the OAuth2 service with user-specific storage
function getOAuthService(userId) {
  return OAuth2.createService(userId)
    .setAuthorizationBaseUrl(CONFIG.authorizationBaseUrl)
    .setTokenUrl(CONFIG.tokenUrl)
    .setClientId(CONFIG.clientId)
    .setClientSecret(CONFIG.clientSecret)
    .setRedirectUri(OAuth2.getRedirectUri())
    .setCallbackFunction('handleCallbackThunk')
    .setScope('https://www.googleapis.com/auth/drive')
    .setParam('access_type', 'offline')
    .setParam('prompt', 'consent')
    .setLock(LockService.getScriptLock())
    .setPropertyStore(PropertiesService.getScriptProperties())
}

// OAuth callback thunk; Add action query parameter to target callback logic
function handleCallbackThunk(e) {
  e.parameter.action = 'callback'
  return doGet(e)
}

// Get redirect url to add to OAuth provider as an authorizied redirect URL
function handleGetRedirectUrl() {
  return OAuth2.getRedirectUri();
}

// Get url to display to user to initiate login flow
function handleGetAuthorizationUrl(e) {
  let { userId } = e.parameter
  return getOAuthService(userId).getAuthorizationUrl({ userId })
}
handleGetAuthorizationUrl.requiredParams = {
  userId: REQUIRED,
}

// Handle OAuth provider callback 
function handleCallback(e) {
  const { userId, error } = e.parameter

  const authorized = getOAuthService(userId).handleCallback(e)
  if (!authorized) {
    if (error)
      return `Authorization failed with error: ${error}`
    return `Authorization failed.`
  }

  return `Authorization Success! You can close this tab. (${userId})`
}
handleCallback.requiredParams = {
  userId: REQUIRED
}

function handleGetAccessToken(e) {
  let { userId } = e.parameter
  return getOAuthService(userId).getAccessToken()
}
handleGetAccessToken.requiredParams = {
  userId: REQUIRED,
}
