import Image from 'next/image';
import styles from './page.module.css';
import { AuthUser } from '@/actions/user';
import { redirect } from 'next/navigation';

export default async function Home() {
  const user = await AuthUser();
  console.log(user);
  if (!user?.success) {
    redirect('/sign-in');
  }
  return (
    <div>
      <h1>Next14 - Authentication</h1>
      <p>{user?.data?.username}</p>
      <p>{user?.data?.email}</p>
    </div>
  );
}
