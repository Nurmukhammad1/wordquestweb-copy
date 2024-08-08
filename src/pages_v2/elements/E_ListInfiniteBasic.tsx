import { useState, useRef, useCallback, useEffect } from "react";
import Iterable from "../types/Iterable";
import { LoadingOutlined } from "@ant-design/icons";

interface Props {
  items: Iterable[];
  loading: boolean;
  hasMore: boolean;
  page: number;
  onItemSelect: any;
  onPageChange: any;
  listItemStyles:any|null;
  listSize:{maxWidth: string, maxHeight:string};
}

const E_ListInfiniteBasic: React.FC<Props> = ({
  items,
  loading,
  hasMore,
  page,
  onItemSelect,
  onPageChange,
  listItemStyles,
  listSize,
}) => {
  const observer = useRef<IntersectionObserver>();
  const [error, setError] = useState(false);
  const[list, setList] = useState<Iterable[]>([]);
  const [selectedItem, setSelectedItem] = useState<Iterable>();


  useEffect(()=>{
    setList(items);
  },[items])

  const lastListElementRef = useCallback(
    (node: any) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          onPageChange(page + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  const handleDoubleClick = (item: Iterable) => {
    console.log();
  };

  useEffect(() => {
    onItemSelect(selectedItem);
  }, [selectedItem]);


  const handleClick = (item: Iterable) => {
    setSelectedItem(item);
    // onItemSelect(item);
  };


  return (
    <>
        <div style={{ overflow: "auto", ...listSize }}>
          {list.map((item, index) => {
            const isLastItem = list.length > 0 && index === list.length - 1;
            const isSelected = selectedItem?.getId() === item.getId();

            const itemDefaultStyle = {
              cursor: "grab",
              backgroundColor: isSelected ? "#FBF3C5" : "white",
              border:"1px solid #000001",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            };

            return (
              <div
                ref={isLastItem ? lastListElementRef : undefined}
                key={item.getId()}
                onClick={() => handleClick(item)}
                onDoubleClick={() => handleDoubleClick(item)}
                style={
                  isLastItem ? { ...itemDefaultStyle, ...listItemStyles, cursor: "default" } 
                  : {...itemDefaultStyle, ...listItemStyles}
                }
              >
                {item.getTitle()}
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
export default E_ListInfiniteBasic;
