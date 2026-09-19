import { requireSession, getWorkspace } from "@/lib/workspace";
import { formatMoney } from "@/lib/utils";
import { addCustomer, deleteCustomer } from "@/actions/workspace";
import { Button, Card, Input, Label, Textarea } from "@/components/ui";
import { PageKicker, PageTitle, PathToFive } from "@/components/portal";

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const session = await requireSession();
  const workspace = await getWorkspace(session.user.id);
  const params = await searchParams;
  const remaining = Math.max(0, 5 - workspace.customers.length);
  const total = workspace.customers.reduce(
    (sum, customer) => sum + customer.amountCents,
    0,
  );
  const average =
    workspace.customers.length > 0
      ? Math.round(total / workspace.customers.length)
      : 0;

  return (
    <div className="app-rise mx-auto max-w-6xl pb-6">
      <PageKicker>The book · {workspace.name}</PageKicker>
      <PageTitle>Paying customers</PageTitle>
      <p className="mt-3 max-w-xl text-sm leading-7 text-[var(--mute)]">
        Name, amount, date. The only list that matters before product-market
        fit.
      </p>

      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        <Card>
          <p className="font-hand text-lg text-[var(--moss)]">Logged</p>
          <p className="mt-2 font-black text-3xl">{workspace.customers.length}</p>
        </Card>
        <Card>
          <p className="font-hand text-lg text-[var(--moss)]">Recorded revenue</p>
          <p className="mt-2 font-black text-3xl">{formatMoney(total)}</p>
        </Card>
        <Card>
          <p className="font-hand text-lg text-[var(--moss)]">Average payment</p>
          <p className="mt-2 font-black text-3xl">
            {workspace.customers.length ? formatMoney(average) : "—"}
          </p>
        </Card>
      </div>

      <Card className="mt-4">
        <PathToFive count={workspace.customers.length} />
        <p className="mt-3 text-sm text-[var(--mute)]">
          {remaining > 0
            ? `${remaining} more name${remaining === 1 ? "" : "s"} to the milestone.`
            : "Milestone hit. Keep logging every payment."}
        </p>
      </Card>

      {params.error === "name" ? (
        <p className="mt-4 text-sm text-[var(--rust)]">Name is required.</p>
      ) : null}

      <div className="mt-4 grid gap-4 lg:grid-cols-[340px_1fr]">
        <Card>
          <h2 className="font-black text-2xl tracking-tight">Add a payment</h2>
          <form action={addCustomer} className="mt-5 space-y-3">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                required
                placeholder="Alex from Northwind"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="optional"
              />
            </div>
            <div>
              <Label htmlFor="amount">Amount (USD)</Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                min="0"
                step="0.01"
                defaultValue="12"
              />
            </div>
            <div>
              <Label htmlFor="paidAt">Paid on</Label>
              <Input
                id="paidAt"
                name="paidAt"
                type="date"
                defaultValue={new Date().toISOString().slice(0, 10)}
              />
            </div>
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea id="notes" name="notes" placeholder="How they found you" />
            </div>
            <Button type="submit" className="w-full">
              Add customer
            </Button>
          </form>
        </Card>

        <Card>
          {workspace.customers.length === 0 ? (
            <p className="text-sm text-[var(--mute)]">
              Your first paying user belongs here — even if it was $12.
            </p>
          ) : (
            <ul className="divide-y divide-[var(--rule)]">
              {workspace.customers.map((customer) => (
                <li
                  key={customer.id}
                  className="flex flex-wrap items-center justify-between gap-3 py-4"
                >
                  <div>
                    <p className="text-[var(--ink)]">{customer.name}</p>
                    <p className="mt-1 text-sm text-[var(--mute)]">
                      {customer.email || "No email"} ·{" "}
                      {customer.paidAt.toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                    {customer.notes ? (
                      <p className="mt-1 text-sm text-[var(--mute)]">
                        {customer.notes}
                      </p>
                    ) : null}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm text-[var(--brass)]">
                      {formatMoney(customer.amountCents)}
                    </span>
                    <form action={deleteCustomer}>
                      <input type="hidden" name="id" value={customer.id} />
                      <Button type="submit" size="sm" variant="danger">
                        Remove
                      </Button>
                    </form>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
