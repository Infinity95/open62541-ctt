/*      Create a Subscription that is actively monitoring multiple items. 
        Call the Server.GetMonitoredItems method while specifying the SubscriptionId of the current subscription.*/

function methodCallTest( session, objectId, methodId ) { 
    //create a subscription
    var subscription = new Subscription();
    if( !CreateSubscriptionHelper.Execute( { Subscription: subscription } ) ) return( false );

    var items = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.Settings );
    CreateMonitoredItemsHelper.Execute( { ItemsToCreate: items, TimestampsToReturn: TimestampsToReturn.Both, SubscriptionId: subscription } );

    var clientHandles = [];
    for( var i = 0; i< items.length -1; i++ ) clientHandles.push( CreateMonitoredItemsHelper.Request.ItemsToCreate[i].RequestedParameters.ClientHandle );

    var testResult = CallHelper.Execute( { ServiceResult: new ExpectedAndAcceptedResults( StatusCode.Good ),
                              OperationResults: [
                                          new ExpectedAndAcceptedResults( [ StatusCode.Good ] ),
                                          new ExpectedAndAcceptedResults( [ StatusCode.BadSubscriptionIdInvalid ] )
                                  ],
                              MethodsToCall: [ { 
                                          MethodId: new UaNodeId.fromString( "ns=0;i=11492" ), 
                                          ObjectId: new UaNodeId.fromString( "ns=0;i=2253" ), 
                                          InputArguments: [
                                                              UaVariant.New( { Type: BuiltInType.UInt32, Value: subscription.SubscriptionId } )
                                                          ]
                                  },
                                  { 
                                          MethodId: new UaNodeId.fromString( "ns=0;i=11492" ), 
                                          ObjectId: new UaNodeId.fromString( "ns=0;i=2253" ),
                                          InputArguments: UaVariant.New( { Type: BuiltInType.UInt32, Value: Constants.UInt32_Max } )
                                  } ]
                             } );

    if( CallHelper.Response.Results[0].StatusCode.StatusCode = StatusCode.Good ) {
        // check the call response if the server is sending the correct ClientHandles
        if( Assert.Equal( CallHelper.Response.Results[0].OutputArguments[1].toUInt32Array().length, items.length, "OutputArguments received in the call method did not match the number of monitored items created." ) ) {
            Assert.True( !ArrayContains( CallHelper.Response.Results[0].OutputArguments[1].toUInt32Array(), clientHandles  ), "OutputArguments do not match the Client Handle" ) ;
        }
    }// if(CallHelper = Good)

    //cleanup
    DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: items, SubscriptionId: subscription } );
    DeleteSubscriptionsHelper.Execute( { SubscriptionIds: subscription } );

    print( "\n\nCall result: " + testResult );
    return( testResult );
}

Test.Execute( { Procedure: methodCallTest } );