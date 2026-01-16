import { getUsersForAdminPanel } from "@/actions/users";
import { UsersDataTable } from "./components/UsersDataTable";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
  const users = await getUsersForAdminPanel();

  return <UsersDataTable data={users} />;
}
