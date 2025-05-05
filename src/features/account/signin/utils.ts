// Clear SESSION_USER_ID in browser storage to indicate no active session
export function clearBrowserSession() {
  localStorage.removeItem('SESSION_USER_ID');
}
