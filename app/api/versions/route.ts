import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';

export async function GET() {
  try {
    const filePath = join(process.cwd(), 'public', 'data', 'versions.json');
    const data = await readFile(filePath, 'utf-8');
    const parsed = JSON.parse(data);
    return NextResponse.json(parsed);
  } catch (error) {
    console.error('Error loading versions:', error);
    return NextResponse.json([], { status: 200 });
  }
}
