/*  Test prepared by Anand Taparia; ataparia@kepware.com
    Description: Browse the available forward-references of an Analog node. */

function browse613015() {
    // Get access to an analog node
    var analogNode = UaNodeId.FromSettings( Settings.ServerTest.NodeIds.Static.DAProfile.AnalogType.Settings[0] );
    if( analogNode.length == 0 ) {
        addSkipped( "Static Analog" );
        return( true );
    }
    // We are interested in a single analog node for this test
    var nodeToBrowse = UaNodeId.fromString( analogNode.toString() );
    if( nodeToBrowse === undefined || nodeToBrowse === null ) {
        addError( "Unable to genereate the NodeId for the Node to browse. Please debug this script." );
        return( true );
    }
    // Prepare to browse 
    var request = GetTest1BrowseRequest( Test.Session.Session, nodeToBrowse );
    var response = new UaBrowseResponse();    
    request.RequestHeader.ReturnDiagnostics = 0;
    request.NodesToBrowse[0].BrowseDirection = BrowseDirection.Forward;
    print( "Browsing the forward references of the analog node '" + analogNode + "'." );
    var uaStatus = Test.Session.Session.browse( request, response );
    // Check result
    if( uaStatus.isGood() ) {
        if( !AssertBrowseValidParameter( request, response ) ) return( true );
        // Initial flag (mandatory EURange not found yet)
        var mandatoryEURangeFound = false;        
        for( var i=0; i<response.Results.length; i++ ) {
            for( var n=0; n<response.Results[i].References.length; n++ ) {
                // Check for EURange (required)
                if( response.Results[i].References[n].BrowseName.Name == "EURange" ) {
                    mandatoryEURangeFound = true;
                    addLog ( "Found forward reference 'EURange'." );
                    var euRangeItem = MonitoredItem.fromNodeIds( [response.Results[i].References[n].NodeId.NodeId] )[0];
                    if( ReadHelper.Execute( { NodesToRead: euRangeItem } ) ) {
                        if ( BuiltInType.ExtensionObject == euRangeItem.DataType ) {
                            var euObject = euRangeItem.Value.Value.toExtensionObject().toRange();
                            if ( Assert.StringNotNullOrEmpty( euObject, "EURange is not of the type 'Range'" ) == true ) {
                                addLog ( "Received the expected datatype 'Range' for EURange." );
                            }
                            Assert.StringNotNullOrEmpty( euObject.Low, "Low, does not exist." );
                            Assert.StringNotNullOrEmpty( euObject.High, "High, does not exist." );                            
                        }
                        else addError( "Did not receive the expected datatype for EURange. \n\tExpected datatype: Range\n\tReceived datatype: " + BuiltInType.toString ( euRangeItem.DataType ) );
                    }
                }
                // Check for InstrumentRange (optional)
                else if( response.Results[i].References[n].BrowseName.Name == "InstrumentRange" ) {
                    addLog( "Found forward reference 'InstrumentRange'." );
                    var optionalInstrumentRangeItem = MonitoredItem.fromNodeIds( [response.Results[i].References[n].NodeId.NodeId] )[0];
                    if( ReadHelper.Execute( { NodesToRead: optionalInstrumentRangeItem } ) ) {
                        if ( BuiltInType.ExtensionObject == optionalInstrumentRangeItem.DataType ) {
                            var instrObject = optionalInstrumentRangeItem.Value.Value.toExtensionObject().toRange();
                            if ( Assert.StringNotNullOrEmpty( instrObject, "InstrumentRange is not of the type 'Range'" ) == true ) {
                                addLog( "Received the expected datatype 'Range' for InstrumentRange." );
                            }
                            Assert.StringNotNullOrEmpty( instrObject.Low, "Low, does not exist." );
                            Assert.StringNotNullOrEmpty( instrObject.High, "High, does not exist." );                            
                        }
                        else addError( "Did not receive the expected datatype for InstrumentRange. \n\tExpected datatype: Range\n\tReceived datatype: " + BuiltInType.toString ( optionalInstrumentRangeItem.DataType ) );
                    }
                }
                // Check for EngineeringUnits (optional)
                else if( response.Results[i].References[n].BrowseName.Name == "EngineeringUnits" ) {
                    addLog( "Found forward reference 'EngineeringUnits'." );
                    var optionalEngineeringUnitsItem = MonitoredItem.fromNodeIds( [response.Results[i].References[n].NodeId.NodeId] )[0];
                    if( ReadHelper.Execute( { NodesToRead: optionalEngineeringUnitsItem } ) ) {
                        if( BuiltInType.ExtensionObject == optionalEngineeringUnitsItem.DataType ) {
                            var euObject = optionalEngineeringUnitsItem.Value.Value.toExtensionObject().toEUInformation();
                            if( Assert.StringNotNullOrEmpty( euObject, "EngineeringUnits is not of the type 'EUInformation'" )== true ) {
                                addLog( "Received the expected datatype 'EUInformation' for EngineeringUnits." );
                            }
                        }
                        else addError( "Did not receive the expected datatype for EngineeringUnits. \n\tExpected datatype: EUInformation\n\tReceived datatype: " + BuiltInType.toString ( optionalEngineeringUnitsItem.DataType ) );
                    }
                }
                // Check for Definition (optional)
                else if( response.Results[i].References[n].BrowseName.Name == "Definition" ) {
                    addLog( "Found forward reference 'Definition'." );
                    var optionalDefinitionItem = MonitoredItem.fromNodeIds( [response.Results[i].References[n].NodeId.NodeId] )[0];
                    if( ReadHelper.Execute( { NodesToRead: optionalDefinitionItem } ) ) {
                        if( BuiltInType.String == optionalDefinitionItem.DataType ) {
                            addLog( "Received the expected datatype 'String' for Definition." );
                        }
                        else addError( "Did not receive the expected datatype for Definition. \n\tExpected datatype: String\n\tReceived datatype: " + BuiltInType.toString (optionalInstrumentRangeItem.DataType) );
                    }
                }
                // Check for ValuePrecision (optional)
                else if( response.Results[i].References[n].BrowseName.Name == "ValuePrecision" ) {
                    addLog( "Found forward reference 'ValuePrecision'." );
                    var optionalValuePrecisionItem = MonitoredItem.fromNodeIds( [response.Results[i].References[n].NodeId.NodeId] )[0];
                    if( ReadHelper.Execute( { NodesToRead: optionalValuePrecisionItem } ) ) {
                        if ( BuiltInType.Double == optionalValuePrecisionItem.DataType ) {
                            addLog( "Received the expected datatype 'Double' for ValuePrecision." );
                        }
                        else addError( "Did not received the expected datatype for ValuePrecision. \n\tExpected datatype: Double\n\tReceived datatype: " + BuiltInType.toString (optionalValuePrecisionItem.DataType) );
                    }
                }
                // Check for HasTypeDefinition reference (required)
                else if( response.Results[i].References[n].ReferenceTypeId.getIdentifierNumeric() == Identifier.HasTypeDefinition ) {
                    addLog( "Found reference 'HasTypeDefinition'." );
                    if( response.Results[i].References[n].BrowseName.Name == "AnalogItemType" ) {
                        addLog( "HasTypeDefinition reference points to variable type 'AnalogItemType' as expected." );
                    }
                    else {
                        // browse the reference type and see if inherits from AnalogItemType 
                        addWarning( "HasTypeDefinition reference does not point to the correct variable type, possible a sub-type?\n\tExpected variable type: AnalogItemType\n\tActual variable type: " + response.Results[i].References[n].BrowseName.Name );
                    }
                }
            }
        }
        // We have processed all the received forward references. Must have received the mandatory EURange
        if ( !mandatoryEURangeFound ) addError( "Mandatory forward reference EURange not found on Node: " + analogNode.NodeId + " (setting: " + analogNode.NodeSetting + ")." );
    }
    else addError( "Browse(): status: ", uaStatus, uaStatus );
    return( true );
}// function browse613015()

Test.Execute( { Procedure: browse613015 } );