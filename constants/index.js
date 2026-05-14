const CONSTANTS = {
  API: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8800/api/v1',
  TOKEN_KEY: process.env.NEXT_PUBLIC_TOKEN_KEY || 'user_session_token'
}

export default CONSTANTS
