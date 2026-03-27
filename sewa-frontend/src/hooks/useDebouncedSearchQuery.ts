import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Production-ready search hook: debounced input with minimum length gate.
 *
 * - Debounces the search input (default 400ms) so the API is not called on every keystroke.
 * - Only updates the "applied" value (used for API) when:
 *   - query length is 0 (user cleared search), or
 *   - query length >= minLength (default 3).
 * - When the user types 1 or 2 characters, no API call is triggered; previous results stay.
 *
 * Use appliedQuery in your API/queryKey and bind inputValue/setInputValue to the input.
 * Pagination (page/size) is unchanged; use them as usual in the same request.
 */
export function useDebouncedSearchQuery(
    options: {
        /** Debounce delay in ms before updating the applied value. Default 400. */
        debounceMs?: number;
        /** Minimum length for search to trigger API. Below this, only clearing (length 0) triggers. Default 3. */
        minLength?: number;
        /** Initial applied value (e.g. ''). */
        initialValue?: string;
    } = {}
): [inputValue: string, setInputValue: (v: string) => void, appliedQuery: string] {
    const { debounceMs = 400, minLength = 3, initialValue = '' } = options;

    const [inputValue, setInputValueState] = useState(initialValue);
    const [appliedQuery, setAppliedQuery] = useState(initialValue);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const setInputValue = useCallback((value: string) => {
        setInputValueState(value);
    }, []);

    useEffect(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }

        const trimmed = inputValue.trim();
        const shouldApply = trimmed.length === 0 || trimmed.length >= minLength;

        if (shouldApply) {
            timeoutRef.current = setTimeout(() => {
                setAppliedQuery(trimmed);
                timeoutRef.current = null;
            }, debounceMs);
        }

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [inputValue, debounceMs, minLength]);

    return [inputValue, setInputValue, appliedQuery];
}
