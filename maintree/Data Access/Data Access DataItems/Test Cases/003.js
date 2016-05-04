/*  Test prepared by Anand Taparia; ataparia@kepware.com
    Description: Read value attribute of data item nodes of each of the following data types: 
        Byte, Double, Float, GUID, Int16, UInt16, Int32, UInt32, Int64, UInt64, SByte, String */

function read614003()
{
    // Get handle to dataitem nodes
    var items = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.DAProfile.DataItem.Settings, 1 );
    if ( items.length == 0 )
    {
        addSkipped( "Static DataItem" );
        return( false );
    }

    ReadHelper.Execute( { NodesToRead: items } );

    // Test each of the data item one by one
    for ( var i=0; i<items.length; i++ )
    {
        // Get the datatype of the current node we are processing
        currentNodeDataType = UaNodeId.GuessType( items[i].NodeSetting ) ;

        // Read of the data item node successful, now verify the value/datatype
        Assert.Equal( currentNodeDataType, items[i].Value.Value.DataType, "Read().Response.Results[" + i + "].Value.DataType is different." );
    }
    return( true );
}

Test.Execute( { Procedure: read614003 } );