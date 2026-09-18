import { prisma } from "@/lib/prisma";
import { markAssistanceHandled } from "@/app/actions/assistance";

export default async function AdminAssistenzaPage() {
  const requests = await prisma.assistanceRequest.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-neutral-900">Richieste di assistenza</h1>

      {requests.length === 0 ? (
        <p className="text-neutral-500">Nessuna richiesta ricevuta.</p>
      ) : (
        <div className="space-y-3">
          {requests.map((request) => {
            const toggleAction = markAssistanceHandled.bind(
              null,
              request.id,
              request.status !== "HANDLED"
            );

            return (
              <div
                key={request.id}
                className={`rounded-lg border p-4 ${
                  request.status === "NEW" ? "border-emerald-300 bg-emerald-50" : "border-black/10 bg-white"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium text-neutral-900">{request.name}</p>
                    <p className="text-sm text-neutral-500">
                      <a className="hover:underline" href={`mailto:${request.email}`}>
                        {request.email}
                      </a>
                      {request.phone && <> · {request.phone}</>}
                    </p>
                  </div>
                  <p className="text-xs text-neutral-400">
                    {new Intl.DateTimeFormat("it-IT", { dateStyle: "short", timeStyle: "short" }).format(
                      request.createdAt
                    )}
                  </p>
                </div>

                <p className="mt-2 whitespace-pre-line text-neutral-700">{request.message}</p>

                <form action={toggleAction} className="mt-3">
                  <button
                    type="submit"
                    className="rounded px-3 py-1.5 text-sm text-emerald-700 hover:bg-emerald-100"
                  >
                    {request.status === "NEW" ? "Segna come gestita" : "Segna come da gestire"}
                  </button>
                </form>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
