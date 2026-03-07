import { redirect } from 'next/navigation';
import { NextRequest } from 'next/server';

// CMI POSTs the payment failure result to this URL.
// We accept the POST and redirect the browser to our fail page.
export async function POST(request: NextRequest) {
    await request.formData().catch(() => null);
    redirect('/checkout/fail');
}

export async function GET() {
    redirect('/checkout/fail');
}
