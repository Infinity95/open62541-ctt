/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description:  Write a valid value to each attribute that can be written to as determined by the value of the WriteMask and/or UserWriteMask attributes.  */

function maskTest( mask ) {
    // prepare our items to read, which will include WriteMask and UserWriteMask attributes
    var expectedResults = [];
    var item = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.NumericSettings )[0];
    item.AttributeId = Attribute.WriteMask;
    expectedResults.push( new ExpectedAndAcceptedResults( [ StatusCode.Good, StatusCode.BadNotSupported ] ) );
    if( ReadHelper.Execute( { NodesToRead: item, OperationResults: expectedResults } ) ) {
        // analyze the attributes that can be written to, and then try writing to them...
        var items = UaWriteMask.ToItems( { Value: item.Value.Value.toUInt32(), NodeId: item.NodeId } );
        if( items.length === 0 ) addWarning( "Item '" + item.UserReadableName + "'." + Attribute.toString( mask ) + " indicates that no/zero Attributes are writable.\nSince this is a Variable node it is assumed that the 'Value' attribute is writable.\nAborting test." );
        else {
            // let's write a value to all attributes; but first, read their initial values 
            if( !ReadHelper.Execute ( { NodesToRead:  items } ) ) return( false );
            if( !WriteHelper.Execute( { NodesToWrite: items } ) ) return( false );
        }
    }
    else return( false );
    return( true );
}

function test() {
    if( !maskTest( Attribute.WriteMask ) ) return( false );
    if( !maskTest( Attribute.UserWriteMask ) ) return( false );
    return( true );
}//function write582Err005()

Test.Execute( { Procedure: test } );