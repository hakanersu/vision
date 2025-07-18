import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem, Paginated, SharedData } from "@/types";
import { Head, router, useForm, usePage } from "@inertiajs/react";
import { DataTable } from "./table/data-table";
import { columns } from "./table/columns";

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: "Departmanlar",
    href: "/deparments",
  },
];
export interface Department {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}
interface DepartmentPageProps extends SharedData {
  departments: Paginated<Department>;
}

export default function DepartmentIndex() {
  const { departments } = usePage<DepartmentPageProps>().props;
  const { data, total_pages, current_page } =
    departments;
  console.log('Departments: ',departments);

  const handlePageChange = (page: number) => {
    router.get("/departments", { page }, { preserveState: true });
  };

  return (
    <>
      <Head title="Departmanlar" />
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
        <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl  md:min-h-min ">

            <DataTable
            columns={columns}
            data={departments.data}
            pagination={{
              current_page,
              total_pages,
            }}
            onPageChange={handlePageChange}
          />
         
        </div>
      </div>
    </>
  );
}
