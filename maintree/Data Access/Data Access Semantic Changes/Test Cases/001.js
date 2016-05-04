/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Change the EngineeringUnits (OPTIONAL) on an AnalogItemType node. */

function semantic001() {
    if( !isDefined( analogItems ) ) {
        addSkipped( "AnalogItemType is not configured. Skipping test." );
        return( false );
    }
    ReadHelper.Execute( { NodesToRead: analogItems[0] } );

    // get the EURange for the item into a Node.
    if( !TranslateBrowsePathsToNodeIdsHelper.Execute( { Node: analogItems[0], BrowsePaths: [ "EngineeringUnits" ], OperationResults: new ExpectedAndAcceptedResults( [ StatusCode.Good, StatusCode.BadNoMatch ] ) } ) 
            || TranslateBrowsePathsToNodeIdsHelper.Response.Results[0].StatusCode.isBad() ) {
        addSkipped( "Analog item '" + analogItems[0].NodeSetting + "' does not have an EngineeringUnits property which is legal because its an optional property." );
        return( false );
    }
    var nodeEU = MonitoredItem.fromNodeIds( TranslateBrowsePathsToNodeIdsHelper.Response.Results[0].Targets[0].TargetId.NodeId )[0];
    if( !isDefined( nodeEU ) ) throw( "EngineeringUnits could not be read on node: '" + analogItems[0].NodeSetting + "'. Aborting test." );

    // read the engineering units, just to make sure that we can...
    if( ! ReadHelper.Execute( { NodesToRead: nodeEU } ) ) throw( "Unable to read the EngineeringUnits on node: '" + analogItems[0].NodeSetting + "'. Aborting test." );

    if( CreateMonitoredItemsHelper.Execute( { ItemsToCreate: analogItems[0], TimestampsToReturn: TimestampsToReturn.Server, SubscriptionId: defaultSubscription } ) ) {
        // now try to write to the EngineeringUnits.
        nodeEU.OriginalValue = nodeEU.Value.Value.clone();
        var newEngUnits = UaEUInformation.New( { DisplayName: "centi-heit" } );
        var extObject = new UaExtensionObject();
        extObject.setEUInformation( newEngUnits );
        nodeEU.Value.Value.setExtensionObject( extObject );

        //nodeEU.Value.Value.DisplayName = "centi-heit";
        var expectedResults = new ExpectedAndAcceptedResults( [ StatusCode.Good, StatusCode.BadNotSupported, StatusCode.BadUserAccessDenied, StatusCode.BadNotWritable ] );
        WriteHelper.Execute( { NodesToWrite: nodeEU, ReadVerification: false, OperationResults: [ expectedResults ] } );

        // did the write succeed?
        if( WriteHelper.Response.Results[0].isGood() ) {
            // now check if an event is raised
            PublishHelper.Execute();
            if( Assert.True( PublishHelper.CurrentlyContainsData(), "Publish().NotificationData.NotificationMessage.MonitoredItems[0].Value.StatusCode.SemanticsChanged bit expected to be TRUE." ) )
                Assert.Equal( StatusCode.Good | SEMANTICCHANGE_BIT, PublishHelper.CurrentDataChanges[0].MonitoredItems[0].Value.StatusCode.StatusCode, "Expected the SemanticChanged bit = TRUE because the semantic (EngineeringUnits) has changed.", "SemanticChange bit changed (is TRUE) as expected."  );

            UaVariant.Increment( { Value: analogItems[0].Value } );
            WriteHelper.Execute( { NodesToWrite: analogItems[0], ReadVerification: false } );

            PublishHelper.WaitInterval( { Items: analogItems[0], Subscription: defaultSubscription } );
            PublishHelper.Execute();
            if( Assert.True( PublishHelper.CurrentlyContainsData(), "Publish().NotificationData.NotificationMessage.MonitoredItems[0].Value.StatusCode.SemanticsChanged bit expected to be FALSE because we were previously notified of the change." ) )
                Assert.NotEqual( StatusCode.Good | SEMANTICCHANGE_BIT, PublishHelper.CurrentDataChanges[0].MonitoredItems[0].Value.StatusCode.StatusCode, "Expected the SemanticChanged bit = FALSE because we received the notification on the previous Publish() call.", "SemanticChange bit changed has reset to FALSE as expected."  );

            _EngUnitsWritable = true;

            // revert to the prior value 
            nodeEU.Value.Value = nodeEU.OriginalValue;
            WriteHelper.Execute( { NodesToWrite: nodeEU, ReadVerification: false, OperationResults: [ expectedResults ] } );
        }
        else {
            addSkipped( "The EngineeringUnits could not be written to " + WriteHelper.Response.Results[0] + ". Aborting test." );
            _EngUnitsWritable = false;
        }

        DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: analogItems[0], SubscriptionId: defaultSubscription } );
    }
    return( true );
}

Test.Execute( { Procedure: semantic001 } );