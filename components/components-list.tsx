import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { getRegistryItems } from '@/lib/registry';
import { docsRoute } from '@/lib/shared';

/** Table of every registry item, used on the Components index docs page. */
export function ComponentsList() {
  const items = getRegistryItems();

  if (items.length === 0) {
    return <p>No components yet. Run <code>pnpm new:component my-component</code> to add one.</p>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Component</th>
          <th>Description</th>
          <th>Categories</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr key={item.name}>
            <td>
              <Link href={`${docsRoute}/components/${item.name}`}>{item.title ?? item.name}</Link>
            </td>
            <td>{item.description}</td>
            <td>
              <span className="flex flex-wrap gap-1">
                {item.categories?.map((c) => (
                  <Badge key={c} variant="secondary">
                    {c}
                  </Badge>
                ))}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
