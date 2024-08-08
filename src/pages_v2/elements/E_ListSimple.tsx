import React, { useEffect, useState } from "react";
import { iterableBuilder } from "../types/IterableClass";
import Iterable from "../types/Iterable";
import axios from "axios";
import { useLoadUpdated } from "../hooks/useLoadUpdated";
import { useToken } from "../hooks/useToken";
import E_ListInfiniteBasic from "./E_ListInfiniteBasic";
import CONFIG from "../../Config";

interface Props {
  onItemSelected: any;
  reloadList: boolean;
  onListReloaded: any;
  requestUrl: string;
  params: (pageNo: number) => any | null;
}

const E_ListSimple: React.FC<Props> = ({
  onItemSelected,
  reloadList,
  onListReloaded,
  requestUrl,
  params,
}) => {
  const [_page, setPage] = useState(0);
  const [_reload, setReload] = useState(true);
  const [_list, setList] = useState<any[]>([]);
  const [_hasMoreItems, setHasMoreItems] = useState(false);
  const [_isLoading, setIsLoading] = useState(false);
  const [_selectedItem, setSelectedItem] = useState<Iterable | null>();
  const [_token] = useToken();

  useEffect(() => {
    onItemSelected(_selectedItem);
  }, [_selectedItem]);

  useEffect(() => {
    if (reloadList) {
      setReload(true);
    }
  }, [reloadList]);

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
        params: params == null ? _params : params(pageNo),
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
    onListReloaded();
  }, [items, hasMore, loading]);

  return (
    <E_ListInfiniteBasic
      items={_list}
      page={_page}
      hasMore={_hasMoreItems}
      loading={_isLoading}
      onPageChange={(pageNo: number) => {
        setPage(pageNo);
      }}
      onItemSelect={(item: any) => {
        setSelectedItem(item);
      }}
      listItemStyles={{
        height: "30px",
        width: "390px",
        fontSize: "14px",
        border: "0px",
        borderTop: "1px solid #D3D3D3",
        // borderBottom: "1px solid #D3D3D3",
        cursor: "pointer",
        borderRadius: "3px",
        paddingTop: "5px",
        paddingLeft: "10px",
        fontFamily: "Merriweather",
        fontWeight: "bold",
      }}
      listSize={{ maxWidth: "400px", maxHeight: "165px" }}
    />
  );
};

export default E_ListSimple;
