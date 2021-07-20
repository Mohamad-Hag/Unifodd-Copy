const express = require("express");
const router = express.Router();

const { JsonRes } = require("./functions/JsonResponse");
const { DBConnection } = require("../../assist/DBConnection");
const { createTokens, validateToken } = require("./functions/JWT")
const db = DBConnection.connect();

router.post('/', (req, res) => {

    let userID = req.body.userID;
    const fetchNotifications = `SELECT n.* FROM 
    notification n 
    JOIN \`user\` u 
    ON u.ID = n.UserID 
    JOIN admin a
    ON a.UserID = u.ID 
    AND a.ID = ${userID} 
    ORDER BY Date DESC
    LIMIT 10`;
    db.query(fetchNotifications, (err, result) => {
        if(err){
            console.log(err);
            return;
        }              
        res.send(JSON.stringify(result))        
    })    
})

router.post('/send', (req, res) => {

    let userID = req.body.UserID;
    let sender = req.body.Sender;
    let text = req.body.Text;

    if(text != '' && text != null && text != undefined){
        let insertNoti = "INSERT INTO notification(Text, IsRead, UserID, Date, Sender) VALUES (?, 0, ?, CURRENT_TIMESTAMP, ?)"

        db.query(insertNoti, [text, userID, sender],(err, result)=> {
            if(err){
                console.log(err)
                return res.json({
                    resStatus: 'bad',
                    resMessage: '*Something went wrong, try again later',
                })
            }
            else{
                return res.json({
                    resStatus: 'good',
                    resMessage: 'Notification sent successfully',
                })
            }
        })
    }
    else{
        return res.json({
            resStatus: 'bad',
            resMessage: '*Feilds cannot be empty',
        })
    }

})

router.post('/count', (req, res) => {
    let userID = req.body.userID;
    console.log(req.body.userID)
    const countQuery = `SELECT count(n.ID) FROM 
    notification n 
    JOIN \`user\` u 
    ON u.ID = n.UserID 
    JOIN admin a
    ON a.UserID = u.ID 
    WHERE n.IsRead = 0 AND a.ID = ${userID}`;
    db.query(countQuery, (err ,result) => {
        if(err) console.log(err)
        else{
            console.log(result.length.toString())
            res.send(result.length.toString())
        }
    })
})

module.exports = router