import {asyncHandler} from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.models.js"
import  {uploadOnCloudinary} from "../utils/cloudinary.js"
import  { ApiResponse } from "../utils/ApiResponse.js"


const registerUser = asyncHandler(async (req, res) =>{
    
    // get detail user  from frontend
    // validation  - not empty 
    // check if user already exits : username, email
    // check for images , check coverImage
    // upload them cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    //  return response  

    const {username, fullName, email, password} = req.body
    // console.log("email:", email, "fullName:", fullName, "username:", username, "password:", password);
    
    
    // check validaton
    if(
        [fullName, username, email, password].some( (field) => field?.trim() === "")
    )
   
    {
        throw new ApiError(400, "All fields are required")
    }

    // chech user exits

    const existedUser = await User.findOne({
        $or: [{username}, {email}]
        
    })
   
    if(existedUser){
        throw new ApiError(409, "User with username and email already exists")
    }
    // console.log(req.files.coverImage)
    // check for images coverImages 
    const avatarLocalPath = req.files?.avatar[0]?.path;
    // const coverImageLocalPath = req.files?.coverImage[0]?.path;
    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0)
    coverImageLocalPath = req.files.coverImage[0].path;
   
    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar file is required")
    }

    // upload cloudinary images
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if(!avatar){
        throw new ApiError(400, "Avatar file is required")
    }
    // create object and entry db

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()

    }) 
//  check user creation 
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    if(!createdUser) {
        throw new ApiError(500, "Something went wrong while registring the user")
    }
// return response
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Succesfully")
    )

})

export {
    registerUser,
  
}