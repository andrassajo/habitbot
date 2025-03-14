import { getCategoryByKey } from "@/lib/actions";
import Info from ".";

export default async function InfoWrapper({ categoryKey }: { categoryKey: string }) {
  const category = await getCategoryByKey(categoryKey);

  return (
    <Info category={category} />
  );
}