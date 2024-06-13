'use server';
import { connectToDatabase } from '@/database/db';
import User from '@/database/models/user';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

//Hàm đăng nhập
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

//Hàm đăng nhập
export const signInUser = async (formData) => {
  //Kết nối với database
  await connectToDatabase();
  try {
    //Lấy dữ liệu từ form
    const { email, password } = formData;
    //Kiểm tra xem email và password có tồn tại không
    if (!email || !password) {
      return { error: 'Please enter email and password' };
    }

    //Kiểm tra xem user có tồn tại không
    const user = await User.findOne({ email: formData.email });
    if (!user) {
      return { error: 'User not found' };
    }

    //So sánh password
    const checkPassword = await bcryptjs.compare(password, user.password);
    if (!checkPassword) {
      return { error: 'Invalid password' };
    }

    //Tạo token
    const createdTokenData = {
      id: user._id,
      username: user.username,
      email: user.email,
    };
    const token = jwt.sign(createdTokenData, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    //Lưu token vào cookie
    const getCookies = cookies();
    getCookies.set('token', token, { httpOnly: true });

    return {
      success: true,
      message: 'User logged in successfully',
      data: JSON.parse(JSON.stringify(user)),
      token,
    };
  } catch (error) {
    console.log(error);
    return { error: 'Something went wrong' };
  }
};

//Hàm lấy thông tin user đã đăng nhập
export const AuthUser = async () => {
  await connectToDatabase();
  try {
    //Lấy token từ cookie
    const getCookies = cookies();
    const token = getCookies.get('token')?.value || '';
    if (token === '') {
      return {
        success: false,
        message: 'Token is invalid',
      };
    }

    //Giải mã token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    //Tìm user theo id
    const user = await User.findOne({ _id: decoded.id });
    if (!user) {
      return {
        success: false,
        message: 'User not found',
      };
    } else {
      return {
        success: true,
        message: 'User found',
        data: JSON.parse(JSON.stringify(user)),
      };
    }
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: 'Something went wrong',
      message: 'Something went wrong! please try again',
    };
  }
};

//Hàm đăng xuất
export const signOutUser = async () => {
  const getCookies = cookies();
  getCookies.set('token', '');
};
