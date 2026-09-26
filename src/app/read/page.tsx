import { redirect } from "next/navigation";

/** Legacy — reading always starts from a chosen series */
export default function ReadRedirectPage() {
  redirect("/library");
}
