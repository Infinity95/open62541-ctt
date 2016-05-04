/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Read a single attribute from a valid node, looping through the following attributes:
        AccessLevel, BrowseName, DataType, DisplayName, Historizing, NodeClass, NodeId, UserAccessLevel, ValueRank
        NOTE: Each read is to be conducted individually. */

function read581019() {
    // here are the Node attributes we will read INDIVIDUALLY!
    var items = [];
    for( var i=0; i<originalScalarItems.length; i++ ) items.push( originalScalarItems[i].clone() );

    var attributesToTest = [ Attribute.AccessLevel, Attribute.BrowseName, Attribute.DataType, Attribute.DisplayName, Attribute.Historizing, Attribute.NodeClass,
                             Attribute.NodeId, Attribute.UserAccessLevel, Attribute.ValueRank ];
    // go into a loop so we can do one read per attribute
    for( var i=0; i<attributesToTest.length; i++ ) {
        items[0].AttributeId = attributesToTest[i];
        ReadHelper.Execute( { NodesToRead: items[0], TimestampsToReturn: TimestampsToReturn.Source } );
        Assert.IsNull( ReadHelper.Response.Results[0].Value.SourceTimestamp, "Source timestamp expected to be empty/null since we are reading non-Value attributes!" );
    }// for i...
    return( true );
}

Test.Execute( { Procedure: read581019 } );