/*  Test prepared by Anand Taparia; ataparia@kepware.com
    Description: Write the current system time to a DataItem node (of type 'DateTime') that supports the ValuePrecision variable. */

function write614012 ()
{
    // Get handle to dataitem node
    var monitoredItems = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.DAProfile.DataItem.Settings, 1 );
    if ( monitoredItems.length == 0 )
    {
        addSkipped( "Static DataItem" );
        return( false );
    }

    // Only DateTime datatype for this test
    var dataTypesToTest = [ BuiltInType.DateTime ];

    // Initial flag (no datatime node found yet)
    var dateTimeNodePresent = false;
    // Loop through the items and test the datatypes of interest
    for ( var i=0; i<monitoredItems.length; i++ )
    {
        // Continue only if datatype of interest
        var currentNodeDataType = UaNodeId.GuessType( monitoredItems[i].NodeSetting );
        var dataTypesToTestIndex = 0;
        for ( dataTypesToTestIndex=0; dataTypesToTestIndex<dataTypesToTest.length; dataTypesToTestIndex++ )
        {
            if ( dataTypesToTest[ dataTypesToTestIndex ] == currentNodeDataType ) break;
        }
        // If not the correct type, move to the next item
        if ( dataTypesToTestIndex >= dataTypesToTest.length) continue;
        dateTimeNodePresent = true;

        var hasPropertyReferenceType = MonitoredItem.fromNodeIds( new UaNodeId( Identifier.HasProperty ) )[0];//fromSetting( "/Server Test/NodeIds/References/HasProperty", 1 );
        if ( hasPropertyReferenceType == null )
        {
            print ( "Test cannot be completed: HasProperty types not set in settings." );
            return( false );
        }

        var browseRequest = GetDefaultBrowseRequest( Test.Session.Session, monitoredItems[0].NodeId );
        var browseResponse = new UaBrowseResponse();
        browseRequest.NodesToBrowse[0].ReferenceTypeId = hasPropertyReferenceType.NodeId;
        print ( "Browsing the ValuePrecision property of the dataitem node '" + monitoredItems[0].NodeSetting + "'." );
        var uaStatus = Test.Session.Session.browse( browseRequest, browseResponse );
        if ( uaStatus.isGood() )
        {
            AssertBrowseValidParameter( browseRequest, browseResponse );
            
            var valuePrecisionFound = false;
            var valuePrecisionItem = null;
            for ( var n=0; n<browseResponse.Results.length; n++ )
            {
                for ( var r=0; r<browseResponse.Results[n].References.length; r++ )
                {
                    if ( browseResponse.Results[n].References[r].BrowseName.Name == "ValuePrecision" )
                    {
                        valuePrecisionFound = true;
                        valuePrecisionItem = MonitoredItem.fromNodeIds( [browseResponse.Results[n].References[r].NodeId.NodeId] )[0];
                        break;
                    }
                }
                // Our work here is done if we have found the ValuePrecision property
                if ( valuePrecisionFound ) break;
            }
            
            // If ValuePrecision found
            if ( valuePrecisionFound )
            {
                addSkipped ( "'ValuePrecision' property found in node '" + monitoredItems[i].NodeSetting + "'. Next writing to this node." );
                
                // First read the value precision property
                var precisionValue = 0.0;
                if( ReadHelper.Execute( { NodesToRead: valuePrecisionItem } ) == false )
                {
                    addSkipped ( "Unable to read the 'ValuePrecision' property of the node '" + monitoredItems[i].NodeSetting + "'." );
                    continue;
                }
                else
                {
                    // Get the value here
                    precisionValue = valuePrecisionItem.Value.Value.toDouble ();
                }

                // Now do a write to this node
                monitoredItems[i].Value.Value = new UaVariant ();
                monitoredItems[i].Value.Value.setDateTime ( UaDateTime.utcNow() );    
                // Write the value
                if ( !WriteHelper.Execute( { NodesToWrite: monitoredItems[i] } ) )
                {                
                    addError( "Write() failed for node: '" + monitoredItems[i].NodeSetting + "'." );
                    continue;
                }
                
                // Read (to verify written value)
                print ( "Reading node '" + monitoredItems[i].NodeSetting + "' after the write to check the written value." );
                var readMonitoredItem = MonitoredItem.fromSetting( monitoredItems[i].NodeSetting, 1 );            
                if ( ReadHelper.Execute( { NodesToRead: readMonitoredItem } ) )
                {
                    // Check: Value
                    print( "Checking the value..." );
                    var writeValue = UaVariantToSimpleType ( monitoredItems[i].Value.Value  );
                    var readValue  = UaVariantToSimpleType ( readMonitoredItem.Value.Value );
                    var match = true;
                    if( writeValue !== readValue && writeValue !== readValue )
                    {
                        if( writeValue === null ){ writeValue = ""; }
                        if( readValue  === null ){ readValue = ""; }
                        if( writeValue.toString() !== readValue.toString() )
                        { 
                            match = false;
                        }
                    }
                    if (match)
                    {
                        addLog ( "The expected and received value for the node '" + readMonitoredItem.NodeSetting + "' are the same (value = " + readValue + ")." );
                    }
                    else
                    {
                        AssertValueWithinPrecision( readValue, writeValue, precisionValue );
                    }
                }
                else
                {
                    addError( "Read() failed for node '" + readMonitoredItem.NodeSetting + "' with status '" + uaStatus + "' (while verifying the write)." );
                }
            }
            else
            {
                addSkipped ( "Node '" + monitoredItems[0].NodeSetting + "' does not have the optional 'ValuePrecision' property." );
            }
        }
        else
        {
            addError ( "Test aborted. Browse() failed: " + uaStatus, uaStatus );
        }
    }
    
    // If we didn't even come across a datetime type node, this test is incomplete
    if ( dateTimeNodePresent == false )
    {
        addSkipped( "No 'DateTime' type DataItem available for testing. Test aborted." );        
    }
    return( true );
}

Test.Execute( { Procedure: write614012 } );