export function jsonMessage(code:string,message:string,data?:any){
    return {
        code : code,
        message : message,
        data : data ? data : {}
    }
}