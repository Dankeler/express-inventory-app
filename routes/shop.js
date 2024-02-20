const express = require("express")
const router = express.Router()

const category_controller = require("../controllers/categoryController")
const item_controller = require("../controllers/itemController")

// category routes

//home page
router.get("/", category_controller.index)

//get for creating category (place it before the route with parameter)
router.get("/category/create", category_controller.category_create_get)

//post for creating category
router.post("/category/create", category_controller.category_create_post)

// get request for one category
router.get("/category/:id", category_controller.category_detail)

// get request for deleting category
router.get("/category/:id/delete", category_controller.category_delete_get)

router.post("/category/:id/delete", category_controller.category_delete_post)

// get for editing category
router.get("/category/:id/edit", category_controller.category_edit_get)

//post for editing category
router.post("/category/:id/edit", category_controller.category_edit_post)

// // item routes

// get for creating item
router.get("/item/create", item_controller.item_create_get)

// post for creating item
router.post("/item/create", item_controller.item_create_post)

// get request for one item
router.get("/item/:id", item_controller.item_detail)

// get request for deleting item
router.get("/item/:id/delete", item_controller.item_delete_get)

// post request for deleting item
router.post("/item/:id/delete", item_controller.item_delete_post)

// get request for editing item
router.get("/item/:id/edit", item_controller.item_edit_get)

// post request for editing item
router.post("/item/:id/edit", item_controller.item_edit_post)



module.exports = router;
