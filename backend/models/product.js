const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      maxlength: 64,
    },
    description: {
      type: String,
      required: true,
      maxlength: 2000,
    },
    price: {
      type: Number,
      trim: true,
      required: true,
    },
    category: {
      type: ObjectId,
      ref: 'Category',
      required: true,
    },
    subCategory: {
      type: ObjectId,
      ref: 'SubCategory',
    },
    photo: {
      data: Buffer,
      contentType: String,
      //required: true,
    },
    authors: {
      type: Array,
      default: [],
    },
    institutes: {
      type: Array,
      default: [],
    },
    createdBy: {
      type: ObjectId,
      ref: 'User',
    },
    status: {
      type: Number,
      default: 1,
    },
    grade: {
      type: String,
      enum: [
        'Nursery',
        'Kindergarten',
        'Grade 1',
        'Grade 1',
        'Grade 2',
        'Grade 3',
        'Grade 4',
        'Grade 5',
        'Grade 6',
        'Grade 7',
        'Grade 8',
        'Grade 9',
        'Grade 10',
        'Grade 11',
        'Grade 12',
        'Matriculation',
        'Pre-Engineering',
        'Pre-Medical',
        'ICS',
        'ICOM',
        'O-levels',
        'A-levels',
        'Entry Test',
      ],
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    numOfReviews: {
      type: Number,
      default: 0,
    },
    reportUsers: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
)

productSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'product',
  justOne: false,
})

productSchema.pre('remove', async function (next) {
  await this.model('Review').deleteMany({ product: this._id })
})

module.exports = mongoose.model('Product', productSchema)
