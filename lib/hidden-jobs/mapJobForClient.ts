import type { HiddenJobOpening, HiddenJobOpeningClient } from './types';

export function mapHiddenJobForClient(job: HiddenJobOpening): HiddenJobOpeningClient {
  const { Company, ...rest } = job;
  return { ...rest, companyRecord: Company ?? null };
}

export function mapHiddenJobsForClient(jobs: HiddenJobOpening[]): HiddenJobOpeningClient[] {
  return jobs.map(mapHiddenJobForClient);
}
