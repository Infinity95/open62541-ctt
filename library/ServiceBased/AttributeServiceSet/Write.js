include( "./library/Base/UaVariantToSimpleType.js" );
include( "./library/Base/serverCapabilities.js" );

/*    This class object is responsible for calling the Write() service and for also
      performing any validation etc. This is a quick-use class.

      See the bottom of this file for an example on using it.

        Functions include:
            function checkWriteError( Request, Response, ExpectedOperationResultsArray, ValidateValues, NodeSettings, checkNotSupported )
            function checkWriteFailed( Request, Response, ExpectedServiceResults )
            function checkWriteValidParameter( Request, Response, ValidateValues, NodeSettings, optionalCUCheckNotSupported, suppressMessaging ) */

function WriteService( args ) {
    this.Name = "Write";
    this.Session = null;
    this.Request = null;
    this.Response = null;
    this.writeSuccess = false;
    this.UaStatus = null;
    this.writeCalls = 0;

    if( !isDefined( args ) ) throw( this.Name + " CTOR, arguments not specified." );
    if( !isDefined( args.Session ) ) throw( this.Name + " CTOR, session not specified." );
    else this.Session = args.Session;



    /* Writes values.
          Parameters are: 
            - NodesToWrite 
            - ServiceResult
            - OperationResults
            - CheckNotSupported 
            - ReadVerification 
            - SuppressMessaging */
    this.Execute = function( args ) {
        if( !isDefined( args ) ){ throw( "write.js::Execut2() args not specified." ); }
        if( !isDefined( args.NodesToWrite ) ) args.NodesToWrite = [];
        if( !isDefined( args.NodesToWrite.length ) ) args.NodesToWrite = [ args.NodesToWrite ];
        if( !isDefined( args.ReadVerification ) ) args.ReadVerification = true;
        if(  isDefined( args.OperationResults ) && !isDefined( args.OperationResults.length ) ) args.OperationResults = [ args.OperationResults ];

        // register that this service is tested
        ServiceRegister.Register( { Service: ServiceRegister.UaService( { Name: this.Name, Available: true, Tested: true } ) } );

        var m, i;

        // define the write headers
        this.Request  = new UaWriteRequest();
        this.Response = new UaWriteResponse();
        var session = isDefined( this.Session.Session )? this.Session.Session : this.Session;
        this.Request.RequestHeader = UaRequestHeader.New( { Session: session } );

        for( m=0; m<args.NodesToWrite.length; m++ ) {
            this.Request.NodesToWrite[m].NodeId = args.NodesToWrite[m].NodeId;
            this.Request.NodesToWrite[m].AttributeId = args.NodesToWrite[m].AttributeId;
            this.Request.NodesToWrite[m].IndexRange  = args.NodesToWrite[m].IndexRange;
            if( isDefined( args.NodesToWrite[m].Value.Set ) ) {
                // value 
                if( args.NodesToWrite[m].Value.Set.toLowerCase().indexOf( "value" ) >= 0 ) this.Request.NodesToWrite[m].Value.Value = args.NodesToWrite[m].Value.Value;
                // quality 
                if( args.NodesToWrite[m].Value.Set.toLowerCase().indexOf( "statuscode" ) >= 0 ) this.Request.NodesToWrite[m].Value.StatusCode = args.NodesToWrite[m].Value.StatusCode;
                // source timestamp
                if( args.NodesToWrite[m].Value.Set.toLowerCase().indexOf( "sourcetimestamp" ) >= 0 ) this.Request.NodesToWrite[m].Value.SourceTimestamp = args.NodesToWrite[m].Value.SourceTimestamp;
                // server timestamp
                if( args.NodesToWrite[m].Value.Set.toLowerCase().indexOf( "servertimestamp" ) >= 0 ) this.Request.NodesToWrite[m].Value.ServerTimestamp = args.NodesToWrite[m].Value.ServerTimestamp;
            }
            else this.Request.NodesToWrite[m].Value.Value = args.NodesToWrite[m].Value.Value;
        }// for m...
        // issue the write
        if( isDefined( args.PreHook ) ) args.PreHook();
        this.UaStatus = session.write( this.Request, this.Response );
        if( isDefined( args.PostHook ) ) args.PostsHook();
        // increment the write call counter
        this.writeCalls++;
        // check result
        if( this.UaStatus.isGood() ) {
            result = UaResponseHeader.IsValid( { Service: this, ServiceResult: args.ServiceResult, SuppressMessaging: args.SuppressMessaging, SuppressErrors: args.SuppressErrors, ServiceInfo: "NodesToWrite #" + this.Request.NodesToWrite.length } );
            if( result ) {
                var settingNames = MonitoredItem.GetSettingNames( args.NodesToWrite );
                if( isDefined( args.OperationResults ) ) this.writeSuccess = checkWriteError( this.Request, this.Response, args.OperationResults, args.ReadVerification, settingNames, args.CheckNotSupported, session );
                else this.writeSuccess = ( checkWriteValidParameter( this.Request, this.Response, args.ReadVerification, settingNames, undefined, args.SuppressMessaging, session ) );
            }
        }
        else {
            addError( "Write() failed, status: " + this.UaStatus, this.UaStatus );
            this.writeSuccess = false;
        }
        if( !this.writeSuccess ) ServiceRegister.SetFailed( { Name: this.Name } )
        return( this.writeSuccess );
    };
    
    /* arguments:
        - NodesToVerify
    */
    this.VerifyWrittenValues = function( args ) {
        if( !isDefined( [ args, args.NodesToVerify ] ) ) throw( "write.js::VerifyWrittenValues() no arguments specified." );
        if( !isDefined( args.NodesToVerify.length ) ) args.NodesToVerify = [ args.NodesToVerify ];
        print( "VERIFYING written values." );
        var ReadHelper = new ReadService( { Session: this.session } );
        // first: clone the current values of each specified node, because these were probably previously written
        for( var i=0; i<args.NodesToVerify.length; i++ ) args.NodesToVerify[i].WrittenValue = args.NodesToVerify[i].Value.Value.clone();
        // now invoke the Read
        ReadHelper.Execute( { NodesToRead:args.NodesToVerify, TimestampsToReturn:TimestampsToReturn.Server, MaxAge:0 } );
        // now to compare each value read to the value previously cached/cloned
        var result = true;
        for( var i=0; i<args.NodesToVerify.length; i++ ) if( !Assert.Equal( args.NodesToVerify[i].WrittenValue, args.NodesToVerify[i].Value.Value, "Value verified does not match the value previously written." ) )result = false;
        // clean-up
        ReadHelper = null;
        return( result );
    }// this.VerifyWrittenValues = function( args ) 


    this.Clear = function() {
        this.uaStatus = null;
        this.writeCalls = 0;
    }

}


// Generates a string of a specific length.
// alternateString will provide an alternate string ONLY if no limits are specified for string values.
WriteService.GenerateString = function( args ) {
    var len = ( args !== undefined && args !== null && args.length !== null )? args.length : null ;
    if( len === undefined || len === null || len === 0 ) {
        var argsAsInt = parseInt( args );
        if( argsAsInt.toString() == "NaN" || argsAsInt < 0 ) {
            // since no length was provided, check the settings
            if( gServerCapabilities.MaxStringLength === 0 ) {
                // do we have an alternate?
                if( args !== undefined && args !== null && args.alternate !== undefined && args.alternate !== null ) {
                    // is the alternate within the bounds of the max length?
                    if( args.alternate.length < gServerCapabilities.MaxStringLength ) return( args.alternate );
                }
                else len = 10;
            }
            else {
                // we have a max length set, if we have alternate text provided already then 
                // check if it is within the bounds of the max size and if it is then we can return 
                // it; otherwise generate a new value.
                if( args !== undefined && args !== null && args.alternate !== undefined && args.alternate !== null ) if( args.alternate.length < gServerCapabilities.MaxStringLength ) return( args.alternate );
            }
        }
        else len = argsAsInt;
    }
    // now create a random string
    var s = "";
    var a = "abcdefghijklmnopqrstuvxyzABCDEFGHIJKLMNOPQRSTUVWXYZ`1234567890-=~!@#$%^&*()_+[]\{}|;':\",./<>?";
    for( i=0; i<len; i++ ) s += a[ parseInt( ( a.length * Math.random() ) ) ];
    return( s );
}





// the service is expected to succeed
// one, some or all operations are expected to fail
// This function checks if the server returned the expected error codes
// Request is of Type UaWriteRequest
// Response is of Type UaWriteResponse
// ExpectedOperationResultsArray is an array ExpectedAndAcceptedResult (defined in Base/Objects/expectedResults.js)
function checkWriteError( Request, Response, ExpectedOperationResultsArray, ValidateValues, NodeSettings, checkNotSupported, session ) {
    var success = true;
    // check in parameters
    if( arguments.length < 4 ) {
        addError( "function checkWriteError(Request, Response, ExpectedOperationResultsArray, ValidateValues): Number of arguments must be 4" );
        return( false );
    }
    if( !isDefined( ExpectedOperationResultsArray.length ) ) ExpectedOperationResultsArray = [ ExpectedOperationResultsArray ];
    // ExpectedOperationResultsArray needs to have the correct size
    if( ExpectedOperationResultsArray.length !== Request.NodesToWrite.length ) {
        addError( "function checkWriteError(): ExpectedOperationResultsArray[] (length: " + ExpectedOperationResultsArray.length + ") must have the same size as Request.NodesToWrite[] (length: " + Request.NodesToWrite.length + ")." );
        return( false );
    }
    var useSettings = false;
    if( NodeSettings !== undefined && NodeSettings !== null ) {
        if(  NodeSettings.length == Request.NodesToWrite.length ) useSettings = true;
    }
    // check results        
    // check number of results
    if( Response.Results.length !== Request.NodesToWrite.length ) {
        addError( "Write().Request.NodesToWriteService.length (" + Request.NodesToWrite.length + ") differs from Write().Results.length (" + Response.Results.length +")." );
        success = false;
    }
    else {
        // check each result
        for( var i=0; i<Response.Results.length; i++ ) {
            var errorMessage = "Write().Response.Results[" + i + "].StatusCode = '" + Response.Results[i] + "'";
            var bMatch = false;
            var j;
            // check if result matches any of the expected status code
            for( j=0; j<ExpectedOperationResultsArray[i].ExpectedResults.length; j++ ) {
                // check if the write result is NOT SUPPORTED
                if( checkNotSupported !== undefined && checkNotSupported !== null ) {
                    if( Response.Results[i].StatusCode === StatusCode.BadWriteNotSupported || Response.Results[i].StatusCode === StatusCode.BadNotSupported ) {
                        if( useSettings && NodeSettings[i] !== undefined && NodeSettings[i] !== null && NodeSettings[i].length > 0 ) errorMessage += " (Node Setting: '" + NodeSettings[i] + "')";
                        errorMessage += " Server indicated a lack of support for the requested write operation using Bad_WriteNotSupported.";
                        addNotSupported( errorMessage );
                        // fake the routine into saying we found what we're looking for
                        bMatch = true;
                        break;
                    }
                }
                if( Response.Results[i].StatusCode === ExpectedOperationResultsArray[i].ExpectedResults[j].StatusCode ) {
                    if( useSettings && NodeSettings[i] !== undefined && NodeSettings[i] !== null && NodeSettings[i] !== "" ) errorMessage += " (Node Setting: '" + NodeSettings[i] + "')";
                    errorMessage += " as expected.";
                    bMatch = true;
                    break;
                }
            }
            if( !bMatch ) {
                // check if result matches any of the accepted status codes
                for( j=0; j<ExpectedOperationResultsArray[i].AcceptedResults.length; j++ ) {
                    if( Response.Results[i].StatusCode === ExpectedOperationResultsArray[i].AcceptedResults[j].StatusCode ) {
                        bMatch = true;
                        break;
                    }
                }
                errorMessage += "; but StatusCode '" + ExpectedOperationResultsArray[i].ExpectedResults[0] + "' was expected";
                if( useSettings && NodeSettings[i] !== undefined && NodeSettings[i] !== null && NodeSettings[i].length > 0 ) errorMessage += " (Node Setting: '" + NodeSettings[i] + "')";
                if( bMatch ) addWarning( errorMessage, Response.Results[i] );
                else {
                    errorMessage += "\nStatusCode expectations for this call were...\n\t[" + i + "] " + ExpectedOperationResultsArray[i].toString();
                    addError( errorMessage, Response.Results[i] );
                    success = false;
                }
            }//if !match...
        }//for i...
        // read the written values and check if the value is the same
        if( ValidateValues ) compareWritesToRead( Request, Response, NodeSettings, session );
    }
    return( success );
}



/* Converts an array of Byte (byte[]) to a ByteString.
   Function based on work by Matthias Isele */
function byteArrayToByteString( byteArr ) {
    print( "ByteArray to convert: " + byteArr.toString() );
    var byteString = new UaByteString();
    var hexString = "0x"
    // check if empty
    if( byteArr.length <= 0 ) return( byteString.toHexString() );
    // not empty, so prepare the string
    for(var i=0; i<byteArr.length; i++) {
        var byteValue = byteArr[i];
        if( byteValue < 16 ) hexString += "0";
        hexString += byteValue.toString( 16 );
    }
    byteString = UaByteString.fromHexString( hexString );    
    return( byteString );
}

function charCodesStringToString( charCodeString ) {
    var plainString = "";
    for( var i=0; i<charCodeString.length; i += 2 ) plainString += String.fromCharCode( parseInt( charCodeString.substring( i, i + 2 ), 16 ) );
    return plainString;
}

function comparePartialStringWrittenToRead( jsWrittenValue, indexRange, jsReadValue, dataType ) {
    var success;
    // extract written characters from read String or ByteString
    var startIndex = parseInt( indexRange.match( /^[0-9]+/ ), 10 );
    var endIndex = parseInt( indexRange.match( /[0-9]+$/ ), 10 );
    if( dataType === BuiltInType.String ) {
        success = Assert.GreaterThan( endIndex, jsReadValue.length, "String was too short: written size was greater than read size" );
        jsReadValue = jsReadValue.substring( startIndex, endIndex + 1 );
    }
    else if( dataType === BuiltInType.ByteString ) {
        success = Assert.GreaterThan( endIndex, jsReadValue.length, "ByteString was too short: written size was greater than read size." );
        var dataPart = jsReadValue.toString().match( /[0-9A-F]+$/ ).toString();
        dataPart = dataPart.substring( startIndex * 2, ( endIndex + 1 ) * 2 );
        jsReadValue = UaByteString.fromStringData( charCodesStringToString( dataPart ) );
    }
    else return null; // ignore unsupported data types
    var rangeMessage = " at ";
    rangeMessage += ( startIndex === endIndex ) ? "index " + startIndex : "index range " + startIndex + ":" + endIndex;
    if( !Assert.Equal( jsWrittenValue, jsReadValue, "Value written" + rangeMessage + " did not match value read" + rangeMessage ) ) success = false;
    return success;
}

function compareArrayWrittenToRead( writeRequest, readResponse, i, NodeSettings ) {
    var _readDT  = readResponse.Results[i].Value.DataType;
    var _writeDT = writeRequest.NodesToWrite[i].Value.Value.DataType;
    var readArrayAsNative  = GetArrayTypeToNativeType( readResponse.Results[i].Value );
    var writeArrayAsNative = GetArrayTypeToNativeType( writeRequest.NodesToWrite[i].Value.Value );
    if( readArrayAsNative.length === writeArrayAsNative.length ) { 
        // are these arrays the same type, i.e. ByteString-to-ByteString, Byte-to-Byte, OR Byte-to-ByteString or ByteString-to-Byte etc.
        if( _readDT === _writeDT ) {
            for( var ii=0; ii<readArrayAsNative.length; ii++ ) {
                if( !Assert.Equal( writeArrayAsNative[ii], readArrayAsNative[ii], "Mismatch, array element written [" + ii + "]=" + writeArrayAsNative[ii] + "; value returned: " + readArrayAsNative[ii] + "; NodeId: " + writeRequest.NodesToWrite[ii].NodeId ) ) {
                    return( true );
                }
            }//for i...
        }
        else {
            // we have different data-types; let's force the LEFT side to be a ByteString and the RIGHT to be a Byte
            var _left  = _writeDT === BuiltInType.ByteString? writeArrayAsNative : readArrayAsNative;
            var _right = _readDT === BuiltInType.Byte? readArrayAsNative : writeArrayAsNative;
            for( var ii=0; ii<readArrayAsNative.length; ii++ ) {
                var _lVal = parseInt( _left.getRange( ii, ii ).toHexString() );
                var _rVal = _right[ii];
                if( !Assert.Equal(_lVal, _rVal, "Mismatch in verifying array element[ " + ii + "]." ) ) return( true );
            }//for i
        }
    }
    else addError( "Array written (size: " + writeArrayAsNative.length + ") does not match the received in Read (size: " + readArrayAsNative.length + ")." );
    return( false );
}

function compareWritesToRead( writeRequest, writeResponse, NodeSettings, session ) {
    var success = true;
    addLog( "Read() to compare the values from the last Write()." );
    // define the Read request headers
    var readRequest = new UaReadRequest();
    var readResponse = new UaReadResponse();
    if( !isDefined( session ) ) throw( "compareWritesToRead::session not specified" );
    session.buildRequestHeader( readRequest.RequestHeader );

    // define the items to read, which are the same as those we just wrote
    for( var i=0; i<writeRequest.NodesToWrite.length; i++ ) {
        readRequest.NodesToRead[i].NodeId      = writeRequest.NodesToWrite[i].NodeId;
        readRequest.NodesToRead[i].IndexRange  = writeRequest.NodesToWrite[i].IndexRange;
        readRequest.NodesToRead[i].AttributeId = writeRequest.NodesToWrite[i].AttributeId;
    }// for i...

    var uaStatus = session.read( readRequest, readResponse );
    if( uaStatus.isGood() ) {
        // check all the parameters are valid still...
        checkReadValidParameter( readRequest, readResponse, NodeSettings );
        //now to compare the values
        for( i=0; i<readRequest.NodesToRead.length; i++ ) {
            // we will skip over any items that failed to WRITE
            if( writeResponse.Results[i].isGood() ) {
                if( writeRequest.NodesToWrite[i].Value.Value.isEmpty() && readResponse.Results[i].Value.isEmpty() ) continue;
                if( isNaN( writeRequest.NodesToWrite[i].Value.Value ) && isNaN( readResponse.Results[i].Value ) ) continue;
                // When we use the Minimum value for ByteString and XML element it is neither null or empty, but read response is returned as empty. Checkig for that special case
                if( ( writeRequest.NodesToWrite[i].Value.Value != null  || !writeRequest.NodesToWrite[i].Value.Value.isEmpty() ) && ( readResponse.Results[i].Value.isEmpty() ) ) continue;
                if( !Assert.Equal( writeRequest.NodesToWrite[i].Value.Value, readResponse.Results[i].Value, "Value written does not match the value the Server returned in a subsequent Read." ) ) success = false;
            }// if write succeeded
            else addLog( "Skipping the write verification of failed-write for Node: " + writeRequest.NodesToWrite[i].NodeId );
        }// for i... */
    }
    else {
        addError( "Read() (used for Write verification) failed, status: " + uaStatus, uaStatus );
        success = false;
    }
    
    return( success );
}

function compareLastWriteToRead( writeRequest, writeResponse ) {
    // define the Read request headers
    var readRequest = new UaReadRequest();
    var readResponse = new UaReadResponse();
    Test.Session.Session.buildRequestHeader( readRequest.RequestHeader );

    // define the items to read, which is ONLY the last item we just wrote
    var numWrites = writeRequest.NodesToWrite.length - 1;
    if( numWrites < 0 ) {
        addError( "Nothing was written; cannot perform read validation" );
        return( true );
    }
    readRequest.NodesToRead[0].NodeId = writeRequest.NodesToWrite[numWrites].NodeId;
    readRequest.NodesToRead[0].AttributeId = Attribute.Value;
    
    var uaStatus = Test.Session.Session.read( readRequest, readResponse );
    if( uaStatus.isGood() ) {
        // check all the parameters are valid still...
        checkReadValidParameter( readRequest, readResponse );
        //now to compare the value
        var writeVal = UaVariantToSimpleType( writeRequest.NodesToWrite[numWrites].Value.Value );
        var readVal  = UaVariantToSimpleType( readResponse.Results[0].Value );
        print( "Comparing written value '" + writeVal + "' to value just read '" + readVal + "'" );
        Assert.Equal( writeVal, readVal, "Expected to read back the value previously wrote!" );
    }
    else addError( "Read() (Write verification ) status " + uaStatus, uaStatus );
    return( true );
}

// Read the arrays and compare them to how they should look after having been written.
function checkArraysAfterElementsWritten( session, writeReq, writeResp, originalArrays ) {
    for( var i = 0; i < writeReq.NodesToWrite.length; i++) {
        // check the write was successful first
        if( writeResp.Results[i].isBad() ) {
            addLog( "Skipping the array-write verification of index " + i +", because the write failed with error: " + writeResp.Results[i] );
            continue;
        }
        
        var expectedArray = GetArrayTypeToNativeType( originalArrays[i] );
        var writtenArray = GetArrayTypeToNativeType( writeReq.NodesToWrite[i].Value.Value );
        
        // determine the index range actually written
        var indexRange = writeReq.NodesToWrite[i].IndexRange;
        var firstIndexWritten = 0;
        var lastIndexWritten = -1;
        if( /^[0-9]+$/.test( indexRange ) ) {
            // IndexRange was a single value (e.g., "2")
            firstIndexWritten = parseInt( indexRange, 10 );
            lastIndexWritten = firstIndexWritten;
        }
        else {
            var matches = indexRange.match( /^([0-9]+):([0-9]+)$/ );
            if( matches !== null ) {
                // IndexRange was a correctly formatted range
                firstIndexWritten = parseInt( matches[1], 10 );
                if( matches[2] !== matches[1] ) lastIndexWritten = parseInt( matches[2], 10 );
            }
        }
        
        // set expected array with writeReq values
        if( firstIndexWritten <= expectedArray.length ) for( var j = firstIndexWritten; j <= lastIndexWritten; j++ ) expectedArray[j] = writtenArray[j - firstIndexWritten];

        var item = new MonitoredItem( writeReq.NodesToWrite[i].NodeId, 1 );
        var readValues = new ReadService( { Session: session } );
        readValues.Execute( [ item ], TimestampsToReturn.Neither, 0 );
        var readNativeValues = GetArrayTypeToNativeType( readValues.Response.Results[0].Value );

        Assert.ArraysEqual( expectedArray, readNativeValues, "Written array is not as expected." );
    }
}

/*  Validates the Write response header, and results.
    Parameters: 
        Request       : UaWriteRequest object
        Response      : UaWriteResponse object
        ValidateValues: True/False; true=ReadHelper the value back from the Server 
        NodeSettings  : string[]; setting names that map in order to nodes in Request.NodesToRead
        optionalCUCheckNotSupported : true = check if Bad_WriteNotSupported returned */
function checkWriteValidParameter( Request, Response, ValidateValues, NodeSettings, optionalCUCheckNotSupported, suppressMessaging, session ) {
    var bSucceeded = true;
    var useSettings = false;
    if( NodeSettings !== undefined && NodeSettings !== null ) if( NodeSettings.length == Request.NodesToWrite.length ) useSettings = true;
    if( arguments.length < 3 ) {
        addError( "function checkWriteValidParameter(Request, Response, ValidateValues): Number of arguments must be 3!" );
        return false;
    }
    // as this is a valid parameter test we don't expect any diagnositcinfo        
    if( Response.DiagnosticInfos.length !== 0 ) {
        addError( "Write.Response.DiagnosticInfos was returned. No DiagnosticInfos were expected" );
        bSucceeded = false;
    }
    // check results and number of results
    if( Response.Results.length !== Request.NodesToWrite.length ) {
        addError( "The number of results does not match the number of NodesToWriteService." );
        addError( "NodesToWriteService.length = " + Request.NodesToWrite.length + " Results.length = " + Response.Results.length );
        bSucceeded = false;
    }
    else {
        for( var i=0; i<Response.Results.length; i++ ) {
            if( optionalCUCheckNotSupported !== undefined && optionalCUCheckNotSupported !== null && optionalCUCheckNotSupported == true ) {
                if( Response.Results[i].StatusCode == StatusCode.BadWriteNotSupported || Response.Results[i].StatusCode === StatusCode.BadNotSupported ) {
                    addNotSupported( "Server responded that it does not support the operation." );
                    ValidateValues = false;
                    continue;
                }
            }
            if( Response.Results[i].isNotGood() ) {
                var errorMessage = "Write().Response.Results[" + i + "] is not good: " + Response.Results[i] + "";
                if( useSettings ) errorMessage += "; (Node Setting: '" + NodeSettings[i] + "') ";
                addError( errorMessage, Response.Results[i] );
                bSucceeded = false;
            }
        }
        // read the written values and check if the value is the same
        if( ValidateValues && bSucceeded ) bSucceeded = compareWritesToRead( Request, Response, NodeSettings, session );
    }
    return bSucceeded;
}