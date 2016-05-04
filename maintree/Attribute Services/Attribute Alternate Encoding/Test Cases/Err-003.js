/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Request non-Value attribute (e.g. BrowseName) with a standard dataEncoding. */

function read581err017() {
    var item = scalarItems[0].clone();
    item.DataEncoding.Name = "Default Binary";
    item.AttributeId = Attribute.BrowseName;

    // we will allow this to work or fail
    var expectedResults = [ new ExpectedAndAcceptedResults( [ StatusCode.BadDataEncodingInvalid ] ) ];
    return( ReadHelper.Execute( { NodesToRead: item, TimestampsToReturn: TimestampsToReturn.Server, OperationResults: expectedResults } ) );
}

Test.Execute( { Procedure: read581err017 } );