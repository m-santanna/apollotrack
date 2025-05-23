import { Food } from '@/lib/atoms'
import { ColumnDef } from '@tanstack/react-table'

export const columns: ColumnDef<Food>[] = [
    {
        accessorKey: 'name',
        header: () => (
            <div className="text-center font-semibold">Food Name</div>
        ),
        cell: ({ row }) => (
            <div className="text-center">{row.getValue('name')}</div>
        ),
        enableHiding: false,
    },
    {
        accessorKey: 'calories',
        header: () => <div className="text-center font-semibold">Calories</div>,
        cell: ({ row }) => (
            <div className="text-center">{row.getValue('calories')}</div>
        ),
    },
    {
        accessorKey: 'carbs',
        header: () => <div className="text-center font-semibold">Carbs</div>,
        cell: ({ row }) => (
            <div className="text-center">{row.getValue('carbs')}</div>
        ),
    },
    {
        accessorKey: 'fat',
        header: () => <div className="text-center font-semibold">Fat</div>,
        cell: ({ row }) => (
            <div className="text-center">{row.getValue('fat')}</div>
        ),
    },
    {
        accessorKey: 'protein',
        header: () => <div className="text-center font-semibold">Protein</div>,
        cell: ({ row }) => (
            <div className="text-center">{row.getValue('protein')}</div>
        ),
    },
    {
        accessorKey: 'totalAmount',
        header: () => (
            <div className="text-center font-semibold">Total Amount</div>
        ),
        cell: ({ row }) => (
            <div className="text-center">{row.getValue('totalAmount')}</div>
        ),
    },
    {
        accessorKey: 'price',
        header: () => <div className="text-center font-semibold">Price</div>,
        cell: ({ row }) => (
            <div className="text-center">{row.getValue('price')}</div>
        ),
    },
]
