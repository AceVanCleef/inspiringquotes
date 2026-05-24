import { redirect } from 'next/navigation';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Terms',
    openGraph: {
        url: '/impressum',
    }
}

export default function Terms() {
  redirect('/impressum');
}