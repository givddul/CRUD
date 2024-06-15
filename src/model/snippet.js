import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

mongoose.Promise = global.Promise
mongoose.set('strictQuery', false)
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 3000
})

const snippetSchema = new mongoose.Schema({
  code: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true }) // "timestamps" to be able to sort by creation time

const Snippet = mongoose.model('Snippet', snippetSchema)

export const snippetModel = {

  // C
  create: async (code, userId) => {
    const newSnippet = new Snippet({ code, userId })
    return newSnippet.save()
  },

  // R
  readAll: async () => {
    // Find all snippets and sort them by creation time in descending order
    return Snippet.find().populate('userId', 'username').sort({ createdAt: -1 })
  },

  // U
  update: async (id, newCode) => {
    const snippet = await Snippet.findById(id)
    if (!snippet) {
      throw new Error('Snippet not found')
    }
    snippet.code = newCode
    await snippet.save()
  },

  // D
  delete: async (id) => {
    return Snippet.findByIdAndDelete(id)
  },

  findById: async (id) => {
    return Snippet.findById(id).populate('userId')
  }

}
