import jwt from "jsonwebtoken"

export const CheckUserLogged = authorization => {
  if (!authorization) {
    return null
  }
  return jwt.verify(authorization, process.env.USER_SECRET, (err, decoded) => {
    if (err) {
      return null
    }
    return decoded
  })
}
