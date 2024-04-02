import Iterable from "./Iterable";
import WordType, { wordBuilder } from "./WordType";
interface CardType  extends Iterable{
    id:number;
    contextTitle:string;
    text:string;
    helpText:string;
    isArchived:boolean;
    textId:number;
    version:number;
    userId: number,
    word:any,
  }

  class CardTypeClass implements CardType {
    constructor( public id:number,
        public contextTitle:string,
        public text:string,
        public helpText:string,
        public isArchived:boolean,
        public textId:number,
        public version:number,
        public userId: number,
        public word:any,
        ) {}
        
        getContent(): string {
          return this.text;
        }
      
        getId(): number {
          return this.id;
        }
    
        setContent(content:string){
          this.text = content;8
        }

        getTheme(): string {
          return this.word !== null? this.word.word:"";
        }
    
  }

  export const cardBuilder = (
    id:number,
    contextTitle:string,
    text:string,
    helpText:string,
    isArchived:boolean,
    textId:number,
    version:number,
    userId: number,
    word:any,
    ) => {

    return new CardTypeClass(
        id,
        contextTitle,
        text,
        helpText,
        isArchived,
        textId,
        version,
        userId,
        word,
        );
  }

  export default CardType;