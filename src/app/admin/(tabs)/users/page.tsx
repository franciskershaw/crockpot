import { getUsersForAdminPanel } from "@/actions/users";
import { UsersDataTable } from "./components/UsersDataTable";

export default async function UsersPage() {
  const users = await getUsersForAdminPanel();

  return <UsersDataTable data={users} />;
}
