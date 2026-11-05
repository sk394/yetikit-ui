import { Activity, CreditCard, DollarSign, Users } from 'lucide-react';
import { StatCard } from '@/registry/ui/stat-card';

export default function StatCardDemo() {
  return (
    <div className="grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard label="Revenue" value="$45,231" delta={20.1} deltaLabel="vs last month" icon={<DollarSign />} />
      <StatCard label="Subscriptions" value="+2,350" delta={180.1} deltaLabel="vs last month" icon={<Users />} />
      <StatCard label="Sales" value="+12,234" delta={-4.3} deltaLabel="vs last month" icon={<CreditCard />} />
      <StatCard label="Active now" value="573" delta={0} deltaLabel="no change" icon={<Activity />} />
    </div>
  );
}
