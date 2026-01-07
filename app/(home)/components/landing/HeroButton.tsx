'use client';

import { Button } from 'antd';

export default function HeroButton() {
  return (
    <Button
      type="primary"
      size="large"
      className="try-button my-4 !p-8 !text-xl !font-bold !rounded-full !text-white"
      onClick={() => (window.location.href = '/login')}
    >
      Încearcă gratuit
    </Button>
  );
}
