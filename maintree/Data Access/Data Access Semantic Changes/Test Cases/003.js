/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Change the EURange (MANDATORY) on an AnalogItemType node. */

function semantic003() {
    if( !isDefined( analogItems ) ) {
        addSkipped( "AnalogItemType is not configured. Skipping test." );
        return( false );
    }
    if( isDefined( _EuRangeWritable ) && _EuRangeWritable == false ) {
        addSkipped( "Skipping test because writing to EURange was prevoiusly determined as not possible." );
        return( false );
    }
    // get the EURange for the item into a Node.
    if( !TranslateBrowsePathsToNodeIdsHelper.Execute( { Node: analogItems[0], BrowsePaths: [ "EURange" ] } ) ) {
        addError( "Analog item '" + analogItems[0].NodeSetting + "' does not have an EURange property which is NOT legal because its a MANDATORY property." );
        return( false );
    }
    var nodeEU = MonitoredItem.fromNodeIds( TranslateBrowsePathsToNodeIdsHelper.Response.Results[0].Targets[0].TargetId.NodeId )[0];
    if( !isDefined( nodeEU ) ) {
        addError( "EURange could not be read on node: '" + analogItems[0].NodeSetting + "'. Aborting test." );
        return( false );
    }

    // read the engineering units, just to make sure that we can...
    if( ! ReadHelper.Execute( { NodesToRead: nodeEU } ) ) {
        addError( "Unable to read the EngineeringUnits on node: '" + analogItems[0].NodeSetting + "'. Aborting test." );
        return( false );
    }

    if( CreateMonitoredItemsHelper.Execute( { ItemsToCreate: analogItems[0], TimestampsToReturn: TimestampsToReturn.Server, SubscriptionId: defaultSubscription } ) ) {
        // now try to write to the EngineeringUnits.
        var eurangeXO = nodeEU.Value.Value.toExtensionObject();
        nodeEU.OriginalValue = eurangeXO.clone();
        var eurange = eurangeXO.toRange();
        eurange.High = parseFloat( eurange.High ) + 1.0;
        eurange.Low = parseFloat( eurange.Low ) - 1.0;
        eurangeXO.setRange( eurange );
        nodeEU.Value.Value.setExtensionObject( eurangeXO );
        var expectedResults = new ExpectedAndAcceptedResults( [ StatusCode.Good, StatusCode.BadNotSupported, StatusCode.BadUserAccessDenied, StatusCode.BadNotWritable ] );
        WriteHelper.Execute( { NodesToWrite: nodeEU, ReadVerification: false, OperationResults: [ expectedResults ] } );

        // did the write succeed?
        if( WriteHelper.Response.Results[0].isGood() ) {
            // now check if an event is raised
            PublishHelper.WaitInterval( { Items: analogItems[0], Subscription: defaultSubscription } );
            PublishHelper.Execute();
            if( Assert.True( PublishHelper.CurrentlyContainsData(), "Publish() expected a dataChange notification." ) ) {
                Assert.Equal( StatusCode.Good | SEMANTICCHANGE_BIT, PublishHelper.CurrentDataChanges[0].MonitoredItems[0].Value.StatusCode.StatusCode, "Expected the SemanticChanged bit = TRUE because the semantic (EngineeringUnits) has changed.", "SemanticChange bit changed as expected."  );
            }
            _EuRangeWritable = true;
            // revert to the prior value 
            nodeEU.Value.Value.setExtensionObject( nodeEU.OriginalValue )
            WriteHelper.Execute( { NodesToWrite: nodeEU, ReadVerification: false, OperationResults: [ expectedResults ] } );
        }
        else {
            addSkipped( "The EURange could not be written to " + WriteHelper.Response.Results[0] + ". Aborting test." );
            _EuRangeWritable = false;
        }
        DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: analogItems[0], SubscriptionId: defaultSubscription } );
    }
    return( true );
}

Test.Execute( { Procedure: semantic003 } );