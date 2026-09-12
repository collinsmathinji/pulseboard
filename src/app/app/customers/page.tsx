import { requireSession, getWorkspace } from "@/lib/workspace";
import { formatMoney } from "@/lib/utils";
import { addCustomer, deleteCustomer } from "@/actions/workspace";
import { Button, Card, Input, Label, Textarea } from "@/components/ui";

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const session = await requireSession();
  const workspace = await getWorkspace(session.user.id);
  const params = await searchParams;
  const remaining = Math.max(0, 5 - workspace.customers.length);

  return (
    <div className="mx-auto max-w-5xl">
      <p className="text-xs uppercase tracking-[0.2em] text-cyan-400">
        Path to 5
      </p>
      <h1 className="mt-2 font-serif text-4xl text-zinc-50">
        Paying customers
      </h1>
      <p className="mt-2 text-zinc-400">
        {workspace.customers.length} logged
        {remaining > 0
          ? ` · ${remaining} to the milestone`
          : " · milestone hit"}
      </p>
      {params.error === "name" ? (
        <p className="mt-4 text-sm text-red-300">Name is required.</p>
      ) : null}

      <div className="mt-8 grid gap-6 lg:grid-cols-[320px_1fr]">
        <Card>
          <h2 className="font-serif text-2xl">Add a payment</h2>
          <form action={addCustomer} className="mt-4 space-y-3">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" required placeholder="Alex from Northwind" />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="optional" />
            </div>
            <div>
              <Label htmlFor="amount">Amount (USD)</Label>
              <Input id="amount" name="amount" type="number" min="0" step="0.01" defaultValue="12" />
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
            <p className="text-zinc-500">
              Your first paying user belongs here — even if it was $12.
            </p>
          ) : (
            <ul className="divide-y divide-zinc-800">
              {workspace.customers.map((customer) => (
                <li
                  key={customer.id}
                  className="flex flex-wrap items-center justify-between gap-3 py-3"
                >
                  <div>
                    <p className="text-zinc-100">{customer.name}</p>
                    <p className="text-sm text-zinc-500">
                      {customer.email || "No email"} ·{" "}
                      {customer.paidAt.toISOString().slice(0, 10)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-zinc-300">
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
