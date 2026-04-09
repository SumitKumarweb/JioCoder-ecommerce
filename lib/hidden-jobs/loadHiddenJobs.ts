import 'server-only';
import { readFile } from 'fs/promises';
import path from 'path';
import type { HiddenJobOpening } from './types';

export async function loadHiddenJobs(): Promise<HiddenJobOpening[]> {
  try {
    const fp = path.join(process.cwd(), 'data', 'hidden-jobs.json');
    const raw = await readFile(fp, 'utf8');
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed as HiddenJobOpening[];
  } catch {
    return [];
  }
}
