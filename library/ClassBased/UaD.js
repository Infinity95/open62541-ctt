/* Includes: 
    UaDataTypeAttributes.New()
    UaDateTime.Now()
    UaDateTime.Now.Add()                       : Specify years, days, hours, minutes, seconds, msec to add to a datetime
    UaDateTime.fromHoursMinutesSecondsString() : Converts a formatted string of hours, minutes, and seconds; to a UaDateTime object.
    UaDateTime.Now.Subtract()                  : Same as UaDateTime.Now.Add(), except to subtract
    UaDeleteNodesItem.New()
    UaDeleteReferencesItem.New()
    UaDiagnosticInfo.IsInStringTable()         : Returns true/false if a specified UaDiagnosticInfo can be found in the specified StringTable (recursive)
    UaDiagnosticInfos.IsEmpty()                : Returns true/false if a UaDiagnosticInfo is empty
    UaDiagnosticInfos.Validate()               : Validates a specified UaDiagnosticInfo object
    DurationToString()
*/


function DurationToString( milliSeconds ) {
    var str = "";
    var seconds = parseInt( Math.abs( milliSeconds / 1000 ) );
    var msecs = Math.abs( milliSeconds % 1000 );
    var minutes = parseInt( seconds / 60 );
    var hours = parseInt( minutes / 60 );
    seconds = seconds % 60;
    if( hours > 0 ) str += hours + " hours ";
    if( minutes > 0 && minutes < 60 ) str += minutes + " minutes ";
    if( seconds > 0 && seconds < 60 ) str += seconds + " seconds ";
    if( ( msecs > 0 && msecs < 1000 ) || ( str.length === 0 ) ) str += msecs + " msecs"
    return( str );
}// function DurationToString(milliSeconds) 

UaDataTypeAttributes.New = function( args ) {
    var x = new UaDataTypeAttributes();
    if( isDefined( args.Description ) ) {
        if( isDefined( args.Description.Text ) ) x.Description = args.Description;
        else x.Description.Text = args.Description;
    }
    if( isDefined( args.DisplayName ) ) {
        if( isDefined( args.DisplayName.Text ) ) x.DisplayName = args.DisplayName;
        else x.DisplayName.Text = args.DisplayName;
    }
    if( isDefined( args.IsAbstract ) ) x.IsAbstract = args.IsAbstract;
    if( isDefined( args.SpecifiedAttributes ) ) x.SpecifiedAttributes = args.SpecifiedAttributes;
    if( isDefined( args.UserWriteMask ) ) x.UserWriteMask = args.UserWriteMask;
    if( isDefined( args.WriteMask ) ) x.WriteMask = args.WriteMask;
    if( isDefined( args.ToExtensionObject ) ) {
        var extObj = new UaExtensionObject();
        extObj.setDataTypeAttributes( x );
        x = extObj;
    }
    return( x );
}

UaDateTime.Now = function() { return( UaDateTime.utcNow() ); }
UaDateTime.Now.Add = function( args ) {
    var d = UaDateTime.Now();
    if( args.Years !== undefined ) d.addDays( 365 & args.Days );
    if( args.Days !== undefined ) d.addDays( args.Days );
    if( args.Hours !== undefined ) d.addHours( args.Hours );
    if( args.Minutes !== undefined ) d.addSeconds( 60 * args.Minutes );
    if( args.Seconds !== undefined ) d.addSeconds( args.Seconds );
    if( args.MSEC !== undefined ) d.addMilliSeconds( args.MSEC );
    return( d );
}
UaDateTime.Now.Subtract = function( args ) {
    var d = UaDateTime.Now();
    if( args.Years !== undefined ) d.addDays( -( 365 & args.Days ) );
    if( args.Days !== undefined ) d.addDays( -( args.Days ) );
    if( args.Hours !== undefined ) d.addHours( -( args.Hours ) );
    if( args.Minutes !== undefined ) d.addSeconds( -( 60 * args.Minutes ) );
    if( args.Seconds !== undefined ) d.addSeconds( -args.Seconds );
    if( args.MSEC !== undefined ) d.addMilliSeconds( -args.MSEC );
    return( d );
}
UaDateTime.fromHoursMinutesSecondsString = function( string ) {
    if( string === undefined || string === null ) string = "00:00:00";
    if( string.indexOf( ":" ) < 2 ) string = "00:00:00";
    var hms = string.split( ":" );
    if( hms.length !== 3 ) {
        string = "00:00:00";
        return( hmsToDateTime( string ) );
    }
    var dt = new UaDateTime();
    dt.addHours  ( hms[0] );
    dt.addSeconds( hms[1] * 60 );
    dt.addSeconds( hms[2] );
    return( dt );
}

UaDeleteNodesItem.New = function( args ) {
    var o = new UaDeleteNodesItem();
    if( isDefined( args ) ) {
        if( isDefined( args.NodeId ) ) o.NodeId = args.NodeId;
        if( isDefined( args.DeleteTargetReferences ) ) o.DeleteTargetReferences = args.DeleteTargetReferences;
    }
    return( o );
}

UaDeleteReferencesItem.New = function( args ) {
    var o = new UaDeleteReferencesItem();
    if( isDefined( args ) ) {
        if( isDefined( args.DeleteBidirectional ) ) o.DeleteBidirectional = args.DeleteBidirectional;
        if( isDefined( args.IsForward ) ) o.IsForward = args.IsForward;
        if( isDefined( args.ReferenceTypeId ) ) o.ReferenceTypeId = args.ReferenceTypeId;
        if( isDefined( args.SourceNodeId ) ) o.SourceNodeId = args.SourceNodeId;
        if( isDefined( args.TargetNodeId ) ) {
            if( isDefined( args.TargetNodeId.NodeId ) ) o.TargetNodeId = args.TargetNodeId;
            else o.TargetNodeId.NodeId = args.TargetNodeId;
        }
    }
    return( o );
}

/* args includes:
    DiagnosticInfo: 
    StringTable */
UaDiagnosticInfo.IsInStringTable = function( args ) {
    if( !isDefined( args ) ) throw( "UaDiagnosticInfo::IsInStringTable, args not specified." );
    if( !isDefined( args.DiagnosticInfo ) ) throw( "UaDiagnosticInfo::IsInStringTable, DiagnosticInfo not specified." );
    if( !isDefined( args.StringTable ) ) throw( "UaDiagnosticInfo::IsInStringTable, StringTable not specified." );
    var result = true;
    // check the SymbolicId, Locale, and LocalizedText 
    if( args.DiagnosticInfo.SymbolicId !== -1 ) {
        if( args.StringTable.length < args.DiagnosticInfo.SymbolicId ) {
            addError( "DiagnosticInfo.SymbolicId '" + args.DiagnosticInfo.SymbolicId + "' refers to an index outside the array of Response.ResponseHeader.StringTable # " + args.StringTable.length );
            result = false;
        }
    }
    if( args.DiagnosticInfo.Locale !== -1 ) { 
        if( args.StringTable.length < args.DiagnosticInfo.Locale ) {
            addError( "DiagnosticInfo.Locale '" + args.DiagnosticInfo.SymbolicId + "' refers to an index outside the array of Response.ResponseHeader.StringTable # " + args.StringTable.length );
            result = false;
        }
    }
    if( args.DiagnosticInfo.LocalizedText !== -1 ) {
        if( args.StringTable.length < args.DiagnosticInfo.LocalizedText ) {
            addError( "DiagnosticInfo.LocalizedText '" + args.DiagnosticInfo.LocalizedText + "' refers to an index outside the array of Response.ResponseHeader.StringTable # " + args.StringTable.length );
            result = false;
        }
    }
    // go recursive, if innerDiagnostics exist
    if( result ) { 
        if( args.DiagnosticInfo.InnerDiagnosticInfo !== null ) {
            for( var i=0; i<args.DiagnosticInfo.InnerDiagnosticInfo.length; i++ ) {
                if( !UaDiagnosticInfo.IsEmpty( args.DiagnosticInfo.InnerDiagnosticInfo[i] ) ) {
                    addError( "UaDiagnosticInfo.InnerDiagnostics contains empty DiagnosticInfos." );
                    result = false;
                }
            }// for i...
        }
    }
    return( result );
}

UaDiagnosticInfos.IsEmpty = function( diagnosticInfo ) {
    if( !isDefined( diagnosticInfo ) ) throw( "UaDiagnosticInfos::IsEmpty, diagnosticInfo not received" );
    if( !isDefined( diagnosticInfo.length ) ) diagnosticInfo = [ diagnosticInfo ];
    var result = true;
    for( var i=0; i<diagnosticInfo.length; i++ ) {
        if( diagnosticInfo[i].NamespaceUri === -1 && diagnosticInfo[i].SymbolicId === -1 && diagnosticInfo[i].Locale === -1 && diagnosticInfo[i].LocalizedText === -1 ) { 
            // check any INNER diagnosticInfos too, and if any of these nested objects are empty; will cause a failure to apply at this level also.
            if( diagnosticInfo[i].InnerDiagnosticInfo !== null ) {
                for( var i=0; i<diagnosticInfo[i].InnerDiagnosticInfo.length; i++ ) {
                    if( !UaDiagnosticInfos.IsEmpty( diagnosticInfo[i].InnerDiagnosticInfo[i] ) ) result = false;
                }// for i...
            }
        }
        else result = false;
    }
print( "UaDiagnosticInfos.IsEmpty() returns " + result );
    return result;
}
UaDiagnosticInfos.Validate = function( args ) { 
    if( !isDefined( args ) ) throw( "UaDiagnosticInfos::Validate, args not received" );
    if( !isDefined( args.RequestHeader ) ) throw( "UaDiagnosticInfos::RequestHeader not specified" );
    if( !isDefined( args.ResponseHeader ) ) throw( "UaDiagnosticInfos::ResponseHeader not specified." );
    if( !isDefined( args.Debug ) ) args.Debug = false;
    var rd = args.RequestHeader.ReturnDiagnostics, sd = args.ResponseHeader.ServiceDiagnostics;
    // check service level diagnostics first, if applicable
    if( args.Debug ) print( "UaDiagnosticInfos: checking ServiceDiagnostics..." );
    if( DiagnosticsMask.ServiceSymbolicId && rd ) if( sd.SymbolicId === 0 ) addWarning( "ResponseHeader.ServiceDiagnostics.SymbolicId not specified, although requested." );
    if( DiagnosticsMask.ServiceLocalizedText && rd ) if( sd.LocalizedText === 0 ) addWarning( "ResponseHeader.ServiceDiagnostics.LocalizedText not specified, although requested." );
    if( DiagnosticsMask.ServiceAdditionalInfo && rd ) if( sd.AdditionalInfo === "" ) addWarning( "ResponseHeader.ServiceDiagnostics.AdditionalInfo not specified, although requested." );
    // check operation level diagnostics, if applicable
    if( isDefined( args.DiagnosticInfos ) ) { 
        for( var i=0; i<args.DiagnosticInfos.length; i++ ) {
            addError( "TODO: OperationDiagnostics" );
        }//for i...
    }
}