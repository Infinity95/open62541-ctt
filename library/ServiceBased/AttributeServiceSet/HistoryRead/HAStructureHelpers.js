/* All functions within this script exist to create new instances of core script library objects
   in as little as one line of code.
   Helper functions available:

    - UaAggregateConfiguration.New( useDefaults, uncertainAsBad, percentBad, percentGood, useSloped )
    - UaAggregateFilter.New( startTime, aggregateType, processingInterval, aggregateConfig )
    - UaAnnotation.New( message, username, time )
    - UaDataValue.New( value, sourceTimestamp, serverTimestamp, statusCode )
    - UaDeleteAtTimeDetails.New( nodeId, times )
    - UaDeleteEventDetails.New( eventIds, nodeId )
    - UaDeleteRawModifiedDetails.New( nodeId, isDeleteModified, startTime, endTime )
    - UaHistoryData.New( dataValues )
    - UaHistoryEventFieldList.New( eventFields )
    - UaHistoryReadResult.New(...)
    - UaHistoryUpdateDetails.New( nodeId )
    - UaModificationInfo.New( time, type, username )
    - UaReadRawModifiedDetails.New( isReadModified, startTime, endTime, numValuesPerNode, returnBounds )
    - UaReadEventDetails.New( numValuesPerNode, startTime, endTime, filter )
    - UaReadProcessedDetails.New( startTime, endTime, resampleInterval, aggregateType, aggregateConfiguration )
    - UaReadAtTime.New( times )
    - UaReadEventDetails.New( numValuesPerNode, startTime, endTime, filter )
    - UaReadProcessedDetails.New( startTime, endTime, resampleInterval, aggregateType, aggregateConfiguration )
    - UaUpdateDataDetails.New( nodeId, performInsert, values )
    - UaUpdateEventDetails.New( nodeId, performInsert, filter, eventData )
    - UaUpdateStructureDataDetails.New( nodeId, performInsert, values )
*/

// Returns a UaAggregateConfiguration structure.
// Parameters are in the same order as defined in UA Spec Part 13.
// UseDefaults, UncertainAsBad, PercentBad, PercentGood, UseSloped
UaAggregateConfiguration.New = function( args ) {
    if( !isDefined( args ) ) args = new Object();
    var uaObj = new UaAggregateConfiguration();
    if( isDefined( args.UseDefaults ) ) uaObj.UseServerCapabilitiesDefaults = args.UseDefaults; else uaObj.UseServerCapabilitiesDefaults = true;
    if( isDefined( args.TreatUncertainAsBad ) ) uaObj.TreatUncertainAsBad = args.TreatUncertainAsBad; else uaObj.TreatUncertainAsBad = true;
    if( isDefined( args.PercentDataBad ) )  uaObj.PercentDataBad = args.PercentDataBad; else uaObj.PercentDataBad = 0;
    if( isDefined( args.PercentDataGood ) ) uaObj.PercentDataGood = args.PercentDataGood; else uaObj.PercentDataGood = 0;
    if( isDefined( args.UseSlopedExtrapolation ) ) uaObj.UseSlopedExtrapolation = args.UseSlopedExtrapolation; else uaObj.UseSlopedExtrapolation = true;
    uaObj.Name = "AggregateConfiguration";
    uaObj.toString = function() {
        return( "AggregateConfiguration: UseDefaults=" + uaObj.UseDefaults + "; TreatUncertainAsBad=" + uaObj.TreatUncertainAsBad + 
                "; PercentBad=" + uaObj.PercentBad + "; PercentGood=" + uaObj.PercentGood + "; UseSlopedExtrapolation=" + uaObj.UseSlopedExtrapolation );
    }
    return( uaObj );
}// function GetAggregateConfiguration( args )


// Returns a UaAggregateFilter structure.
// Parameters are in the same order as defined in UA Spec Part 13.
// "aggregateConfig" parameter value should come from calling "GetUaAggregateConfiguration()" (above)
UaAggregateFilter.New = function( args ) {
    if( !isDefined( args ) ){ throw( "GetAggregateFilter requires a parameter!" ); }
    if( !isDefined( [ args.StartTime, args.AggregateType, args.ProcessingInterval, args.AggregateConfig ] ) ){ throw( "GetUaAggregateFilter.args: one or more sub-arguments missing." ); }
    // create the object
    var uaObj = new UaAggregateFilter();
    uaObj.StartTime = args.StartTime;
    uaObj.AggregateType = args.AggregateType;
    uaObj.ProcessingInterval = args.ProcessingInterval;
    uaObj.AggregateConfiguration = args.AggregateConfig;
    // return object
    uaObj.Name = "AggregateFilter"; // bypass poor javascript type detection
    return( uaObj );
}// function GetAggregateFilter( args )


// Returns a UaAnnotation structure.
// Parameters are in the same order as defined in UA Spec Part 11.
UaAnnotation.New = function( args ) {
    if( !isDefined( args ) ){ throw( "GetAnnotation requires a parameter!" ); }
    if( !isDefined( [ args.Message, args.Username, args.Time] ) ){ throw( "GetUaAnnotation.args: one or more sub-arguments missing." ); }
    // create the object
    var uaObj = new UaAnnotation();
    uaObj.Message = args.Message;
    uaObj.UserName  = args.Username;
    uaObj.AnnotationTime = args.Time;
    // return object
    uaObj.Name = "Annotation"; // bypass poor javascript type detection
    return( uaObj );
}// function GetAnnotation( args )


// Update values sent in a HistoryUpdate call (HistoryUpdate.Request.HistoryUpdateDetails)
UaDataValue.New = function( args ) {
    var uadv = new UaDataValue();
    if( isDefined( args ) ) {
        if( isDefined( args.Timestamps ) ) {
            uadv.ServerTimestamp = args.Timestamps;
            uadv.SourceTimestamp = args.Timestamps; }
        else {
            if( isDefined( args.ServerTimestamp ) ) uadv.ServerTimetamp = args.ServerTimestamp;
            if( isDefined( args.SourceTimestamp ) ) uadv.SourceTimestamp = args.SourceTimestamp;
        }
        if( isDefined( args.StatusCode ) ) uadv.StatusCode.StatusCode = args.StatusCode;
        if( isDefined( args.Value ) ) {
            if( isDefined( args.Value.Value ) ) uadv.Value = args.Value.Value;
            else uadv.Value = args.Value;
        }
    }
    uadv.toString = function() {
        return( "Value=" + this.Value.toString() + "; StatusCode=" + this.StatusCode.toString() +
            "; SourceTimestamp= " + this.SourceTimestamp + "; ServerTimestamp=" + this.ServerTimestamp );
    };
    return( uadv );
}// UaDataValue.New = function( args )


// Returns a UaDeleteAtTimeDetails structure.
// Parameters are in the same order as defined in UA Spec Part 11.
UaDeleteAtTimeDetails.New = function( args ) {
    if( !isDefined( args ) ){ throw( "GetDeleteAtTimeDetails requires a parameter!" ); }
    if( !isDefined( [ args.NodeId, args.ReqTimes ] ) ){ throw( "GetUaDeleteAtTimeDetails.args: one or more required sub-arguments missing." ); }
    // create the object
    var uaObj = new UaDeleteAtTimeDetails();
    uaObj.NodeId = args.NodeId;
    if( isDefined( args.ReqTimes.name ) ) uaObj.ReqTimes = args.ReqTimes;
    else for( var i=0; i<args.ReqTimes.length; i++ ) uaObj.ReqTimes[i] = args.ReqTimes[i];
    // return object
    uaObj.Name = "DeleteAtTimeDetails"; // bypass poor javascript type detection
    uaObj.ToExtensionObject = function() {
        var extObj = new UaExtensionObject();
        extObj.setDeleteAtTimeDetails( this );
        return( extObj );
    }
    return( uaObj );
}// function GetDeleteAtTimeDetails( args )
UaDeleteAtTimeDetails.Validate = function( args ) {
    if( !UaNodeId.Validate( this.NodeId ) ) { addError( "DeleteAtTimeDetails.NodeId invalid." ); return( false ); }
    if( this.ReqTimes.length === 0 ) { addError( "DeleteAtTimeDetails.ReqTimes empty." ); return( false ); }
    return( true );
}


// Returns a UaDeleteAtTimeDetails structure.
// Parameters are in the same order as defined in UA Spec Part 11.
UaDeleteEventDetails.New = function( args ) {
    if( !isDefined( args ) ){ throw( "GetDeleteEventDetails requires a parameter!" ); }
    if( !isDefined( [ eventIds, nodeId ] ) ){ throw( "GetDeleteEventDetails.times missing." ); }
    // create the object
    var uaObj = new UaDeleteEventDetails();
    uaObj.EventIds = args.EventIds;
    uaObj.NodeId = args.NodeId;
    // return object
    uaObj.Name = "DeleteEventDetails"; // bypass poor javascript type detection
    return( uaObj );
}// function GetDeleteEventDetails( args )
UaDeleteEventDetails.Validate = function( args ) { 
    if( !UaNodeId.Validate( this.NodeId ) ) { addError( "DeleteEventDetails.NodeId invalid." ); return( false ); }
    return( true );
}


// Helper function to assist with the creation of a ReadDeleteRawModifiedDetails object.
UaDeleteRawModifiedDetails.New = function( args ) {
    // validate parameters
    if( !isDefined( args ) ){ throw( "GetDeleteRawModifiedDetails: arguments not specified!" ); }
    if( !isDefined( [ args.NodeId, args.IsDeleteModified, args.StartTime, args.EndTime ] ) ){ throw( "GetDeleteRawModifiedDetails.endTime is missing." ); }
    // create the object
    var uaObj = new UaDeleteRawModifiedDetails();
    uaObj.IsDeleteModified = args.IsDeleteModified;
    uaObj.StartTime = args.StartTime;
    uaObj.EndTime = args.EndTime;
    if( isDefined( args.NodeId.NodeId ) ) uaObj.NodeId = args.NodeId.NodeId;
    else uaObj.NodeId = args.NodeId;
    // return object
    uaObj.Name = "DeleteRawModifiedDetails"; // bypass poor javascript type detection
    uaObj.toString = function( args ) {
        var s = "StartTime=" + uaObj.StartTime + "; EndTime=" + uaObj.EndTime + "; IsDeleteModified=" + uaObj.IsDeleteModified + "; NodeId: " + uaObj.NodeId;
        if( isDefined( args ) && isDefined( args.Indent ) ) s = s.split( "; " ).join().indent( args.Indent );
        return( s );
    }
    uaObj.ToExtensionObject = function() {
        var extObj = new UaExtensionObject();
        extObj.setDeleteRawModifiedDetails( this );
        return( extObj );
    }
    return( uaObj );
}// UaDeleteRawModifiedDetails.New = function( args )
UaDeleteRawModifiedDetails.Validate = function( args ){ return( true ); }


UaHistoryModifiedData = {
    Validate: function( args ) { 
        if( this.DataValues.length === 0 ) { addError( "HistoryModifiedData.DataValues is empty." ); return( false ); }
        if( this.ModificationInfos.length === 0 ) { addError( "HistoryModifiedData.ModificationInfos is empty." ); return( false ); }
        for( var i=0; i<this.ModificationInfos.length; i++ ) if( !HistoryUpdateType.Validate( this.ModificationInfos[i].UpdateType ) ) return( false );
        return( true );
    }
}


// Helper function to assist with the creation of a HistoryEventFieldList object.
UaHistoryEventFieldList.New = function( args ) {
    // validate parameters
    if( !isDefined( args ) ){ throw( "GetHistoryEventFieldList: arguments not specified!" ); }
    if( !isDefined( eventFields) ){ throw( "GetHistoryEventFieldList.eventFields missing." ); }
    // create the object
    var uaObj = new UaHistoryEventFieldList();
    uaObj.EventFields = args.EventFields;
    // return object
    uaObj.Name = "HistoryEventFieldList"; // bypass poor javascript type detection
    return( uaObj );
}// function GetHistoryEventFieldList( args )


// Creates a new HistoryUpdate request.
UaHistoryUpdateRequest.New = function( args ) {
    var r = new UaHistoryUpdateRequest();
    if( isDefined( args ) ) {
        // to do: (1) create ExtensionObjects(); fill each with specific update 
        if( !isDefined( args.length ) ) args = [ args ];
        var updateCollection = new UaExtensionObjects();
        for( var i=0; i<args.length; i++ ) {
            updateCollection[i] = args[i].ToExtensionObject();
        }//for i
        r.HistoryUpdateDetails = updateCollection;
    }
    return( r );
}


UaHistoryReadResult.New = function( args ) {
    var r = new UaHistoryReadResult();
    if( isDefined( args.ContinuationPoint ) ) r.ContinuationPoint = args.ContinuationPoint;
    if( isDefined( args.StatusCode ) ) r.StatusCode.StatusCode = args.StatusCode;
    if( isDefined( args.HistoryData ) ){
        // is the HistoryData an ExtensionObject? if so then handle it differently...
        if( isDefined( args.HistoryData.TypeId ) ) r.HistoryData.setHistoryData( args.HistoryData );
        else r.HistoryData.setHistoryData( UaHistoryData.New( { DataValues: args.HistoryData } ) );
    }
    return( r );
}


UaHistoryData.New = function( args ) {
    var result = new UaHistoryData();
    if( !isDefined( args ) ) return( result );
    if( isDefined( args.DataValues ) ) {
        if( !isDefined( args.DataValues.length ) ) args.DataValues = [ args.DataValues ];
        for( var i=0; i<args.DataValues.length; i++ ) result.DataValues[i] = args.DataValues[i];
    }
    return( result );
}


UaHistoryReadRequest.New = function( args ) {
    var r = new UaHistoryReadRequest();
    if( isDefined( args ) ) {
        switch( args.HistoryReadDetails.Name ) {
            case "ReadRawModifiedDetails": r.HistoryReadDetails.setReadRawModifiedDetails( args.HistoryReadDetails ); break;
            case "ReadEventDetails": r.HistoryReadDetails.setReadEventDetails( args.HistoryReadDetails ); break;
            case "ReadProcessedDetails": r.HistoryReadDetails.setReadProcessedDetails( args.HistoryReadDetails ); break;
            case "ReadAtTimeDetails": r.HistoryReadDetails.setReadAtTimeDetails( args.HistoryReadDetails ); break;
            default: throw( "HistoryRead.Execute() Unsupported HistoryReadDetails parameter: '" + args.HistoryReadDetails.Name + "'." );
        }
        if( !isDefined( args.NodesToRead.length ) ) args.NodesToRead = [ args.NodesToRead ];
        for( var m=0; m<args.NodesToRead.length; m++ ) {
            r.NodesToRead[m].NodeId = args.NodesToRead[m].NodeId;
            if( isDefined( args.NodesToRead[m].IndexRange ) && args.NodesToRead[m].IndexRange.length > 0 ) r.NodesToRead[m].IndexRange = args.NodesToRead[m].IndexRange;
            if( isDefined( args.NodesToRead[m].ContinuationPoint && args.NodesToRead[m].ContinuationPoint.length > 0 ) ) r.NodesToRead[m].ContinuationPoint = args.NodesToRead[m].ContinuationPoint;
        }// for m...
        r.ReleaseContinuationPoints = args.ReleaseContinuationPoints;
        r.TimestampsToReturn = args.TimestampsToReturn;
    }
    return( r );
}
UaHistoryReadRequest.toString = function( args ) {
    return( "NodesToRead: " + args.NodesToRead.length + 
        "; ReleaseContinuationPoints: " + args.ReleaseContinuationPoints +
        "; TimestampsToReturn: " + TimestampsToReturn.toString( args.TimestampsToReturn ) +
        "; HistoryReadDetails: omitted" );
}


UaHistoryReadResponse.toString = function( args ) {
    return( "DiagnosticInfos: " + args.DiagnosticInfos.length +
        "; Results: " + args.Results.length );
}

// Validates the results and compares to expectations, if specified
UaHistoryUpdateResult.Validate = function( args ) { 
    if( !isDefined( args ) ) throw( "UaHistoryUpdateResult:Validate(), args not specified." );
    if( !isDefined( [ args.DiagnosticInfos, args.OperationResults, args.StatusCode ] ) ) throw( "UaHistoryUpdateResult:Validate() incorrect object type specified." );
    // diagnostic info - ignored for now
    // statuscode 
    var result = true;
    if( isDefined( args.ExpectedResults ) ) result = Assert.StatusCodeIs( args.ExpectedResults, args.StatusCode );
    else Assert.True( args.StatusCode.isGood() );
    //operation results 
    if( isDefined( args.ExpectedResults ) ) {
        if( Assert.Equal( args.ExpectedResults.length, args.OperationResults.length, "Expected length does not match received length." ) ) {
            for( var i=0; i<args.OperationResults.length; i++ ) {
                if( !Assert.Equal( args.ExpectedResults[i], args.OperationResults[i], "Result[" + i + "] expected " + args.ExpectedResults[i].toString() + " but received " + args.OperationResults[i].toString() ) ) result = false;
            }
        }
        else result = false;
    }
    else for( var i=0; i<args.OperationResults.length; i++ ) {
        if( !Assert.True( args.OperationResults[i].isGood(), "OperationResults[" + i + "] is not Good. Result=" + args.OperationResults[i].toString() ) ) result = false;
    }
    return( result );
}

// Helper function to assist with the creation of a ModificationInfo object.
UaModificationInfo.New = function( args ) {
    // validate parameters
    if( !isDefined( args ) ){ throw( "GetModificationInfo: arguments not specified!" ); }
    if( !isDefined( [ args.Time, args.Type, args.Username ] ) ){ throw( "GetModificationInfo.username missing." ); }
    // create the object
    var uaObj = new UaModificationInfo();
    uaObj.ModificationTime = args.Time;
    uaObj.UpdateType = args.Type;
    uaObj.UserName = args.Username;
    // return object
    uaObj.Name = "ModificationInfo"; // bypass poor javascript type detection
    return( uaObj );
}// function GetModificationInfo( args )


UaReadAtTimeDetails.New = function( args ) {
    if( !isDefined( args ) ) args = new Object();
    if( isDefined( args.Times ) ) args.ReqTimes = args.Times;
    var uaObj = new UaReadAtTimeDetails();
    try{ uaObj.ReqTimes = args.Times; } catch( e ) { 
        for( var t=0; t<args.ReqTimes.length; t++ ) 
        uaObj.ReqTimes[t] = args.ReqTimes[t]; 
    }
    uaObj.Name = "ReadAtTimeDetails"; // bypass poor javascript type detection
    return( uaObj );
}// UaReadAtTimeDetails.New = function( args )
UaReadAtTimeDetails.Validate = function( args ) { return( this.ReqTimes.length > 0 ); }



UaReadEventDetails.New = function( args ) {
    if( !isDefined( args ) ){ throw( "GetReadEventDetails: arguments not specified!" ); }
    if( !isDefined( [ args.NumValuesPerNode, args.StartTim, args.EndTime, args.Filter ] ) ){ throw( "GetReadEventDetails.filter is missing." ); }
    // create the object
    var uaObj = newUaReadEventDetails();
    uaObj.NumValuesPerNode = args.NumValuesPerNode;
    uaObj.StartTime = args.StartTime;
    uaObj.EndTime = args.EndTime;
    uaObj.Filter = args.Filter;
    // return object
    uaObj.Name = "ReadEventDetails"; // bypass poor javascript type detection
    return( uaObj );
}// function GetReadEventDetails( args )


// Helper function to return ReadProcessedDetails structure
UaReadProcessedDetails.New = function( args ) {
    if( !isDefined( args ) ) args = new Object();
    var uaObj = UaReadProcessedDetails();
    if( isDefined( args.StartTime ) ) uaObj.StartTime = args.StartTime;
    if( isDefined( args.EndTime ) ) uaObj.EndTime = args.EndTime;
    if( isDefined( args.ProcessingInterval ) ) uaObj.ProcessingInterval = args.ProcessingInterval;
    if( isDefined( args.AggregateType ) ) uaObj.AggregateType[0] = args.AggregateType;
    else if( isDefined( args.AggregateTypes ) ) oaObj.AggregateType = args.AggregateTypes;
    if( isDefined( args.AggregateConfiguration ) ) uaObj.AggregateConfiguration = args.AggregateConfiguration;
    else {
        uaObj.AggregateConfiguration.UseServerCapabilitiesDefaults = true;
        uaObj.AggregateConfiguration.TreatUncertainAsBad = true;
        uaObj.AggregateConfiguration.UseSlopedExtrapolation = true;
    }
    uaObj.Name = "ReadProcessedDetails"; // bypass poor javascript type detection
    return( uaObj );
}// function GetReadProcessedDetails( args )
UaReadProcessedDetails.Validate = function( args ){ 
    if( this.AggregateType.length === 0 ) { addError( "ReadProcessedDetails.AggregateType is empty." ); return( false ); }
}


/* Helper function to assist with the creation of a ReadRawModifiedDetails object.
    Parameters:
        - IsReadModified
        - StartTime
        - EndTime
        - NumValuesPerNode
        - ReturnBounds
*/
UaReadRawModifiedDetails.New = function( args ) {
    // validate parameters
    if( !isDefined( args ) ){ throw( "GetReadRawModifiedDetails: arguments not specified!" ); }
    if( !isDefined( [ args.IsReadModified, args.StartTime, args.EndTime, args.NumValuesPerNode, args.ReturnBounds ] ) ){ throw( "GetReadRawModifiedDetails.arguments: one or more sub-arguments is missing." ); }
    // create the object
    var uaObj = new UaReadRawModifiedDetails();
    uaObj.IsReadModified   = args.IsReadModified;
    uaObj.StartTime        = args.StartTime;
    uaObj.EndTime          = args.EndTime;
    uaObj.NumValuesPerNode = args.NumValuesPerNode;
    uaObj.ReturnBounds     = args.ReturnBounds;
    // return object
    uaObj.Name = "ReadRawModifiedDetails"; // bypass poor javascript type detection
    uaObj.toString = function( args ) {
        var s = "[" + this.Name + "]; StartTime=" + uaObj.StartTime + "; EndTime=" + uaObj.EndTime + "; NumValuesPerNode=" + uaObj.NumValuesPerNode + "; ReturnBounds=" + uaObj.ReturnBounds + "; IsReadModified=" + uaObj.IsReadModified;
        if( isDefined( args ) && isDefined( args.Indent ) ) s = s.replace( /; /g, "\n" ).indent( args.Indent );
        return( s );
    }
    uaObj.Name = "ReadRawModifiedDetails";
    return( uaObj );
}// UaReadRawModifiedDetails.New = function( args )
UaReadRawModifiedDetails.Validate = function( args ) { return( true ); }


// Creates a new UaUpdateDataDetails object
UaUpdateDataDetails.New = function( args ) {
    var uaObj = new UaUpdateDataDetails();
    if( isDefined( args ) ) {
        if( isDefined( args.NodeId ) ) {
            if( isDefined( args.NodeId.NodeId ) ) uaObj.NodeId = args.NodeId.NodeId;
            else uaObj.NodeId = args.NodeId;
        }
        if( isDefined( args.PerformInsertReplace ) ) uaObj.PerformInsertReplace = args.PerformInsertReplace; else uaObj.PerformInsertReplace = PerformUpdateType.Replace;
        if( isDefined( args.UpdateValues ) ) {
            if( !isDefined( args.UpdateValues.length ) ) args.UpdateValues = [ args.UpdateValues ];
            for( var i=0; i<args.UpdateValues.length; i++ ) uaObj.UpdateValues[i] = args.UpdateValues[i];
        }//for i
    }
    uaObj.ToExtensionObject = function() {
        var extObj = new UaExtensionObject();
        extObj.setUpdateDataDetails( this );
        return( extObj );
    }
    uaObj.toString = function() {
        var s = "UpdateDataDetails\n\tNodeId: " + uaObj.NodeId + "\n\tPerformInsertReplace: " + uaObj.PerformInsertReplace +
            "\n\tUpdateValues: [" + uaObj.UpdateValues.length + "]";
        for( var i=0; i<uaObj.UpdateValues.length; i++ ) s += "\n\t\t" + uaObj.UpdateValues[i].toString();
        return( s );
    }
    uaObj.Name = "UpdateDataDetails";
    return( uaObj );
}// UaHistoryUpdateDetails.New = function()


UaUpdateDataDetails.Validate = function( args ) {
    if( !UaNodeId.Validate( this.NodeId ) ) { addError( "UpdateDataDetails.NodeId invalid: '" + this.NodeId + "'." ); return( false ); }
    if( !PerformUpdateType.Validate( this.PerformInsertReplace ) ) { addError( "UpdateDataDetails.PerformInsertReplace not valid: '" + this.PerformInsertReplace + "'." ); return( false ); }
    if( this.UpdateValues.length === 0 ) { addError( "UpdateDataDetails.UpdateValues empty." ); return( false ); }
}


// Helper function to return UpdateEventDetails structure
UaUpdateEventDetails.New = function( args ) {
    if( !isDefined( args ) ){ throw( "GetUpdateEventDetails: argument missing." ); }
    if( !isDefined( [ args.NodeId, args.PerformInsert, args.Filter, args.EventData ] ) ){ throw( "GetUpdateEventDetails.args: one or more arguments is missing." ); }
    // create the object
    var uaObj = UaUpdateDataDetails();
    uaObj.NodeId = args.NodeId;
    uaObj.PerformInsertReplace = args.PerformInsert;
    uaObj.Filter = args.Filter;
    uaObj.EventData = args.EventData;
    // return object
    uaObj.Name = "UpdateEventDetails"; // bypass poor javascript type detection
    return( uaObj );
}// function GetUpdateEventDetails( args ) 
UaUpdateEventDetails.Validate = function( args ) {
    if( !UaNodeId.Validate( this.NodeId ) ) { addError( "UpdateEventDetails NodeId invalid." ); return( false ); }
    if( !PerformUpdateType.Validate( args.PerformInsertReplace ) ) { addError( "UpdateEventDetails.PerfomInsertReplace invalid: '" + this.PerformInsertReplace + "'." ); return( false ); }
    if( this.EventData.length === 0 ) { addError( "UpdateEventDetails.EventData empty." ); return( false ); }
}


// Helper function to return UpdateStructureDataDetails structure
UaUpdateStructureDataDetails.New = function( args ) {
    if( !isDefined( args ) ){ throw( "GetUpdateStructureDataDetails is missing arguments!" ); }
    if( !isDefined( [ args.NodeId, args.PerformInsertargs. Values ] ) ){ throw( "GetUpdateStructureDataDetails args: one or more parameters missing: NodeId, PerformInsertReplace, DataValues." ); }
    // create the object
    var uaObj = UaUpdateStructureDataDetails();
    uaObj.NodeId = args.NodeId;
    uaObj.PerformInsertReplace = args.PerformInsert;
    uaObj.UpdateValues = args.Values;
    // return object
    uaObj.Name = "UpdateStructureDataDetails"; // bypass poor javascript type detection
    return( uaObj );
}// UaUpdateStructureDataDetails.New = function( args )
UaUpdateStructureDataDetails.Validate = function( args ){
    if( !UaNodeId.Validate( this.NodeId ) ) { addError( "UpdateStructureDataDetails.NodeId invalid: '" + this.NodeId + "'." ); return( false ); }
    if( !PerformUpdateType.Validate( this.PerformInsertReplace ) ) { addError( "UpdateStructureDataDetails.PerformUpdateType invalid: '" + this.PerformUpdateType + "'." ); return( false ); }
    if( this.UpdateValue.length === 0 ) { addError( "UpdateStructureDataDetails.UpdateValue empty." ); return( false ); }
    return( true );
}// UaUpdateStructureDataDetails.Validate = function( args )