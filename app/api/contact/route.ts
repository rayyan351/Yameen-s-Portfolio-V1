import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { name, email, lookingToBuild, message } = data;

    // Server-side validation
    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Standard logging for the developer workspace
    console.log('--- Received Contact Form Submission ---');
    console.log(`Name: ${name}`);
    console.log(`Email: ${email}`);
    console.log(`Looking to build: ${lookingToBuild}`);
    console.log(`Message: ${message}`);
    console.log('-----------------------------------------');

    // Simulate standard database write or forward delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact Form Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
