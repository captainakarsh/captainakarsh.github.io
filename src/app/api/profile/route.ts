import { achievements, education, experience, profile, projects, skills } from "@/data/profile";
import { json, preflight } from "@/lib/server/http";

export function OPTIONS(req: Request) {
  return preflight(req, { open: true });
}

export function GET(req: Request) {
  const { socials, ...rest } = profile;
  return json(
    req,
    {
      ...rest,
      socials: Object.fromEntries(Object.entries(socials).filter(([, v]) => v)),
      experience,
      projects,
      skills,
      achievements,
      education,
    },
    { open: true, headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" } },
  );
}
