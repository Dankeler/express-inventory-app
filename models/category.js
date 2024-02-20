const mongoose = require("mongoose")

const Schema = mongoose.Schema

const categorySchema = new Schema({
    name: {type: String, required: true, minLength: 5, maxLength: 100},
    description: {type: String, maxLength: 100, minLength: 5},
})

categorySchema.virtual("url").get(function () {
    return `/shop/category/${this._id}`
})

module.exports = mongoose.model("Category", categorySchema)