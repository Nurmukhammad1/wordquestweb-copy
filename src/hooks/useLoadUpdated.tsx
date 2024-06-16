import { useEffect, useState } from "react";

export const useLoadUpdated = ( dataFetchFunction: (pageNumber: number) => Promise<any>, pageNo:number, reload:boolean) => {
  const [_loading, setLoading] = useState(false);
  const [_error, setError] = useState(false);
  const [_hasMore, setHasMore] = useState(false);
  const [_items, setItems] = useState<any[]>([])
  const [_toReload, setToReload] = useState(false);

  const loadData = () => {
    setLoading(true);
    setError(false);
    dataFetchFunction(pageNo)
      .then((response: any) => {
        setItems((prevList: any[]) => [...prevList, ...response.content]);
        setItems((prevList: any[]) => {
          const uniqueItems = prevList.filter(
            (obj, index, self) =>
              index === self.findIndex((t) => t.getId() === obj.getId()) &&
              obj.getId() !== 0
          );
          return uniqueItems;
        });
        setHasMore(!response.last);
      })
      .catch((error: any) => {
        setError(true);
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    if(reload){
      setToReload(true);
    }
   }, [reload]);

  useEffect(() => {
    if(!_toReload) return;
    setItems([]);
    loadData();
    setToReload(false);  
  }, [_toReload]);

  useEffect(() => {
    if(pageNo == 0){
      setItems([]);
    }
    loadData(); 
  }, [pageNo]);

  return {"items":_items, "hasMore":_hasMore, "loading":_loading};
};
