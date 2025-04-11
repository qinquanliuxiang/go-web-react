// useSearchParamsHook.ts
import { useSearchParams } from "react-router-dom";
import { useMemo } from "react";

type SearchConfig = {
  keywordKey?: string;
  valueKey?: string;
  defaultKeyword?: string;
  defaultValue?: string;
};

export default function useSearchParamsHook(config?: SearchConfig) {
  const {
    keywordKey = "keyword",
    valueKey = "value",
    defaultKeyword = "",
    defaultValue = "",
  } = config || {};

  const [searchParams, setSearchParams] = useSearchParams();

  return useMemo(() => {
    const currentKeyword = searchParams.get(keywordKey) || defaultKeyword;
    const currentValue = searchParams.get(valueKey) || defaultValue;

    return {
      keyword: currentKeyword,
      value: currentValue,
      keywordKey,
      valueKey,

      setSearch: (keyword: string, value: string) => {
        const newParams = new URLSearchParams(searchParams);

        if (value) {
          newParams.set(keywordKey, keyword);
          newParams.set(valueKey, value);
        } else {
          newParams.delete(keywordKey);
          newParams.delete(valueKey);
        }

        setSearchParams(newParams);
      },

      clearSearch: () => {
        const newParams = new URLSearchParams(searchParams);
        newParams.delete(keywordKey);
        newParams.delete(valueKey);
        setSearchParams(newParams);
      },
    };
  }, [
    searchParams,
    setSearchParams,
    keywordKey,
    valueKey,
    defaultKeyword,
    defaultValue,
  ]);
}
