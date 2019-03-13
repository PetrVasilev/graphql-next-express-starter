import mongoose, { Schema } from "mongoose"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const ObjectId = Schema.Types.ObjectId

// Пользователь
const schema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String }
})

schema.pre("save", function(next) {
  if (!this.isModified("password")) {
    return next()
  }
  bcrypt.hash(this.password, 10, (err, hash) => {
    this.password = hash
    return next()
  })
})

schema.statics.authorize = async function(email, password) {
  const User = this
  try {
    const user = await User.findOne({ email }).exec()
    if (!user) {
      return { success: false }
    }
    const compareState = bcrypt.compareSync(password, user.password)
    if (!compareState) {
      return { success: false }
    } else {
      const token = jwt.sign(
        { _id: user._id },
        process.env.USER_SECRET || "user_secret"
      )
      return { success: true, user, token }
    }
  } catch (err) {
    console.error(err)
    return { success: false }
  }
}

schema.statics.initDB = async function () {
  const User = this
  const email = 'user@mail.ru'
  const password = 'password'
  try {
    const user = await User.findOne({ email })
    if (!user) {
      const newUser = new User({
        email,
        password
      })
      await newUser.save()
      console.log(`User '${email}' created :)`)
    }
  } catch (err) {
    console.error(err)
  }
}

export default mongoose.model("User", schema)
