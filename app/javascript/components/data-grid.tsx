"use client"

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Link } from "@inertiajs/react"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    pagination?: {
        current_page: number
        last_page: number
        total: number
        per_page: number
        from: number
        to: number
    }
    onPageChange?: (page: number) => void
    filterColumn?: string // name of the column to filter
    filterPlaceholder?: string // placeholder text for filter input
    action?: React.ReactNode // custom action node (e.g. button or link)
}

export function DataGrid<TData, TValue>({
    columns,
    data,
    pagination,
    onPageChange,
    filterColumn = "name",
    filterPlaceholder = "Filter departments...",
    action,
}: DataTableProps<TData, TValue>) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    return (
        <div className="w-full">
            <div className="flex items-center py-4">
                <Input
                    placeholder={filterPlaceholder}
                    value={(table.getColumn(filterColumn)?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn(filterColumn)?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto">
                            Columns <ChevronDown />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {table
                            .getAllColumns()
                            .filter((column) => column.getCanHide())
                            .map((column) => {
                                return (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="capitalize"
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) =>
                                            column.toggleVisibility(!!value)
                                        }
                                    >
                                        {column.id}
                                    </DropdownMenuCheckboxItem>
                                )
                            })}
                    </DropdownMenuContent>
                </DropdownMenu>
                {action && (
                    <div className="ml-5">{action}</div>
                )}
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id} colSpan={header.colSpan}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell
                                            key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {pagination && (
                <div className="flex items-center justify-between mt-5">
                    <div className="text-sm text-muted-foreground">
                        Showing {pagination.from} to {pagination.to} of {pagination.total} results
                    </div>
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => onPageChange?.(pagination.current_page - 1)}
                            disabled={pagination.current_page <= 1}
                            className="cursor-pointer px-3 py-1 text-sm border rounded disabled:opacity-50"
                        >
                            Previous
                        </button>
                        <span className="px-3 py-1 text-sm">
                            Page {pagination.current_page} of {pagination.last_page}
                        </span>
                        <button
                            onClick={() => onPageChange?.(pagination.current_page + 1)}
                            disabled={pagination.current_page >= pagination.last_page}
                            className="cursor-pointer px-3 py-1 text-sm border rounded disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
