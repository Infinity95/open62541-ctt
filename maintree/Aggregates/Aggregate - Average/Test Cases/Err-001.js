/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: try calculation on a node of type string. */

function aggregateTest() { 
    var result = true;

    // is a history node of type String configured for testing?
    var badTypeSettings = [ "/Server Test/NodeIds/Static/HA Profile/Scalar/Bool",
                            "/Server Test/NodeIds/Static/HA Profile/Scalar/ByteString",
                            "/Server Test/NodeIds/Static/HA Profile/Scalar/String",
                            "/Server Test/NodeIds/Static/HA Profile/Scalar/XmlElement" ];

    var items = MonitoredItem.fromSettings( badTypeSettings );
    if( !isDefined( items ) || items.length === 0 ) { addSkipped( "History node of type STRING is not configured in settings. Skipping test." ); return( false ); }

    // construct our HA request
    var haparams = { 
          NodesToRead: items,
          HistoryReadDetails: UaReadProcessedDetails.New( { 
                  StartTime:  CUVariables.Items[0].RawValues.FirstRecord().SourceTimestamp, 
                  EndTime:    CUVariables.Items[0].RawValues.LastRecord().SourceTimestamp, 
                  ProcessingInterval: 10000, 
                  AggregateType: [] } ),
          TimestampsToReturn:    TimestampsToReturn.Source,
          ReleaseContinuationPoints: false,
          AggregateDefinition: CUVariables.Aggregate,
          OperationResults:    [],
          Debug:               CUVariables.Debug };

    // prepare the call (duplicating the aggregate for each item, and also the expected results
    for( var i=0; i<items.length; i++ ) {
        haparams.OperationResults[i] = new ExpectedAndAcceptedResults( StatusCode.BadAggregateInvalidInputs );
        haparams.HistoryReadDetails.AggregateType[i] = CUVariables.Aggregate.Type;
    }


    // invoke the call
    if( !Assert.True( HistoryReadHelper.Execute( haparams ), "HistoryRead success expected." ) ) result = false;


    return( result );
} // function aggregateTest()

Test.Execute( { Procedure: aggregateTest } );