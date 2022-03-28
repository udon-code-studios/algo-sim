const URI = (process.env.BACKEND_URI) ? process.env.BACKEND_URI : 'http://localhost:8080';

export async function action({ request }) {
    const body = await request.formData();
    console.log('[ STATUS ] POST /api/bars -', Date());

    const start = new Date(Date.parse(body._fields.start[0]))
    start.setHours(13, 30) // will be deprecated
    const end = new Date(Date.parse(body._fields.end[0]))
    end.setHours(13, 32) // will be deprecated

    const res = await fetch(`${URI}/bars`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            symbol: body._fields.symbol[0],
            start: start.toISOString(),
            end: end.toISOString(),
        }),
    });

    const resBody = await res.json();

    return (resBody);
}