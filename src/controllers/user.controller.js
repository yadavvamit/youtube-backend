import {asyncHandler} from "../utils/asyncHandler.js";

const registerUser = asyncHandler(async (req, res) =>{
    res.status(200).json({
        message: "ok"
       // get user detail
       //check exit user detail - username, email, password
       //
    })
})

export {
    registerUser,
  
}