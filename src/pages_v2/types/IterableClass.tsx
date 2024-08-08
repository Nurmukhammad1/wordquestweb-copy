import Iterable from "./Iterable";
export default class IterableClass implements Iterable {
    constructor(
        public id: number,
        public title: string,
        public content: string,
        public details:any
      ) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.details = details;
      }
      getDetails() : any{
        return this.details;
      }


      getTitle(): string {
        return this.title;
      }
    
      getContent(): string {
        return this.content;
      }
    
      getId(): number {
        return this.id;
      }

      setId(id: number): void {
        this.id = id;
      }
     
      setTitle(title: string): void {
        this.title = title;
      }
    
      setContent(content: string): void {
        this.content = content;
      }

      setDetails(details: any): void{
        this.details = details;
      }
    
  }

  export const iterableBuilder = (id: number, title: string, content:string, details:any) => {
    return new IterableClass(id, title, content, details);
  };

  export const Empty_Iterable = iterableBuilder(0, "", "", null);
