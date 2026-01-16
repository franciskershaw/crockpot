import { getUnitsWithUsage } from "@/actions/units";
import { UnitsDataTable } from "./components/UnitsDataTable";

export default async function UnitsPage() {
  const units = await getUnitsWithUsage();

  return <UnitsDataTable data={units} />;
}
