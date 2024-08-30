import userModel from "../models/userModel.js";


// add items to user's cart

const addToCart = async (req, res) => {
    try {
        const {userId, itemId} = req.body;

        let userData = await userModel.findOne({ _id: userId });

        if(!userData){
            return res.status(401).json({
                success: false,
                message: "User not found. Please login again."
            });
        }

        if (!userData.cartData[itemId]) {
            userData.cartData[itemId] = 1;
        } else {
            userData.cartData[itemId] += 1;
        }

        userData.markModified('cartData');
        await userData.save();

        // Verify the update
        const updatedUser = await userModel.findOne({ _id: userId });
        console.log('Updated cart:', updatedUser.cartData);

        res.status(200).json({
            success: true,
            message: "Added to cart"
        });
    } catch (error) {
        console.error('Error updating cart:', error);
        return res.status(500).json({
            success: false,
            message: "Error updating cart",
            error: error.message
        });
    }
}

// remove items from user's cart

const removeFromCart = async (req, res) => {
    try {
        let userData = await userModel.findById(req.body.userId);
        let cartData = await userData.cartData;
        if(cartData[req.body.itemId] > 0){
            cartData[req.body.itemId] -= 1 ;
        } 
        await userModel.findByIdAndUpdate(req.body.userId,{cartData});
        res.json({
            success: true,
            message: "Removed from cart"
        })
    } catch (error) {
        console.log(error);
        return res.json({
            success: false,
            message: "Error"
        })
    }
}

// fetch user's cart data

const getCart = async (req, res) => {
    try {
        const userData = await userModel.findById(req.body.userId);
        let cartData = userData.cartData;
        res.json({
            success: true,
            cartData
        })
    } catch (error) {
        console.log(error)
        return res.json({
            success: false,
            message: "Error"
        })
    }
}

export { addToCart, removeFromCart, getCart };