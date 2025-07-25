import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useForm, usePage } from "@inertiajs/react";
import { Building2, ChevronDown, ChevronUp, Edit, Plus, Search, Trash2, User } from "lucide-react";
import { useMemo, useState } from "react";
import { Department } from "./table/columns";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import JsonSchemaForm from "@/components/ui/json-schema-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { RJSFSchema } from "@rjsf/utils";
import { Paginated, SharedData } from "@/types";


type DepartmentForm = {
  name: string
  manager: string
  employee_count: number
  description?: string
  created_at: string
  updated_at: string
}
interface DepartmentPageProps extends SharedData {
  departments: Paginated<Department>;
}

export default function DepartmentIndex() {

  const departmentFormSchema: RJSFSchema = {
    type: "object",
    required: ["name"],
    properties: {
      name: {
        type: "string",
        title: "Department Name",
        minLength: 2,
        maxLength: 100,
        description: "Enter the name of the department",
      },
      description: {
        type: "string",
        title: "Description",
        maxLength: 500,
        description: "Brief description of the department (optional)",
      },
      manager: {
        type: "string",
        title: "Manager",
        maxLength: 100,
        description: "Name of the department manager (optional)",
      },
    },
  };

  const uiSchema = {
    description: {
      "ui:widget": "textarea",
      "ui:placeholder": "Enter department description...",
    },
    name: {
      "ui:placeholder": "e.g., Engineering, Marketing, Sales",
    },
    manager: {
      "ui:placeholder": "e.g., John Smith",
    },
    employeeCount: {
      "ui:placeholder": "0",
    },
  };

  const { data, setData, post, reset, errors, processing } = useForm<Required<DepartmentForm>>({
    name: '',
    manager: '',
    employee_count: 0,
    description: '',
    created_at: '',
    updated_at: '',
  });

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { departments } = usePage<DepartmentPageProps>().props;
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; department?: Department }>({ open: false });
  const [sortConfig, setSortConfig] = useState<{ key: keyof Department; direction: "asc" | "desc" }>({ key: "created_at", direction: "desc" });
  const SortIcon = ({ column }: { column: keyof Department }) => {
    if (sortConfig.key !== column) {
      return <ChevronUp className="h-3 w-3 opacity-30" />;
    }
    return sortConfig.direction === "asc" ?
      <ChevronUp className="h-3 w-3" /> :
      <ChevronDown className="h-3 w-3" />;
  };

  const handleSort = (key: keyof Department) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const getDepartmentIcon = (name: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes("engineering") || lowerName.includes("tech")) return "💻";
    if (lowerName.includes("marketing")) return "📈";
    if (lowerName.includes("hr") || lowerName.includes("human")) return "👥";
    if (lowerName.includes("finance") || lowerName.includes("accounting")) return "💰";
    if (lowerName.includes("sales")) return "💼";
    if (lowerName.includes("support") || lowerName.includes("customer")) return "🎧";
    return "🏢";
  };

  const getEmployeeCountColor = (count: number) => {
    if (count >= 20) return "bg-blue-50 text-blue-700";
    if (count >= 10) return "bg-green-50 text-green-700";
    if (count >= 5) return "bg-orange-50 text-orange-700";
    return "bg-gray-50 text-gray-700";
  };

  const submit = () => {
    post("/departments", {
      preserveScroll: true,
      onFinish: () => reset('name'),
    });
  };

  const deleteDepartment = () => {

  }


  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
  const filteredAndSortedDepartments = useMemo(() => {
    let filtered = departments.data || [];

    // Apply search filter
    if (searchTerm) {
      filtered = departments.data.filter(dept =>
        dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dept.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dept.manager?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    // Apply sorting
    return filtered.sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      if (sortConfig.key === "created_at") {
        const aDate = new Date(aValue as string);
        const bDate = new Date(bValue as string);
        return sortConfig.direction === "asc" ? aDate.getTime() - bDate.getTime() : bDate.getTime() - aDate.getTime();
      }

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortConfig.direction === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortConfig.direction === "asc" ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });
  }, [departments, searchTerm, sortConfig]);
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-white">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Departments</h1>
              <p className="text-sm text-muted-foreground mt-1">Manage your organization's departments</p>
            </div>
            <Button onClick={() => setIsAddDialogOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Department
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-6">
        <Card className="py-0 gap-0">
          {/* Table Header Actions */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-4">
              <h2 className="font-medium text-card-foreground">All Departments</h2>
              <span className="text-sm text-muted-foreground">
                {filteredAndSortedDepartments.length} department{filteredAndSortedDepartments.length !== 1 ? "s" : ""}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search departments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 min-w-[250px]"
                />
              </div>
            </div>
          </div>

          {/* Data Table */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead
                    className="cursor-pointer hover:text-foreground transition-colors"
                    onClick={() => handleSort("name")}
                  >
                    <div className="flex items-center gap-2">
                      Department Name
                      <SortIcon column="name" />
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:text-foreground transition-colors"
                    onClick={() => handleSort("manager")}
                  >
                    <div className="flex items-center gap-2">
                      Manager
                      <SortIcon column="manager" />
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:text-foreground transition-colors"
                    onClick={() => handleSort("employee_count")}
                  >
                    <div className="flex items-center gap-2">
                      Employees
                      <SortIcon column="employee_count" />
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:text-foreground transition-colors"
                    onClick={() => handleSort("created_at")}
                  >
                    <div className="flex items-center gap-2">
                      Created
                      <SortIcon column="created_at" />
                    </div>
                  </TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedDepartments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2">
                        <Building2 className="h-8 w-8 text-muted-foreground" />
                        <p className="text-muted-foreground">
                          {searchTerm ? "No departments match your search" : "No departments found"}
                        </p>
                        {!searchTerm && (
                          <Button onClick={() => setIsAddDialogOpen(true)} variant="outline" size="sm" className="mt-2">
                            <Plus className="h-4 w-4 mr-2" />
                            Add your first department
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAndSortedDepartments.map((department) => (
                    <TableRow key={department.id} className="hover:bg-muted/50 transition-colors">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-lg">
                            {getDepartmentIcon(department.name)}
                          </div>
                          <div>
                            <div className="font-medium text-card-foreground">{department.name}</div>
                            {department.description && (
                              <div className="text-sm text-muted-foreground">{department.description}</div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {department.manager ? (
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                              <User className="h-3 w-3 text-gray-600" />
                            </div>
                            <span className="text-sm">{department.manager}</span>
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">No manager assigned</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getEmployeeCountColor(department.employee_count || 0)}`}>
                          {department.employee_count || 0}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(department.created_at)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-destructive hover:text-destructive-foreground"
                            onClick={() => setDeleteConfirm({ open: true, department })}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Table Footer */}
          {filteredAndSortedDepartments.length > 0 && (
            <div className="flex items-center justify-between p-4 border-t">
              <div className="text-sm text-muted-foreground">
                Showing {filteredAndSortedDepartments.length} of {departments.data.length} departments
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Add Department Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Department</DialogTitle>
            <DialogDescription>
              Create a new department for your organization.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <JsonSchemaForm
              schema={departmentFormSchema}
              uiSchema={uiSchema}
              onSubmit={submit}
              onChange={(data) => {
                console.log(data);
                setData(data);
              }}
              submitText={processing ? "Creating..." : "Create Department"}
              disabled={processing}
            />
            <div className="flex justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
                className="mr-2"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteConfirm.open} onOpenChange={(open) => setDeleteConfirm({ open })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Department</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteConfirm.department?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
