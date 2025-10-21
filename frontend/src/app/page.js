import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <Link href={"/dashboard"}>
      <Button>Go to Dashboard</Button>
      </Link>
    </div>
  );
}
