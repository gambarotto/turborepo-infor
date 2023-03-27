export default {
  secret: process.env.JWT_SECRET || '',
  expiresIn: '30d'
}