include( "./library/Base/assertions.js" );
include( "./library/Base/Objects/monitoredItem.js" );
include( "./library/Base/Objects/expectedResults.js" );
include( "./library/Base/SettingsUtilities/NodeIds.js" );
include( "./library/ServiceBased/AttributeServiceSet/HistoryRead/historyRead.js" );
include( "./library/ServiceBased/AttributeServiceSet/HistoryUpdate/historyUpdate.js" );
include( "./library/ServiceBased/AttributeServiceSet/HistoryRead/HAStructureHelpers.js" );
include( "./library/ServiceBased/ViewServiceSet/TranslateBrowsePathsToNodeIds/TranslateBrowsePathHelper.js" );

// get item settings
var items = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.HAProfile.Scalar.Settings );
if( items === undefined || items === null || items.length === 0 )
{
    throw( "No items configured!" );
}

// Connect to the server 
var g_channel = new UaChannel();
var Test.Session.Session = new UaSession( g_channel );
Test.Session.Session.DefaultTimeoutHint = parseInt( readSetting( "/Server Test/Session/DefaultTimeoutHint" ) );
if( !connect( g_channel, Test.Session.Session ) )
{
    addError( "Connect()");
    stopCurrentUnit();
}

if( !activateSession( Test.Session.Session ) )
{
    addError( "Unable to activateSession" );
    stopCurrentUnit();
}

// create the history read object, and configure a simple Read Raw call
try
{
    var startTime = UaDateTime.fromString( "2012-02-09T16:30:17.271Z" );
    var endTime = UaDateTime.fromString( "2012-02-09T12:59:59.999Z" );
    var expectedStatusCodes = new ExpectedAndAcceptedResults( [StatusCode.Good, StatusCode.GoodNoData ] );






    // create the HISTORYREAD helper, and then read the raw data
    var HR = new HistoryReadHelper( Test.Session.Session );
    AssertTrue( HR.Execute( 
        { NodesToRead:items,
          HistoryReadDetails: GetReadRawModifiedDetails(
                                  { IsReadModified: false,
                                    StartTime: startTime, 
                                    EndTime: endTime,
                                    NumValuesPerNode: 0, 
                                    ReturnBounds: false } ),
          TimestampsToReturn: TimestampsToReturn.Both,
          ReleaseContinuationPoints: false,
          ServiceResult: expectedStatusCodes,
          OperationResults: expectedStatusCodes,
          Validation: "success" } ), "Expected the basic Read Raw HistoryRead call to succeed." );


    // this is where you would make changes to data etc.


    // create the HISTORYUPDATE helper, and then pass the unchanged data
    // to the helper so that it can send a HistoryUpdate request to the server.
    var HU = new HistoryUpdateHelper( Test.Session.Session );
    AssertTrue( HU.Execute( 
        { 
            HistoryUpdateDetails: GetUpdateDataDetails(
                                  { NodeId: items[0].NodeId,
                                    PerformInsertReplace: PerformUpdateType.Insert,
                                    UpdateValues: items[0].Value.clone() }
                                )
        } ), "Simple update (no data changes) was expected to succeed." );




}
catch( ex )
{
    print( "\n\n*** ERROR:\n\t" + ex + "\n\n" );
}
finally
{
    // disconnect from server
    disconnect( g_channel, Test.Session.Session );
}