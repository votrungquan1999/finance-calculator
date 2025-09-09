"use client";

import { useState } from "react";
import {
  Download,
  Copy,
  ChevronUp,
  ChevronDown,
  Save,
  Share,
} from "lucide-react";
import { Button } from "src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "src/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "src/components/ui/table";
import { formatCurrency, formatPercentage } from "src/lib/calculations";
import { SaveValueDialog } from "src/components/save-value-dialog";
import { toast } from "sonner";
import {
  generateShareableUrl,
  copyUrlToClipboard,
  type CalculatorState,
} from "src/lib/url-state";

export interface TableColumn {
  key: string;
  label: string;
  type: "currency" | "percentage" | "number" | "text";
}

export interface TableData {
  [key: string]: number | string;
}

interface ResultsTableProps {
  title: string;
  description?: string;
  columns: TableColumn[];
  data: TableData[];
  summary?: {
    label: string;
    value: number | string;
    type: "currency" | "percentage" | "number" | "text";
  }[];
  maxVisibleRows?: number;
  filename?: string;
  calculatorSource?: string; // Source identifier for saved values
  shareableState?: CalculatorState; // State for generating shareable URLs
}

/**
 * Reusable results table component with export functionality
 */
export function ResultsTable({
  title,
  description,
  columns,
  data,
  summary,
  maxVisibleRows = 12,
  filename = "financial-calculation",
  calculatorSource = "Financial Calculator",
  shareableState,
}: ResultsTableProps) {
  const [showAll, setShowAll] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const visibleData = showAll ? data : data.slice(0, maxVisibleRows);
  const hasMoreData = data.length > maxVisibleRows;

  /**
   * Format cell value based on column type
   */
  const formatCellValue = (value: number | string, type: string): string => {
    if (typeof value === "string") return value;

    switch (type) {
      case "currency":
        return formatCurrency(value);
      case "percentage":
        return formatPercentage(value);
      case "number":
        return value.toLocaleString();
      default:
        return String(value);
    }
  };

  /**
   * Convert data to CSV format
   */
  const convertToCSV = (): string => {
    const headers = columns.map((col) => col.label).join(",");
    const rows = data
      .map((row) =>
        columns
          .map((col) => {
            const value = row[col.key];
            const formattedValue = formatCellValue(value, col.type);
            // Escape commas and quotes in CSV
            return `"${String(formattedValue).replace(/"/g, '""')}"`;
          })
          .join(","),
      )
      .join("\n");

    let csv = `${headers}\n${rows}`;

    // Add summary if provided
    if (summary && summary.length > 0) {
      csv += "\n\nSummary\n";
      summary.forEach((item) => {
        const formattedValue = formatCellValue(item.value, item.type);
        csv += `"${item.label}","${formattedValue}"\n`;
      });
    }

    return csv;
  };

  /**
   * Download CSV file
   */
  const handleDownloadCSV = async () => {
    setIsExporting(true);
    try {
      const csv = convertToCSV();
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");

      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `${filename}.csv`);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }

      toast.success("CSV file downloaded successfully");
    } catch (error) {
      toast.error("Failed to download CSV file");
      console.error("CSV download error:", error);
    } finally {
      setIsExporting(false);
    }
  };

  /**
   * Copy data to clipboard
   */
  const handleCopyToClipboard = async () => {
    try {
      const csv = convertToCSV();
      await navigator.clipboard.writeText(csv);
      toast.success("Data copied to clipboard");
    } catch (error) {
      toast.error("Failed to copy data to clipboard");
      console.error("Clipboard copy error:", error);
    }
  };

  /**
   * Share calculator state via URL
   */
  const handleShareUrl = async () => {
    if (!shareableState) {
      toast.error("Sharing is not available for this calculation");
      return;
    }

    try {
      const shareableUrl = generateShareableUrl(shareableState);
      await copyUrlToClipboard(shareableUrl);
      toast.success("Shareable link copied to clipboard");
    } catch (error) {
      toast.error("Failed to generate shareable link");
      console.error("Share URL error:", error);
    }
  };

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            No data to display. Please run a calculation first.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </div>
          <div className="flex gap-2">
            {shareableState && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleShareUrl}
                disabled={isExporting}
              >
                <Share className="size-4 mr-2" />
                Share
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyToClipboard}
              disabled={isExporting}
            >
              <Copy className="size-4 mr-2" />
              Copy
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadCSV}
              disabled={isExporting}
            >
              <Download className="size-4 mr-2" />
              {isExporting ? "Exporting..." : "CSV"}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead key={column.key} className="text-center">
                    {column.label}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {visibleData.map((row, rowIndex) => (
                <TableRow key={`row-${rowIndex}-${row.month || rowIndex}`}>
                  {columns.map((column) => {
                    const value = row[column.key];
                    const isNumeric =
                      typeof value === "number" && column.type !== "text";
                    const formattedValue = formatCellValue(value, column.type);

                    return (
                      <TableCell
                        key={column.key}
                        className="text-center font-mono text-sm"
                      >
                        {isNumeric ? (
                          <SaveValueDialog
                            value={value as number}
                            columnLabel={column.label}
                            columnType={
                              column.type as
                                | "currency"
                                | "percentage"
                                | "number"
                                | "text"
                            }
                            rowIndex={rowIndex}
                            calculatorSource={calculatorSource}
                            formattedValue={formattedValue}
                          >
                            <button
                              type="button"
                              className="w-full p-1 rounded hover:bg-muted/50 hover:text-primary transition-colors group flex items-center justify-center gap-2"
                            >
                              <span>{formattedValue}</span>
                              <Save className="size-3 opacity-0 group-hover:opacity-70 transition-opacity" />
                            </button>
                          </SaveValueDialog>
                        ) : (
                          formattedValue
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {hasMoreData && (
          <div className="flex justify-center mt-4">
            <Button
              variant="ghost"
              onClick={() => setShowAll(!showAll)}
              className="flex items-center gap-2"
            >
              {showAll ? (
                <>
                  <ChevronUp className="size-4" />
                  Show Less
                </>
              ) : (
                <>
                  <ChevronDown className="size-4" />
                  Show All ({data.length} rows)
                </>
              )}
            </Button>
          </div>
        )}

        {summary && summary.length > 0 && (
          <div className="mt-6 pt-6 border-t">
            <h3 className="font-semibold mb-3">Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {summary.map((item) => {
                const isNumeric =
                  typeof item.value === "number" && item.type !== "text";
                const formattedValue = formatCellValue(item.value, item.type);

                return (
                  <div
                    key={item.label}
                    className="text-center p-3 bg-muted/50 rounded-lg"
                  >
                    <p className="text-sm text-muted-foreground">
                      {item.label}
                    </p>
                    {isNumeric ? (
                      <SaveValueDialog
                        value={item.value as number}
                        columnLabel={item.label}
                        columnType={
                          item.type as
                            | "currency"
                            | "percentage"
                            | "number"
                            | "text"
                        }
                        rowIndex={-1} // Summary item doesn't have row index
                        calculatorSource={calculatorSource}
                        formattedValue={formattedValue}
                      >
                        <button
                          type="button"
                          className="text-lg font-semibold hover:text-primary transition-colors group inline-flex items-center gap-2 p-1 rounded hover:bg-background/50"
                        >
                          <span>{formattedValue}</span>
                          <Save className="size-3 opacity-0 group-hover:opacity-70 transition-opacity" />
                        </button>
                      </SaveValueDialog>
                    ) : (
                      <p className="text-lg font-semibold">{formattedValue}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
