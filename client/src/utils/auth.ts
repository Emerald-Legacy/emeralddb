const AUTH_TOKEN = '5RDB_Token'

export function setToken(token: string): void {
  window.localStorage.setItem(AUTH_TOKEN, token)
}

export function unsetToken(): void {
  for (let i = 0; i < window.localStorage.length; i++) {
    let key = window.localStorage.key(i)
    if (key) {
      window.localStorage.removeItem(key)
    }
  }
}

export function getToken(): string | null {
  return window.localStorage.getItem(AUTH_TOKEN)
}

export function hasAuth0Token(): boolean {
  for (let i = 0; i < window.localStorage.length; i++) {
    if (window.localStorage.key(i)?.includes("auth0")) {
      return true
    }
  }
  return false
}
