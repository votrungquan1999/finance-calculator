"use client";

import { useState } from "react";
import { Save } from "lucide-react";
import { Button } from "src/components/ui/button";
import { Input } from "src/components/ui/input";
import { Label } from "src/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "src/components/ui/dialog";
import { useSavedValues } from "src/contexts/saved-values-context";
import { toast } from "sonner";

interface SaveValueDialogProps {
  value: number;
  columnLabel: string;
  columnType: "currency" | "percentage" | "number" | "text";
  rowIndex?: number;
  calculatorSource?: string;
  formattedValue: string;
  children: React.ReactNode;
}

/**
 * Dialog component for saving values with custom names
 */
export function SaveValueDialog({
  value,
  columnLabel,
  columnType,
  rowIndex = -1,
  calculatorSource = "Financial Calculator",
  formattedValue,
  children,
}: SaveValueDialogProps) {
  const [open, setOpen] = useState(false);
  const [customName, setCustomName] = useState("");
  const { saveValue } = useSavedValues();

  /**
   * Generate default name for the value
   */
  const getDefaultName = () => {
    return rowIndex === -1
      ? columnLabel // Summary item
      : `${columnLabel} (Row ${rowIndex + 1})`; // Table row item
  };

  /**
   * Handle saving the value with custom or default name
   */
  const handleSave = () => {
    const nameToUse = customName.trim() || getDefaultName();

    if (columnType === "text") {
      toast.error("Cannot save text values");
      return;
    }

    saveValue({
      name: nameToUse,
      value,
      source: calculatorSource,
      type: columnType as "currency" | "percentage" | "number",
    });

    toast.success(`Saved "${nameToUse}" (${formattedValue})`);
    setOpen(false);
    setCustomName("");
  };

  /**
   * Handle opening the dialog
   */
  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) {
      setCustomName(getDefaultName());
    } else {
      setCustomName("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Save Value</DialogTitle>
          <DialogDescription>
            Save this value for future use in other calculations. You can
            customize the name or use the suggested name.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="value-display">Value</Label>
            <Input
              id="value-display"
              value={formattedValue}
              readOnly
              className="bg-muted font-mono"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="value-name">Name</Label>
            <Input
              id="value-name"
              placeholder="Enter a name for this value..."
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSave();
                }
              }}
            />
            <p className="text-xs text-muted-foreground">
              This name will help you identify the value later when using it in
              other calculations.
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!customName.trim()}>
            <Save className="size-4 mr-2" />
            Save Value
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
