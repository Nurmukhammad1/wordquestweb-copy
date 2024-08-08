import React, { useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import E_ListInfiniteBasic from "../pages/setSteps/elements/lowlevel/E_ListInfiniteBasic";
import E_ListSimple from "../pages/setSteps/elements/E_ListSimple";
import { useUser } from "../hooks/useUser";
import Iterable from "../types/Iterable";
import { Button } from "antd";
import GoalsList from "./GoalsList";

export default function SiderContent() {
  const _user = useUser();

  const _params = (pageNo: number) => {
    return {
      pageNo: pageNo,
      pageSize: 10,
      sortBy: "id",
      direction: "desc",
    };
  };

  return (
    <div>
      <GoalsList/>
    </div>
  );
}

const styles = {
    button:{
        width:'100%',
        textAline:'left',
        marginLeft:'5px',
        marginRight:'5px',
    }
}
