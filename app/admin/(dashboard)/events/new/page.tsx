import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { EventForm } from "@/components/admin/EventForm";
import { createEventAction } from "@/lib/admin/actions/events";

export default function NewEventPage() {
  return (
    <div>
      <Link href="/admin/events" className="flex items-center gap-1.5 text-sm text-ink-600 hover:text-forest-800">
        <ArrowLeft size={15} /> Events
      </Link>
      <h1 className="mt-3 font-display text-2xl font-medium text-forest-950">Yangi tadbir</h1>
      <EventForm action={createEventAction} />
    </div>
  );
}
