"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import type {
  SlmcVerificationStatus,
  SlmcPractitioner,
  SlmcVerificationResult,
} from "../types/slmc";

const DEBOUNCE_MS = 800;

interface UseSlmcVerificationReturn {
  status: SlmcVerificationStatus;
  practitioner: SlmcPractitioner | null;
  error: string | null;
  /** Current value being tracked for debounced verification */
  inputValue: string;
  /** Call on every input change — triggers debounced auto-verify */
  setInputValue: (value: string) => void;
  reset: () => void;
}

export function useSlmcVerification(): UseSlmcVerificationReturn {
  const [inputValue, setInputValueState] = useState("");
  const [status, setStatus] = useState<SlmcVerificationStatus>("idle");
  const [practitioner, setPractitioner] = useState<SlmcPractitioner | null>(null);
  const [error, setError] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastVerifiedRef = useRef<string>("");

  const reset = useCallback(() => {
    abortControllerRef.current?.abort();
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setStatus("idle");
    setPractitioner(null);
    setError(null);
    lastVerifiedRef.current = "";
  }, []);

  const verify = useCallback(async (regNo: string) => {
    const trimmed = regNo.trim();
    if (!trimmed || trimmed === lastVerifiedRef.current) return;

    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    lastVerifiedRef.current = trimmed;
    setStatus("loading");
    setError(null);
    setPractitioner(null);

    try {
      const params = new URLSearchParams({ regNo: trimmed });
      const response = await fetch(`/api/slmc/verify?${params.toString()}`, {
        signal: controller.signal,
      });
      const result: SlmcVerificationResult = await response.json();

      if (controller.signal.aborted) return;

      if (result.valid) {
        setStatus("valid");
        setPractitioner(result.practitioner);
        setError(null);
      } else {
        setStatus("invalid");
        setPractitioner(null);
        setError(result.error);
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      setStatus("invalid");
      setError("Unable to verify SLMC registration. Please try again.");
    }
  }, []);

  const setInputValue = useCallback(
    (value: string) => {
      setInputValueState(value);

      if (debounceRef.current) clearTimeout(debounceRef.current);

      const trimmed = value.trim();

      if (!trimmed) {
        reset();
        return;
      }

      if (trimmed === lastVerifiedRef.current) return;

      // Reset visual state while waiting for debounce
      if (status !== "idle") {
        setStatus("idle");
        setPractitioner(null);
        setError(null);
      }

      debounceRef.current = setTimeout(() => {
        verify(trimmed);
      }, DEBOUNCE_MS);
    },
    [reset, verify, status]
  );

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  return { status, practitioner, error, inputValue, setInputValue, reset };
}
