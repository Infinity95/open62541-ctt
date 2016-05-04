/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Change the EngineeringUnits (OPTIONAL) on an AnalogItemType node. */

function semantic002() {
    if( !isDefined( analogItems ) ) {
        addSkipped( "AnalogItemType is not configured. Skipping test." );
        return( false );
    }
    if( isDefined( _EngUnitsWritable ) && _EngUnitsWritable == false ) {
        addSkipped( "Skipping test because writing to EngineeringUnits was prevoiusly determined as not possible." );
        return( false );
    }
    // get the EngineeringUnits for the item into a Node.
    if( !TranslateBrowsePathsToNodeIdsHelper.Execute( { Node: analogItems[0], BrowsePaths: [ "EngineeringUnits" ], OperationResults: new ExpectedAndAcceptedResults( [ StatusCode.Good, StatusCode.BadNoMatch ] ) } )
            || TranslateBrowsePathsToNodeIdsHelper.Response.Results[0].StatusCode.isBad() ) {
        addSkipped( "Analog item '" + analogItems[0].NodeSetting + "' does not have an EngineeringUnits property which is legal because its an optional property." );
        return( false );
    }
    var nodeEU = MonitoredItem.fromNodeIds( TranslateBrowsePathsToNodeIdsHelper.Response.Results[0].Targets[0].TargetId.NodeId )[0];
    if( !isDefined( nodeEU ) ) throw( "EngineeringUnits could not be read on node: '" + analogItems[0].NodeSetting + "'. Aborting test." );

    // read the engineering units, just to make sure that we can...
    if( ! ReadHelper.Execute( { NodesToRead: nodeEU } ) ) throw( "Unable to read the EngineeringUnits on node: '" + analogItems[0].NodeSetting + "'. Aborting test." );
    nodeEU.OriginalValue = nodeEU.Value.Value.clone();

    // subscribe to our engineering units
    if( CreateMonitoredItemsHelper.Execute( { ItemsToCreate: analogItems[0], TimestampsToReturn: TimestampsToReturn.Server, SubscriptionId: defaultSubscription } ) ) {
        // now try to write to the EngineeringUnits.
        var newEngUnits = UaEUInformation.New( { DisplayName: "fahren-grade" } );
        var extObject = new UaExtensionObject();
        extObject.setEUInformation( newEngUnits );
        nodeEU.Value.Value.setExtensionObject( extObject );
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
            _EngUnitsWritable = true;
            // revert to the prior value 
            nodeEU.Value.Value = nodeEU.OriginalValue;
            WriteHelper.Execute( { NodesToWrite: nodeEU, ReadVerification: false, OperationResults: [ expectedResults ] } );
        }
        else {
            addWarning( "The EngineeringUnits could not be written to " + WriteHelper.Response.Results[0] + ". Aborting test." );
            _EngUnitsWritable = false;
            return( false );
        }

        DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: analogItems[0], SubscriptionId: defaultSubscription } );
    }
    return( true );
}// function semantic002() 

Test.Execute( { Procedure: semantic002 } );