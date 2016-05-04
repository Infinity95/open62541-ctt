/*  Test prepared by Anand Taparia; ataparia@kepware.com
    Description: Subscription requestedPublishingInterval is inexcess of samplingIntervals supported.
        CreateMonitoredItems with samplingInterval=-1. RevisedSamplingInterval <> -1. */

function createMonitoredItems591045() {
    const SAMPLING_INTERVAL = -1;
    if( !MonitorBasicSubscription.SubscriptionCreated )
    {
        addError( "Subscription for MonitoredItemsServiceSet was not created." );
    }
    else
    {
        var items = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.Settings, 0, Attribute.Value, "", MonitoringMode.Reporting, true, null, 1, SAMPLING_INTERVAL );
        if( Assert.True( CreateMonitoredItemsHelper.Execute( { ItemsToCreate: items, TimestampsToReturn: TimestampsToReturn.Both, SubscriptionId: MonitorBasicSubscription } ), "CreateMonitoredItems() failed, not expected!" ) )
        {
            for( var i=0; i<createMonItemsResp.Results.length; i++ )
            {
                Assert.NotEqual(
                        SAMPLING_INTERVAL, 
                        createMonItemsResp.Results[i].RevisedSamplingInterval, 
                        "Expected CreateMonitoredItems.Results[" + i + "].RevisedSamplingInterval to be different than the requested -1 value.",
                        "CreateMonitoredItems.Results[" + i + "].RevisedSamplingInterval is not -1, and was successfully changed to " + createMonItemsResp.Results[i].RevisedSamplingInterval );
            }//for i
            DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: items, SubscriptionId: MonitorBasicSubscription } );
        }//if true
    }
    return( true );
}

Test.Execute( { Procedure: createMonitoredItems591045 } );