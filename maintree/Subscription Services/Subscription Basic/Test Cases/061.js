/*  Test 5.10.6 Test 2 prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Deletes multiple subscriptions. */

function deleteSubscription5106003()
{
    const EXPECT_SERVICE_FAIL = false;

    var items = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.Settings );
    if( !isDefined( items ) )
    {
        addSkipped( SETTING_UNDEFINED_SCALARSTATIC );
        return( false );
    }

    subscription1 = new Subscription();

    if( CreateSubscriptionHelper.Execute( { 
                    Subscription: subscription1 } ) )
    {
        // create the items and then delete the subscription
        CreateMonitoredItemsHelper.Execute( { 
                    ItemsToCreate: items, 
                    TimestampsToReturn: TimestampsToReturn.Server, 
                    SubscriptionId: subscription1 } );
        DeleteSubscriptionsHelper.Execute( {
                    SubscriptionIds: subscription1 } );

        // now try to call modify
        var expectedResults = new ExpectedAndAcceptedResults( StatusCode.BadSubscriptionIdInvalid );
        ModifySubscriptionHelper.Execute( {
                        ItemsToModify: items, 
                        TimestampstoReturn: TimestampsToReturn.Server, 
                        SubscriptionId: subscription1, 
                        ServiceResult: expectedResults
                        } );
    }

    //clean-up
    subscription1 = null;
    items = null;
    return( true );
}

Test.Execute( { Procedure: deleteSubscription5106003 } );