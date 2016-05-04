include( "./library/Base/assertions.js" );
include( "./library/Base/Objects/monitoredItem.js" );
include( "./library/Base/Objects/expectedResults.js" );
include( "./library/Base/SettingsUtilities/NodeIds.js" );
include( "./library/ServiceBased/Helpers.js" );
include( "./library/ServiceBased/AttributeServiceSet/HistoryRead.js" );
include( "./library/ServiceBased/AttributeServiceSet/HistoryRead/HAStructureHelpers.js" );
include( "./library/ServiceBased/AttributeServiceSet/HistoryUpdate.js" );
include( "./library/ServiceBased/ViewServiceSet/TranslateBrowsePathsToNodeIds.js" );

function gTime( time ) { return( "2013-08-02T" + time + ".271Z" ); }

// get item settings
var items = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.HAProfile.Scalar.Settings ); 
if( items === undefined || items === null || items.length === 0 ) throw( "No items configured!" );

// Connect to the server 
var g_channel = new UaChannel();
var Test.Session.Session = new UaSession( g_channel );
Test.Session.Session.DefaultTimeoutHint = parseInt( readSetting( "/Server Test/Session/DefaultTimeoutHint" ) );
if( !connect( g_channel, Test.Session.Session ) ) {
    addError( "Connect()");
    stopCurrentUnit();
}

if( !activateSession( Test.Session.Session ) ) {
    addError( "Unable to activateSession" );
    stopCurrentUnit();
}

// create the history read object, and configure a simple Read Raw call
try {
    var startTime = UaDateTime.fromString( gTime( "20:00:00"  ) );
    var endTime = UaDateTime.fromString( gTime( "20:59:59" ) );
    var expectedStatusCodes = new ExpectedAndAcceptedResults( [StatusCode.Good, StatusCode.GoodNoData ] );

    var historyReadParameters = { 
          NodesToRead: items,
          HistoryReadDetails: UaReadRawModifiedDetails.New(
                                  { IsReadModified: false,
                                    StartTime: startTime, 
                                    EndTime: new UaDateTime(),
                                    NumValuesPerNode: 10, 
                                    ReturnBounds: false } ),
          TimestampsToReturn: TimestampsToReturn.Both,
          ReleaseContinuationPoints: false,
          OperationResults: expectedStatusCodes,
          Debug: false };

    // create the HISTORYREAD helper, and then read the RAW data
    var HR = new HistoryReadService( Test.Session.Session );
    Assert.True( HR.Execute( historyReadParameters ), "HistoryRead Raw." );

    // now read PROCESSED data using the AVERAGE aggregate
    historyReadParameters.HistoryReadDetails = UaReadProcessedDetails.New( { StartTime: startTime, EndTime: endTime, ProcessingInterval: 5000.0, AggregateType: new UaNodeId( Identifier.AggregateFunction_Average ), AggregateConfiguration: UaAggregateConfiguration.New() } );
//    Assert.True( HR.Execute( historyReadParameters ), "HistoryRead Processed( average )" );

    // minimum
    historyReadParameters.HistoryReadDetails.AggregateType.NodeId = new UaNodeId( Identifier.AggregateFunction_Minimum );
//    Assert.True( HR.Execute( historyReadParameters ), "HistoryRead Processed( minimum )" );

    // maximum
    historyReadParameters.HistoryReadDetails.AggregateType.NodeId = new UaNodeId( Identifier.AggregateFunction_Maximum );
//    Assert.True( HR.Execute( historyReadParameters ), "HistoryRead Processed( maximum )" );

    // count
    historyReadParameters.HistoryReadDetails.AggregateType.NodeId = new UaNodeId( Identifier.AggregateFunction_Count );
//    Assert.True( HR.Execute( historyReadParameters ), "HistoryRead Processed( count )" );

    // start
    historyReadParameters.HistoryReadDetails.AggregateType.NodeId = new UaNodeId( Identifier.AggregateFunction_Start );
//    Assert.True( HR.Execute( historyReadParameters ), "HistoryRead Processed( minimum )" );

    // end
    historyReadParameters.HistoryReadDetails.AggregateType.NodeId = new UaNodeId( Identifier.AggregateFunction_End );
//    Assert.True( HR.Execute( historyReadParameters ), "HistoryRead Processed( maximum )" );

    // read at time
    historyReadParameters.HistoryReadDetails = UaReadAtTimeDetails.New( { Times: [ UaDateTime.fromString( gTime( "20:00:10" ) ), UaDateTime.fromString( gTime( "20:00:20" ) ), UaDateTime.fromString( gTime( "20:00:30" ) ) ] } );
//    Assert.True( HR.Execute( historyReadParameters ), "HistoryRead ReadAtTime( 3 times )" ); Assert.Equal( 3, items[0].Value.length );

    // history update 
    var HU = new HistoryUpdateService( Test.Session.Session );
    var params = UaUpdateDataDetails.New( { NodeId: items[0].NodeId, PerformInsertReplace: PerformUpdateType.Insert,
            UpdateValues: [ UaDataValue.New( { Value: items[0].Value[0].Value, ServerTimestamp: startTime } ),
                        UaDataValue.New( { Value: items[0].Value[1].Value, ServerTimestamp: startTime } ),
                        UaDataValue.New( { Value: items[0].Value[2].Value, ServerTimestamp: startTime } ) ] } );
    var serviceResult = new ExpectedAndAcceptedResults( StatusCode.Good );
    var operationResults = [ new ExpectedAndAcceptedResults( StatusCode.Good ) ];
    operationResults[0].TransactionResults = [ new ExpectedAndAcceptedResults( StatusCode.BadEntryExists ), new ExpectedAndAcceptedResults( StatusCode.BadEntryExists ), new ExpectedAndAcceptedResults( StatusCode.BadEntryExists ) ];
    Assert.True( HU.Execute( { HistoryUpdateDetails: params, ServiceResult: serviceResult, OperationResults: operationResults, Debug: true } ), "HistoryUpdate() failed" );
}
catch( ex ) {
    print( "\n\n*** ERROR:\n\t" + ex + "\n\n" );
}
finally {
    // disconnect from server
    disconnect( g_channel, Test.Session.Session );
}