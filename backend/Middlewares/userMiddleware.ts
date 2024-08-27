import User,{ UserDocument,UserType } from "../Models/userModel";
import { Request,Response,NextFunction } from "express";
import asyncHandler from 'express-async-handler'
import jwt from 'jsonwebtoken'


interface DecodedTokenUser {
    id: string;
}

interface AuthenticatedRequest extends Request {
    user?: UserDocument;
}

const authenticateUser = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    console.log(req,'reeee')
    console.log(req.headers,'headers')
    const token = req.cookies.userjwt;
    console.log(token,'hh')

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_USER_SECRET as string) as DecodedTokenUser;
            console.log(decoded,'decode')
            const user = await User.findById(decoded.id).select('-password') as UserDocument | null;
            console.log(user,'pp')

            if (user) {
                req.user = user;
                next();
            } else {
                res.status(401).json({ message: 'User not found' });
            }
        } catch (error) {
            res.status(401).json({ message: 'Invalid token' });
        }
    } else {
        res.status(401).json({ message: 'No token provided' });
    }

})

export { authenticateUser }