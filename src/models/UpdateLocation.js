// export class UpdateLocation implements IUpdateGeoLocation {
    export class UpdateLocation  {
    id;
    name;
    type;
    coordinates;
    wkt;
    userId;
    userName;
}

// export interface IUpdateGeoLocation {
//     id:number;
//     name:string;
//     type: string; //  geometry ( "Point", "LineString", "Polygon")
//     coordinates: number[]; 
//     wkt:string;
    
//   }