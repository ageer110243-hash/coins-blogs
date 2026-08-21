import express from "express"

const router = express.Router();

router.use("/send", (req,res) =>{
    res.send("send message endpoint")
})

export default router;