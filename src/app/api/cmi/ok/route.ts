import { redirect } from 'next/navigation';
import { NextRequest } from 'next/server';

// CMI POSTs the payment result to this URL (it's a form POST, not a GET redirect).
// We accept the POST and redirect the browser to our success page.
export async function POST(request: NextRequest) {
    // CMI sends form fields — read them (we don't need them here, just redirect)
    await request.formData().catch(() => null);
    redirect('/checkout/success');
}

// Also accept GET in case CMI ever does a GET redirect
export async function GET() {
    redirect('/checkout/success');
}
