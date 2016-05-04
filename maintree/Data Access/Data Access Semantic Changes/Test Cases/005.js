/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Change the FalseState on a TwoStateDiscreteType node. */

function semantic005() {
    if( !isDefined( twoStateItems ) ) {
        addSkipped( "TwoStateDiscrete items is not configured. Skipping test." );
        return( false );
    }
    if( isDefined( _TwoStateWritable ) && _TwoStateWritable == false ) {
        addSkipped( "Skipping test because writing to TwoStateDiscreteType was prevoiusly determined as not possible." );
        return( false );
    }
    // get the EURange for the item into a Node.
    if( !TranslateBrowsePathsToNodeIdsHelper.Execute( { Node: twoStateItems[0], BrowsePaths: [ "FalseState" ] } ) ) {
        addError( "TwoStateDiscreteType  item '" + twoStateItems[0].NodeSetting + "' does not have a FalseState property which is NOT legal because its a MANDATORY property." );
        return( false );
    }
    var nodeTS = MonitoredItem.fromNodeIds( TranslateBrowsePathsToNodeIdsHelper.Response.Results[0].Targets[0].TargetId.NodeId )[0];
    if( !isDefined( nodeTS ) ) throw( "FalseState could not be read on node: '" + twoStateItems[0].NodeSetting + "'. Aborting test." );

    // read the engineering units, just to make sure that we can...
    if( ! ReadHelper.Execute( { NodesToRead: nodeTS } ) ) {
        addError( "Unable to read the FalseState on node: '" + twoStateItems[0].NodeSetting + "'. Aborting test." );
        return( false );
    }

    // clone() doesn't seem to work here, that's why later we create a new UaLocalizedText()
    nodeTS.OriginalValue = nodeTS.Value.Value.clone();

    if( CreateMonitoredItemsHelper.Execute( { ItemsToCreate: twoStateItems[0], TimestampsToReturn: TimestampsToReturn.Server, SubscriptionId: defaultSubscription } ) ) {
        // now try to write to the FalseState.
        var ltValue = new UaLocalizedText();    // nodeTS.Value.Value.toLocalizedText();
        ltValue.Locale = nodeTS.Value.Value.toLocalizedText().Locale;
        ltValue.Text = "Closed";        

        nodeTS.Value.Value.setLocalizedText( ltValue );

        var expectedResults = new ExpectedAndAcceptedResults( [ StatusCode.Good, StatusCode.BadNotSupported, StatusCode.BadUserAccessDenied, StatusCode.BadNotWritable ] );
        WriteHelper.Execute( { NodesToWrite: nodeTS, ReadVerification: false, OperationResults: [ expectedResults ] } );

        // did the write succeed?
        if( WriteHelper.Response.Results[0].isGood() ) {
            // now check if an event is raised
            PublishHelper.Execute();
            if( Assert.True( PublishHelper.CurrentlyContainsData(), "Publish() expected a dataChange notification." ) ) {
                Assert.Equal( StatusCode.Good | SEMANTICCHANGE_BIT, PublishHelper.CurrentDataChanges[0].MonitoredItems[0].Value.StatusCode.StatusCode, "Expected the SemanticChanged bit = TRUE because the semantic (EngineeringUnits) has changed.", "SemanticChange bit changed as expected."  );
            }
            _TwoStateWritable = true;
            // revert to the prior value 
            nodeTS.Value.Value = nodeTS.OriginalValue;
            WriteHelper.Execute( { NodesToWrite: nodeTS, ReadVerification: false, OperationResults: [ expectedResults ] } );
        }
        else {
            addSkipped( "The FalseState could not be written to " + WriteHelper.Response.Results[0] + ". Aborting test." );
            _TwoStateWritable = false;
        }
        DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: twoStateItems[0], SubscriptionId: defaultSubscription } );
    }
    return( true );
}

Test.Execute( { Procedure: semantic005 } );