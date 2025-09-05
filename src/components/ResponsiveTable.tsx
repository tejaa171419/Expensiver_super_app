import { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";

interface ResponsiveTableProps {
  headers: string[];
  children: ReactNode;
  className?: string;
}

const ResponsiveTable = ({ headers, children, className = "" }: ResponsiveTableProps) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    // On mobile, convert to card-based layout
    return (
      <div className={`space-y-3 ${className}`}>
        {children}
      </div>
    );
  }

  // Desktop table layout
  return (
    <div className="table-mobile-scroll">
      <table className={`w-full min-w-max ${className}`}>
        <thead>
          <tr className="border-b border-border">
            {headers.map((header, index) => (
              <th
                key={index}
                className="text-left py-3 px-4 font-medium text-muted-foreground text-sm"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {children}
        </tbody>
      </table>
    </div>
  );
};

interface ResponsiveTableRowProps {
  data: Record<string, any>;
  headers: string[];
  renderMobileCard?: (data: Record<string, any>) => ReactNode;
  className?: string;
}

export const ResponsiveTableRow = ({ 
  data, 
  headers, 
  renderMobileCard, 
  className = "" 
}: ResponsiveTableRowProps) => {
  const isMobile = useIsMobile();

  if (isMobile && renderMobileCard) {
    return (
      <Card className={`glass-card p-4 ${className}`}>
        {renderMobileCard(data)}
      </Card>
    );
  }

  if (isMobile) {
    // Default mobile card layout
    return (
      <Card className={`glass-card p-4 space-y-2 ${className}`}>
        {headers.map((header, index) => (
          <div key={index} className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">{header}:</span>
            <span className="text-sm font-medium">{data[header.toLowerCase()]}</span>
          </div>
        ))}
      </Card>
    );
  }

  // Desktop row layout
  return (
    <tr className={`border-b border-border/50 hover:bg-white/5 transition-colors ${className}`}>
      {headers.map((header, index) => (
        <td key={index} className="py-3 px-4 text-sm">
          {data[header.toLowerCase()]}
        </td>
      ))}
    </tr>
  );
};

export default ResponsiveTable;