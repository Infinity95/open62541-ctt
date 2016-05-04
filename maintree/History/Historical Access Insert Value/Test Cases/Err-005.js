/*  Test prepared by nathan.pocock@opcfoundation.org
    Description: empty request */

function hainsertval() {
    var haparams = { 
          Debug: CUVariables.Debug,
          HistoryUpdateDetails: UaUpdateDataDetails.New( { NodeId: CUVariables.Items[0], PerformInsertReplace: PerformUpdateType.Insert } ),
          OperationResults: [ new ExpectedAndAcceptedResults( StatusCode.BadHistoryOperationInvalid ) ] };

    return( HistoryUpdateHelper.Execute( haparams ) );
}

Test.Execute( { Procedure: hainsertval } );