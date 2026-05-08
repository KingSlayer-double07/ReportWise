import Link from "next/link";

export default function StudentsPage() {
  return (
    <>
      <Link href="/dashboard/admin/students/new" className="underline font-dm">
        Add Student
      </Link>
    </>
  );
}
