import { getUsersForAdminPanel } from "@/actions/users";
import { UsersDataTable } from "./components/UsersDataTable";

export default async function UsersPage() {
  const users = await getUsersForAdminPanel();

  return (
    <div className="bg-white rounded-lg border p-6">
      <UsersDataTable data={users} />
    </div>
  );
}
