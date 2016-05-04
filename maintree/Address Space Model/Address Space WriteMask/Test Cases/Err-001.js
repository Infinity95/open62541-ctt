/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Write to multiple valid attributes for a single node, while also specifying an invalid attribute.
        We expect good results for the valid writes, but a Bad_AttributeIdInvalid for the invalid one. */

function write582Err004()
{
    const INVALIDATTRIBUTEID = 0x1234;
    var items = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.Settings, 0, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, true );
    if( items == null || items.length == 0 )
    {
        addSkipped( SETTING_UNDEFINED_SCALARSTATIC );
        return( false );
    }

    var settingNames = MonitoredItem.GetSettingNames( items );

    //~~~~~~~~~~~~~~~~~~~ STEP ONE - ReadHelper The WriteMask ~~~~~~~~~~~~~~~~~~~~~~~~~~
    var readReq = new UaReadRequest();
    var readRes = new UaReadResponse();
    Test.Session.Session.buildRequestHeader( readReq.RequestHeader );

    readReq.TimestampsToReturn = TimestampsToReturn.Neither;
    readReq.NodesToRead[0].NodeId = items[0].NodeId;
    readReq.NodesToRead[0].AttributeId = Attribute.WriteMask;

    // issue the ReadHelper
    var uaStatus = Test.Session.Session.read( readReq, readRes );
    if( uaStatus.isGood() )
    {
        // we expect the read to pass, but if WriteMask is not supported then we must let the test gracefully
        // exit.
        var expectedResults = [];
        expectedResults[0] = new ExpectedAndAcceptedResults( StatusCode.Good );
        expectedResults[0].addExpectedResult( StatusCode.BadNotSupported );
        // validate the response matches one of our expected return codes
        if( checkReadError( readReq, readRes, expectedResults ) )
        {
            // print a more friendly message if the BadAttributeIdInvalid is received: 
            if( readRes.Results[0].StatusCode.StatusCode === StatusCode.BadNotSupported )
            {
                addNotSupported( "WriteMask, an OPTIONAL attribute.", StatusCode.BadNotSupported );
                addSkipped( "Skipping test because we can't write to multiple attributes on a Node because the WriteMask determines which attributes can be written to, and WriteMask is not supported." );
                return( false );
            }

            //~~~~~~~~~~~~~~~~~~~ STEP TWO - Prepare Write based on WriteMask ~~~~~~~~~~~~~~~~~~~~~~~~~~
            var currentNodeNumber = -1;

            var writeReq = new UaWriteRequest();
            var writeRes = new UaWriteResponse();
            Test.Session.Session.buildRequestHeader( writeReq.RequestHeader );

            // we'll look at each bit, and then build a write for each one that is TRUE.
            var writeMaskValue = readRes.Results[0].Value;
            print( "\n\tWriteMask is: " + writeMaskValue );

            populateNodesToWriteFromWriteMask( writeReq, items[0].NodeId.toString(), writeMaskValue );

            // now create the invalid attributeId
            var nextNodePosition = writeReq.NodesToWrite.length;
            writeReq.NodesToWrite[nextNodePosition].NodeId = items[0].NodeId;
            writeReq.NodesToWrite[nextNodePosition].AttributeId = INVALIDATTRIBUTEID;
            writeReq.NodesToWrite[nextNodePosition].Value.Value = new UaVariant();
            writeReq.NodesToWrite[nextNodePosition].Value.Value.setInt16( 100 );


            //~~~~~~~~~~~~~~~~~~~ STEP THREE - WRITE! ~~~~~~~~~~~~~~~~~~~~~~~~~~
            if( writeReq.NodesToWrite.length <= 1 )
            {
                addSkipped( "Test cannot be completed: WriteMask (NodeId: " + items[0].NodeId + " ) indicates that no attributes are writeable." );
            }
            else
            {
                for( var i=0; i<=nextNodePosition; i++ )
                {
                    writeReq.NodesToWrite[i].NodeId = items[0].NodeId;
                }


                //do the Write
                uaStatus = Test.Session.Session.write( writeReq, writeRes );
                if( uaStatus.isGood() )
                {
                    expectedResults = [];
                    // prepare the expected results, which are simply all are good
                    // except for the last one (which we injected)
                    for( var e=0; e<writeReq.NodesToWrite.length - 1; e++ )
                    {
                        expectedResults[e] = new ExpectedAndAcceptedResults( StatusCode.Good );
                    }
                    expectedResults[e] = new ExpectedAndAcceptedResults( StatusCode.BadAttributeIdInvalid );

                    // check the results match our expectations
                    checkWriteError( writeReq, writeRes, expectedResults, false, settingNames, true );
                }
                else
                {
                    addError( "Write(): status " + uaStatus, uaStatus );
                }
            }
        }
    }
    else
    {
        addError( "Read(): status " + uaStatus, uaStatus );
    }
    return( true );
}

Test.Execute( { Procedure: write582Err004 } );