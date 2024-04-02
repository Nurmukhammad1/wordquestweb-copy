import Word from "../types/WordType";
import { wordBuilder } from "../types/WordType";
import { abstractGetWithRequestParams, abstractPost } from "./abstractService";
import Iterable from "../types/Iterable";


export const fetchWordsByLangLevel = (
  pageNo: number,
  pageSize: number,
  sortBy: string,
  direction: string,
  langLevel:string,
): any => {
  return fetchWordsWithParams("/api/words/searchBy", pageNo,pageSize,sortBy,direction,undefined,langLevel, undefined);
};

export const fetchWordsByLetters = (
  wordLetters:string,
): any => {
  return fetchAndMapSecond("/api/words/find", {params:{wordLetters}});
};

export const fetchWordsByUserId = (
  userId: number,
  pageNo: number,
  pageSize: number
): any => {
  let path = "/api/words/searchBy";
  return fetchWordsWithParams(path,pageNo,pageSize,'word','asc',"","",userId);
};


export const fetchWordsWithParams = (
  path:string,
  pageNo: number,
  pageSize: number,
  sortBy: string,
  direction: string,
  status:string|undefined,
  langLevel:string|undefined,
  userId:number|undefined,
): any => {
  return fetchAndMap(
    path,{params:{pageNo, pageSize, sortBy,direction, status, langLevel, userId}}
  );
};

export const fetchAndMap = async (path: string, params:any): Promise<any> => {
  const response = await abstractGetWithRequestParams(path,params);
  let mappedContent: Word[] = [];
  response.data.content.forEach((e: Word) => {
    mappedContent.push(wordBuilder(e.id, e.word)); //TODO use builder
  });
  response.data.content = mappedContent;
  return response.data;
};

export const fetchAndMapSecond = async (path: string, params:any): Promise<any> => {
  const response = await abstractGetWithRequestParams(path,params);
  let mappedContent: Word[] = [];
  response.data.forEach((e: Word) => {
    mappedContent.push(wordBuilder(e.id, e.word)); //TODO use builder
  });
  response.data = mappedContent;
  return response.data;
};

export const saveWords = (userId:number, selectedItems:Iterable[]) => {
    abstractPost(`/api/words?userId=${userId}`,selectedItems);
}