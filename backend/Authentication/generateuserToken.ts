import { Response } from 'express';
import { Types } from 'mongoose'
import jwt from 'jsonwebtoken';

const generateUserToken = (res: Response, userId: Types.ObjectId) => {
    const token = jwt.sign({ id: userId }, process.env.JWT_USER_SECRET as string, {
        expiresIn: '30d',
    });
    console.log(token,'token')

    res.cookie('userjwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 30 * 24 * 60 * 60 * 1000, 
    });

    return token;   
};

export default generateUserToken;
