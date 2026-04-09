import HiddenJobsClient from "./HiddenJobsClient";
import WebPageSchema from "@/components/schemas/WebPageSchema";
import { mapHiddenJobsForClient } from "@/lib/hidden-jobs/mapJobForClient";
import { loadHiddenJobs } from "@/lib/hidden-jobs/loadHiddenJobs";
import type { HiddenJobOpeningClient } from "@/lib/hidden-jobs/types";

export default async function HiddenJobsPage() {
  const jobs = await loadHiddenJobs();
  const forClient = mapHiddenJobsForClient(jobs);
  const serializable = JSON.parse(JSON.stringify(forClient)) as HiddenJobOpeningClient[];

  return (
    <>
      <h1 className="sr-only">Hidden jobs reference board</h1>
      <WebPageSchema
        path="/hidden-jobs"
        name="Hidden jobs board"
        description="Reference listings of tech job openings with filters for role, location, and compensation bands."
        keywords="hidden jobs, tech jobs India, developer roles, CTC, placements"
      />
      {jobs.length === 0 ? (
        <div className="min-h-[50vh] flex items-center justify-center px-4 pt-28 pb-16">
          <div className="max-w-lg text-center rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <p className="font-extrabold text-slate-900 text-lg">No job data loaded</p>
            <p className="mt-2 text-sm text-slate-600">
              Add <code className="bg-slate-100 px-1 rounded">data/hidden-jobs.json</code> (JSON array) or run{' '}
              <code className="bg-slate-100 px-1 rounded">npm run seed:hidden-jobs</code> /{' '}
              <code className="bg-slate-100 px-1 rounded">npm run import:hidden-jobs -- path/to/export.json</code>
            </p>
          </div>
        </div>
      ) : (
        <HiddenJobsClient jobs={serializable} />
      )}
    </>
  );
}
