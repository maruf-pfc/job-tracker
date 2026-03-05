import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/db";
import { jobs } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import z from "zod";

// Zod schemas for validation
const jobSchema = z.object({
  companyName: z.string().min(1),
  companyLinks: z
    .object({
      linkedin: z.string().optional(),
      fb: z.string().optional(),
      others: z.array(z.string()).optional(),
    })
    .optional(),
  role: z.string().min(1),
  salary: z.string().optional(),
  postLink: z.string().optional(),
  lastDate: z.date().optional(),
  applied: z.boolean().default(false),
  cvLink: z.string().optional(),
});

export async function GET() {
  const user = await currentUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userJobs = await db.select().from(jobs).where(eq(jobs.userId, user.id));
  return NextResponse.json(userJobs);
}

export async function POST(request: Request) {
  const user = await currentUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const validated = jobSchema.safeParse(body);
  if (!validated.success)
    return NextResponse.json({ error: validated.error }, { status: 400 });

  const [newJob] = await db
    .insert(jobs)
    .values({ ...validated.data, userId: user.id })
    .returning();
  return NextResponse.json(newJob);
}

// Similarly implement PUT (update by id), DELETE (by id), ensuring userId matches.
