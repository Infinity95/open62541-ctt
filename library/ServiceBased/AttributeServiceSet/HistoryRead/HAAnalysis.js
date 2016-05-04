/* Namespace: OPCF.HA.Analysis
   Description: Contains numerous helper functions for analyzing and locating data within a recordset.

    Functions: 
    - RecordsetMatchesCritera
    - Interpolation: 
        - Sloped:  
        - Stepped: 
    - Find: 
        - Date: 
            - First: 
            - Last: 
            - Next: 
            - Previous: 
            - Range: 
            - Average:
            - FirstOnDay: 
    - Exists: 
        - Date: 
        - BadQualityData: 
    - Get: 
        - DataInTimeslice: 
        - Interpolative
    - Date: 
        - FlowsForward: 
        - FlowsBackward: 
        - GenerateNew: 
*/
include( "./library/ServiceBased/AttributeServiceSet/HistoryRead/HAStructureHelpers.js" );

if( undefined === OPCF ) var OPCF = new Object();
if( undefined === OPCF.HA ) OPCF.HA = new Object();
var rawExistsAtTimestamp = false;
OPCF.HA.Analysis = new Object();
OPCF.HA.Analysis = {

        // this function checks each item's value against the documented set of history requirements that are 
        // provided in the HELP documentation.
        RecordsetMatchesCriteria: function( args ) {
            if( !isDefined( args ) ) throw( "args not specified" );
            if( !isDefined( args.Items ) ) throw( "args.Items not specified." );
            var results = [];
            if( Assert.GreaterThan( 999, "Not enough data in the recordset." ) ) {
                for( var i=0; i<args.Items.length; i++ ) {
                    if( Assert.DurationExceeds( { StartTime: args.Items[i].FirstValueInHistory.SourceTimestamp, 
                                                   EndTime:   args.Items[i].LastValueInHistory.SourceTimestamp,
                                                   Hours:     36 } ) ) results.push( args.Items[i] );
                    else addSkipped( "Item '" + CUVariables.Items[i].NodeSetting + " cannot be used because its recordset does not cover 36 hours." );
                };// for i...\
            }
            return( results );
        },

        Interpolation: {
            Sloped: function( args ) {
                try {
                    if( !isDefined( args ) ) throw( "args not specified" );
                    if( !isDefined( args.SoughtTimestamp ) ) throw( "sought timestamp not specified" );
                    if( !isDefined( [ args.EarlyBound, args.LateBound ] ) ) throw( "Early and Late Bound not specified." );
                    if( args.EarlyBound.length === 0 ){
                    if( args.EarlyBound.StatusCode.isBad() ) {
                    var dv = UaDataValue.New( { Value: null, StatusCode: StatusCode.BadNoData, SourceTimestamp: args.SoughtTimestamp.StartTime } ) ; }
                    return ( dv );}
                    var data = [];
                    // revert to stepped if no end bound- Deepthi Teegala
                    if( args.LateBound.StatusCode.isBad() ) {
                        dv = OPCF.HA.Analysis.Interpolation.Stepped ( { SoughtTimestamp: args.SoughtTimestamp, EarlyBound: args.EarlyBound, LateBound:args.LateBound } ); 
                        if( args.EarlyBound.next.StatusCode.isBad() || args.LateBound.previous.StatusCode.isBad() ) {
                            dv.StatusCode.StatusCode = StatusCode.UncertainDataSubNormal ;
                        }
                        return (dv); 
                    }
                    // check if  a non Raw Bad Value exists at the timestamp
                    if ( args.EarlyBound.SourceTimestamp.equals (args.SoughtTimestamp.StartTime) ) {
                        //check if Earlybound.next has bad value 
                        dv = UaDataValue.New( { Value: args.EarlyBound.Value, StatusCode: args.EarlyBound.StatusCode.StatusCode, SourceTimestamp: args.SoughtTimestamp.StartTime } );
                     }
                    else {
                        // get values as floats
                        var EarlyValue = parseFloat( args.EarlyBound.Value );
                        var LateValue = parseFloat( args.LateBound.Value );
                        // calculate interpolation
                        var ETime = args.EarlyBound.SourceTimestamp;
                        var LTime = args.LateBound.SourceTimestamp;
                        var STime = args.SoughtTimestamp.StartTime;
                        var range = ETime.secsTo( LTime, ETime)* 1000;
                        var slope = ( LateValue - EarlyValue ) / range;
                        var diff = ETime.secsTo( STime, ETime );
                        var calculation =  Math.abs( slope * diff * 1000 ) + EarlyValue ;
                        // return the value
                        var dv = new UaDataValue();
                        dv.Value.setDouble( calculation );
                        dv.SourceTimestamp = STime;
                        // update StatusCode
                        dv.StatusCode = StatusCode.SetAggregateBit( { StatusCode: dv.StatusCode, AggregateBit: AggregateBit.Interpolated } );
                        return ( dv ) ; 
                    }// else
                    return ( dv) ;
                }
                catch(exception) {
                    return ( UaDataValue.New( { Value: null, StatusCode: StatusCode.BadTypeMismatch, SourceTimestamp: STime } ) );
                }
            }, // Sloped

           //Deepthi Teegala
           Stepped: function( args ) {
                if( !isDefined( args ) ) throw( "args not specified" );
                if( !isDefined( args.SoughtTimestamp ) ) throw( "sought timestamp not specified" );
                if( !isDefined( args.EarlyBound ) ) throw( "Early Bound not specified." );
                // check if a non-bad raw value exists at the timestamp
                var uadv;
                if ( args.EarlyBound[args.EarlyBound.length - 1].SourceTimestamp.equals (args.SoughtTimestamp.StartTime) ) {
                    uadv = UaDataValue.New( { Value: args.EarlyBound[args.EarlyBound.length - 1].Value, StatusCode: args.EarlyBound[args.EarlyBound.length - 1].StatusCode.StatusCode, SourceTimestamp: args.SoughtTimestamp.StartTime } );
                }
                else {
                    uadv = new UaDataValue ();
                    uadv.Value = args.EarlyBound[args.EarlyBound.length - 1 ].Value;
                    uadv.SourceTimestamp = args.SoughtTimestamp.EndTime;
                    uadv.StatusCode.StatusCode = args.EarlyBound[args.EarlyBound.length - 1 ].StatusCode.StatusCode ;
                    if (args.EarlyBound.current.StatusCode.isBad()|| args.EarlyBound.current.StatusCode.isUncertain()){
                        uadv.StatusCode.StatusCode = StatusCode.UncertainDataSubNormal ; 
                    }
                    // setting the statuscode when no value exists at the timestamp
                    if ( args.EarlyBound.next === null ||(args.SoughTimestamp >= args.EarlyBound.next ) ) {
                        uadv.StatusCode.StatusCode = StatusCode.UncertainDataSubNormal ; 
                    }
                    uadv.StatusCode = StatusCode.SetAggregateBit( { StatusCode: uadv.StatusCode, AggregateBit: AggregateBit.Interpolated } ); 
                }
                return ( uadv ) ;                          
            }, // Stepped

        }, //Interpolation

        Find: {

            Date: {

                /* Returns the earliest/oldest date found in the specified recordset. 
                   Parameters:
                       - RawData: the dataset to search through
                       - Filter:  (optional) the quality of value sought: "good", "bad", "uncertain", "null"  */
                First: function( args ) {
                    if( !isDefined( args ) ) throw( "args not specified." );
                    if( !isDefined( args.RawData ) ) throw( "args.RawData not specified." );
                    if( !isDefined( args.RawData.length ) ) args.RawData = [ args.RawData ];
                    if( !isDefined( args.Index ) ) args.Index = 0;
                    if( args.Filter === undefined || args.Filter === null ) args.Filter = "none";
                    if( args.Debug === undefined ) args.Debug = false;
                    if( args.Debug ) print( "OPCF.HA.Analysis.Find.Date.First() filter requested: '" + args.Filter + "'." );
                    var match = -1;
                    for( var i=0; i<args.RawData.length; i++ ) {
                        var currQuality = args.RawData[i].StatusCode;
                        switch( args.Filter ) { 
                            case "none":        match++; break;
                            case "good":        if( currQuality !== null && currQuality.isGood() ) match++; break;
                            case "bad" :        if( currQuality !== null && currQuality.isBad()  ) match++; break;
                            case "uncertain" :  if( currQuality !== null && currQuality.isUncertain() ) match++; break;
                            case "null" :       if( currQuality === null ) match++; break;
                        }
                        if( match === args.Index ) {
                            if( args.Debug ) print( "OPCF.HA.Analysis.Find.Date.First() found a match at index " + i + ". Returning " + args.RawData[i] );
                            return( args.RawData[i] );
                        }
                    }//for i
                    return( new UaDataValue() );
                }, // FirstDate: function( args )


                /* Returns the first date found on a specific date.
                   Parameters:
                       - RawData: 
                       - Date: */
                FirstOnDay: function( args ) {
                    if( !isDefined( args ) ) throw( "FirstOnDay() args not specified." );
                    if( !isDefined( args.RawData ) ) throw( "FirstOnDay() args.RawData not specified." );
                    if( !isDefined( args.RawData.length ) ) args.RawData = [ args.RawData ];
                    if( !isDefined( args.Date ) ) throw( "FirstOnDay() args.Date not specified" );
                    var dv = new UaDataValue();
                    // iterate through ALL records searching for the first value in the specified day
                    dv.SourceTimestamp = new UaDateTime();
                    for( var i=0; i<args.RawData.length; i++ ) {
                        if( args.RawData[i].SourceTimestamp.daysTo( args.Date ) === 0 ) {
                            if( dv.SouceTimestamp.equals( new UaDateTime() ) || args.RawData[i].SourceTimestamp < dv.SouceTimestamp ) dv = args.RawData[i].clone();
                        }
                    }
                    return( dv );
                }, // FirstOnDay


                /* Returns the last date found on a specific date.
                   Parameters:
                       - RawData: 
                       - Date: */
                LastOnDay: function( args ) {
                    if( !isDefined( args ) ) throw( "LastOnDay() args not specified." );
                    if( !isDefined( args.RawData ) ) throw( "LastOnDay() args.RawData not specified." );
                    if( !isDefined( args.RawData.length ) ) args.RawData = [ args.RawData ];
                    if( !isDefined( args.Date ) ) throw( "LastOnDay() args.Date not specified" );
                    var dv = new UaDataValue();
                    // iterate through ALL records searching for the first value in the specified day
                    dv.SouceTimestamp = new UaDateTime();
                    for( var i=0; i<args.RawData.length; i++ ) {
                        if( args.RawData[i].SourceTimestamp.daysTo( args.Date ) === 0 ) {
                            if( args.RawData[i].SourceTimestamp > dv.SourceTimestamp ) dv = args.RawData[i].clone();
                            else print( "raw["+i+"]=" + args.RawData[i].SourceTimestamp + " is less than " + dv.SourceTimestamp );
                        }
                    }
                    return( dv );
                }, // LastOnDay


                /* Returns the newest (most recent) date found in the specified recordset.
                   Parameters include: 
                       - RawData: the dataset to search through
                       - Filter:  (optional) the quality of value sought: "good", "bad", "uncertain", "null"  */
                Last: function( args ) { 
                    if( !isDefined( args ) ) throw( "args not specified." );
                    if( !isDefined( args.RawData ) ) throw( "args.RawData not specified." );
                    if( !isDefined( args.RawData.length ) ) args.RawData = [ args.RawData ];
                    if( !isDefined( args.Index ) ) args.Index = args.RawData.length - 1;
                    if( args.Filter === undefined || args.Filter === null ) args.Filter = "none";
                    if( args.Debug === undefined ) args.Debug = false;
                    if( args.Debug ) print( "OPCF.HA.Analysis.Find.Date.Last() filter requested: '" + args.Filter + "'." );
                    var match = args.RawData.length;
                    for( var i=args.RawData.length-1; i>=0; i-- ) {
                        var currQuality = args.RawData[i].StatusCode;
                        switch( args.Filter ) { 
                            case "none":        match--; break;
                            case "good":        if( currQuality !== null && currQuality.isGood() ) match--; break;
                            case "bad" :        if( currQuality !== null && currQuality.isBad()  ) match--; break;
                            case "uncertain" :  if( currQuality !== null && currQuality.isUncertain() ) match--; break;
                            case "null" :       if( currQuality === null ) match--; break;
                        }
                        if( match === args.Index ) {
                            if( args.Debug ) print( "OPCF.HA.Analysis.Find.Date.Last() found a match at index " + i + ". Returning " + args.RawData[i] );
                            return( args.RawData[i] );
                        }
                    }//for i
                    return( new UaDataValue() );
                },// LastDate: function( args )

                /* Returns the next date that can be found within a specified recordset.
                   Parameters include: 
                       - RawData: The dataset to search through
                       - StartDate: (optional) a specific timestamp to start searching from 
                       - Skip: (optional) the number of records to jump. Defaults to 1. */
                Next: function( args ) {
                    if( !isDefined( args ) ) throw( "args not specified." );
                    if( !isDefined( args.RawData ) ) throw( "args.RawData not specified." );
                    if( !isDefined( args.RawData.length ) ) args.RawData = [ args.RawData ];
                    if( !isDefined( args.Skip ) ) args.Skip = 1;
                    // find the initial record 
                    var startPoint = 0; 
                    if( isDefined( args.StartDate ) )
                        for( var i=0; i<args.RawData.length; i++ ) 
                            if( args.RawData[i].SourceTimestamp.equals( args.StartDate ) ) { startPoint = i; break; }
                    // now to skip XX number of records
                    if( startPoint + args.Skip > args.RawData.length ) return( new UaDataValue() );
                    else return( args.RawData[ startPoint + args.Skip ] );
                },// Next: function( args )

                /* Returns the previous date that can be found within the specified recordset.
                   Parameters include: 
                       - RawData: 
                       - StartDate: 
                       - Skip: */
                Previous: function( args ) {
                    if( !isDefined( args ) ) throw( "args not specified." );
                    if( !isDefined( args.RawData ) ) throw( "args.RawData not specified." );
                    if( !isDefined( args.RawData.length ) ) args.RawData = [ args.RawData ];
                    if( !isDefined( args.Skip ) ) args.Skip = 1;
                    // find the initial record 
                    var startPoint = 0; 
                    if( isDefined( args.StartDate ) )
                        for( var i=0; i<args.RawData.length; i++ ) 
                            if( args.RawData[i].SourceTimestamp.equals( args.StartDate ) ) { startPoint = i; break; }
                    // now to skip XX number of records
                    var indexPosition = startPoint - args.Skip;
                    if( indexPosition < 0 ) return( new UaDataValue() );
                    else return( args.RawData[indexPosition] );
                },// Previous: function( args )

                /* Parameters include: 
                       - RawData
                       - StartTime 
                       - Debug
                       - Hours (overrides EndTime)
                       - EndTime */
                Range: function( args ) {
                    if( !isDefined( args ) ) throw( "OPC.HA.Find.Date.Range() args not specified." );
                    if( !isDefined( args.RawData ) ) throw( "OPC.HA.Find.Date.Range() args.RawData not specified." );
                    if( !isDefined( args.RawData.length ) ) args.RawData = [ args.RawData ];
                    if( !isDefined( args.StartTime ) ) args.StartTime = args.RawData[0];
                    if( !isDefined( args.Debug ) ) args.Debug = false;
                    var endTime = args.EndTime;
                    var data = [];
                    if( isDefined( args.Hours ) ) {
                        args.EndTime = args.StartTime.clone();
                        args.EndTime.addHours( args.Hours );
                    }//hours
                    for( var i=0; i<args.RawData.length; i++ ) {
                        if( args.RawData[i].SourceTimestamp >= args.StartTime && args.RawData[i].SourceTimestamp <= endTime ) {
                            data.push( args.RawData[i].clone() );
                        }// is "this" timestamp within our desired range? 
                    }// iterate thru all raw data records 
                    if( args.Debug ) print( "OPCF.HA.Analysis.Find.Date.Range() returning " + data.length + " records." );
                    return( data );
                }, // Range( function( args )

                /* Returns a time in msec that identifies the average gap between multiple timestamps.
                   Parameters include: 
                       - Times[] */
                Average: function( args ) {
                    var name = "OPCF.HA.Analysis.Find.Date.Average()";
                    if( !isDefined( args ) ) throw( name + " args not specified." );
                    if( !isDefined( args.Times ) ) throw( name + " args.Times not specified." );
                    if( !isDefined( args.Times.length ) ) throw( name + " args.Times not an array!" );
                    if( !isDefined( args.Debug ) ) args.Debug = false;
                    var start = args.Times[0].clone(), end = args.Times[0].clone(), i=0;
                    // first, find the oldest and newest timestamps... (don't assume the list is sorted)
                    if( args.Debug ) print( name + " checking " + args.Times.length + " times..." );
                    for( i=0; i<args.Times.length; i++ ) {
                        if( args.Times[i] < start ) start = args.Times[i].clone();
                        if( args.Times[i] > end ) end = args.Times[i].clone();
                    }
                    // calculate the difference between start & end
                    var diff = start.msecsTo( end );
                    if( args.Debug ) print( name + " calculated:\n\tStart=" + start + "\n\tend=" + end + "\n\tDifference=" + DurationToString( diff ) );
                    return( diff );
                }
            }, 
        }, // Find, namespace



        Exists: {

            /* Simple lookup function that returns True/False if a specified date can be found in the
               specified recordset.
               Parameters include: 
                   - RawData: the dataset to search through
                   - Date: (optional) if included, then its values are copied into SourceTimestamp and ServerTimestamp 
                   - SourceTimestamp: (optional) the date to search against
                   - ServerTimestamp: (optional) the date to search against. */
            Date: function( args ) {
                if( !isDefined( args ) ) throw( "OPCF.HA.Analysis.Exists::args not specified." );
                if( !isDefined( args.RawData ) ) throw( "OPCF.HA.Analysis.Exists::args.RawData not specified." );
                if( !isDefined( args.RawData.length ) ) args.RawData = [ args.RawData ];
                if( isDefined( args.Date ) ) { 
                    args.ServerTimestamp = args.Date;
                    args.SourceTimestamp = args.Date; }
                else{ 
                    if( !isDefined( args.ServerTimestamp ) && !isDefined( args.SourceTimestamp ) ) throw( "ServerTimestamp and SourceTimestamp not specified." );
                    if( isDefined( args.ServerTimestamp ) && !isDefined( args.SourceTimestamp ) ) args.SourceTimestamp = args.ServerTimestamp;
                    if( isDefined( args.SourceTimestamp ) && !isDefined( args.ServerTimestamp ) ) args.ServerTimestamp = args.SourceTimestamp;
                }
                for( var i=0; i<args.RawData.length; i++ ) {
                    if( args.RawData[i].ServerTimestamp === args.ServerTimestamp ) return( true );
                    if( args.RawData[i].SourceTimestamp === args.SourceTimestamp ) return( true );
                }//for i
                return( false );
            },// OPCF.HA.Analysis.Exists.Date: function( args )

            /* Simple lookup function to see if BAD quality data exists.
               Parameters include:
                   - RawData: the dataset to search through
                   - (returns) TRUE=bad quality found; FALSE=no bad qualities found */
            BadQualityData: function( args ) {
                if( !isDefined( args ) ) throw( "OPCF.HA.Analysis.Exists::args not specified." );
                if( !isDefined( args.RawData ) ) throw( "OPCF.HA.Analysis.Exists::args.RawData not specified." );
                if( !isDefined( args.RawData.length ) ) args.RawData = [ args.RawData ];
                for( var i=0; i<args.RawData.length; i++ ) {
                    if( args.RawData[i].StatusCode.isBad() ) return( args.RawData[i].SourceTimestamp );
                }
                return( null );
            },// OPCF.HA.Analysis.Exists.BadQualityData()

        },// Exists, namespace


        Get: {
             /* To DO */
            FindDataAfterTimeSlice: function( args ) { 
                if( !isDefined( args ) ) throw( "args not specified." );
                if( !isDefined( args.RawData ) ) throw( "args.RawData not specified." );
                if( !isDefined( args.RawData.length ) ) args.RawData = [ args.RawData ];
                if( !isDefined( args.TimeSlice ) ) throw( "args.Timeslice not specified." );
                if( !isDefined( args.Debug ) ) args.Debug = false;
                if( args.Debug) print( "FindDataInTimeSlice [entry] (timeslice: " + args.TimeSlice.toString() + ")" );
                var capture = false;
                var data = [];
                var dv;
                for( var i=0; i<args.RawData.length; i++ ) {
                     if( args.RawData[i].SourceTimestamp > args.TimeSlice.EndTime ) {                        
                            dv = UaDataValue.New( { Value: args.RawData[i].Value, StatusCode: args.RawData[i].StatusCode.StatusCode, SourceTimestamp: args.RawData[i].SourceTimestamp, ServerTimestamp: args.RawData[i].ServerTimestamp } );
                            data.push( dv );
                            break;
                    }
                 }
                 return( data );
            },
            
            /* To DO */
            FindDataBeforeTimeSlice: function( args ) { 
                if( !isDefined( args ) ) throw( "args not specified." );
                if( !isDefined( args.RawData ) ) throw( "args.RawData not specified." );
                if( !isDefined( args.RawData.length ) ) args.RawData = [ args.RawData ];
                if( !isDefined( args.TimeSlice ) ) throw( "args.Timeslice not specified." );
                if( !isDefined( args.Debug ) ) args.Debug = false;
                if( args.Debug) print( "FindDataInTimeSlice [entry] (timeslice: " + args.TimeSlice.toString() + ")" );
                var capture = false;
                var data = [];
                var dv;
                for( var i=0; i<args.RawData.length; i++ ) {
                     if( args.RawData[i].SourceTimestamp <= args.TimeSlice.StartTime ) {
                            if( args.RawData.length > i && args.RawData[i+1].SourceTimestamp > args.TimeSlice.StartTime ) {
                                dv = UaDataValue.New( { Value: args.RawData[i].Value, StatusCode: args.RawData[i].StatusCode.StatusCode, SourceTimestamp: args.RawData[i].SourceTimestamp, ServerTimestamp: args.RawData[i].ServerTimestamp } );
                                data.push( dv );                        
                                if( args.Debug ) print( "\t[" + ( data.length - 1 ) + "] " + dv.toString() );                        
                                
                            }
                    }
                 }
                return( data );
            },
             /* Returns a dataset in between the specified 'TimeSlice'.
               Parameters include: 
                   - RawData: the dataset to search through
                   - TimeSlice: a TimeSlice object containing the start/end times. 
                   - ExcludeBad: 
                   - ExcludeUncertain: */
            FindDataInTimeSlice: function( args ) { 
                if( !isDefined( args ) ) throw( "args not specified." );
                if( !isDefined( args.RawData ) ) throw( "args.RawData not specified." );
                if( !isDefined( args.RawData.length ) ) args.RawData = [ args.RawData ];
                if( !isDefined( args.TimeSlice ) ) throw( "args.Timeslice not specified." );
                if( !isDefined( args.Debug ) ) args.Debug = false;
                if( args.Debug) print( "FindDataInTimeSlice [entry] (timeslice: " + args.TimeSlice.toString() + ")" );
                var capture = false;
                var data = [];
                var dv;
                for( var i=0; i<args.RawData.length; i++ ) {
                    if( args.RawData[i].SourceTimestamp <= args.TimeSlice.StartTime ) {
                        if( args.RawData.length > i && args.RawData[i+1].SourceTimestamp > args.TimeSlice.StartTime ) {
                            dv = UaDataValue.New( { Value: args.RawData[i].Value, StatusCode: args.RawData[i].StatusCode.StatusCode, SourceTimestamp: args.RawData[i].SourceTimestamp, ServerTimestamp: args.RawData[i].ServerTimestamp } );
                            data.push( dv );                        
                            if( args.Debug ) print( "\t[" + ( data.length - 1 ) + "] " + dv.toString() );
                        }
                    }

                    if( args.RawData[i].SourceTimestamp >= args.TimeSlice.StartTime  && args.RawData[i].SourceTimestamp <= args.TimeSlice.EndTime) {
                        dv = UaDataValue.New( { Value: args.RawData[i].Value, StatusCode: args.RawData[i].StatusCode.StatusCode, SourceTimestamp: args.RawData[i].SourceTimestamp, ServerTimestamp: args.RawData[i].ServerTimestamp } );
                        data.push( dv );
                        if( args.Debug ) print( "\t[" + ( data.length - 1 ) + "] " + dv.toString() );
                    }
                    if( args.RawData[i].SourceTimestamp >= args.TimeSlice.EndTime ) {
                        if( args.Debug ) print( "\t[" + ( data.length - 1 ) + "] " + dv.toString() );
                        break;
                    }
                }//for i
                if( args.Debug ) print( "FindDataInTimeSlice [exit] # records: " + data.length );
                return( data );
                
            },// FindDataInTimeSlice: function( args )

            /* Returns a dataset in between the specified 'TimeSlice'.
               Parameters include: 
                   - RawData: the dataset to search through
                   - TimeSlice: a TimeSlice object containing the start/end times.
                   - ExcludeBad: 
                   - ExcludeUncertain: */
            DataInTimeSlice: function( args ) { 
                if( !isDefined( args ) ) throw( "args not specified." );
                if( !isDefined( args.RawData ) ) throw( "args.RawData not specified." );
                if( !isDefined( args.RawData.length ) ) args.RawData = [ args.RawData ];
                if( !isDefined( args.TimeSlice ) ) throw( "args.Timeslice not specified." );
                if( !isDefined( args.Debug ) ) args.Debug = false;
                if( args.Debug) print( "GetDataInTimeSlice [entry] (timeslice: " + args.TimeSlice.toString() + ")" );
                var capture = false;
                var data = [];
                for( var i=0; i<args.RawData.length; i++ ) {
                    // first, simply look if the data is in the current interval
                    if( args.RawData[i].SourceTimestamp >= args.TimeSlice.StartTime ) capture = true;
                    if( args.RawData[i].SourceTimestamp >= args.TimeSlice.EndTime ) break;
                    // Define the bound
                    // last step, grab the data if it has passed all tests (above)
                    if( capture ) {
                        var dv = UaDataValue.New( { Value: args.RawData[i].Value, StatusCode: args.RawData[i].StatusCode.StatusCode, SourceTimestamp: args.RawData[i].SourceTimestamp, ServerTimestamp: args.RawData[i].ServerTimestamp } );
                        data.push( dv );
                        if( args.Debug ) print( "\t[" + ( data.length - 1 ) + "] " + dv.toString() );
                    }
                }//for i
                if( args.Debug ) print( "\tGetDataInTimeSlice [exit] # records: " + data.length );
                return( data );
            },// DataInTimeSlice: function( args )

            /* Returns a dataset including the bounds in the specified 'TimeSlice'.*/
            DataInTimeSliceIncludeBounds: function( args ) {
                if( !isDefined( args ) ) throw( "args not specified." );
                if( !isDefined( args.RawData ) ) throw( "args.RawData not specified." );
                if( !isDefined( args.RawData.length ) ) args.RawData = [ args.RawData ];
                if( !isDefined( args.TimeSlice ) ) throw( "args.Timeslice not specified." );
                if( !isDefined( args.Debug ) ) args.Debug = false;
                if( args.Debug) print( "GetDataInTimeSlice [entry] (timeslice: " + args.TimeSlice.toString() + ")" );
                var capture = false;
                var data = [];
                for( var i=0; i<args.RawData.length; i++ ) {
                    // first, simply look if the data is in the current interval
                    if( args.RawData[i].SourceTimestamp >= args.TimeSlice.StartTime ) capture = true;
                    if( args.RawData[i].SourceTimestamp > args.TimeSlice.EndTime ) break;
                    // Define the bound
                    // last step, grab the data if it has passed all tests (above)
                    if( capture ) {
                        var dv = UaDataValue.New( { Value: args.RawData[i].Value, StatusCode: args.RawData[i].StatusCode.StatusCode, SourceTimestamp: args.RawData[i].SourceTimestamp, ServerTimestamp: args.RawData[i].ServerTimestamp } );
                        data.push( dv );
                        if( args.Debug ) print( "\t[" + ( data.length - 1 ) + "] " + dv.toString() );
                    }
                }//for i
                if( args.Debug ) print( "\tGetDataInTimeSlice [exit] # records: " + data.length );
                return( data );
            },// DataInTimeSliceIncludeBounds: function( args )

        /* Merges two data into one array */
        MergeRawDataAndSimpleBounds: function ( args ) {
                if( !isDefined( args.SimpleBounds ) ) throw( "simpleBounds not specified." );
                if( !isDefined( args.RawData ) ) throw( "rawData not specified." );
                if( !isDefined( args.RawData.length ) ) args.RawData = [ args.RawData ];
                var origRawData = [];
                var mergedResults = [];
                for ( i=0; i<args.RawData.length; i++ ) {
                    origRawData[i] = UaDataValue.New( { StatusCode: StatusCode.BadNoData } );
                    origRawData[i].Value = args.RawData[i].Value.clone();
                    origRawData[i].StatusCode.StatusCode = args.RawData[i].StatusCode.StatusCode;
                    origRawData[i].SourceTimestamp = args.RawData[i].SourceTimestamp.clone();
                    origRawData[i].ServerTimestamp = args.RawData[i].SourceTimestamp.clone();
                }
                //Merge SimpleBounds value and Raw data
                mergedResults = args.SimpleBounds.concat( origRawData );
                //Sort based on soruce timestamp
                mergedResults.sort( function(a,b) {return (a.SourceTimestamp > b.SourceTimestamp) ? 1 : ((b.SourceTimestamp > a.SourceTimestamp) ? -1 : 0);} );
                //remove any duplicates
                mergedResults.filter(function(o,i,a){ return a.indexOf(o) === i; });
                return( mergedResults );
            },

         // Interpolates a value at a timstamp
         Interpolate: function ( args ) {
                if( !isDefined( args ) ) throw( "args not specified." );
                if( !isDefined( args.RawData ) ) throw( "args.RawData not specified." );
                if( !isDefined( args.RawData.length ) ) args.RawData = [ args.RawData ];
                if( !isDefined( args.SoughtTimestamp ) ) throw( "sought timestamp not specified" );
                if( !isDefined( args.TimeSlice ) ) throw( "args.Timeslice not specified." );
                if( !isDefined( args.Debug ) ) args.Debug = false;
                if( !isDefined( args.Configuration ) ) throw( "Configuration not specified" );
                if( args.Debug) print( "GetDataInTimeSlice [entry] (timeslice: " + args.TimeSlice.toString() + ")" );
                var capture = false;
                var Stepped = !args.Configuration.UseSlopedExtrapolation ;
                var EarlyBound = OPCF.HA.Analysis.Get.Bounds(  { RawData: args.RawData, TimeSlice: args.SoughtTimestamp.StartTime, Bounds: true} );
                var LateBound = OPCF.HA.Analysis.Get.Bounds(  { RawData: args.RawData, TimeSlice: args.SoughtTimestamp.StartTime, Bounds: false } );
                // check if the required bounds are available
                if ( !Stepped ){
                    // sloped Interpolation
                    if ( EarlyBound.length >= 1 && LateBound.length >= 1) { 
                        var data = OPCF.HA.Analysis.Interpolation.Sloped ( { SoughtTimestamp: args.SoughtTimestamp, EarlyBound: EarlyBound[EarlyBound.length - 1], LateBound: LateBound[LateBound.length - 1] } ) ;
                        if ( EarlyBound[ EarlyBound.length - 1].SourceTimestamp.equals( args.SoughtTimestamp.StartTime )) {
                            return data;
                        }
                        else {
                            if ( !EarlyBound.next.equals ( LateBound[LateBound.length - 1]) || EarlyBound[EarlyBound.length-1].StatusCode.isUncertain() || LateBound[LateBound.length-1].StatusCode.isUncertain() ) {
                                data.StatusCode.StatusCode = StatusCode.UncertainDataSubNormal;
                                data.StatusCode = StatusCode.SetAggregateBit( { StatusCode: data.StatusCode, AggregateBit: AggregateBit.Interpolated } );
                            } 
                            return ( data );
                        } // else
                    }
                    // check if extrapolation is possible
                    if ( EarlyBound [ EarlyBound.length - 1] !== null ) {
                        if (args.Configuration.UseSlopedExtrapolation ) {
                            // check How many EarlyBounds Exist
                            if ( EarlyBound[ EarlyBound.length - 1]  !== null && EarlyBound[  EarlyBound.length - 2 ]  !== null) {
                                UsingExtrapolation = true;
                                var data = OPCF.HA.Analysis.Interpolation.Sloped ( { SoughtTimestamp: args.SoughtTimestamp, EarlyBound: EarlyBound[  EarlyBound.length - 2 ], LateBound: EarlyBound[EarlyBound.length - 1] } ) ; 
                                data.StatusCode.StatusCode = StatusCode.UncertainDataSubNormal ; 
                                data.StatusCode = StatusCode.SetAggregateBit( { StatusCode: data.StatusCode, AggregateBit: AggregateBit.Interpolated } );
                                return ( data );
                            }
                        }
                        // do stepped extrapolation
                        stepped = true;
                    } // check extrapolation
                } // if (!stepped)
                // check required bounds
                if ( Stepped ) {
                    if (args.TimeSlice.StartTime !== null ) {
                        data = OPCF.HA.Analysis.Interpolation.Stepped( { SoughtTimestamp: args.SoughtTimestamp, EarlyBound: EarlyBound } ) ; 
                        if ( EarlyBound[ EarlyBound.length ] === null || args.SoughtTimestamp >= EarlyBound[EarlyBound.length ] ) { 
                            UsingExtrapolation = true;
                            data.StatusCode = StatusCode.UncertainDataSubNormal ; 
                        }
                    return ( data);
                    }
                } // if (stepped)                    
                // no data found
                return( UaDataValue.New( { Value: null, StatusCode: StatusCode.BadNoData, SourceTimestamp: args.TimeSlice, ServerTimestamp: args.TimeSlice } ) );                  
            },// Interpolate: function( args ) */ 
              
              // Get Early and Late Bounds
          Bounds: function ( args ) {
                if( !isDefined( args ) ) throw( "args not specified." );
                if( !isDefined( args.RawData ) ) throw( "args.RawData not specified." );
                if( !isDefined( args.Bounds ) ) throw( "args.Bounds not specified." );
                if( !isDefined( args.RawData.length ) ) args.RawData = [ args.RawData ];
                if( !isDefined( args.TimeSlice ) ) throw( "args.Timeslice not specified." );
                if( !isDefined( args.Debug ) ) args.Debug = false;
                if( args.Debug) print( "GetDataInTimeSlice [entry] (timeslice: " + args.TimeSlice.toString() + ")" );
                var capture = false;
                var result = false;
                var data = [];
                //Early Bound
                if( args.Bounds ){
                //Check if there are any values before the timestamp
                if (args.RawData[0].SourceTimestamp > args.TimeSlice) {
                var dv = UaDataValue.New( { Value: null, StatusCode: StatusCode.BadNoData, SourceTimestamp: args.TimeSlice, ServerTimestamp: args.TimeSlice } );
                data.push (dv);} 
                // Continue if no values before the timestamp
                for( var i=0; i<args.RawData.length; i++ ) {  
                if(  args.RawData[i].SourceTimestamp <= args.TimeSlice && args.RawData[i].Value !== null ) capture = true;
                    else{
                    if ( data.current === data.next ){break;}
                    else {
                    var dv = UaDataValue.New( { Value: args.RawData[i].Value, StatusCode: args.RawData[i].StatusCode.StatusCode, SourceTimestamp: args.RawData[i].SourceTimestamp, ServerTimestamp: args.RawData[i].ServerTimestamp } );
                    data.next = dv ;} }
                if( capture ) {
                        var dv = UaDataValue.New( { Value: args.RawData[i].Value, StatusCode: args.RawData[i].StatusCode.StatusCode, SourceTimestamp: args.RawData[i].SourceTimestamp, ServerTimestamp: args.RawData[i].ServerTimestamp } );
                      //  if (dv.StatusCode.isBad() ){break;}                     
                        if( args.Debug ) print( "\t[" + ( data.length - 1 ) + "] " + dv.toString() );
                        capture = false;
                        data.current = dv;
                        if ( dv.StatusCode.isBad() ) { 
                            data.next = dv;
                            dv = data[ data.length - 1 ]; 
                            data.push (dv);
                      }
                        data.push (dv);
                        continue; 
                    }//if(capture)
                return (data);}// for
                } //If(args.Bound)
                //LateBound
                else {
                for( var i=0; i<args.RawData.length; i++ ) {
                if( args.RawData[i].SourceTimestamp >= args.TimeSlice && args.RawData[i].Value !== null ) result = true;
                else { 
                    continue; }
                if ( result ){
                    var dv = UaDataValue.New( { Value: args.RawData[i].Value, StatusCode: args.RawData[i].StatusCode.StatusCode, SourceTimestamp: args.RawData[i].SourceTimestamp, ServerTimestamp: args.RawData[i].ServerTimestamp } );
                       result = false;
                       if (dv.StatusCode.isBad()){
                        data.current = dv;
                          continue;
                       }
                      data.current = dv;
                        data.push( dv );
                    }
                return( data ) } // for               
                }
                // else
                if( args.Debug ) print( "\tGetDataInTimeSlice [exit] # records: " + data.length );
                if( ( args.TimeSlice > args.RawData[ args.RawData.length-1 ].SourceTimestamp )) { data.next = null;}
                return( data );
     }, // Bounds
          
        GetLateBound: function ( args ) {
            var CurrentBound = UaDataValue.New( { Timestamps: args.TimeSlice.StartTime, StatusCode: StatusCode.BadNoData } ); // the aggregate value we will create
            var data = [];
            if ( args.RawData[0]==null || args.RawData.length <= 0 ) {
                return ( CurrentBound );
            }
            for (var i=0; i < args.RawData.length; i++) {
                uadv = UaDataValue.New( { Value: null, StatusCode: StatusCode.BadNoData, SourceTimestamp: args.TimeSlice.StartTime, ServerTimestamp: args.TimeSlice.StartTime } );
                if ( args.RawData[i].SourceTimestamp > args.TimeSlice.StartTime ) {
                    uadv.Value = args.RawData[i].Value.clone();
                    uadv.StatusCode = args.RawData[i].StatusCode;
                    uadv.StatusCode.StatusCode = args.RawData[i].StatusCode.StatusCode;
                    uadv.SourceTimestamp = args.RawData[i].SourceTimestamp.clone();
                    uadv.ServerTimestamp = args.RawData[i].SourceTimestamp.clone();
                    //If quality is bad, take the previous non-bad value
                    if ( uadv.StatusCode.isBad() ) {
                        if (i != 0) {
                            CurrentBound.Value = args.RawData[i-1].Value.clone();
                            CurrentBound.SourceTimestamp = args.RawData[i].SourceTimestamp.clone();
                            CurrentBound.ServerTimestamp = args.RawData[i].SourceTimestamp.clone();
                            CurrentBound.StatusCode.StatusCode = args.RawData[i].StatusCode.StatusCode;
                        }
                        break;
                    }
                    else {
                        CurrentBound.Value = args.RawData[i].Value.clone();
                        CurrentBound.SourceTimestamp = args.RawData[i].SourceTimestamp.clone();
                        CurrentBound.ServerTimestamp = args.RawData[i].SourceTimestamp.clone();
                        CurrentBound.StatusCode.StatusCode = args.RawData[i].StatusCode.StatusCode;
                    }
                    break;
                }
            }
            return CurrentBound;
        }, // GetLateBound

        GetEarlyBound: function ( args ) {
            var CurrentBound = UaDataValue.New( { Timestamps: args.TimeSlice.StartTime, StatusCode: StatusCode.BadNoData } ); // the aggregate value we will create
            //var CurrentBound = UaDataValue.New( { Value: null, StatusCode: StatusCode.BadNoData, SourceTimestamp: args.TimeSlice.StartTime, ServerTimestamp: args.TimeSlice.StartTime } );
            if ( args.RawData[0]==null || args.RawData.length <= 0 ) {
                return ( CurrentBound );
            }
            for ( var i=0; i < args.RawData.length; i++ ) {
                if ( args.RawData[i].SourceTimestamp >= args.TimeSlice.StartTime ) {
                    //If Timestamp matches, then set the non-first item's StatusCode to BadNoData
                    if (i != 0) {
                        CurrentBound.Value = args.RawData[i-1].Value.clone();
                        CurrentBound.SourceTimestamp = args.RawData[i-1].SourceTimestamp.clone();
                        CurrentBound.ServerTimestamp = args.RawData[i-1].SourceTimestamp.clone();
                        CurrentBound.StatusCode.StatusCode = args.RawData[i-1].StatusCode.StatusCode;
                    }
                    break;
                } // if ( args.RawData[i].SourceTimestamp
            } // for ( var i=0; 
        return( CurrentBound.clone() );
        }, // GetEarlyBound

        GetAtTimestamp: function ( args, isExists ) {
            var CurrentBound = UaDataValue.New( { Timestamps: args.TimeSlice.StartTime, StatusCode: StatusCode.BadNoData } ); // the aggregate value we will create
            for (var i=0; i < args.RawData.length; i++) {
                    currTime = args.RawData[i].SourceTimestamp.clone();
                    var timeEqual = args.TimeSlice.StartTime.equals(currTime);
                    if ( timeEqual ) {
                        rawExistsAtTimestamp = true;
                        CurrentBound.Value = args.RawData[i].Value.clone();
                        CurrentBound.SourceTimestamp = args.RawData[i].SourceTimestamp.clone();
                        CurrentBound.ServerTimestamp = args.RawData[i].SourceTimestamp.clone();
                        CurrentBound.StatusCode.StatusCode = args.RawData[i].StatusCode.StatusCode;
                        //If quality is bad, then set the item's StatusCode toBadNoData
                        if ( args.RawData[i].StatusCode.isBad() ) {
                            CurrentBound.StatusCode.StatusCode = StatusCode.BadNoData;
                    }
                    return( CurrentBound );
                }
            }
            rawExistsAtTimestamp = false;
            return( CurrentBound );
        }, // GetAtTimestamp

         // SimpleBounds value at a timestamp
         SimpleBoundValues: function ( args ) {
                if( !isDefined( args ) ) throw( "args not specified." );
                if( !isDefined( args.RawData ) ) throw( "args.RawData not specified." );
                if( !isDefined( args.RawData.length ) ) args.RawData = [ args.RawData ];
                if( !isDefined( args.SoughtTimestamp ) ) throw( "sought timestamp not specified" );
                if( !isDefined( args.TimeSlice ) ) throw( "args.Timeslice not specified." );
                if( !isDefined( args.Debug ) ) args.Debug = false;
                if( !isDefined( args.Configuration ) ) throw( "Configuration not specified" );
                if( args.Debug) print( "SimpleBounds [entry] (timeslice: " + args.TimeSlice.toString() + ")" );

                var retSimpleBounds = [];
                var rawDataInTimeSlice = [];
                var goodCount=0, uncertainCount=0, badCount=0;
                var pi = args.TimeSlice.ProcessingInterval;
                var piInSecs = pi/1000;
                var goodTime=0, uncertainTime=0, badTime=0;
                var goodPercentage=0, uncertainPercentage=0, badPercentage=0;
                var timeDiff=0;
                var i=0;
                var StartTime = UaDateTime.fromString( "1001-01-01T00:00:00.0000" );

                args.Debug = false;

                for ( var i=0; i < args.RawData.length; i++ ) {
                            if ( args.RawData[i].Value.DataType == 6 )
                                args.RawData[i].Value.setDouble( args.RawData[i].Value.toInt32() );
                }
                //for each interval find simplebounds
                var lastRawDataSourceTimestamp = args.RawData[ args.RawData.length-1 ].SourceTimestamp.clone();
                lastRawDataSourceTimestamp.addMilliSeconds( args.TimeSlice.ProcessingInterval ); 
                while( ( args.TimeSlice.StartTime <= lastRawDataSourceTimestamp ) ) {
                    var CurrentBound = UaDataValue.New( { Value: null, StatusCode: StatusCode.BadNoData, SourceTimestamp: args.TimeSlice.StartTime, ServerTimestamp: args.TimeSlice.StartTime } ) ;
                    var TempBound = UaDataValue.New( { Value: null, StatusCode: StatusCode.BadNoData, SourceTimestamp: args.TimeSlice.StartTime, ServerTimestamp: args.TimeSlice.StartTime } ) ;
                    //Contains raw data at interval?
                    var CurrentBound = OPCF.HA.Analysis.Get.GetAtTimestamp( args, rawExistsAtTimestamp );
                    if ( rawExistsAtTimestamp ) {
                        if ( CurrentBound.StatusCode.StatusCode == StatusCode.Bad ) {
                            CurrentBound.StatusCode.StatusCode = StatusCode.BadNoData;
                        }
                        if( CurrentBound.StatusCode.isUncertain() )
                           CurrentBound.StatusCode.StatusCode = StatusCode.UncertainDataSubNormal;
                        // Add the UaDataValue object to our array which will be returned to the caller.
                        rawDataInTimeSlice.push( CurrentBound );
                        rawExistsAtTimestamp = false;
                        args.TimeSlice.next();
                        continue;
                    }
                    //Find Before Value and Before Time
                    var EarlyBound = OPCF.HA.Analysis.Get.GetEarlyBound( args );
                    //Find After Value and After Time
                    var LateBound = OPCF.HA.Analysis.Get.GetLateBound( args );

                    //Find SB
                    var sbValue;
                    var currTime;
                    var OrigTime = args.TimeSlice.StartTime.clone();
                    currTime = args.TimeSlice.StartTime.clone();
                    if ( ( EarlyBound.StatusCode.isBad() ) && ( EarlyBound.Value == 0 )  && ( currTime >= StartTime ) ) {
                        currTime.addMilliSeconds( -args.TimeSlice.ProcessingInterval );
                        args.TimeSlice.StartTime = currTime.clone();
                        TempBound = OPCF.HA.Analysis.Get.GetEarlyBound( args );
                        sbValue = TempBound.Value.toDouble();
                        args.TimeSlice.StartTime = OrigTime.clone();
                    }
                    else if ( UaDataValue.New(LateBound).StatusCode.isBad())
                        sbValue = EarlyBound.Value;
                    else if ( EarlyBound.Value == null ) {
                        sbValue = null;
                    }
                    else {
                        var EarlyValue = parseFloat( EarlyBound.Value );
                        var LateValue = parseFloat( LateBound.Value );
                        // calculate interpolation
                        var ETime = EarlyBound.SourceTimestamp.clone();
                        var LTime = LateBound.SourceTimestamp.clone();
                        var STime = args.TimeSlice.StartTime;
                        var range = ETime.secsTo( LTime, ETime)* 1000;
                        var slope;
                        if(range == 0) slope = 0;
                        slope = ( LateValue - EarlyValue ) / range;
                        var diff = ETime.secsTo( STime, ETime );
                        sbValue = Math.abs( slope * diff * 1000 );
                        sbValue = sbValue + EarlyValue;
                        /*if ( isNaN( sbValue ) ) {
                            sbValue = args.RawData[ args.RawData.length-1 ].Value.toDouble();
                        }*/
                    } // End of else

                    // return the value
                    CurrentBound.Value.setDouble( sbValue );
                    CurrentBound.SourceTimestamp = args.TimeSlice.StartTime.clone();
                    CurrentBound.ServerTimestamp = args.TimeSlice.StartTime.clone();
                    CurrentBound.StatusCode = EarlyBound.StatusCode;
                    // update StatusCode
                    if ( CurrentBound.StatusCode.isBad() || EarlyBound.StatusCode.isBad() ) {
                        CurrentBound.StatusCode.StatusCode = StatusCode.BadNoData;
                    }
                    else if ( EarlyBound.StatusCode.isUncertain() )
                         CurrentBound.StatusCode.StatusCode = StatusCode.UncertainDataSubNormal;

                    if( LateBound.StatusCode.isUncertain() || LateBound.StatusCode.isBad() )
                        CurrentBound.StatusCode.StatusCode = StatusCode.UncertainDataSubNormal;

                    if( EarlyBound.StatusCode.isUncertain() || LateBound.StatusCode.isUncertain() )
                        CurrentBound.StatusCode.StatusCode = StatusCode.UncertainDataSubNormal;

                    if ( CurrentBound.SourceTimestamp >= args.RawData[ args.RawData.length-1 ].SourceTimestamp ) {
                        CurrentBound.StatusCode.StatusCode = StatusCode.BadNoData;
                    }
                    //rawDataInTimeSlice.push( CurrentBound );
                    retSimpleBounds.push( CurrentBound );
                    args.TimeSlice.next();
                } // while( currentTimestamp <= args.RawData[} )
                if( args.Debug ) {
                    print( "Phase I - Prior to Simple Bound Values: rawDataInTimeSlice" );
                    print( "----------------------------------------------------------" );
                    for( i in rawDataInTimeSlice ) print( "\t" + rawDataInTimeSlice[i] );
                }
                return ( retSimpleBounds );
            } // SimpleBoundValues: function( args )
        },// Get, namespace

        Date: {

            FlowsForward: function( args ) {
                if( !isDefined( args ) ) throw( "args not specified." );
                if( !isDefined( args.RawData ) ) throw( "args.RawData not specified." );
                if( !isDefined( args.RawData.length ) ) args.RawData = [ args.RawData ];
                if( args.RawData.length < 2 ) return( true );
                for( var i=0; i<args.RawData.length - 2; i++ ) if( args.RawData[i].SourceTimestamp > args.RawData[ 1 + i ].SourceTimestamp ) { 
                    addError( "Dates do not flow forward. Results[" + i + "] is '" + args.RawData[i].SourceTimestamp + "' is NEWER than Results[" + 1 + i + "] '" + args.RawData[1+i].SourceTimestamp );
                    return( false );
                }
                return( true );
            },// FlowsForward: function( args )

            FlowsBackward: function( args ) {
                if( !isDefined( args ) ) throw( "args not specified." );
                if( !isDefined( args.RawData ) ) throw( "args.RawData not specified." );
                if( !isDefined( args.RawData.length ) ) args.RawData = [ args.RawData ];
                if( args.RawData.length < 2 ) return( true );
                for( var i=0; i<args.RawData.length - 2; i++ ) if( args.RawData[i].SourceTimestamp < args.RawData[ 1 + i ].SourceTimestamp ) { 
                    addError( "Dates do not flow backward. Results[" + i + "] is '" + args.RawData[i].SourceTimestamp + "' is OLDER than Results[" + ( 1 + i ) + "] '" + args.RawData[1+i].SourceTimestamp );
                    return( false );
                }
                return( true );
            },// FlowsBackward: function( args )

            // Searches through the RAW values and generates a date that does NOT exist!
            GenerateNew: function( args ) {
                if( !isDefined( args ) ) throw( "OPCF.HA.Analysis.Date.GenerateNew::args not specified." );
                if( !isDefined( args.RawData ) ) throw( "OPCF.HA.Analysis.Date.GenerateNew::args.RawData not specified." );
                if( !isDefined( args.RawData.length ) ) args.RawData = [ args.RawData ];
                if( !isDefined( args.StartDate ) ) throw( "OPCF.HA.Analysis.Date.GenerateNew::args.StartDate not specified." );
                if( !isDefined( args.OffsetHours ) ) {
                    if( !isDefined( args.OffsetMSEC ) ) args.OffsetMSEC = 3;
                }
                var newDate = args.StartDate.clone();
                var failSafeCount = 20;
                while( true && failSafeCount > 0 ) {
                    if( isDefined( args.OffsetHours ) ) newDate.addHours( args.OffsetHours );
                    else newDate.addMilliSeconds( args.OffsetMSEC );
                    var found = false;
                    for( var i=0; i<args.RawData.length-1; i++ ) {
                        if( args.RawData[i].SourceTimestamp === newDate ) { 
                            found = true;
                            break;
                        }
                    }
                    if( !found ) return( newDate );
                    failSafeCount--;
                    if( isDefined( OffsetHours ) ) args.OffsetHours = parseInt( args.OffsetHours * 3.142 );
                    else args.OffsetMSEC = parseInt( args.OffsetMSEC * 3.142 );
                }//while true
                return( new UaDateTime() );
            },// OPCF.HA.Analysis.Date.GenerateNew: function( args )

        },// Date, namespace
    },  // CttHAServer.RawAnalysis