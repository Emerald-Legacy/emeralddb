import dotenv from 'dotenv'

dotenv.config()

export default {
  databaseUrl: String(process.env.DATABASE_URL),
  host: String(process.env.HOST),
  jwtSecret: String(process.env.JWT_SECRET),
  nodeEnv: String(process.env.NODE_ENV).trim(),
  serverPort: parseInt(String(process.env.PORT), 10),
  dataDirectory: String(process.env.DATA_DIRECTORY),
  auth0Domain: String(process.env.AUTH0_DOMAIN),
}
