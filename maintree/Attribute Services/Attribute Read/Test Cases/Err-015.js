/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Read a single node specifying an IndexRange for attributes that can't be used with IndexRange, as in:
         AccessLevel, BrowseName, DataType, DisplayName, Historizing, NodeClass, NodeId, UserAccessLevel, ValueRank
        Expect Bad_IndexRangeNoData */

function read581Err015() {
    var attributeToRead = [ Attribute.AccessLevel, Attribute.BrowseName, Attribute.DataType, Attribute.DisplayName, Attribute.Historizing, Attribute.NodeClass, Attribute.UserAccessLevel, Attribute.ValueRank ];
    var itemsToRead = [];
    var expectedResults = [];

    for( var i=0; i<attributeToRead.length; i++ ) {
        var item = MonitoredItem.Clone( originalScalarItems[0] );
        item.AttributeId = attributeToRead[i];
        item.IndexRange = "1:2";
        itemsToRead.push( item );
        expectedResults.push( new ExpectedAndAcceptedResults( StatusCode.BadIndexRangeNoData ) );
    }// for i

    return( ReadHelper.Execute( { NodesToRead: itemsToRead, TimestampsToReturn: TimestampsToReturn.Both, MaxAge: 100, OperationResults: expectedResults } ) );
}// function read581Err015()

Test.Execute( { Procedure: read581Err015 } );