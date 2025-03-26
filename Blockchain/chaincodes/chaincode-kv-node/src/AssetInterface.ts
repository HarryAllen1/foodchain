export interface Shipment{
    // shipmentID is uniqueID {Product} + packageID {Specific package}
    uniqueID: string;
    packageID: string;

    //Asset details
    owner: string; //Certificate of the current owner
    history: string[];//Certificates of the previous owners in order
}