import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const middleware = async (req) => {
  //Lấy đường dẫn hiện tại
  const path = req.nextUrl.pathname;
  //Kiểm tra xem đường dẫn có phải là public không
  const publicPaths = path === '/sign-in' || path === '/sign-up';

  //lấy token từ cookie
  const getCookies = cookies();
  const token = getCookies['token']?.value || '';

  //Nếu đường dẫn là public và token tồn tại thì chuyển hướng về trang chính
  if (publicPaths && token !== '') {
    return NextResponse.redirect('/', req.nextUrl);
  }

  //Nếu đường dẫn không phải là public và token không tồn tại thì chuyển hướng về trang đăng nhập
  if (!publicPaths && token === '') {
    return NextResponse.redirect('/sign-in', req.nextUrl);
  }
};

export const config = {
  matcher: ['/sign-in', '/sign-up'],
};
