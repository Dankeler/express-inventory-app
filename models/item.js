const mongoose = require("mongoose")

const Schema = mongoose.Schema

const itemSchema = new Schema({
    name: {type: String, required: true, maxLength: 100},
    description: {type: String, maxLength: 100},
    price: {type: Number, min: 0, max: 9999, required: true},
    category: {type: Schema.Types.ObjectId, ref: "Category", required: true}
})

itemSchema.virtual("url").get(function () {
    return `/shop/item/${this._id}`
})

module.exports = mongoose.model("Item", itemSchema)