import { useSearchParams } from "react-router-dom";
import { useEffect, useMemo } from "react";

type PaginationConfig = {
  pageKey?: string;
  sizeKey?: string;
  defaultPage?: number;
  defaultSize?: number;
  defaultStatus?: number;
  statusKey?: string;
};

export default function usePaginationParams(config?: PaginationConfig) {
  const {
    pageKey = "page",
    sizeKey = "pageSize",
    statusKey = "status",
    defaultPage = 1,
    defaultSize = 10,
    defaultStatus = -1,
  } = config || {};

  const [searchParams, setSearchParams] = useSearchParams();

  // 参数初始化
  useEffect(() => {
    const page = searchParams.get(pageKey);
    const size = searchParams.get(sizeKey);
    const status = searchParams.get(statusKey);

    if (!page || !size || !status) {
      const newParams = new URLSearchParams(searchParams);

      if (!page) newParams.set(pageKey, defaultPage.toString());
      if (!size) newParams.set(sizeKey, defaultSize.toString());
      if (!status) newParams.set(statusKey, defaultStatus.toString());
      setSearchParams(newParams, { replace: true });
    }
  }, [
    searchParams,
    setSearchParams,
    pageKey,
    sizeKey,
    statusKey,
    defaultPage,
    defaultSize,
    defaultStatus,
  ]);

  // 类型安全的参数值获取
  return useMemo(
    () => ({
      pageNum: parseInt(searchParams.get(pageKey) || String(defaultPage), 10),
      pageSizeNum: parseInt(
        searchParams.get(sizeKey) || String(defaultSize),
        10
      ),
      statusNum: parseInt(
        searchParams.get(statusKey) || String(defaultStatus),
        10
      ),
      setPagination: (page: number, size: number, statusNum: number) => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set(pageKey, String(page));
        newParams.set(sizeKey, String(size));
        newParams.set(statusKey, String(statusNum));
        setSearchParams(newParams);
      },
    }),
    [
      searchParams,
      setSearchParams,
      pageKey,
      sizeKey,
      defaultPage,
      defaultSize,
      statusKey,
      defaultStatus,
    ]
  );
}
