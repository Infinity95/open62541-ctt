print( "\n\n\n***** CONFORMANCE UNIT 'Monitor Value Change' TEST SCRIPTS COMPLETE ******\n" );

DeleteSubscriptionsHelper.Execute( { SubscriptionIds: MonitorBasicSubscription } );
revertOriginalValuesScalarStatic();
Test.Disconnect();
Test.PostTestFunctions = [];


print( "\n\n\n***** CONFORMANCE UNIT 'Monitor Value Change' TESTING COMPLETE ******\n" );