import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { deviceStatusLabels, formatDate, roleLabels, submissionStatusLabels, submissionTypeLabels } from "@/lib/admin";
import { ProfileForm } from "@/components/account/ProfileForm";
import { Container } from "@/components/ui/Container";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Your profile", robots: { index: false, follow: false } };

function money(value: number | null | undefined) {
  if (value == null) return null;
  return new Intl.NumberFormat("en-KE", { style: "currency", currency: "KES", maximumFractionDigits: 0 }).format(value);
}

export default async function AccountPage() {
  const session = await getSession();
  if (!session) redirect("/sign-in?next=/account");

  const user = await prisma.user.findUnique({
    where: { id: session.sub },
    select: { id: true, name: true, email: true, phone: true, role: true },
  });

  const [owned, matchedByEmail] = await Promise.all([
    prisma.submission.findMany({
      where: { customerId: session.sub },
      include: { devices: true },
      orderBy: { createdAt: "desc" },
    }),
    user?.email
      ? prisma.submission.findMany({
          where: { email: user.email, customerId: null },
          include: { devices: true },
          orderBy: { createdAt: "desc" },
        })
      : Promise.resolve([]),
  ]);

  const submissions = [...owned, ...matchedByEmail].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  return (
    <section className="bg-cream py-14 lg:py-20">
      <Container className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-forest-500">Account</p>
          <h1 className="mt-3 text-4xl font-semibold text-forest-950">Your profile</h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-forest-900/75">
            {roleLabels[user?.role ?? session.role]}. Updates made by the Relay team on your requests show up here.
          </p>
          <div className="mt-8">
            <ProfileForm
              name={user?.name ?? session.name}
              email={user?.email ?? session.email}
              phone={user?.phone ?? ""}
            />
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-forest-950">Your requests</h2>
          <p className="mt-1 text-sm text-forest-900/70">
            Contact, pickup, donation, partnership and sell forms you submit are stored here. Offer amounts use the price catalog maintained in admin.
          </p>
          <div className="mt-5 space-y-4">
            {submissions.length === 0 && (
              <div className="rounded-3xl border border-dashed border-forest-200 bg-white p-6 text-sm text-forest-900/70">
                Nothing sent yet. A contact, partnership or sell form will appear here after you submit it while signed in.
              </div>
            )}
            {submissions.map((submission) => (
              <article key={submission.id} className="rounded-3xl border border-forest-100 bg-white p-5 shadow-card">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-forest-950">{submissionTypeLabels[submission.type]}</p>
                  <p className="rounded-full bg-forest-50 px-3 py-1 text-xs font-bold text-forest-700">
                    {submissionStatusLabels[submission.status]}
                  </p>
                </div>
                <p className="mt-2 text-sm text-forest-900/80">{submission.message || "No message added."}</p>
                <p className="mt-3 text-xs text-forest-900/60">{formatDate(submission.createdAt)}</p>
                {submission.notes && (
                  <p className="mt-3 rounded-2xl bg-lime-50 px-3 py-2 text-sm text-forest-900">
                    Update from Relay: {submission.notes}
                  </p>
                )}
                {submission.devices.length > 0 && (
                  <ul className="mt-3 space-y-2">
                    {submission.devices.map((device) => (
                      <li key={device.id} className="text-sm text-forest-900/80">
                        {[device.brand, device.model, device.deviceType].filter(Boolean).join(" ")}
                        {" · "}
                        {deviceStatusLabels[device.status]}
                        {money(device.offerAmount) ? ` · ${money(device.offerAmount)}` : ""}
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
