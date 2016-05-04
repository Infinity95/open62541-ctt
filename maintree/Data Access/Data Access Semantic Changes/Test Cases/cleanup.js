print( "\n\n\n***** CONFORMANCE UNIT 'Data Access SemanticChanged' TEST SCRIPTS COMPLETE ******\n" );

// delete global subscription
if( isDefined( defaultSubscription ) ) { 
    DeleteSubscriptionsHelper.Execute( { 
        SubscriptionIds: defaultSubscription } );
}

// disconnect from server
Test.Disconnect();

if( !isDefined( analogItems ) ) notImplemented( "AnalogItemType items not configured and therefor not tested." );
if( !isDefined( twoStateItems ) ) notImplemented( "TwoStateDiscreteItemType items not configured and therefor not tested." );
if( !isDefined( multiStateItems ) ) notImplemented( "MultiStateDiscreteItemType items not configured and therefor not tested." );
if( !( isDefined( _EngUnitsWritable ) && _EngUnitsWritable ) ) notImplemented( "EngineeringUnits property tests unable to be tested in the CTT and must be conducted manually." );
if( !( isDefined( _InstrRangeWritable ) && _InstrRangeWritable ) ) notImplemented( "InstrumentRange property tests unable to be tested in the CTT and must be conducted manually." );
if( !( isDefined( _EuRangeWritable ) && _EuRangeWritable ) ) notImplemented( "EURange property tests unable to be tested in the CTT and must be conducted manually." );
if( !( isDefined( _MultiStateWritable ) && _MultiStateWritable ) ) notImplemented( "EnumStrings property tests unable to be tested in the CTT and must be conducted manually." );


print( "\n\n\n***** CONFORMANCE UNIT 'Data Access SemanticChanged' TESTING COMPLETE ******\n" );