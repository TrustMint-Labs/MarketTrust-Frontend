"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { TxStatus } from "@/components/ui/TxStatus";
import { useTx } from "@/hooks/useTx";
import { api } from "@/lib/api";

interface FormState {
  seller: string;
  arbiter: string;
  amount: string;
  deadline: string;
}

interface Errors {
  seller?: string;
  arbiter?: string;
  amount?: string;
  deadline?: string;
}

function validate(f: FormState): Errors {
  const e: Errors = {};
  if (!f.seller.startsWith("G") || f.seller.length !== 56)
    e.seller = "Enter a valid Stellar address (starts with G, 56 chars)";
  if (!f.arbiter.startsWith("G") || f.arbiter.length !== 56)
    e.arbiter = "Enter a valid Stellar address (starts with G, 56 chars)";
  if (!f.amount || isNaN(Number(f.amount)) || Number(f.amount) <= 0)
    e.amount = "Enter a valid amount";
  if (!f.deadline) e.deadline = "Select a deadline";
  else if (new Date(f.deadline) <= new Date()) e.deadline = "Deadline must be in the future";
  return e;
}

export function CreateEscrowForm() {
  const router = useRouter();
  const { tx, execute } = useTx();
  const [form, setForm] = useState<FormState>({ seller: "", arbiter: "", amount: "", deadline: "" });
  const [errors, setErrors] = useState<Errors>({});

  const set = (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});

    await execute(
      () =>
        api.createEscrow({
          seller: form.seller,
          arbiter: form.arbiter,
          amount: form.amount,
          deadline: Math.floor(new Date(form.deadline).getTime() / 1000),
        }).then((r) => r.txXdr),
      () => setTimeout(() => router.push("/dashboard"), 1500)
    );
  };

  const minDate = new Date(Date.now() + 60_000).toISOString().slice(0, 16);

  return (
    <Card className="max-w-lg mx-auto">
      <h1 className="text-lg font-semibold text-text-primary mb-1">Create Escrow</h1>
      <p className="text-sm text-text-secondary mb-6">
        Lock funds in a trustless escrow on Stellar.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Seller Address"
          placeholder="G…"
          value={form.seller}
          onChange={set("seller")}
          error={errors.seller}
          hint="The recipient who will receive funds upon release"
        />
        <Input
          label="Arbiter Address"
          placeholder="G…"
          value={form.arbiter}
          onChange={set("arbiter")}
          error={errors.arbiter}
          hint="Trusted third party who resolves disputes"
        />
        <Input
          label="Amount (XLM)"
          type="number"
          min="0"
          step="0.0000001"
          placeholder="100"
          value={form.amount}
          onChange={set("amount")}
          error={errors.amount}
        />
        <Input
          label="Deadline"
          type="datetime-local"
          min={minDate}
          value={form.deadline}
          onChange={set("deadline")}
          error={errors.deadline}
          hint="Buyer can request refund after this date"
        />

        <Button
          type="submit"
          loading={tx.status === "pending"}
          className="mt-2 w-full"
        >
          Create Escrow <ArrowRight size={15} />
        </Button>
      </form>

      <TxStatus tx={tx} />
    </Card>
  );
}
