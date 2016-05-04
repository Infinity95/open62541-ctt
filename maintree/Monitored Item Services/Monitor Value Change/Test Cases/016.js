/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: CreateMonitoredItems on an item to which the user does not have read-access; should succeed but Publish should return the error */

function CreateMonitoredItems016() { 
    var setting = "/Server Test/NodeIds/SecurityAccess/AccessLevel_CurrentRead_NotUser";
    var item = MonitoredItem.fromSetting( setting );
    if( !isDefined( item ) ) { 
        addSkipped( "A node is needed that the currently configured user does not have access to. Check setting '" + setting + "'. Skipped test." );
        return( false );
    }
    if( CreateMonitoredItemsHelper.Execute( { 
            ItemsToCreate: item,
            SubscriptionId: MonitorBasicSubscription,
            OperationResults: new ExpectedAndAcceptedResults( [ StatusCode.Good, StatusCode.BadNotReadable, StatusCode.BadUserAccessDenied ] ) } ) ) {

            if( CreateMonitoredItemsHelper.Response.Results[0].StatusCode.isGood() ) {
                print( "CreateMonitoredItems.Results[0] is Good. Calling Publish() to check the Status in the initial data-change." );
                // wait one publishing cycle before calling publish
                PublishHelper.WaitInterval( { Items: item, Subscription: MonitorBasicSubscription } );
                if( PublishHelper.Execute( { FirstPublish: true } ) ) {
                    if( Assert.True( PublishHelper.CurrentlyContainsData(), "Publish() did not receive the initial DataChange notification." ) ) {
                        PublishHelper.SetItemValuesFromDataChange( [item] );
                        Assert.StatusCodeIsOneOf( new ExpectedAndAcceptedResults( [ StatusCode.BadNotReadable, StatusCode.BadUserAccessDenied ] ), item.Value.StatusCode, "Expected the Publish to yield a data change notification containing a BadUserAccessDenied status code" );
                    }
                }
                DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: item, SubscriptionId: MonitorBasicSubscription } );
            }// CMI response was Good
            else print( "CreateMonitoredItems.Results[0] was '" + CreateMonitoredItemsHelper.Response.Results[0].StatusCode + "' which is legal and does not require a call to Publish()." );
    }// CMI call success
    return( true );
}// function CreateMonitoredItems016() 

Test.Execute( { Procedure: CreateMonitoredItems016 } );