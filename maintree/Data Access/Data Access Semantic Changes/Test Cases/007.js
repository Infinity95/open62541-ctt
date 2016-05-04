/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Remove an element from the EnumStrings array, on a MultiStateDiscreteType node. */

function semantic007() {
    if( !isDefined( multiStateItems ) ) {
        addSkipped( "MultiStateDiscreteType items are not configured. Skipping test." );
        return( false );
    }
    if( isDefined( _TwoStateWritable ) && _TwoStateWritable == false ) {
        addSkipped( "Skipping test because writing to MultiStateDiscreteType was prevoiusly determined as not possible." );
        return( false );
    }

    // get the EURange for the item into a Node.
    if( !TranslateBrowsePathsToNodeIdsHelper.Execute( { Node: multiStateItems[0], BrowsePaths: [ "EnumStrings" ] } ) ) {
        addError( "MultiStateDiscreteType  item '" + multiStateItems[0].NodeSetting + "' does not have a EnumStrings property which is NOT legal because its a MANDATORY property." );
        return( false );
    }
    var nodeTS = MonitoredItem.fromNodeIds( TranslateBrowsePathsToNodeIdsHelper.Response.Results[0].Targets[0].TargetId.NodeId )[0];
    if( !isDefined( nodeTS ) ) {
        addError( "EnumStrings could not be read on node: '" + multiStateItems[0].NodeSetting + "'. Aborting test." );
        return( false );
    }

    // read the property, just to make sure that we can...
    if( ! ReadHelper.Execute( { NodesToRead: nodeTS } ) ) throw( "Unable to read the EnumStrings on node: '" + multiStateItems[0].NodeSetting + "'. Aborting test." );

    if( CreateMonitoredItemsHelper.Execute( { ItemsToCreate: multiStateItems[0], TimestampsToReturn: TimestampsToReturn.Server, SubscriptionId: defaultSubscription } ) ) {
        // now try to remove a string from the array and then to write to the property.
        var ltValues = nodeTS.Value.Value.toLocalizedTextArray();
        var ltValuesLtd = new UaLocalizedTexts();
        for( var i=0; i<ltValues.length-1; i++ ) ltValuesLtd[i] = ltValues[i];
        nodeTS.Value.Value.setLocalizedTextArray( ltValuesLtd );
        var expectedResults = new ExpectedAndAcceptedResults( [ StatusCode.Good, StatusCode.BadNotSupported, StatusCode.BadUserAccessDenied, StatusCode.BadNotWritable ] );
        WriteHelper.Execute( { NodesToWrite: nodeTS, ReadVerification: false, OperationResults: expectedResults } );

        // did the write succeed?
        if( WriteHelper.Response.Results[0].isGood() ) {
            // now check if an event is raised
            PublishHelper.Execute();
            if( Assert.True( PublishHelper.CurrentlyContainsData(), "Publish() expected a dataChange notification." ) ) {
                Assert.Equal( StatusCode.Good | SEMANTICCHANGE_BIT, PublishHelper.CurrentDataChanges[0].MonitoredItems[0].Value.StatusCode.StatusCode, "Expected the SemanticChanged bit = TRUE because the semantic (EngineeringUnits) has changed.", "SemanticChange bit changed as expected."  );
            }
            _TwoStateWritable = true;
            // revert the EnumStrings back to the way that it was:
            nodeTS.Value.Value.setLocalizedTextArray( ltValues );
            WriteHelper.Execute( { NodesToWrite: nodeTS, ReadVerification: false } );
        }
        else {
            addWarning( "The EnumStrings could not be written to " + WriteHelper.Response.Results[0] + ". Aborting test." );
            _TwoStateWritable = false;
        }

        DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: multiStateItems[0], SubscriptionId: defaultSubscription } );
    }
    return( true );
}// function semantic007()

Test.Execute( { Procedure: semantic007 } );