print( "\n\n\n***** CONFORMANCE UNIT 'Monitor Triggering' TEST SCRIPTS COMPLETE ******\n" );

DeleteSubscriptionsHelper.Execute( { SubscriptionIds: MonitorTriggeringSubscription } );
Test.Disconnect();

print( "\n\n\n***** CONFORMANCE UNIT 'Monitor Triggering' TESTING COMPLETE ******\n" );