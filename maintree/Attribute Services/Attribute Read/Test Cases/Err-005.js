/*  Test prepared by Development; compliance@opcfoundation.org
    Description: Read a valid attribute from a node id with invalid syntax: 1.	String Id: Empty/null
*/

function read581Err005() {
    var item = MonitoredItem.fromNodeIds( new UaNodeId( "", 0 ) )[0];
    item.AttributeId = Attribute.BrowseName;
    return( ReadHelper.Execute( { NodesToRead: item, OperationResults: [ new ExpectedAndAcceptedResults( [ StatusCode.BadNodeIdInvalid, StatusCode.BadNodeIdUnknown ] ) ] } ) );
}//function read581Err005() 

Test.Execute( { Procedure: read581Err005 } );