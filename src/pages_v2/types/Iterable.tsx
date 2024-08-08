interface Iterable {
    getId:() => number;
    setId:(id:number) => void;
    getTitle: () => string;
    setTitle: (content:string) => void;
    getContent: () => string;
    setContent: (content:string) => void;
    getDetails: () => any;
    setDetails: (details:any) => void;
  }

export default Iterable;  