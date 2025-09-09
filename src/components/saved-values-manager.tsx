"use client";

import { useState } from "react";
import { Trash2, Edit3, Copy, Download } from "lucide-react";
import { Button } from "src/components/ui/button";
import { Input } from "src/components/ui/input";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "src/components/ui/alert-dialog";
import { useSavedValues } from "src/contexts/saved-values-context";
import { formatCurrency, formatPercentage } from "src/lib/calculations";
import { toast } from "sonner";

/**
 * Component for managing saved financial values
 */
export function SavedValuesManager() {
  const { savedValues, updateValue, deleteValue, clearAll } = useSavedValues();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [isExporting, setIsExporting] = useState(false);

  /**
   * Format value for display based on type
   */
  const formatValue = (value: number, type: string): string => {
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
   * Start editing a saved value name
   */
  const startEditing = (id: string, currentName: string) => {
    setEditingId(id);
    setEditingName(currentName);
  };

  /**
   * Save edited name
   */
  const saveEdit = () => {
    if (!editingId || !editingName.trim()) return;

    updateValue(editingId, { name: editingName.trim() });
    setEditingId(null);
    setEditingName("");
    toast.success("Name updated successfully");
  };

  /**
   * Cancel editing
   */
  const cancelEdit = () => {
    setEditingId(null);
    setEditingName("");
  };

  /**
   * Handle deleting a single value
   */
  const handleDelete = (id: string, name: string) => {
    deleteValue(id);
    toast.success(`Deleted "${name}"`);
  };

  /**
   * Handle copying value to clipboard
   */
  const handleCopyValue = async (value: number, name: string) => {
    try {
      await navigator.clipboard.writeText(value.toString());
      toast.success(`Copied "${name}" value to clipboard`);
    } catch {
      toast.error("Failed to copy value to clipboard");
    }
  };

  /**
   * Export saved values to CSV
   */
  const handleExportCSV = async () => {
    setIsExporting(true);

    try {
      const headers = "Name,Value,Source,Type,Created At";
      const rows = savedValues
        .map((item) => {
          const formattedValue = formatValue(item.value, item.type);
          const createdAt = new Date(item.createdAt).toLocaleDateString();

          return [
            `"${item.name}"`,
            `"${formattedValue}"`,
            `"${item.source}"`,
            `"${item.type}"`,
            `"${createdAt}"`,
          ].join(",");
        })
        .join("\n");

      const csv = `${headers}\n${rows}`;
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");

      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "saved-financial-values.csv");
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }

      toast.success("Saved values exported to CSV");
    } catch {
      toast.error("Failed to export saved values");
    } finally {
      setIsExporting(false);
    }
  };

  if (savedValues.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Saved Values</CardTitle>
          <CardDescription>
            No saved values yet. Click on any number in your calculation results
            to save it for future use.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            Saved values will appear here when you click on numbers in
            calculation results.
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
            <CardTitle>Saved Values</CardTitle>
            <CardDescription>
              Manage your saved financial values. You have {savedValues.length}{" "}
              saved value{savedValues.length !== 1 ? "s" : ""}.
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportCSV}
              disabled={isExporting}
            >
              <Download className="size-4 mr-2" />
              {isExporting ? "Exporting..." : "Export CSV"}
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm">
                  Clear All
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Clear All Saved Values</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    all your saved values.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      clearAll();
                      toast.success("All saved values cleared");
                    }}
                  >
                    Clear All
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="text-right">Value</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {savedValues.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    {editingId === item.id ? (
                      <div className="flex gap-2">
                        <Input
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") saveEdit();
                            if (e.key === "Escape") cancelEdit();
                          }}
                          className="h-8"
                        />
                        <Button size="sm" onClick={saveEdit}>
                          Save
                        </Button>
                        <Button size="sm" variant="ghost" onClick={cancelEdit}>
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <div className="font-medium">{item.name}</div>
                    )}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {formatValue(item.value, item.type)}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {item.source}
                  </TableCell>
                  <TableCell className="text-muted-foreground capitalize">
                    {item.type}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1 justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopyValue(item.value, item.name)}
                        title="Copy raw value"
                      >
                        <Copy className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => startEditing(item.id, item.name)}
                        disabled={editingId === item.id}
                        title="Edit name"
                      >
                        <Edit3 className="size-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm" title="Delete">
                            <Trash2 className="size-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Delete Saved Value
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{item.name}"?
                              This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(item.id, item.name)}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
