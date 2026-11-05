import { Badge } from '@/components/ui/badge';
import { DataTable, type DataTableColumn } from '@/registry/ui/data-table';

type Invoice = {
  id: string;
  customer: string;
  status: 'paid' | 'pending' | 'overdue';
  amount: number;
  date: string;
};

const invoices: Invoice[] = [
  { id: 'INV-1001', customer: 'Acme Corp', status: 'paid', amount: 1250, date: '2026-09-02' },
  { id: 'INV-1002', customer: 'Globex', status: 'pending', amount: 820.5, date: '2026-09-05' },
  { id: 'INV-1003', customer: 'Initech', status: 'overdue', amount: 2310, date: '2026-08-21' },
  { id: 'INV-1004', customer: 'Umbrella', status: 'paid', amount: 640, date: '2026-09-11' },
  { id: 'INV-1005', customer: 'Hooli', status: 'paid', amount: 4120, date: '2026-09-14' },
  { id: 'INV-1006', customer: 'Stark Industries', status: 'pending', amount: 980, date: '2026-09-18' },
  { id: 'INV-1007', customer: 'Wayne Enterprises', status: 'overdue', amount: 1575, date: '2026-08-30' },
  { id: 'INV-1008', customer: 'Wonka', status: 'paid', amount: 215, date: '2026-09-20' },
  { id: 'INV-1009', customer: 'Cyberdyne', status: 'pending', amount: 3300, date: '2026-09-22' },
  { id: 'INV-1010', customer: 'Tyrell', status: 'paid', amount: 760, date: '2026-09-25' },
  { id: 'INV-1011', customer: 'Soylent', status: 'overdue', amount: 1890, date: '2026-08-15' },
  { id: 'INV-1012', customer: 'Vandelay', status: 'paid', amount: 430, date: '2026-09-28' },
];

const statusVariant = { paid: 'secondary', pending: 'outline', overdue: 'destructive' } as const;

const columns: DataTableColumn<Invoice>[] = [
  { key: 'id', header: 'Invoice', sortable: true, className: 'font-medium' },
  { key: 'customer', header: 'Customer', sortable: true },
  {
    key: 'status',
    header: 'Status',
    sortable: true,
    cell: (row) => <Badge variant={statusVariant[row.status]}>{row.status}</Badge>,
  },
  {
    key: 'amount',
    header: 'Amount',
    sortable: true,
    className: 'text-right',
    cell: (row) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(row.amount),
  },
  { key: 'date', header: 'Date', sortable: true, accessor: (row) => new Date(row.date) , cell: (row) => row.date },
];

export default function DataTableDemo() {
  return <DataTable data={invoices} columns={columns} pageSize={5} getRowId={(row) => row.id} className="w-full" />;
}
