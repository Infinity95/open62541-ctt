/*  Test prepared by Anand Taparia; ataparia@kepware.com
    Description: Write to the InstrumentRange attribute on a node where the property exists. */

function write613Err003() {
    // Get access to the analog node
    var item = MonitoredItem.fromSetting( "/Server Test/NodeIds/Static/DA Profile/AnalogType/NodeIdWithInstrumentRange", 0 );
    if( item == null || item == undefined ) {
        addSkipped( "InstrumentRange not configured, please check settings." );
        return( false );
    }    
    // Prepare to browse 
    var request = GetTest1BrowseRequest( Test.Session.Session, item.NodeId );
    var response = new UaBrowseResponse();    
    request.RequestHeader.ReturnDiagnostics = 0;
    request.NodesToBrowse[0].NodeId = item.NodeId;
    request.NodesToBrowse[0].BrowseDirection = BrowseDirection.Both;
    print ( "Browsing the references of the analog node '" + item.NodeSetting + "'." );
    var uaStatus = Test.Session.Session.browse( request, response );
    // Check result
    if( uaStatus.isGood() ) {
        AssertBrowseValidParameter( request, response );
        // Initial flag (InstrumentRange not found yet)
        var attributeInstrumentRangeFound = false;        
        // Loop through all the references, till we find the 'InstrumentRange' attribute
        for ( var i=0; i<response.Results.length; i++) {
            for ( var n=0; n<response.Results[i].References.length; n++ ) {
                // Check for InstrumentRange attribute
                if (response.Results[i].References[n].BrowseName.Name == "InstrumentRange") {
                    addLog( "Found reference 'InstrumentRange'." );
                    // Start write
                    print( "Setting 'Range' of the InstrumentRange attribute of the analog node '" + item.NodeSetting + "'." );
                    // Get the corresponding monitored item for this attribute node
                    var monitoredItems = MonitoredItem.fromNodeIds ( response.Results[i].References[n].NodeId.NodeId );
                    var instrumentRangeAttributeMonitoredItem = monitoredItems[0];
                    // read the eurange and store a copy so that we can revert later
                    if( !ReadHelper.Execute( { NodesToRead: monitoredItems } ) ) {
                        addError( "Unable to read the InstrumentRange property. Aborting test." );
                        return( false );
                    }
                     // set a valid value for Range
                    var obj = new UaExtensionObject();
                    var range = new UaRange();
                    range.High = 120;
                    range.Low = 0;
                    obj.setRange( range );
                    instrumentRangeAttributeMonitoredItem.SafelySetValueTypeKnown( obj, BuiltInType.ExtensionObject );
                    // Expected result
                    var results = [];
                    results[0] = new ExpectedAndAcceptedResults( StatusCode.Good );
                    results[0].addAcceptedResult( [ StatusCode.BadNotSupported, StatusCode.BadUserAccessDenied, StatusCode.BadNotWritable ] );
                    if( WriteHelper.Execute( { NodesToWrite: instrumentRangeAttributeMonitoredItem, OperationResults: results } ) ) {
                        if( !WriteHelper.Response.Results[0].isGood() ) {
                            if( WriteHelper.Response.Results[0].StatusCode === StatusCode.BadNotSupported ) {
                                _notSupported.store( "Write InstrumentRange", undefined, false );
                            }
                            else _warning.store( WARNING_INSTRANGE_NOTWRITABLE + " Write.Response.Results[0].StatusCode: " + WriteHelper.Response.Results[0] );
                        }
                    }
                    // We are done here!
                    attributeInstrumentRangeFound = true;
                    break;
                }                
            }
            // Punt if we have found the InstrumentRange attribute already
            if ( attributeInstrumentRangeFound ) break;
        }
        // Did not find the InstrumentRange attribute, hence the test is incomplete
        if ( !attributeInstrumentRangeFound ) addSkipped( "InstrumentRange attribute not found for the analog node '" + item.NodeSetting + "'. Unable to complete test." );
    }
    else addError( "Browse(): status ", uaStatus, uaStatus );
    return( true );
}// function write613Err003() 

Test.Execute( { Procedure: write613Err003 } );