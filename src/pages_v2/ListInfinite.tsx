import React, { useCallback, useEffect, useRef, useState } from "react";
import { iterableBuilder } from "../types/IterableClass";
import Iterable from "../types/Iterable";
import axios from "axios";
import { useLoadUpdated } from "../hooks/useLoadUpdated";
import { useToken } from "../hooks/useToken";
import CONFIG from "../Config";
import { LoadingOutlined, PlusSquareFilled } from "@ant-design/icons";
import { Collapse, Tooltip } from "antd";
import StepsList from "./StepsList";
const { Panel } = Collapse;

interface Props {
  onItemSelected: any;
  requestUrl: string;
  requestParams: (pageNo: number) => any | null;
  renderItem?: (
    item: any,
    onItemSelected: (item: any) => void
  ) => React.ReactNode;
}

const ListInfinite: React.FC<Props> = ({
  onItemSelected,
  requestUrl,
  requestParams,
  renderItem,
}) => {
  const [_page, setPage] = useState(0);
  const [_reload, setReload] = useState(true);
  const [_list, setList] = useState<any[]>([]);
  const [_hasMoreItems, setHasMoreItems] = useState(false);
  const [_isLoading, setIsLoading] = useState(false);
  const [_selectedItem, setSelectedItem] = useState<Iterable | null>();
  const [_token] = useToken();
  const [_currentStep, setCurrentStep] = useState<Iterable | null>();

  useEffect(() => {
    onItemSelected(_selectedItem);
  }, [_selectedItem]);

  const fetchItemsFunction = function (pageNo: number) {
    let _params = {
      pageNo: pageNo,
      pageSize: 10,
      sortBy: "id",
      direction: "asc",
    };

    return axios
      .get(CONFIG.BACK_SERVER_DOMAIN + requestUrl, {
        headers: { Authorization: _token ? `${_token}` : null },
        params: requestParams == null ? _params : requestParams(pageNo),
      })
      .then((response) => {
        let mappedContent: Iterable[] = [];
        response.data.content.forEach((e: any) => {
          mappedContent.push(
            iterableBuilder(e.id, e.title, e.content, e.details)
          );
        });
        response.data.content = mappedContent;
        return response.data;
      });
  };

  const { items, hasMore, loading } = useLoadUpdated(
    fetchItemsFunction,
    _page,
    _reload
  );

  useEffect(() => {
    setList(items);
    setHasMoreItems(hasMore);
    setIsLoading(loading);
    setReload(false);
  }, [items, hasMore, loading]);

  // --
  const observer = useRef<IntersectionObserver>();
  const [error, setError] = useState(false);
  const [selectedItem, set_SelectedItem] = useState<Iterable>();

  const lastListElementRef = useCallback(
    (node: any) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage(_page + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  const handleDoubleClick = (item: Iterable) => {
    console.log();
  };

  const handleClick = (item: Iterable) => {
    setSelectedItem(item);
  };

  const addNewStep = () => {
    setCurrentStep(iterableBuilder(0, "", "", ""));
  };

  return (
    <>
      <div style={{ overflow: "auto", ...styles.listSize }}>
        {items.map((item, index) => {
          const isLastItem = items.length > 0 && index === items.length - 1;
          const isSelected = selectedItem?.getId() === item.getId();
          return (
            <div
              ref={isLastItem ? lastListElementRef : undefined}
              key={item.getId()}
              onClick={() => handleClick(item)}
              onDoubleClick={() => handleDoubleClick(item)}
            >
              {renderItem ? (renderItem(item, onItemSelected))
              :
              (item.getTitle())}
            </div>
          );
        })}
        {loading && <LoadingOutlined style={{ fontSize: 24 }} spin />}
        {error && <div>Error loading items</div>}
        {!loading && hasMore && (
          <div ref={lastListElementRef}>Loading more...</div>
        )}
      </div>
    </>
  );
};

export default ListInfinite;

const styles = {
  listSize: { maxWidth: "400px", maxHeight: "75vh" },
};
