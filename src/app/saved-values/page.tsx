import { SavedValuesManager } from "src/components/saved-values-manager";

/**
 * Saved values management page
 */
export default function SavedValuesPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Saved Values</h1>
        <p className="text-muted-foreground mt-2">
          Manage and use your saved financial values. Click on any number in
          calculation results to save it for future use in other calculations.
        </p>
      </div>

      <SavedValuesManager />
    </div>
  );
}
