import mongoose,{ Schema,Types,model,Document } from 'mongoose'

export interface UserType extends Document{
    name:string;
    email:string;
    phoneno:number;
    password:string;
    profileImage:string;
    role:string;
}

const userSchema = new Schema<UserType>({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    phoneno:{
        type:Number,
        required:true
    },
    profileImage:{
        type:String,
    },
    role:{
        type:String,
        default:'user'
    }
})

const User = model<UserType>('User',userSchema)
export type UserDocument =  UserType & { _id: Types.ObjectId };
export default User

