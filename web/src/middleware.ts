import { NextRequest, NextResponse } from 'next/server'
import validateTokenMiddleware from './utils/validateTokenMiddleware'

const baseURL = process.env.BASE_URL || 'http://localhost:3000'

export default async function middleware(req: NextRequest) {
  const cookie = req.headers.get('cookie')

  const isValidToken = await validateTokenMiddleware(cookie)

  if (!isValidToken) {
    return NextResponse.redirect(baseURL.concat('/login'))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/sala', '/sala/:path*'],
}
