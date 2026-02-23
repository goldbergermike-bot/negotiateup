import { NextResponse } from 'next/server';
import { verifyAccessToken } from '../../../lib/access-token';
import { getRoleData } from '../../../lib/research';

export async function GET(req) {
  const token = req.cookies.get('nu_access')?.value;
  if (!verifyAccessToken(token)) {
    return NextResponse.json({ error: 'Access denied' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const slug = searchParams.get('slug');
  const role = searchParams.get('role');

  if (!slug || !role) {
    return NextResponse.json({ error: 'Missing slug or role' }, { status: 400 });
  }

  const data = getRoleData(slug, role);
  if (!data) {
    return NextResponse.json({ error: 'Role not found' }, { status: 404 });
  }

  return NextResponse.json(data);
}
