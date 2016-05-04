/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Subscription requestedPublishingInterval is inexcess of samplingIntervals supported.
        CreateMonitoredItems with samplingInterval=0. RevisedSamplingInterval <> 0. */

function createMonitoredItems591071() {
    const SAMPLING_INTERVAL = 0;
    const FASTESTSAMPLING = parseInt( readSetting( "/Server Test/Capabilities/Fastest Sampling Interval Supported" ).toString() );
    if( !MonitorBasicSubscription.SubscriptionCreated ) {
        addError( "Subscription for MonitoredItemsServiceSet was not created." );
    }
    else {
        var items = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.Settings, 0, Attribute.Value, "", MonitoringMode.Reporting, true, null, 1, 0 );
        if( Assert.True( CreateMonitoredItemsHelper.Execute( { ItemsToCreate: items[0], TimestampsToReturn: TimestampsToReturn.Both, SubscriptionId: MonitorBasicSubscription } ), "CreateMonitoredItems() failed, not expected!" ) ) {
            for( var i=0; i<createMonItemsResp.Results.length; i++ ) {
                if( FASTESTSAMPLING === 0 ) {
                    _warning.store( "Server supports zero-based SamplingInterval.\nDoes it support event-based sampling?" );
                }
                else {
                    if( SAMPLING_INTERVAL === createMonItemsResp.Results[i].RevisedSamplingInterval ) {
                        _warning.store( "Expected CreateMonitoredItems.Results[" + i + "].RevisedSamplingInterval to be different than the requested 0 value. If the subscription is modified, then the samplingInterval will inaccurately reflect the real sampling rate." );
                        _warning.store( "MANUALLY VERIFY THIS SERVER SUPPORTS EVENT-BASED DATA-ACQUISITION (SAMPLING)" );
                    }
                }
            }//for i
            DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: items[0], SubscriptionId: MonitorBasicSubscription } );
        }//if true
    }
    return( true );
}

Test.Execute( { Procedure: createMonitoredItems591071 } );