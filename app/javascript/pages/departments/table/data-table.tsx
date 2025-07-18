"use client"

import {
  ColumnDef
} from "@tanstack/react-table"
import { Link } from "@inertiajs/react"
import { Button } from "@/components/ui/button"

import { DataGrid } from '@/components/data-grid'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  pagination?: {
    current_page: number
    total_pages: number
  }
  onPageChange?: (page: number) => void
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pagination,
  onPageChange,
}: DataTableProps<TData, TValue>) {
  return (
    <DataGrid
      columns={columns}
      data={data}
      pagination={pagination}
      onPageChange={onPageChange}
      filterColumn="name"
      filterPlaceholder="Filter departments..."
      action={
        <Link href="/departments/new" prefetch>
          <Button className="cursor-pointer" variant="outline">New Department</Button>
        </Link>
      }
    />
  )
}
