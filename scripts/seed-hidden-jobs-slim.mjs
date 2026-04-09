/**
 * Generates data/hidden-jobs.json from a compact table (id|company|min|max|location|roleName).
 * Run: node scripts/seed-hidden-jobs-slim.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const dest = path.join(root, 'data', 'hidden-jobs.json');

const table = `
33|Dresma Technologies|4.5|6|Gurgaon|Frontend Engineer
6570|Paper plane  design solutions|6|7|Mumbai|Frontend Engineer
6233|Seventh triangle|4|7|Noida|Frontend Engineer
6796|Teal India|7|8|Bangalore|Frontend Engineer
6456|Fourbrick Technology|4|8.4|Noida|Frontend Engineer
6149|Shri Genesis|4.5|6|Jaipur|Frontend Engineer
4271|Xgrowth|7|12|Noida|Frontend Engineer
4370|Culture Holidays|3|4|Gurgaon|Frontend Engineer
7675|Recotap ABM Platform|6|10|Bangalore|Frontend Engineer
3936|Leadrat|4|6|Bangalore|Frontend Engineer
6528|Tracxn|4|4|Bangalore|Frontend Engineer
7144|Byldd|5|6|Remote|Frontend Engineer
3819|Ultimez Technology|8|11|Remote|Frontend Engineer
1424|Mantra Care|5|10|Delhi|Frontend Engineer
7343|Entire techno pvt ltd|5|7|Delhi|Frontend Engineer
5424|WagerGeeks Private Limited|3.5|6.5|Remote|Frontend Engineer
6334|Maxlence Consulting|5|6|Gurgaon|Frontend Engineer
7685|Turia|5|9|Bangalore|Frontend Engineer
7475|KNNX Corp.|4|4.5|Noida|Frontend Engineer
7691|ContactPoint360|6|10|Remote|Frontend Engineer
7738|Revenza Tech Private limited|3|5|Noida|Frontend Engineer
7720|Intelegain Technologies pvt ltd|4|6|Mumbai|Frontend Engineer
7560|Torry harris business solutions|4.5|5.5|Bangalore|Frontend Engineer
7731|GetHyr|8|13|Noida|Frontend Engineer
7683|Turia|3.6|4|Bangalore|Frontend Engineer
7562|Wafer Technologies|3|6|Goa|Frontend Engineer
6535|Momentus Digital|6|12|Gurgaon|Frontend Engineer
7733|Refrens Internet Pvt ltd|10|12|Surat|Frontend Engineer
7616|sticky cards|7|10|Remote|Frontend Engineer
7710|Toystack|6|10|Bangalore|Frontend Engineer
7712|Appstorys|8|12|Noida|Frontend Engineer
904|Arramton|4.5|6|Delhi|Frontend Engineer
7713|Fraxxra Tech|3.6|5.5|Noida|Frontend Engineer
7709|Toystack|6|10|Bangalore|Backend Engineer
7702|HCLTech|5|7|Noida|Frontend Engineer
6249|ContactPoint360|6|12|Remote|Backend Engineer
7680|Suretek Infosoft Pvt. Ltd|9|12|Delhi|Frontend Engineer
7698|Delhivery|10|15|Gurgaon|Frontend Engineer
7653|WLDD PVT LTD|8|11|Bangalore|Frontend Engineer
7704|Ritchoiz|7|8|Remote|Frontend Engineer
5582|Narola infotech|3.6|7.2|Surat|Frontend Engineer
7336|Khata Book|10|11|Bangalore|Frontend Engineer
7627|Antino Labs|4|8|Gurgaon|Frontend Engineer
7687|NHN Soltuions|7|8|Pune|Frontend Engineer
7688|NHN Soltuions|7|8|Pune|Frontend Engineer
7553|Medicheck Hospitals|3|6|Faridabad|Frontend Engineer
6951|Excelerate|3|4|Remote|Frontend Engineer
7637|Excelerate|3|4|Remote|Frontend Engineer
7592|Confido Landbase|3.5|6|Gurgaon|Frontend Engineer
7585|Webtrix Solutions|3|3|Pune|Frontend Engineer
7595|Diagnal Technologies|4|5|Kerala|Frontend Engineer
7557|Rightfit|5|10|Bangalore|Frontend Engineer
7540|HuntYourTribe|5|6|Remote|Frontend Engineer
7426|Serri|4|9|Bangalore|Frontend Engineer
5776|Infinity assurance solutions pvt ltd|3|5|Delhi|Frontend Engineer
6959|Astra Security|4|8|Bangalore|Frontend Engineer
6188|Securepay|5|7|Dehradun|Frontend Engineer
7208|Script Jet It Services|3|8|Surat|Frontend Engineer
7118|Applyo|6|10|Bangalore|Frontend Engineer
3367|Techferry|5|8|Remote|Frontend Engineer
6445|Park+|7|10|Gurgaon|Frontend Engineer
4918|Solkuu|6|10|Bangalore|Frontend Engineer
5716|Antino Labs|6|9|Bangalore|Frontend Engineer
563|The Read Better Company|4|10|Remote|Frontend Engineer
6971|Spotnana|15|20|Bangalore|Frontend Engineer
6986|Zupee|10|15|Gurgaon|Frontend Engineer
3645|Squareboat|6|11|Gurgaon|Frontend Engineer
2404|Sketch Brahma Technologies|4|4.5|Bangalore|Backend Engineer
6670|Codalaya er works|7|12|Remote|Frontend Engineer
6484|Intellisavvy|4|10|Remote|Frontend Engineer
6488|Dayzero.ai|4|9|Remote|Frontend Engineer
6313|NutriTap|5|8|Gurgaon|Frontend Engineer
4036|Appiness|8|11|Bangalore|Frontend Engineer
6447|Newtown School|6|9|Gurgaon|Frontend Engineer
4133|SquareOps|5|6|Gurgaon|Frontend Engineer
6314|Massive Mobility|4|7.5|Gurgaon|Frontend Engineer
6395|MakeForms|7|12|Mumbai|Frontend Engineer
6176|Propacity|8|15|Delhi|Frontend Engineer
6297|Eye Mantra Hospital|5|8|Delhi|Frontend Engineer
6158|Travclan|7|14|Delhi|Frontend Engineer
6285|Fitelo|5|7|Gurgaon|Frontend Engineer
6198|TraceLink|10|14|Pune|Frontend Engineer
6251|Mobulous Technologies|5|8.4|Noida|Frontend Engineer
6140|Texperia tech solutions|6|8|Bangalore|Frontend Engineer
`.trim();

const rows = table.split('\n').filter(Boolean);
const jobs = rows.map((line, idx) => {
  const [id, companyName, minS, maxS, loc, roleName] = line.split('|');
  return {
    id: Number(id),
    companyName: companyName.trim(),
    minCTC: Number(minS),
    maxCTC: Number(maxS),
    expirationDateTime: '2026-06-30T12:00:00.000Z',
    description: null,
    newDescription: null,
    alertMessage: null,
    yearsOfExperience: 0,
    status: 4,
    closedReasonType: 3,
    closedReason: null,
    offersInternship: false,
    internshipDuration: 0,
    internshipStipend: 0,
    isProCompany: false,
    JobRole: { id: roleName.includes('Backend') ? 2 : 1, name: roleName.trim() },
    JobLocations: [{ id: idx + 1, name: loc.trim() }],
    Company: null,
  };
});

fs.mkdirSync(path.dirname(dest), { recursive: true });
fs.writeFileSync(dest, JSON.stringify(jobs, null, 2), 'utf8');
console.log(`Wrote ${jobs.length} slim jobs to data/hidden-jobs.json`);
console.log('Replace with your full export: node scripts/import-hidden-jobs.mjs <your.json>');
