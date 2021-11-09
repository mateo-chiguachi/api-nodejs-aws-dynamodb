const Router = require('express');
const controller = require("../controllers/users.controller");

const router = Router();

router.get("/users", controller.getUsers);
router.post("/users", controller.createNewUser);
router.put("/users/:id", controller.updateUserById);
router.delete("/users/:id", controller.deleteUserById);
router.get("/excel", controller.excel);
router.get("/pdf", controller.pdf);  

router.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});  
module.exports = router;