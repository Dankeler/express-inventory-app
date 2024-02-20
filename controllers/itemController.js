const express = require("express")
const asyncHandler = require("express-async-handler")
const {body, validationResult} = require("express-validator")

const Item = require("../models/item")
const Category = require("../models/category")

exports.item_detail = asyncHandler(async (req, res, next) => {
    const allItems = await Item.findById(req.params.id).populate("category").exec()

    res.render("item_detail", {
        title: "Item detail",
        item: allItems
    })
})

exports.item_create_get = asyncHandler(async (req, res, next) => {
    const [allItems, allCategories] = await Promise.all([
        Item.find({}).exec(),
        Category.find({}).exec()
    ])

    res.render("item_create", {
        title: "Add an Item",
        items: allItems,
        categories: allCategories
    })
})

exports.item_create_post = [
    body("itemName", "Name should contain at least 5 characters")
    .trim()
    .isLength({min: 5})
    .isLength({max: 100})
    .escape(),
    body("itemDescription", "Description should contain  at least 5 characters")
    .trim()
    .isLength({min: 5})
    .isLength({max: 100})
    .escape(),
    body("itemPrice", "Between 0.1 and 9999")
    .trim()
    .isFloat({min: 0.1, max: 9999})
    .escape(),
    body("itemCategory").notEmpty(),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req)

        const item = new Item({
            name: req.body.itemName,
            description: req.body.itemDescription,
            price: req.body.itemPrice,
            category: req.body.itemCategory
        })

        if (!errors.isEmpty()) {
            res.render("item_create", {
                title: "Add Item",
                item: item,
                errors: errors.array()
            })
            return
        } else {
            const itemExists = await Item.findOne({name: req.body.itemName}).exec()
            if (itemExists) {
                res.redirect(itemExists.url)
            } else {
                await item.save()
                res.redirect(item.url)
            }
        }
    })
]

exports.item_delete_get = asyncHandler(async (req, res, next) => {
    const item = await Item.findById(req.params.id).exec()

    if (item === null) {
        res.redirect("/shop")
    }

    res.render("item_delete", {
        title: "Delete Item",
        item: item
    })
})

exports.item_delete_post = asyncHandler(async (req, res, next) => {
    await Item.findByIdAndDelete(req.params.id)
    res.redirect("/shop")
})

exports.item_edit_get =  asyncHandler(async (req, res, next) => {
    const [allItems, allCategories] = await Promise.all([
        Item.findById(req.params.id).exec(),
        Category.find({}).exec()
    ])

    if (allItems === null) {
        const err = new Error("Book copy not found")
        err.status = 404
        return next(err)
    }

    res.render("item_edit", {
        title: "Update Item",
        item: allItems,
        categories: allCategories
    })
})

exports.item_edit_post = [
    body("itemName", "Name should contain at least 5 characters")
    .trim()
    .isLength({min: 5})
    .isLength({max: 100})
    .escape(),
    body("itemDescription", "Description should contain  at least 5 characters")
    .trim()
    .isLength({min: 5})
    .isLength({max: 100})
    .escape(),
    body("itemPrice", "Between 0.1 and 9999")
    .trim()
    .isFloat({min: 0.1, max: 9999})
    .escape(),
    body("itemCategory").notEmpty(),
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req)

        const item = new Item({
            name: req.body.itemName,
            description: req.body.itemDescription,
            price: req.body.itemPrice,
            category: req.body.itemCategory,
            _id: req.params.id
        })

        if (!errors.isEmpty()) {
            res.render("item_edit", {
                name: req.body.itemName,
                description: req.body.itemDescription,
                price: req.body.itemPrice,
                category: req.body.itemCategory,
                _id: req.params.id
            })
            return
        } else {
            await Item.findByIdAndUpdate(req.params.id, item, {})
            res.redirect(item.url)
        }
    })
]
