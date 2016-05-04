/*  Test prepared by Anand Taparia; ataparia@kepware.com
    Description: Write to the EngineeringUnits attribute on a node where the property exists. */

function write613Err002() {
    var item = MonitoredItem.fromSetting( "/Server Test/NodeIds/Static/DA Profile/AnalogType/NodeIdWithEngineeringUnits", 0 );
    if( item == null || item == undefined ) {
        addSkipped( "EngineeringUnit" );
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
        // Initial flag (EngineeringUnits not found yet)
        var attributeEngineeringUnitsFound = false;        
        // Loop through all the references, till we find the 'EngineeringUnits' attribute
        for( var i=0; i<response.Results.length; i++ ) {
            for( var n=0; n<response.Results[i].References.length; n++ ) {
                // Check for EngineeringUnits attribute
                if( response.Results[i].References[n].BrowseName.Name == "EngineeringUnits" ) {
                    print( "Found reference 'EngineeringUnits'." );
                    // Get the corresponding monitored item for this attribute node
                    var monitoredItems = MonitoredItem.fromNodeIds ( response.Results[i].References[n].NodeId.NodeId );
                    var euAttributeMonitoredItem = monitoredItems[0];
                    // set a valid value for Engineering Units
                    var obj = new UaExtensionObject();
                    var info = new UaEUInformation();
                    info.DisplayName = new UaLocalizedText("units");
                    info.NamespaceUri = "6.1.3 Error Test 2";
                    obj.setEUInformation( info );
                    euAttributeMonitoredItem.SafelySetValueTypeKnown( obj, BuiltInType.ExtensionObject );
                    // Expected result
                    var results = [];
                    results[0] = new ExpectedAndAcceptedResults( StatusCode.Good );
                    results[0].addAcceptedResult ( [ StatusCode.BadNotSupported, StatusCode.BadUserAccessDenied, StatusCode.BadNotWritable ] );
                    if( WriteHelper.Execute( { NodesToWrite: euAttributeMonitoredItem, OperationResults: results } ) ) {
                        if( !WriteHelper.Response.Results[0].isGood() ) {
                            if( WriteHelper.Response.Results[0].StatusCode === StatusCode.BadNotSupported ) _notSupported.store( "Write EUInformation", undefined, false );
                            else _warning.store( WARNING_EUNITS_NOTWRITABLE + " Write.Response.Results[0].StatusCode: " + WriteHelper.Response.Results[0] );
                        }
                    }                    
                    // We are done here!
                    attributeEngineeringUnitsFound = true;
                    break;
                }                
            }
            // Punt if we have found the EngineeringUnits attribute already
            if ( attributeEngineeringUnitsFound ) break;
        }
        // Did not find the EngineeringUnits attribute, hence the test is incomplete
        if ( !attributeEngineeringUnitsFound ) addWarning( "EngineeringUnits attribute not found for the analog node setting '" + item.NodeSetting + "'. Unable to complete test." );
    }
    else addError( "Browse(): status ", uaStatus, uaStatus );
    return( true );
}// function write613Err002() 

Test.Execute( { Procedure: write613Err002 } );