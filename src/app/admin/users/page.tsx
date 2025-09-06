import { getAdminUsers } from "@/actions/admin";
import { UsersDataTable } from "./components/UsersDataTable";

export default async function UsersPage() {
  const users = await getAdminUsers();

  return (
    <div className="bg-white rounded-lg border p-6">
      <UsersDataTable data={users} />
    </div>
  );
}
