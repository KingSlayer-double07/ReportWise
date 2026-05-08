import Link from "next/link";

export default function TeachersPage() {
  return (
    <>
      <Link href="/dashboard/admin/teachers/new" className="underline font-dm">
        Add Teacher
      </Link>
    </>
  );
}
