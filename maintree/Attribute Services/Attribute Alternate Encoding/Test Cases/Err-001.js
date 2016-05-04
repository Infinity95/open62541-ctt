/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Request Value attribute with dataEncoding that is not standard; on a complex type. */

function read581err016() {
    var item = scalarItems[0].clone();
    Item.DataEncoding.Name = "EncodingDoesNotExist";

    return( ReadHelper.Execute( { NodesToRead: monitoredItems[0], TimestampsToReturn: TimestampsToReturn.Server, OperationResults: [ new ExpectedAndAcceptedResults( [ StatusCode.BadDataEncodingInvalid ] ) ] } ) );
}// function read581err016()

addSkipped( "Needs a complex type" ); //safelyInvoke( read581err016 );