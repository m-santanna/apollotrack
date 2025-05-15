import { MoreHorizontal, Pencil, Trash } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
    editFoodItemDialogAtom,
    editFoodItemValuesAtom,
    Food,
    foodListAtom,
} from '@/lib/atoms'
import { ColumnDef } from '@tanstack/react-table'
import { useAtom, useSetAtom } from 'jotai/react'
import { Checkbox } from '../ui/checkbox'

export const columns: ColumnDef<Food>[] = [
    {
        id: 'select',
        header: ({ table }) => (
            <div className="flex items-center h-full w-full">
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && 'indeterminate')
                    }
                    onCheckedChange={(value) =>
                        table.toggleAllPageRowsSelected(!!value)
                    }
                    aria-label="Select all"
                    className="flex items-center"
                />
            </div>
        ),
        cell: ({ row }) => (
            <div className="flex items-center h-full w-full">
                <Checkbox
                    className="flex items-center"
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                />
            </div>
        ),
        enableSorting: false,
        enableHiding: false,
    },
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
        accessorKey: 'protein',
        header: () => (
            <div className="text-center font-semibold">Protein (g)</div>
        ),
        cell: ({ row }) => (
            <div className="text-center">{row.getValue('protein')}</div>
        ),
    },
    {
        accessorKey: 'carbs',
        header: () => (
            <div className="text-center font-semibold">Carbs (g)</div>
        ),
        cell: ({ row }) => (
            <div className="text-center">{row.getValue('carbs')}</div>
        ),
    },
    {
        accessorKey: 'fat',
        header: () => <div className="text-center font-semibold">Fat (g)</div>,
        cell: ({ row }) => (
            <div className="text-center">{row.getValue('fat')}</div>
        ),
    },
    {
        accessorKey: 'totalAmount',
        header: () => (
            <div className="text-center font-semibold">Total Amount (g)</div>
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
    {
        id: 'actions',
        cell: ({ row }) => {
            const food = row.original
            const [foodList, setFoodList] = useAtom(foodListAtom)
            const setEditFoodItemDialog = useSetAtom(editFoodItemDialogAtom)
            const setEditFoodItemValues = useSetAtom(editFoodItemValuesAtom)
            return (
                <div className="flex justify-end">
                    <Button
                        onClick={() => {
                            setEditFoodItemValues(food)
                            setEditFoodItemDialog(true)
                        }}
                        variant="ghost"
                        className="h-8 w-8 p-0 hover:text-foreground/50"
                    >
                        <span className="sr-only">Edit food</span>
                        <Pencil className="h-4 w-4" />
                    </Button>
                </div>
            )
        },
        enableHiding: false,
    },
]
