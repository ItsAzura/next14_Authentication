'use client';
import React from 'react';
import styles from './SignUp.module.css';
import { useState } from 'react';
import { signUpUser } from '@/actions/user';
import { useRouter } from 'next/navigation';

const SignUp = () => {
  const router = useRouter();
  //Tạo state formData
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  //Hàm xử lý thay đổi giá trị của input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  //Hàm xử lý submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await signUpUser(formData);
    console.log(result);
    if (result?.data) router.push('/sign-in');
  };

  const isFormValid = formData.username && formData.email && formData.password;
  console.log(formData);
  return (
    <div className={styles.container}>
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">UserName</label>
        <input
          type="text"
          id="username"
          name="username"
          value={formData.username} //Gán giá trị cho input
          onChange={handleChange} //Gọi hàm xử lý thay đổi giá trị của input
        />
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email} //Gán giá trị cho input
          onChange={handleChange} //Gọi hàm xử lý thay đổi giá trị của input
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password} //Gán giá trị cho input
          onChange={handleChange} //Gọi hàm xử lý thay đổi giá trị của input
        />
        <button type="submit" disabled={!isFormValid}>
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default SignUp;
