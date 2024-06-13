'use server';
import { connectToDatabase } from '@/database/db';
import User from '@/database/models/user';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export const signUpUser = async (formData) => {
  //Kết nối với database
  await connectToDatabase();
  try {
    //Lấy dữ liệu từ form
    const { username, email, password } = formData;

    //Kiểm tra xem email đã tồn tại chưa
    const user = await User.findOne({ email });
    console.log(user);
    if (user) {
      return { error: 'User already exists' };
    }

    //Hash password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    //Tạo user mới
    const NewUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    //Lưu user mới
    const saverUser = await NewUser.save();
    if (saverUser) {
      return {
        message: 'User created successfully',
        data: JSON.parse(JSON.stringify(saverUser)),
      };
    } else {
      return { error: 'Something went wrong', success: false };
    }
  } catch (error) {
    console.log(error);
    return { error: 'Something went wrong' };
  }
};
