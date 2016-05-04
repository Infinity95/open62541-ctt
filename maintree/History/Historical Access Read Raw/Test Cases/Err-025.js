/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Read history on a node that does not support it. (Historizing attribute = FALSE and AccessLevel contains HistoryRead) */

function readrawErr025() {
    var result = true;

    // get a non-history node
    var nonHistoricNodeA = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.Settings )[0];
    if( !isDefined( nonHistoricNodeA ) ) { addSkipped( "No non-history nodes configured. Please check settings." ); return( false ); }
    var nonHistoricNodeB = MonitoredItem.clone( nonHistoricNodeA );
    nonHistoricNodeB.AttributeId = Attribute.AccessLevel;

    // make sure node does not support history
    nonHistoricNode.AttributeId = Attribute.Historizing;
    if( !Assert.True( ReadHelper.Execute( { NodesToRead: [ nonHistoricNodeA, nonHistoricNodeB ] } ) ) ) { addError( "Unable to read Historizing attribute." ); return( false ); }
    if( !Assert.False( nonHistoricNodeA.Value.Value.toBoolean(), "Historizing attribute expected to be 'false'." ) ) { addError( "Check settings. The STATIC->SCALAR nodes seem to support history. A non-historizing node is required for this test." ); return( false ); }
    if( !Assert.True(  nonHistoricNodeB.Value.Value.toBoolean(), "AccessLevel attribute does not report HistoryRead is possible." ) ) { addError( "Check settings. The STATIC->SCALAR nodes seem to support history. Non-history nodes required for this test." ); return( false ); }

    var haparams = {
          NodesToRead: nonHistoricNodeA,
          TimestampsToReturn: TimestampsToReturn.Source,
          ReleaseContinuationPoints: false,
          HistoryReadDetails: UaReadRawModifiedDetails.New(
                                  { IsReadModified: false,
                                    StartTime: CUVariables.Items[0].FirstValueInHistory.SourceTimestamp,
                                    EndTime: new UaDateTime(),
                                    NumValuesPerNode: 0, 
                                    ReturnBounds: false } ),
          OperationResults: new ExpectedAndAcceptedResults( [ StatusCode.BadNotSupported, StatusCode.BadHistoryOperationInvalid ]),
          Debug: CUVariables.Debug };

    if( !Assert.True( HistoryReadHelper.Execute( haparams ), "HistoryRead() test #1." ) ) result = false;


    return( result );
}// function readrawErr025()

Test.Execute( { Procedure: readrawErr025 } );