/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Specify various attributes (not just .Value) for monitoring. Filter = DeadbandAbsolute and the deadbandValue is 5.
        Expected Results: ServiceResult=�Good�. Operation level result for .Value is �Good�.
            Operation level results for other attributes are "Bad_FilterNotAllowed". */

function createMonitoredItems591022() {
    var filter = Event.GetDataChangeFilter( DeadbandType.Absolute, 5, DataChangeTrigger.StatusValue );
    // get the Nodes to test with..
    var items = MonitoredItem.GetRequiredNodes( { Settings: Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.NumericSettings, Number: 3 } );
    for( var i in items ) items[i].Filter = filter;
    items[0].AttributeId = Attribute.Value;
    items[1].AttributeId = Attribute.DisplayName;
    items[2].AttributeId = Attribute.WriteMask;
    // create the monitored items - we expect this to partially succeed
    var expectedResults = [ new ExpectedAndAcceptedResults( StatusCode.Good ), new ExpectedAndAcceptedResults( StatusCode.BadFilterNotAllowed ), new ExpectedAndAcceptedResults( StatusCode.BadFilterNotAllowed ) ];
    // the server may not support filters at all, so also allow the first item to fail
    expectedResults[0].addAcceptedResult( StatusCode.BadMonitoredItemFilterUnsupported );
    CreateMonitoredItemsHelper.Execute( { ItemsToCreate: items, TimestampsToReturn: TimestampsToReturn.Both, SubscriptionId: MonitorBasicSubscription, OperationResults: expectedResults } );
    // clean-up
    DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: items, SubscriptionId: MonitorBasicSubscription } );
    return( true );
}

Test.Execute( { Procedure: createMonitoredItems591022 } );