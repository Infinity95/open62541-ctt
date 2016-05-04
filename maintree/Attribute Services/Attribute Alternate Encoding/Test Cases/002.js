/*  Test prepared by Development; compliance@opcfoundation.org
    Description: Request Value attribute with dataEncoding = �Default Xml. */

function read581015() {
    var item = scalarItems[0].clone();
    item.DataEncoding.Name = "Default XML";

    // we will allow this to work or fail
    var expectedResults = [ new ExpectedAndAcceptedResults( [ StatusCode.Good, StatusCode.BadDataEncodingUnsupported ] ) ];
    return( ReadHelper.Execute( { 
                NodesToRead: item, 
                TimestampsToReturn: TimestampsToReturn.Server, 
                OperationResults: expectedResults } ) );
}

Test.Execute( { Procedure: read581015 } );