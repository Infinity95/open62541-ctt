/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: From 2 sessions, make sure that the SemanticsChanged bit behaves correctly. */

function semantic011() {
    if( !isDefined( analogItems ) ) {
        addSkipped( "AnalogType items are not configured. Skipping test." );
        return( false );
    }
    if( !_EuRangeWritable ) {
        addSkipped( "EURange not writable, skipping test." );
        return( false );
    }
    // get the nodeId of the EURange property
    if( !TranslateBrowsePathsToNodeIdsHelper.Execute( { Node: analogItems[0], BrowsePaths: [ "EURange" ] } ) ) {
        addError( "Analog item '" + analogItems[0].NodeSetting + "' does not have an EURange property which is NOT legal because its a MANDATORY property." );
        return( false );
    }
    var nodeEU = MonitoredItem.fromNodeIds( TranslateBrowsePathsToNodeIdsHelper.Response.Results[0].Targets[0].TargetId.NodeId )[0];
    ReadHelper.Execute( { NodesToRead: nodeEU } );

    // create our second channel
    var channel2 = new OpenSecureChannelService();
    var session2 = new CreateSessionService( { Channel: channel2 } );

    var analogItems2 = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.DAProfile.AnalogType.Settings );
    if( !( isDefined( analogItems2 ) && isDefined( analogItems2.length ) && analogItems2.length !== 0 ) ) {
        analogItems2 = null;
    }

    if( !( channel2.Execute() && session2.Execute() ) ) {
        addError( "Unable to create a new connection" );
        CloseSecureChannelHelper.Execute( { Channel: channel2 } );
        return( false );
    }
    if( !ActivateSessionHelper.Execute( { Session: session2 } ) ) {
        addError( "Unable to activate a new session" );
        CloseSessionHelper.Execute( { Session: session2 } );
        CloseSecureChannelHelper.Execute( { Channel: channel2 } );
        return( false );
    }

    // create a new subscription in the new session
    var subscription2 = new Subscription();
    var CreateSubscriptionHelper2 = new CreateSubscriptionService( { Session: session2 } );
    if( CreateSubscriptionHelper2.Execute( { Subscription: subscription2 } ) ) {
        CreateSubscriptionHelper2 = null;
        // create a monitored item in session #1
        if( CreateMonitoredItemsHelper.Execute( { ItemsToCreate: analogItems[0], TimestampsToReturn: TimestampsToReturn.Server, SubscriptionId: defaultSubscription } ) ) {
            // create a monitored item in session #2
            var CreateMonitoredItemsSession2 = new CreateMonitoredItemsService( session2 ); 
            if( CreateMonitoredItemsSession2.Execute( { ItemsToCreate: analogItems2[0], TimestampsToReturn: TimestampsToReturn.Server, SubscriptionId: subscription2 } ) ) {
                var PublishHelper2 = new PublishService( { Session: session2 } );

                // call Publish() twice, to get initial data changes for both sessions
                PublishHelper.Execute( { FirstPublish: true } ); // publish #1
                if( Assert.True( PublishHelper.CurrentlyContainsData(), "Publish() (session#1) did not return the initial data-change" ) ) {
                    PublishHelper2.Execute( { FirstPublish: true } ); // publish #2
                    if( Assert.True( PublishHelper2.CurrentlyContainsData(), "Publish() (session#2) did not return the initial data-change" ) ) {

                        // from session #1, change the semantics; now try to write to the property.
                        var eurangeXO = nodeEU.Value.Value.toExtensionObject();
                        var eurange = eurangeXO.toRange();
                        eurange.High = parseFloat( eurange.High ) + 1.0;
                        eurange.Low = parseFloat( eurange.Low ) - 1.0;
                        eurangeXO.setRange( eurange );
                        nodeEU.Value.Value.setExtensionObject( eurangeXO );
                        var expectedResults = new ExpectedAndAcceptedResults( [ StatusCode.Good, StatusCode.BadNotSupported, StatusCode.BadUserAccessDenied ] );
                        WriteHelper.Execute( { NodesToWrite: nodeEU, ReadVerification: false, OperationResults: [ expectedResults ] } );
        
                        // did the write succeed?
                        if( WriteHelper.Response.Results[0].isBad() ) {
                            addSkipped( "The EURange could not be written to " + WriteHelper.Response.Results[0] + ". Aborting test." );
                            _EuRangeWritable = false;

                            // call Publish() (#3) again, we hope to see semantic changed - in session #1
                            PublishHelper.Execute();
                            if( Assert.True( PublishHelper.CurrentlyContainsData(), "Publish() (session#1) did not return the initial data-change" ) ) {
                                Assert.Equal( StatusCode.Good | SEMANTICCHANGE_BIT, PublishHelper.CurrentDataChanges[0].MonitoredItems[0].Value.StatusCode.StatusCode, "Session #1 Expected the SemanticChanged bit = TRUE because the semantic (EURange) has changed.", "SemanticChange bit changed as expected."  );

                                // now write a value to the item
                                UaVariant.Increment( { Value: analogItems[0].Value } );
                                WriteHelper.Execute( { NodesToWrite: analogItems[0], ReadVerification: false } );

                                // call Publish() (#4) twice (once per session) and make sure that we receive a data-change
                                // notification and the SemanticsChanged bit is FALSE
                                PublishHelper.Execute();
                                if( Assert.True( PublishHelper.CurrentlyContainsData(), "Publish() (session#1) did not return the initial data-change" ) ) {
                                    Assert.Equal( StatusCode.Good, PublishHelper.CurrentDataChanges[0].MonitoredItems[0].Value.StatusCode.StatusCode, "Session #1 Expected the SemanticChanged bit = FALSE because the semantic (EURange) has changed.", "SemanticChange bit changed to FALSE as expected."  );

                                    PublishHelper2.Execute();
                                    if( Assert.True( PublishHelper2.CurrentlyContainsData(), "Publish() (session#2) did not return the initial data-change" ) ) {
                                        Assert.Equal( StatusCode.Good | SEMANTICCHANGE_BIT, PublishHelper2.CurrentDataChanges[0].MonitoredItems[0].Value.StatusCode.StatusCode, "Session #2 Expected the SemanticChanged bit = TRUE because the semantic (EURange) has changed.", "SemanticChange bit changed as expected."  );
                                    }
                                }// publish #4
                            }// publish #3 succeeeded
                        }// write succeeded
                    }// publish #2 succeeded
                }// publish #1 succeeded
                // clean up
                var DeleteMonitoredItemsHelper2 = new DeleteMonitoredItemsService( { Session: session2 } );
                DeleteMonitoredItemsHelper2.Execute( { ItemsToDelete: analogItems2[0], SubscriptionId: subscription2 } );
                DeleteMonitoredItemsHelper2 = null;
                CreateMonitoredItemsSession2 = null;
                var DeleteSubscriptionsHelper2 = new DeleteSubscriptionService( { Session: session2 } );
                DeleteSubscriptionsHelper2.Execute( { SubscriptionIds: subscription2 } );
            }
            DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: analogItems[0], SubscriptionId: defaultSubscription } );
        }// createMonitoredItems (session 1)
    }
    CloseSessionHelper.Execute( { Session: session2 } );
    CloseSecureChannelHelper.Execute( { Channel: channel2 } );
    return( true );
}// function semantic011()

Test.Execute( { Procedure: semantic011 } );