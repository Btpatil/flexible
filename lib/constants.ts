const isProduction = process.env.NODE_ENV === 'production'

export const serverurl = isProduction ? process.env.NEXT_PUBLIC_SERVER_URL : 'http://localhost:3000'