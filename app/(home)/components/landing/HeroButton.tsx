'use client';

import { Button } from 'antd';
import { useRouter } from 'next/navigation';

export default function HeroButton() {
  return (
    <Button
      type="primary"
      size="large"
      className="try-button my-4 !p-6 !text-lg !font-bold !rounded-full !text-white"
      onClick={() => (window.location.href = '/login')}
    >
      Încearcă gratuit
    </Button>
  );
}
