import * as Constants from '../../constants';

export async function action({ request }) {
  const body = await request.formData();
  console.log('[ STATUS ] POST /api/add -', Date());

  const res = await fetch(`${Constants.BACKEND_URI}/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      a: body._fields.a[0], // string
      b: body._fields.b[0], // string
      language: body._fields.language[0], // string
      code: body._fields.code[0], // string
    }),
  });

  const resBody = await res.json();

  return (resBody);
}