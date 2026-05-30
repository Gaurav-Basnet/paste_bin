const express = require("express");
const router = express.Router();

const{createPaste,getPaste,deletePaste,getAllPaste}= require('../controllers/pasteController');

router.get('/paste',getAllPaste)

router.post('/paste',createPaste);

router.get("/p/:id", getPaste);

router.delete("/paste/:id", deletePaste);

module.exports=router;