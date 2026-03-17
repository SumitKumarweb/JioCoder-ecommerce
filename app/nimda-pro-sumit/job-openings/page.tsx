'use client';

import { useMemo, useState } from "react";

type JobApplicantStatus = {
  id: number;
  JobApplicantId: number;
  status: number;
  date: string | null;
  createdAt: string;
  updatedAt: string;
};

type JobApplicant = {
  id: number;
  UserId: number;
  JobOpeningId: number;
  status: number;
  interviewDate: string | null;
  ctcOffered: string | null;
  yoe: number | null;
  rejectionReason: string | null;
  createdAt: string;
  updatedAt: string;
  JobApplicantStatuses?: JobApplicantStatus[];
};

type JobLocation = {
  id: number;
  name: string;
  JobOpeningId: number;
  createdAt: string;
  updatedAt: string;
};

type JobRole = {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
};

type Company = {
  id: number;
  name: string;
  logo: string | null;
  pocName: string | null;
  pocNumber: string | null;
  pocEmail: string | null;
  createdAt: string;
  updatedAt: string;
  CollegeId?: number;
  [key: string]: any;
};

type JobOpening = {
  id: number;
  companyName: string;
  minCTC: number;
  maxCTC: number;
  expirationDateTime: string;
  description: string | null;
  newDescription: any;
  alertMessage: string | null;
  alertConfirmationMessage: string | null;
  JobRoleId: number;
  yearsOfExperience: number;
  status: number;
  closedReasonType: number | null;
  closedReason: string | null;
  showCompanyToStudents: boolean;
  companyPOCEmail: string | null;
  isPrivate: boolean;
  offersInternship: boolean;
  internshipDuration: number;
  internshipStipend: number;
  isAlumniJob: boolean;
  isProCompany: boolean;
  isJobPortal: boolean;
  createdAt: string;
  updatedAt: string;
  CompanyId: number | null;
  CollegeId: number;
  JobApplicants?: JobApplicant[];
  JobLocations?: JobLocation[];
  JobRole?: JobRole;
  Company?: Company | null;
  [key: string]: any;
};

// Replace this with an API call later.
const MOCK_JOB_OPENINGS: any[] = [
    {
      "id": 8009,
      "companyName": "Indicorp IT Solutions",
      "minCTC": 4,
      "maxCTC": 5,
      "expirationDateTime": "2026-03-20T11:49:00.000Z",
      "description": "<p class=\"\"></p><p class=\"\"></p><p class=\"\">🔥 IMMEDIATE JOINERS REQUIRED | URGENT HIRING 🔥<br><br>🚀 <a target=\"_blank\" rel=\"noopener noreferrer nofollow\" class=\"text-blue-500 hover:text-blue-700 underline cursor-pointer _2dcfbc63 e2bbe84b\" href=\"https://www.linkedin.com/company/indicorp-it-solutions-pvt-ltd/\"><span style=\"color: rgb(10, 102, 194)\"><strong>IndiCorp IT Solutions Pvt Ltd</strong></span></a> is hiring MERN Stack Developers for an immediate onsite opportunity.<br><br>📍 Location: Noida<br>🏢 Work Mode: Full-Time | Onsite<br>⏳ Experience: 1–2 Years<br>💰 Salary Package: ₹4 LPA – ₹5 LPA (Based on skills)<br></p>",
      "newDescription": {
        "type": "doc",
        "content": [
          {
            "type": "paragraph",
            "attrs": {
              "textAlign": null
            }
          },
          {
            "type": "paragraph",
            "attrs": {
              "textAlign": null
            }
          },
          {
            "type": "paragraph",
            "attrs": {
              "textAlign": null
            },
            "content": [
              {
                "text": "🔥 IMMEDIATE JOINERS REQUIRED | URGENT HIRING 🔥",
                "type": "text"
              },
              {
                "type": "hardBreak"
              },
              {
                "type": "hardBreak"
              },
              {
                "text": "🚀 ",
                "type": "text"
              },
              {
                "text": "IndiCorp IT Solutions Pvt Ltd",
                "type": "text",
                "marks": [
                  {
                    "type": "link",
                    "attrs": {
                      "rel": "noopener noreferrer nofollow",
                      "href": "https://www.linkedin.com/company/indicorp-it-solutions-pvt-ltd/",
                      "class": "text-blue-500 hover:text-blue-700 underline cursor-pointer _2dcfbc63 e2bbe84b",
                      "target": "_blank"
                    }
                  },
                  {
                    "type": "textStyle",
                    "attrs": {
                      "color": "rgb(10, 102, 194)"
                    }
                  },
                  {
                    "type": "bold"
                  }
                ]
              },
              {
                "text": " is hiring MERN Stack Developers for an immediate onsite opportunity.",
                "type": "text"
              },
              {
                "type": "hardBreak"
              },
              {
                "type": "hardBreak"
              },
              {
                "text": "📍 Location: Noida",
                "type": "text"
              },
              {
                "type": "hardBreak"
              },
              {
                "text": "🏢 Work Mode: Full-Time | Onsite",
                "type": "text"
              },
              {
                "type": "hardBreak"
              },
              {
                "text": "⏳ Experience: 1–2 Years",
                "type": "text"
              },
              {
                "type": "hardBreak"
              },
              {
                "text": "💰 Salary Package: ₹4 LPA – ₹5 LPA (Based on skills)",
                "type": "text"
              },
              {
                "type": "hardBreak"
              }
            ]
          }
        ]
      },
      "alertMessage": null,
      "alertConfirmationMessage": null,
      "JobRoleId": 2,
      "yearsOfExperience": 1,
      "status": 3,
      "closedReasonType": null,
      "closedReason": null,
      "showCompanyToStudents": true,
      "companyPOCEmail": "varsha.tiwari@indicorpit.co.in",
      "isPrivate": false,
      "offersInternship": false,
      "internshipDuration": 0,
      "internshipStipend": 0,
      "isAlumniJob": false,
      "isProCompany": false,
      "isJobPortal": false,
      "jobTags": null,
      "jobRedirectionLink": null,
      "category": null,
      "domain": null,
      "size": null,
      "bootstrappedOrFunded": null,
      "revenue": null,
      "source": null,
      "createdAt": "2026-02-05T10:17:55.185Z",
      "updatedAt": "2026-03-17T11:49:11.174Z",
      "CompanyId": 2346,
      "CollegeId": 4633,
      "JobApplicants": [],
      "JobLocations": [
        {
          "id": 19484,
          "name": "Noida",
          "JobOpeningId": 8009,
          "createdAt": "2026-03-17T11:48:56.383Z",
          "updatedAt": "2026-03-17T11:48:56.383Z"
        }
      ],
      "JobRole": {
        "id": 2,
        "name": "Backend Engineer",
        "createdAt": "2023-02-28T09:10:58.719Z",
        "updatedAt": "2023-03-01T12:15:43.646Z"
      },
      "Company": {
        "name": "Indicorp IT Solutions",
        "logo": null
      },
      "canApply": true,
      "notApplicableReason": null
    },
    {
      "id": 8193,
      "companyName": "TheSmartBridge",
      "minCTC": 5,
      "maxCTC": 6,
      "expirationDateTime": "2026-03-18T11:11:00.000Z",
      "description": "<h1><strong>Job role is MongoDB trainer</strong></h1><h1><strong>candidate must know mongodb and Django</strong></h1><h1><strong>Accomodation and transport will be given by company </strong></h1><h1><strong>2 sharpenerians are already working </strong></h1><h1></h1>",
      "newDescription": {
        "type": "doc",
        "content": [
          {
            "type": "heading",
            "attrs": {
              "level": 1,
              "textAlign": null
            },
            "content": [
              {
                "text": "Job role is MongoDB trainer",
                "type": "text",
                "marks": [
                  {
                    "type": "bold"
                  }
                ]
              }
            ]
          },
          {
            "type": "heading",
            "attrs": {
              "level": 1,
              "textAlign": null
            },
            "content": [
              {
                "text": "candidate must know mongodb and Django",
                "type": "text",
                "marks": [
                  {
                    "type": "bold"
                  }
                ]
              }
            ]
          },
          {
            "type": "heading",
            "attrs": {
              "level": 1,
              "textAlign": null
            },
            "content": [
              {
                "text": "Accomodation and transport will be given by company ",
                "type": "text",
                "marks": [
                  {
                    "type": "bold"
                  }
                ]
              }
            ]
          },
          {
            "type": "heading",
            "attrs": {
              "level": 1,
              "textAlign": null
            },
            "content": [
              {
                "text": "2 sharpenerians are already working ",
                "type": "text",
                "marks": [
                  {
                    "type": "bold"
                  }
                ]
              }
            ]
          },
          {
            "type": "heading",
            "attrs": {
              "level": 1,
              "textAlign": null
            }
          }
        ]
      },
      "alertMessage": null,
      "alertConfirmationMessage": null,
      "JobRoleId": 2,
      "yearsOfExperience": 1,
      "status": 2,
      "closedReasonType": null,
      "closedReason": null,
      "showCompanyToStudents": true,
      "companyPOCEmail": "sridevi@thesmartbridge.com",
      "isPrivate": false,
      "offersInternship": false,
      "internshipDuration": 0,
      "internshipStipend": 0,
      "isAlumniJob": false,
      "isProCompany": false,
      "isJobPortal": false,
      "jobTags": null,
      "jobRedirectionLink": null,
      "category": "Service",
      "domain": "Ed-Tech",
      "size": "Startup (<100)",
      "bootstrappedOrFunded": null,
      "revenue": "$6.1 million",
      "source": "Indeed",
      "createdAt": "2026-03-13T10:46:33.924Z",
      "updatedAt": "2026-03-16T11:11:39.287Z",
      "CompanyId": 2315,
      "CollegeId": 4633,
      "JobApplicants": [],
      "JobLocations": [
        {
          "id": 19455,
          "name": "Jaipur",
          "JobOpeningId": 8193,
          "createdAt": "2026-03-13T11:30:10.899Z",
          "updatedAt": "2026-03-13T11:30:10.899Z"
        }
      ],
      "JobRole": {
        "id": 2,
        "name": "Backend Engineer",
        "createdAt": "2023-02-28T09:10:58.719Z",
        "updatedAt": "2023-03-01T12:15:43.646Z"
      },
      "Company": {
        "name": "TheSmartBridge",
        "logo": "https://sharpener.blob.core.windows.net/companylogos/smartbridge_educational_services_pvt_ltd_logo.jpeg"
      },
      "canApply": true,
      "notApplicableReason": null
    },
    {
      "id": 8138,
      "companyName": "Synegrow",
      "minCTC": 4.5,
      "maxCTC": 6,
      "expirationDateTime": "2026-03-18T07:38:00.000Z",
      "description": null,
      "newDescription": null,
      "alertMessage": "<p><strong>Role- Full stack developer</strong></p><p><strong>Its a start up company but they have some good projects</strong></p>",
      "alertConfirmationMessage": null,
      "JobRoleId": 2,
      "yearsOfExperience": 1,
      "status": 3,
      "closedReasonType": null,
      "closedReason": null,
      "showCompanyToStudents": true,
      "companyPOCEmail": "Paras@synegrow.com",
      "isPrivate": false,
      "offersInternship": false,
      "internshipDuration": 0,
      "internshipStipend": 0,
      "isAlumniJob": false,
      "isProCompany": false,
      "isJobPortal": false,
      "jobTags": null,
      "jobRedirectionLink": null,
      "category": null,
      "domain": null,
      "size": null,
      "bootstrappedOrFunded": null,
      "revenue": null,
      "source": null,
      "createdAt": "2026-02-27T11:07:31.442Z",
      "updatedAt": "2026-03-16T07:38:37.156Z",
      "CompanyId": 2403,
      "CollegeId": 4633,
      "JobApplicants": [],
      "JobLocations": [
        {
          "id": 19377,
          "name": "Remote",
          "JobOpeningId": 8138,
          "createdAt": "2026-03-06T04:43:59.752Z",
          "updatedAt": "2026-03-06T04:43:59.752Z"
        }
      ],
      "JobRole": {
        "id": 2,
        "name": "Backend Engineer",
        "createdAt": "2023-02-28T09:10:58.719Z",
        "updatedAt": "2023-03-01T12:15:43.646Z"
      },
      "Company": {
        "name": "Synegrow",
        "logo": null
      },
      "canApply": true,
      "notApplicableReason": null
    },
    {
      "id": 8139,
      "companyName": "Synegrow",
      "minCTC": 4.5,
      "maxCTC": 6,
      "expirationDateTime": "2026-03-18T07:38:00.000Z",
      "description": null,
      "newDescription": null,
      "alertMessage": "<p><strong>Role- Full stack developer</strong></p><p><strong>Its a start up company but they have some good projects</strong></p>",
      "alertConfirmationMessage": null,
      "JobRoleId": 1,
      "yearsOfExperience": 1,
      "status": 3,
      "closedReasonType": null,
      "closedReason": null,
      "showCompanyToStudents": true,
      "companyPOCEmail": "Paras@synegrow.com",
      "isPrivate": false,
      "offersInternship": false,
      "internshipDuration": 0,
      "internshipStipend": 0,
      "isAlumniJob": false,
      "isProCompany": false,
      "isJobPortal": false,
      "jobTags": null,
      "jobRedirectionLink": null,
      "category": null,
      "domain": null,
      "size": null,
      "bootstrappedOrFunded": null,
      "revenue": null,
      "source": null,
      "createdAt": "2026-02-27T11:08:31.279Z",
      "updatedAt": "2026-03-16T07:38:44.564Z",
      "CompanyId": 2403,
      "CollegeId": 4633,
      "JobApplicants": [],
      "JobLocations": [
        {
          "id": 19378,
          "name": "Remote",
          "JobOpeningId": 8139,
          "createdAt": "2026-03-06T04:44:06.535Z",
          "updatedAt": "2026-03-06T04:44:06.535Z"
        }
      ],
      "JobRole": {
        "id": 1,
        "name": "Frontend Engineer",
        "createdAt": "2023-02-23T11:10:53.498Z",
        "updatedAt": "2023-06-27T12:03:29.887Z"
      },
      "Company": {
        "name": "Synegrow",
        "logo": null
      },
      "canApply": true,
      "notApplicableReason": null
    },
    {
      "id": 8146,
      "companyName": "Maxlence Consulting",
      "minCTC": 7,
      "maxCTC": 8,
      "expirationDateTime": "2026-03-18T12:17:00.000Z",
      "description": "<h1>Job role is full stack </h1><h1>Candidates with 2.5+ years of experince required</h1><h1>CTC would be 50k-60k in hand </h1><h1></h1>",
      "newDescription": {
        "type": "doc",
        "content": [
          {
            "type": "heading",
            "attrs": {
              "level": 1,
              "textAlign": null
            },
            "content": [
              {
                "text": "Job role is full stack ",
                "type": "text"
              }
            ]
          },
          {
            "type": "heading",
            "attrs": {
              "level": 1,
              "textAlign": null
            },
            "content": [
              {
                "text": "Candidates with 2.5+ years of experince required",
                "type": "text"
              }
            ]
          },
          {
            "type": "heading",
            "attrs": {
              "level": 1,
              "textAlign": null
            },
            "content": [
              {
                "text": "CTC would be 50k-60k in hand ",
                "type": "text"
              }
            ]
          },
          {
            "type": "heading",
            "attrs": {
              "level": 1,
              "textAlign": null
            }
          }
        ]
      },
      "alertMessage": null,
      "alertConfirmationMessage": null,
      "JobRoleId": 1,
      "yearsOfExperience": 1,
      "status": 2,
      "closedReasonType": null,
      "closedReason": null,
      "showCompanyToStudents": true,
      "companyPOCEmail": "vishakha@maxlence.com.au",
      "isPrivate": false,
      "offersInternship": false,
      "internshipDuration": 0,
      "internshipStipend": 0,
      "isAlumniJob": false,
      "isProCompany": false,
      "isJobPortal": false,
      "jobTags": null,
      "jobRedirectionLink": null,
      "category": "Service",
      "domain": "Software Services",
      "size": "Startup (<100)",
      "bootstrappedOrFunded": "Bootstrapped",
      "revenue": "$7 million",
      "source": "Indeed",
      "createdAt": "2026-03-02T07:15:13.531Z",
      "updatedAt": "2026-03-16T12:17:02.479Z",
      "CompanyId": 1484,
      "CollegeId": 4633,
      "JobApplicants": [],
      "JobLocations": [
        {
          "id": 19315,
          "name": "Gurgaon",
          "JobOpeningId": 8146,
          "createdAt": "2026-03-02T07:15:13.539Z",
          "updatedAt": "2026-03-02T07:15:13.539Z"
        }
      ],
      "JobRole": {
        "id": 1,
        "name": "Frontend Engineer",
        "createdAt": "2023-02-23T11:10:53.498Z",
        "updatedAt": "2023-06-27T12:03:29.887Z"
      },
      "Company": {
        "name": "Maxlence Consulting",
        "logo": null
      },
      "canApply": true,
      "notApplicableReason": null
    },
    {
      "id": 8145,
      "companyName": "Maxlence Consulting",
      "minCTC": 7,
      "maxCTC": 8,
      "expirationDateTime": "2026-03-18T12:17:00.000Z",
      "description": "<h1>Job role is full stack </h1><h1>Candidates with 2.5+ years of experince required</h1><h1>CTC would be 50k-60k in hand </h1><h1></h1>",
      "newDescription": {
        "type": "doc",
        "content": [
          {
            "type": "heading",
            "attrs": {
              "level": 1,
              "textAlign": null
            },
            "content": [
              {
                "text": "Job role is full stack ",
                "type": "text"
              }
            ]
          },
          {
            "type": "heading",
            "attrs": {
              "level": 1,
              "textAlign": null
            },
            "content": [
              {
                "text": "Candidates with 2.5+ years of experince required",
                "type": "text"
              }
            ]
          },
          {
            "type": "heading",
            "attrs": {
              "level": 1,
              "textAlign": null
            },
            "content": [
              {
                "text": "CTC would be 50k-60k in hand ",
                "type": "text"
              }
            ]
          },
          {
            "type": "heading",
            "attrs": {
              "level": 1,
              "textAlign": null
            }
          }
        ]
      },
      "alertMessage": null,
      "alertConfirmationMessage": null,
      "JobRoleId": 2,
      "yearsOfExperience": 1,
      "status": 3,
      "closedReasonType": null,
      "closedReason": null,
      "showCompanyToStudents": true,
      "companyPOCEmail": "vishakha@maxlence.com.au",
      "isPrivate": false,
      "offersInternship": false,
      "internshipDuration": 0,
      "internshipStipend": 0,
      "isAlumniJob": false,
      "isProCompany": false,
      "isJobPortal": false,
      "jobTags": null,
      "jobRedirectionLink": null,
      "category": "Service",
      "domain": "Software Services",
      "size": "Startup (<100)",
      "bootstrappedOrFunded": "Bootstrapped",
      "revenue": "$7 million",
      "source": "Indeed",
      "createdAt": "2026-03-02T07:14:35.756Z",
      "updatedAt": "2026-03-16T12:17:21.616Z",
      "CompanyId": 1484,
      "CollegeId": 4633,
      "JobApplicants": [],
      "JobLocations": [
        {
          "id": 19314,
          "name": "Gurgaon",
          "JobOpeningId": 8145,
          "createdAt": "2026-03-02T07:14:35.764Z",
          "updatedAt": "2026-03-02T07:14:35.764Z"
        }
      ],
      "JobRole": {
        "id": 2,
        "name": "Backend Engineer",
        "createdAt": "2023-02-28T09:10:58.719Z",
        "updatedAt": "2023-03-01T12:15:43.646Z"
      },
      "Company": {
        "name": "Maxlence Consulting",
        "logo": null
      },
      "canApply": true,
      "notApplicableReason": null
    },
    {
      "id": 5307,
      "companyName": "Weaddo",
      "minCTC": 5,
      "maxCTC": 6,
      "expirationDateTime": "2026-03-20T05:36:00.000Z",
      "description": "<h1>2 alumini are already working there. I year min exp is reqd</h1>",
      "newDescription": {
        "type": "doc",
        "content": [
          {
            "type": "heading",
            "attrs": {
              "level": 1,
              "textAlign": null
            },
            "content": [
              {
                "text": "2 alumini are already working there. I year min exp is reqd",
                "type": "text"
              }
            ]
          }
        ]
      },
      "alertMessage": null,
      "alertConfirmationMessage": null,
      "JobRoleId": 2,
      "yearsOfExperience": 0,
      "status": 3,
      "closedReasonType": 1,
      "closedReason": "hired from outside",
      "showCompanyToStudents": true,
      "companyPOCEmail": "hiring@weaddo.com",
      "isPrivate": false,
      "offersInternship": false,
      "internshipDuration": 0,
      "internshipStipend": 0,
      "isAlumniJob": false,
      "isProCompany": false,
      "isJobPortal": false,
      "jobTags": null,
      "jobRedirectionLink": null,
      "category": null,
      "domain": null,
      "size": null,
      "bootstrappedOrFunded": null,
      "revenue": null,
      "source": null,
      "createdAt": "2024-11-12T08:33:30.862Z",
      "updatedAt": "2026-03-17T05:36:18.192Z",
      "CompanyId": 955,
      "CollegeId": 4633,
      "JobApplicants": [],
      "JobLocations": [
        {
          "id": 19408,
          "name": "Gurgaon",
          "JobOpeningId": 5307,
          "createdAt": "2026-03-10T07:04:59.060Z",
          "updatedAt": "2026-03-10T07:04:59.060Z"
        }
      ],
      "JobRole": {
        "id": 2,
        "name": "Backend Engineer",
        "createdAt": "2023-02-28T09:10:58.719Z",
        "updatedAt": "2023-03-01T12:15:43.646Z"
      },
      "Company": {
        "name": "Weaddo",
        "logo": null
      },
      "canApply": true,
      "notApplicableReason": null
    },
    {
      "id": 8205,
      "companyName": "GoGeekz ",
      "minCTC": 3,
      "maxCTC": 4,
      "expirationDateTime": "2026-03-18T12:35:00.000Z",
      "description": "<h1><strong>job role is full stack </strong></h1><h1><strong>Work from home </strong></h1><h1><strong>working hours - 5:30pm-2am </strong></h1><h1><strong>Toronto, canada  based company </strong></h1><h1><strong>6 months experince is required </strong></h1>",
      "newDescription": {
        "type": "doc",
        "content": [
          {
            "type": "heading",
            "attrs": {
              "level": 1,
              "textAlign": null
            },
            "content": [
              {
                "text": "job role is full stack ",
                "type": "text",
                "marks": [
                  {
                    "type": "bold"
                  }
                ]
              }
            ]
          },
          {
            "type": "heading",
            "attrs": {
              "level": 1,
              "textAlign": null
            },
            "content": [
              {
                "text": "Work from home ",
                "type": "text",
                "marks": [
                  {
                    "type": "bold"
                  }
                ]
              }
            ]
          },
          {
            "type": "heading",
            "attrs": {
              "level": 1,
              "textAlign": null
            },
            "content": [
              {
                "text": "working hours - 5:30pm-2am ",
                "type": "text",
                "marks": [
                  {
                    "type": "bold"
                  }
                ]
              }
            ]
          },
          {
            "type": "heading",
            "attrs": {
              "level": 1,
              "textAlign": null
            },
            "content": [
              {
                "text": "Toronto, canada  based company ",
                "type": "text",
                "marks": [
                  {
                    "type": "bold"
                  }
                ]
              }
            ]
          },
          {
            "type": "heading",
            "attrs": {
              "level": 1,
              "textAlign": null
            },
            "content": [
              {
                "text": "6 months experince is required ",
                "type": "text",
                "marks": [
                  {
                    "type": "bold"
                  }
                ]
              }
            ]
          }
        ]
      },
      "alertMessage": null,
      "alertConfirmationMessage": null,
      "JobRoleId": 2,
      "yearsOfExperience": 0,
      "status": 5,
      "closedReasonType": null,
      "closedReason": null,
      "showCompanyToStudents": true,
      "companyPOCEmail": "niyati@gogeekz.com",
      "isPrivate": false,
      "offersInternship": false,
      "internshipDuration": 0,
      "internshipStipend": 0,
      "isAlumniJob": false,
      "isProCompany": false,
      "isJobPortal": false,
      "jobTags": null,
      "jobRedirectionLink": null,
      "category": "Service",
      "domain": "Software Services",
      "size": "Startup (<100)",
      "bootstrappedOrFunded": "Bootstrapped",
      "revenue": null,
      "source": "Indeed",
      "createdAt": "2026-03-16T12:34:56.766Z",
      "updatedAt": "2026-03-17T04:35:42.709Z",
      "CompanyId": 2433,
      "CollegeId": 4633,
      "JobApplicants": [],
      "JobLocations": [
        {
          "id": 19470,
          "name": "Remote",
          "JobOpeningId": 8205,
          "createdAt": "2026-03-16T12:34:56.771Z",
          "updatedAt": "2026-03-16T12:34:56.771Z"
        }
      ],
      "JobRole": {
        "id": 2,
        "name": "Backend Engineer",
        "createdAt": "2023-02-28T09:10:58.719Z",
        "updatedAt": "2023-03-01T12:15:43.646Z"
      },
      "Company": {
        "name": "GoGeekz ",
        "logo": "https://sharpener.blob.core.windows.net/companylogos/gogeekz_logo.jpeg"
      },
      "canApply": true,
      "notApplicableReason": null
    },
    {
      "id": 4204,
      "companyName": "Nablasol",
      "minCTC": 2.76,
      "maxCTC": 3,
      "expirationDateTime": "2026-03-19T06:38:00.000Z",
      "description": null,
      "newDescription": null,
      "alertMessage": "<h1><strong>Role- PHP Developer</strong></h1><h1><strong>6 months internship with 10-15k stipend</strong></h1><h1><strong>After that 2.76-3lpa depends on your performance</strong></h1><h1><strong>If you are ready to learn PHP, then only apply for this job</strong></h1><h1><strong>3 sharpenerians are working in this company and got converted to full time also.</strong></h1>",
      "alertConfirmationMessage": null,
      "JobRoleId": 2,
      "yearsOfExperience": 0,
      "status": 5,
      "closedReasonType": 1,
      "closedReason": "placed",
      "showCompanyToStudents": true,
      "companyPOCEmail": "hr@nablasol.com",
      "isPrivate": false,
      "offersInternship": true,
      "internshipDuration": 6,
      "internshipStipend": 10000,
      "isAlumniJob": false,
      "isProCompany": false,
      "isJobPortal": false,
      "jobTags": null,
      "jobRedirectionLink": null,
      "category": null,
      "domain": null,
      "size": null,
      "bootstrappedOrFunded": null,
      "revenue": null,
      "source": null,
      "createdAt": "2024-06-28T11:58:58.785Z",
      "updatedAt": "2026-03-17T10:25:17.092Z",
      "CompanyId": 88,
      "CollegeId": 4633,
      "JobApplicants": [],
      "JobLocations": [
        {
          "id": 16457,
          "name": "Remote",
          "JobOpeningId": 4204,
          "createdAt": "2025-07-04T08:26:39.650Z",
          "updatedAt": "2025-07-04T08:26:39.650Z"
        }
      ],
      "JobRole": {
        "id": 2,
        "name": "Backend Engineer",
        "createdAt": "2023-02-28T09:10:58.719Z",
        "updatedAt": "2023-03-01T12:15:43.646Z"
      },
      "Company": {
        "name": "Nablasol",
        "logo": null
      },
      "canApply": true,
      "notApplicableReason": null
    },
    {
      "id": 8206,
      "companyName": "GoGeekz ",
      "minCTC": 3,
      "maxCTC": 4,
      "expirationDateTime": "2026-03-18T12:35:00.000Z",
      "description": "<h1><strong>job role is full stack </strong></h1><h1><strong>Work from home </strong></h1><h1><strong>working hours - 5:30pm-2am </strong></h1><h1><strong>Toronto, canada  based company </strong></h1><h1><strong>6 months experince is required </strong></h1>",
      "newDescription": {
        "type": "doc",
        "content": [
          {
            "type": "heading",
            "attrs": {
              "level": 1,
              "textAlign": null
            },
            "content": [
              {
                "text": "job role is full stack ",
                "type": "text",
                "marks": [
                  {
                    "type": "bold"
                  }
                ]
              }
            ]
          },
          {
            "type": "heading",
            "attrs": {
              "level": 1,
              "textAlign": null
            },
            "content": [
              {
                "text": "Work from home ",
                "type": "text",
                "marks": [
                  {
                    "type": "bold"
                  }
                ]
              }
            ]
          },
          {
            "type": "heading",
            "attrs": {
              "level": 1,
              "textAlign": null
            },
            "content": [
              {
                "text": "working hours - 5:30pm-2am ",
                "type": "text",
                "marks": [
                  {
                    "type": "bold"
                  }
                ]
              }
            ]
          },
          {
            "type": "heading",
            "attrs": {
              "level": 1,
              "textAlign": null
            },
            "content": [
              {
                "text": "Toronto, canada  based company ",
                "type": "text",
                "marks": [
                  {
                    "type": "bold"
                  }
                ]
              }
            ]
          },
          {
            "type": "heading",
            "attrs": {
              "level": 1,
              "textAlign": null
            },
            "content": [
              {
                "text": "6 months experince is required ",
                "type": "text",
                "marks": [
                  {
                    "type": "bold"
                  }
                ]
              }
            ]
          }
        ]
      },
      "alertMessage": null,
      "alertConfirmationMessage": null,
      "JobRoleId": 1,
      "yearsOfExperience": 0,
      "status": 5,
      "closedReasonType": null,
      "closedReason": null,
      "showCompanyToStudents": true,
      "companyPOCEmail": "niyati@gogeekz.com",
      "isPrivate": false,
      "offersInternship": false,
      "internshipDuration": 0,
      "internshipStipend": 0,
      "isAlumniJob": false,
      "isProCompany": false,
      "isJobPortal": false,
      "jobTags": null,
      "jobRedirectionLink": null,
      "category": "Service",
      "domain": "Software Services",
      "size": "Startup (<100)",
      "bootstrappedOrFunded": "Bootstrapped",
      "revenue": null,
      "source": "Indeed",
      "createdAt": "2026-03-16T12:35:31.405Z",
      "updatedAt": "2026-03-17T04:36:25.777Z",
      "CompanyId": 2433,
      "CollegeId": 4633,
      "JobApplicants": [],
      "JobLocations": [
        {
          "id": 19471,
          "name": "Remote",
          "JobOpeningId": 8206,
          "createdAt": "2026-03-16T12:35:31.411Z",
          "updatedAt": "2026-03-16T12:35:31.411Z"
        }
      ],
      "JobRole": {
        "id": 1,
        "name": "Frontend Engineer",
        "createdAt": "2023-02-23T11:10:53.498Z",
        "updatedAt": "2023-06-27T12:03:29.887Z"
      },
      "Company": {
        "name": "GoGeekz ",
        "logo": "https://sharpener.blob.core.windows.net/companylogos/gogeekz_logo.jpeg"
      },
      "canApply": true,
      "notApplicableReason": null
    },
    {
      "id": 8209,
      "companyName": "Firminiq systems",
      "minCTC": 8,
      "maxCTC": 14,
      "expirationDateTime": "2026-03-20T04:41:00.000Z",
      "description": null,
      "newDescription": null,
      "alertMessage": "<h2><strong>Node js Lead role</strong></h2><h2><strong>Looking for 3-4 years of experienced candidates</strong></h2>",
      "alertConfirmationMessage": null,
      "JobRoleId": 2,
      "yearsOfExperience": 2,
      "status": 2,
      "closedReasonType": null,
      "closedReason": null,
      "showCompanyToStudents": true,
      "companyPOCEmail": "hr@firminiq.com",
      "isPrivate": false,
      "offersInternship": false,
      "internshipDuration": 0,
      "internshipStipend": 0,
      "isAlumniJob": false,
      "isProCompany": false,
      "isJobPortal": false,
      "jobTags": null,
      "jobRedirectionLink": null,
      "category": null,
      "domain": null,
      "size": null,
      "bootstrappedOrFunded": null,
      "revenue": null,
      "source": null,
      "createdAt": "2026-03-17T04:41:25.278Z",
      "updatedAt": "2026-03-17T04:41:39.206Z",
      "CompanyId": 1869,
      "CollegeId": 4633,
      "JobApplicants": [],
      "JobLocations": [
        {
          "id": 19474,
          "name": "Chandigarh",
          "JobOpeningId": 8209,
          "createdAt": "2026-03-17T04:41:25.284Z",
          "updatedAt": "2026-03-17T04:41:25.284Z"
        }
      ],
      "JobRole": {
        "id": 2,
        "name": "Backend Engineer",
        "createdAt": "2023-02-28T09:10:58.719Z",
        "updatedAt": "2023-03-01T12:15:43.646Z"
      },
      "Company": {
        "name": "Firminiq systems",
        "logo": null
      },
      "canApply": false,
      "notApplicableReason": "Minimum 2 years of experience required"
    },
    {
      "id": 7187,
      "companyName": "Webkul Software",
      "minCTC": 5,
      "maxCTC": 9,
      "expirationDateTime": "2026-03-21T06:40:00.000Z",
      "description": "<h1> OFFLINE INTERVIEW. </h1>",
      "newDescription": {
        "type": "doc",
        "content": [
          {
            "type": "heading",
            "attrs": {
              "level": 1,
              "textAlign": null
            },
            "content": [
              {
                "text": " OFFLINE INTERVIEW. ",
                "type": "text"
              }
            ]
          }
        ]
      },
      "alertMessage": null,
      "alertConfirmationMessage": null,
      "JobRoleId": 1,
      "yearsOfExperience": 1,
      "status": 3,
      "closedReasonType": 5,
      "closedReason": "dn st",
      "showCompanyToStudents": true,
      "companyPOCEmail": "shivanichauhan.hr348@webkul.in",
      "isPrivate": false,
      "offersInternship": false,
      "internshipDuration": 0,
      "internshipStipend": 0,
      "isAlumniJob": false,
      "isProCompany": false,
      "isJobPortal": false,
      "jobTags": null,
      "jobRedirectionLink": null,
      "category": null,
      "domain": null,
      "size": null,
      "bootstrappedOrFunded": null,
      "revenue": null,
      "source": null,
      "createdAt": "2025-08-12T10:17:40.896Z",
      "updatedAt": "2026-03-17T05:56:31.856Z",
      "CompanyId": 1905,
      "CollegeId": 4633,
      "JobApplicants": [],
      "JobLocations": [
        {
          "id": 19476,
          "name": "Noida",
          "JobOpeningId": 7187,
          "createdAt": "2026-03-17T05:56:31.890Z",
          "updatedAt": "2026-03-17T05:56:31.890Z"
        }
      ],
      "JobRole": {
        "id": 1,
        "name": "Frontend Engineer",
        "createdAt": "2023-02-23T11:10:53.498Z",
        "updatedAt": "2023-06-27T12:03:29.887Z"
      },
      "Company": {
        "name": "Webkul Software",
        "logo": null
      },
      "canApply": true,
      "notApplicableReason": null
    },
    {
      "id": 150,
      "companyName": "Nebula Codes ",
      "minCTC": 4,
      "maxCTC": 7,
      "expirationDateTime": "2026-03-19T07:30:00.000Z",
      "description": "<h2>Salary will depend upon the interview and current salary<br></h2>",
      "newDescription": {
        "type": "doc",
        "content": [
          {
            "type": "heading",
            "attrs": {
              "level": 2,
              "textAlign": null
            },
            "content": [
              {
                "text": "Salary will depend upon the interview and current salary",
                "type": "text"
              },
              {
                "type": "hardBreak"
              }
            ]
          }
        ]
      },
      "alertMessage": null,
      "alertConfirmationMessage": null,
      "JobRoleId": 2,
      "yearsOfExperience": 1,
      "status": 3,
      "closedReasonType": 3,
      "closedReason": "nt st",
      "showCompanyToStudents": true,
      "companyPOCEmail": "rahul@nebula.codes",
      "isPrivate": false,
      "offersInternship": false,
      "internshipDuration": 0,
      "internshipStipend": 0,
      "isAlumniJob": false,
      "isProCompany": false,
      "isJobPortal": false,
      "jobTags": null,
      "jobRedirectionLink": null,
      "category": null,
      "domain": null,
      "size": null,
      "bootstrappedOrFunded": null,
      "revenue": null,
      "source": null,
      "createdAt": "2023-03-15T15:52:51.801Z",
      "updatedAt": "2026-03-16T07:30:19.270Z",
      "CompanyId": 392,
      "CollegeId": 4633,
      "JobApplicants": [],
      "JobLocations": [
        {
          "id": 19264,
          "name": "Noida",
          "JobOpeningId": 150,
          "createdAt": "2026-02-25T07:03:49.536Z",
          "updatedAt": "2026-02-25T07:03:49.536Z"
        }
      ],
      "JobRole": {
        "id": 2,
        "name": "Backend Engineer",
        "createdAt": "2023-02-28T09:10:58.719Z",
        "updatedAt": "2023-03-01T12:15:43.646Z"
      },
      "Company": {
        "name": "Nebula Codes",
        "logo": null
      },
      "canApply": true,
      "notApplicableReason": null
    },
    {
      "id": 8208,
      "companyName": "Sensixtech Pvt. Ltd.",
      "minCTC": 3,
      "maxCTC": 5,
      "expirationDateTime": "2026-03-18T18:13:00.000Z",
      "description": "<h1><strong>CTC based on skills and experience </strong></h1><h1><strong>work from home</strong></h1><h1><strong>6 months- 1 year experience required</strong></h1><h1><strong>immediate joiner </strong></h1><h1><strong>urgently hiring</strong></h1>",
      "newDescription": {
        "type": "doc",
        "content": [
          {
            "type": "heading",
            "attrs": {
              "level": 1,
              "textAlign": null
            },
            "content": [
              {
                "text": "CTC based on skills and experience ",
                "type": "text",
                "marks": [
                  {
                    "type": "bold"
                  }
                ]
              }
            ]
          },
          {
            "type": "heading",
            "attrs": {
              "level": 1,
              "textAlign": null
            },
            "content": [
              {
                "text": "work from home",
                "type": "text",
                "marks": [
                  {
                    "type": "bold"
                  }
                ]
              }
            ]
          },
          {
            "type": "heading",
            "attrs": {
              "level": 1,
              "textAlign": null
            },
            "content": [
              {
                "text": "6 months- 1 year experience required",
                "type": "text",
                "marks": [
                  {
                    "type": "bold"
                  }
                ]
              }
            ]
          },
          {
            "type": "heading",
            "attrs": {
              "level": 1,
              "textAlign": null
            },
            "content": [
              {
                "text": "immediate joiner ",
                "type": "text",
                "marks": [
                  {
                    "type": "bold"
                  }
                ]
              }
            ]
          },
          {
            "type": "heading",
            "attrs": {
              "level": 1,
              "textAlign": null
            },
            "content": [
              {
                "text": "urgently hiring",
                "type": "text",
                "marks": [
                  {
                    "type": "bold"
                  }
                ]
              }
            ]
          }
        ]
      },
      "alertMessage": null,
      "alertConfirmationMessage": null,
      "JobRoleId": 2,
      "yearsOfExperience": 0,
      "status": 3,
      "closedReasonType": null,
      "closedReason": null,
      "showCompanyToStudents": true,
      "companyPOCEmail": "shivam@sensixtech.com",
      "isPrivate": false,
      "offersInternship": false,
      "internshipDuration": 0,
      "internshipStipend": 0,
      "isAlumniJob": false,
      "isProCompany": false,
      "isJobPortal": false,
      "jobTags": null,
      "jobRedirectionLink": null,
      "category": null,
      "domain": null,
      "size": null,
      "bootstrappedOrFunded": null,
      "revenue": null,
      "source": null,
      "createdAt": "2026-03-16T18:13:40.642Z",
      "updatedAt": "2026-03-17T06:27:00.318Z",
      "CompanyId": 305,
      "CollegeId": 4633,
      "JobApplicants": [],
      "JobLocations": [
        {
          "id": 19473,
          "name": "Remote",
          "JobOpeningId": 8208,
          "createdAt": "2026-03-16T18:13:40.649Z",
          "updatedAt": "2026-03-16T18:13:40.649Z"
        }
      ],
      "JobRole": {
        "id": 2,
        "name": "Backend Engineer",
        "createdAt": "2023-02-28T09:10:58.719Z",
        "updatedAt": "2023-03-01T12:15:43.646Z"
      },
      "Company": {
        "name": "Sensixtech Pvt. Ltd.",
        "logo": null
      },
      "canApply": true,
      "notApplicableReason": null
    },
    {
      "id": 8210,
      "companyName": "DistrictD",
      "minCTC": 12,
      "maxCTC": 16,
      "expirationDateTime": "2026-03-18T04:30:00.000Z",
      "description": "<h1>Hiring for team lead. hired 2 aluminis recently</h1>",
      "newDescription": {
        "type": "doc",
        "content": [
          {
            "type": "heading",
            "attrs": {
              "level": 1,
              "textAlign": null
            },
            "content": [
              {
                "text": "Hiring for team lead. hired 2 aluminis recently",
                "type": "text"
              }
            ]
          }
        ]
      },
      "alertMessage": null,
      "alertConfirmationMessage": null,
      "JobRoleId": 2,
      "yearsOfExperience": 4,
      "status": 2,
      "closedReasonType": null,
      "closedReason": null,
      "showCompanyToStudents": true,
      "companyPOCEmail": "\thr@districtd.in",
      "isPrivate": false,
      "offersInternship": false,
      "internshipDuration": 0,
      "internshipStipend": 0,
      "isAlumniJob": false,
      "isProCompany": false,
      "isJobPortal": false,
      "jobTags": null,
      "jobRedirectionLink": null,
      "category": null,
      "domain": null,
      "size": null,
      "bootstrappedOrFunded": null,
      "revenue": null,
      "source": null,
      "createdAt": "2026-03-17T07:18:59.806Z",
      "updatedAt": "2026-03-17T07:18:59.806Z",
      "CompanyId": 2387,
      "CollegeId": 4633,
      "JobApplicants": [],
      "JobLocations": [
        {
          "id": 19477,
          "name": "Noida",
          "JobOpeningId": 8210,
          "createdAt": "2026-03-17T07:18:59.811Z",
          "updatedAt": "2026-03-17T07:18:59.811Z"
        }
      ],
      "JobRole": {
        "id": 2,
        "name": "Backend Engineer",
        "createdAt": "2023-02-28T09:10:58.719Z",
        "updatedAt": "2023-03-01T12:15:43.646Z"
      },
      "Company": {
        "name": "DistrictD",
        "logo": "https://sharpener.blob.core.windows.net/companylogos/DistrictD.jfif"
      },
      "canApply": false,
      "notApplicableReason": "Minimum 4 years of experience required"
    },
    {
      "id": 843,
      "companyName": "HiverHq",
      "minCTC": 12,
      "maxCTC": 15,
      "expirationDateTime": "2026-05-11T10:58:00.000Z",
      "description": "<p><strong>Minimum EXPERIENCE REQUIRED IS 1 TO 1.5 YEARS</strong></p><p><strong>VIRTUAL INTERVIEW</strong></p><p><strong>CANDIDATE SHOULD BE READY TO WORK IN PYTHON </strong></p><p><strong>IMIDIATE JOINING .</strong></p><p><strong>MAX NOTICE PERIOD IS 15-30 DAYS</strong></p><p><strong>PROCESS WILL BE COMPLETED BY SATURDAY</strong></p>",
      "newDescription": {
        "type": "doc",
        "content": [
          {
            "type": "paragraph",
            "attrs": {
              "textAlign": null
            },
            "content": [
              {
                "text": "Minimum EXPERIENCE REQUIRED IS 1 TO 1.5 YEARS",
                "type": "text",
                "marks": [
                  {
                    "type": "bold"
                  }
                ]
              }
            ]
          },
          {
            "type": "paragraph",
            "attrs": {
              "textAlign": null
            },
            "content": [
              {
                "text": "VIRTUAL INTERVIEW",
                "type": "text",
                "marks": [
                  {
                    "type": "bold"
                  }
                ]
              }
            ]
          },
          {
            "type": "paragraph",
            "attrs": {
              "textAlign": null
            },
            "content": [
              {
                "text": "CANDIDATE SHOULD BE READY TO WORK IN PYTHON",
                "type": "text",
                "marks": [
                  {
                    "type": "bold"
                  }
                ]
              }
            ]
          },
          {
            "type": "paragraph",
            "attrs": {
              "textAlign": null
            },
            "content": [
              {
                "text": "IMIDIATE JOINING .",
                "type": "text",
                "marks": [
                  {
                    "type": "bold"
                  }
                ]
              }
            ]
          },
          {
            "type": "paragraph",
            "attrs": {
              "textAlign": null
            },
            "content": [
              {
                "text": "MAX NOTICE PERIOD IS 15-30 DAYS",
                "type": "text",
                "marks": [
                  {
                    "type": "bold"
                  }
                ]
              }
            ]
          },
          {
            "type": "paragraph",
            "attrs": {
              "textAlign": null
            },
            "content": [
              {
                "text": "PROCESS WILL BE COMPLETED BY SATURDAY",
                "type": "text",
                "marks": [
                  {
                    "type": "bold"
                  }
                ]
              }
            ]
          }
        ]
      },
      "alertMessage": "<p><br></p>",
      "alertConfirmationMessage": null,
      "JobRoleId": 2,
      "yearsOfExperience": 1,
      "status": 3,
      "closedReasonType": 2,
      "closedReason": "They want a devOps person",
      "showCompanyToStudents": true,
      "companyPOCEmail": "jason@asd",
      "isPrivate": false,
      "offersInternship": false,
      "internshipDuration": 0,
      "internshipStipend": 0,
      "isAlumniJob": false,
      "isProCompany": false,
      "isJobPortal": false,
      "jobTags": null,
      "jobRedirectionLink": null,
      "category": null,
      "domain": null,
      "size": null,
      "bootstrappedOrFunded": null,
      "revenue": null,
      "source": null,
      "createdAt": "2023-05-19T13:22:02.921Z",
      "updatedAt": "2026-03-17T10:58:31.610Z",
      "CompanyId": null,
      "CollegeId": 4633,
      "JobApplicants": [],
      "JobLocations": [
        {
          "id": 16545,
          "name": "Bangalore",
          "JobOpeningId": 843,
          "createdAt": "2025-07-10T06:42:43.257Z",
          "updatedAt": "2025-07-10T06:42:43.257Z"
        }
      ],
      "JobRole": {
        "id": 2,
        "name": "Backend Engineer",
        "createdAt": "2023-02-28T09:10:58.719Z",
        "updatedAt": "2023-03-01T12:15:43.646Z"
      },
      "Company": null,
      "canApply": true,
      "notApplicableReason": null
    },
    {
      "id": 5052,
      "companyName": "Skillyak",
      "minCTC": 3,
      "maxCTC": 3.5,
      "expirationDateTime": "2026-03-18T07:05:00.000Z",
      "description": "<h1>2 Rounds of interview</h1>",
      "newDescription": {
        "type": "doc",
        "content": [
          {
            "type": "heading",
            "attrs": {
              "level": 1,
              "textAlign": null
            },
            "content": [
              {
                "text": "2 Rounds of interview",
                "type": "text"
              }
            ]
          }
        ]
      },
      "alertMessage": null,
      "alertConfirmationMessage": null,
      "JobRoleId": 1,
      "yearsOfExperience": 0,
      "status": 3,
      "closedReasonType": 3,
      "closedReason": "did not shortlist",
      "showCompanyToStudents": true,
      "companyPOCEmail": "rpandey@skillyak.com",
      "isPrivate": false,
      "offersInternship": false,
      "internshipDuration": 0,
      "internshipStipend": 0,
      "isAlumniJob": false,
      "isProCompany": false,
      "isJobPortal": false,
      "jobTags": null,
      "jobRedirectionLink": null,
      "category": null,
      "domain": null,
      "size": null,
      "bootstrappedOrFunded": null,
      "revenue": null,
      "source": null,
      "createdAt": "2024-10-08T12:11:41.593Z",
      "updatedAt": "2026-03-16T07:05:45.248Z",
      "CompanyId": 834,
      "CollegeId": 4633,
      "JobApplicants": [],
      "JobLocations": [
        {
          "id": 19371,
          "name": "Jaipur",
          "JobOpeningId": 5052,
          "createdAt": "2026-03-05T11:06:04.448Z",
          "updatedAt": "2026-03-05T11:06:04.448Z"
        }
      ],
      "JobRole": {
        "id": 1,
        "name": "Frontend Engineer",
        "createdAt": "2023-02-23T11:10:53.498Z",
        "updatedAt": "2023-06-27T12:03:29.887Z"
      },
      "Company": {
        "name": "Skillyak",
        "logo": null
      },
      "canApply": true,
      "notApplicableReason": null
    },
    {
      "id": 7440,
      "companyName": "Excelerate",
      "minCTC": 5,
      "maxCTC": 7,
      "expirationDateTime": "2026-03-18T06:47:00.000Z",
      "description": "<h1><strong>Job role is full stack</strong></h1><h1><strong>2 years of experince candidates required</strong></h1><h1><strong>Work from home</strong></h1><h1><strong>Dubai based company</strong></h1><h1><strong>4 sharpenerians already working</strong></h1><h1><strong>1k+ employee base</strong></h1><h1>8 sharpnerian already working</h1><h1></h1>",
      "newDescription": {
        "type": "doc",
        "content": [
          {
            "type": "heading",
            "attrs": {
              "level": 1,
              "textAlign": null
            },
            "content": [
              {
                "text": "Job role is full stack",
                "type": "text",
                "marks": [
                  {
                    "type": "bold"
                  }
                ]
              }
            ]
          },
          {
            "type": "heading",
            "attrs": {
              "level": 1,
              "textAlign": null
            },
            "content": [
              {
                "text": "2 years of experince candidates required",
                "type": "text",
                "marks": [
                  {
                    "type": "bold"
                  }
                ]
              }
            ]
          },
          {
            "type": "heading",
            "attrs": {
              "level": 1,
              "textAlign": null
            },
            "content": [
              {
                "text": "Work from home",
                "type": "text",
                "marks": [
                  {
                    "type": "bold"
                  }
                ]
              }
            ]
          },
          {
            "type": "heading",
            "attrs": {
              "level": 1,
              "textAlign": null
            },
            "content": [
              {
                "text": "Dubai based company",
                "type": "text",
                "marks": [
                  {
                    "type": "bold"
                  }
                ]
              }
            ]
          },
          {
            "type": "heading",
            "attrs": {
              "level": 1,
              "textAlign": null
            },
            "content": [
              {
                "text": "4 sharpenerians already working",
                "type": "text",
                "marks": [
                  {
                    "type": "bold"
                  }
                ]
              }
            ]
          },
          {
            "type": "heading",
            "attrs": {
              "level": 1,
              "textAlign": null
            },
            "content": [
              {
                "text": "1k+ employee base",
                "type": "text",
                "marks": [
                  {
                    "type": "bold"
                  }
                ]
              }
            ]
          },
          {
            "type": "heading",
            "attrs": {
              "level": 1,
              "textAlign": null
            },
            "content": [
              {
                "text": "8 sharpnerian already working",
                "type": "text"
              }
            ]
          },
          {
            "type": "heading",
            "attrs": {
              "level": 1,
              "textAlign": null
            }
          }
        ]
      },
      "alertMessage": null,
      "alertConfirmationMessage": null,
      "JobRoleId": 2,
      "yearsOfExperience": 1,
      "status": 3,
      "closedReasonType": 1,
      "closedReason": "hired",
      "showCompanyToStudents": true,
      "companyPOCEmail": "people.empowerment@vempower.org",
      "isPrivate": false,
      "offersInternship": false,
      "internshipDuration": 0,
      "internshipStipend": 0,
      "isAlumniJob": false,
      "isProCompany": false,
      "isJobPortal": false,
      "jobTags": null,
      "jobRedirectionLink": null,
      "category": null,
      "domain": null,
      "size": null,
      "bootstrappedOrFunded": null,
      "revenue": null,
      "source": null,
      "createdAt": "2025-09-24T13:27:56.302Z",
      "updatedAt": "2026-03-16T06:47:11.737Z",
      "CompanyId": 1673,
      "CollegeId": 4633,
      "JobApplicants": [],
      "JobLocations": [
        {
          "id": 18949,
          "name": "Remote",
          "JobOpeningId": 7440,
          "createdAt": "2026-02-04T06:14:17.968Z",
          "updatedAt": "2026-02-04T06:14:17.968Z"
        }
      ],
      "JobRole": {
        "id": 2,
        "name": "Backend Engineer",
        "createdAt": "2023-02-28T09:10:58.719Z",
        "updatedAt": "2023-03-01T12:15:43.646Z"
      },
      "Company": {
        "name": "Excelerate",
        "logo": null
      },
      "canApply": true,
      "notApplicableReason": null
    },
    {
      "id": 5431,
      "companyName": "Nebula Codes",
      "minCTC": 3,
      "maxCTC": 5,
      "expirationDateTime": "2026-03-19T06:25:00.000Z",
      "description": "<h2>3 candidates already working. </h2>",
      "newDescription": {
        "type": "doc",
        "content": [
          {
            "type": "heading",
            "attrs": {
              "level": 2,
              "textAlign": null
            },
            "content": [
              {
                "text": "3 candidates already working. ",
                "type": "text"
              }
            ]
          }
        ]
      },
      "alertMessage": null,
      "alertConfirmationMessage": null,
      "JobRoleId": 2,
      "yearsOfExperience": 0,
      "status": 8,
      "closedReasonType": 1,
      "closedReason": "hired",
      "showCompanyToStudents": true,
      "companyPOCEmail": "pujajaiswal@14453gmail.com",
      "isPrivate": false,
      "offersInternship": false,
      "internshipDuration": 0,
      "internshipStipend": 0,
      "isAlumniJob": false,
      "isProCompany": false,
      "isJobPortal": false,
      "jobTags": null,
      "jobRedirectionLink": null,
      "category": null,
      "domain": null,
      "size": null,
      "bootstrappedOrFunded": null,
      "revenue": null,
      "source": null,
      "createdAt": "2024-11-29T08:50:23.327Z",
      "updatedAt": "2026-03-16T06:27:50.499Z",
      "CompanyId": 392,
      "CollegeId": 4633,
      "JobApplicants": [],
      "JobLocations": [
        {
          "id": 19410,
          "name": "Noida",
          "JobOpeningId": 5431,
          "createdAt": "2026-03-10T07:33:04.054Z",
          "updatedAt": "2026-03-10T07:33:04.054Z"
        }
      ],
      "JobRole": {
        "id": 2,
        "name": "Backend Engineer",
        "createdAt": "2023-02-28T09:10:58.719Z",
        "updatedAt": "2023-03-01T12:15:43.646Z"
      },
      "Company": {
        "name": "Nebula Codes",
        "logo": null
      },
      "canApply": true,
      "notApplicableReason": null
    },
    {
      "id": 5128,
      "companyName": "Nebula Codes",
      "minCTC": 3,
      "maxCTC": 4,
      "expirationDateTime": "2026-03-19T06:25:00.000Z",
      "description": "<h2>2 SHARPENERIANS ALREADY WORKING. </h2>",
      "newDescription": {
        "type": "doc",
        "content": [
          {
            "type": "heading",
            "attrs": {
              "level": 2,
              "textAlign": null
            },
            "content": [
              {
                "text": "2 SHARPENERIANS ALREADY WORKING. ",
                "type": "text"
              }
            ]
          }
        ]
      },
      "alertMessage": null,
      "alertConfirmationMessage": null,
      "JobRoleId": 1,
      "yearsOfExperience": 0,
      "status": 3,
      "closedReasonType": 3,
      "closedReason": "dnst",
      "showCompanyToStudents": true,
      "companyPOCEmail": "rahul@nebula.codes",
      "isPrivate": false,
      "offersInternship": false,
      "internshipDuration": 0,
      "internshipStipend": 0,
      "isAlumniJob": false,
      "isProCompany": false,
      "isJobPortal": false,
      "jobTags": null,
      "jobRedirectionLink": null,
      "category": null,
      "domain": null,
      "size": null,
      "bootstrappedOrFunded": null,
      "revenue": null,
      "source": null,
      "createdAt": "2024-10-17T06:49:11.684Z",
      "updatedAt": "2026-03-16T06:25:14.641Z",
      "CompanyId": 392,
      "CollegeId": 4633,
      "JobApplicants": [],
      "JobLocations": [
        {
          "id": 19434,
          "name": "Noida",
          "JobOpeningId": 5128,
          "createdAt": "2026-03-12T06:15:28.586Z",
          "updatedAt": "2026-03-12T06:15:28.586Z"
        }
      ],
      "JobRole": {
        "id": 1,
        "name": "Frontend Engineer",
        "createdAt": "2023-02-23T11:10:53.498Z",
        "updatedAt": "2023-06-27T12:03:29.887Z"
      },
      "Company": {
        "name": "Nebula Codes",
        "logo": null
      },
      "canApply": true,
      "notApplicableReason": null
    },
    {
      "id": 7441,
      "companyName": "Excelerate",
      "minCTC": 5,
      "maxCTC": 7,
      "expirationDateTime": "2026-03-18T06:46:00.000Z",
      "description": "<h1><strong>Job role is full stack</strong></h1><h1><strong>2 years of experince candidates required</strong></h1><h1><strong>Work from home</strong></h1><h1><strong>Dubai based company</strong></h1><h1><strong>8 sharpenerians already working</strong></h1><h1><strong>1k+ employee base</strong></h1>",
      "newDescription": {
        "type": "doc",
        "content": [
          {
            "type": "heading",
            "attrs": {
              "level": 1,
              "textAlign": null
            },
            "content": [
              {
                "text": "Job role is full stack",
                "type": "text",
                "marks": [
                  {
                    "type": "bold"
                  }
                ]
              }
            ]
          },
          {
            "type": "heading",
            "attrs": {
              "level": 1,
              "textAlign": null
            },
            "content": [
              {
                "text": "2 years of experince candidates required",
                "type": "text",
                "marks": [
                  {
                    "type": "bold"
                  }
                ]
              }
            ]
          },
          {
            "type": "heading",
            "attrs": {
              "level": 1,
              "textAlign": null
            },
            "content": [
              {
                "text": "Work from home",
                "type": "text",
                "marks": [
                  {
                    "type": "bold"
                  }
                ]
              }
            ]
          },
          {
            "type": "heading",
            "attrs": {
              "level": 1,
              "textAlign": null
            },
            "content": [
              {
                "text": "Dubai based company",
                "type": "text",
                "marks": [
                  {
                    "type": "bold"
                  }
                ]
              }
            ]
          },
          {
            "type": "heading",
            "attrs": {
              "level": 1,
              "textAlign": null
            },
            "content": [
              {
                "text": "8 sharpenerians already working",
                "type": "text",
                "marks": [
                  {
                    "type": "bold"
                  }
                ]
              }
            ]
          },
          {
            "type": "heading",
            "attrs": {
              "level": 1,
              "textAlign": null
            },
            "content": [
              {
                "text": "1k+ employee base",
                "type": "text",
                "marks": [
                  {
                    "type": "bold"
                  }
                ]
              }
            ]
          }
        ]
      },
      "alertMessage": null,
      "alertConfirmationMessage": null,
      "JobRoleId": 1,
      "yearsOfExperience": 1,
      "status": 3,
      "closedReasonType": 1,
      "closedReason": "hired",
      "showCompanyToStudents": true,
      "companyPOCEmail": "people.empowerment@vempower.org",
      "isPrivate": false,
      "offersInternship": false,
      "internshipDuration": 0,
      "internshipStipend": 0,
      "isAlumniJob": false,
      "isProCompany": false,
      "isJobPortal": false,
      "jobTags": null,
      "jobRedirectionLink": null,
      "category": null,
      "domain": null,
      "size": null,
      "bootstrappedOrFunded": null,
      "revenue": null,
      "source": null,
      "createdAt": "2025-09-24T13:28:39.711Z",
      "updatedAt": "2026-03-16T06:46:53.274Z",
      "CompanyId": 1673,
      "CollegeId": 4633,
      "JobApplicants": [],
      "JobLocations": [
        {
          "id": 18950,
          "name": "Remote",
          "JobOpeningId": 7441,
          "createdAt": "2026-02-04T06:14:35.103Z",
          "updatedAt": "2026-02-04T06:14:35.103Z"
        }
      ],
      "JobRole": {
        "id": 1,
        "name": "Frontend Engineer",
        "createdAt": "2023-02-23T11:10:53.498Z",
        "updatedAt": "2023-06-27T12:03:29.887Z"
      },
      "Company": {
        "name": "Excelerate",
        "logo": null
      },
      "canApply": true,
      "notApplicableReason": null
    },
    {
      "id": 151,
      "companyName": "XGrowth Technology Pvt Ltd ",
      "minCTC": 6,
      "maxCTC": 12,
      "expirationDateTime": "2026-03-20T07:01:00.000Z",
      "description": "<h2>2  year exp candidate required in full stack can expect upto 12 l.p.a depending upon current ctc<br></h2>",
      "newDescription": {
        "type": "doc",
        "content": [
          {
            "type": "heading",
            "attrs": {
              "level": 2,
              "textAlign": null
            },
            "content": [
              {
                "text": "2  year exp candidate required in full stack can expect upto 12 l.p.a depending upon current ctc",
                "type": "text"
              },
              {
                "type": "hardBreak"
              }
            ]
          }
        ]
      },
      "alertMessage": null,
      "alertConfirmationMessage": null,
      "JobRoleId": 2,
      "yearsOfExperience": 1,
      "status": 3,
      "closedReasonType": 3,
      "closedReason": "nt st",
      "showCompanyToStudents": true,
      "companyPOCEmail": "saiby.kashyap@xemailverify.com",
      "isPrivate": false,
      "offersInternship": false,
      "internshipDuration": 0,
      "internshipStipend": 0,
      "isAlumniJob": false,
      "isProCompany": false,
      "isJobPortal": false,
      "jobTags": null,
      "jobRedirectionLink": null,
      "category": null,
      "domain": null,
      "size": null,
      "bootstrappedOrFunded": null,
      "revenue": null,
      "source": null,
      "createdAt": "2023-03-15T15:54:13.397Z",
      "updatedAt": "2026-03-16T07:01:14.525Z",
      "CompanyId": null,
      "CollegeId": 4633,
      "JobApplicants": [],
      "JobLocations": [
        {
          "id": 19452,
          "name": "Noida",
          "JobOpeningId": 151,
          "createdAt": "2026-03-13T07:48:58.463Z",
          "updatedAt": "2026-03-13T07:48:58.463Z"
        }
      ],
      "JobRole": {
        "id": 2,
        "name": "Backend Engineer",
        "createdAt": "2023-02-28T09:10:58.719Z",
        "updatedAt": "2023-03-01T12:15:43.646Z"
      },
      "Company": null,
      "canApply": true,
      "notApplicableReason": null
    },
    {
      "id": 5051,
      "companyName": "Skillyak",
      "minCTC": 3,
      "maxCTC": 3.5,
      "expirationDateTime": "2026-03-18T07:05:00.000Z",
      "description": "<h1>2 Rounds of interview</h1><p class=\"\"></p>",
      "newDescription": {
        "type": "doc",
        "content": [
          {
            "type": "heading",
            "attrs": {
              "level": 1,
              "textAlign": null
            },
            "content": [
              {
                "text": "2 Rounds of interview",
                "type": "text"
              }
            ]
          },
          {
            "type": "paragraph",
            "attrs": {
              "textAlign": null
            }
          }
        ]
      },
      "alertMessage": null,
      "alertConfirmationMessage": null,
      "JobRoleId": 2,
      "yearsOfExperience": 0,
      "status": 3,
      "closedReasonType": 3,
      "closedReason": "did not shortlist",
      "showCompanyToStudents": true,
      "companyPOCEmail": "rpandey@skillyak.com",
      "isPrivate": false,
      "offersInternship": false,
      "internshipDuration": 0,
      "internshipStipend": 0,
      "isAlumniJob": false,
      "isProCompany": false,
      "isJobPortal": false,
      "jobTags": null,
      "jobRedirectionLink": null,
      "category": null,
      "domain": null,
      "size": null,
      "bootstrappedOrFunded": null,
      "revenue": null,
      "source": null,
      "createdAt": "2024-10-08T12:11:14.065Z",
      "updatedAt": "2026-03-16T07:05:31.103Z",
      "CompanyId": 834,
      "CollegeId": 4633,
      "JobApplicants": [],
      "JobLocations": [
        {
          "id": 19372,
          "name": "Jaipur",
          "JobOpeningId": 5051,
          "createdAt": "2026-03-05T11:06:16.844Z",
          "updatedAt": "2026-03-05T11:06:16.844Z"
        }
      ],
      "JobRole": {
        "id": 2,
        "name": "Backend Engineer",
        "createdAt": "2023-02-28T09:10:58.719Z",
        "updatedAt": "2023-03-01T12:15:43.646Z"
      },
      "Company": {
        "name": "Skillyak",
        "logo": null
      },
      "canApply": true,
      "notApplicableReason": null
    },
    {
      "id": 8172,
      "companyName": "Anvento IT labs pvt ltd",
      "minCTC": 5,
      "maxCTC": 10,
      "expirationDateTime": "2026-03-19T10:55:00.000Z",
      "description": null,
      "newDescription": null,
      "alertMessage": "<h2><strong>Role- Software engineer</strong></h2><h2><strong>5 days working</strong></h2><h2><strong>CTC depends on exp and last ctc</strong></h2>",
      "alertConfirmationMessage": null,
      "JobRoleId": 2,
      "yearsOfExperience": 1,
      "status": 3,
      "closedReasonType": null,
      "closedReason": null,
      "showCompanyToStudents": true,
      "companyPOCEmail": "seema@anventolabs.com",
      "isPrivate": false,
      "offersInternship": false,
      "internshipDuration": 0,
      "internshipStipend": 0,
      "isAlumniJob": false,
      "isProCompany": false,
      "isJobPortal": false,
      "jobTags": null,
      "jobRedirectionLink": null,
      "category": null,
      "domain": null,
      "size": null,
      "bootstrappedOrFunded": null,
      "revenue": null,
      "source": null,
      "createdAt": "2026-03-10T09:03:15.116Z",
      "updatedAt": "2026-03-16T10:55:57.490Z",
      "CompanyId": 2418,
      "CollegeId": 4633,
      "JobApplicants": [],
      "JobLocations": [
        {
          "id": 19413,
          "name": "Mohali",
          "JobOpeningId": 8172,
          "createdAt": "2026-03-10T09:03:15.121Z",
          "updatedAt": "2026-03-10T09:03:15.121Z"
        }
      ],
      "JobRole": {
        "id": 2,
        "name": "Backend Engineer",
        "createdAt": "2023-02-28T09:10:58.719Z",
        "updatedAt": "2023-03-01T12:15:43.646Z"
      },
      "Company": {
        "name": "Anvento IT labs pvt ltd",
        "logo": null
      },
      "canApply": true,
      "notApplicableReason": null
    },
    {
      "id": 8173,
      "companyName": "Anvento IT labs pvt ltd",
      "minCTC": 5,
      "maxCTC": 10,
      "expirationDateTime": "2026-03-19T10:55:00.000Z",
      "description": null,
      "newDescription": null,
      "alertMessage": "<h2><strong>Role- Software engineer</strong></h2><h2><strong>5 days working</strong></h2><h2><strong>CTC depends on exp and last ctc</strong></h2><p><br></p>",
      "alertConfirmationMessage": null,
      "JobRoleId": 1,
      "yearsOfExperience": 1,
      "status": 3,
      "closedReasonType": null,
      "closedReason": null,
      "showCompanyToStudents": true,
      "companyPOCEmail": "seema@anventolabs.com",
      "isPrivate": false,
      "offersInternship": false,
      "internshipDuration": 0,
      "internshipStipend": 0,
      "isAlumniJob": false,
      "isProCompany": false,
      "isJobPortal": false,
      "jobTags": null,
      "jobRedirectionLink": null,
      "category": null,
      "domain": null,
      "size": null,
      "bootstrappedOrFunded": null,
      "revenue": null,
      "source": null,
      "createdAt": "2026-03-10T09:03:49.605Z",
      "updatedAt": "2026-03-16T10:55:50.545Z",
      "CompanyId": 2418,
      "CollegeId": 4633,
      "JobApplicants": [],
      "JobLocations": [
        {
          "id": 19414,
          "name": "Mohali",
          "JobOpeningId": 8173,
          "createdAt": "2026-03-10T09:03:49.609Z",
          "updatedAt": "2026-03-10T09:03:49.609Z"
        }
      ],
      "JobRole": {
        "id": 1,
        "name": "Frontend Engineer",
        "createdAt": "2023-02-23T11:10:53.498Z",
        "updatedAt": "2023-06-27T12:03:29.887Z"
      },
      "Company": {
        "name": "Anvento IT labs pvt ltd",
        "logo": null
      },
      "canApply": true,
      "notApplicableReason": null
    },
    {
      "id": 4117,
      "companyName": "Bigwelt Infotech Pvt Ltd",
      "minCTC": 3,
      "maxCTC": 3,
      "expirationDateTime": "2026-03-19T06:19:00.000Z",
      "description": "<h2><strong>WFO</strong></h2><p class=\"\">3 months of internship.the stipend will be 20k.After 3 months, it will be 25 k based on performance.</p><h2><strong>BOTH VIRTUAL AND OFFLINE INTERVIEWS ARE AVAILABLE.</strong></h2><p class=\"\"><strong>Two rounds of interviews</strong></p>",
      "newDescription": {
        "type": "doc",
        "content": [
          {
            "type": "heading",
            "attrs": {
              "level": 2,
              "textAlign": null
            },
            "content": [
              {
                "text": "WFO",
                "type": "text",
                "marks": [
                  {
                    "type": "bold"
                  }
                ]
              }
            ]
          },
          {
            "type": "paragraph",
            "attrs": {
              "textAlign": null
            },
            "content": [
              {
                "text": "3 months of internship.the stipend will be 20k.After 3 months, it will be 25 k based on performance.",
                "type": "text"
              }
            ]
          },
          {
            "type": "heading",
            "attrs": {
              "level": 2,
              "textAlign": null
            },
            "content": [
              {
                "text": "BOTH VIRTUAL AND OFFLINE INTERVIEWS ARE AVAILABLE.",
                "type": "text",
                "marks": [
                  {
                    "type": "bold"
                  }
                ]
              }
            ]
          },
          {
            "type": "paragraph",
            "attrs": {
              "textAlign": null
            },
            "content": [
              {
                "text": "Two rounds of interviews",
                "type": "text",
                "marks": [
                  {
                    "type": "bold"
                  }
                ]
              }
            ]
          }
        ]
      },
      "alertMessage": null,
      "alertConfirmationMessage": null,
      "JobRoleId": 1,
      "yearsOfExperience": 0,
      "status": 3,
      "closedReasonType": 1,
      "closedReason": ".",
      "showCompanyToStudents": true,
      "companyPOCEmail": "hr@bigwelt.com",
      "isPrivate": false,
      "offersInternship": true,
      "internshipDuration": 3,
      "internshipStipend": 20,
      "isAlumniJob": false,
      "isProCompany": false,
      "isJobPortal": false,
      "jobTags": null,
      "jobRedirectionLink": null,
      "category": null,
      "domain": null,
      "size": null,
      "bootstrappedOrFunded": null,
      "revenue": null,
      "source": null,
      "createdAt": "2024-06-19T08:45:45.831Z",
      "updatedAt": "2026-03-16T06:19:16.893Z",
      "CompanyId": 173,
      "CollegeId": 4633,
      "JobApplicants": [],
      "JobLocations": [
        {
          "id": 19417,
          "name": "Bangalore",
          "JobOpeningId": 4117,
          "createdAt": "2026-03-10T11:28:49.856Z",
          "updatedAt": "2026-03-10T11:28:49.856Z"
        }
      ],
      "JobRole": {
        "id": 1,
        "name": "Frontend Engineer",
        "createdAt": "2023-02-23T11:10:53.498Z",
        "updatedAt": "2023-06-27T12:03:29.887Z"
      },
      "Company": {
        "name": "Bigwelt Infotech Pvt Ltd",
        "logo": null
      },
      "canApply": true,
      "notApplicableReason": null
    },
    {
      "id": 8165,
      "companyName": "The Fidele ",
      "minCTC": 4.5,
      "maxCTC": 5,
      "expirationDateTime": "2026-03-18T07:18:00.000Z",
      "description": "<ul><li><p class=\"\">1–3 years of experience in full stack development</p></li><li><p class=\"\">Proficiency in <strong>JavaScript, HTML, and CSS</strong></p></li><li><p class=\"\">Experience with <strong>React.js or similar frontend frameworks</strong></p></li><li><p class=\"\">Experience with <strong>Node.js / Express or Python (Django / FastAPI)</strong></p></li><li><p class=\"\">Knowledge of <strong>REST API development</strong></p></li><li><p class=\"\">Experience with <strong>PostgreSQL or MySQL databases</strong></p></li></ul><h1>Familiarity with <strong>Git version control</strong></h1>",
      "newDescription": {
        "type": "doc",
        "content": [
          {
            "type": "bulletList",
            "content": [
              {
                "type": "listItem",
                "content": [
                  {
                    "type": "paragraph",
                    "attrs": {
                      "textAlign": null
                    },
                    "content": [
                      {
                        "text": "1–3 years of experience in full stack development",
                        "type": "text"
                      }
                    ]
                  }
                ]
              },
              {
                "type": "listItem",
                "content": [
                  {
                    "type": "paragraph",
                    "attrs": {
                      "textAlign": null
                    },
                    "content": [
                      {
                        "text": "Proficiency in ",
                        "type": "text"
                      },
                      {
                        "text": "JavaScript, HTML, and CSS",
                        "type": "text",
                        "marks": [
                          {
                            "type": "bold"
                          }
                        ]
                      }
                    ]
                  }
                ]
              },
              {
                "type": "listItem",
                "content": [
                  {
                    "type": "paragraph",
                    "attrs": {
                      "textAlign": null
                    },
                    "content": [
                      {
                        "text": "Experience with ",
                        "type": "text"
                      },
                      {
                        "text": "React.js or similar frontend frameworks",
                        "type": "text",
                        "marks": [
                          {
                            "type": "bold"
                          }
                        ]
                      }
                    ]
                  }
                ]
              },
              {
                "type": "listItem",
                "content": [
                  {
                    "type": "paragraph",
                    "attrs": {
                      "textAlign": null
                    },
                    "content": [
                      {
                        "text": "Experience with ",
                        "type": "text"
                      },
                      {
                        "text": "Node.js / Express or Python (Django / FastAPI)",
                        "type": "text",
                        "marks": [
                          {
                            "type": "bold"
                          }
                        ]
                      }
                    ]
                  }
                ]
              },
              {
                "type": "listItem",
                "content": [
                  {
                    "type": "paragraph",
                    "attrs": {
                      "textAlign": null
                    },
                    "content": [
                      {
                        "text": "Knowledge of ",
                        "type": "text"
                      },
                      {
                        "text": "REST API development",
                        "type": "text",
                        "marks": [
                          {
                            "type": "bold"
                          }
                        ]
                      }
                    ]
                  }
                ]
              },
              {
                "type": "listItem",
                "content": [
                  {
                    "type": "paragraph",
                    "attrs": {
                      "textAlign": null
                    },
                    "content": [
                      {
                        "text": "Experience with ",
                        "type": "text"
                      },
                      {
                        "text": "PostgreSQL or MySQL databases",
                        "type": "text",
                        "marks": [
                          {
                            "type": "bold"
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            "type": "heading",
            "attrs": {
              "level": 1,
              "textAlign": null
            },
            "content": [
              {
                "text": "Familiarity with ",
                "type": "text"
              },
              {
                "text": "Git version control",
                "type": "text",
                "marks": [
                  {
                    "type": "bold"
                  }
                ]
              }
            ]
          }
        ]
      },
      "alertMessage": null,
      "alertConfirmationMessage": null,
      "JobRoleId": 1,
      "yearsOfExperience": 1,
      "status": 5,
      "closedReasonType": null,
      "closedReason": null,
      "showCompanyToStudents": true,
      "companyPOCEmail": "piyush@fidele.com",
      "isPrivate": false,
      "offersInternship": false,
      "internshipDuration": 0,
      "internshipStipend": 0,
      "isAlumniJob": false,
      "isProCompany": false,
      "isJobPortal": false,
      "jobTags": null,
      "jobRedirectionLink": null,
      "category": "Service",
      "domain": "Media",
      "size": "Startup (<100)",
      "bootstrappedOrFunded": null,
      "revenue": null,
      "source": "Indeed",
      "createdAt": "2026-03-09T08:34:35.864Z",
      "updatedAt": "2026-03-17T06:30:39.924Z",
      "CompanyId": 2415,
      "CollegeId": 4633,
      "JobApplicants": [],
      "JobLocations": [
        {
          "id": 19393,
          "name": "Noida",
          "JobOpeningId": 8165,
          "createdAt": "2026-03-09T08:34:35.868Z",
          "updatedAt": "2026-03-09T08:34:35.868Z"
        }
      ],
      "JobRole": {
        "id": 1,
        "name": "Frontend Engineer",
        "createdAt": "2023-02-23T11:10:53.498Z",
        "updatedAt": "2023-06-27T12:03:29.887Z"
      },
      "Company": {
        "name": "The Fidele ",
        "logo": "https://sharpener.blob.core.windows.net/companylogos/fidele.jpeg"
      },
      "canApply": true,
      "notApplicableReason": null
    },
    {
      "id": 7936,
      "companyName": "Mariox Software",
      "minCTC": 4,
      "maxCTC": 6,
      "expirationDateTime": "2026-04-17T11:57:00.000Z",
      "description": "<p class=\"\"><strong>WFO</strong></p><p class=\"\"><strong>VIRTUAL INTERVIEW</strong></p><p class=\"\"><strong>MIMIMUM EXPERIENCE REQUIRED IS 1.5 YEARS</strong></p><p class=\"\"><strong>IMMIDIATE JOINERS</strong></p>",
      "newDescription": {
        "type": "doc",
        "content": [
          {
            "type": "paragraph",
            "attrs": {
              "textAlign": null
            },
            "content": [
              {
                "text": "WFO",
                "type": "text",
                "marks": [
                  {
                    "type": "bold"
                  }
                ]
              }
            ]
          },
          {
            "type": "paragraph",
            "attrs": {
              "textAlign": null
            },
            "content": [
              {
                "text": "VIRTUAL INTERVIEW",
                "type": "text",
                "marks": [
                  {
                    "type": "bold"
                  }
                ]
              }
            ]
          },
          {
            "type": "paragraph",
            "attrs": {
              "textAlign": null
            },
            "content": [
              {
                "text": "MIMIMUM EXPERIENCE REQUIRED IS 1.5 YEARS",
                "type": "text",
                "marks": [
                  {
                    "type": "bold"
                  }
                ]
              }
            ]
          },
          {
            "type": "paragraph",
            "attrs": {
              "textAlign": null
            },
            "content": [
              {
                "text": "IMMIDIATE JOINERS",
                "type": "text",
                "marks": [
                  {
                    "type": "bold"
                  }
                ]
              }
            ]
          }
        ]
      },
      "alertMessage": null,
      "alertConfirmationMessage": null,
      "JobRoleId": 2,
      "yearsOfExperience": 1,
      "status": 2,
      "closedReasonType": null,
      "closedReason": null,
      "showCompanyToStudents": true,
      "companyPOCEmail": "hr@marioxsoftware.com",
      "isPrivate": false,
      "offersInternship": false,
      "internshipDuration": 0,
      "internshipStipend": 0,
      "isAlumniJob": false,
      "isProCompany": false,
      "isJobPortal": false,
      "jobTags": null,
      "jobRedirectionLink": null,
      "category": null,
      "domain": null,
      "size": null,
      "bootstrappedOrFunded": null,
      "revenue": null,
      "source": null,
      "createdAt": "2026-01-22T12:45:49.761Z",
      "updatedAt": "2026-03-17T11:57:17.888Z",
      "CompanyId": 2313,
      "CollegeId": 4633,
      "JobApplicants": [],
      "JobLocations": [
        {
          "id": 18809,
          "name": "Noida",
          "JobOpeningId": 7936,
          "createdAt": "2026-01-22T12:45:49.765Z",
          "updatedAt": "2026-01-22T12:45:49.765Z"
        }
      ],
      "JobRole": {
        "id": 2,
        "name": "Backend Engineer",
        "createdAt": "2023-02-28T09:10:58.719Z",
        "updatedAt": "2023-03-01T12:15:43.646Z"
      },
      "Company": {
        "name": "Mariox Software",
        "logo": null
      },
      "canApply": true,
      "notApplicableReason": null
    },
    {
      "id": 8008,
      "companyName": "Indicorp IT Solutions",
      "minCTC": 4,
      "maxCTC": 5,
      "expirationDateTime": "2026-03-20T11:34:00.000Z",
      "description": "<p class=\"\"></p><p class=\"\">🔥 IMMEDIATE JOINERS REQUIRED | URGENT HIRING 🔥<br><br>🚀 <a target=\"_blank\" rel=\"noopener noreferrer nofollow\" class=\"text-blue-500 hover:text-blue-700 underline cursor-pointer _2dcfbc63 e2bbe84b\" href=\"https://www.linkedin.com/company/indicorp-it-solutions-pvt-ltd/\"><span style=\"color: rgb(10, 102, 194)\"><strong>IndiCorp IT Solutions Pvt Ltd</strong></span></a> is hiring MERN Stack Developers for an immediate onsite opportunity.<br><br>📍 Location: Noida<br>🏢 Work Mode: Full-Time | Onsite<br>⏳ Experience: 1–2 Years<br>💰 Salary Package: ₹4 LPA – ₹5 LPA (Based on skills)<br></p>",
      "newDescription": {
        "type": "doc",
        "content": [
          {
            "type": "paragraph",
            "attrs": {
              "textAlign": null
            }
          },
          {
            "type": "paragraph",
            "attrs": {
              "textAlign": null
            },
            "content": [
              {
                "text": "🔥 IMMEDIATE JOINERS REQUIRED | URGENT HIRING 🔥",
                "type": "text"
              },
              {
                "type": "hardBreak"
              },
              {
                "type": "hardBreak"
              },
              {
                "text": "🚀 ",
                "type": "text"
              },
              {
                "text": "IndiCorp IT Solutions Pvt Ltd",
                "type": "text",
                "marks": [
                  {
                    "type": "link",
                    "attrs": {
                      "rel": "noopener noreferrer nofollow",
                      "href": "https://www.linkedin.com/company/indicorp-it-solutions-pvt-ltd/",
                      "class": "text-blue-500 hover:text-blue-700 underline cursor-pointer _2dcfbc63 e2bbe84b",
                      "target": "_blank"
                    }
                  },
                  {
                    "type": "textStyle",
                    "attrs": {
                      "color": "rgb(10, 102, 194)"
                    }
                  },
                  {
                    "type": "bold"
                  }
                ]
              },
              {
                "text": " is hiring MERN Stack Developers for an immediate onsite opportunity.",
                "type": "text"
              },
              {
                "type": "hardBreak"
              },
              {
                "type": "hardBreak"
              },
              {
                "text": "📍 Location: Noida",
                "type": "text"
              },
              {
                "type": "hardBreak"
              },
              {
                "text": "🏢 Work Mode: Full-Time | Onsite",
                "type": "text"
              },
              {
                "type": "hardBreak"
              },
              {
                "text": "⏳ Experience: 1–2 Years",
                "type": "text"
              },
              {
                "type": "hardBreak"
              },
              {
                "text": "💰 Salary Package: ₹4 LPA – ₹5 LPA (Based on skills)",
                "type": "text"
              },
              {
                "type": "hardBreak"
              }
            ]
          }
        ]
      },
      "alertMessage": null,
      "alertConfirmationMessage": null,
      "JobRoleId": 1,
      "yearsOfExperience": 1,
      "status": 3,
      "closedReasonType": null,
      "closedReason": null,
      "showCompanyToStudents": true,
      "companyPOCEmail": "varsha.tiwari@indicorpit.co.in",
      "isPrivate": false,
      "offersInternship": false,
      "internshipDuration": 0,
      "internshipStipend": 0,
      "isAlumniJob": false,
      "isProCompany": false,
      "isJobPortal": false,
      "jobTags": null,
      "jobRedirectionLink": null,
      "category": null,
      "domain": null,
      "size": null,
      "bootstrappedOrFunded": null,
      "revenue": null,
      "source": null,
      "createdAt": "2026-02-05T10:16:31.748Z",
      "updatedAt": "2026-03-17T11:35:03.687Z",
      "CompanyId": 2346,
      "CollegeId": 4633,
      "JobApplicants": [],
      "JobLocations": [
        {
          "id": 19482,
          "name": "Noida",
          "JobOpeningId": 8008,
          "createdAt": "2026-03-17T11:34:50.791Z",
          "updatedAt": "2026-03-17T11:34:50.791Z"
        }
      ],
      "JobRole": {
        "id": 1,
        "name": "Frontend Engineer",
        "createdAt": "2023-02-23T11:10:53.498Z",
        "updatedAt": "2023-06-27T12:03:29.887Z"
      },
      "Company": {
        "name": "Indicorp IT Solutions",
        "logo": null
      },
      "canApply": true,
      "notApplicableReason": null
    },
    {
      "id": 7403,
      "companyName": "WebNest Media",
      "minCTC": 3,
      "maxCTC": 3.5,
      "expirationDateTime": "2026-03-20T10:52:00.000Z",
      "description": "<p class=\"\"><span style=\"color: rgba(0, 0, 0, 0.9)\">🚀 </span><a target=\"_blank\" rel=\"noopener noreferrer nofollow\" class=\"text-blue-500 hover:text-blue-700 underline cursor-pointer _2663c39a _0f71a0a5\" href=\"https://www.linkedin.com/company/webnest-media-group/\"><span style=\"color: rgb(10, 102, 194)\"><strong>WebNest Media</strong></span></a><span style=\"color: rgba(0, 0, 0, 0.9)\"> is Hiring: Front-End Developer Intern </span><br><span style=\"color: rgba(0, 0, 0, 0.9)\">📍 Location: Gurgaon (Onsite)</span><br><span style=\"color: rgba(0, 0, 0, 0.9)\">🎓 Batch: 2025–2026</span><br><span style=\"color: rgba(0, 0, 0, 0.9)\">💰 Stipend: Provided 10 k per month and after 6 months a package of 3 to 3.5 lpa according to his/her performance</span><br><span style=\"color: rgba(0, 0, 0, 0.9)\">Tech Stack: HTML, CSS, JavaScript, Tailwind CSS, React.js, Next.js, Angular, TypeScript</span><br><span style=\"color: rgba(0, 0, 0, 0.9)\">What You’ll Do:</span><br><span style=\"color: rgba(0, 0, 0, 0.9)\">• Build responsive and modern web interfaces</span><br><span style=\"color: rgba(0, 0, 0, 0.9)\">• Convert UI/UX designs into functional components</span><br><span style=\"color: rgba(0, 0, 0, 0.9)\">• Integrate APIs and optimize performance</span><br><span style=\"color: rgba(0, 0, 0, 0.9)\">• Collaborate with designers and backend developers</span><br><span style=\"color: rgba(0, 0, 0, 0.9)\">Who Should Apply:</span><br><span style=\"color: rgba(0, 0, 0, 0.9)\">• Final-year students graduating in 2025–2026</span><br><span style=\"color: rgba(0, 0, 0, 0.9)\">• Strong fundamentals in HTML, CSS, JavaScript</span><br><span style=\"color: rgba(0, 0, 0, 0.9)\">• Familiarity with React, Next.js, or Angular is a plus</span><br><span style=\"color: rgba(0, 0, 0, 0.9)\">• GitHub portfolio or personal projects preferred</span><br><span style=\"color: rgba(0, 0, 0, 0.9)\">• Eager to learn and take ownership</span></p>",
      "newDescription": {
        "type": "doc",
        "content": [
          {
            "type": "paragraph",
            "attrs": {
              "textAlign": null
            },
            "content": [
              {
                "text": "🚀 ",
                "type": "text",
                "marks": [
                  {
                    "type": "textStyle",
                    "attrs": {
                      "color": "rgba(0, 0, 0, 0.9)"
                    }
                  }
                ]
              },
              {
                "text": "WebNest Media",
                "type": "text",
                "marks": [
                  {
                    "type": "link",
                    "attrs": {
                      "rel": "noopener noreferrer nofollow",
                      "href": "https://www.linkedin.com/company/webnest-media-group/",
                      "class": "text-blue-500 hover:text-blue-700 underline cursor-pointer _2663c39a _0f71a0a5",
                      "target": "_blank"
                    }
                  },
                  {
                    "type": "textStyle",
                    "attrs": {
                      "color": "rgb(10, 102, 194)"
                    }
                  },
                  {
                    "type": "bold"
                  }
                ]
              },
              {
                "text": " is Hiring: Front-End Developer Intern ",
                "type": "text",
                "marks": [
                  {
                    "type": "textStyle",
                    "attrs": {
                      "color": "rgba(0, 0, 0, 0.9)"
                    }
                  }
                ]
              },
              {
                "type": "hardBreak"
              },
              {
                "text": "📍 Location: Gurgaon (Onsite)",
                "type": "text",
                "marks": [
                  {
                    "type": "textStyle",
                    "attrs": {
                      "color": "rgba(0, 0, 0, 0.9)"
                    }
                  }
                ]
              },
              {
                "type": "hardBreak"
              },
              {
                "text": "🎓 Batch: 2025–2026",
                "type": "text",
                "marks": [
                  {
                    "type": "textStyle",
                    "attrs": {
                      "color": "rgba(0, 0, 0, 0.9)"
                    }
                  }
                ]
              },
              {
                "type": "hardBreak"
              },
              {
                "text": "💰 Stipend: Provided 10 k per month and after 6 months a package of 3 to 3.5 lpa according to his/her performance",
                "type": "text",
                "marks": [
                  {
                    "type": "textStyle",
                    "attrs": {
                      "color": "rgba(0, 0, 0, 0.9)"
                    }
                  }
                ]
              },
              {
                "type": "hardBreak"
              },
              {
                "text": "Tech Stack: HTML, CSS, JavaScript, Tailwind CSS, React.js, Next.js, Angular, TypeScript",
                "type": "text",
                "marks": [
                  {
                    "type": "textStyle",
                    "attrs": {
                      "color": "rgba(0, 0, 0, 0.9)"
                    }
                  }
                ]
              },
              {
                "type": "hardBreak"
              },
              {
                "text": "What You’ll Do:",
                "type": "text",
                "marks": [
                  {
                    "type": "textStyle",
                    "attrs": {
                      "color": "rgba(0, 0, 0, 0.9)"
                    }
                  }
                ]
              },
              {
                "type": "hardBreak"
              },
              {
                "text": "• Build responsive and modern web interfaces",
                "type": "text",
                "marks": [
                  {
                    "type": "textStyle",
                    "attrs": {
                      "color": "rgba(0, 0, 0, 0.9)"
                    }
                  }
                ]
              },
              {
                "type": "hardBreak"
              },
              {
                "text": "• Convert UI/UX designs into functional components",
                "type": "text",
                "marks": [
                  {
                    "type": "textStyle",
                    "attrs": {
                      "color": "rgba(0, 0, 0, 0.9)"
                    }
                  }
                ]
              },
              {
                "type": "hardBreak"
              },
              {
                "text": "• Integrate APIs and optimize performance",
                "type": "text",
                "marks": [
                  {
                    "type": "textStyle",
                    "attrs": {
                      "color": "rgba(0, 0, 0, 0.9)"
                    }
                  }
                ]
              },
              {
                "type": "hardBreak"
              },
              {
                "text": "• Collaborate with designers and backend developers",
                "type": "text",
                "marks": [
                  {
                    "type": "textStyle",
                    "attrs": {
                      "color": "rgba(0, 0, 0, 0.9)"
                    }
                  }
                ]
              },
              {
                "type": "hardBreak"
              },
              {
                "text": "Who Should Apply:",
                "type": "text",
                "marks": [
                  {
                    "type": "textStyle",
                    "attrs": {
                      "color": "rgba(0, 0, 0, 0.9)"
                    }
                  }
                ]
              },
              {
                "type": "hardBreak"
              },
              {
                "text": "• Final-year students graduating in 2025–2026",
                "type": "text",
                "marks": [
                  {
                    "type": "textStyle",
                    "attrs": {
                      "color": "rgba(0, 0, 0, 0.9)"
                    }
                  }
                ]
              },
              {
                "type": "hardBreak"
              },
              {
                "text": "• Strong fundamentals in HTML, CSS, JavaScript",
                "type": "text",
                "marks": [
                  {
                    "type": "textStyle",
                    "attrs": {
                      "color": "rgba(0, 0, 0, 0.9)"
                    }
                  }
                ]
              },
              {
                "type": "hardBreak"
              },
              {
                "text": "• Familiarity with React, Next.js, or Angular is a plus",
                "type": "text",
                "marks": [
                  {
                    "type": "textStyle",
                    "attrs": {
                      "color": "rgba(0, 0, 0, 0.9)"
                    }
                  }
                ]
              },
              {
                "type": "hardBreak"
              },
              {
                "text": "• GitHub portfolio or personal projects preferred",
                "type": "text",
                "marks": [
                  {
                    "type": "textStyle",
                    "attrs": {
                      "color": "rgba(0, 0, 0, 0.9)"
                    }
                  }
                ]
              },
              {
                "type": "hardBreak"
              },
              {
                "text": "• Eager to learn and take ownership",
                "type": "text",
                "marks": [
                  {
                    "type": "textStyle",
                    "attrs": {
                      "color": "rgba(0, 0, 0, 0.9)"
                    }
                  }
                ]
              }
            ]
          }
        ]
      },
      "alertMessage": "<p><span style=\"color: rgba(0, 0, 0, 0.9);\">🚀 </span><a href=\"https://www.linkedin.com/company/webnest-media-group/\" rel=\"noopener noreferrer\" target=\"_blank\" style=\"color: rgb(10, 102, 194); background-color: rgb(255, 255, 255);\">WebNest Media</a><span style=\"color: rgba(0, 0, 0, 0.9);\"> is Hiring: Front-End Developer Intern </span></p><p><span style=\"color: rgba(0, 0, 0, 0.9);\">📍 Location: Gurgaon (Onsite)</span></p><p><span style=\"color: rgba(0, 0, 0, 0.9);\">🎓 Batch: 2025–2026</span></p><p><span style=\"color: rgba(0, 0, 0, 0.9);\">⏳ Duration: 6 Months</span></p><p><span style=\"color: rgba(0, 0, 0, 0.9);\">💰 Stipend: Provided</span></p><p><span style=\"color: rgba(0, 0, 0, 0.9);\">Tech Stack: HTML, CSS, JavaScript, Tailwind CSS, React.js, Next.js, Angular, TypeScript</span></p><p><span style=\"color: rgba(0, 0, 0, 0.9);\">What You’ll Do:</span></p><p><span style=\"color: rgba(0, 0, 0, 0.9);\">• Build responsive and modern web interfaces</span></p><p><span style=\"color: rgba(0, 0, 0, 0.9);\">• Convert UI/UX designs into functional components</span></p><p><span style=\"color: rgba(0, 0, 0, 0.9);\">• Integrate APIs and optimize performance</span></p><p><span style=\"color: rgba(0, 0, 0, 0.9);\">• Collaborate with designers and backend developers</span></p><p><span style=\"color: rgba(0, 0, 0, 0.9);\">Who Should Apply:</span></p><p><span style=\"color: rgba(0, 0, 0, 0.9);\">• Final-year students graduating in 2025–2026</span></p><p><span style=\"color: rgba(0, 0, 0, 0.9);\">• Strong fundamentals in HTML, CSS, JavaScript</span></p><p><span style=\"color: rgba(0, 0, 0, 0.9);\">• Familiarity with React, Next.js, or Angular is a plus</span></p><p><span style=\"color: rgba(0, 0, 0, 0.9);\">• GitHub portfolio or personal projects preferred</span></p><p><span style=\"color: rgba(0, 0, 0, 0.9);\">• Eager to learn and take ownership</span></p>",
      "alertConfirmationMessage": null,
      "JobRoleId": 1,
      "yearsOfExperience": 0,
      "status": 3,
      "closedReasonType": 3,
      "closedReason": "no one applied",
      "showCompanyToStudents": true,
      "companyPOCEmail": "hr@webnestmedia.in",
      "isPrivate": false,
      "offersInternship": true,
      "internshipDuration": 6,
      "internshipStipend": 10,
      "isAlumniJob": false,
      "isProCompany": false,
      "isJobPortal": false,
      "jobTags": null,
      "jobRedirectionLink": null,
      "category": null,
      "domain": null,
      "size": null,
      "bootstrappedOrFunded": null,
      "revenue": null,
      "source": null,
      "createdAt": "2025-09-18T11:08:45.694Z",
      "updatedAt": "2026-03-17T10:52:24.041Z",
      "CompanyId": 2025,
      "CollegeId": 4633,
      "JobApplicants": [],
      "JobLocations": [
        {
          "id": 19475,
          "name": "Gurgaon",
          "JobOpeningId": 7403,
          "createdAt": "2026-03-17T05:38:19.453Z",
          "updatedAt": "2026-03-17T05:38:19.453Z"
        }
      ],
      "JobRole": {
        "id": 1,
        "name": "Frontend Engineer",
        "createdAt": "2023-02-23T11:10:53.498Z",
        "updatedAt": "2023-06-27T12:03:29.887Z"
      },
      "Company": {
        "name": "WebNest Media",
        "logo": null
      },
      "canApply": true,
      "notApplicableReason": null
    },
    {
      "id": 8199,
      "companyName": "MMI Softwares pvt ltd",
      "minCTC": 6,
      "maxCTC": 12,
      "expirationDateTime": "2026-03-21T07:39:00.000Z",
      "description": "<h1>Job location is MathurA</h1><p class=\"\">Looking for full stack developers minimum 2.5 years experienced and 6 days working</p>",
      "newDescription": {
        "type": "doc",
        "content": [
          {
            "type": "heading",
            "attrs": {
              "level": 1,
              "textAlign": null
            },
            "content": [
              {
                "text": "Job location is MathurA",
                "type": "text"
              }
            ]
          },
          {
            "type": "paragraph",
            "attrs": {
              "textAlign": null
            },
            "content": [
              {
                "text": "Looking for full stack developers minimum 2.5 years experienced and 6 days working",
                "type": "text"
              }
            ]
          }
        ]
      },
      "alertMessage": null,
      "alertConfirmationMessage": null,
      "JobRoleId": 1,
      "yearsOfExperience": 2,
      "status": 2,
      "closedReasonType": null,
      "closedReason": null,
      "showCompanyToStudents": true,
      "companyPOCEmail": "hr@mmsoftwares.com",
      "isPrivate": false,
      "offersInternship": false,
      "internshipDuration": 0,
      "internshipStipend": 0,
      "isAlumniJob": false,
      "isProCompany": false,
      "isJobPortal": false,
      "jobTags": null,
      "jobRedirectionLink": null,
      "category": null,
      "domain": null,
      "size": null,
      "bootstrappedOrFunded": null,
      "revenue": null,
      "source": null,
      "createdAt": "2026-03-16T07:59:29.286Z",
      "updatedAt": "2026-03-17T07:39:32.145Z",
      "CompanyId": 2428,
      "CollegeId": 4633,
      "JobApplicants": [],
      "JobLocations": [
        {
          "id": 19462,
          "name": "Agra",
          "JobOpeningId": 8199,
          "createdAt": "2026-03-16T07:59:29.291Z",
          "updatedAt": "2026-03-16T07:59:29.291Z"
        }
      ],
      "JobRole": {
        "id": 1,
        "name": "Frontend Engineer",
        "createdAt": "2023-02-23T11:10:53.498Z",
        "updatedAt": "2023-06-27T12:03:29.887Z"
      },
      "Company": {
        "name": "MMI Softwares pvt ltd",
        "logo": "https://sharpener.blob.core.windows.net/companylogos/mmi_softwares_logo.jfif"
      },
      "canApply": false,
      "notApplicableReason": "Minimum 2 years of experience required"
    },
    {
      "id": 8198,
      "companyName": "MMI Softwares pvt ltd",
      "minCTC": 6,
      "maxCTC": 12,
      "expirationDateTime": "2026-03-20T07:39:00.000Z",
      "description": "<h1>Job location is MathurA</h1><p class=\"\">Looking for full stack developers minimum 2.5 years experienced and 6 days working</p>",
      "newDescription": {
        "type": "doc",
        "content": [
          {
            "type": "heading",
            "attrs": {
              "level": 1,
              "textAlign": null
            },
            "content": [
              {
                "text": "Job location is MathurA",
                "type": "text"
              }
            ]
          },
          {
            "type": "paragraph",
            "attrs": {
              "textAlign": null
            },
            "content": [
              {
                "text": "Looking for full stack developers minimum 2.5 years experienced and 6 days working",
                "type": "text"
              }
            ]
          }
        ]
      },
      "alertMessage": null,
      "alertConfirmationMessage": null,
      "JobRoleId": 2,
      "yearsOfExperience": 2,
      "status": 5,
      "closedReasonType": null,
      "closedReason": null,
      "showCompanyToStudents": true,
      "companyPOCEmail": "hr@mmsoftwares.com",
      "isPrivate": false,
      "offersInternship": false,
      "internshipDuration": 0,
      "internshipStipend": 0,
      "isAlumniJob": false,
      "isProCompany": false,
      "isJobPortal": false,
      "jobTags": null,
      "jobRedirectionLink": null,
      "category": "Product",
      "domain": "Software Services",
      "size": "Mid size (100-500)",
      "bootstrappedOrFunded": null,
      "revenue": "$5.6 million",
      "source": "Referral",
      "createdAt": "2026-03-16T07:58:42.371Z",
      "updatedAt": "2026-03-17T07:39:59.436Z",
      "CompanyId": 2428,
      "CollegeId": 4633,
      "JobApplicants": [],
      "JobLocations": [
        {
          "id": 19463,
          "name": "Agra",
          "JobOpeningId": 8198,
          "createdAt": "2026-03-16T07:59:35.413Z",
          "updatedAt": "2026-03-16T07:59:35.413Z"
        }
      ],
      "JobRole": {
        "id": 2,
        "name": "Backend Engineer",
        "createdAt": "2023-02-28T09:10:58.719Z",
        "updatedAt": "2023-03-01T12:15:43.646Z"
      },
      "Company": {
        "name": "MMI Softwares pvt ltd",
        "logo": "https://sharpener.blob.core.windows.net/companylogos/mmi_softwares_logo.jfif"
      },
      "canApply": false,
      "notApplicableReason": "Minimum 2 years of experience required"
    },
    {
      "id": 8204,
      "companyName": "Enveu",
      "minCTC": 3,
      "maxCTC": 3,
      "expirationDateTime": "2026-03-21T07:40:00.000Z",
      "description": "<h1>OFFLINE INTERVIEW FOR JAVA BACKEND DEVELOPER</h1>",
      "newDescription": {
        "type": "doc",
        "content": [
          {
            "type": "heading",
            "attrs": {
              "level": 1,
              "textAlign": null
            },
            "content": [
              {
                "text": "OFFLINE INTERVIEW FOR JAVA BACKEND DEVELOPER",
                "type": "text"
              }
            ]
          }
        ]
      },
      "alertMessage": null,
      "alertConfirmationMessage": null,
      "JobRoleId": 2,
      "yearsOfExperience": 0,
      "status": 3,
      "closedReasonType": null,
      "closedReason": null,
      "showCompanyToStudents": true,
      "companyPOCEmail": "vidhi.saxena@enveu.com",
      "isPrivate": false,
      "offersInternship": false,
      "internshipDuration": 0,
      "internshipStipend": 0,
      "isAlumniJob": false,
      "isProCompany": false,
      "isJobPortal": false,
      "jobTags": null,
      "jobRedirectionLink": null,
      "category": null,
      "domain": null,
      "size": null,
      "bootstrappedOrFunded": null,
      "revenue": null,
      "source": null,
      "createdAt": "2026-03-16T12:32:20.967Z",
      "updatedAt": "2026-03-17T07:40:59.830Z",
      "CompanyId": 2432,
      "CollegeId": 4633,
      "JobApplicants": [],
      "JobLocations": [
        {
          "id": 19469,
          "name": "Noida",
          "JobOpeningId": 8204,
          "createdAt": "2026-03-16T12:32:20.972Z",
          "updatedAt": "2026-03-16T12:32:20.972Z"
        }
      ],
      "JobRole": {
        "id": 2,
        "name": "Backend Engineer",
        "createdAt": "2023-02-28T09:10:58.719Z",
        "updatedAt": "2023-03-01T12:15:43.646Z"
      },
      "Company": {
        "name": "Enveu",
        "logo": "https://sharpener.blob.core.windows.net/companylogos/enveu_logo.jfif"
      },
      "canApply": true,
      "notApplicableReason": null
    },
    {
      "id": 8200,
      "companyName": "Kindlebit Solutions",
      "minCTC": 3,
      "maxCTC": 3,
      "expirationDateTime": "2026-03-19T07:42:00.000Z",
      "description": "<h1>10 -15 k for 6 months then 3 l.p.a</h1>",
      "newDescription": {
        "type": "doc",
        "content": [
          {
            "type": "heading",
            "attrs": {
              "level": 1,
              "textAlign": null
            },
            "content": [
              {
                "text": "10 -15 k for 6 months then 3 l.p.a",
                "type": "text"
              }
            ]
          }
        ]
      },
      "alertMessage": null,
      "alertConfirmationMessage": null,
      "JobRoleId": 1,
      "yearsOfExperience": 0,
      "status": 3,
      "closedReasonType": null,
      "closedReason": null,
      "showCompanyToStudents": true,
      "companyPOCEmail": " kanwarpartap.singh@kindlebit.org",
      "isPrivate": false,
      "offersInternship": true,
      "internshipDuration": 6,
      "internshipStipend": 10,
      "isAlumniJob": false,
      "isProCompany": false,
      "isJobPortal": false,
      "jobTags": null,
      "jobRedirectionLink": null,
      "category": null,
      "domain": null,
      "size": null,
      "bootstrappedOrFunded": null,
      "revenue": null,
      "source": null,
      "createdAt": "2026-03-16T10:35:03.588Z",
      "updatedAt": "2026-03-17T07:42:44.131Z",
      "CompanyId": 2429,
      "CollegeId": 4633,
      "JobApplicants": [],
      "JobLocations": [
        {
          "id": 19464,
          "name": "Mohali",
          "JobOpeningId": 8200,
          "createdAt": "2026-03-16T10:35:03.594Z",
          "updatedAt": "2026-03-16T10:35:03.594Z"
        }
      ],
      "JobRole": {
        "id": 1,
        "name": "Frontend Engineer",
        "createdAt": "2023-02-23T11:10:53.498Z",
        "updatedAt": "2023-06-27T12:03:29.887Z"
      },
      "Company": {
        "name": "Kindlebit Solutions",
        "logo": "https://sharpener.blob.core.windows.net/companylogos/kindlebit_solutions_logo.jfif"
      },
      "canApply": true,
      "notApplicableReason": null
    },
    {
      "id": 8212,
      "companyName": "NEXGENESIS",
      "minCTC": 4,
      "maxCTC": 4.5,
      "expirationDateTime": "2026-03-18T04:30:00.000Z",
      "description": "<h1>Company is hiring for 1 year exp react developer . 3 candidates already working</h1>",
      "newDescription": {
        "type": "doc",
        "content": [
          {
            "type": "heading",
            "attrs": {
              "level": 1,
              "textAlign": null
            },
            "content": [
              {
                "text": "Company is hiring for 1 year exp react developer . 3 candidates already working",
                "type": "text"
              }
            ]
          }
        ]
      },
      "alertMessage": null,
      "alertConfirmationMessage": null,
      "JobRoleId": 1,
      "yearsOfExperience": 0,
      "status": 2,
      "closedReasonType": null,
      "closedReason": null,
      "showCompanyToStudents": true,
      "companyPOCEmail": "pujajaiswal@14453gmail.com",
      "isPrivate": false,
      "offersInternship": false,
      "internshipDuration": 0,
      "internshipStipend": 0,
      "isAlumniJob": false,
      "isProCompany": false,
      "isJobPortal": false,
      "jobTags": null,
      "jobRedirectionLink": null,
      "category": null,
      "domain": null,
      "size": null,
      "bootstrappedOrFunded": null,
      "revenue": null,
      "source": null,
      "createdAt": "2026-03-17T08:16:05.932Z",
      "updatedAt": "2026-03-17T08:16:05.932Z",
      "CompanyId": 1187,
      "CollegeId": 4633,
      "JobApplicants": [],
      "JobLocations": [
        {
          "id": 19479,
          "name": "Pune",
          "JobOpeningId": 8212,
          "createdAt": "2026-03-17T08:16:05.938Z",
          "updatedAt": "2026-03-17T08:16:05.938Z"
        }
      ],
      "JobRole": {
        "id": 1,
        "name": "Frontend Engineer",
        "createdAt": "2023-02-23T11:10:53.498Z",
        "updatedAt": "2023-06-27T12:03:29.887Z"
      },
      "Company": {
        "name": "NEXGENESIS",
        "logo": null
      },
      "canApply": true,
      "notApplicableReason": null
    },
    {
      "id": 6233,
      "companyName": "Seventh triangle",
      "minCTC": 4,
      "maxCTC": 7,
      "expirationDateTime": "2026-03-19T07:35:00.000Z",
      "description": "<p class=\"\"></p>",
      "newDescription": {
        "type": "doc",
        "content": [
          {
            "type": "paragraph",
            "attrs": {
              "textAlign": null
            }
          }
        ]
      },
      "alertMessage": "<h2><strong>Min 1 year of exp is required</strong></h2><h2><strong>3 candidates are already working in this company</strong></h2>",
      "alertConfirmationMessage": null,
      "JobRoleId": 1,
      "yearsOfExperience": 1,
      "status": 3,
      "closedReasonType": 3,
      "closedReason": "not shortlisted",
      "showCompanyToStudents": true,
      "companyPOCEmail": "deepika.verma@seventhtriangle.com",
      "isPrivate": false,
      "offersInternship": false,
      "internshipDuration": 0,
      "internshipStipend": 0,
      "isAlumniJob": false,
      "isProCompany": false,
      "isJobPortal": false,
      "jobTags": null,
      "jobRedirectionLink": null,
      "category": null,
      "domain": null,
      "size": null,
      "bootstrappedOrFunded": null,
      "revenue": null,
      "source": null,
      "createdAt": "2025-04-07T10:19:11.385Z",
      "updatedAt": "2026-03-16T07:35:53.025Z",
      "CompanyId": 652,
      "CollegeId": 4633,
      "JobApplicants": [
        {
          "id": 80271,
          "UserId": 57312,
          "JobOpeningId": 6233,
          "status": 6,
          "interviewDate": null,
          "ctcOffered": "7.00",
          "yoe": 1,
          "rejectionReason": null,
          "createdAt": "2025-11-18T12:28:03.919Z",
          "updatedAt": "2025-12-03T12:40:54.795Z",
          "JobApplicantStatuses": [
            {
              "id": 193959,
              "JobApplicantId": 80271,
              "status": 6,
              "date": "2025-12-03T12:40:46.000Z",
              "createdAt": "2025-12-03T12:40:54.795Z",
              "updatedAt": "2025-12-03T12:40:54.795Z"
            },
            {
              "id": 191314,
              "JobApplicantId": 80271,
              "status": 2,
              "date": "2025-11-18T12:35:39.585Z",
              "createdAt": "2025-11-18T12:35:39.842Z",
              "updatedAt": "2025-11-18T12:35:39.842Z"
            },
            {
              "id": 191311,
              "JobApplicantId": 80271,
              "status": 1,
              "date": "2025-11-18T12:28:03.922Z",
              "createdAt": "2025-11-18T12:28:03.922Z",
              "updatedAt": "2025-11-18T12:28:03.922Z"
            }
          ]
        }
      ],
      "JobLocations": [
        {
          "id": 19459,
          "name": "Noida",
          "JobOpeningId": 6233,
          "createdAt": "2026-03-16T07:35:48.871Z",
          "updatedAt": "2026-03-16T07:35:48.871Z"
        }
      ],
      "JobRole": {
        "id": 1,
        "name": "Frontend Engineer",
        "createdAt": "2023-02-23T11:10:53.498Z",
        "updatedAt": "2023-06-27T12:03:29.887Z"
      },
      "Company": {
        "id": 652,
        "name": "Seventh triangle",
        "logo": null,
        "pocName": "Deepika",
        "pocNumber": "63941 59693",
        "pocEmail": "deepika.verma@seventhtriangle.com",
        "campusNexaRecommended": null,
        "createdAt": "2024-09-13T10:23:23.910Z",
        "updatedAt": "2024-09-13T10:23:23.910Z",
        "CampusNexaCompanyRefId": null,
        "CreatedById": 25244,
        "CollegeId": 4633
      }
    },
    {
      "id": 6456,
      "companyName": "Fourbrick Technology",
      "minCTC": 4,
      "maxCTC": 8.4,
      "expirationDateTime": "2026-03-09T11:18:00.000Z",
      "description": null,
      "newDescription": null,
      "alertMessage": "<h2><strong>This is for experienced candidates</strong></h2><h2><strong>CTC depends on ur last ctc</strong></h2>",
      "alertConfirmationMessage": null,
      "JobRoleId": 1,
      "yearsOfExperience": 1,
      "status": 5,
      "closedReasonType": 3,
      "closedReason": "not shortlisted",
      "showCompanyToStudents": true,
      "companyPOCEmail": "ravina.singh@fourbrick.com",
      "isPrivate": false,
      "offersInternship": false,
      "internshipDuration": 0,
      "internshipStipend": 0,
      "isAlumniJob": false,
      "isProCompany": false,
      "isJobPortal": false,
      "jobTags": null,
      "jobRedirectionLink": null,
      "category": null,
      "domain": null,
      "size": null,
      "bootstrappedOrFunded": null,
      "revenue": null,
      "source": null,
      "createdAt": "2025-05-02T10:37:13.671Z",
      "updatedAt": "2026-03-07T04:47:27.383Z",
      "CompanyId": 1544,
      "CollegeId": 4633,
      "JobApplicants": [
        {
          "id": 68002,
          "UserId": 57312,
          "JobOpeningId": 6456,
          "status": 9,
          "interviewDate": null,
          "ctcOffered": null,
          "yoe": null,
          "rejectionReason": null,
          "createdAt": "2025-05-03T08:35:30.390Z",
          "updatedAt": "2025-06-09T12:46:18.149Z",
          "JobApplicantStatuses": [
            {
              "id": 166925,
              "JobApplicantId": 68002,
              "status": 9,
              "date": "2025-06-09T12:46:18.149Z",
              "createdAt": "2025-06-09T12:46:18.150Z",
              "updatedAt": "2025-06-09T12:46:18.150Z"
            },
            {
              "id": 160366,
              "JobApplicantId": 68002,
              "status": 1,
              "date": "2025-05-03T08:35:30.393Z",
              "createdAt": "2025-05-03T08:35:30.393Z",
              "updatedAt": "2025-05-03T08:35:30.393Z"
            }
          ]
        }
      ],
      "JobLocations": [
        {
          "id": 19387,
          "name": "Noida",
          "JobOpeningId": 6456,
          "createdAt": "2026-03-06T11:18:27.774Z",
          "updatedAt": "2026-03-06T11:18:27.774Z"
        }
      ],
      "JobRole": {
        "id": 1,
        "name": "Frontend Engineer",
        "createdAt": "2023-02-23T11:10:53.498Z",
        "updatedAt": "2023-06-27T12:03:29.887Z"
      },
      "Company": {
        "id": 1544,
        "name": "Fourbrick Technology",
        "logo": null,
        "pocName": "ravina",
        "pocNumber": "7289907584",
        "pocEmail": "ravina.singh@fourbrick.com",
        "campusNexaRecommended": null,
        "createdAt": "2025-05-02T10:35:07.672Z",
        "updatedAt": "2025-05-02T10:35:07.672Z",
        "CampusNexaCompanyRefId": null,
        "CreatedById": 25244,
        "CollegeId": 4633
      }
    },
    {
      "id": 6149,
      "companyName": "Shri Genesis",
      "minCTC": 4.5,
      "maxCTC": 6,
      "expirationDateTime": "2026-02-27T13:08:00.000Z",
      "description": "<h3><strong>Minimum experienced required is 1.5 year</strong></h3><h3><strong>looking for fullstack developer</strong></h3><h3><strong>Location-Jaipur</strong></h3><h3><strong>WFO</strong></h3><h3><strong>INTERVIEW PROCESS -VIRTUAL</strong></h3><h3><strong>3 ROUNDS-TECH,CODING AND LAST IS THE HR ROUND</strong></h3><h3><strong>LOOKING FOR A FULL STACK DEVELOPER</strong></h3>",
      "newDescription": {
        "type": "doc",
        "content": [
          {
            "type": "heading",
            "attrs": {
              "level": 3,
              "textAlign": null
            },
            "content": [
              {
                "text": "Minimum experienced required is 1.5 year",
                "type": "text",
                "marks": [
                  {
                    "type": "bold"
                  }
                ]
              }
            ]
          },
          {
            "type": "heading",
            "attrs": {
              "level": 3,
              "textAlign": null
            },
            "content": [
              {
                "text": "looking for fullstack developer",
                "type": "text",
                "marks": [
                  {
                    "type": "bold"
                  }
                ]
              }
            ]
          },
          {
            "type": "heading",
            "attrs": {
              "level": 3,
              "textAlign": null
            },
            "content": [
              {
                "text": "Location-Jaipur",
                "type": "text",
                "marks": [
                  {
                    "type": "bold"
                  }
                ]
              }
            ]
          },
          {
            "type": "heading",
            "attrs": {
              "level": 3,
              "textAlign": null
            },
            "content": [
              {
                "text": "WFO",
                "type": "text",
                "marks": [
                  {
                    "type": "bold"
                  }
                ]
              }
            ]
          },
          {
            "type": "heading",
            "attrs": {
              "level": 3,
              "textAlign": null
            },
            "content": [
              {
                "text": "INTERVIEW PROCESS -VIRTUAL",
                "type": "text",
                "marks": [
                  {
                    "type": "bold"
                  }
                ]
              }
            ]
          },
          {
            "type": "heading",
            "attrs": {
              "level": 3,
              "textAlign": null
            },
            "content": [
              {
                "text": "3 ROUNDS-TECH,CODING AND LAST IS THE HR ROUND",
                "type": "text",
                "marks": [
                  {
                    "type": "bold"
                  }
                ]
              }
            ]
          },
          {
            "type": "heading",
            "attrs": {
              "level": 3,
              "textAlign": null
            },
            "content": [
              {
                "text": "LOOKING FOR A FULL STACK DEVELOPER",
                "type": "text",
                "marks": [
                  {
                    "type": "bold"
                  }
                ]
              }
            ]
          }
        ]
      },
      "alertMessage": null,
      "alertConfirmationMessage": null,
      "JobRoleId": 1,
      "yearsOfExperience": 1,
      "status": 4,
      "closedReasonType": 3,
      "closedReason": ".",
      "showCompanyToStudents": true,
      "companyPOCEmail": "XYZ@GMAIL.COM",
      "isPrivate": false,
      "offersInternship": false,
      "internshipDuration": 0,
      "internshipStipend": 0,
      "isAlumniJob": false,
      "isProCompany": false,
      "isJobPortal": false,
      "jobTags": null,
      "jobRedirectionLink": null,
      "category": null,
      "domain": null,
      "size": null,
      "bootstrappedOrFunded": null,
      "revenue": null,
      "source": null,
      "createdAt": "2025-03-21T09:56:57.277Z",
      "updatedAt": "2026-03-09T06:21:07.546Z",
      "CompanyId": 1331,
      "CollegeId": 4633,
      "JobApplicants": [
        {
          "id": 80859,
          "UserId": 57312,
          "JobOpeningId": 6149,
          "status": 9,
          "interviewDate": null,
          "ctcOffered": null,
          "yoe": null,
          "rejectionReason": null,
          "createdAt": "2025-11-27T16:12:09.518Z",
          "updatedAt": "2025-12-04T08:27:18.163Z",
          "JobApplicantStatuses": [
            {
              "id": 194103,
              "JobApplicantId": 80859,
              "status": 9,
              "date": "2025-12-04T08:27:16.000Z",
              "createdAt": "2025-12-04T08:27:18.162Z",
              "updatedAt": "2025-12-04T08:27:18.162Z"
            },
            {
              "id": 192566,
              "JobApplicantId": 80859,
              "status": 2,
              "date": "2025-11-28T10:49:05.953Z",
              "createdAt": "2025-11-28T10:49:06.882Z",
              "updatedAt": "2025-11-28T10:49:06.882Z"
            },
            {
              "id": 192482,
              "JobApplicantId": 80859,
              "status": 1,
              "date": "2025-11-27T16:12:09.521Z",
              "createdAt": "2025-11-27T16:12:09.521Z",
              "updatedAt": "2025-11-27T16:12:09.521Z"
            }
          ]
        }
      ],
      "JobLocations": [
        {
          "id": 19262,
          "name": "Jaipur",
          "JobOpeningId": 6149,
          "createdAt": "2026-02-25T06:03:04.347Z",
          "updatedAt": "2026-02-25T06:03:04.347Z"
        }
      ],
      "JobRole": {
        "id": 1,
        "name": "Frontend Engineer",
        "createdAt": "2023-02-23T11:10:53.498Z",
        "updatedAt": "2023-06-27T12:03:29.887Z"
      },
      "Company": {
        "id": 1331,
        "name": "Shri Genesis",
        "logo": null,
        "pocName": "Priti",
        "pocNumber": "6377925529",
        "pocEmail": null,
        "campusNexaRecommended": null,
        "createdAt": "2025-03-06T10:39:47.640Z",
        "updatedAt": "2025-03-06T10:39:47.640Z",
        "CampusNexaCompanyRefId": null,
        "CreatedById": 31491,
        "CollegeId": 4633
      }
    },
    {
      "id": 4271,
      "companyName": "Xgrowth",
      "minCTC": 7,
      "maxCTC": 12,
      "expirationDateTime": "2026-02-21T06:30:00.000Z",
      "description": "<h2>2 -year exp candidate required in full stack can expect upto 12 l.p.a depending upon current ctc</h2>",
      "newDescription": {
        "type": "doc",
        "content": [
          {
            "type": "heading",
            "attrs": {
              "level": 2,
              "textAlign": null
            },
            "content": [
              {
                "text": "2 -year exp candidate required in full stack can expect upto 12 l.p.a depending upon current ctc",
                "type": "text"
              }
            ]
          }
        ]
      },
      "alertMessage": null,
      "alertConfirmationMessage": null,
      "JobRoleId": 1,
      "yearsOfExperience": 2,
      "status": 5,
      "closedReasonType": 3,
      "closedReason": "dnst",
      "showCompanyToStudents": true,
      "companyPOCEmail": "saiby.kashyap@xemailverify.com",
      "isPrivate": false,
      "offersInternship": false,
      "internshipDuration": 0,
      "internshipStipend": 0,
      "isAlumniJob": false,
      "isProCompany": false,
      "isJobPortal": false,
      "jobTags": null,
      "jobRedirectionLink": null,
      "category": null,
      "domain": null,
      "size": null,
      "bootstrappedOrFunded": null,
      "revenue": null,
      "source": null,
      "createdAt": "2024-07-05T12:22:49.129Z",
      "updatedAt": "2026-02-16T06:34:08.194Z",
      "CompanyId": 284,
      "CollegeId": 4633,
      "JobApplicants": [
        {
          "id": 68959,
          "UserId": 57312,
          "JobOpeningId": 4271,
          "status": 8,
          "interviewDate": null,
          "ctcOffered": null,
          "yoe": null,
          "rejectionReason": "nt good as per the exp",
          "createdAt": "2025-05-16T03:39:53.762Z",
          "updatedAt": "2025-05-27T11:30:56.627Z",
          "JobApplicantStatuses": [
            {
              "id": 163587,
              "JobApplicantId": 68959,
              "status": 8,
              "date": "2025-05-27T11:30:44.000Z",
              "createdAt": "2025-05-27T11:30:56.627Z",
              "updatedAt": "2025-05-27T11:30:56.627Z"
            },
            {
              "id": 162352,
              "JobApplicantId": 68959,
              "status": 3,
              "date": null,
              "createdAt": "2025-05-20T08:03:50.273Z",
              "updatedAt": "2025-05-20T08:03:50.273Z"
            },
            {
              "id": 162181,
              "JobApplicantId": 68959,
              "status": 2,
              "date": "2025-05-19T07:21:57.826Z",
              "createdAt": "2025-05-19T07:22:03.130Z",
              "updatedAt": "2025-05-19T07:22:03.130Z"
            },
            {
              "id": 161952,
              "JobApplicantId": 68959,
              "status": 1,
              "date": "2025-05-16T03:39:53.766Z",
              "createdAt": "2025-05-16T03:39:53.766Z",
              "updatedAt": "2025-05-16T03:39:53.766Z"
            }
          ]
        }
      ],
      "JobLocations": [
        {
          "id": 19100,
          "name": "Noida",
          "JobOpeningId": 4271,
          "createdAt": "2026-02-13T07:10:43.300Z",
          "updatedAt": "2026-02-13T07:10:43.300Z"
        }
      ],
      "JobRole": {
        "id": 1,
        "name": "Frontend Engineer",
        "createdAt": "2023-02-23T11:10:53.498Z",
        "updatedAt": "2023-06-27T12:03:29.887Z"
      },
      "Company": {
        "id": 284,
        "name": "Xgrowth",
        "logo": null,
        "pocName": "Saivy",
        "pocNumber": "8802082382",
        "pocEmail": "saiby.kashyap@xemailverify.com",
        "campusNexaRecommended": null,
        "createdAt": "2024-07-05T12:20:37.633Z",
        "updatedAt": "2024-07-05T12:20:37.633Z",
        "CampusNexaCompanyRefId": null,
        "CreatedById": 46492,
        "CollegeId": 4633
      }
    },
    {
      "id": 4370,
      "companyName": "Culture Holidays",
      "minCTC": 3,
      "maxCTC": 4,
      "expirationDateTime": "2026-02-14T07:30:00.000Z",
      "description": "<h2>They are looking for candidates proficient in REACT , NODE &amp; MERN. CTC for freshers<strong>  10 k 3 months then 3 -4  l.p.a </strong>and exp candidates can expect upto 6 -7 l.p.a depending upon the current salary and interview. 2 candidates are already working</h2><h2><br></h2>",
      "newDescription": {
        "type": "doc",
        "content": [
          {
            "type": "heading",
            "attrs": {
              "level": 2,
              "textAlign": null
            },
            "content": [
              {
                "text": "They are looking for candidates proficient in REACT , NODE & MERN. CTC for freshers",
                "type": "text"
              },
              {
                "text": "  10 k 3 months then 3 -4  l.p.a ",
                "type": "text",
                "marks": [
                  {
                    "type": "bold"
                  }
                ]
              },
              {
                "text": "and exp candidates can expect upto 6 -7 l.p.a depending upon the current salary and interview. 2 candidates are already working",
                "type": "text"
              }
            ]
          },
          {
            "type": "heading",
            "attrs": {
              "level": 2,
              "textAlign": null
            },
            "content": [
              {
                "type": "hardBreak"
              }
            ]
          }
        ]
      },
      "alertMessage": null,
      "alertConfirmationMessage": null,
      "JobRoleId": 1,
      "yearsOfExperience": 0,
      "status": 3,
      "closedReasonType": 1,
      "closedReason": "hired",
      "showCompanyToStudents": true,
      "companyPOCEmail": "jobs@cultureholidays.com",
      "isPrivate": false,
      "offersInternship": true,
      "internshipDuration": 3,
      "internshipStipend": 10,
      "isAlumniJob": false,
      "isProCompany": false,
      "isJobPortal": false,
      "jobTags": null,
      "jobRedirectionLink": null,
      "category": null,
      "domain": null,
      "size": null,
      "bootstrappedOrFunded": null,
      "revenue": null,
      "source": null,
      "createdAt": "2024-07-19T06:36:45.067Z",
      "updatedAt": "2026-02-11T07:30:50.841Z",
      "CompanyId": 357,
      "CollegeId": 4633,
      "JobApplicants": [
        {
          "id": 68204,
          "UserId": 57312,
          "JobOpeningId": 4370,
          "status": 8,
          "interviewDate": null,
          "ctcOffered": null,
          "yoe": null,
          "rejectionReason": "nt good",
          "createdAt": "2025-05-07T19:55:17.086Z",
          "updatedAt": "2025-05-19T06:06:29.710Z",
          "JobApplicantStatuses": [
            {
              "id": 162150,
              "JobApplicantId": 68204,
              "status": 8,
              "date": "2025-05-19T06:06:15.000Z",
              "createdAt": "2025-05-19T06:06:29.710Z",
              "updatedAt": "2025-05-19T06:06:29.710Z"
            },
            {
              "id": 160796,
              "JobApplicantId": 68204,
              "status": 2,
              "date": "2025-05-08T05:12:09.537Z",
              "createdAt": "2025-05-08T05:12:09.786Z",
              "updatedAt": "2025-05-08T05:12:09.786Z"
            },
            {
              "id": 160782,
              "JobApplicantId": 68204,
              "status": 1,
              "date": "2025-05-07T19:55:17.089Z",
              "createdAt": "2025-05-07T19:55:17.089Z",
              "updatedAt": "2025-05-07T19:55:17.089Z"
            }
          ]
        }
      ],
      "JobLocations": [
        {
          "id": 18759,
          "name": "Gurgaon",
          "JobOpeningId": 4370,
          "createdAt": "2026-01-19T10:58:37.182Z",
          "updatedAt": "2026-01-19T10:58:37.182Z"
        }
      ],
      "JobRole": {
        "id": 1,
        "name": "Frontend Engineer",
        "createdAt": "2023-02-23T11:10:53.498Z",
        "updatedAt": "2023-06-27T12:03:29.887Z"
      },
      "Company": {
        "id": 357,
        "name": "Culture Holidays",
        "logo": null,
        "pocName": "Vaishali",
        "pocNumber": "9711743942",
        "pocEmail": null,
        "campusNexaRecommended": null,
        "createdAt": "2024-07-19T06:26:58.736Z",
        "updatedAt": "2024-07-19T06:26:58.736Z",
        "CampusNexaCompanyRefId": null,
        "CreatedById": 46492,
        "CollegeId": 4633
      }
    },
    {
      "id": 7675,
      "companyName": "Recotap ABM Platform",
      "minCTC": 6,
      "maxCTC": 10,
      "expirationDateTime": "2026-02-13T07:19:00.000Z",
      "description": "<h1>FINAL ROUNDS IN OFFICE AT BANGALORE if required. Min 2 years exp reqd</h1>",
      "newDescription": {
        "type": "doc",
        "content": [
          {
            "type": "heading",
            "attrs": {
              "level": 1,
              "textAlign": null
            },
            "content": [
              {
                "text": "FINAL ROUNDS IN OFFICE AT BANGALORE if required. Min 2 years exp reqd",
                "type": "text"
              }
            ]
          }
        ]
      },
      "alertMessage": null,
      "alertConfirmationMessage": null,
      "JobRoleId": 1,
      "yearsOfExperience": 1,
      "status": 4,
      "closedReasonType": 3,
      "closedReason": "dnst",
      "showCompanyToStudents": true,
      "companyPOCEmail": "vishnupriya@recotap.com",
      "isPrivate": false,
      "offersInternship": false,
      "internshipDuration": 0,
      "internshipStipend": 0,
      "isAlumniJob": false,
      "isProCompany": false,
      "isJobPortal": false,
      "jobTags": null,
      "jobRedirectionLink": null,
      "category": null,
      "domain": null,
      "size": null,
      "bootstrappedOrFunded": null,
      "revenue": null,
      "source": null,
      "createdAt": "2025-11-17T06:17:05.370Z",
      "updatedAt": "2026-02-16T14:37:41.117Z",
      "CompanyId": 2172,
      "CollegeId": 4633,
      "JobApplicants": [
        {
          "id": 80700,
          "UserId": 57312,
          "JobOpeningId": 7675,
          "status": 9,
          "interviewDate": null,
          "ctcOffered": null,
          "yoe": null,
          "rejectionReason": null,
          "createdAt": "2025-11-24T11:06:01.315Z",
          "updatedAt": "2026-02-16T14:37:41.075Z",
          "JobApplicantStatuses": [
            {
              "id": 203517,
              "JobApplicantId": 80700,
              "status": 9,
              "date": "2026-02-16T14:37:41.075Z",
              "createdAt": "2026-02-16T14:37:41.076Z",
              "updatedAt": "2026-02-16T14:37:41.076Z"
            },
            {
              "id": 192084,
              "JobApplicantId": 80700,
              "status": 1,
              "date": "2025-11-24T11:06:01.321Z",
              "createdAt": "2025-11-24T11:06:01.321Z",
              "updatedAt": "2025-11-24T11:06:01.321Z"
            }
          ]
        }
      ],
      "JobLocations": [
        {
          "id": 18986,
          "name": "Bangalore",
          "JobOpeningId": 7675,
          "createdAt": "2026-02-05T08:45:34.342Z",
          "updatedAt": "2026-02-05T08:45:34.342Z"
        }
      ],
      "JobRole": {
        "id": 1,
        "name": "Frontend Engineer",
        "createdAt": "2023-02-23T11:10:53.498Z",
        "updatedAt": "2023-06-27T12:03:29.887Z"
      },
      "Company": {
        "id": 2172,
        "name": "Recotap ABM Platform",
        "logo": null,
        "pocName": "Vishnupriya",
        "pocNumber": "9940671991",
        "pocEmail": "vishnupriya@recotap.com",
        "campusNexaRecommended": null,
        "createdAt": "2025-11-14T08:40:33.376Z",
        "updatedAt": "2025-11-14T08:40:33.376Z",
        "CampusNexaCompanyRefId": null,
        "CreatedById": 46492,
        "CollegeId": 4633
      }
    },
    {
      "id": 3936,
      "companyName": "Leadrat",
      "minCTC": 4,
      "maxCTC": 6,
      "expirationDateTime": "2026-02-12T06:44:00.000Z",
      "description": null,
      "newDescription": null,
      "alertMessage": "<h2><strong>Skill set- React js</strong></h2><h2><strong>CTC depends on last ctc</strong></h2>",
      "alertConfirmationMessage": null,
      "JobRoleId": 1,
      "yearsOfExperience": 1,
      "status": 4,
      "closedReasonType": 3,
      "closedReason": "not shortlisted",
      "showCompanyToStudents": true,
      "companyPOCEmail": "brinda.n@leadrat.com",
      "isPrivate": false,
      "offersInternship": false,
      "internshipDuration": 0,
      "internshipStipend": 0,
      "isAlumniJob": false,
      "isProCompany": false,
      "isJobPortal": false,
      "jobTags": null,
      "jobRedirectionLink": null,
      "category": null,
      "domain": null,
      "size": null,
      "bootstrappedOrFunded": null,
      "revenue": null,
      "source": null,
      "createdAt": "2024-05-29T08:27:26.074Z",
      "updatedAt": "2026-03-14T05:47:37.882Z",
      "CompanyId": null,
      "CollegeId": 4633,
      "JobApplicants": [
        {
          "id": 80333,
          "UserId": 57312,
          "JobOpeningId": 3936,
          "status": 9,
          "interviewDate": null,
          "ctcOffered": null,
          "yoe": null,
          "rejectionReason": null,
          "createdAt": "2025-11-19T04:54:12.270Z",
          "updatedAt": "2025-12-06T06:28:18.691Z",
          "JobApplicantStatuses": [
            {
              "id": 194491,
              "JobApplicantId": 80333,
              "status": 9,
              "date": "2025-12-06T06:28:18.691Z",
              "createdAt": "2025-12-06T06:28:18.691Z",
              "updatedAt": "2025-12-06T06:28:18.691Z"
            },
            {
              "id": 191377,
              "JobApplicantId": 80333,
              "status": 1,
              "date": "2025-11-19T04:54:12.273Z",
              "createdAt": "2025-11-19T04:54:12.273Z",
              "updatedAt": "2025-11-19T04:54:12.273Z"
            }
          ]
        }
      ],
      "JobLocations": [
        {
          "id": 18737,
          "name": "Bangalore",
          "JobOpeningId": 3936,
          "createdAt": "2026-01-16T08:03:31.318Z",
          "updatedAt": "2026-01-16T08:03:31.318Z"
        }
      ],
      "JobRole": {
        "id": 1,
        "name": "Frontend Engineer",
        "createdAt": "2023-02-23T11:10:53.498Z",
        "updatedAt": "2023-06-27T12:03:29.887Z"
      },
      "Company": null
    },
    {
      "id": 6528,
      "companyName": "Tracxn",
      "minCTC": 4,
      "maxCTC": 4,
      "expirationDateTime": "2026-02-12T05:29:00.000Z",
      "description": null,
      "newDescription": null,
      "alertMessage": "<h2>Role- Full stack</h2><h2><br></h2>",
      "alertConfirmationMessage": null,
      "JobRoleId": 1,
      "yearsOfExperience": 0,
      "status": 4,
      "closedReasonType": 3,
      "closedReason": "not shortlisted",
      "showCompanyToStudents": true,
      "companyPOCEmail": "hr@tracxn.com",
      "isPrivate": false,
      "offersInternship": false,
      "internshipDuration": 0,
      "internshipStipend": 0,
      "isAlumniJob": false,
      "isProCompany": false,
      "isJobPortal": false,
      "jobTags": null,
      "jobRedirectionLink": null,
      "category": null,
      "domain": null,
      "size": null,
      "bootstrappedOrFunded": null,
      "revenue": null,
      "source": null,
      "createdAt": "2025-05-13T07:18:58.362Z",
      "updatedAt": "2026-03-14T05:55:51.522Z",
      "CompanyId": 150,
      "CollegeId": 4633,
      "JobApplicants": [
        {
          "id": 79298,
          "UserId": 57312,
          "JobOpeningId": 6528,
          "status": 9,
          "interviewDate": null,
          "ctcOffered": null,
          "yoe": null,
          "rejectionReason": null,
          "createdAt": "2025-11-06T05:33:03.248Z",
          "updatedAt": "2026-03-14T05:55:51.490Z",
          "JobApplicantStatuses": [
            {
              "id": 207880,
              "JobApplicantId": 79298,
              "status": 9,
              "date": "2026-03-14T05:55:51.490Z",
              "createdAt": "2026-03-14T05:55:51.491Z",
              "updatedAt": "2026-03-14T05:55:51.491Z"
            },
            {
              "id": 189283,
              "JobApplicantId": 79298,
              "status": 1,
              "date": "2025-11-06T05:33:03.252Z",
              "createdAt": "2025-11-06T05:33:03.252Z",
              "updatedAt": "2025-11-06T05:33:03.252Z"
            }
          ]
        }
      ],
      "JobLocations": [
        {
          "id": 18259,
          "name": "Bangalore",
          "JobOpeningId": 6528,
          "createdAt": "2025-12-01T11:59:37.573Z",
          "updatedAt": "2025-12-01T11:59:37.573Z"
        }
      ],
      "JobRole": {
        "id": 1,
        "name": "Frontend Engineer",
        "createdAt": "2023-02-23T11:10:53.498Z",
        "updatedAt": "2023-06-27T12:03:29.887Z"
      },
      "Company": {
        "id": 150,
        "name": "Tracxn",
        "logo": null,
        "pocName": null,
        "pocNumber": null,
        "pocEmail": null,
        "campusNexaRecommended": null,
        "createdAt": "2024-06-13T12:03:54.865Z",
        "updatedAt": "2024-06-13T12:03:54.865Z",
        "CampusNexaCompanyRefId": null,
        "CreatedById": 25244,
        "CollegeId": 4633
      }
    },
    {
      "id": 7144,
      "companyName": "Byldd",
      "minCTC": 5,
      "maxCTC": 6,
      "expirationDateTime": "2026-02-05T04:51:00.000Z",
      "description": null,
      "newDescription": null,
      "alertMessage": "<h2><strong>Role- Full stack</strong></h2><h2><strong>CTC depends on your interview and last ctc</strong></h2><h2><strong>2 candidates got placed recently</strong></h2>",
      "alertConfirmationMessage": null,
      "JobRoleId": 1,
      "yearsOfExperience": 1,
      "status": 4,
      "closedReasonType": 3,
      "closedReason": "not shortlisted",
      "showCompanyToStudents": true,
      "companyPOCEmail": "faiza@byldd.com",
      "isPrivate": false,
      "offersInternship": false,
      "internshipDuration": 0,
      "internshipStipend": 0,
      "isAlumniJob": false,
      "isProCompany": false,
      "isJobPortal": false,
      "jobTags": null,
      "jobRedirectionLink": null,
      "category": null,
      "domain": null,
      "size": null,
      "bootstrappedOrFunded": null,
      "revenue": null,
      "source": null,
      "createdAt": "2025-08-04T05:54:04.820Z",
      "updatedAt": "2026-03-14T06:00:31.877Z",
      "CompanyId": 1884,
      "CollegeId": 4633,
      "JobApplicants": [
        {
          "id": 80260,
          "UserId": 57312,
          "JobOpeningId": 7144,
          "status": 9,
          "interviewDate": null,
          "ctcOffered": null,
          "yoe": null,
          "rejectionReason": null,
          "createdAt": "2025-11-18T11:35:20.751Z",
          "updatedAt": "2026-03-14T06:00:31.853Z",
          "JobApplicantStatuses": [
            {
              "id": 207976,
              "JobApplicantId": 80260,
              "status": 9,
              "date": "2026-03-14T06:00:31.853Z",
              "createdAt": "2026-03-14T06:00:31.854Z",
              "updatedAt": "2026-03-14T06:00:31.854Z"
            },
            {
              "id": 191283,
              "JobApplicantId": 80260,
              "status": 1,
              "date": "2025-11-18T11:35:20.754Z",
              "createdAt": "2025-11-18T11:35:20.754Z",
              "updatedAt": "2025-11-18T11:35:20.754Z"
            }
          ]
        }
      ],
      "JobLocations": [
        {
          "id": 17959,
          "name": "Remote",
          "JobOpeningId": 7144,
          "createdAt": "2025-11-03T06:50:28.942Z",
          "updatedAt": "2025-11-03T06:50:28.942Z"
        }
      ],
      "JobRole": {
        "id": 1,
        "name": "Frontend Engineer",
        "createdAt": "2023-02-23T11:10:53.498Z",
        "updatedAt": "2023-06-27T12:03:29.887Z"
      },
      "Company": {
        "id": 1884,
        "name": "Byldd",
        "logo": null,
        "pocName": "faiza",
        "pocNumber": "7827801442",
        "pocEmail": "faiza@byldd.com",
        "campusNexaRecommended": null,
        "createdAt": "2025-08-04T05:49:24.193Z",
        "updatedAt": "2025-08-04T05:49:24.193Z",
        "CampusNexaCompanyRefId": null,
        "CreatedById": 25244,
        "CollegeId": 4633
      }
    },
    {
      "id": 3819,
      "companyName": "Ultimez Technology",
      "minCTC": 8,
      "maxCTC": 11,
      "expirationDateTime": "2026-01-25T07:08:00.000Z",
      "description": "<h2>ONLY CANDIDATES WITH MORE THAN <strong>2 YEAR EXP</strong> SHOULD APPLY.</h2>",
      "newDescription": {
        "type": "doc",
        "content": [
          {
            "type": "heading",
            "attrs": {
              "level": 2,
              "textAlign": null
            },
            "content": [
              {
                "text": "ONLY CANDIDATES WITH MORE THAN ",
                "type": "text"
              },
              {
                "text": "2 YEAR EXP",
                "type": "text",
                "marks": [
                  {
                    "type": "bold"
                  }
                ]
              },
              {
                "text": " SHOULD APPLY.",
                "type": "text"
              }
            ]
          }
        ]
      },
      "alertMessage": null,
      "alertConfirmationMessage": null,
      "JobRoleId": 1,
      "yearsOfExperience": 1,
      "status": 4,
      "closedReasonType": 2,
      "closedReason": "dnt st",
      "showCompanyToStudents": true,
      "companyPOCEmail": "hr@ultimez.com",
      "isPrivate": false,
      "offersInternship": false,
      "internshipDuration": 0,
      "internshipStipend": 0,
      "isAlumniJob": false,
      "isProCompany": false,
      "isJobPortal": false,
      "jobTags": null,
      "jobRedirectionLink": null,
      "category": null,
      "domain": null,
      "size": null,
      "bootstrappedOrFunded": null,
      "revenue": null,
      "source": null,
      "createdAt": "2024-05-20T10:07:58.518Z",
      "updatedAt": "2026-02-16T14:12:57.080Z",
      "CompanyId": 1341,
      "CollegeId": 4633,
      "JobApplicants": [
        {
          "id": 66529,
          "UserId": 57312,
          "JobOpeningId": 3819,
          "status": 8,
          "interviewDate": null,
          "ctcOffered": null,
          "yoe": null,
          "rejectionReason": "not upto the mark",
          "createdAt": "2025-04-07T08:52:04.911Z",
          "updatedAt": "2025-04-30T12:17:59.560Z",
          "JobApplicantStatuses": [
            {
              "id": 160085,
              "JobApplicantId": 66529,
              "status": 8,
              "date": "2025-04-30T12:17:48.000Z",
              "createdAt": "2025-04-30T12:17:59.559Z",
              "updatedAt": "2025-04-30T12:17:59.559Z"
            },
            {
              "id": 157523,
              "JobApplicantId": 66529,
              "status": 3,
              "date": "2025-04-08T04:30:00.000Z",
              "createdAt": "2025-04-08T10:15:19.594Z",
              "updatedAt": "2025-04-08T10:15:19.594Z"
            },
            {
              "id": 157286,
              "JobApplicantId": 66529,
              "status": 2,
              "date": "2025-04-07T10:26:27.522Z",
              "createdAt": "2025-04-07T10:26:06.899Z",
              "updatedAt": "2025-04-07T10:26:06.899Z"
            },
            {
              "id": 157281,
              "JobApplicantId": 66529,
              "status": 1,
              "date": "2025-04-07T08:52:04.915Z",
              "createdAt": "2025-04-07T08:52:04.915Z",
              "updatedAt": "2025-04-07T08:52:04.915Z"
            }
          ]
        }
      ],
      "JobLocations": [
        {
          "id": 18343,
          "name": "Remote",
          "JobOpeningId": 3819,
          "createdAt": "2025-12-08T05:58:55.699Z",
          "updatedAt": "2025-12-08T05:58:55.699Z"
        }
      ],
      "JobRole": {
        "id": 1,
        "name": "Frontend Engineer",
        "createdAt": "2023-02-23T11:10:53.498Z",
        "updatedAt": "2023-06-27T12:03:29.887Z"
      },
      "Company": {
        "id": 1341,
        "name": "Ultimez Technology",
        "logo": null,
        "pocName": "Asma",
        "pocNumber": "08179917660",
        "pocEmail": "hr@ultimez.com",
        "campusNexaRecommended": null,
        "createdAt": "2025-03-10T07:49:38.980Z",
        "updatedAt": "2025-03-10T07:49:38.980Z",
        "CampusNexaCompanyRefId": null,
        "CreatedById": 46492,
        "CollegeId": 4633
      }
    },
    {
      "id": 1424,
      "companyName": "Mantra Care",
      "minCTC": 5,
      "maxCTC": 10,
      "expirationDateTime": "2026-01-23T07:11:00.000Z",
      "description": "<h2>Only for experienced folks. CTC as per the interview performance and current salary. UPTO 80 K</h2><h2>Skills required: React js, Node js, Sql, Javascript., Mongodb,</h2><h1>6 days working . FACE TO FACE INTERVIEW</h1><p class=\"\"><br></p>",
      "newDescription": {
        "type": "doc",
        "content": [
          {
            "type": "heading",
            "attrs": {
              "level": 2,
              "textAlign": null
            },
            "content": [
              {
                "text": "Only for experienced folks. CTC as per the interview performance and current salary. UPTO 80 K",
                "type": "text"
              }
            ]
          },
          {
            "type": "heading",
            "attrs": {
              "level": 2,
              "textAlign": null
            },
            "content": [
              {
                "text": "Skills required: React js, Node js, Sql, Javascript., Mongodb,",
                "type": "text"
              }
            ]
          },
          {
            "type": "heading",
            "attrs": {
              "level": 1,
              "textAlign": null
            },
            "content": [
              {
                "text": "6 days working . FACE TO FACE INTERVIEW",
                "type": "text"
              }
            ]
          },
          {
            "type": "paragraph",
            "attrs": {
              "textAlign": null
            },
            "content": [
              {
                "type": "hardBreak"
              }
            ]
          }
        ]
      },
      "alertMessage": null,
      "alertConfirmationMessage": null,
      "JobRoleId": 1,
      "yearsOfExperience": 1,
      "status": 4,
      "closedReasonType": 3,
      "closedReason": "dnst",
      "showCompanyToStudents": true,
      "companyPOCEmail": "bharat@mantracare.org",
      "isPrivate": false,
      "offersInternship": false,
      "internshipDuration": 0,
      "internshipStipend": 0,
      "isAlumniJob": false,
      "isProCompany": false,
      "isJobPortal": false,
      "jobTags": null,
      "jobRedirectionLink": null,
      "category": null,
      "domain": null,
      "size": null,
      "bootstrappedOrFunded": null,
      "revenue": null,
      "source": null,
      "createdAt": "2023-07-12T09:23:16.742Z",
      "updatedAt": "2026-02-16T14:23:29.929Z",
      "CompanyId": 851,
      "CollegeId": 4633,
      "JobApplicants": [
        {
          "id": 68074,
          "UserId": 57312,
          "JobOpeningId": 1424,
          "status": 9,
          "interviewDate": null,
          "ctcOffered": null,
          "yoe": null,
          "rejectionReason": null,
          "createdAt": "2025-05-05T09:53:19.989Z",
          "updatedAt": "2025-07-03T12:05:08.329Z",
          "JobApplicantStatuses": [
            {
              "id": 170196,
              "JobApplicantId": 68074,
              "status": 9,
              "date": "2025-07-03T12:05:08.329Z",
              "createdAt": "2025-07-03T12:05:08.330Z",
              "updatedAt": "2025-07-03T12:05:08.330Z"
            },
            {
              "id": 160531,
              "JobApplicantId": 68074,
              "status": 1,
              "date": "2025-05-05T09:53:19.992Z",
              "createdAt": "2025-05-05T09:53:19.993Z",
              "updatedAt": "2025-05-05T09:53:19.993Z"
            }
          ]
        }
      ],
      "JobLocations": [
        {
          "id": 18679,
          "name": "Delhi",
          "JobOpeningId": 1424,
          "createdAt": "2026-01-13T10:05:05.204Z",
          "updatedAt": "2026-01-13T10:05:05.204Z"
        }
      ],
      "JobRole": {
        "id": 1,
        "name": "Frontend Engineer",
        "createdAt": "2023-02-23T11:10:53.498Z",
        "updatedAt": "2023-06-27T12:03:29.887Z"
      },
      "Company": {
        "id": 851,
        "name": "Mantra Care",
        "logo": null,
        "pocName": "Bharat",
        "pocNumber": "9310578771",
        "pocEmail": "bharat@mantracare.org",
        "campusNexaRecommended": null,
        "createdAt": "2024-10-14T11:39:32.099Z",
        "updatedAt": "2024-10-14T11:39:32.099Z",
        "CampusNexaCompanyRefId": null,
        "CreatedById": 46492,
        "CollegeId": 4633
      }
    },
    {
      "id": 7343,
      "companyName": "Entire techno pvt ltd ",
      "minCTC": 5,
      "maxCTC": 7,
      "expirationDateTime": "2026-01-21T07:36:00.000Z",
      "description": "<h1><strong>Job role is full stack</strong></h1><h1><strong>Candidate must have 1.5+ years of experince.</strong></h1><h1><strong>CTC based on last CTC Totally</strong></h1><h1><strong>Want immediate joiner.</strong></h1><h1><strong>Skills required- Nextjs , Java, Mysql , Springboot </strong></h1>",
      "newDescription": {
        "type": "doc",
        "content": [
          {
            "type": "heading",
            "attrs": {
              "level": 1,
              "textAlign": null
            },
            "content": [
              {
                "text": "Job role is full stack",
                "type": "text",
                "marks": [
                  {
                    "type": "bold"
                  }
                ]
              }
            ]
          },
          {
            "type": "heading",
            "attrs": {
              "level": 1,
              "textAlign": null
            },
            "content": [
              {
                "text": "Candidate must have 1.5+ years of experince.",
                "type": "text",
                "marks": [
                  {
                    "type": "bold"
                  }
                ]
              }
            ]
          },
          {
            "type": "heading",
            "attrs": {
              "level": 1,
              "textAlign": null
            },
            "content": [
              {
                "text": "CTC based on last CTC Totally",
                "type": "text",
                "marks": [
                  {
                    "type": "bold"
                  }
                ]
              }
            ]
          },
          {
            "type": "heading",
            "attrs": {
              "level": 1,
              "textAlign": null
            },
            "content": [
              {
                "text": "Want immediate joiner.",
                "type": "text",
                "marks": [
                  {
                    "type": "bold"
                  }
                ]
              }
            ]
          },
          {
            "type": "heading",
            "attrs": {
              "level": 1,
              "textAlign": null
            },
            "content": [
              {
                "text": "Skills required- Nextjs , Java, Mysql , Springboot ",
                "type": "text",
                "marks": [
                  {
                    "type": "bold"
                  }
                ]
              }
            ]
          }
        ]
      },
      "alertMessage": null,
      "alertConfirmationMessage": null,
      "JobRoleId": 1,
      "yearsOfExperience": 1,
      "status": 3,
      "closedReasonType": 3,
      "closedReason": "did not shortlist",
      "showCompanyToStudents": true,
      "companyPOCEmail": "hr@entire.com",
      "isPrivate": false,
      "offersInternship": false,
      "internshipDuration": 0,
      "internshipStipend": 0,
      "isAlumniJob": false,
      "isProCompany": false,
      "isJobPortal": false,
      "jobTags": null,
      "jobRedirectionLink": null,
      "category": null,
      "domain": null,
      "size": null,
      "bootstrappedOrFunded": null,
      "revenue": null,
      "source": null,
      "createdAt": "2025-09-08T12:40:08.124Z",
      "updatedAt": "2026-01-19T07:36:58.793Z",
      "CompanyId": 1992,
      "CollegeId": 4633,
      "JobApplicants": [
        {
          "id": 80457,
          "UserId": 57312,
          "JobOpeningId": 7343,
          "status": 9,
          "interviewDate": null,
          "ctcOffered": null,
          "yoe": null,
          "rejectionReason": null,
          "createdAt": "2025-11-20T05:56:55.962Z",
          "updatedAt": "2026-01-05T08:58:43.797Z",
          "JobApplicantStatuses": [
            {
              "id": 197075,
              "JobApplicantId": 80457,
              "status": 9,
              "date": "2026-01-05T08:58:43.797Z",
              "createdAt": "2026-01-05T08:58:43.797Z",
              "updatedAt": "2026-01-05T08:58:43.797Z"
            },
            {
              "id": 191590,
              "JobApplicantId": 80457,
              "status": 1,
              "date": "2025-11-20T05:56:55.965Z",
              "createdAt": "2025-11-20T05:56:55.965Z",
              "updatedAt": "2025-11-20T05:56:55.965Z"
            }
          ]
        }
      ],
      "JobLocations": [
        {
          "id": 18157,
          "name": "Delhi",
          "JobOpeningId": 7343,
          "createdAt": "2025-11-19T10:03:34.743Z",
          "updatedAt": "2025-11-19T10:03:34.743Z"
        }
      ],
      "JobRole": {
        "id": 1,
        "name": "Frontend Engineer",
        "createdAt": "2023-02-23T11:10:53.498Z",
        "updatedAt": "2023-06-27T12:03:29.887Z"
      },
      "Company": {
        "id": 1992,
        "name": "Entire techno pvt ltd ",
        "logo": null,
        "pocName": "kawaljeet ",
        "pocNumber": "9310404166",
        "pocEmail": "hr@entire.com",
        "campusNexaRecommended": null,
        "createdAt": "2025-09-08T12:37:23.511Z",
        "updatedAt": "2025-09-08T12:37:23.511Z",
        "CampusNexaCompanyRefId": null,
        "CreatedById": 54536,
        "CollegeId": 4633
      }
    },
    {
      "id": 5424,
      "companyName": "WagerGeeks Private Limited",
      "minCTC": 3.5,
      "maxCTC": 6.5,
      "expirationDateTime": "2026-01-16T12:14:00.000Z",
      "description": null,
      "newDescription": null,
      "alertMessage": "<h2><strong>1 year of experience is required</strong></h2><h2><strong>CTC depends on your interview</strong></h2><h2><strong>1 candidate is working in this company</strong></h2>",
      "alertConfirmationMessage": null,
      "JobRoleId": 1,
      "yearsOfExperience": 1,
      "status": 4,
      "closedReasonType": 3,
      "closedReason": "not shortlisted",
      "showCompanyToStudents": true,
      "companyPOCEmail": "hr@wagergeeks.com",
      "isPrivate": false,
      "offersInternship": false,
      "internshipDuration": 0,
      "internshipStipend": 0,
      "isAlumniJob": false,
      "isProCompany": false,
      "isJobPortal": false,
      "jobTags": null,
      "jobRedirectionLink": null,
      "category": null,
      "domain": null,
      "size": null,
      "bootstrappedOrFunded": null,
      "revenue": null,
      "source": null,
      "createdAt": "2024-11-28T08:44:05.404Z",
      "updatedAt": "2026-03-07T06:25:57.281Z",
      "CompanyId": 1012,
      "CollegeId": 4633,
      "JobApplicants": [
        {
          "id": 80269,
          "UserId": 57312,
          "JobOpeningId": 5424,
          "status": 9,
          "interviewDate": null,
          "ctcOffered": null,
          "yoe": null,
          "rejectionReason": null,
          "createdAt": "2025-11-18T12:27:11.504Z",
          "updatedAt": "2026-03-07T06:25:57.254Z",
          "JobApplicantStatuses": [
            {
              "id": 206769,
              "JobApplicantId": 80269,
              "status": 9,
              "date": "2026-03-07T06:25:57.254Z",
              "createdAt": "2026-03-07T06:25:57.255Z",
              "updatedAt": "2026-03-07T06:25:57.255Z"
            },
            {
              "id": 191309,
              "JobApplicantId": 80269,
              "status": 1,
              "date": "2025-11-18T12:27:11.506Z",
              "createdAt": "2025-11-18T12:27:11.506Z",
              "updatedAt": "2025-11-18T12:27:11.506Z"
            }
          ]
        }
      ],
      "JobLocations": [
        {
          "id": 17448,
          "name": "Remote",
          "JobOpeningId": 5424,
          "createdAt": "2025-09-10T11:40:58.481Z",
          "updatedAt": "2025-09-10T11:40:58.481Z"
        }
      ],
      "JobRole": {
        "id": 1,
        "name": "Frontend Engineer",
        "createdAt": "2023-02-23T11:10:53.498Z",
        "updatedAt": "2023-06-27T12:03:29.887Z"
      },
      "Company": {
        "id": 1012,
        "name": "WagerGeeks Private Limited",
        "logo": null,
        "pocName": "chandni",
        "pocNumber": "99999999999",
        "pocEmail": "hr@wagergeeks.com",
        "campusNexaRecommended": null,
        "createdAt": "2024-11-28T08:43:15.142Z",
        "updatedAt": "2024-11-28T08:43:15.142Z",
        "CampusNexaCompanyRefId": null,
        "CreatedById": 25244,
        "CollegeId": 4633
      }
    },
    {
      "id": 6334,
      "companyName": "Maxlence Consulting",
      "minCTC": 5,
      "maxCTC": 6,
      "expirationDateTime": "2026-01-15T07:00:00.000Z",
      "description": "<h1>Job location is Sohna , Gurugram</h1><h1>Job role is Full stack developer</h1><h1>CTC based on last CTC and skills </h1><h1>Candidates must know MYSQL, NodeJS , ReactJs, Express.</h1><p class=\"\"></p>",
      "newDescription": {
        "type": "doc",
        "content": [
          {
            "type": "heading",
            "attrs": {
              "level": 1,
              "textAlign": null
            },
            "content": [
              {
                "text": "Job location is Sohna , Gurugram",
                "type": "text"
              }
            ]
          },
          {
            "type": "heading",
            "attrs": {
              "level": 1,
              "textAlign": null
            },
            "content": [
              {
                "text": "Job role is Full stack developer",
                "type": "text"
              }
            ]
          },
          {
            "type": "heading",
            "attrs": {
              "level": 1,
              "textAlign": null
            },
            "content": [
              {
                "text": "CTC based on last CTC and skills ",
                "type": "text"
              }
            ]
          },
          {
            "type": "heading",
            "attrs": {
              "level": 1,
              "textAlign": null
            },
            "content": [
              {
                "text": "Candidates must know MYSQL, NodeJS , ReactJs, Express.",
                "type": "text"
              }
            ]
          },
          {
            "type": "paragraph",
            "attrs": {
              "textAlign": null
            }
          }
        ]
      },
      "alertMessage": null,
      "alertConfirmationMessage": null,
      "JobRoleId": 1,
      "yearsOfExperience": 1,
      "status": 4,
      "closedReasonType": 3,
      "closedReason": "did not shortlist",
      "showCompanyToStudents": true,
      "companyPOCEmail": "vishakha@maxlence.com.au",
      "isPrivate": false,
      "offersInternship": false,
      "internshipDuration": 0,
      "internshipStipend": 0,
      "isAlumniJob": false,
      "isProCompany": false,
      "isJobPortal": false,
      "jobTags": null,
      "jobRedirectionLink": null,
      "category": null,
      "domain": null,
      "size": null,
      "bootstrappedOrFunded": null,
      "revenue": null,
      "source": null,
      "createdAt": "2025-04-16T08:00:12.213Z",
      "updatedAt": "2026-02-17T08:09:27.096Z",
      "CompanyId": 1484,
      "CollegeId": 4633,
      "JobApplicants": [
        {
          "id": 67188,
          "UserId": 57312,
          "JobOpeningId": 6334,
          "status": 9,
          "interviewDate": null,
          "ctcOffered": null,
          "yoe": null,
          "rejectionReason": null,
          "createdAt": "2025-04-18T03:04:17.577Z",
          "updatedAt": "2025-06-03T05:59:53.119Z",
          "JobApplicantStatuses": [
            {
              "id": 165608,
              "JobApplicantId": 67188,
              "status": 9,
              "date": "2025-06-03T05:59:53.117Z",
              "createdAt": "2025-06-03T05:59:53.120Z",
              "updatedAt": "2025-06-03T05:59:53.120Z"
            },
            {
              "id": 158629,
              "JobApplicantId": 67188,
              "status": 1,
              "date": "2025-04-18T03:04:17.582Z",
              "createdAt": "2025-04-18T03:04:17.582Z",
              "updatedAt": "2025-04-18T03:04:17.582Z"
            }
          ]
        }
      ],
      "JobLocations": [
        {
          "id": 18350,
          "name": "Gurgaon",
          "JobOpeningId": 6334,
          "createdAt": "2025-12-08T11:27:07.596Z",
          "updatedAt": "2025-12-08T11:27:07.596Z"
        }
      ],
      "JobRole": {
        "id": 1,
        "name": "Frontend Engineer",
        "createdAt": "2023-02-23T11:10:53.498Z",
        "updatedAt": "2023-06-27T12:03:29.887Z"
      },
      "Company": {
        "id": 1484,
        "name": "Maxlence Consulting",
        "logo": null,
        "pocName": "Vishakha",
        "pocNumber": "70892 54202",
        "pocEmail": "vishakha@maxlence.com.au",
        "campusNexaRecommended": null,
        "createdAt": "2025-04-16T07:58:03.374Z",
        "updatedAt": "2025-04-16T07:58:03.374Z",
        "CampusNexaCompanyRefId": null,
        "CreatedById": 54536,
        "CollegeId": 4633
      }
    },
    {
      "id": 7685,
      "companyName": "Turia",
      "minCTC": 5,
      "maxCTC": 9,
      "expirationDateTime": "2026-01-09T06:07:00.000Z",
      "description": null,
      "newDescription": null,
      "alertMessage": "<h2><strong>Role- Full stack developer</strong></h2><h2>2 candidates recently joined</h2><h2><strong>Package depends on your last ctc</strong></h2><h2><strong>Preferring candidates from Bangalore</strong></h2><h2><strong>3 months will be the probation period</strong></h2><h2><strong>2 years bond will be there</strong></h2><h2><strong>2 years of exp required</strong></h2><h2><br></h2>",
      "alertConfirmationMessage": null,
      "JobRoleId": 1,
      "yearsOfExperience": 1,
      "status": 4,
      "closedReasonType": 3,
      "closedReason": "not shortlisted",
      "showCompanyToStudents": true,
      "companyPOCEmail": "kavin.raj@turia.in",
      "isPrivate": false,
      "offersInternship": false,
      "internshipDuration": 0,
      "internshipStipend": 0,
      "isAlumniJob": false,
      "isProCompany": false,
      "isJobPortal": false,
      "jobTags": null,
      "jobRedirectionLink": null,
      "category": null,
      "domain": null,
      "size": null,
      "bootstrappedOrFunded": null,
      "revenue": null,
      "source": null,
      "createdAt": "2025-11-17T13:44:04.048Z",
      "updatedAt": "2026-03-07T06:25:11.913Z",
      "CompanyId": 2178,
      "CollegeId": 4633,
      "JobApplicants": [
        {
          "id": 80262,
          "UserId": 57312,
          "JobOpeningId": 7685,
          "status": 9,
          "interviewDate": null,
          "ctcOffered": null,
          "yoe": null,
          "rejectionReason": null,
          "createdAt": "2025-11-18T11:35:47.056Z",
          "updatedAt": "2026-03-07T06:25:11.900Z",
          "JobApplicantStatuses": [
            {
              "id": 206746,
              "JobApplicantId": 80262,
              "status": 9,
              "date": "2026-03-07T06:25:11.899Z",
              "createdAt": "2026-03-07T06:25:11.900Z",
              "updatedAt": "2026-03-07T06:25:11.900Z"
            },
            {
              "id": 191285,
              "JobApplicantId": 80262,
              "status": 1,
              "date": "2025-11-18T11:35:47.058Z",
              "createdAt": "2025-11-18T11:35:47.058Z",
              "updatedAt": "2025-11-18T11:35:47.058Z"
            }
          ]
        }
      ],
      "JobLocations": [
        {
          "id": 18568,
          "name": "Bangalore",
          "JobOpeningId": 7685,
          "createdAt": "2026-01-07T06:07:36.803Z",
          "updatedAt": "2026-01-07T06:07:36.803Z"
        }
      ],
      "JobRole": {
        "id": 1,
        "name": "Frontend Engineer",
        "createdAt": "2023-02-23T11:10:53.498Z",
        "updatedAt": "2023-06-27T12:03:29.887Z"
      },
      "Company": {
        "id": 2178,
        "name": "Turia",
        "logo": null,
        "pocName": "kavin",
        "pocNumber": "8431018842",
        "pocEmail": "kavin.raj@turia.in",
        "campusNexaRecommended": null,
        "createdAt": "2025-11-17T13:39:48.413Z",
        "updatedAt": "2025-11-17T13:39:48.413Z",
        "CampusNexaCompanyRefId": null,
        "CreatedById": 25244,
        "CollegeId": 4633
      }
    },
    {
      "id": 7475,
      "companyName": "KNNX Corp. ",
      "minCTC": 4,
      "maxCTC": 4.5,
      "expirationDateTime": "2026-01-07T10:35:00.000Z",
      "description": "<h1><strong>6 months of internship where stipend would be 15-20k</strong></h1><h1><strong>After 6 months CTC is 4-4.5 LPA</strong></h1><h1><strong>Job role is full stack</strong></h1><h1><strong>5 days working</strong></h1><h1><strong>3 days work form office 2 days work from home</strong></h1><h1><strong>1 Alumni sharpenerain already working</strong></h1><h1><strong>2 sharpenerians recently got placed</strong></h1><h1><strong>2024, 2025, 2026 passout required</strong></h1><h1></h1>",
      "newDescription": {
        "type": "doc",
        "content": [
          {
            "type": "heading",
            "attrs": {
              "level": 1,
              "textAlign": null
            },
            "content": [
              {
                "text": "6 months of internship where stipend would be 15-20k",
                "type": "text",
                "marks": [
                  {
                    "type": "bold"
                  }
                ]
              }
            ]
          },
          {
            "type": "heading",
            "attrs": {
              "level": 1,
              "textAlign": null
            },
            "content": [
              {
                "text": "After 6 months CTC is 4-4.5 LPA",
                "type": "text",
                "marks": [
                  {
                    "type": "bold"
                  }
                ]
              }
            ]
          },
          {
            "type": "heading",
            "attrs": {
              "level": 1,
              "textAlign": null
            },
            "content": [
              {
                "text": "Job role is full stack",
                "type": "text",
                "marks": [
                  {
                    "type": "bold"
                  }
                ]
              }
            ]
          },
          {
            "type": "heading",
            "attrs": {
              "level": 1,
              "textAlign": null
            },
            "content": [
              {
                "text": "5 days working",
                "type": "text",
                "marks": [
                  {
                    "type": "bold"
                  }
                ]
              }
            ]
          },
          {
            "type": "heading",
            "attrs": {
              "level": 1,
              "textAlign": null
            },
            "content": [
              {
                "text": "3 days work form office 2 days work from home",
                "type": "text",
                "marks": [
                  {
                    "type": "bold"
                  }
                ]
              }
            ]
          },
          {
            "type": "heading",
            "attrs": {
              "level": 1,
              "textAlign": null
            },
            "content": [
              {
                "text": "1 Alumni sharpenerain already working",
                "type": "text",
                "marks": [
                  {
                    "type": "bold"
                  }
                ]
              }
            ]
          },
          {
            "type": "heading",
            "attrs": {
              "level": 1,
              "textAlign": null
            },
            "content": [
              {
                "text": "2 sharpenerians recently got placed",
                "type": "text",
                "marks": [
                  {
                    "type": "bold"
                  }
                ]
              }
            ]
          },
          {
            "type": "heading",
            "attrs": {
              "level": 1,
              "textAlign": null
            },
            "content": [
              {
                "text": "2024, 2025, 2026 passout required",
                "type": "text",
                "marks": [
                  {
                    "type": "bold"
                  }
                ]
              }
            ]
          },
          {
            "type": "heading",
            "attrs": {
              "level": 1,
              "textAlign": null
            }
          }
        ]
      },
      "alertMessage": null,
      "alertConfirmationMessage": null,
      "JobRoleId": 1,
      "yearsOfExperience": 0,
      "status": 4,
      "closedReasonType": 1,
      "closedReason": "hirred",
      "showCompanyToStudents": true,
      "companyPOCEmail": "gaurav.agarwal@knnx.com",
      "isPrivate": false,
      "offersInternship": true,
      "internshipDuration": 6,
      "internshipStipend": 15000,
      "isAlumniJob": false,
      "isProCompany": false,
      "isJobPortal": false,
      "jobTags": null,
      "jobRedirectionLink": null,
      "category": null,
      "domain": null,
      "size": null,
      "bootstrappedOrFunded": null,
      "revenue": null,
      "source": null,
      "createdAt": "2025-10-06T10:33:03.935Z",
      "updatedAt": "2026-01-25T12:41:10.284Z",
      "CompanyId": 2076,
      "CollegeId": 4633,
      "JobApplicants": [
        {
          "id": 78544,
          "UserId": 57312,
          "JobOpeningId": 7475,
          "status": 9,
          "interviewDate": null,
          "ctcOffered": null,
          "yoe": null,
          "rejectionReason": null,
          "createdAt": "2025-10-27T03:52:39.386Z",
          "updatedAt": "2026-01-25T12:41:10.241Z",
          "JobApplicantStatuses": [
            {
              "id": 200671,
              "JobApplicantId": 78544,
              "status": 9,
              "date": "2026-01-25T12:41:10.240Z",
              "createdAt": "2026-01-25T12:41:10.241Z",
              "updatedAt": "2026-01-25T12:41:10.241Z"
            },
            {
              "id": 187650,
              "JobApplicantId": 78544,
              "status": 1,
              "date": "2025-10-27T03:52:39.389Z",
              "createdAt": "2025-10-27T03:52:39.390Z",
              "updatedAt": "2025-10-27T03:52:39.390Z"
            }
          ]
        }
      ],
      "JobLocations": [
        {
          "id": 18521,
          "name": "Noida",
          "JobOpeningId": 7475,
          "createdAt": "2025-12-30T06:47:52.723Z",
          "updatedAt": "2025-12-30T06:47:52.723Z"
        }
      ],
      "JobRole": {
        "id": 1,
        "name": "Frontend Engineer",
        "createdAt": "2023-02-23T11:10:53.498Z",
        "updatedAt": "2023-06-27T12:03:29.887Z"
      },
      "Company": {
        "id": 2076,
        "name": "KNNX Corp. ",
        "logo": null,
        "pocName": "gaurav ",
        "pocNumber": "8800865479",
        "pocEmail": "gaurav.agarwal@knnx.com",
        "campusNexaRecommended": null,
        "createdAt": "2025-10-06T10:30:09.735Z",
        "updatedAt": "2025-10-06T10:30:09.735Z",
        "CampusNexaCompanyRefId": null,
        "CreatedById": 54536,
        "CollegeId": 4633
      }
    },
    {
      "id": 7691,
      "companyName": "ContactPoint360",
      "minCTC": 6,
      "maxCTC": 10,
      "expirationDateTime": "2026-01-06T06:27:00.000Z",
      "description": "<h2>Only Candidates with a Minimum of 2 year exp should apply . No laptop will be provided since its Work from Home oppurtunity</h2>",
      "newDescription": {
        "type": "doc",
        "content": [
          {
            "type": "heading",
            "attrs": {
              "level": 2,
              "textAlign": null
            },
            "content": [
              {
                "text": "Only Candidates with a Minimum of 2 year exp should apply . No laptop will be provided since its Work from Home oppurtunity",
                "type": "text"
              }
            ]
          }
        ]
      },
      "alertMessage": null,
      "alertConfirmationMessage": null,
      "JobRoleId": 1,
      "yearsOfExperience": 1,
      "status": 4,
      "closedReasonType": 3,
      "closedReason": "dnst",
      "showCompanyToStudents": true,
      "companyPOCEmail": "sankar.rajappan@cp-360.com",
      "isPrivate": false,
      "offersInternship": false,
      "internshipDuration": 0,
      "internshipStipend": 0,
      "isAlumniJob": false,
      "isProCompany": false,
      "isJobPortal": false,
      "jobTags": null,
      "jobRedirectionLink": null,
      "category": null,
      "domain": null,
      "size": null,
      "bootstrappedOrFunded": null,
      "revenue": null,
      "source": null,
      "createdAt": "2025-11-18T11:00:24.006Z",
      "updatedAt": "2026-02-16T14:45:57.433Z",
      "CompanyId": 1428,
      "CollegeId": 4633,
      "JobApplicants": [
        {
          "id": 80265,
          "UserId": 57312,
          "JobOpeningId": 7691,
          "status": 9,
          "interviewDate": null,
          "ctcOffered": null,
          "yoe": null,
          "rejectionReason": null,
          "createdAt": "2025-11-18T11:37:17.582Z",
          "updatedAt": "2026-02-16T14:45:57.393Z",
          "JobApplicantStatuses": [
            {
              "id": 203821,
              "JobApplicantId": 80265,
              "status": 9,
              "date": "2026-02-16T14:45:57.391Z",
              "createdAt": "2026-02-16T14:45:57.393Z",
              "updatedAt": "2026-02-16T14:45:57.393Z"
            },
            {
              "id": 191288,
              "JobApplicantId": 80265,
              "status": 1,
              "date": "2025-11-18T11:37:17.585Z",
              "createdAt": "2025-11-18T11:37:17.585Z",
              "updatedAt": "2025-11-18T11:37:17.585Z"
            }
          ]
        }
      ],
      "JobLocations": [
        {
          "id": 18149,
          "name": "Remote",
          "JobOpeningId": 7691,
          "createdAt": "2025-11-18T11:00:24.010Z",
          "updatedAt": "2025-11-18T11:00:24.010Z"
        }
      ],
      "JobRole": {
        "id": 1,
        "name": "Frontend Engineer",
        "createdAt": "2023-02-23T11:10:53.498Z",
        "updatedAt": "2023-06-27T12:03:29.887Z"
      },
      "Company": {
        "id": 1428,
        "name": "ContactPoint360",
        "logo": null,
        "pocName": "Sankar",
        "pocNumber": "7012233811",
        "pocEmail": "sankar.rajappan@cp-360.com",
        "campusNexaRecommended": null,
        "createdAt": "2025-04-08T10:09:04.221Z",
        "updatedAt": "2025-04-08T10:09:04.221Z",
        "CampusNexaCompanyRefId": null,
        "CreatedById": 46492,
        "CollegeId": 4633
      }
    },
    {
      "id": 7738,
      "companyName": "Revenza Tech Private limited",
      "minCTC": 3,
      "maxCTC": 5,
      "expirationDateTime": "2026-01-02T05:52:00.000Z",
      "description": "<p class=\"\"><span style=\"color: rgba(0, 0, 0, 0.9)\"><strong>Requirements</strong></span><span><strong><br></strong></span><span style=\"color: rgba(0, 0, 0, 0.9)\">Strong React knowledge.</span></p><ul><li><p class=\"\"><span style=\"color: rgba(0, 0, 0, 0.9)\">Figma-to-UI conversion.</span></p></li><li><p class=\"\"><span style=\"color: rgba(0, 0, 0, 0.9)\">REST API integration.</span></p></li><li><p class=\"\"><span style=\"color: rgba(0, 0, 0, 0.9)\">Redux Toolkit.</span></p></li><li><p class=\"\"><span style=\"color: rgba(0, 0, 0, 0.9)\">Good CSS skills.</span></p></li><li><p class=\"\"><span style=\"color: rgba(0, 0, 0, 0.9)\">Git/GitHub basics.</span></p></li></ul>",
      "newDescription": {
        "type": "doc",
        "content": [
          {
            "type": "paragraph",
            "attrs": {
              "textAlign": null
            },
            "content": [
              {
                "text": "Requirements",
                "type": "text",
                "marks": [
                  {
                    "type": "textStyle",
                    "attrs": {
                      "color": "rgba(0, 0, 0, 0.9)"
                    }
                  },
                  {
                    "type": "bold"
                  }
                ]
              },
              {
                "type": "hardBreak",
                "marks": [
                  {
                    "type": "textStyle",
                    "attrs": {
                      "color": ""
                    }
                  },
                  {
                    "type": "bold"
                  }
                ]
              },
              {
                "text": "Strong React knowledge.",
                "type": "text",
                "marks": [
                  {
                    "type": "textStyle",
                    "attrs": {
                      "color": "rgba(0, 0, 0, 0.9)"
                    }
                  }
                ]
              }
            ]
          },
          {
            "type": "bulletList",
            "content": [
              {
                "type": "listItem",
                "content": [
                  {
                    "type": "paragraph",
                    "attrs": {
                      "textAlign": null
                    },
                    "content": [
                      {
                        "text": "Figma-to-UI conversion.",
                        "type": "text",
                        "marks": [
                          {
                            "type": "textStyle",
                            "attrs": {
                              "color": "rgba(0, 0, 0, 0.9)"
                            }
                          }
                        ]
                      }
                    ]
                  }
                ]
              },
              {
                "type": "listItem",
                "content": [
                  {
                    "type": "paragraph",
                    "attrs": {
                      "textAlign": null
                    },
                    "content": [
                      {
                        "text": "REST API integration.",
                        "type": "text",
                        "marks": [
                          {
                            "type": "textStyle",
                            "attrs": {
                              "color": "rgba(0, 0, 0, 0.9)"
                            }
                          }
                        ]
                      }
                    ]
                  }
                ]
              },
              {
                "type": "listItem",
                "content": [
                  {
                    "type": "paragraph",
                    "attrs": {
                      "textAlign": null
                    },
                    "content": [
                      {
                        "text": "Redux Toolkit.",
                        "type": "text",
                        "marks": [
                          {
                            "type": "textStyle",
                            "attrs": {
                              "color": "rgba(0, 0, 0, 0.9)"
                            }
                          }
                        ]
                      }
                    ]
                  }
                ]
              },
              {
                "type": "listItem",
                "content": [
                  {
                    "type": "paragraph",
                    "attrs": {
                      "textAlign": null
                    },
                    "content": [
                      {
                        "text": "Good CSS skills.",
                        "type": "text",
                        "marks": [
                          {
                            "type": "textStyle",
                            "attrs": {
                              "color": "rgba(0, 0, 0, 0.9)"
                            }
                          }
                        ]
                      }
                    ]
                  }
                ]
              },
              {
                "type": "listItem",
                "content": [
                  {
                    "type": "paragraph",
                    "attrs": {
                      "textAlign": null
                    },
                    "content": [
                      {
                        "text": "Git/GitHub basics.",
                        "type": "text",
                        "marks": [
                          {
                            "type": "textStyle",
                            "attrs": {
                              "color": "rgba(0, 0, 0, 0.9)"
                            }
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      },
      "alertMessage": null,
      "alertConfirmationMessage": null,
      "JobRoleId": 1,
      "yearsOfExperience": 0,
      "status": 4,
      "closedReasonType": 1,
      "closedReason": "hired",
      "showCompanyToStudents": true,
      "companyPOCEmail": "samarth@revenzatech.com",
      "isPrivate": false,
      "offersInternship": false,
      "internshipDuration": 0,
      "internshipStipend": 0,
      "isAlumniJob": false,
      "isProCompany": false,
      "isJobPortal": false,
      "jobTags": null,
      "jobRedirectionLink": null,
      "category": "Service",
      "domain": "Software Services",
      "size": "Startup (<100)",
      "bootstrappedOrFunded": "Bootstrapped",
      "revenue": null,
      "source": "LinkedIn",
      "createdAt": "2025-12-01T11:19:50.715Z",
      "updatedAt": "2026-02-16T14:46:45.806Z",
      "CompanyId": 2209,
      "CollegeId": 4633,
      "JobApplicants": [
        {
          "id": 81048,
          "UserId": 57312,
          "JobOpeningId": 7738,
          "status": 9,
          "interviewDate": null,
          "ctcOffered": null,
          "yoe": null,
          "rejectionReason": null,
          "createdAt": "2025-12-01T15:33:07.932Z",
          "updatedAt": "2026-02-16T14:46:45.762Z",
          "JobApplicantStatuses": [
            {
              "id": 203867,
              "JobApplicantId": 81048,
              "status": 9,
              "date": "2026-02-16T14:46:45.761Z",
              "createdAt": "2026-02-16T14:46:45.762Z",
              "updatedAt": "2026-02-16T14:46:45.762Z"
            },
            {
              "id": 192841,
              "JobApplicantId": 81048,
              "status": 1,
              "date": "2025-12-01T15:33:07.934Z",
              "createdAt": "2025-12-01T15:33:07.934Z",
              "updatedAt": "2025-12-01T15:33:07.934Z"
            }
          ]
        }
      ],
      "JobLocations": [
        {
          "id": 18488,
          "name": "Noida",
          "JobOpeningId": 7738,
          "createdAt": "2025-12-24T06:18:24.276Z",
          "updatedAt": "2025-12-24T06:18:24.276Z"
        }
      ],
      "JobRole": {
        "id": 1,
        "name": "Frontend Engineer",
        "createdAt": "2023-02-23T11:10:53.498Z",
        "updatedAt": "2023-06-27T12:03:29.887Z"
      },
      "Company": {
        "id": 2209,
        "name": "Revenza Tech Private limited",
        "logo": "https://sharpener.blob.core.windows.net/companylogos/revenza logo.jfif",
        "pocName": "Samarth",
        "pocNumber": "74170 04118",
        "pocEmail": "samarth@revenzatech.com",
        "campusNexaRecommended": null,
        "createdAt": "2025-12-01T11:17:50.623Z",
        "updatedAt": "2025-12-01T11:17:50.623Z",
        "CampusNexaCompanyRefId": null,
        "CreatedById": 46492,
        "CollegeId": 4633
      }
    },
    {
      "id": 6570,
      "companyName": "Paper plane  design solutions ",
      "minCTC": 6,
      "maxCTC": 6.5,
      "expirationDateTime": "2026-01-01T06:42:00.000Z",
      "description": "<h1>Minimum 1.5 years of experience is required.</h1><h1>Experience in frontend required</h1>",
      "newDescription": {
        "type": "doc",
        "content": [
          {
            "type": "heading",
            "attrs": {
              "level": 1,
              "textAlign": null
            },
            "content": [
              {
                "text": "Minimum 1.5 years of experience is required.",
                "type": "text"
              }
            ]
          },
          {
            "type": "heading",
            "attrs": {
              "level": 1,
              "textAlign": null
            },
            "content": [
              {
                "text": "Experience in frontend required",
                "type": "text"
              }
            ]
          }
        ]
      },
      "alertMessage": null,
      "alertConfirmationMessage": null,
      "JobRoleId": 1,
      "yearsOfExperience": 1,
      "status": 4,
      "closedReasonType": 3,
      "closedReason": "did not shortlist",
      "showCompanyToStudents": true,
      "companyPOCEmail": "geethika@paperplane.net",
      "isPrivate": false,
      "offersInternship": false,
      "internshipDuration": 0,
      "internshipStipend": 0,
      "isAlumniJob": false,
      "isProCompany": false,
      "isJobPortal": false,
      "jobTags": null,
      "jobRedirectionLink": null,
      "category": null,
      "domain": null,
      "size": null,
      "bootstrappedOrFunded": null,
      "revenue": null,
      "source": null,
      "createdAt": "2025-05-16T09:49:20.116Z",
      "updatedAt": "2026-01-25T12:58:21.875Z",
      "CompanyId": 1602,
      "CollegeId": 4633,
      "JobApplicants": [
        {
          "id": 80535,
          "UserId": 57312,
          "JobOpeningId": 6570,
          "status": 9,
          "interviewDate": null,
          "ctcOffered": null,
          "yoe": null,
          "rejectionReason": null,
          "createdAt": "2025-11-21T03:33:57.234Z",
          "updatedAt": "2026-01-25T12:58:21.865Z",
          "JobApplicantStatuses": [
            {
              "id": 200881,
              "JobApplicantId": 80535,
              "status": 9,
              "date": "2026-01-25T12:58:21.864Z",
              "createdAt": "2026-01-25T12:58:21.865Z",
              "updatedAt": "2026-01-25T12:58:21.865Z"
            },
            {
              "id": 191744,
              "JobApplicantId": 80535,
              "status": 2,
              "date": "2025-11-21T06:02:16.043Z",
              "createdAt": "2025-11-21T06:02:16.132Z",
              "updatedAt": "2025-11-21T06:02:16.132Z"
            },
            {
              "id": 191726,
              "JobApplicantId": 80535,
              "status": 1,
              "date": "2025-11-21T03:33:57.237Z",
              "createdAt": "2025-11-21T03:33:57.237Z",
              "updatedAt": "2025-11-21T03:33:57.237Z"
            }
          ]
        }
      ],
      "JobLocations": [
        {
          "id": 15582,
          "name": "Mumbai",
          "JobOpeningId": 6570,
          "createdAt": "2025-05-20T12:58:50.351Z",
          "updatedAt": "2025-05-20T12:58:50.351Z"
        }
      ],
      "JobRole": {
        "id": 1,
        "name": "Frontend Engineer",
        "createdAt": "2023-02-23T11:10:53.498Z",
        "updatedAt": "2023-06-27T12:03:29.887Z"
      },
      "Company": {
        "id": 1602,
        "name": "Paper plane  design solutions ",
        "logo": null,
        "pocName": "Geethika",
        "pocNumber": "91739 12339",
        "pocEmail": "geethika@paperplane.net , career@paperplane.net",
        "campusNexaRecommended": null,
        "createdAt": "2025-05-16T09:47:12.164Z",
        "updatedAt": "2025-05-16T09:47:12.164Z",
        "CampusNexaCompanyRefId": null,
        "CreatedById": 54536,
        "CollegeId": 4633
      }
    },
    {
      "id": 7720,
      "companyName": "Intelegain Technologies pvt ltd ",
      "minCTC": 4,
      "maxCTC": 6,
      "expirationDateTime": "2025-12-19T06:08:00.000Z",
      "description": "<p class=\"\">Candidates with 1 year of experince required.</p><p class=\"\">CTC based on last CTC </p><p class=\"\"><span style=\"color: rgb(89, 89, 89)\">looking for a passionate and skilled </span><strong>Frontend Developer</strong><span style=\"color: rgb(89, 89, 89)\"> with expertise in </span><strong>React</strong><span style=\"color: rgb(89, 89, 89)\"> and </span><strong>Next.js</strong><span style=\"color: rgb(89, 89, 89)\"> to join our dynamic team. You'll be responsible for building and maintaining high-quality, performant, and user-friendly interfaces for our web applications.</span></p>",
      "newDescription": {
        "type": "doc",
        "content": [
          {
            "type": "paragraph",
            "attrs": {
              "textAlign": null
            },
            "content": [
              {
                "text": "Candidates with 1 year of experince required.",
                "type": "text"
              }
            ]
          },
          {
            "type": "paragraph",
            "attrs": {
              "textAlign": null
            },
            "content": [
              {
                "text": "CTC based on last CTC ",
                "type": "text"
              }
            ]
          },
          {
            "type": "paragraph",
            "attrs": {
              "textAlign": null
            },
            "content": [
              {
                "text": "looking for a passionate and skilled ",
                "type": "text",
                "marks": [
                  {
                    "type": "textStyle",
                    "attrs": {
                      "color": "rgb(89, 89, 89)"
                    }
                  }
                ]
              },
              {
                "text": "Frontend Developer",
                "type": "text",
                "marks": [
                  {
                    "type": "bold"
                  }
                ]
              },
              {
                "text": " with expertise in ",
                "type": "text",
                "marks": [
                  {
                    "type": "textStyle",
                    "attrs": {
                      "color": "rgb(89, 89, 89)"
                    }
                  }
                ]
              },
              {
                "text": "React",
                "type": "text",
                "marks": [
                  {
                    "type": "bold"
                  }
                ]
              },
              {
                "text": " and ",
                "type": "text",
                "marks": [
                  {
                    "type": "textStyle",
                    "attrs": {
                      "color": "rgb(89, 89, 89)"
                    }
                  }
                ]
              },
              {
                "text": "Next.js",
                "type": "text",
                "marks": [
                  {
                    "type": "bold"
                  }
                ]
              },
              {
                "text": " to join our dynamic team. You'll be responsible for building and maintaining high-quality, performant, and user-friendly interfaces for our web applications.",
                "type": "text",
                "marks": [
                  {
                    "type": "textStyle",
                    "attrs": {
                      "color": "rgb(89, 89, 89)"
                    }
                  }
                ]
              }
            ]
          }
        ]
      },
      "alertMessage": null,
      "alertConfirmationMessage": null,
      "JobRoleId": 1,
      "yearsOfExperience": 1,
      "status": 4,
      "closedReasonType": 3,
      "closedReason": "did not shortlist",
      "showCompanyToStudents": true,
      "companyPOCEmail": "shyamali.m@intelegain.com",
      "isPrivate": false,
      "offersInternship": false,
      "internshipDuration": 0,
      "internshipStipend": 0,
      "isAlumniJob": false,
      "isProCompany": false,
      "isJobPortal": false,
      "jobTags": null,
      "jobRedirectionLink": null,
      "category": "Product",
      "domain": "Software Services",
      "size": "Mid size (100-500)",
      "bootstrappedOrFunded": null,
      "revenue": "10.1 cr",
      "source": "Indeed",
      "createdAt": "2025-11-26T11:45:36.344Z",
      "updatedAt": "2026-01-05T09:27:54.551Z",
      "CompanyId": 2197,
      "CollegeId": 4633,
      "JobApplicants": [
        {
          "id": 80801,
          "UserId": 57312,
          "JobOpeningId": 7720,
          "status": 9,
          "interviewDate": null,
          "ctcOffered": null,
          "yoe": null,
          "rejectionReason": null,
          "createdAt": "2025-11-27T04:14:40.179Z",
          "updatedAt": "2026-01-05T09:27:54.538Z",
          "JobApplicantStatuses": [
            {
              "id": 197395,
              "JobApplicantId": 80801,
              "status": 9,
              "date": "2026-01-05T09:27:54.538Z",
              "createdAt": "2026-01-05T09:27:54.539Z",
              "updatedAt": "2026-01-05T09:27:54.539Z"
            },
            {
              "id": 192407,
              "JobApplicantId": 80801,
              "status": 2,
              "date": "2025-11-27T07:39:09.114Z",
              "createdAt": "2025-11-27T07:39:09.302Z",
              "updatedAt": "2025-11-27T07:39:09.302Z"
            },
            {
              "id": 192364,
              "JobApplicantId": 80801,
              "status": 1,
              "date": "2025-11-27T04:14:40.182Z",
              "createdAt": "2025-11-27T04:14:40.182Z",
              "updatedAt": "2025-11-27T04:14:40.182Z"
            }
          ]
        }
      ],
      "JobLocations": [
        {
          "id": 18205,
          "name": "Mumbai",
          "JobOpeningId": 7720,
          "createdAt": "2025-11-26T11:45:36.350Z",
          "updatedAt": "2025-11-26T11:45:36.350Z"
        }
      ],
      "JobRole": {
        "id": 1,
        "name": "Frontend Engineer",
        "createdAt": "2023-02-23T11:10:53.498Z",
        "updatedAt": "2023-06-27T12:03:29.887Z"
      },
      "Company": {
        "id": 2197,
        "name": "Intelegain Technologies pvt ltd ",
        "logo": "https://sharpener.blob.core.windows.net/companylogos/1631333809917.jpeg",
        "pocName": "Shyamali",
        "pocNumber": "81690 10728",
        "pocEmail": "shyamali.m@intelegain.com",
        "campusNexaRecommended": null,
        "createdAt": "2025-11-26T11:43:17.388Z",
        "updatedAt": "2025-11-26T11:43:55.386Z",
        "CampusNexaCompanyRefId": null,
        "CreatedById": 54536,
        "CollegeId": 4633
      }
    },
    {
      "id": 7560,
      "companyName": "Torry harris business solutions",
      "minCTC": 4.5,
      "maxCTC": 5.5,
      "expirationDateTime": "2025-12-11T12:29:00.000Z",
      "description": null,
      "newDescription": null,
      "alertMessage": "<p><strong>Passout year- 2024-2025</strong></p><p><strong>Any language plus clouds is mandatory</strong></p><p><strong>CTC depends on your interview</strong></p><p><br></p>",
      "alertConfirmationMessage": null,
      "JobRoleId": 1,
      "yearsOfExperience": 0,
      "status": 3,
      "closedReasonType": 3,
      "closedReason": "not shortlisted",
      "showCompanyToStudents": true,
      "companyPOCEmail": "rahul_dhillion@thbs.com",
      "isPrivate": false,
      "offersInternship": false,
      "internshipDuration": 0,
      "internshipStipend": 0,
      "isAlumniJob": false,
      "isProCompany": false,
      "isJobPortal": false,
      "jobTags": null,
      "jobRedirectionLink": null,
      "category": null,
      "domain": null,
      "size": null,
      "bootstrappedOrFunded": null,
      "revenue": null,
      "source": null,
      "createdAt": "2025-10-28T06:54:20.130Z",
      "updatedAt": "2025-12-09T12:29:23.513Z",
      "CompanyId": 2114,
      "CollegeId": 4633,
      "JobApplicants": [
        {
          "id": 78734,
          "UserId": 57312,
          "JobOpeningId": 7560,
          "status": 9,
          "interviewDate": null,
          "ctcOffered": null,
          "yoe": null,
          "rejectionReason": null,
          "createdAt": "2025-10-28T16:27:00.649Z",
          "updatedAt": "2025-12-06T06:32:49.538Z",
          "JobApplicantStatuses": [
            {
              "id": 194604,
              "JobApplicantId": 78734,
              "status": 9,
              "date": "2025-12-06T06:32:49.537Z",
              "createdAt": "2025-12-06T06:32:49.538Z",
              "updatedAt": "2025-12-06T06:32:49.538Z"
            },
            {
              "id": 188044,
              "JobApplicantId": 78734,
              "status": 1,
              "date": "2025-10-28T16:27:00.653Z",
              "createdAt": "2025-10-28T16:27:00.653Z",
              "updatedAt": "2025-10-28T16:27:00.653Z"
            }
          ]
        }
      ],
      "JobLocations": [
        {
          "id": 17900,
          "name": "Bangalore",
          "JobOpeningId": 7560,
          "createdAt": "2025-10-28T06:54:20.136Z",
          "updatedAt": "2025-10-28T06:54:20.136Z"
        }
      ],
      "JobRole": {
        "id": 1,
        "name": "Frontend Engineer",
        "createdAt": "2023-02-23T11:10:53.498Z",
        "updatedAt": "2023-06-27T12:03:29.887Z"
      },
      "Company": {
        "id": 2114,
        "name": "Torry harris business solutions",
        "logo": null,
        "pocName": "rahul",
        "pocNumber": "9582361545",
        "pocEmail": "rahul_dhillion@thbs.com",
        "campusNexaRecommended": null,
        "createdAt": "2025-10-28T06:48:26.123Z",
        "updatedAt": "2025-10-28T06:48:26.123Z",
        "CampusNexaCompanyRefId": null,
        "CreatedById": 25244,
        "CollegeId": 4633
      }
    },
    {
      "id": 7731,
      "companyName": "GetHyr",
      "minCTC": 8,
      "maxCTC": 13,
      "expirationDateTime": "2025-12-06T07:40:00.000Z",
      "description": "<h2><strong>1-3 YEARS EXP REQUIRED IN MERN STACK. CTC DEPENDS ON CURRENT SALARY</strong></h2>",
      "newDescription": {
        "type": "doc",
        "content": [
          {
            "type": "heading",
            "attrs": {
              "level": 2,
              "textAlign": null
            },
            "content": [
              {
                "text": "1-3 YEARS EXP REQUIRED IN MERN STACK. CTC DEPENDS ON CURRENT SALARY",
                "type": "text",
                "marks": [
                  {
                    "type": "bold"
                  }
                ]
              }
            ]
          }
        ]
      },
      "alertMessage": null,
      "alertConfirmationMessage": null,
      "JobRoleId": 1,
      "yearsOfExperience": 1,
      "status": 4,
      "closedReasonType": 3,
      "closedReason": "nt st",
      "showCompanyToStudents": true,
      "companyPOCEmail": "divyanshu.singh@gethyr.com",
      "isPrivate": false,
      "offersInternship": false,
      "internshipDuration": 0,
      "internshipStipend": 0,
      "isAlumniJob": false,
      "isProCompany": false,
      "isJobPortal": false,
      "jobTags": null,
      "jobRedirectionLink": null,
      "category": "Service",
      "domain": "Software Services",
      "size": "Startup (<100)",
      "bootstrappedOrFunded": null,
      "revenue": null,
      "source": null,
      "createdAt": "2025-11-28T07:42:17.268Z",
      "updatedAt": "2026-01-06T08:30:34.579Z",
      "CompanyId": 2205,
      "CollegeId": 4633,
      "JobApplicants": [
        {
          "id": 80932,
          "UserId": 57312,
          "JobOpeningId": 7731,
          "status": 9,
          "interviewDate": null,
          "ctcOffered": null,
          "yoe": null,
          "rejectionReason": null,
          "createdAt": "2025-11-28T16:26:19.973Z",
          "updatedAt": "2026-01-06T08:30:34.565Z",
          "JobApplicantStatuses": [
            {
              "id": 197641,
              "JobApplicantId": 80932,
              "status": 9,
              "date": "2026-01-06T08:30:34.565Z",
              "createdAt": "2026-01-06T08:30:34.565Z",
              "updatedAt": "2026-01-06T08:30:34.565Z"
            },
            {
              "id": 192589,
              "JobApplicantId": 80932,
              "status": 1,
              "date": "2025-11-28T16:26:19.976Z",
              "createdAt": "2025-11-28T16:26:19.976Z",
              "updatedAt": "2025-11-28T16:26:19.976Z"
            }
          ]
        }
      ],
      "JobLocations": [
        {
          "id": 18237,
          "name": "Noida",
          "JobOpeningId": 7731,
          "createdAt": "2025-11-28T07:42:17.275Z",
          "updatedAt": "2025-11-28T07:42:17.275Z"
        },
        {
          "id": 18236,
          "name": "Gurgaon",
          "JobOpeningId": 7731,
          "createdAt": "2025-11-28T07:42:17.275Z",
          "updatedAt": "2025-11-28T07:42:17.275Z"
        }
      ],
      "JobRole": {
        "id": 1,
        "name": "Frontend Engineer",
        "createdAt": "2023-02-23T11:10:53.498Z",
        "updatedAt": "2023-06-27T12:03:29.887Z"
      },
      "Company": {
        "id": 2205,
        "name": "GetHyr",
        "logo": "https://sharpener.blob.core.windows.net/companylogos/gethyr_logo.jfif",
        "pocName": "Divyanshu",
        "pocNumber": "70070 61933",
        "pocEmail": "divyanshu.singh@gethyr.com",
        "campusNexaRecommended": null,
        "createdAt": "2025-11-28T07:33:48.887Z",
        "updatedAt": "2025-11-28T07:33:48.887Z",
        "CampusNexaCompanyRefId": null,
        "CreatedById": 46492,
        "CollegeId": 4633
      }
    },
    {
      "id": 7683,
      "companyName": "Turia",
      "minCTC": 3.6,
      "maxCTC": 4,
      "expirationDateTime": "2025-12-06T06:46:00.000Z",
      "description": null,
      "newDescription": null,
      "alertMessage": "<h2><strong>Role- Full stack developer</strong></h2><h2><strong>Java and react js</strong></h2><h2><strong>Preferring candidates from Bangalore</strong></h2><h2><strong>3 months will be the probation period</strong></h2><p><br></p>",
      "alertConfirmationMessage": null,
      "JobRoleId": 1,
      "yearsOfExperience": 0,
      "status": 4,
      "closedReasonType": 3,
      "closedReason": "not shortlisted",
      "showCompanyToStudents": true,
      "companyPOCEmail": "kavin.raj@turia.in",
      "isPrivate": false,
      "offersInternship": false,
      "internshipDuration": 0,
      "internshipStipend": 0,
      "isAlumniJob": false,
      "isProCompany": false,
      "isJobPortal": false,
      "jobTags": null,
      "jobRedirectionLink": null,
      "category": null,
      "domain": null,
      "size": null,
      "bootstrappedOrFunded": null,
      "revenue": null,
      "source": null,
      "createdAt": "2025-11-17T13:42:14.861Z",
      "updatedAt": "2026-03-07T06:24:01.689Z",
      "CompanyId": 2178,
      "CollegeId": 4633,
      "JobApplicants": [
        {
          "id": 80199,
          "UserId": 57312,
          "JobOpeningId": 7683,
          "status": 9,
          "interviewDate": null,
          "ctcOffered": null,
          "yoe": null,
          "rejectionReason": null,
          "createdAt": "2025-11-18T06:49:13.982Z",
          "updatedAt": "2026-03-07T06:24:01.664Z",
          "JobApplicantStatuses": [
            {
              "id": 206664,
              "JobApplicantId": 80199,
              "status": 9,
              "date": "2026-03-07T06:24:01.663Z",
              "createdAt": "2026-03-07T06:24:01.664Z",
              "updatedAt": "2026-03-07T06:24:01.664Z"
            },
            {
              "id": 191187,
              "JobApplicantId": 80199,
              "status": 1,
              "date": "2025-11-18T06:49:13.985Z",
              "createdAt": "2025-11-18T06:49:13.985Z",
              "updatedAt": "2025-11-18T06:49:13.985Z"
            }
          ]
        }
      ],
      "JobLocations": [
        {
          "id": 18140,
          "name": "Bangalore",
          "JobOpeningId": 7683,
          "createdAt": "2025-11-17T13:42:14.869Z",
          "updatedAt": "2025-11-17T13:42:14.869Z"
        }
      ],
      "JobRole": {
        "id": 1,
        "name": "Frontend Engineer",
        "createdAt": "2023-02-23T11:10:53.498Z",
        "updatedAt": "2023-06-27T12:03:29.887Z"
      },
      "Company": {
        "id": 2178,
        "name": "Turia",
        "logo": null,
        "pocName": "kavin",
        "pocNumber": "8431018842",
        "pocEmail": "kavin.raj@turia.in",
        "campusNexaRecommended": null,
        "createdAt": "2025-11-17T13:39:48.413Z",
        "updatedAt": "2025-11-17T13:39:48.413Z",
        "CampusNexaCompanyRefId": null,
        "CreatedById": 25244,
        "CollegeId": 4633
      }
    },
    {
      "id": 7562,
      "companyName": "Wafer Technologies",
      "minCTC": 3,
      "maxCTC": 6,
      "expirationDateTime": "2025-12-06T06:03:00.000Z",
      "description": "<h1>JOB LOCATION CAN BE BOTH REMOTE AND GOA AS PER THE CANDIDATE. 3-4.5 L.P.A FOR FRESHERS WITH SOME INTERNSHIP ( ACCOMODATION AVAILABLE) AND UPTO 6 L.P.A FOR EXPERIENCED CANDIDATE FOR FULL STACK</h1>",
      "newDescription": {
        "type": "doc",
        "content": [
          {
            "type": "heading",
            "attrs": {
              "level": 1,
              "textAlign": null
            },
            "content": [
              {
                "text": "JOB LOCATION CAN BE BOTH REMOTE AND GOA AS PER THE CANDIDATE. 3-4.5 L.P.A FOR FRESHERS WITH SOME INTERNSHIP ( ACCOMODATION AVAILABLE) AND UPTO 6 L.P.A FOR EXPERIENCED CANDIDATE FOR FULL STACK",
                "type": "text"
              }
            ]
          }
        ]
      },
      "alertMessage": null,
      "alertConfirmationMessage": null,
      "JobRoleId": 1,
      "yearsOfExperience": 0,
      "status": 4,
      "closedReasonType": 2,
      "closedReason": "rejected",
      "showCompanyToStudents": true,
      "companyPOCEmail": "hr@wafer.ee",
      "isPrivate": false,
      "offersInternship": false,
      "internshipDuration": 0,
      "internshipStipend": 0,
      "isAlumniJob": false,
      "isProCompany": false,
      "isJobPortal": false,
      "jobTags": null,
      "jobRedirectionLink": null,
      "category": null,
      "domain": null,
      "size": null,
      "bootstrappedOrFunded": null,
      "revenue": null,
      "source": null,
      "createdAt": "2025-10-28T07:11:48.888Z",
      "updatedAt": "2026-01-13T12:56:10.610Z",
      "CompanyId": 2115,
      "CollegeId": 4633,
      "JobApplicants": [
        {
          "id": 78735,
          "UserId": 57312,
          "JobOpeningId": 7562,
          "status": 9,
          "interviewDate": null,
          "ctcOffered": null,
          "yoe": null,
          "rejectionReason": null,
          "createdAt": "2025-10-28T16:27:21.160Z",
          "updatedAt": "2026-01-13T12:56:10.558Z",
          "JobApplicantStatuses": [
            {
              "id": 199010,
              "JobApplicantId": 78735,
              "status": 9,
              "date": "2026-01-13T12:56:10.556Z",
              "createdAt": "2026-01-13T12:56:10.559Z",
              "updatedAt": "2026-01-13T12:56:10.559Z"
            },
            {
              "id": 188167,
              "JobApplicantId": 78735,
              "status": 2,
              "date": "2025-10-29T10:26:40.557Z",
              "createdAt": "2025-10-29T10:26:40.335Z",
              "updatedAt": "2025-10-29T10:26:40.335Z"
            },
            {
              "id": 188045,
              "JobApplicantId": 78735,
              "status": 1,
              "date": "2025-10-28T16:27:21.163Z",
              "createdAt": "2025-10-28T16:27:21.164Z",
              "updatedAt": "2025-10-28T16:27:21.164Z"
            }
          ]
        }
      ],
      "JobLocations": [
        {
          "id": 17903,
          "name": "Goa",
          "JobOpeningId": 7562,
          "createdAt": "2025-10-28T07:11:48.895Z",
          "updatedAt": "2025-10-28T07:11:48.895Z"
        },
        {
          "id": 17904,
          "name": "Remote",
          "JobOpeningId": 7562,
          "createdAt": "2025-10-28T07:11:48.895Z",
          "updatedAt": "2025-10-28T07:11:48.895Z"
        }
      ],
      "JobRole": {
        "id": 1,
        "name": "Frontend Engineer",
        "createdAt": "2023-02-23T11:10:53.498Z",
        "updatedAt": "2023-06-27T12:03:29.887Z"
      },
      "Company": {
        "id": 2115,
        "name": "Wafer Technologies",
        "logo": null,
        "pocName": "Malaika",
        "pocNumber": "9373754299",
        "pocEmail": "hr@wafer.ee",
        "campusNexaRecommended": null,
        "createdAt": "2025-10-28T07:04:17.245Z",
        "updatedAt": "2025-10-28T07:04:17.245Z",
        "CampusNexaCompanyRefId": null,
        "CreatedById": 46492,
        "CollegeId": 4633
      }
    },
    {
      "id": 6535,
      "companyName": "Momentus Digital",
      "minCTC": 6,
      "maxCTC": 12,
      "expirationDateTime": "2025-12-06T05:31:00.000Z",
      "description": "<h2>CANDIDATES WITH 2 + YEAR OF EXPERIENCE SHOULD APPLY .CTC WILL DEPEND ON CURRENT SALARY AND INTERVIEW PERFORMANCE</h2>",
      "newDescription": {
        "type": "doc",
        "content": [
          {
            "type": "heading",
            "attrs": {
              "level": 2,
              "textAlign": null
            },
            "content": [
              {
                "text": "CANDIDATES WITH 2 + YEAR OF EXPERIENCE SHOULD APPLY .CTC WILL DEPEND ON CURRENT SALARY AND INTERVIEW PERFORMANCE",
                "type": "text"
              }
            ]
          }
        ]
      },
      "alertMessage": null,
      "alertConfirmationMessage": null,
      "JobRoleId": 1,
      "yearsOfExperience": 0,
      "status": 4,
      "closedReasonType": 3,
      "closedReason": "dnst",
      "showCompanyToStudents": true,
      "companyPOCEmail": "tarun.k@momentus.in",
      "isPrivate": false,
      "offersInternship": false,
      "internshipDuration": 0,
      "internshipStipend": 0,
      "isAlumniJob": false,
      "isProCompany": false,
      "isJobPortal": false,
      "jobTags": null,
      "jobRedirectionLink": null,
      "category": null,
      "domain": null,
      "size": null,
      "bootstrappedOrFunded": null,
      "revenue": null,
      "source": null,
      "createdAt": "2025-05-13T11:12:01.894Z",
      "updatedAt": "2026-02-16T14:51:08.429Z",
      "CompanyId": 1587,
      "CollegeId": 4633,
      "JobApplicants": [
        {
          "id": 68626,
          "UserId": 57312,
          "JobOpeningId": 6535,
          "status": 9,
          "interviewDate": null,
          "ctcOffered": null,
          "yoe": null,
          "rejectionReason": null,
          "createdAt": "2025-05-13T16:25:24.519Z",
          "updatedAt": "2025-08-11T14:38:15.015Z",
          "JobApplicantStatuses": [
            {
              "id": 176225,
              "JobApplicantId": 68626,
              "status": 9,
              "date": "2025-08-11T14:38:15.015Z",
              "createdAt": "2025-08-11T14:38:15.016Z",
              "updatedAt": "2025-08-11T14:38:15.016Z"
            },
            {
              "id": 161536,
              "JobApplicantId": 68626,
              "status": 2,
              "date": "2025-05-14T07:04:30.192Z",
              "createdAt": "2025-05-14T07:04:30.215Z",
              "updatedAt": "2025-05-14T07:04:30.215Z"
            },
            {
              "id": 161422,
              "JobApplicantId": 68626,
              "status": 1,
              "date": "2025-05-13T16:25:24.522Z",
              "createdAt": "2025-05-13T16:25:24.523Z",
              "updatedAt": "2025-05-13T16:25:24.523Z"
            }
          ]
        }
      ],
      "JobLocations": [
        {
          "id": 16549,
          "name": "Gurgaon",
          "JobOpeningId": 6535,
          "createdAt": "2025-07-10T07:28:04.513Z",
          "updatedAt": "2025-07-10T07:28:04.513Z"
        }
      ],
      "JobRole": {
        "id": 1,
        "name": "Frontend Engineer",
        "createdAt": "2023-02-23T11:10:53.498Z",
        "updatedAt": "2023-06-27T12:03:29.887Z"
      },
      "Company": {
        "id": 1587,
        "name": "Momentus Digital",
        "logo": null,
        "pocName": "Tarun",
        "pocNumber": "8800242494",
        "pocEmail": "tarun.k@momentus.in",
        "campusNexaRecommended": null,
        "createdAt": "2025-05-13T11:09:04.734Z",
        "updatedAt": "2025-05-13T11:09:04.734Z",
        "CampusNexaCompanyRefId": null,
        "CreatedById": 46492,
        "CollegeId": 4633
      }
    },
    {
      "id": 7733,
      "companyName": "Refrens Internet Pvt ltd",
      "minCTC": 10,
      "maxCTC": 12,
      "expirationDateTime": "2025-12-05T06:42:00.000Z",
      "description": "<h1>10 -12 l.p.a depending upon last ctc and performance</h1>",
      "newDescription": {
        "type": "doc",
        "content": [
          {
            "type": "heading",
            "attrs": {
              "level": 1,
              "textAlign": null
            },
            "content": [
              {
                "text": "10 -12 l.p.a depending upon last ctc and performance",
                "type": "text"
              }
            ]
          }
        ]
      },
      "alertMessage": null,
      "alertConfirmationMessage": null,
      "JobRoleId": 1,
      "yearsOfExperience": 1,
      "status": 4,
      "closedReasonType": 3,
      "closedReason": "nt st",
      "showCompanyToStudents": true,
      "companyPOCEmail": "pal@refrens.com",
      "isPrivate": false,
      "offersInternship": false,
      "internshipDuration": 0,
      "internshipStipend": 0,
      "isAlumniJob": false,
      "isProCompany": false,
      "isJobPortal": false,
      "jobTags": null,
      "jobRedirectionLink": null,
      "category": null,
      "domain": null,
      "size": null,
      "bootstrappedOrFunded": null,
      "revenue": null,
      "source": null,
      "createdAt": "2025-12-01T06:48:44.160Z",
      "updatedAt": "2026-01-06T07:55:07.590Z",
      "CompanyId": 2142,
      "CollegeId": 4633,
      "JobApplicants": [
        {
          "id": 81046,
          "UserId": 57312,
          "JobOpeningId": 7733,
          "status": 9,
          "interviewDate": null,
          "ctcOffered": null,
          "yoe": null,
          "rejectionReason": null,
          "createdAt": "2025-12-01T15:32:29.172Z",
          "updatedAt": "2026-01-06T07:55:07.571Z",
          "JobApplicantStatuses": [
            {
              "id": 197589,
              "JobApplicantId": 81046,
              "status": 9,
              "date": "2026-01-06T07:55:07.570Z",
              "createdAt": "2026-01-06T07:55:07.571Z",
              "updatedAt": "2026-01-06T07:55:07.571Z"
            },
            {
              "id": 192839,
              "JobApplicantId": 81046,
              "status": 1,
              "date": "2025-12-01T15:32:29.175Z",
              "createdAt": "2025-12-01T15:32:29.175Z",
              "updatedAt": "2025-12-01T15:32:29.175Z"
            }
          ]
        }
      ],
      "JobLocations": [
        {
          "id": 18248,
          "name": "Surat",
          "JobOpeningId": 7733,
          "createdAt": "2025-12-01T06:48:44.167Z",
          "updatedAt": "2025-12-01T06:48:44.167Z"
        }
      ],
      "JobRole": {
        "id": 1,
        "name": "Frontend Engineer",
        "createdAt": "2023-02-23T11:10:53.498Z",
        "updatedAt": "2023-06-27T12:03:29.887Z"
      },
      "Company": {
        "id": 2142,
        "name": "Refrens Internet Pvt ltd",
        "logo": "https://sharpener.blob.core.windows.net/companylogos/refrens_logo.jpeg",
        "pocName": "Pal Sanghavi",
        "pocNumber": "07003222186",
        "pocEmail": "pal@refrens.com",
        "campusNexaRecommended": null,
        "createdAt": "2025-11-06T04:57:40.445Z",
        "updatedAt": "2025-11-06T04:57:40.445Z",
        "CampusNexaCompanyRefId": null,
        "CreatedById": 46492,
        "CollegeId": 4633
      }
    },
    {
      "id": 7616,
      "companyName": "sticky cards",
      "minCTC": 7,
      "maxCTC": 10,
      "expirationDateTime": "2025-12-03T13:18:00.000Z",
      "description": "<h1><strong>Job role is full stack</strong></h1><h1><strong>Candidates with 2 years of experince required</strong></h1><h1><strong>CTC based on experience</strong></h1>",
      "newDescription": {
        "type": "doc",
        "content": [
          {
            "type": "heading",
            "attrs": {
              "level": 1,
              "textAlign": null
            },
            "content": [
              {
                "text": "Job role is full stack",
                "type": "text",
                "marks": [
                  {
                    "type": "bold"
                  }
                ]
              }
            ]
          },
          {
            "type": "heading",
            "attrs": {
              "level": 1,
              "textAlign": null
            },
            "content": [
              {
                "text": "Candidates with 2 years of experince required",
                "type": "text",
                "marks": [
                  {
                    "type": "bold"
                  }
                ]
              }
            ]
          },
          {
            "type": "heading",
            "attrs": {
              "level": 1,
              "textAlign": null
            },
            "content": [
              {
                "text": "CTC based on experience",
                "type": "text",
                "marks": [
                  {
                    "type": "bold"
                  }
                ]
              }
            ]
          }
        ]
      },
      "alertMessage": null,
      "alertConfirmationMessage": null,
      "JobRoleId": 1,
      "yearsOfExperience": 1,
      "status": 4,
      "closedReasonType": 3,
      "closedReason": "did not shortlist",
      "showCompanyToStudents": true,
      "companyPOCEmail": "deepa@stickycards.co",
      "isPrivate": false,
      "offersInternship": false,
      "internshipDuration": 0,
      "internshipStipend": 0,
      "isAlumniJob": false,
      "isProCompany": false,
      "isJobPortal": false,
      "jobTags": null,
      "jobRedirectionLink": null,
      "category": null,
      "domain": null,
      "size": null,
      "bootstrappedOrFunded": null,
      "revenue": null,
      "source": null,
      "createdAt": "2025-11-07T08:26:58.126Z",
      "updatedAt": "2026-01-05T09:09:04.974Z",
      "CompanyId": 2015,
      "CollegeId": 4633,
      "JobApplicants": [
        {
          "id": 81047,
          "UserId": 57312,
          "JobOpeningId": 7616,
          "status": 9,
          "interviewDate": null,
          "ctcOffered": null,
          "yoe": null,
          "rejectionReason": null,
          "createdAt": "2025-12-01T15:32:43.581Z",
          "updatedAt": "2026-01-05T09:09:04.960Z",
          "JobApplicantStatuses": [
            {
              "id": 197242,
              "JobApplicantId": 81047,
              "status": 9,
              "date": "2026-01-05T09:09:04.959Z",
              "createdAt": "2026-01-05T09:09:04.960Z",
              "updatedAt": "2026-01-05T09:09:04.960Z"
            },
            {
              "id": 192840,
              "JobApplicantId": 81047,
              "status": 1,
              "date": "2025-12-01T15:32:43.583Z",
              "createdAt": "2025-12-01T15:32:43.583Z",
              "updatedAt": "2025-12-01T15:32:43.583Z"
            }
          ]
        }
      ],
      "JobLocations": [
        {
          "id": 18264,
          "name": "Remote",
          "JobOpeningId": 7616,
          "createdAt": "2025-12-01T13:18:26.298Z",
          "updatedAt": "2025-12-01T13:18:26.298Z"
        }
      ],
      "JobRole": {
        "id": 1,
        "name": "Frontend Engineer",
        "createdAt": "2023-02-23T11:10:53.498Z",
        "updatedAt": "2023-06-27T12:03:29.887Z"
      },
      "Company": {
        "id": 2015,
        "name": "sticky cards",
        "logo": null,
        "pocName": "deepa",
        "pocNumber": "90094 19263",
        "pocEmail": "deepa@stickycards.co",
        "campusNexaRecommended": null,
        "createdAt": "2025-09-12T10:24:47.327Z",
        "updatedAt": "2025-11-07T08:24:20.367Z",
        "CampusNexaCompanyRefId": null,
        "CreatedById": 54536,
        "CollegeId": 4633
      }
    },
    {
      "id": 7710,
      "companyName": "Toystack",
      "minCTC": 6,
      "maxCTC": 10,
      "expirationDateTime": "2025-11-29T10:17:00.000Z",
      "description": "<p class=\"\">Company is looking for atleast 1 year experienced full stack developers</p>",
      "newDescription": {
        "type": "doc",
        "content": [
          {
            "type": "paragraph",
            "attrs": {
              "textAlign": null
            },
            "content": [
              {
                "text": "Company is looking for atleast 1 year experienced full stack developers",
                "type": "text"
              }
            ]
          }
        ]
      },
      "alertMessage": null,
      "alertConfirmationMessage": null,
      "JobRoleId": 1,
      "yearsOfExperience": 1,
      "status": 4,
      "closedReasonType": 3,
      "closedReason": "dnst",
      "showCompanyToStudents": true,
      "companyPOCEmail": " sai@toystack.ai",
      "isPrivate": false,
      "offersInternship": false,
      "internshipDuration": 0,
      "internshipStipend": 0,
      "isAlumniJob": false,
      "isProCompany": false,
      "isJobPortal": false,
      "jobTags": null,
      "jobRedirectionLink": null,
      "category": "Product",
      "domain": "Software Services",
      "size": "Startup (<100)",
      "bootstrappedOrFunded": "Funded",
      "revenue": "$5 million",
      "source": "LinkedIn",
      "createdAt": "2025-11-24T10:20:28.184Z",
      "updatedAt": "2026-01-13T13:03:02.293Z",
      "CompanyId": 2191,
      "CollegeId": 4633,
      "JobApplicants": [
        {
          "id": 80701,
          "UserId": 57312,
          "JobOpeningId": 7710,
          "status": 9,
          "interviewDate": null,
          "ctcOffered": null,
          "yoe": null,
          "rejectionReason": null,
          "createdAt": "2025-11-24T11:06:07.173Z",
          "updatedAt": "2026-01-13T13:03:02.281Z",
          "JobApplicantStatuses": [
            {
              "id": 199201,
              "JobApplicantId": 80701,
              "status": 9,
              "date": "2026-01-13T13:03:02.281Z",
              "createdAt": "2026-01-13T13:03:02.281Z",
              "updatedAt": "2026-01-13T13:03:02.281Z"
            },
            {
              "id": 192085,
              "JobApplicantId": 80701,
              "status": 1,
              "date": "2025-11-24T11:06:07.175Z",
              "createdAt": "2025-11-24T11:06:07.175Z",
              "updatedAt": "2025-11-24T11:06:07.175Z"
            }
          ]
        }
      ],
      "JobLocations": [
        {
          "id": 18185,
          "name": "Bangalore",
          "JobOpeningId": 7710,
          "createdAt": "2025-11-24T10:20:28.190Z",
          "updatedAt": "2025-11-24T10:20:28.190Z"
        }
      ],
      "JobRole": {
        "id": 1,
        "name": "Frontend Engineer",
        "createdAt": "2023-02-23T11:10:53.498Z",
        "updatedAt": "2023-06-27T12:03:29.887Z"
      },
      "Company": {
        "id": 2191,
        "name": "Toystack",
        "logo": "https://sharpener.blob.core.windows.net/companylogos/toystack_logo (1).jfif",
        "pocName": "Sai Charan",
        "pocNumber": "8106402145",
        "pocEmail": " sai@toystack.ai",
        "campusNexaRecommended": null,
        "createdAt": "2025-11-24T10:14:48.125Z",
        "updatedAt": "2025-11-24T10:14:48.125Z",
        "CampusNexaCompanyRefId": null,
        "CreatedById": 46492,
        "CollegeId": 4633
      }
    },
    {
      "id": 7712,
      "companyName": "Appstorys",
      "minCTC": 8,
      "maxCTC": 12,
      "expirationDateTime": "2025-11-28T10:23:00.000Z",
      "description": null,
      "newDescription": null,
      "alertMessage": null,
      "alertConfirmationMessage": null,
      "JobRoleId": 1,
      "yearsOfExperience": 1,
      "status": 4,
      "closedReasonType": 3,
      "closedReason": "dnst",
      "showCompanyToStudents": true,
      "companyPOCEmail": "saarthak@appstorys.com",
      "isPrivate": false,
      "offersInternship": false,
      "internshipDuration": 0,
      "internshipStipend": 0,
      "isAlumniJob": false,
      "isProCompany": false,
      "isJobPortal": false,
      "jobTags": null,
      "jobRedirectionLink": null,
      "category": "Product",
      "domain": "Software Services",
      "size": "Startup (<100)",
      "bootstrappedOrFunded": "Funded",
      "revenue": null,
      "source": "LinkedIn",
      "createdAt": "2025-11-24T10:58:08.890Z",
      "updatedAt": "2026-01-13T13:03:48.922Z",
      "CompanyId": 2193,
      "CollegeId": 4633,
      "JobApplicants": [
        {
          "id": 80702,
          "UserId": 57312,
          "JobOpeningId": 7712,
          "status": 9,
          "interviewDate": null,
          "ctcOffered": null,
          "yoe": null,
          "rejectionReason": null,
          "createdAt": "2025-11-24T11:06:10.259Z",
          "updatedAt": "2026-01-13T13:03:48.906Z",
          "JobApplicantStatuses": [
            {
              "id": 199220,
              "JobApplicantId": 80702,
              "status": 9,
              "date": "2026-01-13T13:03:48.906Z",
              "createdAt": "2026-01-13T13:03:48.907Z",
              "updatedAt": "2026-01-13T13:03:48.907Z"
            },
            {
              "id": 192086,
              "JobApplicantId": 80702,
              "status": 1,
              "date": "2025-11-24T11:06:10.261Z",
              "createdAt": "2025-11-24T11:06:10.261Z",
              "updatedAt": "2025-11-24T11:06:10.261Z"
            }
          ]
        }
      ],
      "JobLocations": [
        {
          "id": 18186,
          "name": "Noida",
          "JobOpeningId": 7712,
          "createdAt": "2025-11-24T10:58:08.895Z",
          "updatedAt": "2025-11-24T10:58:08.895Z"
        }
      ],
      "JobRole": {
        "id": 1,
        "name": "Frontend Engineer",
        "createdAt": "2023-02-23T11:10:53.498Z",
        "updatedAt": "2023-06-27T12:03:29.887Z"
      },
      "Company": {
        "id": 2193,
        "name": "Appstorys",
        "logo": "https://sharpener.blob.core.windows.net/companylogos/appstorys_logo.jfif",
        "pocName": "Saarthak",
        "pocNumber": "70458 75226",
        "pocEmail": "saarthak@appstorys.com",
        "campusNexaRecommended": null,
        "createdAt": "2025-11-24T10:52:55.503Z",
        "updatedAt": "2025-11-24T10:52:55.503Z",
        "CampusNexaCompanyRefId": null,
        "CreatedById": 46492,
        "CollegeId": 4633
      }
    },
    {
      "id": 904,
      "companyName": "Arramton",
      "minCTC": 4.5,
      "maxCTC": 6,
      "expirationDateTime": "2025-11-27T13:12:00.000Z",
      "description": "<h3><strong>Looking for a Full stack Developer</strong></h3><h3><strong>wfo</strong></h3><h3><strong>urgent hiring</strong></h3><h3><strong>virtual  interview.</strong></h3>",
      "newDescription": {
        "type": "doc",
        "content": [
          {
            "type": "heading",
            "attrs": {
              "level": 3,
              "textAlign": null
            },
            "content": [
              {
                "text": "Looking for a Full stack Developer",
                "type": "text",
                "marks": [
                  {
                    "type": "bold"
                  }
                ]
              }
            ]
          },
          {
            "type": "heading",
            "attrs": {
              "level": 3,
              "textAlign": null
            },
            "content": [
              {
                "text": "wfo",
                "type": "text",
                "marks": [
                  {
                    "type": "bold"
                  }
                ]
              }
            ]
          },
          {
            "type": "heading",
            "attrs": {
              "level": 3,
              "textAlign": null
            },
            "content": [
              {
                "text": "urgent hiring",
                "type": "text",
                "marks": [
                  {
                    "type": "bold"
                  }
                ]
              }
            ]
          },
          {
            "type": "heading",
            "attrs": {
              "level": 3,
              "textAlign": null
            },
            "content": [
              {
                "text": "virtual  interview.",
                "type": "text",
                "marks": [
                  {
                    "type": "bold"
                  }
                ]
              }
            ]
          }
        ]
      },
      "alertMessage": null,
      "alertConfirmationMessage": null,
      "JobRoleId": 1,
      "yearsOfExperience": 0,
      "status": 4,
      "closedReasonType": 3,
      "closedReason": ".",
      "showCompanyToStudents": true,
      "companyPOCEmail": "simardeep_57@arramton.com",
      "isPrivate": false,
      "offersInternship": false,
      "internshipDuration": 3,
      "internshipStipend": 15,
      "isAlumniJob": false,
      "isProCompany": false,
      "isJobPortal": false,
      "jobTags": null,
      "jobRedirectionLink": null,
      "category": null,
      "domain": null,
      "size": null,
      "bootstrappedOrFunded": null,
      "revenue": null,
      "source": null,
      "createdAt": "2023-05-24T13:54:07.728Z",
      "updatedAt": "2026-01-06T11:51:57.759Z",
      "CompanyId": null,
      "CollegeId": 4633,
      "JobApplicants": [
        {
          "id": 80534,
          "UserId": 57312,
          "JobOpeningId": 904,
          "status": 9,
          "interviewDate": null,
          "ctcOffered": null,
          "yoe": null,
          "rejectionReason": null,
          "createdAt": "2025-11-21T03:33:39.518Z",
          "updatedAt": "2026-01-06T11:51:57.722Z",
          "JobApplicantStatuses": [
            {
              "id": 197751,
              "JobApplicantId": 80534,
              "status": 9,
              "date": "2026-01-06T11:51:57.721Z",
              "createdAt": "2026-01-06T11:51:57.723Z",
              "updatedAt": "2026-01-06T11:51:57.723Z"
            },
            {
              "id": 191725,
              "JobApplicantId": 80534,
              "status": 1,
              "date": "2025-11-21T03:33:39.522Z",
              "createdAt": "2025-11-21T03:33:39.522Z",
              "updatedAt": "2025-11-21T03:33:39.522Z"
            }
          ]
        }
      ],
      "JobLocations": [
        {
          "id": 18190,
          "name": "Delhi",
          "JobOpeningId": 904,
          "createdAt": "2025-11-24T13:12:17.718Z",
          "updatedAt": "2025-11-24T13:12:17.718Z"
        }
      ],
      "JobRole": {
        "id": 1,
        "name": "Frontend Engineer",
        "createdAt": "2023-02-23T11:10:53.498Z",
        "updatedAt": "2023-06-27T12:03:29.887Z"
      },
      "Company": null
    },
    {
      "id": 7713,
      "companyName": "Fraxxra Tech",
      "minCTC": 3.6,
      "maxCTC": 5.5,
      "expirationDateTime": "2025-11-26T12:00:00.000Z",
      "description": "<ul><li><p class=\"\"> or planning to relocate before starting work (Required)</p><h2><strong>Full job description</strong></h2><p class=\"\"><strong>Key Responsibilities</strong></p><p class=\"\"></p><h1><strong>Full-Stack Development:</strong> Design, develop, and maintain dynamic, data-driven web applications using the MERN stack.</h1><p class=\"\"><strong>Front-End Development (React):</strong></p><ul><li><p class=\"\">Implement user-facing features using <strong>React.js</strong> and its core principles (components, lifecycle methods, hooks).</p></li><li><p class=\"\">Develop reusable, high-performance UI components and front-end libraries.</p></li><li><p class=\"\">Ensure the application is fully <strong>responsive</strong> and optimized for cross-browser compatibility.</p></li></ul><p class=\"\"><strong>Back-End Development (Node.js &amp; Express.js):</strong></p><ul><li><p class=\"\">Develop and manage scalable <strong>server-side logic</strong> using <strong>Node.js</strong> and the <strong>Express.js</strong> framework.</p></li><li><p class=\"\">Design and implement robust <strong>RESTful APIs</strong> for data exchange between the front-end and back-end.</p></li></ul><p class=\"\"><strong>Database Management (MongoDB):</strong></p><ul><li><p class=\"\">Design and optimize <strong>MongoDB</strong> schemas and models for efficient data storage and retrieval.</p></li><li><p class=\"\">Implement CRUD (Create, Read, Update, Delete) operations and optimize database queries.</p></li></ul><p class=\"\"><strong>Code Quality &amp; Collaboration:</strong></p><ul><li><p class=\"\">Write clean, maintainable, and efficient code following best practices and design patterns.</p></li><li><p class=\"\">Perform <strong>code reviews</strong> and provide constructive feedback to team members.</p></li><li><p class=\"\">Collaborate with product managers, designers, and other developers to translate requirements into technical specifications.</p></li></ul><p class=\"\"><strong>Deployment &amp; Performance:</strong></p><ul><li><p class=\"\">Manage application state using libraries like <strong>Redux</strong> or Context API (for complex applications).</p></li><li><p class=\"\">Implement and manage version control using <strong>Git/GitHub</strong>.</p></li><li><p class=\"\">Troubleshoot, debug, and upgrade software to ensure application performance, quality, and responsiveness.</p></li></ul><p class=\"\">Job Type: Full-time</p><p class=\"\">Pay: ₹30,000.00 - ₹45,000.00 per month</p><p class=\"\">Ability to commute/relocate:</p><ul><li><p class=\"\">Noida, Uttar Pradesh: Reliably commute</p></li></ul></li></ul>",
      "newDescription": {
        "type": "doc",
        "content": [
          {
            "type": "bulletList",
            "content": [
              {
                "type": "listItem",
                "content": [
                  {
                    "type": "paragraph",
                    "attrs": {
                      "textAlign": null
                    },
                    "content": [
                      {
                        "text": " or planning to relocate before starting work (Required)",
                        "type": "text"
                      }
                    ]
                  },
                  {
                    "type": "heading",
                    "attrs": {
                      "level": 2,
                      "textAlign": null
                    },
                    "content": [
                      {
                        "text": "Full job description",
                        "type": "text",
                        "marks": [
                          {
                            "type": "bold"
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "type": "paragraph",
                    "attrs": {
                      "textAlign": null
                    },
                    "content": [
                      {
                        "text": "Key Responsibilities",
                        "type": "text",
                        "marks": [
                          {
                            "type": "bold"
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "type": "paragraph",
                    "attrs": {
                      "textAlign": null
                    }
                  },
                  {
                    "type": "heading",
                    "attrs": {
                      "level": 1,
                      "textAlign": null
                    },
                    "content": [
                      {
                        "text": "Full-Stack Development:",
                        "type": "text",
                        "marks": [
                          {
                            "type": "bold"
                          }
                        ]
                      },
                      {
                        "text": " Design, develop, and maintain dynamic, data-driven web applications using the MERN stack.",
                        "type": "text"
                      }
                    ]
                  },
                  {
                    "type": "paragraph",
                    "attrs": {
                      "textAlign": null
                    },
                    "content": [
                      {
                        "text": "Front-End Development (React):",
                        "type": "text",
                        "marks": [
                          {
                            "type": "bold"
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "type": "bulletList",
                    "content": [
                      {
                        "type": "listItem",
                        "content": [
                          {
                            "type": "paragraph",
                            "attrs": {
                              "textAlign": null
                            },
                            "content": [
                              {
                                "text": "Implement user-facing features using ",
                                "type": "text"
                              },
                              {
                                "text": "React.js",
                                "type": "text",
                                "marks": [
                                  {
                                    "type": "bold"
                                  }
                                ]
                              },
                              {
                                "text": " and its core principles (components, lifecycle methods, hooks).",
                                "type": "text"
                              }
                            ]
                          }
                        ]
                      },
                      {
                        "type": "listItem",
                        "content": [
                          {
                            "type": "paragraph",
                            "attrs": {
                              "textAlign": null
                            },
                            "content": [
                              {
                                "text": "Develop reusable, high-performance UI components and front-end libraries.",
                                "type": "text"
                              }
                            ]
                          }
                        ]
                      },
                      {
                        "type": "listItem",
                        "content": [
                          {
                            "type": "paragraph",
                            "attrs": {
                              "textAlign": null
                            },
                            "content": [
                              {
                                "text": "Ensure the application is fully ",
                                "type": "text"
                              },
                              {
                                "text": "responsive",
                                "type": "text",
                                "marks": [
                                  {
                                    "type": "bold"
                                  }
                                ]
                              },
                              {
                                "text": " and optimized for cross-browser compatibility.",
                                "type": "text"
                              }
                            ]
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "type": "paragraph",
                    "attrs": {
                      "textAlign": null
                    },
                    "content": [
                      {
                        "text": "Back-End Development (Node.js & Express.js):",
                        "type": "text",
                        "marks": [
                          {
                            "type": "bold"
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "type": "bulletList",
                    "content": [
                      {
                        "type": "listItem",
                        "content": [
                          {
                            "type": "paragraph",
                            "attrs": {
                              "textAlign": null
                            },
                            "content": [
                              {
                                "text": "Develop and manage scalable ",
                                "type": "text"
                              },
                              {
                                "text": "server-side logic",
                                "type": "text",
                                "marks": [
                                  {
                                    "type": "bold"
                                  }
                                ]
                              },
                              {
                                "text": " using ",
                                "type": "text"
                              },
                              {
                                "text": "Node.js",
                                "type": "text",
                                "marks": [
                                  {
                                    "type": "bold"
                                  }
                                ]
                              },
                              {
                                "text": " and the ",
                                "type": "text"
                              },
                              {
                                "text": "Express.js",
                                "type": "text",
                                "marks": [
                                  {
                                    "type": "bold"
                                  }
                                ]
                              },
                              {
                                "text": " framework.",
                                "type": "text"
                              }
                            ]
                          }
                        ]
                      },
                      {
                        "type": "listItem",
                        "content": [
                          {
                            "type": "paragraph",
                            "attrs": {
                              "textAlign": null
                            },
                            "content": [
                              {
                                "text": "Design and implement robust ",
                                "type": "text"
                              },
                              {
                                "text": "RESTful APIs",
                                "type": "text",
                                "marks": [
                                  {
                                    "type": "bold"
                                  }
                                ]
                              },
                              {
                                "text": " for data exchange between the front-end and back-end.",
                                "type": "text"
                              }
                            ]
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "type": "paragraph",
                    "attrs": {
                      "textAlign": null
                    },
                    "content": [
                      {
                        "text": "Database Management (MongoDB):",
                        "type": "text",
                        "marks": [
                          {
                            "type": "bold"
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "type": "bulletList",
                    "content": [
                      {
                        "type": "listItem",
                        "content": [
                          {
                            "type": "paragraph",
                            "attrs": {
                              "textAlign": null
                            },
                            "content": [
                              {
                                "text": "Design and optimize ",
                                "type": "text"
                              },
                              {
                                "text": "MongoDB",
                                "type": "text",
                                "marks": [
                                  {
                                    "type": "bold"
                                  }
                                ]
                              },
                              {
                                "text": " schemas and models for efficient data storage and retrieval.",
                                "type": "text"
                              }
                            ]
                          }
                        ]
                      },
                      {
                        "type": "listItem",
                        "content": [
                          {
                            "type": "paragraph",
                            "attrs": {
                              "textAlign": null
                            },
                            "content": [
                              {
                                "text": "Implement CRUD (Create, Read, Update, Delete) operations and optimize database queries.",
                                "type": "text"
                              }
                            ]
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "type": "paragraph",
                    "attrs": {
                      "textAlign": null
                    },
                    "content": [
                      {
                        "text": "Code Quality & Collaboration:",
                        "type": "text",
                        "marks": [
                          {
                            "type": "bold"
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "type": "bulletList",
                    "content": [
                      {
                        "type": "listItem",
                        "content": [
                          {
                            "type": "paragraph",
                            "attrs": {
                              "textAlign": null
                            },
                            "content": [
                              {
                                "text": "Write clean, maintainable, and efficient code following best practices and design patterns.",
                                "type": "text"
                              }
                            ]
                          }
                        ]
                      },
                      {
                        "type": "listItem",
                        "content": [
                          {
                            "type": "paragraph",
                            "attrs": {
                              "textAlign": null
                            },
                            "content": [
                              {
                                "text": "Perform ",
                                "type": "text"
                              },
                              {
                                "text": "code reviews",
                                "type": "text",
                                "marks": [
                                  {
                                    "type": "bold"
                                  }
                                ]
                              },
                              {
                                "text": " and provide constructive feedback to team members.",
                                "type": "text"
                              }
                            ]
                          }
                        ]
                      },
                      {
                        "type": "listItem",
                        "content": [
                          {
                            "type": "paragraph",
                            "attrs": {
                              "textAlign": null
                            },
                            "content": [
                              {
                                "text": "Collaborate with product managers, designers, and other developers to translate requirements into technical specifications.",
                                "type": "text"
                              }
                            ]
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "type": "paragraph",
                    "attrs": {
                      "textAlign": null
                    },
                    "content": [
                      {
                        "text": "Deployment & Performance:",
                        "type": "text",
                        "marks": [
                          {
                            "type": "bold"
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "type": "bulletList",
                    "content": [
                      {
                        "type": "listItem",
                        "content": [
                          {
                            "type": "paragraph",
                            "attrs": {
                              "textAlign": null
                            },
                            "content": [
                              {
                                "text": "Manage application state using libraries like ",
                                "type": "text"
                              },
                              {
                                "text": "Redux",
                                "type": "text",
                                "marks": [
                                  {
                                    "type": "bold"
                                  }
                                ]
                              },
                              {
                                "text": " or Context API (for complex applications).",
                                "type": "text"
                              }
                            ]
                          }
                        ]
                      },
                      {
                        "type": "listItem",
                        "content": [
                          {
                            "type": "paragraph",
                            "attrs": {
                              "textAlign": null
                            },
                            "content": [
                              {
                                "text": "Implement and manage version control using ",
                                "type": "text"
                              },
                              {
                                "text": "Git/GitHub",
                                "type": "text",
                                "marks": [
                                  {
                                    "type": "bold"
                                  }
                                ]
                              },
                              {
                                "text": ".",
                                "type": "text"
                              }
                            ]
                          }
                        ]
                      },
                      {
                        "type": "listItem",
                        "content": [
                          {
                            "type": "paragraph",
                            "attrs": {
                              "textAlign": null
                            },
                            "content": [
                              {
                                "text": "Troubleshoot, debug, and upgrade software to ensure application performance, quality, and responsiveness.",
                                "type": "text"
                              }
                            ]
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "type": "paragraph",
                    "attrs": {
                      "textAlign": null
                    },
                    "content": [
                      {
                        "text": "Job Type: Full-time",
                        "type": "text"
                      }
                    ]
                  },
                  {
                    "type": "paragraph",
                    "attrs": {
                      "textAlign": null
                    },
                    "content": [
                      {
                        "text": "Pay: ₹30,000.00 - ₹45,000.00 per month",
                        "type": "text"
                      }
                    ]
                  },
                  {
                    "type": "paragraph",
                    "attrs": {
                      "textAlign": null
                    },
                    "content": [
                      {
                        "text": "Ability to commute/relocate:",
                        "type": "text"
                      }
                    ]
                  },
                  {
                    "type": "bulletList",
                    "content": [
                      {
                        "type": "listItem",
                        "content": [
                          {
                            "type": "paragraph",
                            "attrs": {
                              "textAlign": null
                            },
                            "content": [
                              {
                                "text": "Noida, Uttar Pradesh: Reliably commute",
                                "type": "text"
                              }
                            ]
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      },
      "alertMessage": null,
      "alertConfirmationMessage": null,
      "JobRoleId": 1,
      "yearsOfExperience": 1,
      "status": 4,
      "closedReasonType": 3,
      "closedReason": ",",
      "showCompanyToStudents": true,
      "companyPOCEmail": "soujanya@fraxxratech.com",
      "isPrivate": false,
      "offersInternship": false,
      "internshipDuration": 0,
      "internshipStipend": 0,
      "isAlumniJob": false,
      "isProCompany": false,
      "isJobPortal": false,
      "jobTags": null,
      "jobRedirectionLink": null,
      "category": "Product",
      "domain": null,
      "size": null,
      "bootstrappedOrFunded": null,
      "revenue": null,
      "source": null,
      "createdAt": "2025-11-24T11:58:46.006Z",
      "updatedAt": "2026-01-05T07:09:13.478Z",
      "CompanyId": 2194,
      "CollegeId": 4633,
      "JobApplicants": [
        {
          "id": 80725,
          "UserId": 57312,
          "JobOpeningId": 7713,
          "status": 9,
          "interviewDate": null,
          "ctcOffered": null,
          "yoe": null,
          "rejectionReason": null,
          "createdAt": "2025-11-24T14:58:59.402Z",
          "updatedAt": "2025-12-04T12:56:27.433Z",
          "JobApplicantStatuses": [
            {
              "id": 194167,
              "JobApplicantId": 80725,
              "status": 9,
              "date": "2025-12-04T12:56:23.000Z",
              "createdAt": "2025-12-04T12:56:27.432Z",
              "updatedAt": "2025-12-04T12:56:27.432Z"
            },
            {
              "id": 192753,
              "JobApplicantId": 80725,
              "status": 10,
              "date": "2025-12-01T10:47:23.000Z",
              "createdAt": "2025-12-01T10:47:24.751Z",
              "updatedAt": "2025-12-01T10:47:24.751Z"
            },
            {
              "id": 192215,
              "JobApplicantId": 80725,
              "status": 2,
              "date": "2025-11-25T06:56:19.211Z",
              "createdAt": "2025-11-25T06:56:20.368Z",
              "updatedAt": "2025-11-25T06:56:20.368Z"
            },
            {
              "id": 192138,
              "JobApplicantId": 80725,
              "status": 1,
              "date": "2025-11-24T14:58:59.405Z",
              "createdAt": "2025-11-24T14:58:59.405Z",
              "updatedAt": "2025-11-24T14:58:59.405Z"
            }
          ]
        }
      ],
      "JobLocations": [
        {
          "id": 18188,
          "name": "Noida",
          "JobOpeningId": 7713,
          "createdAt": "2025-11-24T12:00:46.578Z",
          "updatedAt": "2025-11-24T12:00:46.578Z"
        }
      ],
      "JobRole": {
        "id": 1,
        "name": "Frontend Engineer",
        "createdAt": "2023-02-23T11:10:53.498Z",
        "updatedAt": "2023-06-27T12:03:29.887Z"
      },
      "Company": {
        "id": 2194,
        "name": "Fraxxra Tech",
        "logo": null,
        "pocName": "Soujania",
        "pocNumber": "8309451175",
        "pocEmail": null,
        "campusNexaRecommended": null,
        "createdAt": "2025-11-24T11:54:55.249Z",
        "updatedAt": "2025-11-24T11:54:55.249Z",
        "CampusNexaCompanyRefId": null,
        "CreatedById": 31491,
        "CollegeId": 4633
      }
    },
    {
      "id": 7709,
      "companyName": "Toystack",
      "minCTC": 6,
      "maxCTC": 10,
      "expirationDateTime": "2025-11-25T04:30:00.000Z",
      "description": "<h2>Company is looking for atleast 1 year experienced full stack developers</h2>",
      "newDescription": {
        "type": "doc",
        "content": [
          {
            "type": "heading",
            "attrs": {
              "level": 2,
              "textAlign": null
            },
            "content": [
              {
                "text": "Company is looking for atleast 1 year experienced full stack developers",
                "type": "text"
              }
            ]
          }
        ]
      },
      "alertMessage": null,
      "alertConfirmationMessage": null,
      "JobRoleId": 2,
      "yearsOfExperience": 1,
      "status": 4,
      "closedReasonType": 3,
      "closedReason": "dnst",
      "showCompanyToStudents": true,
      "companyPOCEmail": " sai@toystack.ai",
      "isPrivate": false,
      "offersInternship": false,
      "internshipDuration": 0,
      "internshipStipend": 0,
      "isAlumniJob": false,
      "isProCompany": false,
      "isJobPortal": false,
      "jobTags": null,
      "jobRedirectionLink": null,
      "category": "Product",
      "domain": "Software Services",
      "size": "Startup (<100)",
      "bootstrappedOrFunded": "Funded",
      "revenue": "$5 million",
      "source": "LinkedIn",
      "createdAt": "2025-11-24T10:19:17.520Z",
      "updatedAt": "2026-01-13T13:03:23.136Z",
      "CompanyId": 2191,
      "CollegeId": 4633,
      "JobApplicants": [
        {
          "id": 80703,
          "UserId": 57312,
          "JobOpeningId": 7709,
          "status": 9,
          "interviewDate": null,
          "ctcOffered": null,
          "yoe": null,
          "rejectionReason": null,
          "createdAt": "2025-11-24T11:07:01.666Z",
          "updatedAt": "2026-01-13T13:03:23.126Z",
          "JobApplicantStatuses": [
            {
              "id": 199208,
              "JobApplicantId": 80703,
              "status": 9,
              "date": "2026-01-13T13:03:23.126Z",
              "createdAt": "2026-01-13T13:03:23.126Z",
              "updatedAt": "2026-01-13T13:03:23.126Z"
            },
            {
              "id": 192087,
              "JobApplicantId": 80703,
              "status": 1,
              "date": "2025-11-24T11:07:01.670Z",
              "createdAt": "2025-11-24T11:07:01.670Z",
              "updatedAt": "2025-11-24T11:07:01.670Z"
            }
          ]
        }
      ],
      "JobLocations": [
        {
          "id": 18184,
          "name": "Bangalore",
          "JobOpeningId": 7709,
          "createdAt": "2025-11-24T10:19:17.528Z",
          "updatedAt": "2025-11-24T10:19:17.528Z"
        }
      ],
      "JobRole": {
        "id": 2,
        "name": "Backend Engineer",
        "createdAt": "2023-02-28T09:10:58.719Z",
        "updatedAt": "2023-03-01T12:15:43.646Z"
      },
      "Company": {
        "id": 2191,
        "name": "Toystack",
        "logo": "https://sharpener.blob.core.windows.net/companylogos/toystack_logo (1).jfif",
        "pocName": "Sai Charan",
        "pocNumber": "8106402145",
        "pocEmail": " sai@toystack.ai",
        "campusNexaRecommended": null,
        "createdAt": "2025-11-24T10:14:48.125Z",
        "updatedAt": "2025-11-24T10:14:48.125Z",
        "CampusNexaCompanyRefId": null,
        "CreatedById": 46492,
        "CollegeId": 4633
      }
    },
    {
      "id": 7702,
      "companyName": "HCLTech",
      "minCTC": 5,
      "maxCTC": 7,
      "expirationDateTime": "2025-11-24T08:34:00.000Z",
      "description": "<p class=\"\"><strong>Min Year of experience is 1 year</strong></p><p class=\"\"><strong>Full stack openings</strong></p><p class=\"\"><strong>wfo</strong></p><p class=\"\"><strong>virtual interview</strong></p><p class=\"\"></p>",
      "newDescription": {
        "type": "doc",
        "content": [
          {
            "type": "paragraph",
            "attrs": {
              "textAlign": null
            },
            "content": [
              {
                "text": "Min Year of experience is 1 year",
                "type": "text",
                "marks": [
                  {
                    "type": "bold"
                  }
                ]
              }
            ]
          },
          {
            "type": "paragraph",
            "attrs": {
              "textAlign": null
            },
            "content": [
              {
                "text": "Full stack openings",
                "type": "text",
                "marks": [
                  {
                    "type": "bold"
                  }
                ]
              }
            ]
          },
          {
            "type": "paragraph",
            "attrs": {
              "textAlign": null
            },
            "content": [
              {
                "text": "wfo",
                "type": "text",
                "marks": [
                  {
                    "type": "bold"
                  }
                ]
              }
            ]
          },
          {
            "type": "paragraph",
            "attrs": {
              "textAlign": null
            },
            "content": [
              {
                "text": "virtual interview",
                "type": "text",
                "marks": [
                  {
                    "type": "bold"
                  }
                ]
              }
            ]
          },
          {
            "type": "paragraph",
            "attrs": {
              "textAlign": null
            }
          }
        ]
      },
      "alertMessage": null,
      "alertConfirmationMessage": null,
      "JobRoleId": 1,
      "yearsOfExperience": 1,
      "status": 4,
      "closedReasonType": 3,
      "closedReason": ".",
      "showCompanyToStudents": true,
      "companyPOCEmail": "omb21698@hcl.com",
      "isPrivate": false,
      "offersInternship": false,
      "internshipDuration": 0,
      "internshipStipend": 0,
      "isAlumniJob": false,
      "isProCompany": false,
      "isJobPortal": false,
      "jobTags": null,
      "jobRedirectionLink": null,
      "category": null,
      "domain": null,
      "size": "Enterprise (500+)",
      "bootstrappedOrFunded": null,
      "revenue": null,
      "source": null,
      "createdAt": "2025-11-20T08:34:45.665Z",
      "updatedAt": "2025-12-01T11:16:39.104Z",
      "CompanyId": 2187,
      "CollegeId": 4633,
      "JobApplicants": [
        {
          "id": 80536,
          "UserId": 57312,
          "JobOpeningId": 7702,
          "status": 9,
          "interviewDate": null,
          "ctcOffered": null,
          "yoe": null,
          "rejectionReason": null,
          "createdAt": "2025-11-21T03:34:07.977Z",
          "updatedAt": "2025-12-01T11:16:39.088Z",
          "JobApplicantStatuses": [
            {
              "id": 192780,
              "JobApplicantId": 80536,
              "status": 9,
              "date": "2025-12-01T11:16:39.088Z",
              "createdAt": "2025-12-01T11:16:39.089Z",
              "updatedAt": "2025-12-01T11:16:39.089Z"
            },
            {
              "id": 191761,
              "JobApplicantId": 80536,
              "status": 2,
              "date": "2025-11-21T06:49:19.874Z",
              "createdAt": "2025-11-21T06:49:20.040Z",
              "updatedAt": "2025-11-21T06:49:20.040Z"
            },
            {
              "id": 191727,
              "JobApplicantId": 80536,
              "status": 1,
              "date": "2025-11-21T03:34:07.979Z",
              "createdAt": "2025-11-21T03:34:07.979Z",
              "updatedAt": "2025-11-21T03:34:07.979Z"
            }
          ]
        }
      ],
      "JobLocations": [
        {
          "id": 18174,
          "name": "Noida",
          "JobOpeningId": 7702,
          "createdAt": "2025-11-20T08:34:45.672Z",
          "updatedAt": "2025-11-20T08:34:45.672Z"
        }
      ],
      "JobRole": {
        "id": 1,
        "name": "Frontend Engineer",
        "createdAt": "2023-02-23T11:10:53.498Z",
        "updatedAt": "2023-06-27T12:03:29.887Z"
      },
      "Company": {
        "id": 2187,
        "name": "HCLTech",
        "logo": null,
        "pocName": "Amit Bhardwaj",
        "pocNumber": "6398153358",
        "pocEmail": "omb21698@hcl.com",
        "campusNexaRecommended": null,
        "createdAt": "2025-11-20T07:11:21.590Z",
        "updatedAt": "2025-11-20T08:30:12.038Z",
        "CampusNexaCompanyRefId": null,
        "CreatedById": 31491,
        "CollegeId": 4633
      }
    },
    {
      "id": 6249,
      "companyName": "ContactPoint360",
      "minCTC": 6,
      "maxCTC": 12,
      "expirationDateTime": "2025-11-23T10:56:00.000Z",
      "description": "<h2>Only Candidates with a Minimum of 2 year exp should apply . No laptop will be provided since its Work from Home oppurtunity</h2>",
      "newDescription": {
        "type": "doc",
        "content": [
          {
            "type": "heading",
            "attrs": {
              "level": 2,
              "textAlign": null
            },
            "content": [
              {
                "text": "Only Candidates with a Minimum of 2 year exp should apply . No laptop will be provided since its Work from Home oppurtunity",
                "type": "text"
              }
            ]
          }
        ]
      },
      "alertMessage": null,
      "alertConfirmationMessage": null,
      "JobRoleId": 2,
      "yearsOfExperience": 1,
      "status": 4,
      "closedReasonType": 3,
      "closedReason": "dnst",
      "showCompanyToStudents": true,
      "companyPOCEmail": "sankar.rajappan@cp-360.com",
      "isPrivate": false,
      "offersInternship": false,
      "internshipDuration": 0,
      "internshipStipend": 0,
      "isAlumniJob": false,
      "isProCompany": false,
      "isJobPortal": false,
      "jobTags": null,
      "jobRedirectionLink": null,
      "category": null,
      "domain": null,
      "size": null,
      "bootstrappedOrFunded": null,
      "revenue": null,
      "source": null,
      "createdAt": "2025-04-08T10:11:26.251Z",
      "updatedAt": "2026-02-16T14:46:15.160Z",
      "CompanyId": 1428,
      "CollegeId": 4633,
      "JobApplicants": [
        {
          "id": 66652,
          "UserId": 57312,
          "JobOpeningId": 6249,
          "status": 9,
          "interviewDate": null,
          "ctcOffered": null,
          "yoe": null,
          "rejectionReason": null,
          "createdAt": "2025-04-09T03:39:24.104Z",
          "updatedAt": "2025-04-23T05:25:30.793Z",
          "JobApplicantStatuses": [
            {
              "id": 159364,
              "JobApplicantId": 66652,
              "status": 9,
              "date": "2025-04-23T05:25:30.792Z",
              "createdAt": "2025-04-23T05:25:30.794Z",
              "updatedAt": "2025-04-23T05:25:30.794Z"
            },
            {
              "id": 157646,
              "JobApplicantId": 66652,
              "status": 2,
              "date": "2025-04-09T07:16:49.279Z",
              "createdAt": "2025-04-09T07:16:27.527Z",
              "updatedAt": "2025-04-09T07:16:27.527Z"
            },
            {
              "id": 157581,
              "JobApplicantId": 66652,
              "status": 1,
              "date": "2025-04-09T03:39:24.109Z",
              "createdAt": "2025-04-09T03:39:24.109Z",
              "updatedAt": "2025-04-09T03:39:24.109Z"
            }
          ]
        }
      ],
      "JobLocations": [
        {
          "id": 18150,
          "name": "Remote",
          "JobOpeningId": 6249,
          "createdAt": "2025-11-18T11:00:40.506Z",
          "updatedAt": "2025-11-18T11:00:40.506Z"
        }
      ],
      "JobRole": {
        "id": 2,
        "name": "Backend Engineer",
        "createdAt": "2023-02-28T09:10:58.719Z",
        "updatedAt": "2023-03-01T12:15:43.646Z"
      },
      "Company": {
        "id": 1428,
        "name": "ContactPoint360",
        "logo": null,
        "pocName": "Sankar",
        "pocNumber": "7012233811",
        "pocEmail": "sankar.rajappan@cp-360.com",
        "campusNexaRecommended": null,
        "createdAt": "2025-04-08T10:09:04.221Z",
        "updatedAt": "2025-04-08T10:09:04.221Z",
        "CampusNexaCompanyRefId": null,
        "CreatedById": 46492,
        "CollegeId": 4633
      }
    },
    {
      "id": 7680,
      "companyName": "Suretek Infosoft Pvt. Ltd",
      "minCTC": 9,
      "maxCTC": 12,
      "expirationDateTime": "2025-11-23T07:45:00.000Z",
      "description": "<h1>FULL STACK DEVELOPER REQUIRED</h1>",
      "newDescription": {
        "type": "doc",
        "content": [
          {
            "type": "heading",
            "attrs": {
              "level": 1,
              "textAlign": null
            },
            "content": [
              {
                "text": "FULL STACK DEVELOPER REQUIRED",
                "type": "text"
              }
            ]
          }
        ]
      },
      "alertMessage": null,
      "alertConfirmationMessage": null,
      "JobRoleId": 1,
      "yearsOfExperience": 0,
      "status": 4,
      "closedReasonType": 3,
      "closedReason": "dnst",
      "showCompanyToStudents": true,
      "companyPOCEmail": "supriya.suri@suretekinfosoft.com",
      "isPrivate": false,
      "offersInternship": false,
      "internshipDuration": 0,
      "internshipStipend": 0,
      "isAlumniJob": false,
      "isProCompany": false,
      "isJobPortal": false,
      "jobTags": null,
      "jobRedirectionLink": null,
      "category": "Product",
      "domain": "Software Services",
      "size": "Startup (<100)",
      "bootstrappedOrFunded": "Bootstrapped",
      "revenue": "$5.78",
      "source": "LinkedIn",
      "createdAt": "2025-11-17T11:43:32.578Z",
      "updatedAt": "2026-01-13T13:01:53.105Z",
      "CompanyId": 2176,
      "CollegeId": 4633,
      "JobApplicants": [
        {
          "id": 80261,
          "UserId": 57312,
          "JobOpeningId": 7680,
          "status": 9,
          "interviewDate": null,
          "ctcOffered": null,
          "yoe": null,
          "rejectionReason": null,
          "createdAt": "2025-11-18T11:35:34.978Z",
          "updatedAt": "2026-01-13T13:01:53.050Z",
          "JobApplicantStatuses": [
            {
              "id": 199151,
              "JobApplicantId": 80261,
              "status": 9,
              "date": "2026-01-13T13:01:53.049Z",
              "createdAt": "2026-01-13T13:01:53.051Z",
              "updatedAt": "2026-01-13T13:01:53.051Z"
            },
            {
              "id": 191284,
              "JobApplicantId": 80261,
              "status": 1,
              "date": "2025-11-18T11:35:34.980Z",
              "createdAt": "2025-11-18T11:35:34.980Z",
              "updatedAt": "2025-11-18T11:35:34.980Z"
            }
          ]
        }
      ],
      "JobLocations": [
        {
          "id": 18131,
          "name": "Noida",
          "JobOpeningId": 7680,
          "createdAt": "2025-11-17T11:43:32.584Z",
          "updatedAt": "2025-11-17T11:43:32.584Z"
        },
        {
          "id": 18129,
          "name": "Delhi",
          "JobOpeningId": 7680,
          "createdAt": "2025-11-17T11:43:32.584Z",
          "updatedAt": "2025-11-17T11:43:32.584Z"
        },
        {
          "id": 18130,
          "name": "Gurgaon",
          "JobOpeningId": 7680,
          "createdAt": "2025-11-17T11:43:32.584Z",
          "updatedAt": "2025-11-17T11:43:32.584Z"
        }
      ],
      "JobRole": {
        "id": 1,
        "name": "Frontend Engineer",
        "createdAt": "2023-02-23T11:10:53.498Z",
        "updatedAt": "2023-06-27T12:03:29.887Z"
      },
      "Company": {
        "id": 2176,
        "name": "Suretek Infosoft Pvt. Ltd",
        "logo": "https://sharpener.blob.core.windows.net/companylogos/suretek_infosoft_pvt__ltd__logo.jfif",
        "pocName": "Supriya ",
        "pocNumber": "8588817916",
        "pocEmail": "supriya.suri@suretekinfosoft.com",
        "campusNexaRecommended": null,
        "createdAt": "2025-11-17T11:30:59.505Z",
        "updatedAt": "2025-11-17T11:30:59.505Z",
        "CampusNexaCompanyRefId": null,
        "CreatedById": 46492,
        "CollegeId": 4633
      }
    },
    {
      "id": 7698,
      "companyName": "Delhivery",
      "minCTC": 10,
      "maxCTC": 15,
      "expirationDateTime": "2025-11-22T11:50:00.000Z",
      "description": "<h1>SALARY WILL DEPEND ON LAST CTC. CANDIDATES WORKING IN PRODUCT BASED COMPANY SHOULD APPLY FOR FULL STACK</h1>",
      "newDescription": {
        "type": "doc",
        "content": [
          {
            "type": "heading",
            "attrs": {
              "level": 1,
              "textAlign": null
            },
            "content": [
              {
                "text": "SALARY WILL DEPEND ON LAST CTC. CANDIDATES WORKING IN PRODUCT BASED COMPANY SHOULD APPLY FOR FULL STACK",
                "type": "text"
              }
            ]
          }
        ]
      },
      "alertMessage": null,
      "alertConfirmationMessage": null,
      "JobRoleId": 1,
      "yearsOfExperience": 1,
      "status": 4,
      "closedReasonType": 3,
      "closedReason": "dnst",
      "showCompanyToStudents": true,
      "companyPOCEmail": "arshmeet.int@delhivery.com",
      "isPrivate": false,
      "offersInternship": false,
      "internshipDuration": 0,
      "internshipStipend": 0,
      "isAlumniJob": false,
      "isProCompany": false,
      "isJobPortal": false,
      "jobTags": null,
      "jobRedirectionLink": null,
      "category": null,
      "domain": null,
      "size": null,
      "bootstrappedOrFunded": null,
      "revenue": null,
      "source": null,
      "createdAt": "2025-11-19T11:48:48.436Z",
      "updatedAt": "2026-02-16T14:51:51.665Z",
      "CompanyId": 1832,
      "CollegeId": 4633,
      "JobApplicants": [
        {
          "id": 80390,
          "UserId": 57312,
          "JobOpeningId": 7698,
          "status": 9,
          "interviewDate": null,
          "ctcOffered": null,
          "yoe": null,
          "rejectionReason": null,
          "createdAt": "2025-11-19T13:14:45.169Z",
          "updatedAt": "2026-02-16T14:51:51.652Z",
          "JobApplicantStatuses": [
            {
              "id": 203983,
              "JobApplicantId": 80390,
              "status": 9,
              "date": "2026-02-16T14:51:51.652Z",
              "createdAt": "2026-02-16T14:51:51.653Z",
              "updatedAt": "2026-02-16T14:51:51.653Z"
            },
            {
              "id": 191523,
              "JobApplicantId": 80390,
              "status": 1,
              "date": "2025-11-19T13:14:45.172Z",
              "createdAt": "2025-11-19T13:14:45.173Z",
              "updatedAt": "2025-11-19T13:14:45.173Z"
            }
          ]
        }
      ],
      "JobLocations": [
        {
          "id": 18167,
          "name": "Gurgaon",
          "JobOpeningId": 7698,
          "createdAt": "2025-11-19T11:48:48.443Z",
          "updatedAt": "2025-11-19T11:48:48.443Z"
        }
      ],
      "JobRole": {
        "id": 1,
        "name": "Frontend Engineer",
        "createdAt": "2023-02-23T11:10:53.498Z",
        "updatedAt": "2023-06-27T12:03:29.887Z"
      },
      "Company": {
        "id": 1832,
        "name": "Delhivery",
        "logo": null,
        "pocName": "Arshmeet",
        "pocNumber": "9818615320",
        "pocEmail": null,
        "campusNexaRecommended": null,
        "createdAt": "2025-07-15T12:26:28.201Z",
        "updatedAt": "2025-07-15T12:26:28.201Z",
        "CampusNexaCompanyRefId": null,
        "CreatedById": 46492,
        "CollegeId": 4633
      }
    },
    {
      "id": 7653,
      "companyName": "WLDD PVT LTD",
      "minCTC": 8,
      "maxCTC": 11,
      "expirationDateTime": "2025-11-22T07:50:00.000Z",
      "description": "<p class=\"\"><span style=\"color: rgba(0, 0, 0, 0.9)\">⚙️ Required Skills</span></p><ul><li><p class=\"\"><span><strong>TypeScript / Node.js</strong></span></p></li><li><p class=\"\"><span><strong>MongoDB</strong></span></p></li><li><p class=\"\"><span><strong>Next.js</strong> </span><span style=\"color: rgba(0, 0, 0, 0.9)\">(Frontend)</span></p></li><li><p class=\"\"><span><strong>Docker</strong></span></p></li><li><p class=\"\"><span><strong>Jest</strong> </span><span style=\"color: rgba(0, 0, 0, 0.9)\">(for testing)</span></p></li></ul><p class=\"\"><span style=\"color: rgba(0, 0, 0, 0.9)\"><br></span></p>",
      "newDescription": {
        "type": "doc",
        "content": [
          {
            "type": "paragraph",
            "attrs": {
              "textAlign": null
            },
            "content": [
              {
                "text": "⚙️ Required Skills",
                "type": "text",
                "marks": [
                  {
                    "type": "textStyle",
                    "attrs": {
                      "color": "rgba(0, 0, 0, 0.9)"
                    }
                  }
                ]
              }
            ]
          },
          {
            "type": "bulletList",
            "content": [
              {
                "type": "listItem",
                "content": [
                  {
                    "type": "paragraph",
                    "attrs": {
                      "textAlign": null
                    },
                    "content": [
                      {
                        "text": "TypeScript / Node.js",
                        "type": "text",
                        "marks": [
                          {
                            "type": "textStyle",
                            "attrs": {
                              "color": ""
                            }
                          },
                          {
                            "type": "bold"
                          }
                        ]
                      }
                    ]
                  }
                ]
              },
              {
                "type": "listItem",
                "content": [
                  {
                    "type": "paragraph",
                    "attrs": {
                      "textAlign": null
                    },
                    "content": [
                      {
                        "text": "MongoDB",
                        "type": "text",
                        "marks": [
                          {
                            "type": "textStyle",
                            "attrs": {
                              "color": ""
                            }
                          },
                          {
                            "type": "bold"
                          }
                        ]
                      }
                    ]
                  }
                ]
              },
              {
                "type": "listItem",
                "content": [
                  {
                    "type": "paragraph",
                    "attrs": {
                      "textAlign": null
                    },
                    "content": [
                      {
                        "text": "Next.js",
                        "type": "text",
                        "marks": [
                          {
                            "type": "textStyle",
                            "attrs": {
                              "color": ""
                            }
                          },
                          {
                            "type": "bold"
                          }
                        ]
                      },
                      {
                        "text": " ",
                        "type": "text",
                        "marks": [
                          {
                            "type": "textStyle",
                            "attrs": {
                              "color": ""
                            }
                          }
                        ]
                      },
                      {
                        "text": "(Frontend)",
                        "type": "text",
                        "marks": [
                          {
                            "type": "textStyle",
                            "attrs": {
                              "color": "rgba(0, 0, 0, 0.9)"
                            }
                          }
                        ]
                      }
                    ]
                  }
                ]
              },
              {
                "type": "listItem",
                "content": [
                  {
                    "type": "paragraph",
                    "attrs": {
                      "textAlign": null
                    },
                    "content": [
                      {
                        "text": "Docker",
                        "type": "text",
                        "marks": [
                          {
                            "type": "textStyle",
                            "attrs": {
                              "color": ""
                            }
                          },
                          {
                            "type": "bold"
                          }
                        ]
                      }
                    ]
                  }
                ]
              },
              {
                "type": "listItem",
                "content": [
                  {
                    "type": "paragraph",
                    "attrs": {
                      "textAlign": null
                    },
                    "content": [
                      {
                        "text": "Jest",
                        "type": "text",
                        "marks": [
                          {
                            "type": "textStyle",
                            "attrs": {
                              "color": ""
                            }
                          },
                          {
                            "type": "bold"
                          }
                        ]
                      },
                      {
                        "text": " ",
                        "type": "text",
                        "marks": [
                          {
                            "type": "textStyle",
                            "attrs": {
                              "color": ""
                            }
                          }
                        ]
                      },
                      {
                        "text": "(for testing)",
                        "type": "text",
                        "marks": [
                          {
                            "type": "textStyle",
                            "attrs": {
                              "color": "rgba(0, 0, 0, 0.9)"
                            }
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            "type": "paragraph",
            "attrs": {
              "textAlign": null
            },
            "content": [
              {
                "type": "hardBreak",
                "marks": [
                  {
                    "type": "textStyle",
                    "attrs": {
                      "color": "rgba(0, 0, 0, 0.9)"
                    }
                  }
                ]
              }
            ]
          }
        ]
      },
      "alertMessage": null,
      "alertConfirmationMessage": null,
      "JobRoleId": 1,
      "yearsOfExperience": 1,
      "status": 4,
      "closedReasonType": 5,
      "closedReason": "nt reach",
      "showCompanyToStudents": true,
      "companyPOCEmail": "jaynilpatel@wldd.in",
      "isPrivate": false,
      "offersInternship": false,
      "internshipDuration": 0,
      "internshipStipend": 0,
      "isAlumniJob": false,
      "isProCompany": false,
      "isJobPortal": false,
      "jobTags": null,
      "jobRedirectionLink": null,
      "category": "Service",
      "domain": "Software Services",
      "size": "Startup (<100)",
      "bootstrappedOrFunded": "Funded",
      "revenue": "44.3 cr",
      "source": "LinkedIn",
      "createdAt": "2025-11-12T08:40:53.131Z",
      "updatedAt": "2025-11-24T06:20:24.416Z",
      "CompanyId": 2161,
      "CollegeId": 4633,
      "JobApplicants": [
        {
          "id": 80263,
          "UserId": 57312,
          "JobOpeningId": 7653,
          "status": 9,
          "interviewDate": null,
          "ctcOffered": null,
          "yoe": null,
          "rejectionReason": null,
          "createdAt": "2025-11-18T11:36:22.160Z",
          "updatedAt": "2025-11-24T06:20:24.395Z",
          "JobApplicantStatuses": [
            {
              "id": 191981,
              "JobApplicantId": 80263,
              "status": 9,
              "date": "2025-11-24T06:20:24.394Z",
              "createdAt": "2025-11-24T06:20:24.395Z",
              "updatedAt": "2025-11-24T06:20:24.395Z"
            },
            {
              "id": 191286,
              "JobApplicantId": 80263,
              "status": 1,
              "date": "2025-11-18T11:36:22.163Z",
              "createdAt": "2025-11-18T11:36:22.164Z",
              "updatedAt": "2025-11-18T11:36:22.164Z"
            }
          ]
        }
      ],
      "JobLocations": [
        {
          "id": 18069,
          "name": "Bangalore",
          "JobOpeningId": 7653,
          "createdAt": "2025-11-12T08:41:19.250Z",
          "updatedAt": "2025-11-12T08:41:19.250Z"
        }
      ],
      "JobRole": {
        "id": 1,
        "name": "Frontend Engineer",
        "createdAt": "2023-02-23T11:10:53.498Z",
        "updatedAt": "2023-06-27T12:03:29.887Z"
      },
      "Company": {
        "id": 2161,
        "name": "WLDD PVT LTD",
        "logo": "https://sharpener.blob.core.windows.net/companylogos/1689674195961.jpeg",
        "pocName": "Jaynil",
        "pocNumber": "70162 41044",
        "pocEmail": "jaynilpatel@wldd.in",
        "campusNexaRecommended": null,
        "createdAt": "2025-11-12T08:34:32.285Z",
        "updatedAt": "2025-11-12T08:35:27.200Z",
        "CampusNexaCompanyRefId": null,
        "CreatedById": 46492,
        "CollegeId": 4633
      }
    },
    {
      "id": 7704,
      "companyName": "Ritchoiz",
      "minCTC": 7,
      "maxCTC": 8,
      "expirationDateTime": "2025-11-21T12:08:00.000Z",
      "description": "<h1><strong>Job role is full stack </strong></h1><h1>Candidates with 2 years of experience are required.</h1>",
      "newDescription": {
        "type": "doc",
        "content": [
          {
            "type": "heading",
            "attrs": {
              "level": 1,
              "textAlign": null
            },
            "content": [
              {
                "text": "Job role is full stack ",
                "type": "text",
                "marks": [
                  {
                    "type": "bold"
                  }
                ]
              }
            ]
          },
          {
            "type": "heading",
            "attrs": {
              "level": 1,
              "textAlign": null
            },
            "content": [
              {
                "text": "Candidates with 2 years of experience are required.",
                "type": "text"
              }
            ]
          }
        ]
      },
      "alertMessage": null,
      "alertConfirmationMessage": null,
      "JobRoleId": 1,
      "yearsOfExperience": 1,
      "status": 4,
      "closedReasonType": 3,
      "closedReason": "did not shortlist",
      "showCompanyToStudents": true,
      "companyPOCEmail": "hr@ritchoiz.com",
      "isPrivate": false,
      "offersInternship": false,
      "internshipDuration": 0,
      "internshipStipend": 0,
      "isAlumniJob": false,
      "isProCompany": false,
      "isJobPortal": false,
      "jobTags": null,
      "jobRedirectionLink": null,
      "category": null,
      "domain": null,
      "size": null,
      "bootstrappedOrFunded": null,
      "revenue": null,
      "source": null,
      "createdAt": "2025-11-20T12:08:32.937Z",
      "updatedAt": "2026-01-05T09:06:01.337Z",
      "CompanyId": 1737,
      "CollegeId": 4633,
      "JobApplicants": [
        {
          "id": 80537,
          "UserId": 57312,
          "JobOpeningId": 7704,
          "status": 9,
          "interviewDate": null,
          "ctcOffered": null,
          "yoe": null,
          "rejectionReason": null,
          "createdAt": "2025-11-21T03:34:23.436Z",
          "updatedAt": "2026-01-05T09:06:01.320Z",
          "JobApplicantStatuses": [
            {
              "id": 197224,
              "JobApplicantId": 80537,
              "status": 9,
              "date": "2026-01-05T09:06:01.319Z",
              "createdAt": "2026-01-05T09:06:01.320Z",
              "updatedAt": "2026-01-05T09:06:01.320Z"
            },
            {
              "id": 191747,
              "JobApplicantId": 80537,
              "status": 2,
              "date": "2025-11-21T06:03:09.663Z",
              "createdAt": "2025-11-21T06:03:09.755Z",
              "updatedAt": "2025-11-21T06:03:09.755Z"
            },
            {
              "id": 191728,
              "JobApplicantId": 80537,
              "status": 1,
              "date": "2025-11-21T03:34:23.438Z",
              "createdAt": "2025-11-21T03:34:23.438Z",
              "updatedAt": "2025-11-21T03:34:23.438Z"
            }
          ]
        }
      ],
      "JobLocations": [
        {
          "id": 18177,
          "name": "Remote",
          "JobOpeningId": 7704,
          "createdAt": "2025-11-20T12:08:32.944Z",
          "updatedAt": "2025-11-20T12:08:32.944Z"
        }
      ],
      "JobRole": {
        "id": 1,
        "name": "Frontend Engineer",
        "createdAt": "2023-02-23T11:10:53.498Z",
        "updatedAt": "2023-06-27T12:03:29.887Z"
      },
      "Company": {
        "id": 1737,
        "name": "Ritchoiz",
        "logo": "https://sharpener.blob.core.windows.net/companylogos/logo.png",
        "pocName": "Anjali",
        "pocNumber": "7736682068",
        "pocEmail": "hr@ritchoiz.com",
        "campusNexaRecommended": null,
        "createdAt": "2025-06-16T09:52:37.241Z",
        "updatedAt": "2026-02-17T12:48:39.258Z",
        "CampusNexaCompanyRefId": null,
        "CreatedById": 54536,
        "CollegeId": 4633
      }
    },
    {
      "id": 5582,
      "companyName": "Narola infotech ",
      "minCTC": 3.6,
      "maxCTC": 7.2,
      "expirationDateTime": "2025-11-20T10:14:00.000Z",
      "description": "<h1>Job role is full stack , candidates who have completed 2 projects both in backend and frontend are required</h1><h1>Candidates with 2 years of experience are required.</h1><h1>CTC based on last CTC and interview performance </h1>",
      "newDescription": {
        "type": "doc",
        "content": [
          {
            "type": "heading",
            "attrs": {
              "level": 1,
              "textAlign": null
            },
            "content": [
              {
                "text": "Job role is full stack , candidates who have completed 2 projects both in backend and frontend are required",
                "type": "text"
              }
            ]
          },
          {
            "type": "heading",
            "attrs": {
              "level": 1,
              "textAlign": null
            },
            "content": [
              {
                "text": "Candidates with 2 years of experience are required.",
                "type": "text"
              }
            ]
          },
          {
            "type": "heading",
            "attrs": {
              "level": 1,
              "textAlign": null
            },
            "content": [
              {
                "text": "CTC based on last CTC and interview performance ",
                "type": "text"
              }
            ]
          }
        ]
      },
      "alertMessage": null,
      "alertConfirmationMessage": null,
      "JobRoleId": 1,
      "yearsOfExperience": 1,
      "status": 4,
      "closedReasonType": 3,
      "closedReason": "did not shortlist",
      "showCompanyToStudents": true,
      "companyPOCEmail": "komal@narola.email ",
      "isPrivate": false,
      "offersInternship": false,
      "internshipDuration": 0,
      "internshipStipend": 0,
      "isAlumniJob": false,
      "isProCompany": false,
      "isJobPortal": false,
      "jobTags": null,
      "jobRedirectionLink": null,
      "category": null,
      "domain": null,
      "size": null,
      "bootstrappedOrFunded": null,
      "revenue": null,
      "source": null,
      "createdAt": "2024-12-26T11:26:06.653Z",
      "updatedAt": "2026-01-05T09:01:51.366Z",
      "CompanyId": 1094,
      "CollegeId": 4633,
      "JobApplicants": [
        {
          "id": 80267,
          "UserId": 57312,
          "JobOpeningId": 5582,
          "status": 9,
          "interviewDate": null,
          "ctcOffered": null,
          "yoe": null,
          "rejectionReason": null,
          "createdAt": "2025-11-18T12:27:02.461Z",
          "updatedAt": "2026-01-05T09:01:51.359Z",
          "JobApplicantStatuses": [
            {
              "id": 197121,
              "JobApplicantId": 80267,
              "status": 9,
              "date": "2026-01-05T09:01:51.359Z",
              "createdAt": "2026-01-05T09:01:51.360Z",
              "updatedAt": "2026-01-05T09:01:51.360Z"
            },
            {
              "id": 191307,
              "JobApplicantId": 80267,
              "status": 1,
              "date": "2025-11-18T12:27:02.464Z",
              "createdAt": "2025-11-18T12:27:02.465Z",
              "updatedAt": "2025-11-18T12:27:02.465Z"
            }
          ]
        }
      ],
      "JobLocations": [
        {
          "id": 18123,
          "name": "Surat",
          "JobOpeningId": 5582,
          "createdAt": "2025-11-17T10:14:15.720Z",
          "updatedAt": "2025-11-17T10:14:15.720Z"
        }
      ],
      "JobRole": {
        "id": 1,
        "name": "Frontend Engineer",
        "createdAt": "2023-02-23T11:10:53.498Z",
        "updatedAt": "2023-06-27T12:03:29.887Z"
      },
      "Company": {
        "id": 1094,
        "name": "Narola infotech ",
        "logo": null,
        "pocName": "komal",
        "pocNumber": "99093 69811",
        "pocEmail": "komal@narola.email ",
        "campusNexaRecommended": null,
        "createdAt": "2024-12-26T11:22:30.231Z",
        "updatedAt": "2024-12-26T11:22:30.231Z",
        "CampusNexaCompanyRefId": null,
        "CreatedById": 54536,
        "CollegeId": 4633
      }
    },
    {
      "id": 7336,
      "companyName": "Khata Book",
      "minCTC": 10,
      "maxCTC": 11,
      "expirationDateTime": "2025-11-19T12:02:00.000Z",
      "description": "<h1><strong>Job role is full stack</strong></h1><h1><strong>Candidate must be having 1 + years of experince</strong></h1><h1><strong>Candidate must be from technical background ( Btech/BE)</strong></h1><h1><strong>Must have experince of product based company or fintech company </strong></h1>",
      "newDescription": {
        "type": "doc",
        "content": [
          {
            "type": "heading",
            "attrs": {
              "level": 1,
              "textAlign": null
            },
            "content": [
              {
                "text": "Job role is full stack",
                "type": "text",
                "marks": [
                  {
                    "type": "bold"
                  }
                ]
              }
            ]
          },
          {
            "type": "heading",
            "attrs": {
              "level": 1,
              "textAlign": null
            },
            "content": [
              {
                "text": "Candidate must be having 1 + years of experince",
                "type": "text",
                "marks": [
                  {
                    "type": "bold"
                  }
                ]
              }
            ]
          },
          {
            "type": "heading",
            "attrs": {
              "level": 1,
              "textAlign": null
            },
            "content": [
              {
                "text": "Candidate must be from technical background ( Btech/BE)",
                "type": "text",
                "marks": [
                  {
                    "type": "bold"
                  }
                ]
              }
            ]
          },
          {
            "type": "heading",
            "attrs": {
              "level": 1,
              "textAlign": null
            },
            "content": [
              {
                "text": "Must have experince of product based company or fintech company ",
                "type": "text",
                "marks": [
                  {
                    "type": "bold"
                  }
                ]
              }
            ]
          }
        ]
      },
      "alertMessage": null,
      "alertConfirmationMessage": null,
      "JobRoleId": 1,
      "yearsOfExperience": 1,
      "status": 4,
      "closedReasonType": 3,
      "closedReason": "did not shortlist",
      "showCompanyToStudents": true,
      "companyPOCEmail": "hr@khatabook.com",
      "isPrivate": false,
      "offersInternship": false,
      "internshipDuration": 0,
      "internshipStipend": 0,
      "isAlumniJob": false,
      "isProCompany": false,
      "isJobPortal": false,
      "jobTags": null,
      "jobRedirectionLink": null,
      "category": "Product",
      "domain": null,
      "size": "Mid size (100-500)",
      "bootstrappedOrFunded": null,
      "revenue": "105 cr",
      "source": null,
      "createdAt": "2025-09-08T08:20:01.342Z",
      "updatedAt": "2026-01-05T09:05:17.396Z",
      "CompanyId": 1988,
      "CollegeId": 4633,
      "JobApplicants": [
        {
          "id": 80264,
          "UserId": 57312,
          "JobOpeningId": 7336,
          "status": 9,
          "interviewDate": null,
          "ctcOffered": null,
          "yoe": null,
          "rejectionReason": null,
          "createdAt": "2025-11-18T11:36:37.002Z",
          "updatedAt": "2026-01-05T09:05:17.386Z",
          "JobApplicantStatuses": [
            {
              "id": 197190,
              "JobApplicantId": 80264,
              "status": 9,
              "date": "2026-01-05T09:05:17.385Z",
              "createdAt": "2026-01-05T09:05:17.386Z",
              "updatedAt": "2026-01-05T09:05:17.386Z"
            },
            {
              "id": 191418,
              "JobApplicantId": 80264,
              "status": 2,
              "date": "2025-11-19T07:14:35.131Z",
              "createdAt": "2025-11-19T07:14:36.045Z",
              "updatedAt": "2025-11-19T07:14:36.045Z"
            },
            {
              "id": 191287,
              "JobApplicantId": 80264,
              "status": 1,
              "date": "2025-11-18T11:36:37.004Z",
              "createdAt": "2025-11-18T11:36:37.004Z",
              "updatedAt": "2025-11-18T11:36:37.004Z"
            }
          ]
        }
      ],
      "JobLocations": [
        {
          "id": 18135,
          "name": "Bangalore",
          "JobOpeningId": 7336,
          "createdAt": "2025-11-17T12:01:38.625Z",
          "updatedAt": "2025-11-17T12:01:38.625Z"
        }
      ],
      "JobRole": {
        "id": 1,
        "name": "Frontend Engineer",
        "createdAt": "2023-02-23T11:10:53.498Z",
        "updatedAt": "2023-06-27T12:03:29.887Z"
      },
      "Company": {
        "id": 1988,
        "name": "Khata Book",
        "logo": null,
        "pocName": "Apurv ",
        "pocNumber": "9987552366",
        "pocEmail": "hr@khatabook.com",
        "campusNexaRecommended": null,
        "createdAt": "2025-09-08T08:17:02.711Z",
        "updatedAt": "2025-09-08T08:17:02.711Z",
        "CampusNexaCompanyRefId": null,
        "CreatedById": 54536,
        "CollegeId": 4633
      }
    },
    {
      "id": 7627,
      "companyName": "Antino Labs",
      "minCTC": 4,
      "maxCTC": 8,
      "expirationDateTime": "2025-11-19T05:59:00.000Z",
      "description": null,
      "newDescription": null,
      "alertMessage": "<h2><strong>Role- Mern stack developer</strong></h2><h2>Final round will be F2F</h2>",
      "alertConfirmationMessage": null,
      "JobRoleId": 1,
      "yearsOfExperience": 1,
      "status": 4,
      "closedReasonType": 3,
      "closedReason": "not shortlisted",
      "showCompanyToStudents": true,
      "companyPOCEmail": "taruna.s@antino.com",
      "isPrivate": false,
      "offersInternship": false,
      "internshipDuration": 0,
      "internshipStipend": 0,
      "isAlumniJob": false,
      "isProCompany": false,
      "isJobPortal": false,
      "jobTags": null,
      "jobRedirectionLink": null,
      "category": null,
      "domain": null,
      "size": null,
      "bootstrappedOrFunded": null,
      "revenue": null,
      "source": null,
      "createdAt": "2025-11-10T09:54:45.971Z",
      "updatedAt": "2025-12-06T06:22:12.951Z",
      "CompanyId": 609,
      "CollegeId": 4633,
      "JobApplicants": [
        {
          "id": 80257,
          "UserId": 57312,
          "JobOpeningId": 7627,
          "status": 9,
          "interviewDate": null,
          "ctcOffered": null,
          "yoe": null,
          "rejectionReason": null,
          "createdAt": "2025-11-18T11:34:23.204Z",
          "updatedAt": "2025-12-06T06:22:12.939Z",
          "JobApplicantStatuses": [
            {
              "id": 194345,
              "JobApplicantId": 80257,
              "status": 9,
              "date": "2025-12-06T06:22:12.938Z",
              "createdAt": "2025-12-06T06:22:12.939Z",
              "updatedAt": "2025-12-06T06:22:12.939Z"
            },
            {
              "id": 191280,
              "JobApplicantId": 80257,
              "status": 1,
              "date": "2025-11-18T11:34:23.207Z",
              "createdAt": "2025-11-18T11:34:23.207Z",
              "updatedAt": "2025-11-18T11:34:23.207Z"
            }
          ]
        }
      ],
      "JobLocations": [
        {
          "id": 18025,
          "name": "Gurgaon",
          "JobOpeningId": 7627,
          "createdAt": "2025-11-10T09:54:45.978Z",
          "updatedAt": "2025-11-10T09:54:45.978Z"
        }
      ],
      "JobRole": {
        "id": 1,
        "name": "Frontend Engineer",
        "createdAt": "2023-02-23T11:10:53.498Z",
        "updatedAt": "2023-06-27T12:03:29.887Z"
      },
      "Company": {
        "id": 609,
        "name": "Antino Labs",
        "logo": null,
        "pocName": "taruna",
        "pocNumber": "9690440791",
        "pocEmail": "taruna.s@antino.com",
        "campusNexaRecommended": null,
        "createdAt": "2024-09-09T11:09:05.232Z",
        "updatedAt": "2024-09-09T11:09:05.232Z",
        "CampusNexaCompanyRefId": null,
        "CreatedById": 25244,
        "CollegeId": 4633
      }
    },
    {
      "id": 7687,
      "companyName": "NHN Soltuions ",
      "minCTC": 7,
      "maxCTC": 8,
      "expirationDateTime": "2025-11-19T04:30:00.000Z",
      "description": "<h1><strong>Job role is full stack </strong></h1><h1><strong>CTC would be based on last CTC totally as per market standard .</strong></h1><h1><strong>CTC range would be discussed in first call ( screening call) </strong></h1><h1><strong>Candidates with2 years of experince required.</strong></h1><h1></h1>",
      "newDescription": {
        "type": "doc",
        "content": [
          {
            "type": "heading",
            "attrs": {
              "level": 1,
              "textAlign": null
            },
            "content": [
              {
                "text": "Job role is full stack ",
                "type": "text",
                "marks": [
                  {
                    "type": "bold"
                  }
                ]
              }
            ]
          },
          {
            "type": "heading",
            "attrs": {
              "level": 1,
              "textAlign": null
            },
            "content": [
              {
                "text": "CTC would be based on last CTC totally as per market standard .",
                "type": "text",
                "marks": [
                  {
                    "type": "bold"
                  }
                ]
              }
            ]
          },
          {
            "type": "heading",
            "attrs": {
              "level": 1,
              "textAlign": null
            },
            "content": [
              {
                "text": "CTC range would be discussed in first call ( screening call) ",
                "type": "text",
                "marks": [
                  {
                    "type": "bold"
                  }
                ]
              }
            ]
          },
          {
            "type": "heading",
            "attrs": {
              "level": 1,
              "textAlign": null
            },
            "content": [
              {
                "text": "Candidates with2 years of experince required.",
                "type": "text",
                "marks": [
                  {
                    "type": "bold"
                  }
                ]
              }
            ]
          },
          {
            "type": "heading",
            "attrs": {
              "level": 1,
              "textAlign": null
            }
          }
        ]
      },
      "alertMessage": null,
      "alertConfirmationMessage": null,
      "JobRoleId": 1,
      "yearsOfExperience": 1,
      "status": 4,
      "closedReasonType": 3,
      "closedReason": "did not shortlist",
      "showCompanyToStudents": true,
      "companyPOCEmail": "hr@nhnsol.com",
      "isPrivate": false,
      "offersInternship": false,
      "internshipDuration": 0,
      "internshipStipend": 0,
      "isAlumniJob": false,
      "isProCompany": false,
      "isJobPortal": false,
      "jobTags": null,
      "jobRedirectionLink": null,
      "category": "Product",
      "domain": null,
      "size": null,
      "bootstrappedOrFunded": null,
      "revenue": null,
      "source": "Indeed",
      "createdAt": "2025-11-18T07:36:38.736Z",
      "updatedAt": "2025-12-09T12:57:55.037Z",
      "CompanyId": 2179,
      "CollegeId": 4633,
      "JobApplicants": [
        {
          "id": 80258,
          "UserId": 57312,
          "JobOpeningId": 7687,
          "status": 9,
          "interviewDate": null,
          "ctcOffered": null,
          "yoe": null,
          "rejectionReason": null,
          "createdAt": "2025-11-18T11:34:55.931Z",
          "updatedAt": "2025-12-09T12:57:55.030Z",
          "JobApplicantStatuses": [
            {
              "id": 195071,
              "JobApplicantId": 80258,
              "status": 9,
              "date": "2025-12-09T12:57:55.030Z",
              "createdAt": "2025-12-09T12:57:55.030Z",
              "updatedAt": "2025-12-09T12:57:55.030Z"
            },
            {
              "id": 191281,
              "JobApplicantId": 80258,
              "status": 1,
              "date": "2025-11-18T11:34:55.935Z",
              "createdAt": "2025-11-18T11:34:55.935Z",
              "updatedAt": "2025-11-18T11:34:55.935Z"
            }
          ]
        }
      ],
      "JobLocations": [
        {
          "id": 18144,
          "name": "Pune",
          "JobOpeningId": 7687,
          "createdAt": "2025-11-18T07:36:38.740Z",
          "updatedAt": "2025-11-18T07:36:38.740Z"
        }
      ],
      "JobRole": {
        "id": 1,
        "name": "Frontend Engineer",
        "createdAt": "2023-02-23T11:10:53.498Z",
        "updatedAt": "2023-06-27T12:03:29.887Z"
      },
      "Company": {
        "id": 2179,
        "name": "NHN Soltuions ",
        "logo": null,
        "pocName": "Namrata ",
        "pocNumber": "7021-355-526",
        "pocEmail": "hr@nhnsol.com",
        "campusNexaRecommended": null,
        "createdAt": "2025-11-18T07:33:06.856Z",
        "updatedAt": "2025-11-18T07:33:06.856Z",
        "CampusNexaCompanyRefId": null,
        "CreatedById": 54536,
        "CollegeId": 4633
      }
    },
    {
      "id": 7688,
      "companyName": "NHN Soltuions ",
      "minCTC": 7,
      "maxCTC": 8,
      "expirationDateTime": "2025-11-19T04:30:00.000Z",
      "description": "<h1><strong>Job role is full stack </strong></h1><h1><strong>CTC would be based on last CTC totally as per market standard .</strong></h1><h1><strong>CTC range would be discussed in first call ( screening call) </strong></h1><h1><strong>Candidates with2 years of experince required.</strong></h1><h1></h1>",
      "newDescription": {
        "type": "doc",
        "content": [
          {
            "type": "heading",
            "attrs": {
              "level": 1,
              "textAlign": null
            },
            "content": [
              {
                "text": "Job role is full stack ",
                "type": "text",
                "marks": [
                  {
                    "type": "bold"
                  }
                ]
              }
            ]
          },
          {
            "type": "heading",
            "attrs": {
              "level": 1,
              "textAlign": null
            },
            "content": [
              {
                "text": "CTC would be based on last CTC totally as per market standard .",
                "type": "text",
                "marks": [
                  {
                    "type": "bold"
                  }
                ]
              }
            ]
          },
          {
            "type": "heading",
            "attrs": {
              "level": 1,
              "textAlign": null
            },
            "content": [
              {
                "text": "CTC range would be discussed in first call ( screening call) ",
                "type": "text",
                "marks": [
                  {
                    "type": "bold"
                  }
                ]
              }
            ]
          },
          {
            "type": "heading",
            "attrs": {
              "level": 1,
              "textAlign": null
            },
            "content": [
              {
                "text": "Candidates with2 years of experince required.",
                "type": "text",
                "marks": [
                  {
                    "type": "bold"
                  }
                ]
              }
            ]
          },
          {
            "type": "heading",
            "attrs": {
              "level": 1,
              "textAlign": null
            }
          }
        ]
      },
      "alertMessage": null,
      "alertConfirmationMessage": null,
      "JobRoleId": 1,
      "yearsOfExperience": 1,
      "status": 4,
      "closedReasonType": 3,
      "closedReason": "did not shortlist",
      "showCompanyToStudents": true,
      "companyPOCEmail": "hr@nhnsol.com",
      "isPrivate": false,
      "offersInternship": false,
      "internshipDuration": 0,
      "internshipStipend": 0,
      "isAlumniJob": false,
      "isProCompany": false,
      "isJobPortal": false,
      "jobTags": null,
      "jobRedirectionLink": null,
      "category": "Product",
      "domain": null,
      "size": null,
      "bootstrappedOrFunded": null,
      "revenue": null,
      "source": "Indeed",
      "createdAt": "2025-11-18T07:36:38.808Z",
      "updatedAt": "2025-12-09T12:57:17.920Z",
      "CompanyId": 2179,
      "CollegeId": 4633,
      "JobApplicants": [
        {
          "id": 80259,
          "UserId": 57312,
          "JobOpeningId": 7688,
          "status": 9,
          "interviewDate": null,
          "ctcOffered": null,
          "yoe": null,
          "rejectionReason": null,
          "createdAt": "2025-11-18T11:35:03.473Z",
          "updatedAt": "2025-12-09T12:57:17.912Z",
          "JobApplicantStatuses": [
            {
              "id": 195057,
              "JobApplicantId": 80259,
              "status": 9,
              "date": "2025-12-09T12:57:17.911Z",
              "createdAt": "2025-12-09T12:57:17.912Z",
              "updatedAt": "2025-12-09T12:57:17.912Z"
            },
            {
              "id": 191425,
              "JobApplicantId": 80259,
              "status": 2,
              "date": "2025-11-19T07:27:41.751Z",
              "createdAt": "2025-11-19T07:27:42.647Z",
              "updatedAt": "2025-11-19T07:27:42.647Z"
            },
            {
              "id": 191282,
              "JobApplicantId": 80259,
              "status": 1,
              "date": "2025-11-18T11:35:03.475Z",
              "createdAt": "2025-11-18T11:35:03.475Z",
              "updatedAt": "2025-11-18T11:35:03.475Z"
            }
          ]
        }
      ],
      "JobLocations": [
        {
          "id": 18145,
          "name": "Pune",
          "JobOpeningId": 7688,
          "createdAt": "2025-11-18T07:36:38.811Z",
          "updatedAt": "2025-11-18T07:36:38.811Z"
        }
      ],
      "JobRole": {
        "id": 1,
        "name": "Frontend Engineer",
        "createdAt": "2023-02-23T11:10:53.498Z",
        "updatedAt": "2023-06-27T12:03:29.887Z"
      },
      "Company": {
        "id": 2179,
        "name": "NHN Soltuions ",
        "logo": null,
        "pocName": "Namrata ",
        "pocNumber": "7021-355-526",
        "pocEmail": "hr@nhnsol.com",
        "campusNexaRecommended": null,
        "createdAt": "2025-11-18T07:33:06.856Z",
        "updatedAt": "2025-11-18T07:33:06.856Z",
        "CampusNexaCompanyRefId": null,
        "CreatedById": 54536,
        "CollegeId": 4633
      }
    },
    {
      "id": 7553,
      "companyName": "Medicheck Hospitals",
      "minCTC": 3,
      "maxCTC": 6,
      "expirationDateTime": "2025-11-18T05:33:00.000Z",
      "description": "<p class=\"\"><span style=\"color: rgba(0, 0, 0, 0.9)\">Required skills: HTML &amp; CSS, JavaScript, React, GSAP, Next.js, Basic Back-end Knowledge, AI Integration Knowledge</span></p>",
      "newDescription": {
        "type": "doc",
        "content": [
          {
            "type": "paragraph",
            "attrs": {
              "textAlign": null
            },
            "content": [
              {
                "text": "Required skills: HTML & CSS, JavaScript, React, GSAP, Next.js, Basic Back-end Knowledge, AI Integration Knowledge",
                "type": "text",
                "marks": [
                  {
                    "type": "textStyle",
                    "attrs": {
                      "color": "rgba(0, 0, 0, 0.9)"
                    }
                  }
                ]
              }
            ]
          }
        ]
      },
      "alertMessage": null,
      "alertConfirmationMessage": null,
      "JobRoleId": 1,
      "yearsOfExperience": 0,
      "status": 4,
      "closedReasonType": 5,
      "closedReason": "nt reach",
      "showCompanyToStudents": true,
      "companyPOCEmail": "drsumit@medicheckhospitals.in",
      "isPrivate": true,
      "offersInternship": false,
      "internshipDuration": 0,
      "internshipStipend": 0,
      "isAlumniJob": false,
      "isProCompany": false,
      "isJobPortal": false,
      "jobTags": null,
      "jobRedirectionLink": null,
      "category": null,
      "domain": null,
      "size": null,
      "bootstrappedOrFunded": null,
      "revenue": null,
      "source": null,
      "createdAt": "2025-10-24T11:02:52.898Z",
      "updatedAt": "2026-02-16T14:55:34.586Z",
      "CompanyId": 2110,
      "CollegeId": 4633,
      "JobApplicants": [
        {
          "id": 78507,
          "UserId": 57312,
          "JobOpeningId": 7553,
          "status": 8,
          "interviewDate": null,
          "ctcOffered": null,
          "yoe": null,
          "rejectionReason": "nt st",
          "createdAt": "2025-10-24T16:35:25.378Z",
          "updatedAt": "2025-12-02T12:24:26.479Z",
          "JobApplicantStatuses": [
            {
              "id": 193013,
              "JobApplicantId": 78507,
              "status": 8,
              "date": "2025-12-02T12:24:20.000Z",
              "createdAt": "2025-12-02T12:24:26.478Z",
              "updatedAt": "2025-12-02T12:24:26.478Z"
            },
            {
              "id": 189391,
              "JobApplicantId": 78507,
              "status": 3,
              "date": "2025-11-07T06:30:00.000Z",
              "createdAt": "2025-11-06T12:13:30.213Z",
              "updatedAt": "2025-11-06T12:13:30.213Z"
            },
            {
              "id": 187718,
              "JobApplicantId": 78507,
              "status": 2,
              "date": "2025-10-27T08:11:00.657Z",
              "createdAt": "2025-10-27T08:11:00.906Z",
              "updatedAt": "2025-10-27T08:11:00.906Z"
            },
            {
              "id": 187277,
              "JobApplicantId": 78507,
              "status": 1,
              "date": "2025-10-24T16:35:25.382Z",
              "createdAt": "2025-10-24T16:35:25.382Z",
              "updatedAt": "2025-10-24T16:35:25.382Z"
            }
          ]
        }
      ],
      "JobLocations": [
        {
          "id": 17879,
          "name": "Faridabad",
          "JobOpeningId": 7553,
          "createdAt": "2025-10-24T11:02:52.904Z",
          "updatedAt": "2025-10-24T11:02:52.904Z"
        }
      ],
      "JobRole": {
        "id": 1,
        "name": "Frontend Engineer",
        "createdAt": "2023-02-23T11:10:53.498Z",
        "updatedAt": "2023-06-27T12:03:29.887Z"
      },
      "Company": {
        "id": 2110,
        "name": "Medicheck Hospitals",
        "logo": null,
        "pocName": "Sumit",
        "pocNumber": "9899995069",
        "pocEmail": "drsumit@medicheckhospitals.in",
        "campusNexaRecommended": null,
        "createdAt": "2025-10-24T10:59:13.943Z",
        "updatedAt": "2025-10-24T10:59:13.943Z",
        "CampusNexaCompanyRefId": null,
        "CreatedById": 46492,
        "CollegeId": 4633
      }
    },
    {
      "id": 6951,
      "companyName": "Excelerate",
      "minCTC": 3,
      "maxCTC": 4,
      "expirationDateTime": "2025-11-13T06:13:00.000Z",
      "description": "<h1>job role is full stack</h1><h1>4 sharpnerian already working</h1><h1>Dubai based company</h1><h1>Work form home</h1><h1>CTC would be based on interview totally ranging between 3-4LPA for the candidates who have internship experince for atleast 6 months</h1><h1>6 months of internship experince would required.</h1><p class=\"\"><br></p>",
      "newDescription": {
        "type": "doc",
        "content": [
          {
            "type": "heading",
            "attrs": {
              "level": 1,
              "textAlign": null
            },
            "content": [
              {
                "text": "job role is full stack",
                "type": "text"
              }
            ]
          },
          {
            "type": "heading",
            "attrs": {
              "level": 1,
              "textAlign": null
            },
            "content": [
              {
                "text": "4 sharpnerian already working",
                "type": "text"
              }
            ]
          },
          {
            "type": "heading",
            "attrs": {
              "level": 1,
              "textAlign": null
            },
            "content": [
              {
                "text": "Dubai based company",
                "type": "text"
              }
            ]
          },
          {
            "type": "heading",
            "attrs": {
              "level": 1,
              "textAlign": null
            },
            "content": [
              {
                "text": "Work form home",
                "type": "text"
              }
            ]
          },
          {
            "type": "heading",
            "attrs": {
              "level": 1,
              "textAlign": null
            },
            "content": [
              {
                "text": "CTC would be based on interview totally ranging between 3-4LPA for the candidates who have internship experince for atleast 6 months",
                "type": "text"
              }
            ]
          },
          {
            "type": "heading",
            "attrs": {
              "level": 1,
              "textAlign": null
            },
            "content": [
              {
                "text": "6 months of internship experince would required.",
                "type": "text"
              }
            ]
          },
          {
            "type": "paragraph",
            "attrs": {
              "textAlign": null
            },
            "content": [
              {
                "type": "hardBreak"
              }
            ]
          }
        ]
      },
      "alertMessage": null,
      "alertConfirmationMessage": null,
      "JobRoleId": 1,
      "yearsOfExperience": 0,
      "status": 4,
      "closedReasonType": 1,
      "closedReason": "hired ",
      "showCompanyToStudents": true,
      "companyPOCEmail": "people.empowerment@vempower.org",
      "isPrivate": false,
      "offersInternship": false,
      "internshipDuration": 0,
      "internshipStipend": 0,
      "isAlumniJob": false,
      "isProCompany": false,
      "isJobPortal": false,
      "jobTags": null,
      "jobRedirectionLink": null,
      "category": null,
      "domain": null,
      "size": null,
      "bootstrappedOrFunded": null,
      "revenue": null,
      "source": null,
      "createdAt": "2025-07-01T05:57:57.784Z",
      "updatedAt": "2025-12-09T12:55:27.146Z",
      "CompanyId": 1673,
      "CollegeId": 4633,
      "JobApplicants": [
        {
          "id": 78515,
          "UserId": 57312,
          "JobOpeningId": 6951,
          "status": 8,
          "interviewDate": null,
          "ctcOffered": null,
          "yoe": null,
          "rejectionReason": "rejected",
          "createdAt": "2025-10-25T05:11:05.461Z",
          "updatedAt": "2025-11-04T11:08:26.865Z",
          "JobApplicantStatuses": [
            {
              "id": 189061,
              "JobApplicantId": 78515,
              "status": 8,
              "date": "2025-11-04T11:08:19.000Z",
              "createdAt": "2025-11-04T11:08:26.865Z",
              "updatedAt": "2025-11-04T11:08:26.865Z"
            },
            {
              "id": 187786,
              "JobApplicantId": 78515,
              "status": 3,
              "date": "2025-10-28T09:30:00.000Z",
              "createdAt": "2025-10-27T12:03:27.911Z",
              "updatedAt": "2025-10-27T12:03:27.911Z"
            },
            {
              "id": 187636,
              "JobApplicantId": 78515,
              "status": 2,
              "date": "2025-10-26T10:50:26.454Z",
              "createdAt": "2025-10-26T10:50:25.765Z",
              "updatedAt": "2025-10-26T10:50:25.765Z"
            },
            {
              "id": 187285,
              "JobApplicantId": 78515,
              "status": 1,
              "date": "2025-10-25T05:11:05.465Z",
              "createdAt": "2025-10-25T05:11:05.465Z",
              "updatedAt": "2025-10-25T05:11:05.465Z"
            }
          ]
        }
      ],
      "JobLocations": [
        {
          "id": 17799,
          "name": "Remote",
          "JobOpeningId": 6951,
          "createdAt": "2025-10-14T11:30:23.990Z",
          "updatedAt": "2025-10-14T11:30:23.990Z"
        }
      ],
      "JobRole": {
        "id": 1,
        "name": "Frontend Engineer",
        "createdAt": "2023-02-23T11:10:53.498Z",
        "updatedAt": "2023-06-27T12:03:29.887Z"
      },
      "Company": {
        "id": 1673,
        "name": "Excelerate",
        "logo": null,
        "pocName": "asha ",
        "pocNumber": "99999999",
        "pocEmail": "people.empowerment@vempower.org",
        "campusNexaRecommended": null,
        "createdAt": "2025-06-02T10:18:37.561Z",
        "updatedAt": "2025-06-02T10:18:37.561Z",
        "CampusNexaCompanyRefId": null,
        "CreatedById": 54536,
        "CollegeId": 4633
      }
    },
    {
      "id": 7637,
      "companyName": "Excelerate",
      "minCTC": 3,
      "maxCTC": 4,
      "expirationDateTime": "2025-11-12T13:30:00.000Z",
      "description": "<h1>job role is full stack</h1><h1>7 sharpnerian already working</h1><h1>Dubai based company</h1><h1>Work form home</h1><h1>CTC would be based on interview totally ranging between 3-4LPA for the candidates who have internship experince for atleast 6 months</h1><h1>6 months of internship experince would required.</h1>",
      "newDescription": {
        "type": "doc",
        "content": [
          {
            "type": "heading",
            "attrs": {
              "level": 1,
              "textAlign": null
            },
            "content": [
              {
                "text": "job role is full stack",
                "type": "text"
              }
            ]
          },
          {
            "type": "heading",
            "attrs": {
              "level": 1,
              "textAlign": null
            },
            "content": [
              {
                "text": "7 sharpnerian already working",
                "type": "text"
              }
            ]
          },
          {
            "type": "heading",
            "attrs": {
              "level": 1,
              "textAlign": null
            },
            "content": [
              {
                "text": "Dubai based company",
                "type": "text"
              }
            ]
          },
          {
            "type": "heading",
            "attrs": {
              "level": 1,
              "textAlign": null
            },
            "content": [
              {
                "text": "Work form home",
                "type": "text"
              }
            ]
          },
          {
            "type": "heading",
            "attrs": {
              "level": 1,
              "textAlign": null
            },
            "content": [
              {
                "text": "CTC would be based on interview totally ranging between 3-4LPA for the candidates who have internship experince for atleast 6 months",
                "type": "text"
              }
            ]
          },
          {
            "type": "heading",
            "attrs": {
              "level": 1,
              "textAlign": null
            },
            "content": [
              {
                "text": "6 months of internship experince would required.",
                "type": "text"
              }
            ]
          }
        ]
      },
      "alertMessage": null,
      "alertConfirmationMessage": null,
      "JobRoleId": 1,
      "yearsOfExperience": 0,
      "status": 4,
      "closedReasonType": 1,
      "closedReason": "hired",
      "showCompanyToStudents": true,
      "companyPOCEmail": "people.empowerment@vempower.org",
      "isPrivate": false,
      "offersInternship": false,
      "internshipDuration": 0,
      "internshipStipend": 0,
      "isAlumniJob": false,
      "isProCompany": false,
      "isJobPortal": false,
      "jobTags": null,
      "jobRedirectionLink": null,
      "category": null,
      "domain": null,
      "size": null,
      "bootstrappedOrFunded": null,
      "revenue": null,
      "source": null,
      "createdAt": "2025-11-10T13:30:19.412Z",
      "updatedAt": "2025-12-09T12:56:03.343Z",
      "CompanyId": 1673,
      "CollegeId": 4633,
      "JobApplicants": [
        {
          "id": 79698,
          "UserId": 57312,
          "JobOpeningId": 7637,
          "status": 9,
          "interviewDate": null,
          "ctcOffered": null,
          "yoe": null,
          "rejectionReason": null,
          "createdAt": "2025-11-11T10:59:53.941Z",
          "updatedAt": "2025-12-09T12:56:03.321Z",
          "JobApplicantStatuses": [
            {
              "id": 195014,
              "JobApplicantId": 79698,
              "status": 9,
              "date": "2025-12-09T12:56:03.320Z",
              "createdAt": "2025-12-09T12:56:03.322Z",
              "updatedAt": "2025-12-09T12:56:03.322Z"
            },
            {
              "id": 190246,
              "JobApplicantId": 79698,
              "status": 1,
              "date": "2025-11-11T10:59:53.944Z",
              "createdAt": "2025-11-11T10:59:53.945Z",
              "updatedAt": "2025-11-11T10:59:53.945Z"
            }
          ]
        }
      ],
      "JobLocations": [
        {
          "id": 18043,
          "name": "Remote",
          "JobOpeningId": 7637,
          "createdAt": "2025-11-10T13:30:19.416Z",
          "updatedAt": "2025-11-10T13:30:19.416Z"
        }
      ],
      "JobRole": {
        "id": 1,
        "name": "Frontend Engineer",
        "createdAt": "2023-02-23T11:10:53.498Z",
        "updatedAt": "2023-06-27T12:03:29.887Z"
      },
      "Company": {
        "id": 1673,
        "name": "Excelerate",
        "logo": null,
        "pocName": "asha ",
        "pocNumber": "99999999",
        "pocEmail": "people.empowerment@vempower.org",
        "campusNexaRecommended": null,
        "createdAt": "2025-06-02T10:18:37.561Z",
        "updatedAt": "2025-06-02T10:18:37.561Z",
        "CampusNexaCompanyRefId": null,
        "CreatedById": 54536,
        "CollegeId": 4633
      }
    },
    {
      "id": 7592,
      "companyName": "Confido Landbase",
      "minCTC": 3.5,
      "maxCTC": 6,
      "expirationDateTime": "2025-11-12T08:29:00.000Z",
      "description": "<h2><strong>Full job description</strong></h2><p class=\"\"><strong>About Us:</strong></p><p class=\"\">We are a fast-growing <strong>real estate technology company</strong> revolutionizing how people buy, sell, and invest in property. Our platform combines advanced technology with real-world real estate expertise to deliver seamless experiences for home buyers, investors, agents, and developers.</p><p class=\"\"><strong>Job Summary:</strong></p><p class=\"\">We are looking for a talented and proactive <strong>Full Stack Developer</strong> to join our tech team. You will play a key role in developing robust, scalable, and user-centric web applications tailored for the real estate industry, ranging from property listings to CRM tools, virtual tours, and data-driven dashboards.</p><p class=\"\"><strong>Key Responsibilities:</strong></p><ul><li><p class=\"\">Design, build, and maintain responsive web applications for real estate platforms (property listings, search filters, agent dashboards, etc.).</p></li><li><p class=\"\">Develop and integrate front-end and back-end components for scalable, real-time performance.</p></li><li><p class=\"\">Implement APIs to connect with third-party services such as map integrations (Google Maps), payment gateways, property databases (IDX/MLS), and CRMs.</p></li><li><p class=\"\">Optimize applications for SEO, page speed, and mobile usability.</p></li><li><p class=\"\">Collaborate with designers, product managers, and real estate specialists to iterate on product features.</p></li><li><p class=\"\">Maintain high standards of code quality, testing, and documentation.</p></li></ul><p class=\"\"><strong>Tech Stack (Preferred Experience):</strong></p><ul><li><p class=\"\"><strong>Frontend:</strong> React.js / Next.js, HTML5, CSS3, JavaScript, Tailwind CSS or Bootstrap</p></li><li><p class=\"\"><strong>Backend:</strong> Node.js / Express.js OR Python / Django OR PHP / Laravel</p></li><li><p class=\"\"><strong>Database:</strong> PostgreSQL, MySQL, MongoDB</p></li><li><p class=\"\"><strong>DevOps:</strong> Docker, AWS / GCP, CI/CD pipelines</p></li><li><p class=\"\"><strong>Others:</strong> RESTful APIs, GraphQL, Git, JWT, WebSockets</p></li></ul><p class=\"\"><strong>Qualifications:</strong></p><ul><li><p class=\"\">Bachelor's degree in Computer Science, Engineering, or equivalent work experience.</p></li><li><p class=\"\">2+ years of experience in full-stack web development.</p></li><li><p class=\"\">Experience building products for B2C or B2B platforms, ideally in real estate, marketplaces, or e-commerce.</p></li><li><p class=\"\">Solid understanding of UX principles, clean code, and performance optimization.</p></li><li><p class=\"\">Knowledge of real estate-specific tech (MLS/IDX integration, map APIs, listing platforms) is a <strong>big plus</strong>.</p></li></ul><p class=\"\"><strong>Nice to Have:</strong></p><ul><li><p class=\"\">Familiarity with CRM integrations (e.g., Salesforce, HubSpot).</p></li><li><p class=\"\">Experience in analytics dashboards or real estate data visualization.</p></li><li><p class=\"\">Exposure to mobile app frameworks (e.g., React Native, Flutter).</p></li><li><p class=\"\">Basic understanding of property-related SEO best practices.</p></li></ul><p class=\"\"><strong>What You’ll Get:</strong></p><ul><li><p class=\"\">Work on meaningful, user-impacting tech products in the real estate space.</p></li><li><p class=\"\">Collaborate with a passionate and experienced founding team.</p></li><li><p class=\"\">Flexible work environment.</p></li><li><p class=\"\">Opportunity to innovate in one of the fastest-growing .</p></li></ul>",
      "newDescription": {
        "type": "doc",
        "content": [
          {
            "type": "heading",
            "attrs": {
              "level": 2,
              "textAlign": null
            },
            "content": [
              {
                "text": "Full job description",
                "type": "text",
                "marks": [
                  {
                    "type": "bold"
                  }
                ]
              }
            ]
          },
          {
            "type": "paragraph",
            "attrs": {
              "textAlign": null
            },
            "content": [
              {
                "text": "About Us:",
                "type": "text",
                "marks": [
                  {
                    "type": "bold"
                  }
                ]
              }
            ]
          },
          {
            "type": "paragraph",
            "attrs": {
              "textAlign": null
            },
            "content": [
              {
                "text": "We are a fast-growing ",
                "type": "text"
              },
              {
                "text": "real estate technology company",
                "type": "text",
                "marks": [
                  {
                    "type": "bold"
                  }
                ]
              },
              {
                "text": " revolutionizing how people buy, sell, and invest in property. Our platform combines advanced technology with real-world real estate expertise to deliver seamless experiences for home buyers, investors, agents, and developers.",
                "type": "text"
              }
            ]
          },
          {
            "type": "paragraph",
            "attrs": {
              "textAlign": null
            },
            "content": [
              {
                "text": "Job Summary:",
                "type": "text",
                "marks": [
                  {
                    "type": "bold"
                  }
                ]
              }
            ]
          },
          {
            "type": "paragraph",
            "attrs": {
              "textAlign": null
            },
            "content": [
              {
                "text": "We are looking for a talented and proactive ",
                "type": "text"
              },
              {
                "text": "Full Stack Developer",
                "type": "text",
                "marks": [
                  {
                    "type": "bold"
                  }
                ]
              },
              {
                "text": " to join our tech team. You will play a key role in developing robust, scalable, and user-centric web applications tailored for the real estate industry, ranging from property listings to CRM tools, virtual tours, and data-driven dashboards.",
                "type": "text"
              }
            ]
          },
          {
            "type": "paragraph",
            "attrs": {
              "textAlign": null
            },
            "content": [
              {
                "text": "Key Responsibilities:",
                "type": "text",
                "marks": [
                  {
                    "type": "bold"
                  }
                ]
              }
            ]
          },
          {
            "type": "bulletList",
            "content": [
              {
                "type": "listItem",
                "content": [
                  {
                    "type": "paragraph",
                    "attrs": {
                      "textAlign": null
                    },
                    "content": [
                      {
                        "text": "Design, build, and maintain responsive web applications for real estate platforms (property listings, search filters, agent dashboards, etc.).",
                        "type": "text"
                      }
                    ]
                  }
                ]
              },
              {
                "type": "listItem",
                "content": [
                  {
                    "type": "paragraph",
                    "attrs": {
                      "textAlign": null
                    },
                    "content": [
                      {
                        "text": "Develop and integrate front-end and back-end components for scalable, real-time performance.",
                        "type": "text"
                      }
                    ]
                  }
                ]
              },
              {
                "type": "listItem",
                "content": [
                  {
                    "type": "paragraph",
                    "attrs": {
                      "textAlign": null
                    },
                    "content": [
                      {
                        "text": "Implement APIs to connect with third-party services such as map integrations (Google Maps), payment gateways, property databases (IDX/MLS), and CRMs.",
                        "type": "text"
                      }
                    ]
                  }
                ]
              },
              {
                "type": "listItem",
                "content": [
                  {
                    "type": "paragraph",
                    "attrs": {
                      "textAlign": null
                    },
                    "content": [
                      {
                        "text": "Optimize applications for SEO, page speed, and mobile usability.",
                        "type": "text"
                      }
                    ]
                  }
                ]
              },
              {
                "type": "listItem",
                "content": [
                  {
                    "type": "paragraph",
                    "attrs": {
                      "textAlign": null
                    },
                    "content": [
                      {
                        "text": "Collaborate with designers, product managers, and real estate specialists to iterate on product features.",
                        "type": "text"
                      }
                    ]
                  }
                ]
              },
              {
                "type": "listItem",
                "content": [
                  {
                    "type": "paragraph",
                    "attrs": {
                      "textAlign": null
                    },
                    "content": [
                      {
                        "text": "Maintain high standards of code quality, testing, and documentation.",
                        "type": "text"
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            "type": "paragraph",
            "attrs": {
              "textAlign": null
            },
            "content": [
              {
                "text": "Tech Stack (Preferred Experience):",
                "type": "text",
                "marks": [
                  {
                    "type": "bold"
                  }
                ]
              }
            ]
          },
          {
            "type": "bulletList",
            "content": [
              {
                "type": "listItem",
                "content": [
                  {
                    "type": "paragraph",
                    "attrs": {
                      "textAlign": null
                    },
                    "content": [
                      {
                        "text": "Frontend:",
                        "type": "text",
                        "marks": [
                          {
                            "type": "bold"
                          }
                        ]
                      },
                      {
                        "text": " React.js / Next.js, HTML5, CSS3, JavaScript, Tailwind CSS or Bootstrap",
                        "type": "text"
                      }
                    ]
                  }
                ]
              },
              {
                "type": "listItem",
                "content": [
                  {
                    "type": "paragraph",
                    "attrs": {
                      "textAlign": null
                    },
                    "content": [
                      {
                        "text": "Backend:",
                        "type": "text",
                        "marks": [
                          {
                            "type": "bold"
                          }
                        ]
                      },
                      {
                        "text": " Node.js / Express.js OR Python / Django OR PHP / Laravel",
                        "type": "text"
                      }
                    ]
                  }
                ]
              },
              {
                "type": "listItem",
                "content": [
                  {
                    "type": "paragraph",
                    "attrs": {
                      "textAlign": null
                    },
                    "content": [
                      {
                        "text": "Database:",
                        "type": "text",
                        "marks": [
                          {
                            "type": "bold"
                          }
                        ]
                      },
                      {
                        "text": " PostgreSQL, MySQL, MongoDB",
                        "type": "text"
                      }
                    ]
                  }
                ]
              },
              {
                "type": "listItem",
                "content": [
                  {
                    "type": "paragraph",
                    "attrs": {
                      "textAlign": null
                    },
                    "content": [
                      {
                        "text": "DevOps:",
                        "type": "text",
                        "marks": [
                          {
                            "type": "bold"
                          }
                        ]
                      },
                      {
                        "text": " Docker, AWS / GCP, CI/CD pipelines",
                        "type": "text"
                      }
                    ]
                  }
                ]
              },
              {
                "type": "listItem",
                "content": [
                  {
                    "type": "paragraph",
                    "attrs": {
                      "textAlign": null
                    },
                    "content": [
                      {
                        "text": "Others:",
                        "type": "text",
                        "marks": [
                          {
                            "type": "bold"
                          }
                        ]
                      },
                      {
                        "text": " RESTful APIs, GraphQL, Git, JWT, WebSockets",
                        "type": "text"
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            "type": "paragraph",
            "attrs": {
              "textAlign": null
            },
            "content": [
              {
                "text": "Qualifications:",
                "type": "text",
                "marks": [
                  {
                    "type": "bold"
                  }
                ]
              }
            ]
          },
          {
            "type": "bulletList",
            "content": [
              {
                "type": "listItem",
                "content": [
                  {
                    "type": "paragraph",
                    "attrs": {
                      "textAlign": null
                    },
                    "content": [
                      {
                        "text": "Bachelor's degree in Computer Science, Engineering, or equivalent work experience.",
                        "type": "text"
                      }
                    ]
                  }
                ]
              },
              {
                "type": "listItem",
                "content": [
                  {
                    "type": "paragraph",
                    "attrs": {
                      "textAlign": null
                    },
                    "content": [
                      {
                        "text": "2+ years of experience in full-stack web development.",
                        "type": "text"
                      }
                    ]
                  }
                ]
              },
              {
                "type": "listItem",
                "content": [
                  {
                    "type": "paragraph",
                    "attrs": {
                      "textAlign": null
                    },
                    "content": [
                      {
                        "text": "Experience building products for B2C or B2B platforms, ideally in real estate, marketplaces, or e-commerce.",
                        "type": "text"
                      }
                    ]
                  }
                ]
              },
              {
                "type": "listItem",
                "content": [
                  {
                    "type": "paragraph",
                    "attrs": {
                      "textAlign": null
                    },
                    "content": [
                      {
                        "text": "Solid understanding of UX principles, clean code, and performance optimization.",
                        "type": "text"
                      }
                    ]
                  }
                ]
              },
              {
                "type": "listItem",
                "content": [
                  {
                    "type": "paragraph",
                    "attrs": {
                      "textAlign": null
                    },
                    "content": [
                      {
                        "text": "Knowledge of real estate-specific tech (MLS/IDX integration, map APIs, listing platforms) is a ",
                        "type": "text"
                      },
                      {
                        "text": "big plus",
                        "type": "text",
                        "marks": [
                          {
                            "type": "bold"
                          }
                        ]
                      },
                      {
                        "text": ".",
                        "type": "text"
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            "type": "paragraph",
            "attrs": {
              "textAlign": null
            },
            "content": [
              {
                "text": "Nice to Have:",
                "type": "text",
                "marks": [
                  {
                    "type": "bold"
                  }
                ]
              }
            ]
          },
          {
            "type": "bulletList",
            "content": [
              {
                "type": "listItem",
                "content": [
                  {
                    "type": "paragraph",
                    "attrs": {
                      "textAlign": null
                    },
                    "content": [
                      {
                        "text": "Familiarity with CRM integrations (e.g., Salesforce, HubSpot).",
                        "type": "text"
                      }
                    ]
                  }
                ]
              },
              {
                "type": "listItem",
                "content": [
                  {
                    "type": "paragraph",
                    "attrs": {
                      "textAlign": null
                    },
                    "content": [
                      {
                        "text": "Experience in analytics dashboards or real estate data visualization.",
                        "type": "text"
                      }
                    ]
                  }
                ]
              },
              {
                "type": "listItem",
                "content": [
                  {
                    "type": "paragraph",
                    "attrs": {
                      "textAlign": null
                    },
                    "content": [
                      {
                        "text": "Exposure to mobile app frameworks (e.g., React Native, Flutter).",
                        "type": "text"
                      }
                    ]
                  }
                ]
              },
              {
                "type": "listItem",
                "content": [
                  {
                    "type": "paragraph",
                    "attrs": {
                      "textAlign": null
                    },
                    "content": [
                      {
                        "text": "Basic understanding of property-related SEO best practices.",
                        "type": "text"
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            "type": "paragraph",
            "attrs": {
              "textAlign": null
            },
            "content": [
              {
                "text": "What You’ll Get:",
                "type": "text",
                "marks": [
                  {
                    "type": "bold"
                  }
                ]
              }
            ]
          },
          {
            "type": "bulletList",
            "content": [
              {
                "type": "listItem",
                "content": [
                  {
                    "type": "paragraph",
                    "attrs": {
                      "textAlign": null
                    },
                    "content": [
                      {
                        "text": "Work on meaningful, user-impacting tech products in the real estate space.",
                        "type": "text"
                      }
                    ]
                  }
                ]
              },
              {
                "type": "listItem",
                "content": [
                  {
                    "type": "paragraph",
                    "attrs": {
                      "textAlign": null
                    },
                    "content": [
                      {
                        "text": "Collaborate with a passionate and experienced founding team.",
                        "type": "text"
                      }
                    ]
                  }
                ]
              },
              {
                "type": "listItem",
                "content": [
                  {
                    "type": "paragraph",
                    "attrs": {
                      "textAlign": null
                    },
                    "content": [
                      {
                        "text": "Flexible work environment.",
                        "type": "text"
                      }
                    ]
                  }
                ]
              },
              {
                "type": "listItem",
                "content": [
                  {
                    "type": "paragraph",
                    "attrs": {
                      "textAlign": null
                    },
                    "content": [
                      {
                        "text": "Opportunity to innovate in one of the fastest-growing .",
                        "type": "text"
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      },
      "alertMessage": null,
      "alertConfirmationMessage": null,
      "JobRoleId": 1,
      "yearsOfExperience": 0,
      "status": 4,
      "closedReasonType": 3,
      "closedReason": "z",
      "showCompanyToStudents": true,
      "companyPOCEmail": "shreyvirmani@confidolandbase.in",
      "isPrivate": false,
      "offersInternship": false,
      "internshipDuration": 0,
      "internshipStipend": 0,
      "isAlumniJob": false,
      "isProCompany": false,
      "isJobPortal": false,
      "jobTags": null,
      "jobRedirectionLink": null,
      "category": "Service",
      "domain": null,
      "size": "Startup (<100)",
      "bootstrappedOrFunded": "Bootstrapped",
      "revenue": null,
      "source": "LinkedIn",
      "createdAt": "2025-11-03T12:17:42.683Z",
      "updatedAt": "2025-11-24T11:12:02.010Z",
      "CompanyId": 2133,
      "CollegeId": 4633,
      "JobApplicants": [
        {
          "id": 79208,
          "UserId": 57312,
          "JobOpeningId": 7592,
          "status": 9,
          "interviewDate": null,
          "ctcOffered": null,
          "yoe": null,
          "rejectionReason": null,
          "createdAt": "2025-11-04T17:04:30.252Z",
          "updatedAt": "2025-11-24T11:12:01.994Z",
          "JobApplicantStatuses": [
            {
              "id": 192088,
              "JobApplicantId": 79208,
              "status": 9,
              "date": "2025-11-24T11:12:01.993Z",
              "createdAt": "2025-11-24T11:12:01.994Z",
              "updatedAt": "2025-11-24T11:12:01.994Z"
            },
            {
              "id": 190208,
              "JobApplicantId": 79208,
              "status": 2,
              "date": "2025-11-11T07:19:05.441Z",
              "createdAt": "2025-11-11T07:19:05.953Z",
              "updatedAt": "2025-11-11T07:19:05.953Z"
            },
            {
              "id": 189146,
              "JobApplicantId": 79208,
              "status": 1,
              "date": "2025-11-04T17:04:30.255Z",
              "createdAt": "2025-11-04T17:04:30.255Z",
              "updatedAt": "2025-11-04T17:04:30.255Z"
            }
          ]
        }
      ],
      "JobLocations": [
        {
          "id": 17976,
          "name": "Gurgaon",
          "JobOpeningId": 7592,
          "createdAt": "2025-11-04T09:41:34.892Z",
          "updatedAt": "2025-11-04T09:41:34.892Z"
        }
      ],
      "JobRole": {
        "id": 1,
        "name": "Frontend Engineer",
        "createdAt": "2023-02-23T11:10:53.498Z",
        "updatedAt": "2023-06-27T12:03:29.887Z"
      },
      "Company": {
        "id": 2133,
        "name": "Confido Landbase",
        "logo": "https://sharpener.blob.core.windows.net/companylogos/confido.jfif",
        "pocName": "Shrey Virmani",
        "pocNumber": "7838415551",
        "pocEmail": "shreyvirmani@confidolandbase.in",
        "campusNexaRecommended": null,
        "createdAt": "2025-11-03T12:12:33.720Z",
        "updatedAt": "2025-11-03T12:13:08.559Z",
        "CampusNexaCompanyRefId": null,
        "CreatedById": 31491,
        "CollegeId": 4633
      }
    },
    {
      "id": 7585,
      "companyName": "Webtrix Solutions",
      "minCTC": 3,
      "maxCTC": 3,
      "expirationDateTime": "2025-11-06T06:46:00.000Z",
      "description": "<ul><li><p class=\"\">Basic understanding of <strong>HTML5, CSS3, JavaScript (ES6+), and React.js</strong>.</p></li><li><p class=\"\">Familiarity with <strong>REST APIs</strong> and <strong>JSON</strong>.</p></li><li><p class=\"\">Knowledge of version control systems like <strong>Git</strong></p></li></ul>",
      "newDescription": {
        "type": "doc",
        "content": [
          {
            "type": "bulletList",
            "content": [
              {
                "type": "listItem",
                "content": [
                  {
                    "type": "paragraph",
                    "attrs": {
                      "textAlign": null
                    },
                    "content": [
                      {
                        "text": "Basic understanding of ",
                        "type": "text"
                      },
                      {
                        "text": "HTML5, CSS3, JavaScript (ES6+), and React.js",
                        "type": "text",
                        "marks": [
                          {
                            "type": "bold"
                          }
                        ]
                      },
                      {
                        "text": ".",
                        "type": "text"
                      }
                    ]
                  }
                ]
              },
              {
                "type": "listItem",
                "content": [
                  {
                    "type": "paragraph",
                    "attrs": {
                      "textAlign": null
                    },
                    "content": [
                      {
                        "text": "Familiarity with ",
                        "type": "text"
                      },
                      {
                        "text": "REST APIs",
                        "type": "text",
                        "marks": [
                          {
                            "type": "bold"
                          }
                        ]
                      },
                      {
                        "text": " and ",
                        "type": "text"
                      },
                      {
                        "text": "JSON",
                        "type": "text",
                        "marks": [
                          {
                            "type": "bold"
                          }
                        ]
                      },
                      {
                        "text": ".",
                        "type": "text"
                      }
                    ]
                  }
                ]
              },
              {
                "type": "listItem",
                "content": [
                  {
                    "type": "paragraph",
                    "attrs": {
                      "textAlign": null
                    },
                    "content": [
                      {
                        "text": "Knowledge of version control systems like ",
                        "type": "text"
                      },
                      {
                        "text": "Git",
                        "type": "text",
                        "marks": [
                          {
                            "type": "bold"
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      },
      "alertMessage": null,
      "alertConfirmationMessage": null,
      "JobRoleId": 1,
      "yearsOfExperience": 0,
      "status": 4,
      "closedReasonType": 3,
      "closedReason": "dnst",
      "showCompanyToStudents": true,
      "companyPOCEmail": "mayuri.malave@webtrixsolutions.com",
      "isPrivate": false,
      "offersInternship": false,
      "internshipDuration": 0,
      "internshipStipend": 0,
      "isAlumniJob": false,
      "isProCompany": false,
      "isJobPortal": false,
      "jobTags": null,
      "jobRedirectionLink": null,
      "category": null,
      "domain": null,
      "size": null,
      "bootstrappedOrFunded": null,
      "revenue": null,
      "source": null,
      "createdAt": "2025-10-31T07:00:20.086Z",
      "updatedAt": "2025-12-02T13:46:59.649Z",
      "CompanyId": 2127,
      "CollegeId": 4633,
      "JobApplicants": [
        {
          "id": 79259,
          "UserId": 57312,
          "JobOpeningId": 7585,
          "status": 9,
          "interviewDate": null,
          "ctcOffered": null,
          "yoe": null,
          "rejectionReason": null,
          "createdAt": "2025-11-05T08:37:58.457Z",
          "updatedAt": "2025-12-02T13:46:59.628Z",
          "JobApplicantStatuses": [
            {
              "id": 193821,
              "JobApplicantId": 79259,
              "status": 9,
              "date": "2025-12-02T13:46:59.628Z",
              "createdAt": "2025-12-02T13:46:59.629Z",
              "updatedAt": "2025-12-02T13:46:59.629Z"
            },
            {
              "id": 189237,
              "JobApplicantId": 79259,
              "status": 1,
              "date": "2025-11-05T08:37:58.461Z",
              "createdAt": "2025-11-05T08:37:58.461Z",
              "updatedAt": "2025-11-05T08:37:58.461Z"
            }
          ]
        }
      ],
      "JobLocations": [
        {
          "id": 17951,
          "name": "Pune",
          "JobOpeningId": 7585,
          "createdAt": "2025-10-31T07:00:20.093Z",
          "updatedAt": "2025-10-31T07:00:20.093Z"
        }
      ],
      "JobRole": {
        "id": 1,
        "name": "Frontend Engineer",
        "createdAt": "2023-02-23T11:10:53.498Z",
        "updatedAt": "2023-06-27T12:03:29.887Z"
      },
      "Company": {
        "id": 2127,
        "name": "Webtrix Solutions",
        "logo": "https://sharpener.blob.core.windows.net/companylogos/1630653082291.jpeg",
        "pocName": "Mayuri ",
        "pocNumber": "9834240891",
        "pocEmail": "mayuri.malave@webtrixsolutions.com",
        "campusNexaRecommended": null,
        "createdAt": "2025-10-31T06:58:26.033Z",
        "updatedAt": "2025-10-31T06:58:26.033Z",
        "CampusNexaCompanyRefId": null,
        "CreatedById": 46492,
        "CollegeId": 4633
      }
    },
    {
      "id": 7595,
      "companyName": "Diagnal Technologies ",
      "minCTC": 4,
      "maxCTC": 5,
      "expirationDateTime": "2025-11-05T04:30:00.000Z",
      "description": "<h1>Job role is full stack </h1><h1>job loaction is trivandrum </h1>",
      "newDescription": {
        "type": "doc",
        "content": [
          {
            "type": "heading",
            "attrs": {
              "level": 1,
              "textAlign": null
            },
            "content": [
              {
                "text": "Job role is full stack ",
                "type": "text"
              }
            ]
          },
          {
            "type": "heading",
            "attrs": {
              "level": 1,
              "textAlign": null
            },
            "content": [
              {
                "text": "job loaction is trivandrum ",
                "type": "text"
              }
            ]
          }
        ]
      },
      "alertMessage": null,
      "alertConfirmationMessage": null,
      "JobRoleId": 1,
      "yearsOfExperience": 0,
      "status": 4,
      "closedReasonType": 3,
      "closedReason": "did not shortlist",
      "showCompanyToStudents": true,
      "companyPOCEmail": "hr@diagnaltech.com",
      "isPrivate": false,
      "offersInternship": false,
      "internshipDuration": 0,
      "internshipStipend": 0,
      "isAlumniJob": false,
      "isProCompany": false,
      "isJobPortal": false,
      "jobTags": null,
      "jobRedirectionLink": null,
      "category": "Service",
      "domain": "Software Services",
      "size": "Mid size (100-500)",
      "bootstrappedOrFunded": null,
      "revenue": "19.9 cr",
      "source": "Indeed",
      "createdAt": "2025-11-04T06:59:23.356Z",
      "updatedAt": "2026-01-05T08:58:28.541Z",
      "CompanyId": 2135,
      "CollegeId": 4633,
      "JobApplicants": [
        {
          "id": 79209,
          "UserId": 57312,
          "JobOpeningId": 7595,
          "status": 9,
          "interviewDate": null,
          "ctcOffered": null,
          "yoe": null,
          "rejectionReason": null,
          "createdAt": "2025-11-04T17:05:56.683Z",
          "updatedAt": "2026-01-05T08:58:28.530Z",
          "JobApplicantStatuses": [
            {
              "id": 197065,
              "JobApplicantId": 79209,
              "status": 9,
              "date": "2026-01-05T08:58:28.530Z",
              "createdAt": "2026-01-05T08:58:28.531Z",
              "updatedAt": "2026-01-05T08:58:28.531Z"
            },
            {
              "id": 189194,
              "JobApplicantId": 79209,
              "status": 2,
              "date": "2025-11-05T05:38:53.436Z",
              "createdAt": "2025-11-05T05:38:53.709Z",
              "updatedAt": "2025-11-05T05:38:53.709Z"
            },
            {
              "id": 189147,
              "JobApplicantId": 79209,
              "status": 1,
              "date": "2025-11-04T17:05:56.687Z",
              "createdAt": "2025-11-04T17:05:56.687Z",
              "updatedAt": "2025-11-04T17:05:56.687Z"
            }
          ]
        }
      ],
      "JobLocations": [
        {
          "id": 17970,
          "name": "Kerala",
          "JobOpeningId": 7595,
          "createdAt": "2025-11-04T06:59:23.362Z",
          "updatedAt": "2025-11-04T06:59:23.362Z"
        }
      ],
      "JobRole": {
        "id": 1,
        "name": "Frontend Engineer",
        "createdAt": "2023-02-23T11:10:53.498Z",
        "updatedAt": "2023-06-27T12:03:29.887Z"
      },
      "Company": {
        "id": 2135,
        "name": "Diagnal Technologies ",
        "logo": "https://sharpener.blob.core.windows.net/companylogos/diagnal_logo.jpg",
        "pocName": "Ananjay ",
        "pocNumber": "963 395 1117",
        "pocEmail": "hr@diagnaltech.com",
        "campusNexaRecommended": null,
        "createdAt": "2025-11-04T06:55:45.972Z",
        "updatedAt": "2025-11-04T06:55:45.972Z",
        "CampusNexaCompanyRefId": null,
        "CreatedById": 54536,
        "CollegeId": 4633
      }
    },
    {
      "id": 7557,
      "companyName": "Rightfit",
      "minCTC": 5,
      "maxCTC": 10,
      "expirationDateTime": "2025-10-30T07:57:00.000Z",
      "description": "<p class=\"\">5-6 l.p.a for 6 months mern stack exp candidates and 6-10 l.p.a for 1-2 years mern stack candidate</p>",
      "newDescription": {
        "type": "doc",
        "content": [
          {
            "type": "paragraph",
            "attrs": {
              "textAlign": null
            },
            "content": [
              {
                "text": "5-6 l.p.a for 6 months mern stack exp candidates and 6-10 l.p.a for 1-2 years mern stack candidate",
                "type": "text"
              }
            ]
          }
        ]
      },
      "alertMessage": null,
      "alertConfirmationMessage": null,
      "JobRoleId": 1,
      "yearsOfExperience": 0,
      "status": 4,
      "closedReasonType": 3,
      "closedReason": "dntst",
      "showCompanyToStudents": true,
      "companyPOCEmail": "sumit@rightfit.so",
      "isPrivate": false,
      "offersInternship": false,
      "internshipDuration": 0,
      "internshipStipend": 0,
      "isAlumniJob": false,
      "isProCompany": false,
      "isJobPortal": false,
      "jobTags": null,
      "jobRedirectionLink": null,
      "category": null,
      "domain": null,
      "size": null,
      "bootstrappedOrFunded": null,
      "revenue": null,
      "source": null,
      "createdAt": "2025-10-27T07:56:20.853Z",
      "updatedAt": "2025-11-03T06:28:36.053Z",
      "CompanyId": 1986,
      "CollegeId": 4633,
      "JobApplicants": [
        {
          "id": 78623,
          "UserId": 57312,
          "JobOpeningId": 7557,
          "status": 9,
          "interviewDate": null,
          "ctcOffered": null,
          "yoe": null,
          "rejectionReason": null,
          "createdAt": "2025-10-28T05:00:42.502Z",
          "updatedAt": "2025-11-03T06:28:36.009Z",
          "JobApplicantStatuses": [
            {
              "id": 188718,
              "JobApplicantId": 78623,
              "status": 9,
              "date": "2025-11-03T06:28:36.008Z",
              "createdAt": "2025-11-03T06:28:36.009Z",
              "updatedAt": "2025-11-03T06:28:36.009Z"
            },
            {
              "id": 187821,
              "JobApplicantId": 78623,
              "status": 1,
              "date": "2025-10-28T05:00:42.506Z",
              "createdAt": "2025-10-28T05:00:42.506Z",
              "updatedAt": "2025-10-28T05:00:42.506Z"
            }
          ]
        }
      ],
      "JobLocations": [
        {
          "id": 17889,
          "name": "Bangalore",
          "JobOpeningId": 7557,
          "createdAt": "2025-10-27T07:57:14.351Z",
          "updatedAt": "2025-10-27T07:57:14.351Z"
        }
      ],
      "JobRole": {
        "id": 1,
        "name": "Frontend Engineer",
        "createdAt": "2023-02-23T11:10:53.498Z",
        "updatedAt": "2023-06-27T12:03:29.887Z"
      },
      "Company": {
        "id": 1986,
        "name": "Rightfit",
        "logo": null,
        "pocName": "Sumit Singh",
        "pocNumber": "wh0sumit.work@gmail.com",
        "pocEmail": "81032 41455",
        "campusNexaRecommended": null,
        "createdAt": "2025-09-08T04:04:52.030Z",
        "updatedAt": "2025-09-08T04:04:52.030Z",
        "CampusNexaCompanyRefId": null,
        "CreatedById": 46492,
        "CollegeId": 4633
      }
    },
    {
      "id": 6796,
      "companyName": "Teal India",
      "minCTC": 9,
      "maxCTC": 12,
      "expirationDateTime": "2025-10-26T11:12:00.000Z",
      "description": "<h2>Full stack - REACT , NODE , JAVASCRIPT , MONGO DB , NEXT JS , EXPRESS JS &amp; TYPESCRIPT <br></h2>",
      "newDescription": {
        "type": "doc",
        "content": [
          {
            "type": "heading",
            "attrs": {
              "level": 2,
              "textAlign": null
            },
            "content": [
              {
                "text": "Full stack - REACT , NODE , JAVASCRIPT , MONGO DB , NEXT JS , EXPRESS JS & TYPESCRIPT ",
                "type": "text"
              },
              {
                "type": "hardBreak"
              }
            ]
          }
        ]
      },
      "alertMessage": null,
      "alertConfirmationMessage": null,
      "JobRoleId": 1,
      "yearsOfExperience": 0,
      "status": 4,
      "closedReasonType": 3,
      "closedReason": "nt sst",
      "showCompanyToStudents": true,
      "companyPOCEmail": "shilpa.s@tealindia.in",
      "isPrivate": false,
      "offersInternship": false,
      "internshipDuration": 3,
      "internshipStipend": 25,
      "isAlumniJob": false,
      "isProCompany": true,
      "isJobPortal": false,
      "jobTags": null,
      "jobRedirectionLink": null,
      "category": null,
      "domain": null,
      "size": null,
      "bootstrappedOrFunded": null,
      "revenue": null,
      "source": null,
      "createdAt": "2025-06-10T08:42:40.929Z",
      "updatedAt": "2025-10-30T06:24:57.040Z",
      "CompanyId": 1709,
      "CollegeId": 4633,
      "JobApplicants": [
        {
          "id": 78501,
          "UserId": 57312,
          "JobOpeningId": 6796,
          "status": 9,
          "interviewDate": null,
          "ctcOffered": null,
          "yoe": null,
          "rejectionReason": null,
          "createdAt": "2025-10-24T14:02:29.968Z",
          "updatedAt": "2025-10-30T06:24:56.999Z",
          "JobApplicantStatuses": [
            {
              "id": 188337,
              "JobApplicantId": 78501,
              "status": 9,
              "date": "2025-10-30T06:24:56.999Z",
              "createdAt": "2025-10-30T06:24:57.000Z",
              "updatedAt": "2025-10-30T06:24:57.000Z"
            },
            {
              "id": 187271,
              "JobApplicantId": 78501,
              "status": 1,
              "date": "2025-10-24T14:02:29.972Z",
              "createdAt": "2025-10-24T14:02:29.972Z",
              "updatedAt": "2025-10-24T14:02:29.972Z"
            }
          ]
        }
      ],
      "JobLocations": [
        {
          "id": 17831,
          "name": "Bangalore",
          "JobOpeningId": 6796,
          "createdAt": "2025-10-16T09:29:32.979Z",
          "updatedAt": "2025-10-16T09:29:32.979Z"
        }
      ],
      "JobRole": {
        "id": 1,
        "name": "Frontend Engineer",
        "createdAt": "2023-02-23T11:10:53.498Z",
        "updatedAt": "2023-06-27T12:03:29.887Z"
      },
      "Company": {
        "id": 1709,
        "name": "Teal India",
        "logo": null,
        "pocName": "Shilpa",
        "pocNumber": "9741416105",
        "pocEmail": "shilpa.s@tealindia.in",
        "campusNexaRecommended": null,
        "createdAt": "2025-06-10T08:38:11.489Z",
        "updatedAt": "2025-06-10T08:38:11.489Z",
        "CampusNexaCompanyRefId": null,
        "CreatedById": 46492,
        "CollegeId": 4633
      }
    },
    {
      "id": 7540,
      "companyName": "HuntYourTribe",
      "minCTC": 5,
      "maxCTC": 6,
      "expirationDateTime": "2025-10-25T11:54:00.000Z",
      "description": "<h1>HuntYourTribe is hiring for Coyax .. And looking for Mern Stack developers..-Salary -  50 k .</h1>",
      "newDescription": {
        "type": "doc",
        "content": [
          {
            "type": "heading",
            "attrs": {
              "level": 1,
              "textAlign": null
            },
            "content": [
              {
                "text": "HuntYourTribe is hiring for Coyax .. And looking for Mern Stack developers..-Salary -  50 k .",
                "type": "text"
              }
            ]
          }
        ]
      },
      "alertMessage": null,
      "alertConfirmationMessage": null,
      "JobRoleId": 1,
      "yearsOfExperience": 0,
      "status": 4,
      "closedReasonType": 3,
      "closedReason": "nt st",
      "showCompanyToStudents": true,
      "companyPOCEmail": "ramit@huntyourtribe.com",
      "isPrivate": false,
      "offersInternship": false,
      "internshipDuration": 0,
      "internshipStipend": 0,
      "isAlumniJob": false,
      "isProCompany": false,
      "isJobPortal": false,
      "jobTags": null,
      "jobRedirectionLink": null,
      "category": null,
      "domain": null,
      "size": null,
      "bootstrappedOrFunded": null,
      "revenue": null,
      "source": null,
      "createdAt": "2025-10-17T10:52:57.458Z",
      "updatedAt": "2025-10-30T06:27:10.423Z",
      "CompanyId": 2105,
      "CollegeId": 4633,
      "JobApplicants": [
        {
          "id": 78504,
          "UserId": 57312,
          "JobOpeningId": 7540,
          "status": 9,
          "interviewDate": null,
          "ctcOffered": null,
          "yoe": null,
          "rejectionReason": null,
          "createdAt": "2025-10-24T14:09:36.921Z",
          "updatedAt": "2025-10-30T06:27:10.384Z",
          "JobApplicantStatuses": [
            {
              "id": 188396,
              "JobApplicantId": 78504,
              "status": 9,
              "date": "2025-10-30T06:27:10.384Z",
              "createdAt": "2025-10-30T06:27:10.385Z",
              "updatedAt": "2025-10-30T06:27:10.385Z"
            },
            {
              "id": 187274,
              "JobApplicantId": 78504,
              "status": 1,
              "date": "2025-10-24T14:09:36.925Z",
              "createdAt": "2025-10-24T14:09:36.925Z",
              "updatedAt": "2025-10-24T14:09:36.925Z"
            }
          ]
        }
      ],
      "JobLocations": [
        {
          "id": 17849,
          "name": "Remote",
          "JobOpeningId": 7540,
          "createdAt": "2025-10-17T10:52:57.464Z",
          "updatedAt": "2025-10-17T10:52:57.464Z"
        }
      ],
      "JobRole": {
        "id": 1,
        "name": "Frontend Engineer",
        "createdAt": "2023-02-23T11:10:53.498Z",
        "updatedAt": "2023-06-27T12:03:29.887Z"
      },
      "Company": {
        "id": 2105,
        "name": "HuntYourTribe",
        "logo": null,
        "pocName": "Ramit",
        "pocNumber": "7889770964",
        "pocEmail": "ramit@huntyourtribe.com",
        "campusNexaRecommended": null,
        "createdAt": "2025-10-17T10:44:50.727Z",
        "updatedAt": "2025-10-17T10:44:50.727Z",
        "CampusNexaCompanyRefId": null,
        "CreatedById": 46492,
        "CollegeId": 4633
      }
    },
    {
      "id": 7426,
      "companyName": "Serri",
      "minCTC": 4,
      "maxCTC": 9,
      "expirationDateTime": "2025-10-07T06:57:00.000Z",
      "description": "<h1>FRESHERS  UPTO 6 L.P.A AS PER THE PERFORMANCE AND 9 L.P.A FOR 1 YEAR EXPERIENCED.</h1>",
      "newDescription": {
        "type": "doc",
        "content": [
          {
            "type": "heading",
            "attrs": {
              "level": 1,
              "textAlign": null
            },
            "content": [
              {
                "text": "FRESHERS  UPTO 6 L.P.A AS PER THE PERFORMANCE AND 9 L.P.A FOR 1 YEAR EXPERIENCED.",
                "type": "text"
              }
            ]
          }
        ]
      },
      "alertMessage": null,
      "alertConfirmationMessage": null,
      "JobRoleId": 1,
      "yearsOfExperience": 0,
      "status": 4,
      "closedReasonType": 3,
      "closedReason": "dnst",
      "showCompanyToStudents": true,
      "companyPOCEmail": "wasil@serri.club",
      "isPrivate": false,
      "offersInternship": false,
      "internshipDuration": 0,
      "internshipStipend": 0,
      "isAlumniJob": false,
      "isProCompany": true,
      "isJobPortal": false,
      "jobTags": null,
      "jobRedirectionLink": null,
      "category": null,
      "domain": null,
      "size": null,
      "bootstrappedOrFunded": null,
      "revenue": null,
      "source": null,
      "createdAt": "2025-09-23T11:33:24.178Z",
      "updatedAt": "2025-12-02T13:38:00.816Z",
      "CompanyId": 2040,
      "CollegeId": 4633,
      "JobApplicants": [
        {
          "id": 77087,
          "UserId": 57312,
          "JobOpeningId": 7426,
          "status": 9,
          "interviewDate": null,
          "ctcOffered": null,
          "yoe": null,
          "rejectionReason": null,
          "createdAt": "2025-09-24T19:54:33.332Z",
          "updatedAt": "2025-12-02T13:38:00.768Z",
          "JobApplicantStatuses": [
            {
              "id": 193707,
              "JobApplicantId": 77087,
              "status": 9,
              "date": "2025-12-02T13:38:00.768Z",
              "createdAt": "2025-12-02T13:38:00.769Z",
              "updatedAt": "2025-12-02T13:38:00.769Z"
            },
            {
              "id": 184602,
              "JobApplicantId": 77087,
              "status": 2,
              "date": "2025-09-30T08:23:47.352Z",
              "createdAt": "2025-09-30T08:23:51.776Z",
              "updatedAt": "2025-09-30T08:23:51.776Z"
            },
            {
              "id": 182992,
              "JobApplicantId": 77087,
              "status": 1,
              "date": "2025-09-24T19:54:33.335Z",
              "createdAt": "2025-09-24T19:54:33.336Z",
              "updatedAt": "2025-09-24T19:54:33.336Z"
            }
          ]
        }
      ],
      "JobLocations": [
        {
          "id": 17624,
          "name": "Remote",
          "JobOpeningId": 7426,
          "createdAt": "2025-09-23T11:33:24.183Z",
          "updatedAt": "2025-09-23T11:33:24.183Z"
        }
      ],
      "JobRole": {
        "id": 1,
        "name": "Frontend Engineer",
        "createdAt": "2023-02-23T11:10:53.498Z",
        "updatedAt": "2023-06-27T12:03:29.887Z"
      },
      "Company": {
        "id": 2040,
        "name": "Serri",
        "logo": null,
        "pocName": "Wasil",
        "pocNumber": "8192832589",
        "pocEmail": "wasil@serri.club",
        "campusNexaRecommended": null,
        "createdAt": "2025-09-23T11:31:54.866Z",
        "updatedAt": "2025-09-23T11:31:54.866Z",
        "CampusNexaCompanyRefId": null,
        "CreatedById": 46492,
        "CollegeId": 4633
      }
    },
    {
      "id": 5776,
      "companyName": "Infinity assurance solutions pvt ltd ",
      "minCTC": 3,
      "maxCTC": 5,
      "expirationDateTime": "2025-09-12T07:33:00.000Z",
      "description": "<h1>CTC would be based on Current CTC.</h1><h1>1 +years of experience candidates are required</h1>",
      "newDescription": {
        "type": "doc",
        "content": [
          {
            "type": "heading",
            "attrs": {
              "level": 1,
              "textAlign": null
            },
            "content": [
              {
                "text": "CTC would be based on Current CTC.",
                "type": "text"
              }
            ]
          },
          {
            "type": "heading",
            "attrs": {
              "level": 1,
              "textAlign": null
            },
            "content": [
              {
                "text": "1 +years of experience candidates are required",
                "type": "text"
              }
            ]
          }
        ]
      },
      "alertMessage": null,
      "alertConfirmationMessage": null,
      "JobRoleId": 1,
      "yearsOfExperience": 1,
      "status": 3,
      "closedReasonType": 3,
      "closedReason": "No relevant candidate applied ",
      "showCompanyToStudents": true,
      "companyPOCEmail": "hrteam@infinityassurance.com",
      "isPrivate": false,
      "offersInternship": false,
      "internshipDuration": 0,
      "internshipStipend": 0,
      "isAlumniJob": false,
      "isProCompany": false,
      "isJobPortal": false,
      "jobTags": null,
      "jobRedirectionLink": null,
      "category": null,
      "domain": null,
      "size": null,
      "bootstrappedOrFunded": null,
      "revenue": null,
      "source": null,
      "createdAt": "2025-01-22T07:57:57.108Z",
      "updatedAt": "2025-09-10T07:33:44.378Z",
      "CompanyId": 1186,
      "CollegeId": 4633,
      "JobApplicants": [
        {
          "id": 66504,
          "UserId": 57312,
          "JobOpeningId": 5776,
          "status": 9,
          "interviewDate": null,
          "ctcOffered": null,
          "yoe": null,
          "rejectionReason": null,
          "createdAt": "2025-04-06T12:11:18.973Z",
          "updatedAt": "2025-05-03T10:34:53.311Z",
          "JobApplicantStatuses": [
            {
              "id": 160377,
              "JobApplicantId": 66504,
              "status": 9,
              "date": "2025-05-03T10:34:53.311Z",
              "createdAt": "2025-05-03T10:34:53.311Z",
              "updatedAt": "2025-05-03T10:34:53.311Z"
            },
            {
              "id": 157144,
              "JobApplicantId": 66504,
              "status": 1,
              "date": "2025-04-06T12:11:18.977Z",
              "createdAt": "2025-04-06T12:11:18.977Z",
              "updatedAt": "2025-04-06T12:11:18.977Z"
            }
          ]
        }
      ],
      "JobLocations": [
        {
          "id": 17438,
          "name": "Delhi",
          "JobOpeningId": 5776,
          "createdAt": "2025-09-10T07:33:37.295Z",
          "updatedAt": "2025-09-10T07:33:37.295Z"
        }
      ],
      "JobRole": {
        "id": 1,
        "name": "Frontend Engineer",
        "createdAt": "2023-02-23T11:10:53.498Z",
        "updatedAt": "2023-06-27T12:03:29.887Z"
      },
      "Company": {
        "id": 1186,
        "name": "Infinity assurance solutions pvt ltd ",
        "logo": null,
        "pocName": "Sourav ",
        "pocNumber": "9911244451",
        "pocEmail": "hrteam@infinityassurance.com",
        "campusNexaRecommended": null,
        "createdAt": "2025-01-22T07:54:36.464Z",
        "updatedAt": "2025-01-22T07:54:36.464Z",
        "CampusNexaCompanyRefId": null,
        "CreatedById": 54536,
        "CollegeId": 4633
      }
    },
    {
      "id": 6959,
      "companyName": "Astra Security",
      "minCTC": 4,
      "maxCTC": 8,
      "expirationDateTime": "2025-09-07T05:36:00.000Z",
      "description": "<h1>1 year exp reqd in Next js</h1>",
      "newDescription": {
        "type": "doc",
        "content": [
          {
            "type": "heading",
            "attrs": {
              "level": 1,
              "textAlign": null
            },
            "content": [
              {
                "text": "1 year exp reqd in Next js",
                "type": "text"
              }
            ]
          }
        ]
      },
      "alertMessage": null,
      "alertConfirmationMessage": null,
      "JobRoleId": 1,
      "yearsOfExperience": 1,
      "status": 4,
      "closedReasonType": 2,
      "closedReason": "dn st",
      "showCompanyToStudents": true,
      "companyPOCEmail": "ashish.khare@getastra.com",
      "isPrivate": false,
      "offersInternship": false,
      "internshipDuration": 0,
      "internshipStipend": 0,
      "isAlumniJob": false,
      "isProCompany": false,
      "isJobPortal": false,
      "jobTags": null,
      "jobRedirectionLink": null,
      "category": null,
      "domain": null,
      "size": null,
      "bootstrappedOrFunded": null,
      "revenue": null,
      "source": null,
      "createdAt": "2025-07-02T10:18:21.408Z",
      "updatedAt": "2025-09-30T03:31:25.968Z",
      "CompanyId": 1787,
      "CollegeId": 4633,
      "JobApplicants": [
        {
          "id": 71765,
          "UserId": 57312,
          "JobOpeningId": 6959,
          "status": 9,
          "interviewDate": null,
          "ctcOffered": null,
          "yoe": null,
          "rejectionReason": null,
          "createdAt": "2025-07-02T17:07:45.550Z",
          "updatedAt": "2025-09-30T03:31:25.921Z",
          "JobApplicantStatuses": [
            {
              "id": 184079,
              "JobApplicantId": 71765,
              "status": 9,
              "date": "2025-09-30T03:31:25.920Z",
              "createdAt": "2025-09-30T03:31:25.921Z",
              "updatedAt": "2025-09-30T03:31:25.921Z"
            },
            {
              "id": 170056,
              "JobApplicantId": 71765,
              "status": 1,
              "date": "2025-07-02T17:07:45.554Z",
              "createdAt": "2025-07-02T17:07:45.555Z",
              "updatedAt": "2025-07-02T17:07:45.555Z"
            }
          ]
        }
      ],
      "JobLocations": [
        {
          "id": 17311,
          "name": "Bangalore",
          "JobOpeningId": 6959,
          "createdAt": "2025-09-03T05:37:16.106Z",
          "updatedAt": "2025-09-03T05:37:16.106Z"
        }
      ],
      "JobRole": {
        "id": 1,
        "name": "Frontend Engineer",
        "createdAt": "2023-02-23T11:10:53.498Z",
        "updatedAt": "2023-06-27T12:03:29.887Z"
      },
      "Company": {
        "id": 1787,
        "name": "Astra Security",
        "logo": null,
        "pocName": "Ashish",
        "pocNumber": "8698847989",
        "pocEmail": "ashish.khare@getastra.com",
        "campusNexaRecommended": null,
        "createdAt": "2025-07-02T10:16:57.038Z",
        "updatedAt": "2025-07-02T10:16:57.038Z",
        "CampusNexaCompanyRefId": null,
        "CreatedById": 46492,
        "CollegeId": 4633
      }
    },
    {
      "id": 6188,
      "companyName": "Securepay",
      "minCTC": 5,
      "maxCTC": 7,
      "expirationDateTime": "2025-08-25T08:54:00.000Z",
      "description": "<p class=\"\">Job description:</p><p class=\"\">We are seeking a highly skilled React.js Developer with 2+ years of experience to join our dynamic development team. The ideal candidate should have hands-on experience in building scalable, high-performance web applications and a strong understanding of front-end technologies.</p><p class=\"\">Required Skills &amp; Experience:</p><p class=\"\">Develop, test, and maintain React.js &amp; Next.js applications.</p><p class=\"\">Implement server-side rendering (SSR) and static site generation (SSG) using Next.js.</p><p class=\"\">Optimize applications for performance, scalability, and SEO.</p><p class=\"\">Work with state management tools like Redux, Context API, or Zustand.</p><p class=\"\">Integrate with RESTful APIs, GraphQL, and third-party services.</p><p class=\"\">Ensure cross-browser compatibility and mobile responsiveness.</p><p class=\"\">Work closely with UI/UX designers for an improved user experience.</p><p class=\"\">Debug, troubleshoot, and conduct code reviews.</p><p class=\"\">Follow Agile/Scrum methodologies.</p><p class=\"\">Stay updated with the latest advancements in React.js, Next.js, and front-end technologies.</p><p class=\"\">Required Skills &amp; Experience:</p><p class=\"\">✅ 2+ years of experience in React.js development.</p><p class=\"\">✅ 2+ years of experience with Next.js (SSR, SSG, ISR).</p><p class=\"\">✅ Strong proficiency in JavaScript (ES6+), TypeScript, HTML5, CSS3, SCSS/SASS.</p><p class=\"\">✅ Experience with Redux, Context API, Zustand, or MobX.</p><p class=\"\">✅ Familiarity with React Hooks, React Router, and component lifecycle methods.</p><p class=\"\">✅ Strong understanding of SEO, performance optimization, and accessibility.</p><p class=\"\">✅ Hands-on experience with RESTful APIs, GraphQL (Apollo, URQL), and authentication (JWT, OAuth, Firebase Auth).</p><p class=\"\">✅ Experience with Webpack, Babel, Vite, or similar tools.</p><p class=\"\">✅ Strong debugging skills using Chrome DevTools.</p><p class=\"\">✅ Experience in unit testing with Jest, React Testing Library, or Cypress.</p><p class=\"\">✅ Familiarity with Git/GitHub, CI/CD pipelines, and DevOps concepts.</p><p class=\"\">✅ Good problem-solving skills and attention to detail.</p><p class=\"\">Job Type: Full-time</p><p class=\"\">Benefits:</p><p class=\"\">Food provided</p><p class=\"\">Provident Fund</p><p class=\"\">Work Location: In person</p>",
      "newDescription": {
        "type": "doc",
        "content": [
          {
            "type": "paragraph",
            "attrs": {
              "textAlign": null
            },
            "content": [
              {
                "text": "Job description:",
                "type": "text"
              }
            ]
          },
          {
            "type": "paragraph",
            "attrs": {
              "textAlign": null
            },
            "content": [
              {
                "text": "We are seeking a highly skilled React.js Developer with 2+ years of experience to join our dynamic development team. The ideal candidate should have hands-on experience in building scalable, high-performance web applications and a strong understanding of front-end technologies.",
                "type": "text"
              }
            ]
          },
          {
            "type": "paragraph",
            "attrs": {
              "textAlign": null
            },
            "content": [
              {
                "text": "Required Skills & Experience:",
                "type": "text"
              }
            ]
          },
          {
            "type": "paragraph",
            "attrs": {
              "textAlign": null
            },
            "content": [
              {
                "text": "Develop, test, and maintain React.js & Next.js applications.",
                "type": "text"
              }
            ]
          },
          {
            "type": "paragraph",
            "attrs": {
              "textAlign": null
            },
            "content": [
              {
                "text": "Implement server-side rendering (SSR) and static site generation (SSG) using Next.js.",
                "type": "text"
              }
            ]
          },
          {
            "type": "paragraph",
            "attrs": {
              "textAlign": null
            },
            "content": [
              {
                "text": "Optimize applications for performance, scalability, and SEO.",
                "type": "text"
              }
            ]
          },
          {
            "type": "paragraph",
            "attrs": {
              "textAlign": null
            },
            "content": [
              {
                "text": "Work with state management tools like Redux, Context API, or Zustand.",
                "type": "text"
              }
            ]
          },
          {
            "type": "paragraph",
            "attrs": {
              "textAlign": null
            },
            "content": [
              {
                "text": "Integrate with RESTful APIs, GraphQL, and third-party services.",
                "type": "text"
              }
            ]
          },
          {
            "type": "paragraph",
            "attrs": {
              "textAlign": null
            },
            "content": [
              {
                "text": "Ensure cross-browser compatibility and mobile responsiveness.",
                "type": "text"
              }
            ]
          },
          {
            "type": "paragraph",
            "attrs": {
              "textAlign": null
            },
            "content": [
              {
                "text": "Work closely with UI/UX designers for an improved user experience.",
                "type": "text"
              }
            ]
          },
          {
            "type": "paragraph",
            "attrs": {
              "textAlign": null
            },
            "content": [
              {
                "text": "Debug, troubleshoot, and conduct code reviews.",
                "type": "text"
              }
            ]
          },
          {
            "type": "paragraph",
            "attrs": {
              "textAlign": null
            },
            "content": [
              {
                "text": "Follow Agile/Scrum methodologies.",
                "type": "text"
              }
            ]
          },
          {
            "type": "paragraph",
            "attrs": {
              "textAlign": null
            },
            "content": [
              {
                "text": "Stay updated with the latest advancements in React.js, Next.js, and front-end technologies.",
                "type": "text"
              }
            ]
          },
          {
            "type": "paragraph",
            "attrs": {
              "textAlign": null
            },
            "content": [
              {
                "text": "Required Skills & Experience:",
                "type": "text"
              }
            ]
          },
          {
            "type": "paragraph",
            "attrs": {
              "textAlign": null
            },
            "content": [
              {
                "text": "✅ 2+ years of experience in React.js development.",
                "type": "text"
              }
            ]
          },
          {
            "type": "paragraph",
            "attrs": {
              "textAlign": null
            },
            "content": [
              {
                "text": "✅ 2+ years of experience with Next.js (SSR, SSG, ISR).",
                "type": "text"
              }
            ]
          },
          {
            "type": "paragraph",
            "attrs": {
              "textAlign": null
            },
            "content": [
              {
                "text": "✅ Strong proficiency in JavaScript (ES6+), TypeScript, HTML5, CSS3, SCSS/SASS.",
                "type": "text"
              }
            ]
          },
          {
            "type": "paragraph",
            "attrs": {
              "textAlign": null
            },
            "content": [
              {
                "text": "✅ Experience with Redux, Context API, Zustand, or MobX.",
                "type": "text"
              }
            ]
          },
          {
            "type": "paragraph",
            "attrs": {
              "textAlign": null
            },
            "content": [
              {
                "text": "✅ Familiarity with React Hooks, React Router, and component lifecycle methods.",
                "type": "text"
              }
            ]
          },
          {
            "type": "paragraph",
            "attrs": {
              "textAlign": null
            },
            "content": [
              {
                "text": "✅ Strong understanding of SEO, performance optimization, and accessibility.",
                "type": "text"
              }
            ]
          },
          {
            "type": "paragraph",
            "attrs": {
              "textAlign": null
            },
            "content": [
              {
                "text": "✅ Hands-on experience with RESTful APIs, GraphQL (Apollo, URQL), and authentication (JWT, OAuth, Firebase Auth).",
                "type": "text"
              }
            ]
          },
          {
            "type": "paragraph",
            "attrs": {
              "textAlign": null
            },
            "content": [
              {
                "text": "✅ Experience with Webpack, Babel, Vite, or similar tools.",
                "type": "text"
              }
            ]
          },
          {
            "type": "paragraph",
            "attrs": {
              "textAlign": null
            },
            "content": [
              {
                "text": "✅ Strong debugging skills using Chrome DevTools.",
                "type": "text"
              }
            ]
          },
          {
            "type": "paragraph",
            "attrs": {
              "textAlign": null
            },
            "content": [
              {
                "text": "✅ Experience in unit testing with Jest, React Testing Library, or Cypress.",
                "type": "text"
              }
            ]
          },
          {
            "type": "paragraph",
            "attrs": {
              "textAlign": null
            },
            "content": [
              {
                "text": "✅ Familiarity with Git/GitHub, CI/CD pipelines, and DevOps concepts.",
                "type": "text"
              }
            ]
          },
          {
            "type": "paragraph",
            "attrs": {
              "textAlign": null
            },
            "content": [
              {
                "text": "✅ Good problem-solving skills and attention to detail.",
                "type": "text"
              }
            ]
          },
          {
            "type": "paragraph",
            "attrs": {
              "textAlign": null
            },
            "content": [
              {
                "text": "Job Type: Full-time",
                "type": "text"
              }
            ]
          },
          {
            "type": "paragraph",
            "attrs": {
              "textAlign": null
            },
            "content": [
              {
                "text": "Benefits:",
                "type": "text"
              }
            ]
          },
          {
            "type": "paragraph",
            "attrs": {
              "textAlign": null
            },
            "content": [
              {
                "text": "Food provided",
                "type": "text"
              }
            ]
          },
          {
            "type": "paragraph",
            "attrs": {
              "textAlign": null
            },
            "content": [
              {
                "text": "Provident Fund",
                "type": "text"
              }
            ]
          },
          {
            "type": "paragraph",
            "attrs": {
              "textAlign": null
            },
            "content": [
              {
                "text": "Work Location: In person",
                "type": "text"
              }
            ]
          }
        ]
      },
      "alertMessage": null,
      "alertConfirmationMessage": null,
      "JobRoleId": 1,
      "yearsOfExperience": 2,
      "status": 4,
      "closedReasonType": 5,
      "closedReason": ".",
      "showCompanyToStudents": true,
      "companyPOCEmail": "xyz@gmail.com",
      "isPrivate": false,
      "offersInternship": false,
      "internshipDuration": 0,
      "internshipStipend": 0,
      "isAlumniJob": false,
      "isProCompany": false,
      "isJobPortal": false,
      "jobTags": null,
      "jobRedirectionLink": null,
      "category": null,
      "domain": null,
      "size": null,
      "bootstrappedOrFunded": null,
      "revenue": null,
      "source": null,
      "createdAt": "2025-04-02T07:11:19.749Z",
      "updatedAt": "2025-08-28T06:19:32.477Z",
      "CompanyId": 1402,
      "CollegeId": 4633,
      "JobApplicants": [
        {
          "id": 66441,
          "UserId": 57312,
          "JobOpeningId": 6188,
          "status": 9,
          "interviewDate": null,
          "ctcOffered": null,
          "yoe": null,
          "rejectionReason": null,
          "createdAt": "2025-04-04T06:28:27.852Z",
          "updatedAt": "2025-04-10T06:51:06.108Z",
          "JobApplicantStatuses": [
            {
              "id": 157747,
              "JobApplicantId": 66441,
              "status": 9,
              "date": "2025-04-10T06:51:06.107Z",
              "createdAt": "2025-04-10T06:51:06.108Z",
              "updatedAt": "2025-04-10T06:51:06.108Z"
            },
            {
              "id": 157176,
              "JobApplicantId": 66441,
              "status": 2,
              "date": "2025-04-07T06:22:40.171Z",
              "createdAt": "2025-04-07T06:22:17.883Z",
              "updatedAt": "2025-04-07T06:22:17.883Z"
            },
            {
              "id": 156395,
              "JobApplicantId": 66441,
              "status": 1,
              "date": "2025-04-04T06:28:27.855Z",
              "createdAt": "2025-04-04T06:28:27.855Z",
              "updatedAt": "2025-04-04T06:28:27.855Z"
            }
          ]
        }
      ],
      "JobLocations": [
        {
          "id": 17126,
          "name": "Dehradun",
          "JobOpeningId": 6188,
          "createdAt": "2025-08-22T06:55:03.704Z",
          "updatedAt": "2025-08-22T06:55:03.704Z"
        }
      ],
      "JobRole": {
        "id": 1,
        "name": "Frontend Engineer",
        "createdAt": "2023-02-23T11:10:53.498Z",
        "updatedAt": "2023-06-27T12:03:29.887Z"
      },
      "Company": {
        "id": 1402,
        "name": "Securepay",
        "logo": null,
        "pocName": "Abhishek",
        "pocNumber": "8077535733",
        "pocEmail": "xyz@gmail.com",
        "campusNexaRecommended": null,
        "createdAt": "2025-04-02T07:05:32.270Z",
        "updatedAt": "2025-04-02T07:05:32.270Z",
        "CampusNexaCompanyRefId": null,
        "CreatedById": 31491,
        "CollegeId": 4633
      }
    },
    {
      "id": 7208,
      "companyName": "Script Jet It Services",
      "minCTC": 3,
      "maxCTC": 8,
      "expirationDateTime": "2025-08-20T10:52:00.000Z",
      "description": "<p class=\"\"><strong>Required Skills &amp; Qualifications:</strong></p><p class=\"\"><strong>For freshers it is 3 to 3.5 lpa and for experiencef it is upto 8 lpa .A hike of upto 20 to 30 percent on your current ctc</strong></p><ul><li><p class=\"\">1+ years of professional experience in fullstack development</p></li><li><p class=\"\">Strong proficiency in <strong>React.js</strong>, <strong>Next.js</strong>, <strong>Node.js</strong></p></li><li><p class=\"\">Experience with <strong>AWS</strong> services (EC2, S3, Lambda, etc.)</p></li><li><p class=\"\">Strong communication and collaboration skills</p></li><li><p class=\"\">Bachelor’s or Master’s degree in Computer Science, IT, or related technical field</p></li></ul><p class=\"\"><strong>Nice to Have (Not Mandatory):</strong></p><ul><li><p class=\"\">Experience with <strong>Python</strong></p></li><li><p class=\"\">Exposure to <strong>React Native</strong> for mobile app development</p></li></ul><p class=\"\"><strong>Note:</strong></p><ul><li><p class=\"\">This is a <strong>fully onsite</strong> role.</p></li><li><p class=\"\"><strong>Only candidates currently residing in Surat</strong> or willing to relocate immediately will be considered.</p></li></ul><p class=\"\">Job Type: Full-time</p><p class=\"\"></p><p class=\"\">Ability to commute/relocate:</p><ul><li><p class=\"\">Vesu, Surat, Gujarat: Reliably commute or planning to relocate before starting work (Required)</p></li></ul><p class=\"\">Application Question(s):</p><ul><li><p class=\"\">Current CTC:<em>____ Expected CTC:___</em> (Must answer to qualify)</p></li></ul><p class=\"\">Education:</p><ul><li><p class=\"\">Bachelor's (Required)</p></li></ul><p class=\"\">Work Location: In person</p>",
      "newDescription": {
        "type": "doc",
        "content": [
          {
            "type": "paragraph",
            "attrs": {
              "textAlign": null
            },
            "content": [
              {
                "text": "Required Skills & Qualifications:",
                "type": "text",
                "marks": [
                  {
                    "type": "bold"
                  }
                ]
              }
            ]
          },
          {
            "type": "paragraph",
            "attrs": {
              "textAlign": null
            },
            "content": [
              {
                "text": "For freshers it is 3 to 3.5 lpa and for experiencef it is upto 8 lpa .A hike of upto 20 to 30 percent on your current ctc",
                "type": "text",
                "marks": [
                  {
                    "type": "bold"
                  }
                ]
              }
            ]
          },
          {
            "type": "bulletList",
            "content": [
              {
                "type": "listItem",
                "content": [
                  {
                    "type": "paragraph",
                    "attrs": {
                      "textAlign": null
                    },
                    "content": [
                      {
                        "text": "1+ years of professional experience in fullstack development",
                        "type": "text"
                      }
                    ]
                  }
                ]
              },
              {
                "type": "listItem",
                "content": [
                  {
                    "type": "paragraph",
                    "attrs": {
                      "textAlign": null
                    },
                    "content": [
                      {
                        "text": "Strong proficiency in ",
                        "type": "text"
                      },
                      {
                        "text": "React.js",
                        "type": "text",
                        "marks": [
                          {
                            "type": "bold"
                          }
                        ]
                      },
                      {
                        "text": ", ",
                        "type": "text"
                      },
                      {
                        "text": "Next.js",
                        "type": "text",
                        "marks": [
                          {
                            "type": "bold"
                          }
                        ]
                      },
                      {
                        "text": ", ",
                        "type": "text"
                      },
                      {
                        "text": "Node.js",
                        "type": "text",
                        "marks": [
                          {
                            "type": "bold"
                          }
                        ]
                      }
                    ]
                  }
                ]
              },
              {
                "type": "listItem",
                "content": [
                  {
                    "type": "paragraph",
                    "attrs": {
                      "textAlign": null
                    },
                    "content": [
                      {
                        "text": "Experience with ",
                        "type": "text"
                      },
                      {
                        "text": "AWS",
                        "type": "text",
                        "marks": [
                          {
                            "type": "bold"
                          }
                        ]
                      },
                      {
                        "text": " services (EC2, S3, Lambda, etc.)",
                        "type": "text"
                      }
                    ]
                  }
                ]
              },
              {
                "type": "listItem",
                "content": [
                  {
                    "type": "paragraph",
                    "attrs": {
                      "textAlign": null
                    },
                    "content": [
                      {
                        "text": "Strong communication and collaboration skills",
                        "type": "text"
                      }
                    ]
                  }
                ]
              },
              {
                "type": "listItem",
                "content": [
                  {
                    "type": "paragraph",
                    "attrs": {
                      "textAlign": null
                    },
                    "content": [
                      {
                        "text": "Bachelor’s or Master’s degree in Computer Science, IT, or related technical field",
                        "type": "text"
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            "type": "paragraph",
            "attrs": {
              "textAlign": null
            },
            "content": [
              {
                "text": "Nice to Have (Not Mandatory):",
                "type": "text",
                "marks": [
                  {
                    "type": "bold"
                  }
                ]
              }
            ]
          },
          {
            "type": "bulletList",
            "content": [
              {
                "type": "listItem",
                "content": [
                  {
                    "type": "paragraph",
                    "attrs": {
                      "textAlign": null
                    },
                    "content": [
                      {
                        "text": "Experience with ",
                        "type": "text"
                      },
                      {
                        "text": "Python",
                        "type": "text",
                        "marks": [
                          {
                            "type": "bold"
                          }
                        ]
                      }
                    ]
                  }
                ]
              },
              {
                "type": "listItem",
                "content": [
                  {
                    "type": "paragraph",
                    "attrs": {
                      "textAlign": null
                    },
                    "content": [
                      {
                        "text": "Exposure to ",
                        "type": "text"
                      },
                      {
                        "text": "React Native",
                        "type": "text",
                        "marks": [
                          {
                            "type": "bold"
                          }
                        ]
                      },
                      {
                        "text": " for mobile app development",
                        "type": "text"
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            "type": "paragraph",
            "attrs": {
              "textAlign": null
            },
            "content": [
              {
                "text": "Note:",
                "type": "text",
                "marks": [
                  {
                    "type": "bold"
                  }
                ]
              }
            ]
          },
          {
            "type": "bulletList",
            "content": [
              {
                "type": "listItem",
                "content": [
                  {
                    "type": "paragraph",
                    "attrs": {
                      "textAlign": null
                    },
                    "content": [
                      {
                        "text": "This is a ",
                        "type": "text"
                      },
                      {
                        "text": "fully onsite",
                        "type": "text",
                        "marks": [
                          {
                            "type": "bold"
                          }
                        ]
                      },
                      {
                        "text": " role.",
                        "type": "text"
                      }
                    ]
                  }
                ]
              },
              {
                "type": "listItem",
                "content": [
                  {
                    "type": "paragraph",
                    "attrs": {
                      "textAlign": null
                    },
                    "content": [
                      {
                        "text": "Only candidates currently residing in Surat",
                        "type": "text",
                        "marks": [
                          {
                            "type": "bold"
                          }
                        ]
                      },
                      {
                        "text": " or willing to relocate immediately will be considered.",
                        "type": "text"
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            "type": "paragraph",
            "attrs": {
              "textAlign": null
            },
            "content": [
              {
                "text": "Job Type: Full-time",
                "type": "text"
              }
            ]
          },
          {
            "type": "paragraph",
            "attrs": {
              "textAlign": null
            }
          },
          {
            "type": "paragraph",
            "attrs": {
              "textAlign": null
            },
            "content": [
              {
                "text": "Ability to commute/relocate:",
                "type": "text"
              }
            ]
          },
          {
            "type": "bulletList",
            "content": [
              {
                "type": "listItem",
                "content": [
                  {
                    "type": "paragraph",
                    "attrs": {
                      "textAlign": null
                    },
                    "content": [
                      {
                        "text": "Vesu, Surat, Gujarat: Reliably commute or planning to relocate before starting work (Required)",
                        "type": "text"
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            "type": "paragraph",
            "attrs": {
              "textAlign": null
            },
            "content": [
              {
                "text": "Application Question(s):",
                "type": "text"
              }
            ]
          },
          {
            "type": "bulletList",
            "content": [
              {
                "type": "listItem",
                "content": [
                  {
                    "type": "paragraph",
                    "attrs": {
                      "textAlign": null
                    },
                    "content": [
                      {
                        "text": "Current CTC:",
                        "type": "text"
                      },
                      {
                        "text": "____ Expected CTC:___",
                        "type": "text",
                        "marks": [
                          {
                            "type": "italic"
                          }
                        ]
                      },
                      {
                        "text": " (Must answer to qualify)",
                        "type": "text"
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            "type": "paragraph",
            "attrs": {
              "textAlign": null
            },
            "content": [
              {
                "text": "Education:",
                "type": "text"
              }
            ]
          },
          {
            "type": "bulletList",
            "content": [
              {
                "type": "listItem",
                "content": [
                  {
                    "type": "paragraph",
                    "attrs": {
                      "textAlign": null
                    },
                    "content": [
                      {
                        "text": "Bachelor's (Required)",
                        "type": "text"
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            "type": "paragraph",
            "attrs": {
              "textAlign": null
            },
            "content": [
              {
                "text": "Work Location: In person",
                "type": "text"
              }
            ]
          }
        ]
      },
      "alertMessage": null,
      "alertConfirmationMessage": null,
      "JobRoleId": 1,
      "yearsOfExperience": 0,
      "status": 4,
      "closedReasonType": 3,
      "closedReason": "d",
      "showCompanyToStudents": true,
      "companyPOCEmail": "xyz@gmail.com",
      "isPrivate": false,
      "offersInternship": false,
      "internshipDuration": 0,
      "internshipStipend": 0,
      "isAlumniJob": false,
      "isProCompany": false,
      "isJobPortal": false,
      "jobTags": null,
      "jobRedirectionLink": null,
      "category": null,
      "domain": null,
      "size": null,
      "bootstrappedOrFunded": null,
      "revenue": null,
      "source": null,
      "createdAt": "2025-08-18T08:51:04.586Z",
      "updatedAt": "2025-11-16T06:40:41.952Z",
      "CompanyId": 1913,
      "CollegeId": 4633,
      "JobApplicants": [
        {
          "id": 74667,
          "UserId": 57312,
          "JobOpeningId": 7208,
          "status": 9,
          "interviewDate": null,
          "ctcOffered": null,
          "yoe": null,
          "rejectionReason": null,
          "createdAt": "2025-08-19T15:45:43.168Z",
          "updatedAt": "2025-11-16T06:40:41.940Z",
          "JobApplicantStatuses": [
            {
              "id": 190848,
              "JobApplicantId": 74667,
              "status": 9,
              "date": "2025-11-16T06:40:41.940Z",
              "createdAt": "2025-11-16T06:40:41.941Z",
              "updatedAt": "2025-11-16T06:40:41.941Z"
            },
            {
              "id": 177635,
              "JobApplicantId": 74667,
              "status": 1,
              "date": "2025-08-19T15:45:43.172Z",
              "createdAt": "2025-08-19T15:45:43.172Z",
              "updatedAt": "2025-08-19T15:45:43.172Z"
            }
          ]
        }
      ],
      "JobLocations": [
        {
          "id": 17073,
          "name": "Surat",
          "JobOpeningId": 7208,
          "createdAt": "2025-08-19T06:14:58.720Z",
          "updatedAt": "2025-08-19T06:14:58.720Z"
        }
      ],
      "JobRole": {
        "id": 1,
        "name": "Frontend Engineer",
        "createdAt": "2023-02-23T11:10:53.498Z",
        "updatedAt": "2023-06-27T12:03:29.887Z"
      },
      "Company": {
        "id": 1913,
        "name": "Script Jet It Services",
        "logo": null,
        "pocName": "Ekta",
        "pocNumber": "9510809987",
        "pocEmail": "xyz@gmail.com",
        "campusNexaRecommended": null,
        "createdAt": "2025-08-18T08:48:10.069Z",
        "updatedAt": "2025-08-18T08:48:10.069Z",
        "CampusNexaCompanyRefId": null,
        "CreatedById": 31491,
        "CollegeId": 4633
      }
    },
    {
      "id": 7118,
      "companyName": "Applyo",
      "minCTC": 6,
      "maxCTC": 10,
      "expirationDateTime": "2025-08-03T05:58:00.000Z",
      "description": "<h1>There are 2 positions for frontend and full stack each. Remote options for candidates who perform extraordinary</h1>",
      "newDescription": {
        "type": "doc",
        "content": [
          {
            "type": "heading",
            "attrs": {
              "level": 1,
              "textAlign": null
            },
            "content": [
              {
                "text": "There are 2 positions for frontend and full stack each. Remote options for candidates who perform extraordinary",
                "type": "text"
              }
            ]
          }
        ]
      },
      "alertMessage": null,
      "alertConfirmationMessage": null,
      "JobRoleId": 1,
      "yearsOfExperience": 0,
      "status": 4,
      "closedReasonType": 3,
      "closedReason": "dns",
      "showCompanyToStudents": true,
      "companyPOCEmail": "pujajaiswal@sharpener.tech",
      "isPrivate": false,
      "offersInternship": false,
      "internshipDuration": 0,
      "internshipStipend": 0,
      "isAlumniJob": false,
      "isProCompany": true,
      "isJobPortal": false,
      "jobTags": null,
      "jobRedirectionLink": null,
      "category": null,
      "domain": null,
      "size": null,
      "bootstrappedOrFunded": null,
      "revenue": null,
      "source": null,
      "createdAt": "2025-07-30T11:29:20.702Z",
      "updatedAt": "2025-09-12T12:36:31.734Z",
      "CompanyId": 1873,
      "CollegeId": 4633,
      "JobApplicants": [
        {
          "id": 73767,
          "UserId": 57312,
          "JobOpeningId": 7118,
          "status": 9,
          "interviewDate": null,
          "ctcOffered": null,
          "yoe": null,
          "rejectionReason": null,
          "createdAt": "2025-08-01T11:12:21.378Z",
          "updatedAt": "2025-09-12T12:36:31.706Z",
          "JobApplicantStatuses": [
            {
              "id": 181415,
              "JobApplicantId": 73767,
              "status": 9,
              "date": "2025-09-12T12:36:31.705Z",
              "createdAt": "2025-09-12T12:36:31.706Z",
              "updatedAt": "2025-09-12T12:36:31.706Z"
            },
            {
              "id": 174784,
              "JobApplicantId": 73767,
              "status": 1,
              "date": "2025-08-01T11:12:21.381Z",
              "createdAt": "2025-08-01T11:12:21.381Z",
              "updatedAt": "2025-08-01T11:12:21.381Z"
            }
          ]
        }
      ],
      "JobLocations": [
        {
          "id": 16864,
          "name": "Bangalore",
          "JobOpeningId": 7118,
          "createdAt": "2025-07-30T11:35:32.383Z",
          "updatedAt": "2025-07-30T11:35:32.383Z"
        }
      ],
      "JobRole": {
        "id": 1,
        "name": "Frontend Engineer",
        "createdAt": "2023-02-23T11:10:53.498Z",
        "updatedAt": "2023-06-27T12:03:29.887Z"
      },
      "Company": {
        "id": 1873,
        "name": "Applyo",
        "logo": null,
        "pocName": "Anmol",
        "pocNumber": "9870716457",
        "pocEmail": null,
        "campusNexaRecommended": null,
        "createdAt": "2025-07-30T11:24:56.850Z",
        "updatedAt": "2025-07-30T11:24:56.850Z",
        "CampusNexaCompanyRefId": null,
        "CreatedById": 46492,
        "CollegeId": 4633
      }
    },
    {
      "id": 3367,
      "companyName": "Techferry",
      "minCTC": 5,
      "maxCTC": 8,
      "expirationDateTime": "2025-07-26T07:26:00.000Z",
      "description": "<h1>40 - 70 PERCENT HIKE ON CURRENT SALARY AS PER THE PERFORMANCE. NIGHT SHIFT.minimum 1 year exp is reqd, Computer sc nackground reqd. Finals will be face to face in Noida</h1>",
      "newDescription": {
        "type": "doc",
        "content": [
          {
            "type": "heading",
            "attrs": {
              "level": 1,
              "textAlign": null
            },
            "content": [
              {
                "text": "40 - 70 PERCENT HIKE ON CURRENT SALARY AS PER THE PERFORMANCE. NIGHT SHIFT.minimum 1 year exp is reqd, Computer sc nackground reqd. Finals will be face to face in Noida",
                "type": "text"
              }
            ]
          }
        ]
      },
      "alertMessage": null,
      "alertConfirmationMessage": null,
      "JobRoleId": 1,
      "yearsOfExperience": 0,
      "status": 4,
      "closedReasonType": 3,
      "closedReason": "nt st",
      "showCompanyToStudents": true,
      "companyPOCEmail": "pujajaiswal@14453gmail.com",
      "isPrivate": false,
      "offersInternship": false,
      "internshipDuration": 0,
      "internshipStipend": 0,
      "isAlumniJob": false,
      "isProCompany": false,
      "isJobPortal": false,
      "jobTags": null,
      "jobRedirectionLink": null,
      "category": null,
      "domain": null,
      "size": null,
      "bootstrappedOrFunded": null,
      "revenue": null,
      "source": null,
      "createdAt": "2024-03-07T12:17:03.533Z",
      "updatedAt": "2025-08-11T14:31:32.685Z",
      "CompanyId": null,
      "CollegeId": 4633,
      "JobApplicants": [
        {
          "id": 72361,
          "UserId": 57312,
          "JobOpeningId": 3367,
          "status": 9,
          "interviewDate": null,
          "ctcOffered": null,
          "yoe": null,
          "rejectionReason": null,
          "createdAt": "2025-07-12T09:03:37.014Z",
          "updatedAt": "2025-08-11T14:31:32.647Z",
          "JobApplicantStatuses": [
            {
              "id": 176029,
              "JobApplicantId": 72361,
              "status": 9,
              "date": "2025-08-11T14:31:32.646Z",
              "createdAt": "2025-08-11T14:31:32.648Z",
              "updatedAt": "2025-08-11T14:31:32.648Z"
            },
            {
              "id": 171583,
              "JobApplicantId": 72361,
              "status": 1,
              "date": "2025-07-12T09:03:37.017Z",
              "createdAt": "2025-07-12T09:03:37.017Z",
              "updatedAt": "2025-07-12T09:03:37.017Z"
            }
          ]
        }
      ],
      "JobLocations": [
        {
          "id": 16488,
          "name": "Remote",
          "JobOpeningId": 3367,
          "createdAt": "2025-07-07T12:58:29.727Z",
          "updatedAt": "2025-07-07T12:58:29.727Z"
        }
      ],
      "JobRole": {
        "id": 1,
        "name": "Frontend Engineer",
        "createdAt": "2023-02-23T11:10:53.498Z",
        "updatedAt": "2023-06-27T12:03:29.887Z"
      },
      "Company": null
    },
    {
      "id": 6445,
      "companyName": "Park+",
      "minCTC": 7,
      "maxCTC": 10,
      "expirationDateTime": "2025-07-25T08:00:00.000Z",
      "description": "<h2>stipend of 20 - 30 k and then ppo offer will be 7 - 10 l.p.a</h2>",
      "newDescription": {
        "type": "doc",
        "content": [
          {
            "type": "heading",
            "attrs": {
              "level": 2,
              "textAlign": null
            },
            "content": [
              {
                "text": "stipend of 20 - 30 k and then ppo offer will be 7 - 10 l.p.a",
                "type": "text"
              }
            ]
          }
        ]
      },
      "alertMessage": null,
      "alertConfirmationMessage": null,
      "JobRoleId": 1,
      "yearsOfExperience": 0,
      "status": 4,
      "closedReasonType": 3,
      "closedReason": "nt reach",
      "showCompanyToStudents": true,
      "companyPOCEmail": "ishika.goel@myparkplus.com",
      "isPrivate": false,
      "offersInternship": false,
      "internshipDuration": 0,
      "internshipStipend": 0,
      "isAlumniJob": false,
      "isProCompany": true,
      "isJobPortal": false,
      "jobTags": null,
      "jobRedirectionLink": null,
      "category": null,
      "domain": null,
      "size": null,
      "bootstrappedOrFunded": null,
      "revenue": null,
      "source": null,
      "createdAt": "2025-04-29T12:00:57.749Z",
      "updatedAt": "2025-08-11T14:32:49.768Z",
      "CompanyId": 1539,
      "CollegeId": 4633,
      "JobApplicants": [
        {
          "id": 67772,
          "UserId": 57312,
          "JobOpeningId": 6445,
          "status": 9,
          "interviewDate": null,
          "ctcOffered": null,
          "yoe": null,
          "rejectionReason": null,
          "createdAt": "2025-04-29T12:59:01.091Z",
          "updatedAt": "2025-06-04T08:55:55.513Z",
          "JobApplicantStatuses": [
            {
              "id": 166112,
              "JobApplicantId": 67772,
              "status": 9,
              "date": "2025-06-04T08:55:55.512Z",
              "createdAt": "2025-06-04T08:55:55.514Z",
              "updatedAt": "2025-06-04T08:55:55.514Z"
            },
            {
              "id": 160047,
              "JobApplicantId": 67772,
              "status": 2,
              "date": "2025-04-30T09:21:52.400Z",
              "createdAt": "2025-04-30T09:21:52.488Z",
              "updatedAt": "2025-04-30T09:21:52.488Z"
            },
            {
              "id": 159984,
              "JobApplicantId": 67772,
              "status": 1,
              "date": "2025-04-29T12:59:01.094Z",
              "createdAt": "2025-04-29T12:59:01.094Z",
              "updatedAt": "2025-04-29T12:59:01.094Z"
            }
          ]
        }
      ],
      "JobLocations": [
        {
          "id": 15094,
          "name": "Gurgaon",
          "JobOpeningId": 6445,
          "createdAt": "2025-04-29T12:01:18.644Z",
          "updatedAt": "2025-04-29T12:01:18.644Z"
        }
      ],
      "JobRole": {
        "id": 1,
        "name": "Frontend Engineer",
        "createdAt": "2023-02-23T11:10:53.498Z",
        "updatedAt": "2023-06-27T12:03:29.887Z"
      },
      "Company": {
        "id": 1539,
        "name": "Park+",
        "logo": null,
        "pocName": "Ishika",
        "pocNumber": "9990651571",
        "pocEmail": "ishika.goel@myparkplus.com",
        "campusNexaRecommended": null,
        "createdAt": "2025-04-29T11:56:20.533Z",
        "updatedAt": "2025-04-29T11:57:15.095Z",
        "CampusNexaCompanyRefId": null,
        "CreatedById": 46492,
        "CollegeId": 4633
      }
    },
    {
      "id": 4918,
      "companyName": "Solkuu",
      "minCTC": 6,
      "maxCTC": 10,
      "expirationDateTime": "2025-07-23T06:16:00.000Z",
      "description": null,
      "newDescription": null,
      "alertMessage": "<h1><strong>Role- Mern stack developer</strong></h1><h1><strong>Need min 1 yr of experience</strong></h1><h1><strong>Its a startup but good company... you will get a chance to learn more </strong></h1><p><br></p>",
      "alertConfirmationMessage": null,
      "JobRoleId": 1,
      "yearsOfExperience": 0,
      "status": 4,
      "closedReasonType": 3,
      "closedReason": "not shortlisted",
      "showCompanyToStudents": true,
      "companyPOCEmail": "hr@solkuu.com",
      "isPrivate": false,
      "offersInternship": false,
      "internshipDuration": 0,
      "internshipStipend": 0,
      "isAlumniJob": false,
      "isProCompany": false,
      "isJobPortal": false,
      "jobTags": null,
      "jobRedirectionLink": null,
      "category": null,
      "domain": null,
      "size": null,
      "bootstrappedOrFunded": null,
      "revenue": null,
      "source": null,
      "createdAt": "2024-09-21T12:17:39.316Z",
      "updatedAt": "2025-08-23T07:18:04.955Z",
      "CompanyId": 742,
      "CollegeId": 4633,
      "JobApplicants": [
        {
          "id": 73035,
          "UserId": 57312,
          "JobOpeningId": 4918,
          "status": 9,
          "interviewDate": null,
          "ctcOffered": null,
          "yoe": null,
          "rejectionReason": null,
          "createdAt": "2025-07-21T14:38:07.056Z",
          "updatedAt": "2025-08-23T07:18:04.933Z",
          "JobApplicantStatuses": [
            {
              "id": 178335,
              "JobApplicantId": 73035,
              "status": 9,
              "date": "2025-08-23T07:18:04.933Z",
              "createdAt": "2025-08-23T07:18:04.933Z",
              "updatedAt": "2025-08-23T07:18:04.933Z"
            },
            {
              "id": 172724,
              "JobApplicantId": 73035,
              "status": 1,
              "date": "2025-07-21T14:38:07.059Z",
              "createdAt": "2025-07-21T14:38:07.059Z",
              "updatedAt": "2025-07-21T14:38:07.059Z"
            }
          ]
        }
      ],
      "JobLocations": [
        {
          "id": 11280,
          "name": "Bangalore",
          "JobOpeningId": 4918,
          "createdAt": "2024-09-21T12:17:39.330Z",
          "updatedAt": "2024-09-21T12:17:39.330Z"
        }
      ],
      "JobRole": {
        "id": 1,
        "name": "Frontend Engineer",
        "createdAt": "2023-02-23T11:10:53.498Z",
        "updatedAt": "2023-06-27T12:03:29.887Z"
      },
      "Company": {
        "id": 742,
        "name": "Solkuu",
        "logo": null,
        "pocName": "Harshvardhan",
        "pocNumber": "9742852414",
        "pocEmail": "hr@solkuu.com",
        "campusNexaRecommended": null,
        "createdAt": "2024-09-21T12:15:09.478Z",
        "updatedAt": "2024-09-21T12:15:09.478Z",
        "CampusNexaCompanyRefId": null,
        "CreatedById": 25244,
        "CollegeId": 4633
      }
    },
    {
      "id": 5716,
      "companyName": "Antino Labs",
      "minCTC": 6,
      "maxCTC": 9,
      "expirationDateTime": "2025-07-18T10:12:00.000Z",
      "description": null,
      "newDescription": null,
      "alertMessage": "<h2><strong>2 years of experienced candidates</strong></h2><h2><strong>Role- Frontend developer</strong></h2><h2><strong>CTC depends on last ctc and experience</strong></h2><h2><strong>Already 9 freshers are working in this company</strong></h2><h2><strong>There are 2 locations gurgaon and bangalore</strong></h2><h2><strong>5 days working</strong></h2>",
      "alertConfirmationMessage": null,
      "JobRoleId": 1,
      "yearsOfExperience": 1,
      "status": 4,
      "closedReasonType": 3,
      "closedReason": "not shortlisted",
      "showCompanyToStudents": true,
      "companyPOCEmail": "taruna.s@antino.com",
      "isPrivate": false,
      "offersInternship": false,
      "internshipDuration": 0,
      "internshipStipend": 0,
      "isAlumniJob": false,
      "isProCompany": false,
      "isJobPortal": false,
      "jobTags": null,
      "jobRedirectionLink": null,
      "category": null,
      "domain": null,
      "size": null,
      "bootstrappedOrFunded": null,
      "revenue": null,
      "source": null,
      "createdAt": "2025-01-15T10:58:59.573Z",
      "updatedAt": "2025-08-23T07:08:51.428Z",
      "CompanyId": 609,
      "CollegeId": 4633,
      "JobApplicants": [
        {
          "id": 70653,
          "UserId": 57312,
          "JobOpeningId": 5716,
          "status": 9,
          "interviewDate": null,
          "ctcOffered": null,
          "yoe": null,
          "rejectionReason": null,
          "createdAt": "2025-06-12T18:23:58.179Z",
          "updatedAt": "2025-08-23T07:08:51.412Z",
          "JobApplicantStatuses": [
            {
              "id": 178128,
              "JobApplicantId": 70653,
              "status": 9,
              "date": "2025-08-23T07:08:51.412Z",
              "createdAt": "2025-08-23T07:08:51.412Z",
              "updatedAt": "2025-08-23T07:08:51.412Z"
            },
            {
              "id": 167550,
              "JobApplicantId": 70653,
              "status": 1,
              "date": "2025-06-12T18:23:58.184Z",
              "createdAt": "2025-06-12T18:23:58.185Z",
              "updatedAt": "2025-06-12T18:23:58.185Z"
            }
          ]
        }
      ],
      "JobLocations": [
        {
          "id": 16651,
          "name": "Bangalore",
          "JobOpeningId": 5716,
          "createdAt": "2025-07-16T10:12:27.921Z",
          "updatedAt": "2025-07-16T10:12:27.921Z"
        },
        {
          "id": 16652,
          "name": "Gurgaon",
          "JobOpeningId": 5716,
          "createdAt": "2025-07-16T10:12:27.921Z",
          "updatedAt": "2025-07-16T10:12:27.921Z"
        }
      ],
      "JobRole": {
        "id": 1,
        "name": "Frontend Engineer",
        "createdAt": "2023-02-23T11:10:53.498Z",
        "updatedAt": "2023-06-27T12:03:29.887Z"
      },
      "Company": {
        "id": 609,
        "name": "Antino Labs",
        "logo": null,
        "pocName": "taruna",
        "pocNumber": "9690440791",
        "pocEmail": "taruna.s@antino.com",
        "campusNexaRecommended": null,
        "createdAt": "2024-09-09T11:09:05.232Z",
        "updatedAt": "2024-09-09T11:09:05.232Z",
        "CampusNexaCompanyRefId": null,
        "CreatedById": 25244,
        "CollegeId": 4633
      }
    },
    {
      "id": 563,
      "companyName": "The Read Better Company",
      "minCTC": 4,
      "maxCTC": 10,
      "expirationDateTime": "2025-07-14T10:51:00.000Z",
      "description": "<p><strong>Basically looking for Python Developers.</strong></p><p><strong>The companyis looking for candidates who can demonstrate the potential and commitment to contribute actively to the company’s growth and long-term success.\"</strong></p><p><strong>Fully Remote.</strong></p><p><strong>Ctc totally depends on your current ctc and interview</strong></p>",
      "newDescription": {
        "type": "doc",
        "content": [
          {
            "type": "paragraph",
            "attrs": {
              "textAlign": null
            },
            "content": [
              {
                "text": "Basically looking for Python Developers.",
                "type": "text",
                "marks": [
                  {
                    "type": "bold"
                  }
                ]
              }
            ]
          },
          {
            "type": "paragraph",
            "attrs": {
              "textAlign": null
            },
            "content": [
              {
                "text": "The companyis looking for candidates who can demonstrate the potential and commitment to contribute actively to the company’s growth and long-term success.\"",
                "type": "text",
                "marks": [
                  {
                    "type": "bold"
                  }
                ]
              }
            ]
          },
          {
            "type": "paragraph",
            "attrs": {
              "textAlign": null
            },
            "content": [
              {
                "text": "Fully Remote.",
                "type": "text",
                "marks": [
                  {
                    "type": "bold"
                  }
                ]
              }
            ]
          },
          {
            "type": "paragraph",
            "attrs": {
              "textAlign": null
            },
            "content": [
              {
                "text": "Ctc totally depends on your current ctc and interview",
                "type": "text",
                "marks": [
                  {
                    "type": "bold"
                  }
                ]
              }
            ]
          }
        ]
      },
      "alertMessage": null,
      "alertConfirmationMessage": null,
      "JobRoleId": 1,
      "yearsOfExperience": 0,
      "status": 4,
      "closedReasonType": 3,
      "closedReason": "/",
      "showCompanyToStudents": true,
      "companyPOCEmail": "xyz@gmail.com",
      "isPrivate": false,
      "offersInternship": false,
      "internshipDuration": 0,
      "internshipStipend": 0,
      "isAlumniJob": false,
      "isProCompany": false,
      "isJobPortal": false,
      "jobTags": null,
      "jobRedirectionLink": null,
      "category": null,
      "domain": null,
      "size": null,
      "bootstrappedOrFunded": null,
      "revenue": null,
      "source": null,
      "createdAt": "2023-04-25T14:44:47.277Z",
      "updatedAt": "2025-07-23T07:11:34.683Z",
      "CompanyId": null,
      "CollegeId": 4633,
      "JobApplicants": [
        {
          "id": 72359,
          "UserId": 57312,
          "JobOpeningId": 563,
          "status": 9,
          "interviewDate": null,
          "ctcOffered": null,
          "yoe": null,
          "rejectionReason": null,
          "createdAt": "2025-07-12T09:03:06.556Z",
          "updatedAt": "2025-07-23T07:11:34.655Z",
          "JobApplicantStatuses": [
            {
              "id": 172917,
              "JobApplicantId": 72359,
              "status": 9,
              "date": "2025-07-23T07:11:34.655Z",
              "createdAt": "2025-07-23T07:11:34.656Z",
              "updatedAt": "2025-07-23T07:11:34.656Z"
            },
            {
              "id": 171581,
              "JobApplicantId": 72359,
              "status": 1,
              "date": "2025-07-12T09:03:06.559Z",
              "createdAt": "2025-07-12T09:03:06.559Z",
              "updatedAt": "2025-07-12T09:03:06.559Z"
            }
          ]
        }
      ],
      "JobLocations": [
        {
          "id": 16586,
          "name": "Remote",
          "JobOpeningId": 563,
          "createdAt": "2025-07-11T11:34:44.053Z",
          "updatedAt": "2025-07-11T11:34:44.053Z"
        }
      ],
      "JobRole": {
        "id": 1,
        "name": "Frontend Engineer",
        "createdAt": "2023-02-23T11:10:53.498Z",
        "updatedAt": "2023-06-27T12:03:29.887Z"
      },
      "Company": null
    },
    {
      "id": 6971,
      "companyName": "Spotnana",
      "minCTC": 15,
      "maxCTC": 20,
      "expirationDateTime": "2025-07-13T06:27:00.000Z",
      "description": "<h2>Candidates should have more than 1.5 years of exp</h2><ul><li><span style=\"color: rgba(0, 0, 0, 0.9);\">B. Tech/MS in Computer Science or a related technical field preferred</span></li><li><span style=\"background-color: rgba(0, 0, 0, 0); color: rgba(0, 0, 0, 0.9);\"> ReactJS, AngularJS, including concepts like asynchronous programming, closures</span></li><li><span style=\"color: rgba(0, 0, 0, 0.9);\">HTML/CSS experience, including concepts like layout, specificity, cross browser compatibility, and accessibility</span></li><li><span style=\"color: rgba(0, 0, 0, 0.9);\">Experience with browser APIs and optimizing front end performance</span></li></ul>",
      "newDescription": {
        "type": "doc",
        "content": [
          {
            "type": "heading",
            "attrs": {
              "level": 2,
              "textAlign": null
            },
            "content": [
              {
                "text": "Candidates should have more than 1.5 years of exp",
                "type": "text"
              }
            ]
          },
          {
            "type": "bulletList",
            "content": [
              {
                "type": "listItem",
                "content": [
                  {
                    "type": "paragraph",
                    "attrs": {
                      "textAlign": null
                    },
                    "content": [
                      {
                        "text": "B. Tech/MS in Computer Science or a related technical field preferred",
                        "type": "text",
                        "marks": [
                          {
                            "type": "textStyle",
                            "attrs": {
                              "color": "rgba(0, 0, 0, 0.9)"
                            }
                          }
                        ]
                      }
                    ]
                  }
                ]
              },
              {
                "type": "listItem",
                "content": [
                  {
                    "type": "paragraph",
                    "attrs": {
                      "textAlign": null
                    },
                    "content": [
                      {
                        "text": "ReactJS, AngularJS, including concepts like asynchronous programming, closures",
                        "type": "text",
                        "marks": [
                          {
                            "type": "textStyle",
                            "attrs": {
                              "color": "rgba(0, 0, 0, 0.9)"
                            }
                          }
                        ]
                      }
                    ]
                  }
                ]
              },
              {
                "type": "listItem",
                "content": [
                  {
                    "type": "paragraph",
                    "attrs": {
                      "textAlign": null
                    },
                    "content": [
                      {
                        "text": "HTML/CSS experience, including concepts like layout, specificity, cross browser compatibility, and accessibility",
                        "type": "text",
                        "marks": [
                          {
                            "type": "textStyle",
                            "attrs": {
                              "color": "rgba(0, 0, 0, 0.9)"
                            }
                          }
                        ]
                      }
                    ]
                  }
                ]
              },
              {
                "type": "listItem",
                "content": [
                  {
                    "type": "paragraph",
                    "attrs": {
                      "textAlign": null
                    },
                    "content": [
                      {
                        "text": "Experience with browser APIs and optimizing front end performance",
                        "type": "text",
                        "marks": [
                          {
                            "type": "textStyle",
                            "attrs": {
                              "color": "rgba(0, 0, 0, 0.9)"
                            }
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      },
      "alertMessage": null,
      "alertConfirmationMessage": null,
      "JobRoleId": 1,
      "yearsOfExperience": 0,
      "status": 4,
      "closedReasonType": 3,
      "closedReason": "nt st",
      "showCompanyToStudents": true,
      "companyPOCEmail": "ajha@spotnana.com",
      "isPrivate": false,
      "offersInternship": false,
      "internshipDuration": 0,
      "internshipStipend": 0,
      "isAlumniJob": false,
      "isProCompany": true,
      "isJobPortal": false,
      "jobTags": null,
      "jobRedirectionLink": null,
      "category": null,
      "domain": null,
      "size": null,
      "bootstrappedOrFunded": null,
      "revenue": null,
      "source": null,
      "createdAt": "2025-07-04T08:56:18.848Z",
      "updatedAt": "2025-08-11T14:47:24.004Z",
      "CompanyId": 1795,
      "CollegeId": 4633,
      "JobApplicants": [
        {
          "id": 72360,
          "UserId": 57312,
          "JobOpeningId": 6971,
          "status": 9,
          "interviewDate": null,
          "ctcOffered": null,
          "yoe": null,
          "rejectionReason": null,
          "createdAt": "2025-07-12T09:03:22.854Z",
          "updatedAt": "2025-08-11T14:47:23.980Z",
          "JobApplicantStatuses": [
            {
              "id": 176414,
              "JobApplicantId": 72360,
              "status": 9,
              "date": "2025-08-11T14:47:23.980Z",
              "createdAt": "2025-08-11T14:47:23.981Z",
              "updatedAt": "2025-08-11T14:47:23.981Z"
            },
            {
              "id": 171582,
              "JobApplicantId": 72360,
              "status": 1,
              "date": "2025-07-12T09:03:22.856Z",
              "createdAt": "2025-07-12T09:03:22.857Z",
              "updatedAt": "2025-07-12T09:03:22.857Z"
            }
          ]
        }
      ],
      "JobLocations": [
        {
          "id": 16464,
          "name": "Bangalore",
          "JobOpeningId": 6971,
          "createdAt": "2025-07-04T11:49:38.067Z",
          "updatedAt": "2025-07-04T11:49:38.067Z"
        }
      ],
      "JobRole": {
        "id": 1,
        "name": "Frontend Engineer",
        "createdAt": "2023-02-23T11:10:53.498Z",
        "updatedAt": "2023-06-27T12:03:29.887Z"
      },
      "Company": {
        "id": 1795,
        "name": "Spotnana",
        "logo": null,
        "pocName": "Ashish",
        "pocNumber": "88612 80855",
        "pocEmail": "ajha@spotnana.com",
        "campusNexaRecommended": null,
        "createdAt": "2025-07-04T08:49:04.938Z",
        "updatedAt": "2025-07-04T08:49:04.938Z",
        "CampusNexaCompanyRefId": null,
        "CreatedById": 46492,
        "CollegeId": 4633
      }
    },
    {
      "id": 6986,
      "companyName": "Zupee",
      "minCTC": 10,
      "maxCTC": 15,
      "expirationDateTime": "2025-07-13T06:02:00.000Z",
      "description": "<h1>ONLY 1 YEAR + FULL STACK DEVELOPERS NEARBY DELHI NCR SHOULD APPLY AS IT IS WALK IN INTERVIEW</h1><p><br></p>",
      "newDescription": {
        "type": "doc",
        "content": [
          {
            "type": "heading",
            "attrs": {
              "level": 1,
              "textAlign": null
            },
            "content": [
              {
                "text": "ONLY 1 YEAR + FULL STACK DEVELOPERS NEARBY DELHI NCR SHOULD APPLY AS IT IS WALK IN INTERVIEW",
                "type": "text"
              }
            ]
          },
          {
            "type": "paragraph",
            "attrs": {
              "textAlign": null
            },
            "content": [
              {
                "type": "hardBreak"
              }
            ]
          }
        ]
      },
      "alertMessage": null,
      "alertConfirmationMessage": null,
      "JobRoleId": 1,
      "yearsOfExperience": 0,
      "status": 4,
      "closedReasonType": 3,
      "closedReason": "nt st",
      "showCompanyToStudents": true,
      "companyPOCEmail": "shivam.sharma@zupee.com",
      "isPrivate": false,
      "offersInternship": false,
      "internshipDuration": 0,
      "internshipStipend": 0,
      "isAlumniJob": false,
      "isProCompany": true,
      "isJobPortal": false,
      "jobTags": null,
      "jobRedirectionLink": null,
      "category": null,
      "domain": null,
      "size": null,
      "bootstrappedOrFunded": null,
      "revenue": null,
      "source": null,
      "createdAt": "2025-07-08T09:08:57.093Z",
      "updatedAt": "2025-08-11T14:39:44.696Z",
      "CompanyId": 1803,
      "CollegeId": 4633,
      "JobApplicants": [
        {
          "id": 72362,
          "UserId": 57312,
          "JobOpeningId": 6986,
          "status": 9,
          "interviewDate": null,
          "ctcOffered": null,
          "yoe": null,
          "rejectionReason": null,
          "createdAt": "2025-07-12T09:03:41.980Z",
          "updatedAt": "2025-08-11T14:39:44.682Z",
          "JobApplicantStatuses": [
            {
              "id": 176262,
              "JobApplicantId": 72362,
              "status": 9,
              "date": "2025-08-11T14:39:44.681Z",
              "createdAt": "2025-08-11T14:39:44.682Z",
              "updatedAt": "2025-08-11T14:39:44.682Z"
            },
            {
              "id": 171584,
              "JobApplicantId": 72362,
              "status": 1,
              "date": "2025-07-12T09:03:41.982Z",
              "createdAt": "2025-07-12T09:03:41.982Z",
              "updatedAt": "2025-07-12T09:03:41.982Z"
            }
          ]
        }
      ],
      "JobLocations": [
        {
          "id": 16504,
          "name": "Gurgaon",
          "JobOpeningId": 6986,
          "createdAt": "2025-07-08T09:08:57.098Z",
          "updatedAt": "2025-07-08T09:08:57.098Z"
        }
      ],
      "JobRole": {
        "id": 1,
        "name": "Frontend Engineer",
        "createdAt": "2023-02-23T11:10:53.498Z",
        "updatedAt": "2023-06-27T12:03:29.887Z"
      },
      "Company": {
        "id": 1803,
        "name": "Zupee",
        "logo": null,
        "pocName": "Shivam",
        "pocNumber": "8979486153",
        "pocEmail": "shivam.sharma@zupee.com",
        "campusNexaRecommended": null,
        "createdAt": "2025-07-08T09:04:55.096Z",
        "updatedAt": "2025-07-08T09:04:55.096Z",
        "CampusNexaCompanyRefId": null,
        "CreatedById": 46492,
        "CollegeId": 4633
      }
    },
    {
      "id": 3645,
      "companyName": "Squareboat",
      "minCTC": 6,
      "maxCTC": 11,
      "expirationDateTime": "2025-06-23T05:49:00.000Z",
      "description": "<h2>CANDIDATES SHOULD HAVE MINIMUM 2 YEAR EXP IN REACT JS OR FULL STACK. 1 ALUMNI JUST GOT PLACED. INTERVIEW FACE TO FACE</h2>",
      "newDescription": {
        "type": "doc",
        "content": [
          {
            "type": "heading",
            "attrs": {
              "level": 2,
              "textAlign": null
            },
            "content": [
              {
                "text": "CANDIDATES SHOULD HAVE MINIMUM 2 YEAR EXP IN REACT JS OR FULL STACK. 1 ALUMNI JUST GOT PLACED. INTERVIEW FACE TO FACE",
                "type": "text"
              }
            ]
          }
        ]
      },
      "alertMessage": null,
      "alertConfirmationMessage": null,
      "JobRoleId": 1,
      "yearsOfExperience": 0,
      "status": 4,
      "closedReasonType": 5,
      "closedReason": "not bjiring now",
      "showCompanyToStudents": true,
      "companyPOCEmail": "pujajaiswal@14453gmail.com",
      "isPrivate": false,
      "offersInternship": false,
      "internshipDuration": 0,
      "internshipStipend": 0,
      "isAlumniJob": false,
      "isProCompany": true,
      "isJobPortal": false,
      "jobTags": null,
      "jobRedirectionLink": null,
      "category": null,
      "domain": null,
      "size": null,
      "bootstrappedOrFunded": null,
      "revenue": null,
      "source": null,
      "createdAt": "2024-04-25T11:47:29.756Z",
      "updatedAt": "2025-07-18T11:42:44.035Z",
      "CompanyId": 1389,
      "CollegeId": 4633,
      "JobApplicants": [
        {
          "id": 66842,
          "UserId": 57312,
          "JobOpeningId": 3645,
          "status": 9,
          "interviewDate": null,
          "ctcOffered": null,
          "yoe": null,
          "rejectionReason": null,
          "createdAt": "2025-04-11T21:39:23.864Z",
          "updatedAt": "2025-06-16T06:06:09.057Z",
          "JobApplicantStatuses": [
            {
              "id": 167807,
              "JobApplicantId": 66842,
              "status": 9,
              "date": "2025-06-16T06:06:09.056Z",
              "createdAt": "2025-06-16T06:06:09.058Z",
              "updatedAt": "2025-06-16T06:06:09.058Z"
            },
            {
              "id": 157952,
              "JobApplicantId": 66842,
              "status": 1,
              "date": "2025-04-11T21:39:23.869Z",
              "createdAt": "2025-04-11T21:39:23.869Z",
              "updatedAt": "2025-04-11T21:39:23.869Z"
            }
          ]
        }
      ],
      "JobLocations": [
        {
          "id": 15301,
          "name": "Gurgaon",
          "JobOpeningId": 3645,
          "createdAt": "2025-05-08T05:37:52.231Z",
          "updatedAt": "2025-05-08T05:37:52.231Z"
        }
      ],
      "JobRole": {
        "id": 1,
        "name": "Frontend Engineer",
        "createdAt": "2023-02-23T11:10:53.498Z",
        "updatedAt": "2023-06-27T12:03:29.887Z"
      },
      "Company": {
        "id": 1389,
        "name": "Squareboat",
        "logo": null,
        "pocName": "Manika",
        "pocNumber": "9528350058",
        "pocEmail": null,
        "campusNexaRecommended": null,
        "createdAt": "2025-03-27T08:33:09.940Z",
        "updatedAt": "2025-03-27T08:33:09.940Z",
        "CampusNexaCompanyRefId": null,
        "CreatedById": 46492,
        "CollegeId": 4633
      }
    },
    {
      "id": 2404,
      "companyName": "Sketch Brahma Technologies",
      "minCTC": 4,
      "maxCTC": 4.5,
      "expirationDateTime": "2025-06-20T12:40:00.000Z",
      "description": "<h2>looking for both backends and full-stack.Candidates who have done core java ,kindly apply</h2>",
      "newDescription": {
        "type": "doc",
        "content": [
          {
            "type": "heading",
            "attrs": {
              "level": 2,
              "textAlign": null
            },
            "content": [
              {
                "text": "looking for both backends and full-stack.Candidates who have done core java ,kindly apply",
                "type": "text"
              }
            ]
          }
        ]
      },
      "alertMessage": null,
      "alertConfirmationMessage": null,
      "JobRoleId": 2,
      "yearsOfExperience": 0,
      "status": 4,
      "closedReasonType": 3,
      "closedReason": ".",
      "showCompanyToStudents": true,
      "companyPOCEmail": "abishek@sketchbrahma.com",
      "isPrivate": false,
      "offersInternship": false,
      "internshipDuration": 0,
      "internshipStipend": 0,
      "isAlumniJob": false,
      "isProCompany": false,
      "isJobPortal": false,
      "jobTags": null,
      "jobRedirectionLink": null,
      "category": null,
      "domain": null,
      "size": null,
      "bootstrappedOrFunded": null,
      "revenue": null,
      "source": null,
      "createdAt": "2023-10-30T14:59:54.379Z",
      "updatedAt": "2025-09-05T09:36:02.945Z",
      "CompanyId": null,
      "CollegeId": 4633,
      "JobApplicants": [
        {
          "id": 67551,
          "UserId": 57312,
          "JobOpeningId": 2404,
          "status": 9,
          "interviewDate": null,
          "ctcOffered": null,
          "yoe": null,
          "rejectionReason": null,
          "createdAt": "2025-04-24T02:56:41.592Z",
          "updatedAt": "2025-05-14T05:47:21.696Z",
          "JobApplicantStatuses": [
            {
              "id": 161483,
              "JobApplicantId": 67551,
              "status": 9,
              "date": "2025-05-14T05:47:21.694Z",
              "createdAt": "2025-05-14T05:47:21.697Z",
              "updatedAt": "2025-05-14T05:47:21.697Z"
            },
            {
              "id": 159498,
              "JobApplicantId": 67551,
              "status": 1,
              "date": "2025-04-24T02:56:41.596Z",
              "createdAt": "2025-04-24T02:56:41.596Z",
              "updatedAt": "2025-04-24T02:56:41.596Z"
            }
          ]
        }
      ],
      "JobLocations": [
        {
          "id": 16259,
          "name": "Bangalore",
          "JobOpeningId": 2404,
          "createdAt": "2025-06-19T12:39:10.763Z",
          "updatedAt": "2025-06-19T12:39:10.763Z"
        }
      ],
      "JobRole": {
        "id": 2,
        "name": "Backend Engineer",
        "createdAt": "2023-02-28T09:10:58.719Z",
        "updatedAt": "2023-03-01T12:15:43.646Z"
      },
      "Company": null
    },
    {
      "id": 6670,
      "companyName": "Codalaya er works ",
      "minCTC": 7,
      "maxCTC": 12,
      "expirationDateTime": "2025-06-01T11:50:00.000Z",
      "description": "<h1>Candidate must know Python ( Blockchain)</h1><h1>1.5 year of experience required.</h1><p><br></p>",
      "newDescription": {
        "type": "doc",
        "content": [
          {
            "type": "heading",
            "attrs": {
              "level": 1,
              "textAlign": null
            },
            "content": [
              {
                "text": "Candidate must know Python ( Blockchain)",
                "type": "text"
              }
            ]
          },
          {
            "type": "heading",
            "attrs": {
              "level": 1,
              "textAlign": null
            },
            "content": [
              {
                "text": "1.5 year of experience required.",
                "type": "text"
              }
            ]
          },
          {
            "type": "paragraph",
            "attrs": {
              "textAlign": null
            },
            "content": [
              {
                "type": "hardBreak"
              }
            ]
          }
        ]
      },
      "alertMessage": null,
      "alertConfirmationMessage": null,
      "JobRoleId": 1,
      "yearsOfExperience": 0,
      "status": 4,
      "closedReasonType": 3,
      "closedReason": "did not find  profiles suitable ",
      "showCompanyToStudents": true,
      "companyPOCEmail": "ks203787@gmail.com",
      "isPrivate": false,
      "offersInternship": false,
      "internshipDuration": 0,
      "internshipStipend": 0,
      "isAlumniJob": false,
      "isProCompany": false,
      "isJobPortal": false,
      "jobTags": null,
      "jobRedirectionLink": null,
      "category": null,
      "domain": null,
      "size": null,
      "bootstrappedOrFunded": null,
      "revenue": null,
      "source": null,
      "createdAt": "2025-05-28T11:50:35.622Z",
      "updatedAt": "2025-07-18T11:42:54.648Z",
      "CompanyId": 764,
      "CollegeId": 4633,
      "JobApplicants": [
        {
          "id": 69859,
          "UserId": 57312,
          "JobOpeningId": 6670,
          "status": 9,
          "interviewDate": null,
          "ctcOffered": null,
          "yoe": null,
          "rejectionReason": null,
          "createdAt": "2025-05-31T06:50:08.713Z",
          "updatedAt": "2025-06-03T09:24:35.014Z",
          "JobApplicantStatuses": [
            {
              "id": 165654,
              "JobApplicantId": 69859,
              "status": 9,
              "date": "2025-06-03T09:24:35.014Z",
              "createdAt": "2025-06-03T09:24:35.017Z",
              "updatedAt": "2025-06-03T09:24:35.017Z"
            },
            {
              "id": 164224,
              "JobApplicantId": 69859,
              "status": 1,
              "date": "2025-05-31T06:50:08.720Z",
              "createdAt": "2025-05-31T06:50:08.720Z",
              "updatedAt": "2025-05-31T06:50:08.720Z"
            }
          ]
        }
      ],
      "JobLocations": [
        {
          "id": 15713,
          "name": "Remote",
          "JobOpeningId": 6670,
          "createdAt": "2025-05-28T11:50:35.628Z",
          "updatedAt": "2025-05-28T11:50:35.628Z"
        }
      ],
      "JobRole": {
        "id": 1,
        "name": "Frontend Engineer",
        "createdAt": "2023-02-23T11:10:53.498Z",
        "updatedAt": "2023-06-27T12:03:29.887Z"
      },
      "Company": {
        "id": 764,
        "name": "Codalaya er works ",
        "logo": null,
        "pocName": "Rishi",
        "pocNumber": "8709827980",
        "pocEmail": null,
        "campusNexaRecommended": null,
        "createdAt": "2024-09-25T06:44:23.061Z",
        "updatedAt": "2024-09-25T06:44:23.061Z",
        "CampusNexaCompanyRefId": null,
        "CreatedById": 54536,
        "CollegeId": 4633
      }
    },
    {
      "id": 6484,
      "companyName": "Intellisavvy",
      "minCTC": 4,
      "maxCTC": 10,
      "expirationDateTime": "2025-05-16T06:43:00.000Z",
      "description": "<h2>ONLY EXPERIENCED CANDIDATES SHOULD APPLY .SALARY WILL DEPEND ON LAST CTC AND INTERVIEW PERFORMANCE. IMMEDIATE JOINERS REQUIRED</h2><ul><li>1–4 years of hands-on experience in React.js development.</li><li>Proficient in JavaScript (ES6+), HTML5, and CSS3.</li><li>Familiarity with state management libraries (e.g., Redux, Context API).</li><li>Exposure to or working knowledge of React Native.</li><li>Basic understanding of REST APIs and integration techniques.</li></ul><p><br></p>",
      "newDescription": {
        "type": "doc",
        "content": [
          {
            "type": "heading",
            "attrs": {
              "level": 2,
              "textAlign": null
            },
            "content": [
              {
                "text": "ONLY EXPERIENCED CANDIDATES SHOULD APPLY .SALARY WILL DEPEND ON LAST CTC AND INTERVIEW PERFORMANCE. IMMEDIATE JOINERS REQUIRED",
                "type": "text"
              }
            ]
          },
          {
            "type": "bulletList",
            "content": [
              {
                "type": "listItem",
                "content": [
                  {
                    "type": "paragraph",
                    "attrs": {
                      "textAlign": null
                    },
                    "content": [
                      {
                        "text": "1–4 years of hands-on experience in React.js development.",
                        "type": "text"
                      }
                    ]
                  }
                ]
              },
              {
                "type": "listItem",
                "content": [
                  {
                    "type": "paragraph",
                    "attrs": {
                      "textAlign": null
                    },
                    "content": [
                      {
                        "text": "Proficient in JavaScript (ES6+), HTML5, and CSS3.",
                        "type": "text"
                      }
                    ]
                  }
                ]
              },
              {
                "type": "listItem",
                "content": [
                  {
                    "type": "paragraph",
                    "attrs": {
                      "textAlign": null
                    },
                    "content": [
                      {
                        "text": "Familiarity with state management libraries (e.g., Redux, Context API).",
                        "type": "text"
                      }
                    ]
                  }
                ]
              },
              {
                "type": "listItem",
                "content": [
                  {
                    "type": "paragraph",
                    "attrs": {
                      "textAlign": null
                    },
                    "content": [
                      {
                        "text": "Exposure to or working knowledge of React Native.",
                        "type": "text"
                      }
                    ]
                  }
                ]
              },
              {
                "type": "listItem",
                "content": [
                  {
                    "type": "paragraph",
                    "attrs": {
                      "textAlign": null
                    },
                    "content": [
                      {
                        "text": "Basic understanding of REST APIs and integration techniques.",
                        "type": "text"
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            "type": "paragraph",
            "attrs": {
              "textAlign": null
            },
            "content": [
              {
                "type": "hardBreak"
              }
            ]
          }
        ]
      },
      "alertMessage": null,
      "alertConfirmationMessage": null,
      "JobRoleId": 1,
      "yearsOfExperience": 0,
      "status": 4,
      "closedReasonType": 3,
      "closedReason": "dns",
      "showCompanyToStudents": true,
      "companyPOCEmail": "jhansi.nimmakayala@intellisavvy.com",
      "isPrivate": false,
      "offersInternship": false,
      "internshipDuration": 0,
      "internshipStipend": 0,
      "isAlumniJob": false,
      "isProCompany": false,
      "isJobPortal": false,
      "jobTags": null,
      "jobRedirectionLink": null,
      "category": null,
      "domain": null,
      "size": null,
      "bootstrappedOrFunded": null,
      "revenue": null,
      "source": null,
      "createdAt": "2025-05-07T11:55:55.718Z",
      "updatedAt": "2025-07-18T11:42:46.134Z",
      "CompanyId": 1564,
      "CollegeId": 4633,
      "JobApplicants": [
        {
          "id": 68203,
          "UserId": 57312,
          "JobOpeningId": 6484,
          "status": 9,
          "interviewDate": null,
          "ctcOffered": null,
          "yoe": null,
          "rejectionReason": null,
          "createdAt": "2025-05-07T19:55:00.116Z",
          "updatedAt": "2025-06-04T08:56:58.331Z",
          "JobApplicantStatuses": [
            {
              "id": 166145,
              "JobApplicantId": 68203,
              "status": 9,
              "date": "2025-06-04T08:56:58.329Z",
              "createdAt": "2025-06-04T08:56:58.332Z",
              "updatedAt": "2025-06-04T08:56:58.332Z"
            },
            {
              "id": 160833,
              "JobApplicantId": 68203,
              "status": 2,
              "date": "2025-05-08T06:33:18.129Z",
              "createdAt": "2025-05-08T06:33:18.397Z",
              "updatedAt": "2025-05-08T06:33:18.397Z"
            },
            {
              "id": 160781,
              "JobApplicantId": 68203,
              "status": 1,
              "date": "2025-05-07T19:55:00.119Z",
              "createdAt": "2025-05-07T19:55:00.120Z",
              "updatedAt": "2025-05-07T19:55:00.120Z"
            }
          ]
        }
      ],
      "JobLocations": [
        {
          "id": 15277,
          "name": "Remote",
          "JobOpeningId": 6484,
          "createdAt": "2025-05-07T11:57:31.774Z",
          "updatedAt": "2025-05-07T11:57:31.774Z"
        }
      ],
      "JobRole": {
        "id": 1,
        "name": "Frontend Engineer",
        "createdAt": "2023-02-23T11:10:53.498Z",
        "updatedAt": "2023-06-27T12:03:29.887Z"
      },
      "Company": {
        "id": 1564,
        "name": "Intellisavvy",
        "logo": null,
        "pocName": "Jhansi",
        "pocNumber": "8712641136",
        "pocEmail": "jhansi.nimmakayala@intellisavvy.com",
        "campusNexaRecommended": null,
        "createdAt": "2025-05-07T11:54:04.828Z",
        "updatedAt": "2025-05-07T11:54:04.828Z",
        "CampusNexaCompanyRefId": null,
        "CreatedById": 46492,
        "CollegeId": 4633
      }
    },
    {
      "id": 6488,
      "companyName": "Dayzero.ai",
      "minCTC": 4,
      "maxCTC": 9,
      "expirationDateTime": "2025-05-10T06:24:00.000Z",
      "description": null,
      "newDescription": null,
      "alertMessage": "<p><strong>Role- Full stack developer</strong></p><p><strong>CTC depends on your performance</strong></p>",
      "alertConfirmationMessage": null,
      "JobRoleId": 1,
      "yearsOfExperience": 0,
      "status": 4,
      "closedReasonType": 3,
      "closedReason": "not shortlisted",
      "showCompanyToStudents": true,
      "companyPOCEmail": "alankrit@dayzero.ai",
      "isPrivate": false,
      "offersInternship": false,
      "internshipDuration": 0,
      "internshipStipend": 0,
      "isAlumniJob": false,
      "isProCompany": false,
      "isJobPortal": false,
      "jobTags": null,
      "jobRedirectionLink": null,
      "category": null,
      "domain": null,
      "size": null,
      "bootstrappedOrFunded": null,
      "revenue": null,
      "source": null,
      "createdAt": "2025-05-08T06:24:03.032Z",
      "updatedAt": "2025-06-02T11:44:33.818Z",
      "CompanyId": 1566,
      "CollegeId": 4633,
      "JobApplicants": [
        {
          "id": 68257,
          "UserId": 57312,
          "JobOpeningId": 6488,
          "status": 9,
          "interviewDate": null,
          "ctcOffered": null,
          "yoe": null,
          "rejectionReason": null,
          "createdAt": "2025-05-08T10:25:37.671Z",
          "updatedAt": "2025-06-02T11:44:33.788Z",
          "JobApplicantStatuses": [
            {
              "id": 164989,
              "JobApplicantId": 68257,
              "status": 9,
              "date": "2025-06-02T11:44:33.786Z",
              "createdAt": "2025-06-02T11:44:33.788Z",
              "updatedAt": "2025-06-02T11:44:33.788Z"
            },
            {
              "id": 160892,
              "JobApplicantId": 68257,
              "status": 1,
              "date": "2025-05-08T10:25:37.674Z",
              "createdAt": "2025-05-08T10:25:37.674Z",
              "updatedAt": "2025-05-08T10:25:37.674Z"
            }
          ]
        }
      ],
      "JobLocations": [
        {
          "id": 15310,
          "name": "Remote",
          "JobOpeningId": 6488,
          "createdAt": "2025-05-08T06:24:03.037Z",
          "updatedAt": "2025-05-08T06:24:03.037Z"
        }
      ],
      "JobRole": {
        "id": 1,
        "name": "Frontend Engineer",
        "createdAt": "2023-02-23T11:10:53.498Z",
        "updatedAt": "2023-06-27T12:03:29.887Z"
      },
      "Company": {
        "id": 1566,
        "name": "Dayzero.ai",
        "logo": null,
        "pocName": "alankrit utkarsh",
        "pocNumber": "9315135640",
        "pocEmail": "alankrit@dayzero.ai",
        "campusNexaRecommended": null,
        "createdAt": "2025-05-08T06:22:25.673Z",
        "updatedAt": "2025-05-08T06:22:25.673Z",
        "CampusNexaCompanyRefId": null,
        "CreatedById": 25244,
        "CollegeId": 4633
      }
    },
    {
      "id": 6313,
      "companyName": "NutriTap",
      "minCTC": 5,
      "maxCTC": 8,
      "expirationDateTime": "2025-05-04T07:31:00.000Z",
      "description": "<h2>FOR FRESHERS INTERNSHIP OF 15 -20 K PER MONTHS FOR 6 MONTHS THEN MINIMUM OF 5 L.P.A AND FOR EXPERIENCED 6-8 L.P.A directly</h2>",
      "newDescription": {
        "type": "doc",
        "content": [
          {
            "type": "heading",
            "attrs": {
              "level": 2,
              "textAlign": null
            },
            "content": [
              {
                "text": "FOR FRESHERS INTERNSHIP OF 15 -20 K PER MONTHS FOR 6 MONTHS THEN MINIMUM OF 5 L.P.A AND FOR EXPERIENCED 6-8 L.P.A directly",
                "type": "text"
              }
            ]
          }
        ]
      },
      "alertMessage": null,
      "alertConfirmationMessage": null,
      "JobRoleId": 1,
      "yearsOfExperience": 0,
      "status": 4,
      "closedReasonType": 3,
      "closedReason": "nt st",
      "showCompanyToStudents": true,
      "companyPOCEmail": "hr@nutritap.in",
      "isPrivate": false,
      "offersInternship": true,
      "internshipDuration": 6,
      "internshipStipend": 15,
      "isAlumniJob": false,
      "isProCompany": true,
      "isJobPortal": false,
      "jobTags": null,
      "jobRedirectionLink": null,
      "category": null,
      "domain": null,
      "size": null,
      "bootstrappedOrFunded": null,
      "revenue": null,
      "source": null,
      "createdAt": "2025-04-14T08:29:22.641Z",
      "updatedAt": "2025-07-18T11:42:44.025Z",
      "CompanyId": 1473,
      "CollegeId": 4633,
      "JobApplicants": [
        {
          "id": 66951,
          "UserId": 57312,
          "JobOpeningId": 6313,
          "status": 9,
          "interviewDate": null,
          "ctcOffered": null,
          "yoe": null,
          "rejectionReason": null,
          "createdAt": "2025-04-15T08:24:17.659Z",
          "updatedAt": "2025-06-04T08:59:53.200Z",
          "JobApplicantStatuses": [
            {
              "id": 166217,
              "JobApplicantId": 66951,
              "status": 9,
              "date": "2025-06-04T08:59:53.198Z",
              "createdAt": "2025-06-04T08:59:53.200Z",
              "updatedAt": "2025-06-04T08:59:53.200Z"
            },
            {
              "id": 158201,
              "JobApplicantId": 66951,
              "status": 2,
              "date": "2025-04-15T10:38:34.300Z",
              "createdAt": "2025-04-15T10:38:10.206Z",
              "updatedAt": "2025-04-15T10:38:10.206Z"
            },
            {
              "id": 158175,
              "JobApplicantId": 66951,
              "status": 1,
              "date": "2025-04-15T08:24:17.662Z",
              "createdAt": "2025-04-15T08:24:17.662Z",
              "updatedAt": "2025-04-15T08:24:17.662Z"
            }
          ]
        }
      ],
      "JobLocations": [
        {
          "id": 14792,
          "name": "Gurgaon",
          "JobOpeningId": 6313,
          "createdAt": "2025-04-15T08:15:40.893Z",
          "updatedAt": "2025-04-15T08:15:40.893Z"
        }
      ],
      "JobRole": {
        "id": 1,
        "name": "Frontend Engineer",
        "createdAt": "2023-02-23T11:10:53.498Z",
        "updatedAt": "2023-06-27T12:03:29.887Z"
      },
      "Company": {
        "id": 1473,
        "name": "NutriTap",
        "logo": null,
        "pocName": "Sangeeta",
        "pocNumber": "9822439681",
        "pocEmail": "hr@nutritap.in",
        "campusNexaRecommended": null,
        "createdAt": "2025-04-14T08:26:17.556Z",
        "updatedAt": "2025-04-14T08:26:49.295Z",
        "CampusNexaCompanyRefId": null,
        "CreatedById": 46492,
        "CollegeId": 4633
      }
    },
    {
      "id": 4036,
      "companyName": "Appiness",
      "minCTC": 8,
      "maxCTC": 11,
      "expirationDateTime": "2025-05-04T07:11:00.000Z",
      "description": null,
      "newDescription": null,
      "alertMessage": "<h2><strong>This is for experienced candidates</strong></h2><h2><strong>CTC depends on ur last ctc and experience</strong></h2>",
      "alertConfirmationMessage": null,
      "JobRoleId": 1,
      "yearsOfExperience": 0,
      "status": 4,
      "closedReasonType": 3,
      "closedReason": "not shortlisted",
      "showCompanyToStudents": true,
      "companyPOCEmail": "arvind@appinessworld.com",
      "isPrivate": false,
      "offersInternship": false,
      "internshipDuration": 0,
      "internshipStipend": 0,
      "isAlumniJob": false,
      "isProCompany": false,
      "isJobPortal": false,
      "jobTags": null,
      "jobRedirectionLink": null,
      "category": null,
      "domain": null,
      "size": null,
      "bootstrappedOrFunded": null,
      "revenue": null,
      "source": null,
      "createdAt": "2024-06-10T12:07:48.602Z",
      "updatedAt": "2025-06-02T11:42:32.875Z",
      "CompanyId": 11,
      "CollegeId": 4633,
      "JobApplicants": [
        {
          "id": 67866,
          "UserId": 57312,
          "JobOpeningId": 4036,
          "status": 9,
          "interviewDate": null,
          "ctcOffered": null,
          "yoe": null,
          "rejectionReason": null,
          "createdAt": "2025-05-01T08:59:00.020Z",
          "updatedAt": "2025-06-02T11:42:32.841Z",
          "JobApplicantStatuses": [
            {
              "id": 164879,
              "JobApplicantId": 67866,
              "status": 9,
              "date": "2025-06-02T11:42:32.840Z",
              "createdAt": "2025-06-02T11:42:32.841Z",
              "updatedAt": "2025-06-02T11:42:32.841Z"
            },
            {
              "id": 160140,
              "JobApplicantId": 67866,
              "status": 1,
              "date": "2025-05-01T08:59:00.023Z",
              "createdAt": "2025-05-01T08:59:00.023Z",
              "updatedAt": "2025-05-01T08:59:00.023Z"
            }
          ]
        }
      ],
      "JobLocations": [
        {
          "id": 15130,
          "name": "Bangalore",
          "JobOpeningId": 4036,
          "createdAt": "2025-05-01T07:11:45.997Z",
          "updatedAt": "2025-05-01T07:11:45.997Z"
        }
      ],
      "JobRole": {
        "id": 1,
        "name": "Frontend Engineer",
        "createdAt": "2023-02-23T11:10:53.498Z",
        "updatedAt": "2023-06-27T12:03:29.887Z"
      },
      "Company": {
        "id": 11,
        "name": "Appiness",
        "logo": "https://sharpener.blob.core.windows.net/companylogos/appiness.png",
        "pocName": null,
        "pocNumber": null,
        "pocEmail": null,
        "campusNexaRecommended": null,
        "createdAt": "2022-03-31T08:46:47.304Z",
        "updatedAt": "2022-03-31T08:46:47.304Z",
        "CampusNexaCompanyRefId": null,
        "CreatedById": null,
        "CollegeId": 4633
      }
    },
    {
      "id": 6447,
      "companyName": "Newtown School",
      "minCTC": 6,
      "maxCTC": 9,
      "expirationDateTime": "2025-05-03T12:23:00.000Z",
      "description": "<h2>Candidates should have  minimum 1-2 years experience in   REACT  js + NEXT JS</h2><p><br></p>",
      "newDescription": {
        "type": "doc",
        "content": [
          {
            "type": "heading",
            "attrs": {
              "level": 2,
              "textAlign": null
            },
            "content": [
              {
                "text": "Candidates should have minimum 1-2 years experience in REACT js + NEXT JS",
                "type": "text"
              }
            ]
          },
          {
            "type": "paragraph",
            "attrs": {
              "textAlign": null
            },
            "content": [
              {
                "type": "hardBreak"
              }
            ]
          }
        ]
      },
      "alertMessage": null,
      "alertConfirmationMessage": null,
      "JobRoleId": 1,
      "yearsOfExperience": 0,
      "status": 4,
      "closedReasonType": 5,
      "closedReason": "nt reach",
      "showCompanyToStudents": true,
      "companyPOCEmail": "gkapatia@newtonschool.co",
      "isPrivate": false,
      "offersInternship": false,
      "internshipDuration": 0,
      "internshipStipend": 0,
      "isAlumniJob": false,
      "isProCompany": true,
      "isJobPortal": false,
      "jobTags": null,
      "jobRedirectionLink": null,
      "category": null,
      "domain": null,
      "size": null,
      "bootstrappedOrFunded": null,
      "revenue": null,
      "source": null,
      "createdAt": "2025-04-30T06:28:31.936Z",
      "updatedAt": "2025-07-18T11:42:44.028Z",
      "CompanyId": 1540,
      "CollegeId": 4633,
      "JobApplicants": [
        {
          "id": 67867,
          "UserId": 57312,
          "JobOpeningId": 6447,
          "status": 9,
          "interviewDate": null,
          "ctcOffered": null,
          "yoe": null,
          "rejectionReason": null,
          "createdAt": "2025-05-01T08:59:54.811Z",
          "updatedAt": "2025-05-27T09:09:22.927Z",
          "JobApplicantStatuses": [
            {
              "id": 163408,
              "JobApplicantId": 67867,
              "status": 9,
              "date": "2025-05-27T09:09:22.927Z",
              "createdAt": "2025-05-27T09:09:22.927Z",
              "updatedAt": "2025-05-27T09:09:22.927Z"
            },
            {
              "id": 160232,
              "JobApplicantId": 67867,
              "status": 2,
              "date": "2025-05-02T08:01:30.270Z",
              "createdAt": "2025-05-02T08:01:30.623Z",
              "updatedAt": "2025-05-02T08:01:30.623Z"
            },
            {
              "id": 160141,
              "JobApplicantId": 67867,
              "status": 1,
              "date": "2025-05-01T08:59:54.814Z",
              "createdAt": "2025-05-01T08:59:54.814Z",
              "updatedAt": "2025-05-01T08:59:54.814Z"
            }
          ]
        }
      ],
      "JobLocations": [
        {
          "id": 15101,
          "name": "Gurgaon",
          "JobOpeningId": 6447,
          "createdAt": "2025-04-30T06:28:31.942Z",
          "updatedAt": "2025-04-30T06:28:31.942Z"
        }
      ],
      "JobRole": {
        "id": 1,
        "name": "Frontend Engineer",
        "createdAt": "2023-02-23T11:10:53.498Z",
        "updatedAt": "2023-06-27T12:03:29.887Z"
      },
      "Company": {
        "id": 1540,
        "name": "Newtown School",
        "logo": null,
        "pocName": "Gaurav",
        "pocNumber": "08859583092",
        "pocEmail": "gkapatia@newtonschool.co",
        "campusNexaRecommended": null,
        "createdAt": "2025-04-30T06:25:55.811Z",
        "updatedAt": "2025-04-30T06:25:55.811Z",
        "CampusNexaCompanyRefId": null,
        "CreatedById": 46492,
        "CollegeId": 4633
      }
    },
    {
      "id": 4133,
      "companyName": "SquareOps",
      "minCTC": 5,
      "maxCTC": 6,
      "expirationDateTime": "2025-05-01T05:54:00.000Z",
      "description": "<h2>STIPEND OF 15 - 20 K PER MONTH FOR 6 MONTHS THEN 5-6 L.P.A. ONLY FOR CANDIDATES WHO KNOW REACT + PYTHON /DJANGO</h2>",
      "newDescription": {
        "type": "doc",
        "content": [
          {
            "type": "heading",
            "attrs": {
              "level": 2,
              "textAlign": null
            },
            "content": [
              {
                "text": "STIPEND OF 15 - 20 K PER MONTH FOR 6 MONTHS THEN 5-6 L.P.A. ONLY FOR CANDIDATES WHO KNOW REACT + PYTHON /DJANGO",
                "type": "text"
              }
            ]
          }
        ]
      },
      "alertMessage": null,
      "alertConfirmationMessage": null,
      "JobRoleId": 1,
      "yearsOfExperience": 0,
      "status": 4,
      "closedReasonType": 5,
      "closedReason": "nt reach",
      "showCompanyToStudents": true,
      "companyPOCEmail": "nandan.jha@squareops.com",
      "isPrivate": false,
      "offersInternship": true,
      "internshipDuration": 6,
      "internshipStipend": 15,
      "isAlumniJob": false,
      "isProCompany": false,
      "isJobPortal": false,
      "jobTags": null,
      "jobRedirectionLink": null,
      "category": null,
      "domain": null,
      "size": null,
      "bootstrappedOrFunded": null,
      "revenue": null,
      "source": null,
      "createdAt": "2024-06-20T07:43:46.390Z",
      "updatedAt": "2025-07-18T11:41:52.546Z",
      "CompanyId": 189,
      "CollegeId": 4633,
      "JobApplicants": [
        {
          "id": 67550,
          "UserId": 57312,
          "JobOpeningId": 4133,
          "status": 9,
          "interviewDate": null,
          "ctcOffered": null,
          "yoe": null,
          "rejectionReason": null,
          "createdAt": "2025-04-24T02:54:35.738Z",
          "updatedAt": "2025-05-27T08:58:24.680Z",
          "JobApplicantStatuses": [
            {
              "id": 163285,
              "JobApplicantId": 67550,
              "status": 9,
              "date": "2025-05-27T08:58:24.679Z",
              "createdAt": "2025-05-27T08:58:24.680Z",
              "updatedAt": "2025-05-27T08:58:24.680Z"
            },
            {
              "id": 159497,
              "JobApplicantId": 67550,
              "status": 1,
              "date": "2025-04-24T02:54:35.742Z",
              "createdAt": "2025-04-24T02:54:35.742Z",
              "updatedAt": "2025-04-24T02:54:35.742Z"
            }
          ]
        }
      ],
      "JobLocations": [
        {
          "id": 14782,
          "name": "Gurgaon",
          "JobOpeningId": 4133,
          "createdAt": "2025-04-15T07:03:54.408Z",
          "updatedAt": "2025-04-15T07:03:54.408Z"
        }
      ],
      "JobRole": {
        "id": 1,
        "name": "Frontend Engineer",
        "createdAt": "2023-02-23T11:10:53.498Z",
        "updatedAt": "2023-06-27T12:03:29.887Z"
      },
      "Company": {
        "id": 189,
        "name": "SquareOps",
        "logo": null,
        "pocName": "Anshu",
        "pocNumber": "8800907226",
        "pocEmail": "anshu@squareops.com",
        "campusNexaRecommended": null,
        "createdAt": "2024-06-20T07:38:47.184Z",
        "updatedAt": "2024-06-20T07:38:47.184Z",
        "CampusNexaCompanyRefId": null,
        "CreatedById": 46492,
        "CollegeId": 4633
      }
    },
    {
      "id": 6314,
      "companyName": "Massive Mobility",
      "minCTC": 4,
      "maxCTC": 7.5,
      "expirationDateTime": "2025-04-27T05:47:00.000Z",
      "description": "<h1>They are looking for minimum 1 year experienced candidate into react js .</h1><h2>for candidates from 0 - 6 months exp -20 k for 6 months then 4 - 5 l.p.a</h2>",
      "newDescription": {
        "type": "doc",
        "content": [
          {
            "type": "heading",
            "attrs": {
              "level": 1,
              "textAlign": null
            },
            "content": [
              {
                "text": "They are looking for minimum 1 year experienced candidate into react js .",
                "type": "text"
              }
            ]
          },
          {
            "type": "heading",
            "attrs": {
              "level": 2,
              "textAlign": null
            },
            "content": [
              {
                "text": "for candidates from 0 - 6 months exp -20 k for 6 months then 4 - 5 l.p.a",
                "type": "text"
              }
            ]
          }
        ]
      },
      "alertMessage": null,
      "alertConfirmationMessage": null,
      "JobRoleId": 1,
      "yearsOfExperience": 0,
      "status": 4,
      "closedReasonType": 5,
      "closedReason": "no resp",
      "showCompanyToStudents": true,
      "companyPOCEmail": "sumita@gomassive.org",
      "isPrivate": false,
      "offersInternship": true,
      "internshipDuration": 6,
      "internshipStipend": 20,
      "isAlumniJob": false,
      "isProCompany": false,
      "isJobPortal": false,
      "jobTags": null,
      "jobRedirectionLink": null,
      "category": null,
      "domain": null,
      "size": null,
      "bootstrappedOrFunded": null,
      "revenue": null,
      "source": null,
      "createdAt": "2025-04-14T09:19:16.273Z",
      "updatedAt": "2025-07-18T11:42:29.179Z",
      "CompanyId": 1365,
      "CollegeId": 4633,
      "JobApplicants": [
        {
          "id": 66952,
          "UserId": 57312,
          "JobOpeningId": 6314,
          "status": 9,
          "interviewDate": null,
          "ctcOffered": null,
          "yoe": null,
          "rejectionReason": null,
          "createdAt": "2025-04-15T08:49:37.751Z",
          "updatedAt": "2025-05-27T09:01:33.223Z",
          "JobApplicantStatuses": [
            {
              "id": 163347,
              "JobApplicantId": 66952,
              "status": 9,
              "date": "2025-05-27T09:01:33.223Z",
              "createdAt": "2025-05-27T09:01:33.224Z",
              "updatedAt": "2025-05-27T09:01:33.224Z"
            },
            {
              "id": 159685,
              "JobApplicantId": 66952,
              "status": 2,
              "date": "2025-04-25T10:18:38.759Z",
              "createdAt": "2025-04-25T10:18:39.413Z",
              "updatedAt": "2025-04-25T10:18:39.413Z"
            },
            {
              "id": 158179,
              "JobApplicantId": 66952,
              "status": 1,
              "date": "2025-04-15T08:49:37.754Z",
              "createdAt": "2025-04-15T08:49:37.755Z",
              "updatedAt": "2025-04-15T08:49:37.755Z"
            }
          ]
        }
      ],
      "JobLocations": [
        {
          "id": 14794,
          "name": "Gurgaon",
          "JobOpeningId": 6314,
          "createdAt": "2025-04-15T08:26:32.121Z",
          "updatedAt": "2025-04-15T08:26:32.121Z"
        }
      ],
      "JobRole": {
        "id": 1,
        "name": "Frontend Engineer",
        "createdAt": "2023-02-23T11:10:53.498Z",
        "updatedAt": "2023-06-27T12:03:29.887Z"
      },
      "Company": {
        "id": 1365,
        "name": "Massive Mobility",
        "logo": null,
        "pocName": "Sumita",
        "pocNumber": "9891327656",
        "pocEmail": "sumita@gomassive.org",
        "campusNexaRecommended": null,
        "createdAt": "2025-03-17T09:03:09.606Z",
        "updatedAt": "2025-03-17T09:03:09.606Z",
        "CampusNexaCompanyRefId": null,
        "CreatedById": 46492,
        "CollegeId": 4633
      }
    },
    {
      "id": 6395,
      "companyName": "MakeForms",
      "minCTC": 7,
      "maxCTC": 12,
      "expirationDateTime": "2025-04-26T10:27:00.000Z",
      "description": null,
      "newDescription": null,
      "alertMessage": "<h2><strong>This is for experienced candidates</strong></h2><h2><strong>CTC depends on ur last CTC</strong></h2>",
      "alertConfirmationMessage": null,
      "JobRoleId": 1,
      "yearsOfExperience": 0,
      "status": 4,
      "closedReasonType": 3,
      "closedReason": "not shortlisted",
      "showCompanyToStudents": true,
      "companyPOCEmail": "hr@pratik.com",
      "isPrivate": false,
      "offersInternship": false,
      "internshipDuration": 0,
      "internshipStipend": 0,
      "isAlumniJob": false,
      "isProCompany": false,
      "isJobPortal": false,
      "jobTags": null,
      "jobRedirectionLink": null,
      "category": null,
      "domain": null,
      "size": null,
      "bootstrappedOrFunded": null,
      "revenue": null,
      "source": null,
      "createdAt": "2025-04-24T10:27:25.976Z",
      "updatedAt": "2025-06-02T11:26:56.553Z",
      "CompanyId": 1519,
      "CollegeId": 4633,
      "JobApplicants": [
        {
          "id": 67602,
          "UserId": 57312,
          "JobOpeningId": 6395,
          "status": 9,
          "interviewDate": null,
          "ctcOffered": null,
          "yoe": null,
          "rejectionReason": null,
          "createdAt": "2025-04-24T18:14:59.527Z",
          "updatedAt": "2025-06-02T11:26:56.523Z",
          "JobApplicantStatuses": [
            {
              "id": 164551,
              "JobApplicantId": 67602,
              "status": 9,
              "date": "2025-06-02T11:26:56.522Z",
              "createdAt": "2025-06-02T11:26:56.523Z",
              "updatedAt": "2025-06-02T11:26:56.523Z"
            },
            {
              "id": 159631,
              "JobApplicantId": 67602,
              "status": 1,
              "date": "2025-04-24T18:14:59.530Z",
              "createdAt": "2025-04-24T18:14:59.530Z",
              "updatedAt": "2025-04-24T18:14:59.530Z"
            }
          ]
        }
      ],
      "JobLocations": [
        {
          "id": 14998,
          "name": "Mumbai",
          "JobOpeningId": 6395,
          "createdAt": "2025-04-24T10:27:25.981Z",
          "updatedAt": "2025-04-24T10:27:25.981Z"
        }
      ],
      "JobRole": {
        "id": 1,
        "name": "Frontend Engineer",
        "createdAt": "2023-02-23T11:10:53.498Z",
        "updatedAt": "2023-06-27T12:03:29.887Z"
      },
      "Company": {
        "id": 1519,
        "name": "MakeForms",
        "logo": null,
        "pocName": "Pratik",
        "pocNumber": "9769269685",
        "pocEmail": "hr@pratik.com",
        "campusNexaRecommended": null,
        "createdAt": "2025-04-24T10:26:28.564Z",
        "updatedAt": "2025-04-24T10:26:28.564Z",
        "CampusNexaCompanyRefId": null,
        "CreatedById": 25244,
        "CollegeId": 4633
      }
    },
    {
      "id": 6176,
      "companyName": "Propacity",
      "minCTC": 8,
      "maxCTC": 15,
      "expirationDateTime": "2025-04-25T10:17:00.000Z",
      "description": null,
      "newDescription": null,
      "alertMessage": "<h2><strong>Mode- Hybrid, whenever the tech team calls you to the office, you will have to go.</strong></h2><h2><strong>Min 1 year of exp</strong></h2><h2><strong>No budget constraint but candidate should be from product based company</strong></h2>",
      "alertConfirmationMessage": null,
      "JobRoleId": 1,
      "yearsOfExperience": 0,
      "status": 4,
      "closedReasonType": 3,
      "closedReason": "not shortlisted",
      "showCompanyToStudents": true,
      "companyPOCEmail": "hr@propacity.com",
      "isPrivate": false,
      "offersInternship": false,
      "internshipDuration": 0,
      "internshipStipend": 0,
      "isAlumniJob": false,
      "isProCompany": false,
      "isJobPortal": false,
      "jobTags": null,
      "jobRedirectionLink": null,
      "category": null,
      "domain": null,
      "size": null,
      "bootstrappedOrFunded": null,
      "revenue": null,
      "source": null,
      "createdAt": "2025-04-01T11:58:58.873Z",
      "updatedAt": "2025-06-02T11:30:37.213Z",
      "CompanyId": 201,
      "CollegeId": 4633,
      "JobApplicants": [
        {
          "id": 66964,
          "UserId": 57312,
          "JobOpeningId": 6176,
          "status": 9,
          "interviewDate": null,
          "ctcOffered": null,
          "yoe": null,
          "rejectionReason": null,
          "createdAt": "2025-04-15T09:20:21.101Z",
          "updatedAt": "2025-06-02T11:30:37.183Z",
          "JobApplicantStatuses": [
            {
              "id": 164617,
              "JobApplicantId": 66964,
              "status": 9,
              "date": "2025-06-02T11:30:37.181Z",
              "createdAt": "2025-06-02T11:30:37.184Z",
              "updatedAt": "2025-06-02T11:30:37.184Z"
            },
            {
              "id": 158191,
              "JobApplicantId": 66964,
              "status": 1,
              "date": "2025-04-15T09:20:21.105Z",
              "createdAt": "2025-04-15T09:20:21.105Z",
              "updatedAt": "2025-04-15T09:20:21.105Z"
            }
          ]
        }
      ],
      "JobLocations": [
        {
          "id": 14772,
          "name": "Remote",
          "JobOpeningId": 6176,
          "createdAt": "2025-04-15T05:18:48.391Z",
          "updatedAt": "2025-04-15T05:18:48.391Z"
        },
        {
          "id": 14773,
          "name": "Delhi",
          "JobOpeningId": 6176,
          "createdAt": "2025-04-15T05:18:48.391Z",
          "updatedAt": "2025-04-15T05:18:48.391Z"
        }
      ],
      "JobRole": {
        "id": 1,
        "name": "Frontend Engineer",
        "createdAt": "2023-02-23T11:10:53.498Z",
        "updatedAt": "2023-06-27T12:03:29.887Z"
      },
      "Company": {
        "id": 201,
        "name": "Propacity",
        "logo": null,
        "pocName": null,
        "pocNumber": null,
        "pocEmail": null,
        "campusNexaRecommended": null,
        "createdAt": "2024-06-22T07:44:02.664Z",
        "updatedAt": "2024-06-22T07:44:02.664Z",
        "CampusNexaCompanyRefId": null,
        "CreatedById": 25244,
        "CollegeId": 4633
      }
    },
    {
      "id": 6297,
      "companyName": "Eye Mantra Hospital",
      "minCTC": 5,
      "maxCTC": 8,
      "expirationDateTime": "2025-04-21T10:57:00.000Z",
      "description": null,
      "newDescription": null,
      "alertMessage": "<h2><strong>Min 1 year of exp required</strong></h2><h2><strong>CTC- No bar for a right candidate</strong></h2><h2><strong>Role- Mern stack developer</strong></h2><h2><strong>Walk in interview in Delhi (</strong><span style=\"color: rgb(89, 89, 89);\">Paschim Vihar, West Delhi </span><strong style=\"color: rgb(89, 89, 89);\">)</strong></h2>",
      "alertConfirmationMessage": null,
      "JobRoleId": 1,
      "yearsOfExperience": 0,
      "status": 4,
      "closedReasonType": 3,
      "closedReason": "not shortlisted",
      "showCompanyToStudents": true,
      "companyPOCEmail": "hr@eye.com",
      "isPrivate": false,
      "offersInternship": false,
      "internshipDuration": 0,
      "internshipStipend": 0,
      "isAlumniJob": false,
      "isProCompany": false,
      "isJobPortal": false,
      "jobTags": null,
      "jobRedirectionLink": null,
      "category": null,
      "domain": null,
      "size": null,
      "bootstrappedOrFunded": null,
      "revenue": null,
      "source": null,
      "createdAt": "2025-04-11T09:56:13.222Z",
      "updatedAt": "2025-06-02T11:12:49.282Z",
      "CompanyId": 1464,
      "CollegeId": 4633,
      "JobApplicants": [
        {
          "id": 66864,
          "UserId": 57312,
          "JobOpeningId": 6297,
          "status": 9,
          "interviewDate": null,
          "ctcOffered": null,
          "yoe": null,
          "rejectionReason": null,
          "createdAt": "2025-04-12T10:44:40.873Z",
          "updatedAt": "2025-06-02T11:12:49.275Z",
          "JobApplicantStatuses": [
            {
              "id": 164426,
              "JobApplicantId": 66864,
              "status": 9,
              "date": "2025-06-02T11:12:49.274Z",
              "createdAt": "2025-06-02T11:12:49.275Z",
              "updatedAt": "2025-06-02T11:12:49.275Z"
            },
            {
              "id": 158011,
              "JobApplicantId": 66864,
              "status": 2,
              "date": "2025-04-14T05:27:22.817Z",
              "createdAt": "2025-04-14T05:27:01.634Z",
              "updatedAt": "2025-04-14T05:27:01.634Z"
            },
            {
              "id": 157977,
              "JobApplicantId": 66864,
              "status": 1,
              "date": "2025-04-12T10:44:40.875Z",
              "createdAt": "2025-04-12T10:44:40.876Z",
              "updatedAt": "2025-04-12T10:44:40.876Z"
            }
          ]
        }
      ],
      "JobLocations": [
        {
          "id": 14715,
          "name": "Delhi",
          "JobOpeningId": 6297,
          "createdAt": "2025-04-11T09:56:41.664Z",
          "updatedAt": "2025-04-11T09:56:41.664Z"
        }
      ],
      "JobRole": {
        "id": 1,
        "name": "Frontend Engineer",
        "createdAt": "2023-02-23T11:10:53.498Z",
        "updatedAt": "2023-06-27T12:03:29.887Z"
      },
      "Company": {
        "id": 1464,
        "name": "Eye Mantra Hospital",
        "logo": null,
        "pocName": "hr",
        "pocNumber": " 97180 11146",
        "pocEmail": "hr@eye.com",
        "campusNexaRecommended": null,
        "createdAt": "2025-04-11T09:50:21.968Z",
        "updatedAt": "2025-04-11T09:50:21.968Z",
        "CampusNexaCompanyRefId": null,
        "CreatedById": 25244,
        "CollegeId": 4633
      }
    },
    {
      "id": 6158,
      "companyName": "Travclan",
      "minCTC": 7,
      "maxCTC": 14,
      "expirationDateTime": "2025-04-19T06:30:00.000Z",
      "description": "<h2><strong>Must Have 1 Years exp. </strong>Technical Skills Excellence in React JS / HTML5 / CSS3. Hands-on experience of UI Libraries like jQuery. Hands-on experience with code versioning systems like Git. Experience with Responsive/Mobile Design. Creating pixel-perfect, reusable, extensible, flexible, high-performing front-end experiences that integrate seamlessly with back-end code. Hands-on experience with build tools such as NPM, Gulp, Grunt Knowledge / Hands-on experience of following are added advantages GraphQL Node.JS converting designs into HTML/CSS&nbsp;</h2>",
      "newDescription": {
        "type": "doc",
        "content": [
          {
            "type": "heading",
            "attrs": {
              "level": 2,
              "textAlign": null
            },
            "content": [
              {
                "text": "Must Have 1 Years exp. ",
                "type": "text",
                "marks": [
                  {
                    "type": "bold"
                  }
                ]
              },
              {
                "text": "Technical Skills Excellence in React JS / HTML5 / CSS3. Hands-on experience of UI Libraries like jQuery. Hands-on experience with code versioning systems like Git. Experience with Responsive/Mobile Design. Creating pixel-perfect, reusable, extensible, flexible, high-performing front-end experiences that integrate seamlessly with back-end code. Hands-on experience with build tools such as NPM, Gulp, Grunt Knowledge / Hands-on experience of following are added advantages GraphQL Node.JS converting designs into HTML/CSS ",
                "type": "text"
              }
            ]
          }
        ]
      },
      "alertMessage": null,
      "alertConfirmationMessage": null,
      "JobRoleId": 1,
      "yearsOfExperience": 0,
      "status": 4,
      "closedReasonType": 5,
      "closedReason": "no res",
      "showCompanyToStudents": true,
      "companyPOCEmail": "pinku.kumar@travclan.com",
      "isPrivate": false,
      "offersInternship": false,
      "internshipDuration": 0,
      "internshipStipend": 0,
      "isAlumniJob": false,
      "isProCompany": true,
      "isJobPortal": false,
      "jobTags": null,
      "jobRedirectionLink": null,
      "category": null,
      "domain": null,
      "size": null,
      "bootstrappedOrFunded": null,
      "revenue": null,
      "source": null,
      "createdAt": "2025-03-25T11:04:50.193Z",
      "updatedAt": "2025-07-18T11:42:56.765Z",
      "CompanyId": 1267,
      "CollegeId": 4633,
      "JobApplicants": [
        {
          "id": 66062,
          "UserId": 57312,
          "JobOpeningId": 6158,
          "status": 9,
          "interviewDate": null,
          "ctcOffered": null,
          "yoe": null,
          "rejectionReason": null,
          "createdAt": "2025-03-25T16:11:03.523Z",
          "updatedAt": "2025-06-04T09:12:27.865Z",
          "JobApplicantStatuses": [
            {
              "id": 166275,
              "JobApplicantId": 66062,
              "status": 9,
              "date": "2025-06-04T09:12:27.858Z",
              "createdAt": "2025-06-04T09:12:27.867Z",
              "updatedAt": "2025-06-04T09:12:27.867Z"
            },
            {
              "id": 154680,
              "JobApplicantId": 66062,
              "status": 2,
              "date": "2025-03-26T07:14:26.576Z",
              "createdAt": "2025-03-26T07:14:08.345Z",
              "updatedAt": "2025-03-26T07:14:08.345Z"
            },
            {
              "id": 154571,
              "JobApplicantId": 66062,
              "status": 1,
              "date": "2025-03-25T16:11:03.531Z",
              "createdAt": "2025-03-25T16:11:03.532Z",
              "updatedAt": "2025-03-25T16:11:03.532Z"
            }
          ]
        }
      ],
      "JobLocations": [
        {
          "id": 14354,
          "name": "Delhi",
          "JobOpeningId": 6158,
          "createdAt": "2025-03-25T11:08:29.183Z",
          "updatedAt": "2025-03-25T11:08:29.183Z"
        }
      ],
      "JobRole": {
        "id": 1,
        "name": "Frontend Engineer",
        "createdAt": "2023-02-23T11:10:53.498Z",
        "updatedAt": "2023-06-27T12:03:29.887Z"
      },
      "Company": {
        "id": 1267,
        "name": "Travclan",
        "logo": null,
        "pocName": "Pinku",
        "pocNumber": "09667793240",
        "pocEmail": null,
        "campusNexaRecommended": null,
        "createdAt": "2025-02-18T11:36:20.726Z",
        "updatedAt": "2025-02-18T11:36:20.726Z",
        "CampusNexaCompanyRefId": null,
        "CreatedById": 46492,
        "CollegeId": 4633
      }
    },
    {
      "id": 6285,
      "companyName": "Fitelo",
      "minCTC": 5,
      "maxCTC": 7,
      "expirationDateTime": "2025-04-18T09:58:00.000Z",
      "description": null,
      "newDescription": null,
      "alertMessage": "<h2><strong>This is for experienced candidates</strong></h2><h2><strong>Work mode- Hybrid</strong></h2><h2><strong>CTC depends on interview</strong></h2><p><br></p>",
      "alertConfirmationMessage": null,
      "JobRoleId": 1,
      "yearsOfExperience": 0,
      "status": 4,
      "closedReasonType": 3,
      "closedReason": "not shortlisted",
      "showCompanyToStudents": true,
      "companyPOCEmail": "paramveer.pupneja@fitelo.co",
      "isPrivate": false,
      "offersInternship": false,
      "internshipDuration": 0,
      "internshipStipend": 0,
      "isAlumniJob": false,
      "isProCompany": false,
      "isJobPortal": false,
      "jobTags": null,
      "jobRedirectionLink": null,
      "category": null,
      "domain": null,
      "size": null,
      "bootstrappedOrFunded": null,
      "revenue": null,
      "source": null,
      "createdAt": "2025-04-10T10:54:43.643Z",
      "updatedAt": "2025-06-02T11:14:37.633Z",
      "CompanyId": 1457,
      "CollegeId": 4633,
      "JobApplicants": [
        {
          "id": 66863,
          "UserId": 57312,
          "JobOpeningId": 6285,
          "status": 9,
          "interviewDate": null,
          "ctcOffered": null,
          "yoe": null,
          "rejectionReason": null,
          "createdAt": "2025-04-12T10:43:42.762Z",
          "updatedAt": "2025-06-02T11:14:37.596Z",
          "JobApplicantStatuses": [
            {
              "id": 164445,
              "JobApplicantId": 66863,
              "status": 9,
              "date": "2025-06-02T11:14:37.595Z",
              "createdAt": "2025-06-02T11:14:37.596Z",
              "updatedAt": "2025-06-02T11:14:37.596Z"
            },
            {
              "id": 157976,
              "JobApplicantId": 66863,
              "status": 1,
              "date": "2025-04-12T10:43:42.767Z",
              "createdAt": "2025-04-12T10:43:42.768Z",
              "updatedAt": "2025-04-12T10:43:42.768Z"
            }
          ]
        }
      ],
      "JobLocations": [
        {
          "id": 14677,
          "name": "Gurgaon",
          "JobOpeningId": 6285,
          "createdAt": "2025-04-10T10:54:43.659Z",
          "updatedAt": "2025-04-10T10:54:43.659Z"
        }
      ],
      "JobRole": {
        "id": 1,
        "name": "Frontend Engineer",
        "createdAt": "2023-02-23T11:10:53.498Z",
        "updatedAt": "2023-06-27T12:03:29.887Z"
      },
      "Company": {
        "id": 1457,
        "name": "Fitelo",
        "logo": null,
        "pocName": "paramveer",
        "pocNumber": "9888925323",
        "pocEmail": "paramveer.pupneja@fitelo.co",
        "campusNexaRecommended": null,
        "createdAt": "2025-04-10T10:52:22.318Z",
        "updatedAt": "2025-04-10T10:52:22.318Z",
        "CampusNexaCompanyRefId": null,
        "CreatedById": 25244,
        "CollegeId": 4633
      }
    },
    {
      "id": 6198,
      "companyName": "TraceLink",
      "minCTC": 10,
      "maxCTC": 14,
      "expirationDateTime": "2025-04-11T05:56:00.000Z",
      "description": "<h1>Skills - Full Stack with Backend Expertise - java, javascript, aws, nosql, json, rdbms databases, BS IN COMPUTER SCIENCE. 1 year exp required</h1>",
      "newDescription": {
        "type": "doc",
        "content": [
          {
            "type": "heading",
            "attrs": {
              "level": 1,
              "textAlign": null
            },
            "content": [
              {
                "text": "Skills - Full Stack with Backend Expertise - java, javascript, aws, nosql, json, rdbms databases, BS IN COMPUTER SCIENCE. 1 year exp required",
                "type": "text"
              }
            ]
          }
        ]
      },
      "alertMessage": null,
      "alertConfirmationMessage": null,
      "JobRoleId": 1,
      "yearsOfExperience": 0,
      "status": 4,
      "closedReasonType": 3,
      "closedReason": "hired rom outside",
      "showCompanyToStudents": true,
      "companyPOCEmail": "mrazdan@tracelink.com",
      "isPrivate": false,
      "offersInternship": false,
      "internshipDuration": 0,
      "internshipStipend": 0,
      "isAlumniJob": false,
      "isProCompany": true,
      "isJobPortal": false,
      "jobTags": null,
      "jobRedirectionLink": null,
      "category": null,
      "domain": null,
      "size": null,
      "bootstrappedOrFunded": null,
      "revenue": null,
      "source": null,
      "createdAt": "2025-04-03T07:49:40.379Z",
      "updatedAt": "2025-07-18T11:42:35.567Z",
      "CompanyId": 1407,
      "CollegeId": 4633,
      "JobApplicants": [
        {
          "id": 66505,
          "UserId": 57312,
          "JobOpeningId": 6198,
          "status": 9,
          "interviewDate": null,
          "ctcOffered": null,
          "yoe": null,
          "rejectionReason": null,
          "createdAt": "2025-04-06T12:11:34.284Z",
          "updatedAt": "2025-04-09T06:33:46.968Z",
          "JobApplicantStatuses": [
            {
              "id": 157619,
              "JobApplicantId": 66505,
              "status": 9,
              "date": "2025-04-09T06:33:46.967Z",
              "createdAt": "2025-04-09T06:33:46.968Z",
              "updatedAt": "2025-04-09T06:33:46.968Z"
            },
            {
              "id": 157274,
              "JobApplicantId": 66505,
              "status": 2,
              "date": "2025-04-07T07:44:43.789Z",
              "createdAt": "2025-04-07T07:44:22.248Z",
              "updatedAt": "2025-04-07T07:44:22.248Z"
            },
            {
              "id": 157145,
              "JobApplicantId": 66505,
              "status": 1,
              "date": "2025-04-06T12:11:34.286Z",
              "createdAt": "2025-04-06T12:11:34.287Z",
              "updatedAt": "2025-04-06T12:11:34.287Z"
            }
          ]
        }
      ],
      "JobLocations": [
        {
          "id": 14500,
          "name": "Pune",
          "JobOpeningId": 6198,
          "createdAt": "2025-04-04T05:57:04.694Z",
          "updatedAt": "2025-04-04T05:57:04.694Z"
        }
      ],
      "JobRole": {
        "id": 1,
        "name": "Frontend Engineer",
        "createdAt": "2023-02-23T11:10:53.498Z",
        "updatedAt": "2023-06-27T12:03:29.887Z"
      },
      "Company": {
        "id": 1407,
        "name": "TraceLink",
        "logo": null,
        "pocName": "Monica",
        "pocNumber": "8452975572",
        "pocEmail": "mrazdan@tracelink.com",
        "campusNexaRecommended": null,
        "createdAt": "2025-04-03T07:38:57.643Z",
        "updatedAt": "2025-04-03T07:38:57.643Z",
        "CampusNexaCompanyRefId": null,
        "CreatedById": 46492,
        "CollegeId": 4633
      }
    },
    {
      "id": 6251,
      "companyName": "Mobulous Technologies,",
      "minCTC": 5,
      "maxCTC": 8.4,
      "expirationDateTime": "2025-04-10T11:21:00.000Z",
      "description": null,
      "newDescription": null,
      "alertMessage": "<h2><strong>This is for experienced candidates</strong></h2><h2><strong>CTC depends on your interview</strong></h2><h2><strong>Mern stack developer</strong></h2>",
      "alertConfirmationMessage": null,
      "JobRoleId": 1,
      "yearsOfExperience": 0,
      "status": 4,
      "closedReasonType": 3,
      "closedReason": "not shortlisted",
      "showCompanyToStudents": true,
      "companyPOCEmail": "priya.pandey@mobulous.com",
      "isPrivate": false,
      "offersInternship": false,
      "internshipDuration": 0,
      "internshipStipend": 0,
      "isAlumniJob": false,
      "isProCompany": false,
      "isJobPortal": false,
      "jobTags": null,
      "jobRedirectionLink": null,
      "category": null,
      "domain": null,
      "size": null,
      "bootstrappedOrFunded": null,
      "revenue": null,
      "source": null,
      "createdAt": "2025-04-08T11:20:39.023Z",
      "updatedAt": "2025-06-02T11:27:24.257Z",
      "CompanyId": 1429,
      "CollegeId": 4633,
      "JobApplicants": [
        {
          "id": 66711,
          "UserId": 57312,
          "JobOpeningId": 6251,
          "status": 9,
          "interviewDate": null,
          "ctcOffered": null,
          "yoe": null,
          "rejectionReason": null,
          "createdAt": "2025-04-09T17:18:35.887Z",
          "updatedAt": "2025-06-02T11:27:24.248Z",
          "JobApplicantStatuses": [
            {
              "id": 164563,
              "JobApplicantId": 66711,
              "status": 9,
              "date": "2025-06-02T11:27:24.248Z",
              "createdAt": "2025-06-02T11:27:24.249Z",
              "updatedAt": "2025-06-02T11:27:24.249Z"
            },
            {
              "id": 157708,
              "JobApplicantId": 66711,
              "status": 1,
              "date": "2025-04-09T17:18:35.890Z",
              "createdAt": "2025-04-09T17:18:35.890Z",
              "updatedAt": "2025-04-09T17:18:35.890Z"
            }
          ]
        }
      ],
      "JobLocations": [
        {
          "id": 14602,
          "name": "Noida",
          "JobOpeningId": 6251,
          "createdAt": "2025-04-08T11:20:39.029Z",
          "updatedAt": "2025-04-08T11:20:39.029Z"
        }
      ],
      "JobRole": {
        "id": 1,
        "name": "Frontend Engineer",
        "createdAt": "2023-02-23T11:10:53.498Z",
        "updatedAt": "2023-06-27T12:03:29.887Z"
      },
      "Company": {
        "id": 1429,
        "name": "Mobulous Technologies,",
        "logo": null,
        "pocName": "priya",
        "pocNumber": "9667334476",
        "pocEmail": "priya.pandey@mobulous.com",
        "campusNexaRecommended": null,
        "createdAt": "2025-04-08T11:11:09.175Z",
        "updatedAt": "2025-04-08T11:11:09.175Z",
        "CampusNexaCompanyRefId": null,
        "CreatedById": 25244,
        "CollegeId": 4633
      }
    },
    {
      "id": 6140,
      "companyName": "Texperia tech solutions ",
      "minCTC": 6,
      "maxCTC": 8,
      "expirationDateTime": "2025-03-25T07:55:00.000Z",
      "description": "<h1>Job role is full stack , candidates who have done 2 projects both in backend and frontend are required.</h1><h1>candidates with 1 year of experience are required.</h1><h1>Hybrid job </h1><p><br></p>",
      "newDescription": {
        "type": "doc",
        "content": [
          {
            "type": "heading",
            "attrs": {
              "level": 1,
              "textAlign": null
            },
            "content": [
              {
                "text": "Job role is full stack , candidates who have done 2 projects both in backend and frontend are required.",
                "type": "text"
              }
            ]
          },
          {
            "type": "heading",
            "attrs": {
              "level": 1,
              "textAlign": null
            },
            "content": [
              {
                "text": "candidates with 1 year of experience are required.",
                "type": "text"
              }
            ]
          },
          {
            "type": "heading",
            "attrs": {
              "level": 1,
              "textAlign": null
            },
            "content": [
              {
                "text": "Hybrid job",
                "type": "text"
              }
            ]
          },
          {
            "type": "paragraph",
            "attrs": {
              "textAlign": null
            },
            "content": [
              {
                "type": "hardBreak"
              }
            ]
          }
        ]
      },
      "alertMessage": null,
      "alertConfirmationMessage": null,
      "JobRoleId": 1,
      "yearsOfExperience": 0,
      "status": 4,
      "closedReasonType": 3,
      "closedReason": "hiring closed ",
      "showCompanyToStudents": true,
      "companyPOCEmail": "rohit@texperia.com ",
      "isPrivate": false,
      "offersInternship": false,
      "internshipDuration": 0,
      "internshipStipend": 0,
      "isAlumniJob": false,
      "isProCompany": false,
      "isJobPortal": false,
      "jobTags": null,
      "jobRedirectionLink": null,
      "category": null,
      "domain": null,
      "size": null,
      "bootstrappedOrFunded": null,
      "revenue": null,
      "source": null,
      "createdAt": "2025-03-20T07:55:12.470Z",
      "updatedAt": "2025-07-18T11:40:31.907Z",
      "CompanyId": 1378,
      "CollegeId": 4633,
      "JobApplicants": [
        {
          "id": 66028,
          "UserId": 57312,
          "JobOpeningId": 6140,
          "status": 9,
          "interviewDate": null,
          "ctcOffered": null,
          "yoe": null,
          "rejectionReason": null,
          "createdAt": "2025-03-24T15:45:47.794Z",
          "updatedAt": "2025-03-26T06:21:08.353Z",
          "JobApplicantStatuses": [
            {
              "id": 154649,
              "JobApplicantId": 66028,
              "status": 9,
              "date": "2025-03-26T06:21:08.352Z",
              "createdAt": "2025-03-26T06:21:08.354Z",
              "updatedAt": "2025-03-26T06:21:08.354Z"
            },
            {
              "id": 154452,
              "JobApplicantId": 66028,
              "status": 1,
              "date": "2025-03-24T15:45:47.802Z",
              "createdAt": "2025-03-24T15:45:47.802Z",
              "updatedAt": "2025-03-24T15:45:47.802Z"
            }
          ]
        }
      ],
      "JobLocations": [
        {
          "id": 14305,
          "name": "Bangalore",
          "JobOpeningId": 6140,
          "createdAt": "2025-03-20T07:55:12.476Z",
          "updatedAt": "2025-03-20T07:55:12.476Z"
        }
      ],
      "JobRole": {
        "id": 1,
        "name": "Frontend Engineer",
        "createdAt": "2023-02-23T11:10:53.498Z",
        "updatedAt": "2023-06-27T12:03:29.887Z"
      },
      "Company": {
        "id": 1378,
        "name": "Texperia tech solutions ",
        "logo": null,
        "pocName": "Rohit ",
        "pocNumber": "9880308883",
        "pocEmail": "rohit@texperia.com ",
        "campusNexaRecommended": null,
        "createdAt": "2025-03-20T07:53:21.303Z",
        "updatedAt": "2025-03-20T07:53:21.303Z",
        "CampusNexaCompanyRefId": null,
        "CreatedById": 54536,
        "CollegeId": 4633
      }
    }
  ];

function formatDate(iso: string | null | undefined) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("en-IN", { year: "numeric", month: "short", day: "2-digit" });
}

function statusPill(status: number) {
  // Unknown mapping, so keep it simple + consistent.
  if (status === 3) return { label: "Open", cls: "bg-green-100 text-green-700" };
  if (status === 4) return { label: "Closed", cls: "bg-slate-100 text-slate-700" };
  if (status === 5) return { label: "Closed", cls: "bg-slate-100 text-slate-700" };
  return { label: `Status ${status}`, cls: "bg-amber-100 text-amber-700" };
}

export default function JobOpeningsAdminPage() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<JobOpening | null>(null);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    const data = MOCK_JOB_OPENINGS as JobOpening[];
    if (!q) return data;
    return data.filter((j) => {
      const role = j.JobRole?.name || "";
      const locations = (j.JobLocations || []).map((l) => l.name).join(" ");
      return (
        String(j.id).includes(q) ||
        j.companyName?.toLowerCase().includes(q) ||
        role.toLowerCase().includes(q) ||
        locations.toLowerCase().includes(q)
      );
    });
  }, [query]);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-end gap-4 justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Job Openings</h1>
            <p className="text-sm text-slate-500 mt-1">
              Search and inspect job openings, applicants, and locations.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <input
              className="px-4 py-2 border border-slate-200 rounded-lg text-sm w-full sm:w-[360px]"
              placeholder="Search by company, role, location, or ID"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-4 text-xs text-slate-500">
          Showing <span className="font-bold text-slate-700">{rows.length}</span> of{" "}
          <span className="font-bold text-slate-700">{MOCK_JOB_OPENINGS.length}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            <h2 className="font-bold text-slate-900">Openings</h2>
            <span className="text-xs text-slate-500">Click a row to view details</span>
          </div>

          {rows.length === 0 ? (
            <div className="p-6 text-slate-600">No openings match your search.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-slate-700">
                  <tr>
                    <th className="text-left px-6 py-3 font-bold">Company</th>
                    <th className="text-left px-6 py-3 font-bold">Role</th>
                    <th className="text-left px-6 py-3 font-bold">CTC</th>
                    <th className="text-left px-6 py-3 font-bold">YOE</th>
                    <th className="text-left px-6 py-3 font-bold">Status</th>
                    <th className="text-right px-6 py-3 font-bold">Updated</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {rows.map((job) => {
                    const pill = statusPill(job.status);
                    const isActive = selected?.id === job.id;
                    return (
                      <tr
                        key={job.id}
                        onClick={() => setSelected(job)}
                        className={`cursor-pointer hover:bg-slate-50 ${isActive ? "bg-blue-50" : ""}`}
                      >
                        <td className="px-6 py-3">
                          <div className="font-semibold text-slate-900">{job.companyName}</div>
                          <div className="text-xs text-slate-500">ID: {job.id}</div>
                        </td>
                        <td className="px-6 py-3">
                          <div className="font-semibold text-slate-900">
                            {job.JobRole?.name || `Role #${job.JobRoleId}`}
                          </div>
                          <div className="text-xs text-slate-500">
                            {(job.JobLocations || []).map((l) => l.name).slice(0, 2).join(", ") || "—"}
                            {(job.JobLocations || []).length > 2 ? " +" : ""}
                          </div>
                        </td>
                        <td className="px-6 py-3 font-semibold text-slate-900">
                          ₹{job.minCTC}–₹{job.maxCTC} LPA
                        </td>
                        <td className="px-6 py-3 text-slate-700">{job.yearsOfExperience}+ yrs</td>
                        <td className="px-6 py-3">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${pill.cls}`}>
                            {pill.label}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-right text-slate-700">{formatDate(job.updatedAt)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="lg:col-span-5">
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            {!selected ? (
              <div className="text-slate-600">
                Select a job opening to see details.
              </div>
            ) : (
              <div className="space-y-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{selected.companyName}</h3>
                    <p className="text-sm text-slate-600 mt-1">
                      {selected.JobRole?.name || `Role #${selected.JobRoleId}`} •{" "}
                      ₹{selected.minCTC}–₹{selected.maxCTC} LPA
                    </p>
                    <p className="text-xs text-slate-500 mt-1">Opening ID: {selected.id}</p>
                  </div>
                  <button
                    onClick={() => setSelected(null)}
                    className="text-sm font-bold text-slate-600 hover:text-slate-900"
                  >
                    Close
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg border border-slate-200 p-4">
                    <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Expiry</div>
                    <div className="mt-1 font-semibold text-slate-900">{formatDate(selected.expirationDateTime)}</div>
                  </div>
                  <div className="rounded-lg border border-slate-200 p-4">
                    <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Applicants</div>
                    <div className="mt-1 font-semibold text-slate-900">{selected.JobApplicants?.length ?? 0}</div>
                  </div>
                </div>

                <div className="rounded-lg border border-slate-200 p-4 space-y-2">
                  <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Locations</div>
                  <div className="text-sm text-slate-800">
                    {(selected.JobLocations || []).length === 0
                      ? "—"
                      : (selected.JobLocations || []).map((l) => l.name).join(", ")}
                  </div>
                </div>

                <div className="rounded-lg border border-slate-200 p-4 space-y-2">
                  <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Company POC</div>
                  <div className="text-sm text-slate-800">
                    {selected.Company?.pocName || "—"}
                    {selected.Company?.pocNumber ? ` • ${selected.Company.pocNumber}` : ""}
                    {selected.Company?.pocEmail ? ` • ${selected.Company.pocEmail}` : ""}
                  </div>
                </div>

                {selected.alertMessage && (
                  <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                    <div className="text-xs text-amber-800 font-bold uppercase tracking-wider">Alert</div>
                    <div className="text-sm text-amber-900 mt-2 break-words">
                      {selected.alertMessage}
                    </div>
                    <div className="text-[11px] text-amber-800 mt-2">
                      Note: alert is HTML in source; rendering as plain text for safety.
                    </div>
                  </div>
                )}

                <div className="rounded-lg border border-slate-200 p-4 space-y-3">
                  <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Applicants</div>
                  {(selected.JobApplicants || []).length === 0 ? (
                    <div className="text-sm text-slate-600">—</div>
                  ) : (
                    <div className="space-y-2">
                      {(selected.JobApplicants || []).slice(0, 5).map((a) => (
                        <div key={a.id} className="flex items-center justify-between gap-3 rounded-md bg-slate-50 px-3 py-2">
                          <div className="text-sm">
                            <span className="font-bold text-slate-900">Applicant #{a.id}</span>{" "}
                            <span className="text-slate-500">• User {a.UserId}</span>
                          </div>
                          <div className="text-xs font-bold text-slate-700">
                            Status {a.status}
                          </div>
                        </div>
                      ))}
                      {(selected.JobApplicants || []).length > 5 && (
                        <div className="text-xs text-slate-500">
                          +{(selected.JobApplicants || []).length - 5} more…
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="text-xs text-slate-500">
        Next step: I can wire this page to a real API endpoint once you share where this data comes from.
      </div>
    </div>
  );
}

