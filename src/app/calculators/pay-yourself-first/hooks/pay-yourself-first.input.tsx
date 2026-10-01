"use client";

import { useRawPayDispatch } from "../pay-yourself-first.state";
import { PayActionType, type PayFieldId } from "../pay-yourself-first.type";

/**
 * Hook with the handlers that change form values
 */
export const useInputHandlers = () => {
  const dispatch = useRawPayDispatch();

  /**
   * Stores what the saver typed into one field
   */
  const handleInputChange = (fieldId: PayFieldId, value: string) => {
    dispatch({
      type: PayActionType.SetFormValue,
      payload: { fieldId, value },
    });
  };

  return { handleInputChange };
};
