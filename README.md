# Job Tracker

A privacy-first, open-source app to help job hunters track applications and save opportunities for later—with reusable message templates (LinkedIn DMs, follow-up emails, etc.). Built with Next.js + Tailwind + shadcn/ui on the client and Express.js + MongoDB on the server.

Client Server Architecture

```txt
job-tracker/
├─ client/ # Next.js + TypeScript + Tailwind + shadcn/ui
└─ server/ # Express.js + TypeScript + MongoDB (Mongoose)
```

## ✨ Features

- Track submitted applications and saved jobs (apply later)
- Rich fields: company, role, responsibilities, salary, last date, links (e.g., customized CV), tags, priority, notes
- Message templates (title, description, multiple messages per template by channel)

## 🧱 Tech Stack

- Client: Next.js (App Router), TypeScript, Tailwind CSS, shadcn/ui, TanStack Query, Zod
- Server: Node.js, Express.js, MongoDB (Mongoose), Zod, JWT, Helmet, Rate limit
- Testing: Jest + Supertest (server), Cypress (client)
