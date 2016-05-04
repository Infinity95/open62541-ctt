/*  Test prepared by Nathan Pocock nathan.pocock@opcfoundation.org
    Description: Reads the BROWSENAME attribute of a valid node. */

function read581010() {
    var item = originalScalarItems[0].clone();
    item.AttributeId = Attribute.BrowseName;
    ReadHelper.Execute( { NodesToRead: item } );
    return( true );
}

Test.Execute( { Procedure: read581010 } );