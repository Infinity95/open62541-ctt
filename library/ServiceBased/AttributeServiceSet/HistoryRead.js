include( "./library/ServiceBased/AttributeServiceSet/HistoryRead/HAStructureHelpers.js" );
include( "./library/ServiceBased/AttributeServiceSet/HistoryRead/HAAggregates.js" );
include( "./library/ServiceBased/AttributeServiceSet/HistoryRead/HAAnalysis.js" );

/*  This class object is responsible for calling the HistoryRead() service and for also
    performing any validation etc. This is a quick-use class.
    Helper object for the HistoryRead UA Service call.
        Properties:
            Session:    the sesson object, defined during instanciation.
            Request:    the historyRead request object created by the helper.
            Response:   the response received from the UA Server being tested.
            Success:    a simple true/false flag to indicate a success/fail of the call.
        Functions:
            Execute:                        invokes the HistoryRead call.
            CheckHistoryReadValidParameter: validates the HistoryRead response. */
function HistoryReadService( args ) {
    this.Name = "HistoryRead";
    this.Session = null;       // Session object reference
    this.Request = null;       // copy of the last/current HistoryRead request header
    this.Response = null;      // copy of the last/current HistoryRead server response header
    this.Success  = false;     // simple flag indicating if the last/current call succeeded or not.
    this.InvocationCount = 0;

    if( !isDefined( args ) ) throw( this.Name + " CTOR, arguments not specified." );
    if( !isDefined( args.Session ) ) throw( this.Name + " CTOR, session not specified." );
    else this.Session = args.Session;



    /* Reads values.
         Default values shown in [ ]
          Parameters are: 
              NodesToRead               = [empty] an array of 'MonitoredItem' objects, to read.
              HistoryReadDetails        = [empty] the HistoryReadDetails extensible parameter.
              TimestampsToReturn        = [Both]  TimestampsToReturn enum.
              ReleaseContinuationPoints = [true]  Boolean flag.
              ServiceResult            = [empty] an array of ExpectedAndAcceptedErrors objects.
              OperationResults          = [empty] an array of ExpectedAndAcceptedErrors objects.
              DataResults               = [empty] an array of UaHistoricalData objects.
              Debug                     = [empty] True/False to show verbose info. FALSE=default.
              ClearServerContinuationPoints = {true} True/False to automatically invoke a HistoryRead with ReleaseContinuationPoints=true */
    this.Execute = function( args ) {
        if( !isDefined( args ) ) throw( "HistoryRead.Execute() arguments missing" );
        if( !isDefined( args.NodesToRead ) || args.NodesToRead.length === 0 ) { throw( "HistoryRead.Execute() One or more nodes are required by HistoryRead." ); }
        if( !isDefined( args.HistoryReadDetails ) ) { throw( "HistoryRead.Execute() Required parameter missing: HistoryReadDetails " ); }
        if( !isDefined( args.TimestampsToReturn ) ) { args.TimestampsToReturn = TimestampsToReturn.Both; }
        if( !isDefined( args.ReleaseContinuationPoints ) ) { args.ReleaseContinuationPoints = true; }
        if( !isDefined( args.ServiceResult ) ) { args.ServiceResult = new ExpectedAndAcceptedResults( StatusCode.Good ); }
        if( !isDefined( args.OperationResults ) ) { args.OperationResults = []; }
        if( !isDefined( args.OperationResults.length ) ) { args.OperationResults = [ args.OperationResults ]; }
        if( !isDefined( args.ClearServerContinuationPoints ) ) { args.ClearServerContinuationPoints = true; }
        if( !isDefined( args.Debug ) ) args.Debug = false;
        if( args.NodesToRead.length > 1 && args.OperationResults.length == 1 ) { for( var i=1; i<args.NodesToRead.length; i++ ) args.OperationResults.push( args.OperationResults[0].clone() ); }

        // register that this service is tested
        ServiceRegister.Register( { Service: ServiceRegister.UaService( { Name: this.Name, Available: true, Tested: true } ) } );

        // prepare our return value
        var result = true;

        // is the NodesToRead parameter a collection, or single item?
        if( args.NodesToRead.length == undefined ) {
            if( args.NodesToRead.MonitoredItemId == undefined || args.NodesToRead.MonitoredItemId == null ) {
                throw( "HistoryRead.Execute() argument error. NodesToRead is not of the correct type (monitoredItem)." );
            }
            else args.NodesToRead = [args.NodesToRead];
        }

        // define the historyRead headers
        this.Request  = new UaHistoryReadRequest.New( args );
        this.Response = new UaHistoryReadResponse();
        var session = isDefined( this.Session.Session )? this.Session.Session : this.Session;
        this.Request.RequestHeader = UaRequestHeader.New( { Session: session } );

        // Nodes to Read
        var message = "HistoryRead for '" + args.NodesToRead.length + "' items: " + "\n\tTimestampsToReturn: " + TimestampsToReturn.toString( this.Request.TimestampsToReturn ) + "\n\tRequest:\n" + args.HistoryReadDetails.toString( { Indent: 2 } ) + "\n\tItems: ";
        var tripleDotInserted = false;
        for( var m=0; m<args.NodesToRead.length; m++ ) {
            if( ( args.NodesToRead.length > 20 ) && ( m < 5 || m > ( args.NodesToRead.length - 5 ) ) ) {
                var thisNode = args.NodesToRead[m];
                // node id
                message += "\n\t\t[" + m + "]NodeId: '" + thisNode.NodeId + "'";
                this.Request.NodesToRead[m].NodeId = thisNode.NodeId;
                // node setting; indexRange; continuationPoint; dataEncoding
                if( thisNode.NodeSetting !== undefined && thisNode.NodeSetting !== null && thisNode.NodeSetting.length > 0 ) message += " (setting: '" + args.NodesToRead[m].NodeSetting + "')";
                if( thisNode.IndexRange !== undefined && thisNode.IndexRange !== null && thisNode.IndexRange.length > 0 ) {
                    this.Request.NodesToRead[m].IndexRange = thisNode.IndexRange;
                    message += "; IndexRange: '" + thisNode.IndexRange + "'";
                }
                if( isDefined( thisNode.DataEncoding ) ) {
                    if( isDefined( thisNode.DataEncoding.Name ) ) this.Request.NodesToRead[m].DataEncoding = thisNode.DataEncoding;
                    else this.Request.NodesToRead[m].DataEncoding.Name = thisNode.DataEncoding;
                }
                if( thisNode.ContinuationPoint !== undefined && thisNode.ContinuationPoint !== null ) {
                    this.Request.NodesToRead[m].ContinuationPoint = thisNode.ContinuationPoint;
                    message += "; ContinuationPoint: '" + thisNode.ContinuationPoint + "'";
                }
            }
            else if( !tripleDotInserted ) { message += "\n\t\t..."; tripleDotInserted = true; }
        }// for m...
        if( !args.SuppressMessaging ) addLog( message );

        // issue the read
        if( isDefined( args.PreHook ) ) args.PreHook();
        var uaStatus = session.historyRead( this.Request, this.Response );
        if( isDefined( args.PostHook ) ) args.PostHook();
        this.InvocationCount++;
        // check result
        this.Success = uaStatus.isGood();
        if( uaStatus.isGood() ) {
            result = UaResponseHeader.IsValid( { Service: this, ServiceResult: args.ServiceResult, SuppressMessaging: args.SuppressMessaging, SuppressWarnings: args.SuppressWarnings, SuppressErrors: args.SuppressErrors, ServiceInfo: "NodesToRead #" + this.Request.NodesToRead.length + "; ReleaseContinuationPoints: " + this.Request.ReleaseContinuationPoints } );
            if( result ) result = this.CheckHistoryReadValidParameter( { Request: this.Request, Response: this.Response, ServiceResult: args.ServiceResult, OperationResults: args.OperationResults } );
        }
        else {
            addError( this.Name + "() status: " + uaStatus, uaStatus );
            result = false;
        }

        // Automatically clear the ContinuationPoints?
        if( args.ClearServerContinuationPoints ) {
            // do we even have continuation points to clear?
            var doClearCPs = false;
            for( var i=0; i<this.Response.Results.length; i++ ) { 
                if(this.Response.Results[i].ContinuationPoint !== null && !this.Response.Results[i].ContinuationPoint.isEmpty() ) { 
                    doClearCPs = true; 
                    break;
                }
            }
            if( doClearCPs ) {
                addError( "TODO: Prepare new request with all of the CPs to clear." );
                this.Request.ReleaseContinuationPoints = true;
                var rcpResponse = UaHistoryReadResponse();
                var rcpStatus = this.Session.historyRead( this.Request, rcpResponse );
                if( rcpStatus.isBad() ) addError( "Unable to automatically clear the ContinuationPoints.", rcpStatus );
            }
            else if( !args.SuppressMessaging ) print( "*** Skipping automatic clearing of Server's ContinuationPoints. No ContinuationPoints to clear! ***" );
        }
        else if( !args.SuppressMessaging ) print( "*** Skipping automatic clearing of Server's ContinuationPoints as requested. ***" );
    
        // now to update our monitoredItems with the values just Read...
        // but first, we need to cast the "HistoryData" to the appropriate type!
        for( var i=0; i<this.Response.Results.length; i++ ) {
            if( this.Response.Results[i].HistoryData === null ) {
                addError( "HistoryRead returned HistoryData=<null>" );
                args.NodesToRead[m].Value = [];
            }
            else {
                /* Update MI's with values read from history.
                   Note: the results are returned in the order of the requested items */
                for( var m=0; m<args.NodesToRead.length; m++ ) {
                    // continuation point?
                    args.NodesToRead[m].ContinuationPoint = this.Response.Results[m].ContinuationPoint;

                    // NOW TO CONVERT THE RESPONSE. We need to take into consideration that we could receive
                    // ANYTHING... so we need to convert to the right type
                    
                    if( this.Response.Results[m].HistoryData.TypeId.NodeId.equals( UaNodeId.fromString( "i=658" ) ) ) {
                        // HistoryData 
                        var hd = this.Response.Results[m].HistoryData.toHistoryData();
                        args.NodesToRead[m].Value = hd.DataValues;
                        args.NodesToRead[m].Value.clone = function() {
                            var results = [];
                            for( var cloneI=0; cloneI<this.clone.parent.length; cloneI++ ) results.push( this.clone.parent[cloneI].clone() );
                            return( results );
                        }
                        args.NodesToRead[m].Value.clone.parent = args.NodesToRead[m].Value;
                        args.NodesToRead[m].Value.toString = function() {
                            var s = "";
                            for( var i=0; i<this.clone.parent.length; i++ ) s += this.clone.parent[i].toString() + "\n";
                            return( s );
                        }
                    }
                    else if( this.Response.Results[m].HistoryData.TypeId.NodeId.equals( UaNodeId.fromString( "i=11227" ) ) ) {
                        // HistoryModifiedData
                        var hmd = this.Response.Results[m].HistoryData.toHistoryModifiedData();
                        args.NodesToRead[m].ModifiedValues = hmd.DataValues;
                        args.NodesToRead[m].ModifiedValues.clone = function() {
                            var dvs = new UaDataValues();
                            for( var i=0; i<this.values.length; i++ ) dvs[i] = this.values[i].clone();
                            return( dvs );
                        }//clone()
                        args.NodesToRead[m].ModifiedValues.values = args.NodesToRead[m].ModifiedValues;
                        args.NodesToRead[m].ModificationInfos = hmd.ModificationInfos;
                        args.NodesToRead[m].ModificationInfos.clone = function() {
                            var mis = new UaModificationInfos();
                            for( var i=0; i<this.minfos.length; i++  ) mis[i] = this.minfos[i].clone();
                            return( mis );
                        }//clone()
                        args.NodesToRead[m].ModificationInfos.minfos = args.NodesToRead[m].ModificationInfos;
                    }
                    else {
                        args.NodesToRead[m].Value = [];
                        args.NodesToRead[m].ModifiedValues = [];
                        args.NodesToRead[m].ModificationInfos = [];
                        if( !args.ReleaseContinuationPoints && args.Debug && this.Response.Results[m].StatusCode.isGood() ) print( "HistoryRead.Response.Results[" + m + "] cannot be coerced to HistoryData. Value set to [] (empty)." );
                    }
                }//for m...
            }
        }// for i...
        // if the call failed then register that 
        if( !result ) ServiceRegister.SetFailed( { Name: this.Name } )
        return( result );
    };//Read


    /* Validates the ReadHistory response.
        Parameters: 
            - Request 
            - Response 
            - StartTime 
            - EndTime 
            - ServiceResults
            - OperationResults
            - DataResults */
    this.CheckHistoryReadValidParameter = function( args ) {
        // check in parameters
        if( !isDefined( args ) ){ throw( "HistoryReadHelper.CheckHistoryReadValidParameter missing required argument." ); }
        if( !isDefined( args.Request ) ){ throw( "HistoryReadHelper.CheckHistoryReadValidParameter missing required argument: Request." ); }
        if( !isDefined( args.Response ) ){ throw( "HistoryReadHelper.CheckHistoryReadValidParameter missing required argument: Response." ); }
        var timeTolerence = readSetting( "/Server Test/Time Tolerence" ); // ms tolerance for checking the server timestamp in the datavalue
        var bSucceeded = true;
        var currentTime = UaDateTime.utcNow();
        // as this is a valid parameter test we don't expect any diagnositcinfo
        if( args.Response.DiagnosticInfos.length !== 0 ) {
            addError( "HistoryReadResponse.DiagnosticInfos was returned. No DiagnosticInfos were expected." );
            bSucceeded = false;
        }
        // check number of results
        if( !Assert.Equal( args.Request.NodesToRead.length, args.Response.Results.length, "The number of NodesToRead does not match the number of results." ) ) {
            bSucceeded = false;
        }
        else {
            // do we need to check each result?
            // check each result
            for( var i=0; i<args.Response.Results.length; i++ ) {
                this.Response.Results[i].History = args.Response.Results[i].HistoryData.toHistoryData();
                if( isDefined( this.Response.Results[i].History ) ) this.Response.Results[i].History = this.Response.Results[i].History.DataValues;
                var nodeHistoryResult = args.Response.Results[i];
                // check status code; we might need to compare for specific results 
                if( isDefined( args.OperationResults ) && isDefined( args.OperationResults.length ) && ( args.OperationResults.length > 0 ) ) 
                    Assert.True( args.OperationResults[i].containsStatusCode( nodeHistoryResult.StatusCode ), "Results[ " + i + "].StatusCode did not match expected results. Received: " + nodeHistoryResult.StatusCode + ". " + args.OperationResults.toString() );
                else Assert.True( nodeHistoryResult.StatusCode.isGood(), "Results[" + i + "].StatusCode is not Good, but is: " + nodeHistoryResult.StatusCode );

                // check the values
                for( var j=0; j<this.Response.Results[i].HistoryData.length; j++ ) {
                    var dataValue = nodeHistoryDataValues[j];
                    // check the value, timestamp, and quality matches 
                    if( !Assert.Equal( args.DataResults[i].DataValues[j], dataValue, "HistoryRead.Results[" + i + "].DataValues[" + j + "] not as expected." ) ) {
                        bSucceeded = false;
                    }

                    // check requested timestamps are returned
                    if( args.Request.TimestampsToReturn === TimestampsToReturn.Neither ) {
                        Assert.Equal( new UaDateTime(), dataValue.ServerTimestamp, "SERVER timestamp NOT expected." );
                        Assert.Equal( new UaDateTime(), dataValue.SourceTimestamp, "SOURCE timestamp NOT expected." );
                    }
                    else if( args.Request.TimestampsToReturn === TimestampsToReturn.Both ) {
                        Assert.NotEqual( new UaDateTime(), dataValue.ServerTimestamp, "Expected a SERVER timestamp." );
                        Assert.NotEqual( new UaDateTime(), dataValue.SourceTimestamp, "Expected a SOURCE timestamp." );
                    }
                    else if( args.Request.TimestampsToReturn === TimestampsToReturn.Server ) {
                        Assert.NotEqual( new UaDateTime(), dataValue.ServerTimestamp, "Expected a SERVER timestamp." );
                        Assert.Equal   ( new UaDateTime(), dataValue.SourceTimestamp, "SOURCE timestamp NOT expected." );
                    }
                    else if( args.Request.TimestampsToReturn === TimestampsToReturn.Source ) {
                        Assert.NotEqual( new UaDateTime(), dataValue.SourceTimestamp, "Expected a SOURCE timestamp." );
                        Assert.Equal   ( new UaDateTime(), dataValue.ServerTimestamp, "SERVER timestamp NOT expected." );
                    }

                    // check the source timestamp is in range and in order
                    if( args.Request.TimestampsToReturn === TimestampsToReturn.Both || args.Request.TimestampsToReturn === TimestampsToReturn.Source ) {
                        var fromTime = args.Request.HistoryReadDetails.StartTime;
                        var toTime = args.Request.HistoryReadDetails.EndTime;
                        if( fromTime > toTime ) {
                            fromTime = args.Request.HistoryReadDetails.EndTime;
                            toTime = args.Request.HistoryReadDetails.StartTime;
                        }
                        if( Assert.InRange( fromTime, toTime, dataValue.SourceTimestamp, "SourceTimestamp is out of range" ) ) {
                            if( args.Request.HistoryReadDetails.StartTime < args.Request.HistoryReadDetails.StartTime ) if( dataValue.SourceTimestamp < lastTime ) addError( "SourceTimestamp is out of order. Previous timestamp: " + lastTime + "; Current timestamp: " + dataValue.SourceTimestamp );
                            else if( dataValue.SourceTimestamp > lastTime ) addError( "SourceTimestamp is out of order. Previous timestamp: " + lastTime + "; Current timestamp: " + dataValue.SourceTimestamp );
                            lastTime = dataValue.SourceTimestamp;
                        }
                    }                    
                    // check the server timestamp is not too old (or too new)
                    if( args.Request.TimestampsToReturn === TimestampsToReturn.Both || args.Request.TimestampsToReturn === TimestampsToReturn.Server ) {
                        var serverTime = currentTime.clone();
                        // timestamp should not be in the future
                        if( serverTime.msecsTo( dataValue.ServerTimestamp ) > timeTolerence ) {
                            addError( "ServerTimestamp is in the future: " + dataValue.ServerTimestamp + ". Current time on the server = " + serverTime );
                            bSucceeded = false;
                        }
                        // timestamp should not be too old
                        if( dataValue.ServerTimestamp.msecsTo( serverTime ) > timeTolerence ) {
                            addLog( "Current time on the server = " + serverTime + "; ServerTimestamp = " + dataValue.ServerTimestamp );
                            addError( "ServerTimestamp is too old: Age of ServerTimestamp = " + dataValue.ServerTimestamp.msecsTo( serverTime ) );
                            bSucceeded = false;
                        }
                    }
                } // for j... */
            }// for i...
        }
        return bSucceeded;
    }// this.CheckHistoryReadValidParameter = function( args )

    /* Finds and returns the 'HAConfiguration' object for one or more specified NodeIds.
       Parameters: 
           Session: the 'Test.Session.Session' object
           NodeIds: an array of 'MonitoredItem' objects; each will seek an 'HAConfiguration' object.
           TranslateBrowsePathsToNodeIdsHelper: a reference to the service helper
           ReadHelper: a reference to the service helper
           */
    this.GetHAConfiguration = function( args ) { 
        if( !isDefined( args ) ) throw( "HistoryRead.GetHAConfiguration() args not specified." );
        if( !isDefined( args.Session ) ) throw( "HistoryRead.GetHAConfiguration() args.Session not specified." );
        if( !isDefined( args.NodeIds ) ) throw ("HistoryRead.GetHAConfiguration() args.NodeIds not specified." );
        if( !isDefined( args.NodeIds.length ) ) args.NodeIds = [ args.NodeIds ];
        if( !isDefined( args.TranslateBrowsePathsToNodeIdsHelper ) ) throw( "HistoryRead.GetHAConfiguration() args.TranslateBrowsePathsToNodeIdsHelper not specified." );
        if( !isDefined( args.ReadHelper ) ) throw( "HistoryRead.GetHAConfiguration() args.ReadHelper not specified." );
        var attributes = [
            [ "HA Configuration", "Definition" ],
            [ "HA Configuration", "ExceptionDeviation" ],
            [ "HA Configuration", "ExceptionDeviationFormat" ],
            [ "HA Configuration", "MaxTimeInterval" ],
            [ "HA Configuration", "MinTimeInterval" ],
            [ "HA Configuration", "StartOfArchive" ],
            [ "HA Configuration", "StartOfOnlineArchive" ],
            [ "HA Configuration", "Stepped" ],
            [ "HA Configuration", "AggregateConfiguration", "PercentDataBad" ],
            [ "HA Configuration", "AggregateConfiguration", "PercentDataGood" ],
            [ "HA Configuration", "AggregateConfiguration", "TreatUncertainAsBad" ],
            [ "HA Configuration", "AggregateConfiguration", "UseSlopedExtrapolation" ] ];
        var startOfOnlineArchiveNodeId;
        var nodeIds = MonitoredItem.toNodeIds( args.NodeIds );
        var tbBrowsePaths = [];
        for( var n=0; n<nodeIds.length; n++ ) {
            for( var i=0; i< attributes.length; i++ ) {
                tbBrowsePaths.push( UaBrowsePath.New( { 
                        StartingNode: nodeIds[n],
                        RelativePathStrings: attributes[i] } ) );
            }
        }
        if( args.TranslateBrowsePathsToNodeIdsHelper.Execute( { UaBrowsePaths: tbBrowsePaths } ) ) {
            // read the entire structure; do by getting NodeIds of all attributes, and then reading them.
            startOfOnlineArchiveNodeId = args.TranslateBrowsePathsToNodeIdsHelper.Response.Results[0].Targets[0].TargetId.NodeId;
            nodeIds = [];
            for( var r=0; r<args.TranslateBrowsePathsToNodeIdsHelper.Response.Results.length; r++ ) {
                nodeIds.push( MonitoredItem.fromNodeIds(args.TranslateBrowsePathsToNodeIdsHelper.Response.Results[r].Targets[0].TargetId.NodeId )[0] );
            }
            // if translate was successful, return an object that matches the HAConfiguration object
            if( args.ReadHelper.Execute( { NodesToRead: nodeIds, SuppressMessaging: true } ) ) {
                var haConfigs = [];
                var index=0;
                for( var i=0; i<args.NodeIds.length; i++ ) {
                    var haConfig = { toString: function(){ return( 
                            "[HAConfiguration] Definition: " + this.Definition.Value + 
                            "; ExceptionDeviation: " + this.ExceptionDeviation.Value + 
                            "; ExceptionDeviationFormat: " + this.ExceptionDeviationFormat.Value +
                            "; MaxTimeInterval: " + this.MaxTimeInterval.Value +
                            "; MinTimeInterval: " + this.MinTimeInterval.Value + 
                            "; StartOfArchive: " + this.StartOfArchive.Value +
                            "; StartOfOnlineArchive: " + this.StartOfOnlineArchive.Value + 
                            "; Stepped: " + this.Stepped.Value ); } };
                    for( var a=0; a<attributes.length; a++ ) {
                        var attrFQName = attributes[a].join();
                        switch( attrFQName ) {
                            case "HA Configuration,Definition": haConfig.Definition = nodeIds[index++].Value; break;
                            case "HA Configuration,ExceptionDeviation": haConfig.ExceptionDeviation = nodeIds[index++].Value; break;
                            case "HA Configuration,ExceptionDeviationFormat": haConfig.ExceptionDeviationFormat = nodeIds[index++].Value; break;
                            case "HA Configuration,MaxTimeInterval": haConfig.MaxTimeInterval = nodeIds[index++].Value; break;
                            case "HA Configuration,MinTimeInterval": haConfig.MinTimeInterval = nodeIds[index++].Value; break;
                            case "HA Configuration,StartOfArchive": haConfig.StartOfArchive = nodeIds[index++].Value; break;
                            case "HA Configuration,StartOfOnlineArchive": haConfig.StartOfOnlineArchive = nodeIds[index++].Value; break;
                            case "HA Configuration,Stepped": haConfig.Stepped = nodeIds[index++].Value; break;
                            case "HA Configuration,AggregateConfiguration,PercentDataBad": haConfig.AggregateConfiguration = {PercentDataBad: nodeIds[index++].Value }; break;
                            case "HA Configuration,AggregateConfiguration,PercentDataGood": haConfig.AggregateConfiguration = {PercentDataGood: nodeIds[index++].Value}; break;
                            case "HA Configuration,AggregateConfiguration,TreatUncertainAsBad": haConfig.AggregateConfiguration = {TreatUncertainAsBad: nodeIds[index++].Value}; break;
                            case "HA Configuration,AggregateConfiguration,UseSlopedExtrapolation": haConfig.AggregateConfiguration = {UseSlopedExtrapolation: nodeIds[index++].Value}; break;
                        }
                    }
                    args.NodeIds[i].HAConfiguration = haConfig;
                }//for i...
            }
        }
    }
}