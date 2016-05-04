/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Monitors the SERVER object specifying an EventFilter where: - AttributeId  = Value (13) - NodeId       = any valid node
        Invokes writes or calls a method to invoke the Event. Calls Publish to make sure the event is received. */

function createMonitoredItems591029() {
    if( !MonitorEventsSubscription.SubscriptionCreated ) {
        addWarning( "Test cannot be completed" );
        return( false );
    }

    const MIN_EVENTS_TO_RECEIVE = 2;
    const MAX_PUBLISH_CALL_COUNT = 12;
    var monitoredItems = MonitoredItem.fromNodeIds( [UaNodeId( Identifier.Server, 0 )], Attribute.EventNotifier, "", MonitoringMode.Reporting, true, null, 10, 0, TimestampsToReturn.Both );

    var filter = Event.GetEventFilter( ["SourceName", "Message", "Severity", "ReceiveTime"] );
    var newFilter = filter.toEventFilter();

    var filterOperand1 = new UaExtensionObject();
        var litOp1 = new UaSimpleAttributeOperand();
        litOp1.AttributeId = Attribute.Value;
        litOp1.BrowsePath[0].Name = "Severity";
        litOp1.BrowsePath[0].NamespaceIndex = 0;
        litOp1.TypeDefinitionId = new UaNodeId( Identifier.BaseEventType, 0 );
        filterOperand1.setSimpleAttributeOperand( litOp1 );

    var filterOperand2 = new UaExtensionObject();
        var litOp2 = new UaLiteralOperand();
        litOp2.Value = new UaVariant();
        litOp2.Value.setInt16( 300 );
        filterOperand2.setLiteralOperand( litOp2 );

        newFilter.WhereClause = new UaContentFilter();
        newFilter.WhereClause.Elements[0] = new UaContentFilterElement();
        newFilter.WhereClause.Elements[0].FilterOperator = FilterOperator.GreaterThanOrEqual;
        newFilter.WhereClause.Elements[0].FilterOperands[0] = filterOperand1;
        newFilter.WhereClause.Elements[0].FilterOperands[1] = filterOperand2;

    filter.setEventFilter( newFilter );
    monitoredItems[0].Filter = filter;

    // CreateMonitoredItems may succeed, or fail if events are not supported
    var anticipatedResults = [ new ExpectedAndAcceptedResults( StatusCode.Good ) ];
    anticipatedResults[0].addExpectedResult( StatusCode.BadMonitoredItemFilterUnsupported );
    if( CreateMonitoredItemsHelper.Execute( { ItemsToCreate: monitoredItems, TimestampsToReturn: TimestampsToReturn.Both, SubscriptionId: MonitorEventsSubscription, OperationResults: anticipatedResults } ) ) {
        // create a second session, see if that creates an event
        var session2 = new CreateSessionService( { Channel: Test.Channel } );
        if( session2.Execute() && ActivateSessionHelper.Execute( { Session: session2 } ) ) CloseSessionHelper.Execute( { Session: session2 } );

        var publishCount = 0;
        while( ( PublishHelper.ReceivedEvents.length < MIN_EVENTS_TO_RECEIVE )
            && ( publishCount < MAX_PUBLISH_CALL_COUNT ) ) {
            // invoke the Publish request.
            if( PublishHelper.Execute( { FirstPublish: true } ) == false ) {
                addError( "Aborting test-run as Publish() failed." );
                break;
            }

            // did we receive anything? if so, display the data
            // if not then we have a problem!
            if( PublishHelper.CurrentlyContainsData() ) PublishHelper.PrintEvents();
            else addLog( "No events received on the Publish call! ");
            publishCount++;
        }

        DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: monitoredItems, SubscriptionId: MonitorEventsSubscription } );
    }
    if( 0 === PublishHelper.ReceivedEvents.length ) addWarning( "Expected to receive events, but received none. You may need to run this test while invoking events on your Server." );
    return( true );
}

Test.Execute( { Procedure: createMonitoredItems591029 } );