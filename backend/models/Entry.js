import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  username: String,
  text: String,
  createdAt: { type: Date, default: Date.now }
});

const entrySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['Diary', 'ToDo', 'DueDate'], required: true },
    title: { type: String, required: true, maxlength: 30 },

    subCategory: {
      type: String,
      enum: ['Ungkapan', 'Deskripsi', 'Point', 'Narasi'],
    },
    isPublic: { type: Boolean, default: false },
    content: { type: String },
    media: { type: String }, 
    comments: [commentSchema],

    todos: [{ text: String, isCompleted: { type: Boolean, default: false } }],

    calendarDate: { type: Date },
    activity: { type: String },
    remindMeIn: {
      type: String,
      enum: ['1 days', '3 days', '7 days', '30 days before'],
    },
  },
  { timestamps: true }
);

const Entry = mongoose.model('Entry', entrySchema);
export default Entry;
