/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Write a ByteString value to a node of type Byte[]. */

function write582022() {
    var item = MonitoredItem.fromSetting( "/Server Test/NodeIds/Static/All Profiles/Arrays/Byte" );
    if( !isDefined( item ) ) {
        addSkipped( "Byte[] node type not configured within the setting: /Server Test/NodeIds/Static/All Profiles/Arrays/Byte." );
        return( false );
    }

    // read the item first, to see how long the array is.
    if( ReadHelper.Execute( { NodesToRead: item } ) ) {
        var valueLen;
        if( item.Value.Value.DataType === BuiltInType.ByteString ) valueLen = item.Value.Value.toByteString().length;
        else if( item.Value.Value.DataType === BuiltInType.Byte && item.Value.Value.ArrayType !== 0 ) valueLen = item.Value.Value.getArraySize();

        // we can't be sure that a zero-length array can be changed, so make sure the array is populated
        if( Assert.GreaterThan( 0, valueLen, "The array is currently empty. Please reconfigure the array with a value and test again." ) ) {
            // generate a new BYTESTRING value, with a length matching the value just read 
            var newString = WriteService.GenerateString( valueLen );
            item.Value.Value.setByteString( UaByteString.fromStringData( newString ) );

            // write the value; we expect it to succeed
            if( !WriteHelper.Execute( { NodesToWrite: item } ) ) addError( "Server must accept and convert a value of type Byte[] when writing to a node of type ByteString." );
        }
    }
    else return( false );
    return( true );
}

Test.Execute( { Procedure: write582022 } );