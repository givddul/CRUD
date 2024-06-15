import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true }
})

const User = mongoose.model('User', userSchema)

export const userModel = {

  createUser: async (username, password) => {
    // Hash the password before saving it to the database to enhance security
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = new User({ username, password: hashedPassword })
    return user.save()
  },

  findByUsername: async (username) => {
    return User.findOne({ username }).exec()
  },

  authenticateUser: async (username, password) => {
    const user = await User.findOne({ username }).exec()
    if (user && await bcrypt.compare(password, user.password)) {
      return user
    } else {
      return null
    }
  }
}
