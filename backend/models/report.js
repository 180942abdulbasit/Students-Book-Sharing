const mongoose = require('mongoose')

const ReportSchema = mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.ObjectId,
      ref: 'Product',
      required: true,
    },
    users: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Report', ReportSchema)
