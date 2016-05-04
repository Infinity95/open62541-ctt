/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Specify a filter using a deadband absolute. Set the deadband value to be 
        the equivalent of 25. Write numerous values to the item that will cause 
        event notifications to be sent, and for some items to be filtered. 
        call Publish() to verify the deadband is correctly filtering values.
    Expected Results: ServiceResult=�Good�, operation level result also �Good�.
            However, we ONLY expect values that pass the deadband to be received when invoking Publish. */

Test.Execute( { Procedure: function test() {
    // temporarily delete the subscription defined in "initialize.js"
    // we will re-create it after this test.
    PublishHelper.ClearServerNotifications();
    DeleteSubscriptionsHelper.Execute( { SubscriptionIds: MonitorBasicSubscription } );

    var subscription = new Subscription();
    if( !CreateSubscriptionHelper.Execute( { Subscription: subscription } ) ) return( false );

    var integerDeadband   = 250;
    var integerWritesPass = [ 251, 502, 1002, 751, 500 ];
    var integerWritesFail = [ 501, 750, 502, 749, 600, 700 ];

    var floatDeadband = 220.5;
    floatWritesPass   = [ 441.1, 661.7, 882.3, 661.7, 0 ];
    floatWritesFail   = [ 220.5, -220.5, 100, -200, 219.9, -220.4 ];

    DeadbandAbsoluteFiltering_WritePublishTesting( subscription, ReadHelper, WriteHelper, PublishHelper, 
        integerDeadband, integerWritesPass, integerWritesFail,
        floatDeadband,   floatWritesPass,   floatWritesFail, { UndesirableTypes: [ BuiltInType.Byte, BuiltInType.SByte ] }  );

    // delete subscription
    DeleteSubscriptionsHelper.Execute( { SubscriptionIds: subscription } );
    PublishHelper.Clear();

    // resurrect the original subscription defined in "initialize.js"
    if( !CreateSubscriptionHelper.Execute( { Subscription: MonitorBasicSubscription } ) ) {
        addError( "Aborting remaining MONITOR VALUE CHANGE conformance unit because createSubscription failed, which is a necessary function for testing this conformance unit." );
        return( false );
    }
    return( true );
} } );