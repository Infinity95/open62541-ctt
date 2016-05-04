/*  Test prepared by Nathan Pocock: nathan.pocock@opcfoundation.org
    Description: Read a node of each supported Data Type: Bool, Byte, SByte, ByteString, DateTime, Double, Float, Guid, Int16, UInt16
            Int32, UInt32, Int64, UInt64, String, XmlElement. */

function read581016() {
    if( ReadHelper.Execute( { NodesToRead: originalScalarItems } ) ) {
        addLog( "Checking the results[*] data types match what was expected..." );
        for( var i=0; i<ReadHelper.Response.Results.length; i++ ) {
            if( ReadHelper.Response.Results[i].Value.isEmpty() ) {
                addLog( "NodeId: " + ReadHelper.Response.NodesToRead[i].NodeId
                    + "; Type expected: " + BuiltInType.toString( originalScalarItems.DataType )
                    + "; Type actual: UNKNOWN BECAUSE THE VALUE IS NULL." );
            }
            else {
                addLog( "NodeId: " + ReadHelper.Request.NodesToRead[i].NodeId + " (setting: " + originalScalarItems[i].NodeIdSetting + "') "
                    + "; Type expected: " + BuiltInType.toString( originalScalarItems[i].DataType )
                    + "; Type actual: " + BuiltInType.toString( ReadHelper.Response.Results[i].Value.DataType )
                    + "; Value: " + ReadHelper.Response.Results[i].Value.toString() );
                if( ! Assert.Equal( BuiltInType.toString( originalScalarItems[i].DataType ), BuiltInType.toString( ReadHelper.Response.Results[i].Value.DataType ) ) ) {
                    addLog( "*" + i + ") " + originalScalarItems[i].NodeIdSetting + "; Node '" + ReadHelper.Response.NodesToRead[i].NodeId + "' expected to be of type: " + BuiltInType.toString( originalScalarItems[i].DataType ) +", but was actually: " + BuiltInType.toString( ReadHelper.Response.Results[i].Value.DataType ) + ". Value=" + ReadHelper.Response.Results[i].Value.toString() );
                }
            }
        }
    }
    return( true );
}

Test.Execute( { Procedure: read581016 } );