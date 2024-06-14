import { useEffect, useState } from "react";
import ListInfiniteFormatableUpdated from "../elements/ListInfiniteFormatableUpdated";
import axios from "axios";
import CONFIG from "../../../Config";
import { useToken } from "../../../hooks/useToken";
import { iterableBuilder } from "../../../types/IterableClass";
import Iterable from "../../../types/Iterable";
import { useLoadUpdated } from "../../../hooks/useLoadUpdated";

interface CardsListProps {
  onItemSelected: any;
  theme: Iterable | null;
  forceListReload: boolean;
  onListReloaded:any;
}

const CardsList: React.FC<CardsListProps> = ({
  theme,
  onItemSelected,
  forceListReload,
  onListReloaded,
}) => {
  const [_page, setPage] = useState(0);
  const [_toReloadList, setToReloadList] = useState(false);
  const [_list, setList] = useState<any[]>([]);
  const [_hasMoreItems, setHasMoreItems] = useState(false);
  const [_isLoading, setIsLoading] = useState(false);
  const [_selectedItem, setSelectedItem] = useState<Iterable|null>(null);  
  const [_themeId, setThemeId] = useState(0);
  const [_token] = useToken();

  const fetchItemsFunction = function (pageNo: number) {
  let path = `api/cards/${_themeId}`;
  let params = {
    pageNo: pageNo,
    pageSize: 10,
    sortBy: "id",
    direction: "desc",
  };

    return axios
      .get(CONFIG.BACK_SERVER_DOMAIN + path, {
        headers: { Authorization: _token ? `${_token}` : null },
        params: params,
      })
      .then((response) => {
        let mappedContent: Iterable[] = [];
        response.data.content.forEach((e: any) => {
          mappedContent.push(iterableBuilder(e.id, e.title, e.content));
        });
        response.data.content = mappedContent;
        return response.data;
      });
  };

  useEffect(() => {
    onItemSelected(_selectedItem);
  }, [_selectedItem]);

  useEffect(() => {
    if (forceListReload) {
      setToReloadList(true);
    }
  }, [forceListReload]);

  const { items, hasMore, loading } = useLoadUpdated(
    fetchItemsFunction,
    _page,
    _toReloadList
  );

  useEffect(() => {
    setList(items);
    setHasMoreItems(hasMore);
    setIsLoading(loading);
    setToReloadList(false);
    onListReloaded();
  }, [items, hasMore, loading]);

  useEffect(() => {
    if (
      theme != null &&
      theme.getId() != _themeId 
    ) {
      setThemeId(theme.getId());
      setPage(0);
      setToReloadList(true);
    }
  }, [theme]);


  return (
    <>
      <ListInfiniteFormatableUpdated
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
        onListOrderChange={(items:Iterable)=>{
          console.log(items);
        }}
        listItemStyles={{
          height: "30px",
          width: "385px",
          fontSize: "14px",
          padding: "3px",
          paddingLeft: "7px",
          borderRadius: "2px",
          fontFamily: "Merriweather",
          border: "1px solid #D3D3D3",
        }}
        listSize={{ maxWidth: "400px", maxHeight: "210px" }}
      />
    </>
  );
};

export default CardsList;
