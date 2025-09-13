"use client";

import {
  ChevronDown,
  ChevronUp,
  Copy,
  Download,
  Save,
  Share,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { SaveValueDialog } from "src/components/save-value-dialog";
import { Button } from "src/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "src/components/ui/table";
import { useLoanFeeSummary } from "../hooks/loan-fee.summary";
import { useLoanFeeState } from "../loan-fee.state";
import type { SummaryItem as SummaryItemType } from "../loan-fee.type";
import { SummaryContainer, SummaryItem } from "../loan-fee.ui";
import { generateShareableUrlState } from "../loan-fee.url";

/**
 * Results table component that uses hooks to access calculator state
 * Renders the loan fee payment schedule with calculated results and summary
 */
export function LoanFeeResultsTableWithData() {
  const state = useLoanFeeState();
  const { summaryItems } = useLoanFeeSummary();
  const [showAll, setShowAll] = useState(false);

  const { result } = state;

  // This component should only render when result exists (handled by ResultsWrapper)
  if (!result) return null;

  const summary = summaryItems;
  const shareableUrl = generateShareableUrlState(
    state.formState,
    state.calculationMode,
  );

  const tableColumns = [
    { key: "month", label: "Month", type: "number" },
    { key: "payment", label: "Payment", type: "currency" },
    { key: "principal", label: "Principal", type: "currency" },
    { key: "interest", label: "Interest", type: "currency" },
    { key: "remainingBalance", label: "Remaining Balance", type: "currency" },
  ];

  const maxVisibleRows = 12;
  const visibleData = showAll
    ? result.payments
    : result.payments.slice(0, maxVisibleRows);
  const hasMoreData = result.payments.length > maxVisibleRows;

  /**
   * Format cell value based on column type
   */
  const formatCellValue = (value: number | string, type: string): string => {
    if (typeof value === "string") return value;

    switch (type) {
      case "currency":
        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(value);
      case "percentage":
        return `${value.toFixed(2)}%`;
      case "number":
        return value.toLocaleString();
      default:
        return String(value);
    }
  };

  /**
   * Get value from table data row using column key
   */
  const getTableValue = (
    row: Record<string, number | string>,
    key: string,
  ): number | string | undefined => {
    return row[key];
  };

  /**
   * Convert data to CSV format
   */
  const convertToCSV = (): string => {
    const headers = tableColumns.map((col) => col.label).join(",");
    const rows = result.payments
      .map((row) =>
        tableColumns
          .map((col) => {
            const value = getTableValue(
              row as unknown as Record<string, number | string>,
              col.key,
            );
            const formattedValue =
              value !== undefined ? formatCellValue(value, col.type) : "";
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
      summary.forEach((item: SummaryItemType) => {
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
    try {
      const csv = convertToCSV();
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");

      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "loan-fee-payment-schedule.csv");
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
    if (!shareableUrl) {
      toast.error("Sharing is not available for this calculation");
      return;
    }

    try {
      const fullUrl = `${window.location.origin}${window.location.pathname}?${shareableUrl}`;
      await navigator.clipboard.writeText(fullUrl);
      toast.success("Shareable link copied to clipboard");
    } catch (error) {
      toast.error("Failed to generate shareable link");
      console.error("Share URL error:", error);
    }
  };

  return (
    <div className="space-y-4">
      {/* Summary Section */}
      <SummaryContainer>
        {summary.map((item: SummaryItemType) => (
          <SummaryItem
            key={item.label}
            label={item.label}
            value={item.value}
            type={item.type}
          />
        ))}
      </SummaryContainer>

      {/* Action Buttons */}
      <div className="flex gap-2 justify-end">
        {shareableUrl && (
          <Button variant="outline" size="sm" onClick={handleShareUrl}>
            <Share className="size-4 mr-2" />
            Share
          </Button>
        )}
        <Button variant="outline" size="sm" onClick={handleCopyToClipboard}>
          <Copy className="size-4 mr-2" />
          Copy
        </Button>
        <Button variant="outline" size="sm" onClick={handleDownloadCSV}>
          <Download className="size-4 mr-2" />
          CSV
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {tableColumns.map((column) => (
                <TableHead key={column.key} className="text-center">
                  {column.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {visibleData.map((payment, rowIndex) => (
              <TableRow key={`${payment.month}-${payment.payment}`}>
                {tableColumns.map((column) => {
                  const value = getTableValue(
                    payment as unknown as Record<string, number | string>,
                    column.key,
                  );
                  const isNumeric =
                    typeof value === "number" && column.type !== "text";
                  const formattedValue =
                    value !== undefined
                      ? formatCellValue(value, column.type)
                      : "";

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
                          calculatorSource="Loan Fee Calculator"
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

      {/* Show More/Less Button */}
      {hasMoreData && (
        <div className="flex justify-center">
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
                Show All ({result.payments.length} rows)
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
