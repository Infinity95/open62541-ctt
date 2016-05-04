/*  Test prepared by Anand Taparia; ataparia@kepware.com
    Description: Write to the EURange attribute. */

function write613009() {
    // Get handle to an analog node
    if( AnalogItems == null || AnalogItems.length == 0 ) {
        addSkipped( "Static Analog" );
        return( false );
    }
    
    var hasPropertyReferenceType = MonitoredItem.fromNodeIds( new UaNodeId( Identifier.HasProperty ) )[0];//fromSetting( "/Server Test/NodeIds/References/HasProperty", 1 );
    if( hasPropertyReferenceType == null ) {
        _dataTypeUnavailable.store( "HasPropertyType" );
        print( "Test cannot be completed: HasProperty types not set in settings." );
        return( false );
    }
    
    var browseRequest = GetDefaultBrowseRequest( Test.Session.Session, AnalogItems[0].NodeId );
    var browseResponse = new UaBrowseResponse();
    browseRequest.NodesToBrowse[0].ReferenceTypeId = hasPropertyReferenceType.NodeId;
    print ( "Browsing the EURange property of the anlog node '" + AnalogItems[0].NodeSetting + "'." );
    var uaStatus = Test.Session.Session.browse( browseRequest, browseResponse );
    if( uaStatus.isGood() ) {
        AssertBrowseValidParameter( browseRequest, browseResponse );
        
        var euRangeFound = false;
        var euRangeItem  = null;
        for( var i=0; i<browseResponse.Results.length; i++ ) {
            for( var r=0; r<browseResponse.Results[i].References.length; r++ ) {
                if( browseResponse.Results[i].References[r].BrowseName.Name == "EURange" ) {
                    addLog( "EURange property found." );
                    euRangeFound = true;
                    euRangeItem = MonitoredItem.fromNodeIds( [browseResponse.Results[i].References[r].NodeId.NodeId] )[0];
                    break;
                }
            }
            // Our work here is done if we have found the EURange property
            if ( euRangeFound ) break;
        }
        if( euRangeFound ) {
            // Extract the LOW and HIGH range (not really required for this test.
            // We read it so that we when we write to the EURange, we are able
            // to write a value in the vicinity of the existing EURange and not 
            // something totally off)
            var analogNodeEURange;
            if( ReadHelper.Execute( { NodesToRead: euRangeItem } ) ) {
                var extensionObject = euRangeItem.Value.Value.toExtensionObject();
                analogNodeEURange = extensionObject.toRange();
                euRangeItem.OriginalValue = { Low: analogNodeEURange.Low, High: analogNodeEURange.High };
            }
            
            // Now to write to the EURange
            var newEURangeWriteValue = new UaRange;
            newEURangeWriteValue.Low = analogNodeEURange.Low - 1;
            newEURangeWriteValue.High = analogNodeEURange.High + 1;
            var newExtensionObject = new UaExtensionObject();
            newExtensionObject.setRange ( newEURangeWriteValue );            
            euRangeItem.Value = new UaDataValue();
            euRangeItem.Value.Value.setExtensionObject ( newExtensionObject );
            
            // Expected result
            var results = [];
            results[0] = new ExpectedAndAcceptedResults( StatusCode.Good );
            results[0].addAcceptedResult( StatusCode.BadNotWritable );
            results[0].addExpectedResult( StatusCode.BadNotSupported );
            results[0].addExpectedResult( StatusCode.BadUserAccessDenied );
            if( WriteHelper.Execute( { NodesToWrite: euRangeItem, OperationResults: results } ) ) {
                // if Write didn't succeed, then don't compare
                if( !WriteHelper.Response.Results[0].isGood() ) {
                    if( WriteHelper.Response.Results[0].StatusCode === StatusCode.BadNotSupported ) _notSupported.store( "Write EURange", undefined, false );
                    else _warning.store( WARNING_EURANGE_NOTWRITABLE + " Write.Response.Results[0].StatusCode: " + WriteHelper.Response.Results[0] );
                }
                else {
                    // Read the EURange back to verify that the write was indeed successful
                    var readEURangeValueAfterWrite = GetNodeIdEURange( AnalogItems[0].NodeSetting );
                    if ( ( readEURangeValueAfterWrite.Low == newEURangeWriteValue.Low ) && ( readEURangeValueAfterWrite.High == newEURangeWriteValue.High ) ) {
                        addLog( "Verified that the EURange was successfully written to." );
                    }
                    else addError( "Write() to EURange property failed." );

                    // now to write the original EURange back to the node
                    newEURangeWriteValue.Low = euRangeItem.OriginalValue.Low;
                    newEURangeWriteValue.High = euRangeItem.OriginalValue.High;
                    newExtensionObject = new UaExtensionObject();
                    newExtensionObject.setRange ( newEURangeWriteValue );            
                    euRangeItem.Value = new UaDataValue();
                    euRangeItem.Value.Value.setExtensionObject ( newExtensionObject );
                    if( !WriteHelper.Execute( { NodesToWrite: euRangeItem, OperationResults: results } ) ) {
                        addError( "Unable to revert the EURange back to its original value." );
                    }
                }
            }
        }
        else {
            addError( "Specified node '" + AnalogItems[0].NodeSetting + "' does not have an EURange property." );
        }
    }
    else {
        addError( "Browse(): status " + uaStatus, uaStatus );
    }
    return( true );
}// function write613009()

Test.Execute( { Procedure: write613009 } );