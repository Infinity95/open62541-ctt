/*  Test prepared by Development; compliance@opcfoundation.org
    Description: Request Value attribute with dataEncoding = �Default Binary�. */

function read581014() {
    var item = scalarItems[0].clone();
    item.DataEncoding.Name = "Default Binary";

    // we will allow this to work or fail
    var expectedResults = [ new ExpectedAndAcceptedResults( [ StatusCode.Good, StatusCode.BadDataEncodingUnsupported ] ) ];
    return( ReadHelper.Execute( { 
                NodesToRead: item, 
                TimestampsToReturn: TimestampsToReturn.Server, 
                OperationResults: expectedResults } ) );
}

Test.Execute( { Procedure: read581014 } );