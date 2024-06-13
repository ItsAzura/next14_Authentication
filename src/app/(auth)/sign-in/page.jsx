'use client';
import React from 'react';
import styles from './SignIn.module.css';
import { useState } from 'react';
import { signInUser } from '@/actions/user';
import { useRouter } from 'next/navigation';

const SignIn = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await signInUser(formData);
    console.log(result);
    if (result?.success) router.push('/');
  };

  console.log(formData);
  return (
    <div className={styles.container}>
      <h1>Sign In</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email} //Gán giá trị cho input
          onChange={handleChange} //Gọi hàm xử lý thay đổi giá trị của
          input
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password} //Gán giá trị cho input
          onChange={handleChange} //Gọi hàm xử lý thay đổi giá trị của
          input
        />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default SignIn;
