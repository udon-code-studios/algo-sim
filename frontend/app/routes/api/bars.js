import * as Constants from '../../constants';

export async function action({ request }) {
  const body = await request.formData();
  console.log('[ STATUS ] POST /api/bars -', Date());

  const start = new Date(Date.parse(body._fields.start[0]))
  start.setHours(13, 30) // start of normal trading hours
  const end = new Date(Date.parse(body._fields.end[0]))
  end.setHours(19, 59) // end of normal trading hours

  const res = await fetch(`${Constants.BACKEND_URI}/bars`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      symbol: body._fields.symbol[0],
      start: start.toISOString(),
      end: end.toISOString(),
    }),
  });

  const resBody = await res.json();

  // response should be in form of:
  // [{ t (time), o (open), h (high), l (low), c (close), v (volume) }, ...]

  return (
    {
      symbol: body._fields.symbol[0],
      bars: resBody.bars,
    }
  );
}
