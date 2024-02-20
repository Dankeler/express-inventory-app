const express = require("express")
const asyncHandler = require("express-async-handler")
const {body, validationResult} = require("express-validator")

const Category = require("../models/category")
const Item = require("../models/item")


exports.index = asyncHandler(async (req, res, next) => {
    const [allCategories, allItems] = await Promise.all([
    Category.find({}, "name description").exec(),
    Item.find({}).populate("category").exec()
    ])

    res.render("start", {
        title: "Welcome to the shop page",
        items: allItems,
        categories: allCategories
    })
})

exports.category_detail = asyncHandler(async (req, res, next) => {
    const [allCategories, allItems] = await Promise.all([
        Category.findById(req.params.id).exec(),
        Item.find({category: req.params.id}).exec()
    ])

    res.render("category_detail", {
        category: allCategories,
        items: allItems
    })
})

exports.category_create_get = asyncHandler(async (req, res, next) => {
    const allCategories = await Category.find().exec()

    res.render("category_create", {
        title: "Test",
        categories: allCategories
    })
})

exports.category_create_post = [
    body("categoryName", "Category name must contain at least 5 characters")
    .trim()
    .isLength({min: 5})
    .isLength({max: 100})
    .escape(),
    body("categoryDescription", "Description must contain at least 5 characters")
    .trim()
    .isLength({min: 5})
    .isLength({max: 100})
    .escape(),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req)

        const category = new Category({name: req.body.categoryName,
                                       description: req.body.categoryDescription})


    if (!errors.isEmpty()) {
        res.render("category_create", {
            title: "Add Category",
            category: category,
            errors: errors.array()
            })
            return
        } else {
            const categoryExists = await Category.findOne({name: req.body.categoryName}).exec()
            if (categoryExists) {
                res.redirect(categoryExists.url)
            } else {
                await category.save()
                res.redirect(category.url)
            }
        }
    })
]

exports.category_delete_get = asyncHandler(async (req, res, next) => {
    const [allCategories, allItems] = await Promise.all([
        Category.findById(req.params.id).exec(),
        Item.find({category: req.params.id}).exec()
    ])

    res.render("category_delete", {
        title: "Delete a Category",
        category: allCategories,
        items: allItems
    })
})

exports.category_delete_post = asyncHandler(async (req, res, next) => {
    await Category.findByIdAndDelete(req.params.id)
    res.redirect("/shop")
})

exports.category_edit_get = asyncHandler(async (req, res, next) => {
    const category = await Category.findById(req.params.id).exec()

    res.render("category_edit", {
        title: "Edit a Category",
        category: category
    })
})

exports.category_edit_post = [
    body("categoryName", "Category name must contain at least 5 characters")
    .trim()
    .isLength({min: 5})
    .isLength({max: 100})
    .escape(),
    body("categoryDescription", "Description must contain at least 5 characters")
    .trim()
    .isLength({min: 5})
    .isLength({max: 100})
    .escape(),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req)

        const category = new Category({
            name: req.body.categoryName,
            description: req.body.categoryDescription,
            _id: req.params.id
        })

        if (!errors.isEmpty()) {
            res.render("category_edit", {
                name: req.body.categoryName,
                description: req.body.categoryDescription,
                _id: req.params.id
            })
            return
        } else {
            await Category.findByIdAndUpdate(req.params.id, category, {})
            res.redirect("/shop")
        }
    })
]