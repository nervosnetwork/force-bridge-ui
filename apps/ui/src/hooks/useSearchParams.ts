import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

export function useSearchParams(): URLSearchParams {
  const search = useLocation().search;
  return useMemo(() => new URLSearchParams(search), [search]);
}
