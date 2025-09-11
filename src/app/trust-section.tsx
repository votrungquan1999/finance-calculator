import { CheckCircle, Shield, Users } from "lucide-react";

/**
 * Trust indicators section building credibility and confidence
 */
export function TrustSection() {
  return (
    <div className="bg-muted/30 rounded-2xl p-8">
      <div className="text-center space-y-6">
        <h2 className="text-2xl font-semibold">
          Trusted Financial Calculation Platform
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center space-y-2">
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/20 w-fit mx-auto">
              <Shield className="size-6 text-green-600" />
            </div>
            <h3 className="font-medium">Secure & Private</h3>
            <p className="text-sm text-muted-foreground">
              No data stored on our servers. All calculations happen in your
              browser for complete privacy.
            </p>
          </div>
          <div className="text-center space-y-2">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/20 w-fit mx-auto">
              <Users className="size-6 text-blue-600" />
            </div>
            <h3 className="font-medium">Used by Professionals</h3>
            <p className="text-sm text-muted-foreground">
              Trusted by financial advisors, loan officers, and individuals
              making important financial decisions.
            </p>
          </div>
          <div className="text-center space-y-2">
            <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/20 w-fit mx-auto">
              <CheckCircle className="size-6 text-purple-600" />
            </div>
            <h3 className="font-medium">Always Up-to-Date</h3>
            <p className="text-sm text-muted-foreground">
              Regular updates ensure our calculators use the latest financial
              formulas and best practices.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
