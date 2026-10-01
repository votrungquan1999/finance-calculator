"use client";

import { validateFields } from "src/lib/pay-yourself-first/validation";
import { useRawPayDispatch, useRawPayState } from "../pay-yourself-first.state";
import { PayActionType } from "../pay-yourself-first.type";

/**
 * Hook that shows the validation messages under their fields
 */
export const useFormValidation = () => {
  const { formValues } = useRawPayState();
  const dispatch = useRawPayDispatch();

  /**
   * Validates the typed values and shows a message under each bad field.
   * @returns True when every typed value is acceptable
   */
  const validateForm = (): boolean => {
    const errors = validateFields(formValues);
    dispatch({ type: PayActionType.SetFormErrors, payload: errors });
    return Object.keys(errors).length === 0;
  };

  return { validateForm };
};
