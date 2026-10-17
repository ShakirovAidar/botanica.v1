import { NextResponse } from "next/server";

type Order = {
  budget?: string;
  project?: string;
  price?: string;
  projectId?: string;
  subtitle?: string;
  channel?: string;
  contact?: string;
  language?: string;
  consent?: boolean;
};

export async function POST(request: Request) {
  const subdomain = process.env.AMOCRM_SUBDOMAIN;
  const accessToken = process.env.AMOCRM_ACCESS_TOKEN;

  if (!subdomain || !accessToken) {
    return NextResponse.json({ error: "CRM is not configured" }, { status: 503 });
  }

  const order = (await request.json()) as Order;
  if (!order.contact || !order.consent || !order.channel) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const base = `https://${subdomain}.amocrm.ru`;
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  };

  const contactResponse = await fetch(`${base}/api/v4/contacts`, {
    method: "POST",
    headers,
    body: JSON.stringify([{ name: order.contact }]),
  });
  if (!contactResponse.ok) {
    return NextResponse.json({ error: "CRM contact creation failed" }, { status: 502 });
  }
  const contactData = (await contactResponse.json()) as { _embedded?: { contacts?: { id: number }[] } };
  const contactId = contactData._embedded?.contacts?.[0]?.id;
  if (!contactId) {
    return NextResponse.json({ error: "CRM returned no contact" }, { status: 502 });
  }

  const note = Object.entries(order)
    .filter(([key]) => key !== "consent")
    .map(([key, value]) => `${key}: ${value ?? ""}`)
    .join("\n");
  const leadResponse = await fetch(`${base}/api/v4/leads/complex`, {
    method: "POST",
    headers,
    body: JSON.stringify([
      {
        name: `Botanica — ${order.project || "New request"}`,
        price: Number(String(order.price || "").replace(/\D/g, "")) || 0,
        _embedded: {
          contacts: [{ id: contactId }],
          tags: [{ name: "botanica" }],
        },
      },
    ]),
  });

  if (!leadResponse.ok) {
    return NextResponse.json({ error: "CRM lead creation failed" }, { status: 502 });
  }
  const leadData = (await leadResponse.json()) as { _embedded?: { leads?: { id: number }[] } };
  const leadId = leadData._embedded?.leads?.[0]?.id;
  if (leadId) {
    await fetch(`${base}/api/v4/leads/notes`, {
      method: "POST",
      headers,
      body: JSON.stringify([{ entity_id: leadId, note_type: "common", params: { text: note } }]),
    });
  }
  return NextResponse.json({ ok: true, leadId });
}
