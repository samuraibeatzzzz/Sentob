import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { EventForm } from "@/components/admin/EventForm";
import { getEventByIdAdmin } from "@/lib/admin/queries";
import { updateEventAction } from "@/lib/admin/actions/events";

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = await getEventByIdAdmin(id);

  if (!event) notFound();

  const boundAction = updateEventAction.bind(null, id);

  return (
    <div>
      <Link href="/admin/events" className="flex items-center gap-1.5 text-sm text-ink-600 hover:text-forest-800">
        <ArrowLeft size={15} /> Events
      </Link>
      <h1 className="mt-3 font-display text-2xl font-medium text-forest-950">{event.title}</h1>
      <EventForm action={boundAction} defaultValues={event} />
    </div>
  );
}
