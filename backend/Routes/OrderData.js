const express = require("express");
const router = express.Router();
const Order = require("../models/Orders");
const { model } = require("mongoose");

   

router.post("/orderData", async (req,res) => {
    let data = req.body.order_data
    await data.splice(0, 0, { Order_date : req.body.order_date})

    //if email not existing in db then create : else : Insertmany()

    let eId = await Order.findOne({'email': req.body.email })
    if (eId === null){
        try {
            await Order.create({
                email: req.body.email,
                order_data: [data]
            }).then(() => {
                res.json({ success:true})
            })
            
        } catch (error) {
            console.log(error.message)
            // res.send("Server error",error.message)
            res.status(500).send("Server error");

        }
    }
    else{
        try {
            await Order.findOneAndUpdate({ email: req.body.email },
                { $push: {order_data : data}}).then(() => {
                    res.json({ success: true})
                })
        } catch (error) {
            res.send("Server Error",error.messege)
        }
    }
    
})

router.post('/myorderData', async (req, res) => {
    try {
        
        let myData = await Order.findOne({ 'email': req.body.email })
        
        res.json({orderData:myData})
    } catch (error) {
        res.send("Error",error.message)
    }
})

module.exports=router;