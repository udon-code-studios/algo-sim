const URI = (process.env.BACKEND_URI) ? process.env.BACKEND_URI : 'http://localhost:3001';

export async function action({ request }) {
  const body = await request.formData();
  console.log('[ STATUS ] POST /api/add -', Date());

  const res = await fetch(`${URI}/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      a: body._fields.a[0],
      b: body._fields.b[0],
      language: body._fields.language[0],
      code: body._fields.code[0],
    }),
  });

  const resBody = await res.json();

  return (resBody);
}