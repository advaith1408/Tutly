import { getServerSession } from "@tutly/auth";
import { db } from "@tutly/db";
import { redirect } from "next/navigation";
import Drive from "./_components/Drive";

export default async function DrivePage() {
  const session = await getServerSession();
  if (!session?.user) {
    redirect("/sign-in");
  }

  const uploadedFiles = await db.file.findMany({
    where: {
      uploadedById: session.user.id,
      isArchived: false,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return <Drive uploadedFiles={uploadedFiles} />;
} 