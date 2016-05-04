/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Write to all writable attributes of a Node, based on the value of the writeMask. 
        NOTE: The writeMask attribute is optional, so this test may also fail if it is not supported with error Bad_NotSupported.
        How this test works:
            1. ReadHelper a node, specifically the WriteMask attribute.
            2. Build a list of attributes that we can write to.
            3. WRITE to all of the allowable write attributes with some hard-coded values. */

Test.Execute( { Procedure: function test() {
    var item = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.Settings )[0];
    if( !isDefined( item ) ) { addSkipped( SETTING_UNDEFINED_SCALARSTATIC ); return( false ); }
    item.AttributeId = Attribute.WriteMask;

    //~~~~~~~~~~~~~~~~~~~ STEP ONE - ReadHelper The WriteMask ~~~~~~~~~~~~~~~~~~~~~~~~~~
    if( !ReadHelper.Execute( { NodesToRead: item, OperationResults: new ExpectedAndAcceptedResults( [ StatusCode.Good, StatusCode.BadNotSupported ] ) } ) ) return( false );
    if( ReadHelper.Response.Results[0].StatusCode.isGood() ) {

        //~~~~~~~~~~~~~~~~~~~ STEP TWO - Prepare Write based on WriteMask ~~~~~~~~~~~~~~~~~~~~~~~~~~
        var writeReq = new UaWriteRequest();
        var writeRes = new UaWriteResponse();
        // write request for NodeID
        var writeReq2 = new UaWriteRequest();
        var writeRes2 = new UaWriteResponse();
        //write request for WriteMask
        var writeReq3 = new UaWriteRequest();
        var writeRes3 = new UaWriteResponse();
        var isNodeId = false, isWriteMask = false;
        Test.Session.Session.buildRequestHeader( writeReq.RequestHeader );

        // we'll look at each bit, and then build a write for each one that is TRUE.
        var writeMaskValue = ReadHelper.Response.Results[0].Value;
        populateNodesToWriteFromWriteMask( writeReq, item.NodeId.toString(), writeMaskValue ); 
        // If NodeId attribute and WriteMask attribute are writeable, use multiple calls to write to the attributes
        if( writeMaskValue & AttributeWriteMask.NodeId ) {
            populateNodesToWriteFromWriteMask( writeReq2, item.NodeId.toString(), writeMaskValue & AttributeWriteMask.NodeId );
            isNodeId = true;
        }
        
        if( writeMaskValue & AttributeWriteMask.WriteMask ) {
            populateNodesToWriteFromWriteMask( writeReq3, item.NodeId.toString(), AttributeWriteMask.WriteMask ); 
            isWriteMask = true;
        }



        //~~~~~~~~~~~~~~~~~~~ STEP THREE - WRITE! ~~~~~~~~~~~~~~~~~~~~~~~~~~
        if( writeReq.NodesToWrite.length <= 1 ) addSkipped( "Test cannot be completed: WriteMask indicates that no attributes are writeable. NodeId: '" + item.NodeId + "' (setting: '" + item.NodeSetting + "'). This setting is used in all read/write tests. Please check settings." );
        else {
            //do the Write
            uaStatus = Test.Session.Session.write( writeReq, writeRes );
            if( uaStatus.isGood() ) checkWriteValidParameter( writeReq, writeRes, true, undefined, true, undefined, Test.Session.Session );
            else addError( "Write(): status " + uaStatus, uaStatus );
            if( isNodeId ) {
                uaStatus = Test.Session.Session.write( writeReq2, writeRes2 );
                if( uaStatus.isGood() ) checkWriteValidParameter( writeReq2, writeRes2, true, undefined, true );
                else addError( "Write(): status " + uaStatus, uaStatus );
            }
            if( isWriteMask ) {
                uaStatus = Test.Session.Session.write( writeReq3, writeRes3 );
                if( uaStatus.isGood() ) {
                    checkWriteValidParameter( writeReq2, writeRes2, true, undefined, true );
                    // revert the original writemask value 
                    writeReq3.NodesToWrite[0].AttributeId = Attribute.WriteMask;
                    writeReq3.NodesToWrite[0].Value.Value.setUInt32( writeMaskValue ); // 0 = AccessLevel       
                }
                else addError( "Write(): status " + uaStatus, uaStatus );
            }
        }
    }
    else addError( "Read(): status " + uaStatus, uaStatus );
    return( true );
} } );