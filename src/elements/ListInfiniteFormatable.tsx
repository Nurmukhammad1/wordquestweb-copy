import { useState, useRef, useCallback, useEffect } from "react";
import Iterable from "../types/Iterable";
import { Divider, Tag, Flex, Input, Space, Button } from "antd";
const { Search } = Input;
import { fetchWordsByLetters } from "../service/wordService";
import { LoadingOutlined } from "@ant-design/icons";
import { textBuilder } from "../types/TextType";

interface Props {
  dataFetchFunction: any;
  onSelect: any;
}

const ListInfiniteFormatable: React.FC<Props> = ({
  dataFetchFunction,
  onSelect,
}) => {
  const [pageNumber, setPageNumber] = useState(0);
  const observer = useRef<IntersectionObserver>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [items, setItems] = useState<Iterable[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Iterable[]>([]);
  const [draggedItemId, setDraggedItemId] = useState<number | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(false);
    dataFetchFunction(pageNumber)
      .then((response: any) => {
        setItems((prevList) => [...prevList, ...response.content]);
        setItems((prevList) => {
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
  }, [pageNumber]);

  const lastListElementRef = useCallback(
    (node: any) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPageNumber((prevPageNumber: number) => prevPageNumber + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  const handleDoubleClick = (item: Iterable) => {
    if (
      !selectedItems.some(
        (selectedItem) => selectedItem.getId() === item.getId()
      )
    ) {
      setSelectedItems([...selectedItems, item]);
    }
  };
  const handleClick = (item: Iterable) => {
    if (selectedItems.some((selectedItem) => selectedItem.getId() === item.getId())) {
      setSelectedItems(selectedItems.filter((selectedItem) => selectedItem.getId() !== item.getId()));
    } 
  };

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    itemId: number
  ) => {
    e.dataTransfer.setData("text/plain", itemId.toString());
    setDraggedItemId(itemId);
  };

  const handleDragEnd = () => {
    setDraggedItemId(null);
  };

  const handleDragOver = (
    e: React.DragEvent<HTMLDivElement>,
    index: number
  ) => {
    e.preventDefault();
    if (draggedItemId !== null) {
      const targetIndex = index;
      const itemsCopy = [...items];
      const draggedItemIndex = itemsCopy.findIndex(
        (item) => item.getId() === draggedItemId
      );
      const draggedItem = itemsCopy[draggedItemIndex];
      itemsCopy.splice(draggedItemIndex, 1);
      itemsCopy.splice(targetIndex, 0, draggedItem);
      setItems(itemsCopy);
    }
  };
  const [searchText, setSearchText] = useState("");
  const onSearch = (value: string) => {
    setPageNumber(0);
    setSearchText(value);
    setItems([]);
    fetchWordsByLetters(value).then((items: Iterable[]) => {
      setItems(items);
    });
  };

  const onClearButtonClick = () => {
    setSearchText("");
    setItems([]);
  };

  return (
    <>
      <Space.Compact style={{ width: "100%" }}>
        <Search
          placeholder="input search text"
          onSearch={onSearch}
          style={{ width: 235, paddingBottom: "5px" }}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <Button type="primary" onClick={onClearButtonClick}>
          Clear
        </Button>
      </Space.Compact>
      <div style={{ height: "535px", overflow: "auto", maxWidth: 300 }}>
        {items.map((item, index) => {
          const isLastItem = items.length > 0 && index === items.length - 1;
          const isSelected = selectedItems.some(
            (selectedItem) => selectedItem.getId() === item.getId()
          );

          const itemStyle = {
            cursor: "grab",
            backgroundColor: selectedItems.some((selectedItem) => selectedItem.getId() === item.getId()) ? "#FBF3C5" : "white",
            border:
              draggedItemId === item.getId() ? "1px solid #eb6734" : "none",
            margin: "5px",
            height: "50px",
            fontSize: "14px",
            padding: "3px",
            borderRadius: "5px",
            fontFamily: "Merriweather",
            boxShadow: "0 0 3px rgba(0, 0, 0, 1)",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          };

          return (
            <div
              ref={isLastItem ? lastListElementRef : undefined}
              key={item.getId()}
              onClick={() => handleClick(item)}
              onDoubleClick={()=>handleDoubleClick(item)}
              onDragStart={(e) => handleDragStart(e, item.getId())}
              onDragEnd={handleDragEnd}
              onDragOver={(e) => handleDragOver(e, index)}
              draggable
              style={
                isLastItem ? { ...itemStyle, cursor: "default" } : itemStyle
              }
            >
              <p>{item.getTheme()}:</p>
              {item.getContent()}
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
export default ListInfiniteFormatable;