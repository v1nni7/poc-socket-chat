export default async function validateTokenMiddleware(cookie: string | null) {
  try {
    const response = await fetch('http://localhost:5000/auth/validate-token', {
      method: 'GET',
      credentials: 'include',
      headers: {
        Cookie: cookie || '',
      },
    })

    if (!response.ok) {
      return false
    }

    return true
  } catch (error) {
    return false
  }
}
