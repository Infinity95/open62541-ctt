/* Includes: 
    UaReferenceTypeAttributes.New()
    UaRelativePath.FromStrings()
    UaRelativePath.New()
    UaRequestHeader.New()
    UaResponseHeader.IsValid()
    UaResponseHeader.New()
    UaResponseHeader.toString()
*/
UaReferenceTypeAttributes.New = function( args ) {
    var x = new UaReferenceTypeAttributes();
    if( isDefined( args.Description ) ) {
        if( isDefined( args.Description.Text ) ) x.Description = args.Description;
        else x.Description.Text = args.Description;
    }
    if( isDefined( args.DisplayName ) ) {
        if( isDefined( args.DisplayName.Text ) ) x.DisplayName = args.DisplayName;
        else x.DisplayName.Text = args.DisplayName;
    }
    if( isDefined( args.InverseName ) ) {
        if( isDefined( args.InverseName.Text ) ) x.InverseName = args.InverseName;
        else x.InverseName.Text = args.InverseName;
    }
    if( isDefined( args.IsAbstract ) ) x.IsAbstract = args.IsAbstract;
    if( isDefined( args.SpecifiedAttributes ) ) x.SpecifiedAttributes = args.SpecifiedAttributes;
    if( isDefined( args.Symmetric ) ) x.Symmetric = args.Symmetric;
    if( isDefined( args.UserWriteMask ) ) x.UserWriteMask = args.UserWriteMask;
    if( isDefined( args.WriteMask ) ) x.WriteMask = args.WriteMask;
    if( isDefined( args.ToExtensionObject ) ) {
        var extObj = new UaExtensionObject();
        extObj.setReferenceTypeAttributes( x );
        x = extObj;
    }
    return( x );
}

// arguments: strings
UaRelativePath.FromStrings = function( strings ) {
    var t = new UaRelativePath();
    if( isDefined( node ) && isDefined( strings ) ) {
        for( var i=0; i<strings.length; i++ ) {
            // create the relative path element
            var rpe = new UaRelativePathElement();
            rpe.IncludeSubtypes = true;
            rpe.IsInverse = false;
            rpe.TargetName.Name = strings[i];
            // add the element to the browse path elements collection
            bp.RelativePath.Elements[i] = rpe;
        }//for i
    }
    return( t );
}

var ___requestHandle = 1;
UaRequestHeader.New = function( args ) {
   var header = new UaRequestHeader();
   if( ___requestHandle >= Constants.UInt32_Max ) ___requestHandle = 0;
   if( !isDefined( args ) ) args = new Object();
   if( !isDefined( args.Session ) ) throw( "UaRequestHeader.New - Session not specified." );
   if( isDefined( args.Session.Session ) ) args.Session.Session.buildRequestHeader( header );
   else args.Session.buildRequestHeader( header );
   if( isDefined( args.AdditionalHeader ) )    header.AdditionalHeader = args.AdditionalHeader;
   if( isDefined( args.AuditEntryId ) )        header.AuditEntryId = args.AuditEntryId;
   if( isDefined( args.AuthenticationToken ) ) header.AuthenticationToken = args.AuthenticationToken;
   if( isDefined( args.RequestHandle ) )       header.RequestHandle = args.RequestHandle; else header.RequestHandle = ___requestHandle++;
   if( isDefined( args.ReturnDiagnostics ) ) header.ReturnDiagnostics = header.ReturnDiagnostics;
   if( isDefined( args.TimeoutHint ) )       header.TimeoutHint = args.TimeoutHint; else header.TimeoutHint = parseInt( readSetting( "/Server Test/Session/DefaultTimeoutHint" ) );
   if( isDefined( args.Timestamp ) ) header.Timestamp = args.Timestamp; else args.Timestamp = UaDateTime.utcNow();
   return( header );
}

// arguments: IncludeSubtypes, IsInverse, ReferenceTypeId, TargetName 
UaRelativePath.New = function( args ) {
    var t = new UaRelativePath();
    if( isDefined( args ) ) {
        if( isDefined( args.IncludeSubtypes ) ) t.IncludeSubtypes = args.IncludeSubtypes;
        if( isDefined( args.IsInverse ) ) t.IsInverse = args.IsInverse;
        if( isDefined( args.ReferenceTypeId ) ) t.ReferenceTypeId = args.ReferenceTypeId;
        if( isDefined( args.TargetName ) ) t.TargetName = args.TargetName;
    }
    return( t );
}

/* Generic function the checks the UA ResponseHeader
   Tests include: 
       1. Check the ResponseHeader.RequestHandle matches the RequestHeader.RequestHandle.
       2. Timestamp is within an acceptable range (no delays).
       3. StringTable contains diagnostics information, only if requested.
       4. ServiceResult matches expectations (if applicable)
   Parameters include:
       Name              REQUIRED    Object........................ the actual service object
       ServiceResult     OPTIONAL    ExpectedAndAcceptedResults.... will compare the ServiceResult 
       SuppressMessaging OPTIONAL    Boolean....................... suppress messages
       SuppressWarnings  OPTINAL     Boolean....................... suppress warnings
       SuppressErrors    OPTIONAL    Boolean....................... suppress errors
*/
UaResponseHeader.IsValid = function( args ) {
    // check parameters
    if( !isDefined( args ) ) throw( "UaResponseHeader::arguments not specified." );
    if( !isDefined( args.Service ) ) throw( "UaResponseHeader::Service not specified." );
    if( !isDefined( args.Service.Name ) || !isDefined( args.Service.Request ) || !isDefined( args.Service.Response ) ) throw( "UaResponseHeader::Service object is not of the right type." );
    if( !isDefined( args.SuppressMessaging ) ) args.SuppressMessaging = false;
    if( !isDefined( args.SuppressWarnings ) ) args.SuppressWarnings = false;
    if( !isDefined( args.SuppressErrors ) ) args.SuppressErrors = false;
    if( !isDefined( args.ServiceInfo ) ) args.ServiceInfo = "";

    var result = true;
    var currentClientTime = UaDateTime.utcNow(); // get current time to validate the timestamp

    // TEST 1: ServiceResult
    if( !args.Service.Response.ResponseHeader.ServiceResult.isGood() ) {
        // did the Service fail with a NOT SUPPORTED? if so, register it.
        if( args.Service.Response.ResponseHeader.ServiceResult.StatusCode === StatusCode.BadNotImplemented || args.Service.Response.ResponseHeader.ServiceResult.StatusCode === StatusCode.BadServiceUnsupported ) {
            if( !args.SuppressWarnings ) addNotSupported( args.Service.Name + " not implemented." );
            ServiceRegister.SetNotSupported( { Name: args.Service.Name } );
            result = false;
            return( result );
        }
        else {
            // Expected service result?
            if( isDefined( args.ServiceResult ) ) {
                if( !args.ServiceResult.containsStatusCode( args.Service.Response.ResponseHeader.ServiceResult ) ) result = false;
                if( !result && !args.SuppressErrors ) addError( args.Service.Name + ".Response.ResponseHeader.ServiceResult: " + args.Service.Response.ResponseHeader.ServiceResult + "; but " + args.ServiceResult.toString() );
            }
            else if( args.Service.Response.ResponseHeader.ServiceResult.isBad() ) {
                if( !args.SuppressErrors ) addError( args.Service.Name + ".Response.ResponseHeader.ServiceResult is Bad: " + args.Service.Response.ResponseHeader.ServiceResult, args.Service.Response.ResponseHeader.ServiceResult );
                result = false;
            }
        }
    }

    // TEST 2: RequestHandle matches
    if( args.Service.Response.ResponseHeader.RequestHandle !== args.Service.Request.RequestHeader.RequestHandle ) {
        if( !args.SuppressErrors ) addError( args.Service.Name + "ResponseHeader.RequestHandle does not match expected RequestHandle. Expected: " + args.Service.Request.RequestHeader.RequestHandle + " Received: " + args.Service.Response.ResponseHeader.RequestHandle );
    }

    // TEST 3: timestamp validation: calculate the difference, and then see if it's within our 1-second response time-frame
    var timediff = Math.abs( args.Service.Response.ResponseHeader.Timestamp.msecsTo( args.Service.Request.RequestHeader.Timestamp ) );
    var millesecTolerance = parseInt( readSetting( "/Server Test/Time Tolerence" ) );
    if( timediff > millesecTolerance ) if( args.Service.Name !== "Publish" ) _warning.store( args.Service.Name + ".Response.ResponseHeader.Timestamp shows a delay of " + DurationToString( timediff ) + ", which exceeds the configured tolerence of: " + DurationToString( millesecTolerance ) );

    // TEST 4: check diagnostics (This is based on a CTT setting)
    if( gServerCapabilities.ServerDiagnostics_EnabledFlag ) {
        // TEST 1) Did we receive diagnostics while asking for them?
        if( args.Service.Request.RequestHeader.ReturnDiagnostics !== 0 ) {
            // check DiagnosticInfos is empty; if not, then all values must be good, and a corresponding string-table must exist
            if( isDefined( args.Service.Response.DiagnosticInfos ) && !UaDiagnosticInfos.IsEmpty( args.Service.Response.DiagnosticInfos ) ) {
                // check each diagnostic info has a corresponding StringTable record
                for( var d=0; d<args.Service.Response.DiagnosticInfos.length; d++ ) {
                    if( !UaDiagnosticInfo.IsInStringTable( { DiagnosticInfo: args.Service.Response.DiagnosticInfos[d], StringTable: args.Service.Response.ResponseHeader.StringTable } ) ) {
                        if( !args.SuppressErrors ) addError( args.Service.Name + ".Response.DiagnosticInfos contains entries that could not be found in the StringTable." );
                        result = false;
                    }
                }
            }
            else {
                // since diagnostice infos is empty; let's make sure StringTable is too; except if ServiceDiagnostics present
                if( args.Service.Response.ResponseHeader.StringTable.length !== 0 ) {
                    if( UaDiagnosticInfos.IsEmpty( args.Service.Response.ResponseHeader.ServiceDiagnostics ) ) {
                        if( !args.SuppressErrors ) addError( args.Service.Name + ".Response.ResponseHeader.StringTable contains " + args.Service.Response.ResponseHeader.StringTable.length + " elements. Expected ZERO because no DiagnosticInfos were returned.\nData:\n\tRequest.RequestHeader.ReturnDiagnostics = " + args.Service.Request.RequestHeader.ReturnDiagnostics + "\n\tResponse.ResponseHeader.ServiceDiagnostics = " + args.Service.Response.ResponseHeader.ServiceDiagnostics + "\n\tResponse.ResponseHeader.StringTable # " + args.Service.Response.ResponseHeader.StringTable.length );
                        result = false;
                    }
                }
            }
        }
        else if( args.Service.Response.ResponseHeader.ServiceDiagnostics.InnerDiagnosticInfo !== null && args.Service.Response.ResponseHeader.ServiceDiagnostics.InnerDiagnosticInfo.length > 0 ) {
            // TEST a) Did we receive diagnostics without asking for them?
            if( !args.SuppressErrors ) addError( args.Service.Name + ".Response.ResponseHeader.ServiceDiagnostics.InnerDiagnosticInfo contains diagnostics that were not requested." );
            // TEST b) StringTable contains messages?
            if( args.Service.Response.ResponseHeader.StringTable.length > 0 ) if( !args.SuppressErrors ) addError( args.Service.Name + ".Response.ResponseHeader.StringTable contains information that was not requested." );
            result = false;
        }
    }// if checking diagnostics

    // show a log of the service call?
    if( !args.SuppressMessaging ) {
        var message = args.Service.Name;
        if( isDefined( args.ServiceInfo ) ) message += "( " + args.ServiceInfo + " )\n";
        message += "Response.ResponseHeader.ServiceResult: " + args.Service.Response.ResponseHeader.ServiceResult;
        if( isDefined( args.ServiceResult ) && !result ) message += "; would've accepted: " + args.ServiceResult.toString();
        else message += " as expected.";
        print( message );
    }
    return result;
}

UaResponseHeader.New = function( args ) { 
    var r = new UaResponseHeader();
    if( isDefined( args ) ) {
        if( isDefined( args.AdditionalHeader ) ) r.AdditionalHeader = args.AdditionalHeader;
        if( isDefined( args.RequestHandle ) ) r.RequestHandle = args.RequestHandle;
        if( isDefined( args.ServiceDiagnostics ) ) r.ServiceDiagnostics = args.ServiceDiagnostics;
        if( isDefined( args.ServiceResult ) ) r.ServiceResult.StatusCode = args.ServiceResult;
        if( isDefined( args.StringTable ) ) r.StringTable = args.StringTable;
        if( isDefined( args.Timestamp ) ) r.Timestamp = args.Timestamp; else r.Timestamp = UaDateTime.Now();
    }
    return( r );
}

UaResponseHeader.toString = function( args ) {
    return( "[ResponseHeader] AdditionalHeader: omitted" +
        "; RequestHandle: " + args.RequestHandle + 
        "; ServiceDiagnostics: " + args.ServiceDiagnostics.length +
        "; StringTable: " + args.StringTable.length + 
        "; Timestamp: " + args.Timestamp );
}
