/* Aggregates are grouped by namespace, and then (e.g. Aggregates.Averaging.Average.GetDataset() ):
    Averaging:  Average#, TimeAverage, Total, Total2, Minimum#, Minimum2, Maximum#, Maximum2
    Counting:   Count#, DurationInState0, DurationInState1, NumberOfTransitions
    Time:       Start#, End#, Delta, Start2, End2, Delta2
    Quality:    DurationGood, DurationBad, PercentGood, PercentBad, WorstQuality, WorstQuality2
    Annotation: AnnotationCount
    Other:      Interpolative, MinimumActualTime, MinimumActualTime2, MaximumActualTime, MaximumActualTime2
                Range, Range2, StartBound, EndBound, DeltaBounds, PercentGood, PercentBad, 
                StandardDeviationSample, StandardDeviationPopulation, VarianceSample, StandardDeviationPopulation, VariancePopulation
                Custom
    NOTE: # means complete; ! means error */

OPCF.HA.Aggregates = new Object();
OPCF.HA.Aggregates = {

// ~~~~~~~~~~~~~~~ Averaging ~~~~~~~~~~~~~~~~ //
    Averaging: {
        Average: { 
            Name: "Average",
            Type: new UaNodeId( Identifier.AggregateFunction_Average ),
            GetDataset: function( args ) {
                // check parameters
                if( args === undefined || args === null ) throw( "args not specified." );
                if( args.RawData === undefined || args.RawData === null || args.RawData.length === undefined || args.RawData.length === null || args.RawData.length === 0 ) throw( "RawData not specified." );
                if( !isDefined( args.TimeSlice ) ) args.TimeSlice = { StartTime: new UaDateTime(), EndTime: UaDateTime.utcNow() };
                if( !isDefined( args.Configuration ) ) print( "Configuration not specified [" + this.Name + "]." );
                if( !isDefined( args.FailSafe ) ) args.FailSafe = 50;
                if( !isDefined( args.Debug ) ) args.Debug = false;
                var results = [];
                var failsafe = 0;
                // loop through the recordset and get a "page" of data given the time increment
                var timeIncrement = args.TimeSlice.clone();
                timeIncrement.first();
                while( ( timeIncrement.StartTime <= args.RawData[ args.RawData.length-1 ].SourceTimestamp ) && failsafe++ < args.FailSafe ) {
                    var uadv = UaDataValue.New( { Timestamps: timeIncrement.StartTime, StatusCode: StatusCode.BadNoData } ); // the aggregate value we will create
                    var rawDataInTimeSlice = OPCF.HA.Analysis.Get.DataInTimeSlice(  { RawData: args.RawData, TimeSlice: timeIncrement, Configuration: args.Configuration, Debug: args.Debug } );
                    if( isDefined( rawDataInTimeSlice ) ) { // update our cumulative variables for the count & total etc. 
                        var count = 0, total = 0;
                        for( var i=0; i<rawDataInTimeSlice.length; i++ ) {
                            if( rawDataInTimeSlice[i].StatusCode.isGood() ) {
                                count++;
                                try{ total += UaVariantToSimpleType( rawDataInTimeSlice[i].Value ); } catch(e){}
                            }
                                
                        }//for i
                        // set the return value in a UaDataValue object.
                        uadv.Value.setDouble( count );
                        uadv.SourceTimestamp = timeIncrement.StartTime.clone();
                        uadv.ServerTimestamp = timeIncrement.StartTime.clone();
                        if( count > 0 ) {
                            var result = total / count;
                            uadv.Value.setDouble( result );
                            uadv.StatusCode = StatusCode.SetAggregateBit( { StatusCode: uadv.StatusCode, AggregateBit: AggregateBit.Calculated } );
                            uadv.StatusCode.StatusCode = StatusCode.GetValueBased( { TimeSlice: timeIncrement, RawValues: rawDataInTimeSlice, StatusCode: uadv.StatusCode, Configuration: args.Configuration } );
                        }
                        else uadv.StatusCode.StatusCode = StatusCode.BadNoData;
                    }
                    else uadv.StatusCode.StatusCode = StatusCode.BadNoData;
                    // add the UaDataValue object to our array which will be returned to the caller.
                    results.push( uadv );
                    timeIncrement.next();
                }//while
                return( results );
            }, // GetDataset
            },// Average

        TimeAverage: {
            Name: "TimeAverage",
            Type: new UaNodeId( Identifier.AggregateFunction_TimeAverage ),
            GetDataset: function( args ) {
                // check parameters
                if( args === undefined || args === null ) throw( "args not specified." );
                if( args.RawData === undefined || args.RawData === null || args.RawData.length === undefined || args.RawData.length === null || args.RawData.length === 0 ) throw( "RawData not specified." );
            }, // GetDataset
            }, // TimeAverage

        TimeAverage2: {
            Name: "TimeAverage2",
            Type: new UaNodeId( Identifier.AggregateFunction_TimeAverage2 ),
            GetDataset: function( args ) {
                if( args === undefined || args === null ) throw( "args not specified. TimeAverage2." );
                if( args.RawData === undefined || args.RawData === null || args.RawData.length === undefined || args.RawData.length === null || args.RawData.length === 0 ) throw( "RawData not specified. TimeAverage2." );
            },// GetDataset
            },// TimeAverage2

        Total: { 
            Name: "Total",
            Type: new UaNodeId( Identifier.AggregateFunction_Total ),
            GetDataset: function( args ) {
                if( args === undefined || args === null ) throw( "args not specified." );
                if( args.RawData === undefined || args.RawData === null || args.RawData.length === undefined || args.RawData.length === null || args.RawData.length === 0 ) throw( "RawData not specified." );
                if( !isDefined( args.TimeSlice ) ) args.TimeSlice = { StartTime: new UaDateTime(), EndTime: UaDateTime.utcNow() };
                if( !isDefined( args.Configuration ) ) print( "Configuration not specified [" + this.Name + "]." );
                if( !isDefined( args.FailSafe ) ) args.FailSafe = 50;
                var results = [];
                var failsafe = 0;
                while( ( args.TimeSlice.StartTime <= args.RawData[ args.RawData.length-1 ].SourceTimestamp ) && ( failsafe++ < args.FailSafe ) ) {
                    var uadv = UaDataValue.New( { Timestamps: args.TimeSlice.StartTime, StatusCode: StatusCode.BadNoData } );
                    var rawDataInTimeSlice = OPCF.HA.Analysis.Get.DataInTimeSlice( { RawData: args.RawData, TimeSlice: args.TimeSlice } ); 
                    if( isDefined( rawDataInTimeSlice ) ) {
                        if( rawDataInTimeSlice[0].StatusCode.isGood() || rawDataInTimeSlice[0].StatusCode.isUncertain() ) uadv.Value = rawDataInTimeSlice[0].Value
                        uadv.SourceTimestamp = args.TimeSlice.StartTime.clone();
                        uadv.ServerTimestamp = args.TimeSlice.StartTime.clone();
                        uadv.StatusCode.StatusCode = StatusCode.GetValueBased( { TimeSlice: args.TimeSlice, RawValues: rawDataInTimeSlice, StatusCode: uadv.StatusCode, Configuration: args.Configuration } );
                        results.push( uadv);
                    }// if
                    else uadv.StatusCode.StatusCode = StatusCode.BadNoData;
                    args.TimeSlice.next();
                }// while
                return results;
            }, // GetDataset
            }, // Total

        Total2: {
            Name: "Total2",
            Type: new UaNodeId( Identifier.AggregateFunction_Total2 ),
            GetDataset: function( args ) {
                if( args === undefined || args === null ) throw( "args not specified." );
                if( args.RawData === undefined || args.RawData === null || args.RawData.length === undefined || args.RawData.length === null || args.RawData.length === 0 ) throw( "RawData not specified." );
            }, // GetDataset
            }, // Total2

        Minimum: {
            Name: "Minimum",
            Type: new UaNodeId( Identifier.AggregateFunction_Minimum ),
            GetDataset: function( args ) {
                if( args === undefined || args === null ) throw( "args not specified." );
                if( args.RawData === undefined || args.RawData === null || args.RawData.length === undefined || args.RawData.length === null || args.RawData.length === 0 ) throw( "RawData not specified." );
                if( !isDefined( args.TimeSlice ) ) args.TimeSlice = { StartTime: new UaDateTime(), EndTime: UaDateTime.utcNow() };
                if( !isDefined( args.Configuration ) ) print( "Configuration not specified [" + this.Name + "]." );
                if( !isDefined( args.FailSafe ) ) args.FailSafe = 50;
                var results = [];
                var failsafe = 0;
                var hasGoodData;
                var isMutipleValue;
                var isUncertainMin = false;

                // loop through the recordset and get a "page" of data given the time increment
                while( ( args.TimeSlice.StartTime <= args.RawData[ args.RawData.length-1 ].SourceTimestamp ) && failsafe++ < args.FailSafe ) {
                    var uadv = UaDataValue.New( { Timestamps: args.TimeSlice.StartTime, StatusCode: StatusCode.BadNoData } ); // the aggregate value we will create
                    var rawDataInTimeSlice = OPCF.HA.Analysis.Get.DataInTimeSlice(  { RawData: args.RawData, TimeSlice: args.TimeSlice } );
                    isUncertainMin = false;
                    if( isDefined( rawDataInTimeSlice ) && rawDataInTimeSlice.length > 0 ) { // update our cumulative variables for minimum value 
                        hasGoodData = false;
                        isMultipleValues = false;
                        uadv = rawDataInTimeSlice[0].clone(), uncertainCount=0, badCount=0;
                        uadv.SourceTimestamp = args.TimeSlice.StartTime.clone();//currentValue.SourceTimestamp.clone();
                        uadv.ServerTimestamp = args.TimeSlice.StartTime.clone();//currentValue.SourceTimestamp.clone();
                        for( var i=0; i<rawDataInTimeSlice.length; i++ ) {
                            var currentValue = rawDataInTimeSlice[i].clone();
                            if( currentValue.StatusCode.StatusCode == StatusCode.BadNoData ) continue;
                            if( currentValue.Value.isEmpty() || currentValue.Value.Value === null) {
                                if( currentValue.StatusCode.isBad() ) badCount++;
                                if( currentValue.StatusCode.isUncertain() && args.Configuration.TreatUncertainAsBad == true ) uncertainCount++;
                                continue;
                            }
                            isNoData = false; //We have some data 
                            if(i !=0 && uadv.Value == currentValue.Value) //If same minmum value exists 
                                isMultipleValues = true;

                            if( rawDataInTimeSlice[i].StatusCode.isGood() ) {
                                if( uadv.Value.isEmpty() || currentValue.Value < uadv.Value) {
                                    uadv.Value = currentValue.Value.clone();
                                    uadv.StatusCode.StatusCode = currentValue.StatusCode.StatusCode;
                                    uadv.SourceTimestamp = args.TimeSlice.StartTime.clone();//currentValue.SourceTimestamp.clone();
                                    uadv.ServerTimestamp = args.TimeSlice.StartTime.clone();//currentValue.SourceTimestamp.clone();
                                }
                                //uadv.Value = ( currentValue.Value > uadv.Value )? currentValue.Value.clone() : uadv.Value.clone();
                                isMultipleValues = false;
                                hasGoodData = true;
                            }
                            else if( rawDataInTimeSlice[i].StatusCode.isUncertain() && args.Configuration.TreatUncertainAsBad == false ) { uncertainCount++; }
                            else if( rawDataInTimeSlice[i].StatusCode.isUncertain() && args.Configuration.TreatUncertainAsBad == true) { badCount++; }
                            else badCount++;

                            if( currentValue.Value < uadv.Value && currentValue.StatusCode.StatusCode == StatusCode.Uncertain ) isUncertainMin = true;
                            else if( uadv.Value < currentValue.Value && uadv.StatusCode.StatusCode == StatusCode.Uncertain ) isUncertainMin = true;
                            else isUncertainMin = false;

                        }//for i
                        // set the return value in a UaDataValue object.
                        if( hasGoodData == false ) {
                            uadv.Value = new UaVariant();
                            uadv.StatusCode.StatusCode = StatusCode.BadNoData;
                            uadv.SourceTimestamp = args.TimeSlice.StartTime.clone();
                            uadv.ServerTimestamp = args.TimeSlice.StartTime.clone();
                        }
                        else if( uncertainCount === 0 && badCount === 0 ) {//Set status based on value
                            uadv.StatusCode = StatusCode.SetAggregateBit( { StatusCode: uadv.StatusCode, AggregateBit: AggregateBit.Calculated } );
                            uadv.StatusCode.StatusCode = StatusCode.GetValueBased( { TimeSlice: args.TimeSlice, RawValues: rawDataInTimeSlice, StatusCode: uadv.StatusCode, Configuration: args.Configuration } );
                        }
                        else {
                            if( badCount !==0 ) uadv.StatusCode.StatusCode = StatusCode.UncertainSubNormal;
                            if( uncertainCount !==0 && isUncertainMin == true) uadv.StatusCode.StatusCode = StatusCode.UncertainSubNormal;
                            //else uadv.StatusCode.StatusCode = StatusCode.BadNoData;
                        }
                    }
                    else {
                        uadv.StatusCode.StatusCode = StatusCode.BadNoData;
                        uadv.SourceTimestamp = args.TimeSlice.StartTime.clone();
                        uadv.ServerTimestamp = args.TimeSlice.StartTime.clone();
                    }
                    // add the UaDataValue object to our array which will be returned to the caller.
                    //Need to check whether minum
                    hasGoodData = false;
                    results.push( uadv );
                    args.TimeSlice.next();
                }//while
                return( results );
            },// GetDataSet
        },// Minimum

        MinimumActualTime: {
            Name: "MinimumActualTime",
            Type: new UaNodeId( Identifier.AggregateFunction_MinimumActualTime ),
            GetDataset: function( args ) {
                if( args === undefined || args === null ) throw( "args not specified." );
                if( args.RawData === undefined || args.RawData === null || args.RawData.length === undefined || args.RawData.length === null || args.RawData.length === 0 ) throw( "RawData not specified." );
                if( !isDefined( args.TimeSlice ) ) args.TimeSlice = { StartTime: new UaDateTime(), EndTime: UaDateTime.utcNow() };
                if( !isDefined( args.Configuration ) ) print( "Configuration not specified [" + this.Name + "]." );
                if( !isDefined( args.FailSafe ) ) args.FailSafe = 50;
                var results = [];
                var failsafe = 0;
                var hasGoodData;
                var isMutipleValue;
                var isUncertainMin = false;

                // loop through the recordset and get a "page" of data given the time increment
                while( ( args.TimeSlice.StartTime <= args.RawData[ args.RawData.length-1 ].SourceTimestamp ) && failsafe++ < args.FailSafe ) {
                    var uadv = UaDataValue.New( { Timestamps: args.TimeSlice.StartTime, StatusCode: StatusCode.BadNoData } ); // the aggregate value we will create
                    var rawDataInTimeSlice = OPCF.HA.Analysis.Get.DataInTimeSlice(  { RawData: args.RawData, TimeSlice: args.TimeSlice } );
                    isUncertainMin = false;
                    if( isDefined( rawDataInTimeSlice ) && rawDataInTimeSlice.length > 0 ) { // update our cumulative variables for minimum value 
                        hasGoodData = false;
                        isMultipleValues = false;
                        uadv = rawDataInTimeSlice[0].clone(), uncertainCount=0, badCount=0;
                        for( var i=0; i<rawDataInTimeSlice.length; i++ ) {
                            var currentValue = rawDataInTimeSlice[i].clone();
                            if( currentValue.StatusCode.StatusCode == StatusCode.BadNoData ) continue;
                            if( currentValue.Value.isEmpty() || currentValue.Value.Value === null) {
                                if( currentValue.StatusCode.isBad() ) badCount++;
                                if( currentValue.StatusCode.isUncertain() && args.Configuration.TreatUncertainAsBad == true ) uncertainCount++;
                                continue;
                            }
                            isNoData = false; //We have some data 
                            if(i !=0 && uadv.Value == currentValue.Value) //If same minmum value exists 
                                isMultipleValues = true;
                            //If data is good, check whether its less than previous min
                            if( rawDataInTimeSlice[i].StatusCode.isGood() ) {
                                if( uadv.Value.isEmpty() || currentValue.Value < uadv.Value) {
                                    uadv.Value = currentValue.Value.clone();
                                    uadv.StatusCode.StatusCode = currentValue.StatusCode.StatusCode;
                                    uadv.SourceTimestamp = currentValue.SourceTimestamp.clone();
                                    uadv.ServerTimestamp = currentValue.SourceTimestamp.clone();
                                }
                                isMultipleValues = false;
                                hasGoodData = true;
                            }
                            else if( rawDataInTimeSlice[i].StatusCode.isUncertain() && args.Configuration.TreatUncertainAsBad == false ) { uncertainCount++; }
                            else if( rawDataInTimeSlice[i].StatusCode.isUncertain() && args.Configuration.TreatUncertainAsBad == true) { badCount++; }
                            else badCount++;
                            //Check for uncertains
                            if ( currentValue.Value < uadv.Value && currentValue.StatusCode.StatusCode == StatusCode.Uncertain ) isUncertainMin = true;
                            else if( uadv.Value < currentValue.Value && uadv.StatusCode.StatusCode == StatusCode.Uncertain ) isUncertainMin = true;
                            else isUncertainMin = false;
                        }//for i

                        // set the return value in a UaDataValue object. No Data found
                        if( hasGoodData == false ) {
                            uadv.Value = new UaVariant();
                            uadv.StatusCode.StatusCode = StatusCode.BadNoData;
                            uadv.SourceTimestamp = args.TimeSlice.StartTime.clone();
                            uadv.ServerTimestamp = args.TimeSlice.StartTime.clone();
                        }
                        else if( uncertainCount === 0 && badCount === 0 ) {//Set the status based on value count
                            uadv.StatusCode = StatusCode.SetAggregateBit( { StatusCode: uadv.StatusCode, AggregateBit: AggregateBit.Calculated } );
                            uadv.StatusCode.StatusCode = StatusCode.GetValueBased( { TimeSlice: args.TimeSlice, RawValues: rawDataInTimeSlice, StatusCode: uadv.StatusCode, Configuration: args.Configuration } );
                        }
                        else {
                            if( badCount !==0 ) uadv.StatusCode.StatusCode = StatusCode.UncertainSubNormal;
                            if( uncertainCount !==0 && isUncertainMin == true) uadv.StatusCode.StatusCode = StatusCode.UncertainSubNormal;
                            //else uadv.StatusCode.StatusCode = StatusCode.BadNoData;
                        }
                    }
                    else {
                        uadv.StatusCode.StatusCode = StatusCode.BadNoData;
                        uadv.SourceTimestamp = args.TimeSlice.StartTime.clone();
                        uadv.ServerTimestamp = args.TimeSlice.StartTime.clone();
                    }
                    // add the UaDataValue object to our array which will be returned to the caller.
                    //Need to check whether minum
                    hasGoodData = false;
                    results.push( uadv );
                    args.TimeSlice.next();
                }//while
                return( results );
            },// GetDataSet
        },// MinimumActualTime

        Minimum2: {
            Name: "Minimum2",
            Type: new UaNodeId( Identifier.AggregateFunction_Minimum2 ),
            GetDataset: function( args ) {
                if( args === undefined || args === null ) throw( "args not specified." );
                if( args.RawData === undefined || args.RawData === null || args.RawData.length === undefined || args.RawData.length === null || args.RawData.length === 0 ) throw( "RawData not specified." );
                if( !isDefined( args.TimeSlice ) ) args.TimeSlice = { StartTime: new UaDateTime(), EndTime: UaDateTime.utcNow() };
                if( !isDefined( args.Configuration ) ) print( "Configuration not specified [" + this.Name + "]." );
                if( !isDefined( args.FailSafe ) ) args.FailSafe = 50;
                var mergedResults = [];
                var origRawData = [];
                var results = [];
                var failsafe = 0;
                var hasGoodData;
                var isMutipleValue;

                //Get SimpleBound values
                var simpleBoundValues = OPCF.HA.Analysis.Get.SimpleBoundValues( { RawData: args.RawData, SoughtTimestamp:args.TimeSlice.StartTime, TimeSlice: args.TimeSlice, Configuration: args.Configuration } );
                args.TimeSlice.StartTime = UaDateTime.fromString( "1001-01-01T00:00:00.0000" );
                args.TimeSlice.EndTime = UaDateTime.fromString( "1001-01-01T00:00:00.0000" );
                args.TimeSlice.EndTime.addMilliSeconds( args.TimeSlice.ProcessingInterval );
                //Combine & Merge the Simple Bound Values & Historian Data Sets
                var mergedResults = OPCF.HA.Analysis.Get.MergeRawDataAndSimpleBounds( {SimpleBounds: simpleBoundValues, RawData: args.RawData} );                

                // loop through the recordset and get a "page" of data given the time increment
                while( ( args.TimeSlice.StartTime <= mergedResults[ mergedResults.length-1 ].SourceTimestamp ) && failsafe++ < args.FailSafe ) {
                    var uadv = UaDataValue.New( { Timestamps: args.TimeSlice.StartTime, StatusCode: StatusCode.BadNoData } ); // the aggregate value we will create
                    var rawDataInTimeSlice = OPCF.HA.Analysis.Get.DataInTimeSlice(  { RawData: mergedResults, TimeSlice: args.TimeSlice } );
                    if( isDefined( rawDataInTimeSlice ) && rawDataInTimeSlice.length > 0 ) { // update our cumulative variables for minimum value 
                        hasGoodData = false;
                        isMultipleValues = false;
                        uadv = rawDataInTimeSlice[0].clone(), uncertainCount=0, badCount=0;
                        for( var i=0; i<rawDataInTimeSlice.length; i++ ) {
                            var currentValue = rawDataInTimeSlice[i].clone();
                            if( currentValue.StatusCode.StatusCode == StatusCode.BadNoData ) continue;
                            if( currentValue.Value === null ) continue;
                            isNoData = false; //We have some data 
                            if(i !=0 && uadv.Value == currentValue.Value) //If same minmum value exists 
                                isMultipleValues = true;

                            if( rawDataInTimeSlice[i].StatusCode.isGood() ) {
                                if ( isNaN( uadv.Value ) ) uadv.Value = currentValue.Value.clone();
                                else uadv.Value = ( uadv.Value > currentValue.Value )? currentValue.Value.clone() : uadv.Value.clone();
                                isMultipleValues = false;
                                hasGoodData = true;
                            }
                            else if( rawDataInTimeSlice[i].StatusCode.isUncertain() ) uncertainCount++;
                            else badCount++;

                        }//for i
                        // set the return value in a UaDataValue object.
                        uadv.SourceTimestamp = args.TimeSlice.StartTime.clone();
                        uadv.ServerTimestamp = args.TimeSlice.StartTime.clone();
                        if(hasGoodData == false) {
                            uadv.Value = new UaVariant();
                            uadv.StatusCode.StatusCode = StatusCode.BadNoData;
                        }
                        else if( uncertainCount === 0 && badCount === 0 ) {
                            uadv.StatusCode = StatusCode.SetAggregateBit( { StatusCode: uadv.StatusCode, AggregateBit: AggregateBit.Calculated } );
                            uadv.StatusCode.StatusCode = StatusCode.GetValueBased( { TimeSlice: args.TimeSlice, RawValues: rawDataInTimeSlice, StatusCode: uadv.StatusCode, Configuration: args.Configuration } );
                        }
                        else {
                            if( badCount !== 0 || uncertainCount !== 0 )
                                uadv.StatusCode.StatusCode = StatusCode.UncertainSubNormal;
                            else uadv.StatusCode.StatusCode = StatusCode.BadNoData;
                        }
                    }
                    else uadv.StatusCode.StatusCode = StatusCode.BadNoData;
                    // add the UaDataValue object to our array which will be returned to the caller.
                    //Need to check whether minum
                    hasGoodData = false;
                    results.push( uadv );
                    args.TimeSlice.next();
                }//while
                return( results );
            },// GetDataset
        },//Minimum2

        MinimumActualTime2: {
            Name: "MinimumActualTime2",
            Type: new UaNodeId( Identifier.AggregateFunction_MinimumActualTime2),
            GetDataset: function( args ) {
                if( args === undefined || args === null ) throw( "args not specified." );
                if( args.RawData === undefined || args.RawData === null || args.RawData.length === undefined || args.RawData.length === null || args.RawData.length === 0 ) throw( "RawData not specified." );
                if( !isDefined( args.TimeSlice ) ) args.TimeSlice = { StartTime: new UaDateTime(), EndTime: UaDateTime.utcNow() };
                if( !isDefined( args.Configuration ) ) print( "Configuration not specified [" + this.Name + "]." );
                if( !isDefined( args.FailSafe ) ) args.FailSafe = 50;
                var mergedResults = [];
                var origRawData = [];
                var results = [];
                var failsafe = 0;
                var hasGoodData;
                var isMutipleValue;

                //Get SimpleBound values
                var simpleBoundValues = OPCF.HA.Analysis.Get.SimpleBoundValues( { RawData: args.RawData, SoughtTimestamp:args.TimeSlice.StartTime, TimeSlice: args.TimeSlice, Configuration: args.Configuration } );
                args.TimeSlice.StartTime = UaDateTime.fromString( "1001-01-01T00:00:00.0000" );
                args.TimeSlice.EndTime = UaDateTime.fromString( "1001-01-01T00:00:00.0000" );
                args.TimeSlice.EndTime.addMilliSeconds( args.TimeSlice.ProcessingInterval );
                //Combine & Merge the Simple Bound Values & Historian Data Sets
                var mergedResults = OPCF.HA.Analysis.Get.MergeRawDataAndSimpleBounds( {SimpleBounds: simpleBoundValues, RawData: args.RawData} );                

                // loop through the recordset and get a "page" of data given the time increment
                while( ( args.TimeSlice.StartTime <= mergedResults[ mergedResults.length-1 ].SourceTimestamp ) && failsafe++ < args.FailSafe ) {
                    var uadv = UaDataValue.New( { Timestamps: args.TimeSlice.StartTime, StatusCode: StatusCode.BadNoData } ); // the aggregate value we will create
                    var rawDataInTimeSlice = OPCF.HA.Analysis.Get.DataInTimeSlice(  { RawData: mergedResults, TimeSlice: args.TimeSlice } );
                    if( isDefined( rawDataInTimeSlice ) && rawDataInTimeSlice.length > 0 ) { // update our cumulative variables for minimum value 
                        hasGoodData = false;
                        isMultipleValues = false;
                        uadv = rawDataInTimeSlice[0].clone(), uncertainCount=0, badCount=0;
                        for( var i=0; i<rawDataInTimeSlice.length; i++ ) {
                            var currentValue = rawDataInTimeSlice[i].clone();
                            if( currentValue.StatusCode.StatusCode == StatusCode.BadNoData ) continue;
                            if( currentValue.Value === null ) continue;
                            isNoData = false; //We have some data 
                            if(i !=0 && uadv.Value == currentValue.Value) //If same minmum value exists 
                                isMultipleValues = true;
                                
                            if( rawDataInTimeSlice[i].StatusCode.isGood() ) {
                                if ( isNaN( uadv.Value ) ) uadv.Value = currentValue.Value.clone();
                                else uadv.Value = ( uadv.Value > currentValue.Value )? currentValue.Value.clone() : uadv.Value.clone();
                                isMultipleValues = false;
                                hasGoodData = true;
                            }
                            else if( rawDataInTimeSlice[i].StatusCode.isUncertain() ) uncertainCount++;
                            else badCount++;
                        }//for i
                        // set the return value in a UaDataValue object.
                        uadv.SourceTimestamp = args.TimeSlice.StartTime.clone();
                        uadv.ServerTimestamp = args.TimeSlice.StartTime.clone();
                        if(hasGoodData == false) {
                            uadv.Value = new UaVariant();
                            uadv.StatusCode.StatusCode = StatusCode.BadNoData;
                        }
                        else if( uncertainCount === 0 && badCount === 0 ) {
                            uadv.StatusCode = StatusCode.SetAggregateBit( { StatusCode: uadv.StatusCode, AggregateBit: AggregateBit.Calculated } );
                            uadv.StatusCode.StatusCode = StatusCode.GetValueBased( { TimeSlice: args.TimeSlice, RawValues: rawDataInTimeSlice, StatusCode: uadv.StatusCode, Configuration: args.Configuration } );
                        }
                        else {
                            if( badCount !== 0 || uncertainCount !== 0 )
                                uadv.StatusCode.StatusCode = StatusCode.UncertainSubNormal;
                            else
                                uadv.StatusCode.StatusCode = StatusCode.BadNoData;
                        }
                    }
                    else uadv.StatusCode.StatusCode = StatusCode.BadNoData;
                    // add the UaDataValue object to our array which will be returned to the caller.
                    //Need to check whether minum
                    hasGoodData = false;
                    results.push( uadv );
                    args.TimeSlice.next();
                }//while
                return( results );
            },// GetDataset
        },//MinimumActualTime2

        Maximum: {
            Name: "Maximum",
            Type: new UaNodeId( Identifier.AggregateFunction_Maximum ),
            GetDataset: function( args ) {
                if( args === undefined || args === null ) throw( "args not specified." );
                if( args.RawData === undefined || args.RawData === null || args.RawData.length === undefined || args.RawData.length === null || args.RawData.length === 0 ) throw( "RawData not specified." );
                if( !isDefined( args.TimeSlice ) ) args.TimeSlice = { StartTime: new UaDateTime(), EndTime: UaDateTime.utcNow() };
                if( !isDefined( args.Configuration ) ) print( "Configuration not specified [" + this.Name + "]." );
                if( !isDefined( args.FailSafe ) ) args.FailSafe = 50;
                var results = [];
                var failsafe = 0;
                var hasGoodData;
                var isMutipleValue;
                var isUncertainMax = false;
                
                // loop through the recordset and get a "page" of data given the time increment
                while( ( args.TimeSlice.StartTime <= args.RawData[ args.RawData.length-1 ].SourceTimestamp ) && failsafe++ < args.FailSafe ) {
                    var uadv = UaDataValue.New( { Timestamps: args.TimeSlice.StartTime, StatusCode: StatusCode.BadNoData } ); // the aggregate value we will create
                    var rawDataInTimeSlice = OPCF.HA.Analysis.Get.DataInTimeSlice(  { RawData: args.RawData, TimeSlice: args.TimeSlice } );
                    isUncertainMax = false;
                    if( isDefined( rawDataInTimeSlice ) && rawDataInTimeSlice.length > 0 ) { // update our cumulative variables for minimum value 
                        hasGoodData = false;
                        isMultipleValues = false;
                        uadv = rawDataInTimeSlice[0].clone(), uncertainCount=0, badCount=0;
                        uadv.SourceTimestamp = args.TimeSlice.StartTime.clone();//currentValue.SourceTimestamp.clone();
                        uadv.ServerTimestamp = args.TimeSlice.StartTime.clone();//currentValue.SourceTimestamp.clone();
                        for( var i=0; i<rawDataInTimeSlice.length; i++ ) {
                            var currentValue = rawDataInTimeSlice[i].clone();
                            if( currentValue.StatusCode.StatusCode == StatusCode.BadNoData ) continue;
                            if( currentValue.Value.isEmpty() || currentValue.Value.Value === null) {
                                if( currentValue.StatusCode.isBad() ) badCount++;
                                if( currentValue.StatusCode.isUncertain() && args.Configuration.TreatUncertainAsBad == true ) uncertainCount++;
                                continue;
                            }
                            isNoData = false; //We have some data 
                            if(i !=0 && uadv.Value == currentValue.Value) //If same minmum value exists 
                                isMultipleValues = true;
                            
                            if( rawDataInTimeSlice[i].StatusCode.isGood() ) {
                                if( uadv.Value.isEmpty() || currentValue.Value > uadv.Value) {
                                    uadv.Value = currentValue.Value.clone();
                                    uadv.StatusCode.StatusCode = currentValue.StatusCode.StatusCode;
                                    uadv.SourceTimestamp = args.TimeSlice.StartTime.clone();//currentValue.SourceTimestamp.clone();
                                    uadv.ServerTimestamp = args.TimeSlice.StartTime.clone();//currentValue.SourceTimestamp.clone();
                                }
                                //uadv.Value = ( currentValue.Value > uadv.Value )? currentValue.Value.clone() : uadv.Value.clone();
                                isMultipleValues = false;
                                hasGoodData = true;
                            }
                            else if ( rawDataInTimeSlice[i].StatusCode.isUncertain() && args.Configuration.TreatUncertainAsBad == false ) { }
                            else if( rawDataInTimeSlice[i].StatusCode.isUncertain() && args.Configuration.TreatUncertainAsBad == true) { uncertainCount++; }
                            else badCount++;

                            if ( currentValue.Value > uadv.Value && currentValue.StatusCode.StatusCode == StatusCode.Uncertain ) isUncertainMax = true;
                            else if( uadv.Value > currentValue.Value && uadv.StatusCode.StatusCode == StatusCode.Uncertain ) isUncertainMax = true;
                            else isUncertainMax = false;

                        }//for i
                        // set the return value in a UaDataValue object.
                        //uadv.SourceTimestamp = args.TimeSlice.StartTime.clone();
                       // uadv.ServerTimestamp = args.TimeSlice.StartTime.clone();
                        if(hasGoodData == false)
                        {
                            uadv.Value = new UaVariant();
                            uadv.StatusCode.StatusCode = StatusCode.BadNoData;
                            uadv.SourceTimestamp = args.TimeSlice.StartTime.clone();
                            uadv.ServerTimestamp = args.TimeSlice.StartTime.clone();
                        }
                        else if( uncertainCount === 0 && badCount === 0 ) {
                            uadv.StatusCode = StatusCode.SetAggregateBit( { StatusCode: uadv.StatusCode, AggregateBit: AggregateBit.Calculated } );
                            uadv.StatusCode.StatusCode = StatusCode.GetValueBased( { TimeSlice: args.TimeSlice, RawValues: rawDataInTimeSlice, StatusCode: uadv.StatusCode, Configuration: args.Configuration } );
                        }
                        else {
                            //uadv.Value = new UaVariant();
                            if( badCount !==0 ) uadv.StatusCode.StatusCode = StatusCode.UncertainSubNormal;
                            if( uncertainCount !==0 && isUncertainMax == true) uadv.StatusCode.StatusCode = StatusCode.UncertainSubNormal;
                            //else uadv.StatusCode.StatusCode = StatusCode.BadNoData;
                        }
                    }
                    else {
                        uadv.StatusCode.StatusCode = StatusCode.BadNoData;
                        uadv.SourceTimestamp = args.TimeSlice.StartTime.clone();
                        uadv.ServerTimestamp = args.TimeSlice.StartTime.clone();
                    }
                    // add the UaDataValue object to our array which will be returned to the caller.
                    //Need to check whether minum
                    hasGoodData = false;
                    results.push( uadv );
                    args.TimeSlice.next();
                }//while
                return( results );
            },// GetDataSet
        },// Maximum

        Maximum2: {
            Name: "Maximum2",
            Type: new UaNodeId( Identifier.AggregateFunction_Maximum2 ),
            GetDataset: function( args ) {
                if( args === undefined || args === null ) throw( "args not specified." );
                if( args.RawData === undefined || args.RawData === null || args.RawData.length === undefined || args.RawData.length === null || args.RawData.length === 0 ) throw( "RawData not specified." );
                if( !isDefined( args.TimeSlice ) ) args.TimeSlice = { StartTime: new UaDateTime(), EndTime: UaDateTime.utcNow() };
                if( !isDefined( args.Configuration ) ) print( "Configuration not specified [" + this.Name + "]." );
                if( !isDefined( args.FailSafe ) ) args.FailSafe = 50;
                var mergedResults = [];
                var origRawData = [];
                var results = [];
                var failsafe = 0;
                var hasGoodData;
                var isMutipleValue;

                //Get SimpleBound values
                var simpleBoundValues = OPCF.HA.Analysis.Get.SimpleBoundValues( { RawData: args.RawData, SoughtTimestamp:args.TimeSlice.StartTime, TimeSlice: args.TimeSlice, Configuration: args.Configuration } );
                args.TimeSlice.StartTime = UaDateTime.fromString( "1001-01-01T00:00:00.0000" );
                args.TimeSlice.EndTime = UaDateTime.fromString( "1001-01-01T00:00:00.0000" );
                args.TimeSlice.EndTime.addMilliSeconds( args.TimeSlice.ProcessingInterval );
                //Combine & Merge the Simple Bound Values & Historian Data Sets
                var mergedResults = OPCF.HA.Analysis.Get.MergeRawDataAndSimpleBounds( {SimpleBounds: simpleBoundValues, RawData: args.RawData} );                

                // loop through the recordset and get a "page" of data given the time increment
                while( ( args.TimeSlice.StartTime <= mergedResults[ mergedResults.length-1 ].SourceTimestamp ) && failsafe++ < args.FailSafe ) {
                    var uadv = UaDataValue.New( { Timestamps: args.TimeSlice.StartTime, StatusCode: StatusCode.BadNoData } ); // the aggregate value we will create
                    var rawDataInTimeSlice = OPCF.HA.Analysis.Get.DataInTimeSliceIncludeBounds(  { RawData: mergedResults, TimeSlice: args.TimeSlice } );
                    if( isDefined( rawDataInTimeSlice ) && rawDataInTimeSlice.length > 0 ) { // update our cumulative variables for minimum value 
                        hasGoodData = false;
                        isMultipleValues = false;
                        uadv = rawDataInTimeSlice[0].clone(), uncertainCount=0, badCount=0;
                        for( var i=0; i<rawDataInTimeSlice.length; i++ ) {
                            var currentValue = rawDataInTimeSlice[i].clone();
                            if( currentValue.StatusCode.StatusCode == StatusCode.BadNoData ) continue;
                            if( currentValue.Value === null ) continue;
                            isNoData = false; //We have some data 
                            if( i !=0 && uadv.Value == currentValue.Value ) //If same minmum value exists 
                                isMultipleValues = true;

                            if( rawDataInTimeSlice[i].StatusCode.isGood() ) {
                                //uadv.Value = ( uadv.Value > currentValue.Value )? currentValue.Value.clone() : uadv.Value.clone();
                                if ( isNaN( uadv.Value ) ) uadv.Value = currentValue.Value.clone();
                                else uadv.Value = ( currentValue.Value > uadv.Value )? currentValue.Value.clone() : uadv.Value.clone();
                                isMultipleValues = false;
                                hasGoodData = true;
                            }
                            else if( rawDataInTimeSlice[i].StatusCode.isUncertain() ) uncertainCount++;
                            else badCount++;

                        }//for i
                        // set the return value in a UaDataValue object.
                        uadv.SourceTimestamp = args.TimeSlice.StartTime.clone();
                        uadv.ServerTimestamp = args.TimeSlice.StartTime.clone();
                        if( hasGoodData == false ) {
                            uadv.Value = new UaVariant();
                            uadv.StatusCode.StatusCode = StatusCode.BadNoData;
                        }
                        else if( uncertainCount === 0 && badCount === 0 ) {
                            uadv.StatusCode = StatusCode.SetAggregateBit( { StatusCode: uadv.StatusCode, AggregateBit: AggregateBit.Calculated } );
                            uadv.StatusCode.StatusCode = StatusCode.GetValueBased( { TimeSlice: args.TimeSlice, RawValues: rawDataInTimeSlice, StatusCode: uadv.StatusCode, Configuration: args.Configuration } );
                        }
                        else {
                            if( badCount !== 0 || uncertainCount !== 0 )
                                uadv.StatusCode.StatusCode = StatusCode.UncertainSubNormal;
                            else
                                uadv.StatusCode.StatusCode = StatusCode.BadNoData;
                        }
                    }
                    else uadv.StatusCode.StatusCode = StatusCode.BadNoData;
                    // add the UaDataValue object to our array which will be returned to the caller.
                    //Need to check whether minum
                    hasGoodData = false;
                    results.push( uadv );
                    args.TimeSlice.next();
                }//while
                return( results );
            },// GetDataset
        },

        MaximumActualTime: {
            Name: "MaximumActualTime",
            Type: new UaNodeId( Identifier.AggregateFunction_MaximumActualTime ),
            GetDataset: function( args ) {
                if( args === undefined || args === null ) throw( "args not specified." );
                if( args.RawData === undefined || args.RawData === null || args.RawData.length === undefined || args.RawData.length === null || args.RawData.length === 0 ) throw( "RawData not specified." );
                if( !isDefined( args.TimeSlice ) ) args.TimeSlice = { StartTime: new UaDateTime(), EndTime: UaDateTime.utcNow() };
                if( !isDefined( args.Configuration ) ) print( "Configuration not specified [" + this.Name + "]." );
                if( !isDefined( args.FailSafe ) ) args.FailSafe = 50;
                var results = [];
                var failsafe = 0;
                var hasGoodData;
                var isMutipleValue;
                var isUncertainMax = false;

                // loop through the recordset and get a "page" of data given the time increment
                while( ( args.TimeSlice.StartTime <= args.RawData[ args.RawData.length-1 ].SourceTimestamp ) && failsafe++ < args.FailSafe ) {
                    var uadv = UaDataValue.New( { Timestamps: args.TimeSlice.StartTime, StatusCode: StatusCode.BadNoData } ); // the aggregate value we will create
                    var rawDataInTimeSlice = OPCF.HA.Analysis.Get.DataInTimeSlice(  { RawData: args.RawData, TimeSlice: args.TimeSlice } );
                    isUncertainMax = false;
                    if( isDefined( rawDataInTimeSlice ) && rawDataInTimeSlice.length > 0 ) { // update our cumulative variables for minimum value 
                        hasGoodData = false;
                        isMultipleValues = false;
                        uadv = rawDataInTimeSlice[0].clone(), uncertainCount=0, badCount=0;
                        for( var i=0; i<rawDataInTimeSlice.length; i++ ) { //Check for Bad and Uncertain data
                            var currentValue = rawDataInTimeSlice[i].clone();
                            if( currentValue.StatusCode.StatusCode == StatusCode.BadNoData ) continue;
                            if( currentValue.Value.isEmpty() || currentValue.Value.Value === null) {
                                if( currentValue.StatusCode.isBad() ) badCount++;
                                if( currentValue.StatusCode.isUncertain() && args.Configuration.TreatUncertainAsBad == true ) uncertainCount++;
                                continue;
                            }
                            isNoData = false; //We have some data 
                            if(i !=0 && uadv.Value == currentValue.Value) //If same minmum value exists 
                                isMultipleValues = true;
                            
                            if( rawDataInTimeSlice[i].StatusCode.isGood() ) {
                                if( uadv.Value.isEmpty() || currentValue.Value > uadv.Value) {
                                    uadv.Value = currentValue.Value.clone();
                                    uadv.StatusCode.StatusCode = currentValue.StatusCode.StatusCode;
                                    uadv.SourceTimestamp = currentValue.SourceTimestamp.clone();
                                    uadv.ServerTimestamp = currentValue.SourceTimestamp.clone();
                                }
                                //uadv.Value = ( currentValue.Value > uadv.Value )? currentValue.Value.clone() : uadv.Value.clone();
                                isMultipleValues = false;
                                hasGoodData = true;
                            }
                            else if ( rawDataInTimeSlice[i].StatusCode.isUncertain() && args.Configuration.TreatUncertainAsBad == false ) { }
                            else if( rawDataInTimeSlice[i].StatusCode.isUncertain() && args.Configuration.TreatUncertainAsBad == true) { uncertainCount++; }
                            else badCount++;
                            //Check for uncertain
                            if ( currentValue.Value > uadv.Value && currentValue.StatusCode.StatusCode == StatusCode.Uncertain ) isUncertainMax = true;
                            else if( uadv.Value > currentValue.Value && uadv.StatusCode.StatusCode == StatusCode.Uncertain ) isUncertainMax = true;
                            else isUncertainMax = false;

                        }//for i
                        // set the return value in a UaDataValue object.
                        if( hasGoodData == false ) {
                            uadv.Value = new UaVariant();
                            uadv.StatusCode.StatusCode = StatusCode.BadNoData;
                            uadv.SourceTimestamp = args.TimeSlice.StartTime.clone();
                            uadv.ServerTimestamp = args.TimeSlice.StartTime.clone();
                        }
                        else if( uncertainCount === 0 && badCount === 0 ) {//Set status based on value
                            uadv.StatusCode = StatusCode.SetAggregateBit( { StatusCode: uadv.StatusCode, AggregateBit: AggregateBit.Calculated } );
                            uadv.StatusCode.StatusCode = StatusCode.GetValueBased( { TimeSlice: args.TimeSlice, RawValues: rawDataInTimeSlice, StatusCode: uadv.StatusCode, Configuration: args.Configuration } );
                        }
                        else {
                            if( badCount !==0 ) uadv.StatusCode.StatusCode = StatusCode.UncertainSubNormal;
                            if( uncertainCount !==0 && isUncertainMax == true) uadv.StatusCode.StatusCode = StatusCode.UncertainSubNormal;
                            //else uadv.StatusCode.StatusCode = StatusCode.BadNoData;
                        }
                    }
                    else {
                        uadv.StatusCode.StatusCode = StatusCode.BadNoData;
                        uadv.SourceTimestamp = args.TimeSlice.StartTime.clone();
                        uadv.ServerTimestamp = args.TimeSlice.StartTime.clone();
                    }
                    // add the UaDataValue object to our array which will be returned to the caller.
                    hasGoodData = false;
                    results.push( uadv );
                    args.TimeSlice.next();
                }//while
                return( results );
            },// GetDataSet
        },// MaximumActualTime

        MaximumActualTime2: {
            Name: "MaximumActualTime2",
            Type: new UaNodeId( Identifier.AggregateFunction_MaximumActualTime2 ),
            GetDataset: function( args ) {
                if( args === undefined || args === null ) throw( "args not specified." );
                if( args.RawData === undefined || args.RawData === null || args.RawData.length === undefined || args.RawData.length === null || args.RawData.length === 0 ) throw( "RawData not specified." );
                if( !isDefined( args.TimeSlice ) ) args.TimeSlice = { StartTime: new UaDateTime(), EndTime: UaDateTime.utcNow() };
                if( !isDefined( args.Configuration ) ) print( "Configuration not specified [" + this.Name + "]." );
                if( !isDefined( args.FailSafe ) ) args.FailSafe = 50;
                var mergedResults = [];
                var origRawData = [];
                var results = [];
                var failsafe = 0;
                var hasGoodData;
                var isMutipleValue;

                //Get SimpleBound values
                var simpleBoundValues = OPCF.HA.Analysis.Get.SimpleBoundValues( { RawData: args.RawData, SoughtTimestamp:args.TimeSlice.StartTime, TimeSlice: args.TimeSlice, Configuration: args.Configuration } );
                args.TimeSlice.StartTime = UaDateTime.fromString( "1001-01-01T00:00:00.0000" );
                args.TimeSlice.EndTime = UaDateTime.fromString( "1001-01-01T00:00:00.0000" );
                args.TimeSlice.EndTime.addMilliSeconds( args.TimeSlice.ProcessingInterval );
                //Combine & Merge the Simple Bound Values & Historian Data Sets
                var mergedResults = OPCF.HA.Analysis.Get.MergeRawDataAndSimpleBounds( {SimpleBounds: simpleBoundValues, RawData: args.RawData} );                
                
                // loop through the recordset and get a "page" of data given the time increment
                while( ( args.TimeSlice.StartTime <= mergedResults[ mergedResults.length-1 ].SourceTimestamp ) && failsafe++ < args.FailSafe ) {
                    var uadv = UaDataValue.New( { Timestamps: args.TimeSlice.StartTime, StatusCode: StatusCode.BadNoData } ); // the aggregate value we will create
                    var rawDataInTimeSlice = OPCF.HA.Analysis.Get.DataInTimeSliceIncludeBounds(  { RawData: mergedResults, TimeSlice: args.TimeSlice } );
                    if( isDefined( rawDataInTimeSlice ) && rawDataInTimeSlice.length > 0 ) { // update our cumulative variables for minimum value 
                        hasGoodData = false;
                        isMultipleValues = false;
                        uadv = rawDataInTimeSlice[0].clone(), uncertainCount=0, badCount=0;
                        for( var i=0; i<rawDataInTimeSlice.length; i++ ) {
                            var currentValue = rawDataInTimeSlice[i].clone();
                            if( currentValue.StatusCode.StatusCode == StatusCode.BadNoData ) continue;
                            if( currentValue.Value === null ) continue;
                            isNoData = false; //We have some data 
                            if(i !=0 && uadv.Value == currentValue.Value) //If same minmum value exists 
                                isMultipleValues = true;
                            //Check for status
                            if( rawDataInTimeSlice[i].StatusCode.isGood() ) {
                                if ( isNaN( uadv.Value ) ) uadv.Value = currentValue.Value.clone();
                                else uadv.Value = ( currentValue.Value > uadv.Value )? currentValue.Value.clone() : uadv.Value.clone();
                                isMultipleValues = false;
                                hasGoodData = true;
                            }
                            else if( rawDataInTimeSlice[i].StatusCode.isUncertain() ) uncertainCount++;
                            else badCount++;

                        }//for i
                        // set the return value in a UaDataValue object.
                        uadv.SourceTimestamp = args.TimeSlice.StartTime.clone();
                        uadv.ServerTimestamp = args.TimeSlice.StartTime.clone();
                        if(hasGoodData == false) {//Doesnt have good data? set to BadNoData
                            uadv.Value = new UaVariant();
                            uadv.StatusCode.StatusCode = StatusCode.BadNoData;
                        }
                        //Doesnt have any bad or uncertain data, Calculate the status
                        else if( uncertainCount === 0 && badCount === 0 ) {
                            uadv.StatusCode = StatusCode.SetAggregateBit( { StatusCode: uadv.StatusCode, AggregateBit: AggregateBit.Calculated } );
                            uadv.StatusCode.StatusCode = StatusCode.GetValueBased( { TimeSlice: args.TimeSlice, RawValues: rawDataInTimeSlice, StatusCode: uadv.StatusCode, Configuration: args.Configuration } );
                        }
                        else {
                            if( badCount !== 0 || uncertainCount !== 0 ) //Contains any bad or uncertain data, consider it as Uncertain data
                                uadv.StatusCode.StatusCode = StatusCode.UncertainSubNormal;
                            else
                                uadv.StatusCode.StatusCode = StatusCode.BadNoData;
                        }
                    }
                    else uadv.StatusCode.StatusCode = StatusCode.BadNoData;
                    // add the UaDataValue object to our array which will be returned to the caller.
                    //Need to check whether minum
                    hasGoodData = false;
                    results.push( uadv );
                    args.TimeSlice.next();
                }//while
                return( results );
            },// GetDataset
        },// MaximumActualTime2
        StartBound: {
            Name: "StartBound",
            Type: new UaNodeId( Identifier.AggregateFunction_StartBound ),
            GetDataset: function( args ) {
                if( args === undefined || args === null ) throw( "args not specified." );
                if( args.RawData === undefined || args.RawData === null || args.RawData.length === undefined || args.RawData.length === null || args.RawData.length === 0 ) throw( "RawData not specified." );
                if( !isDefined( args.TimeSlice ) ) args.TimeSlice = { StartTime: new UaDateTime(), EndTime: UaDateTime.utcNow() };
                if( !isDefined( args.Configuration ) ) print( "Configuration not specified [" + this.Name + "]." );
                if( !isDefined( args.FailSafe ) ) args.FailSafe = 50;
                var results = [];
                var backupTimeSlice = args.TimeSlice.clone(); 

                //Find the Simple Bound Values
                var resultsSB = OPCF.HA.Analysis.Get.SimpleBoundValues( { RawData: args.RawData, SoughtTimestamp:args.TimeSlice.StartTime, TimeSlice: args.TimeSlice, Configuration: args.Configuration } );
                args.TimeSlice = backupTimeSlice.clone();
                args.TimeSlice.EndTime.addMilliSeconds( args.TimeSlice.ProcessingInterval );
                //Combine & Merge the Simple Bound Values & Historian Data Sets
                var mergedData = OPCF.HA.Analysis.Get.MergeRawDataAndSimpleBounds( {SimpleBounds: resultsSB, RawData: args.RawData} );
                
                // loop through the recordset and get a "page" of data given the time increment
                while( args.TimeSlice.StartTime <= mergedData[ mergedData.length-1 ].SourceTimestamp ) {
                    var uadv = UaDataValue.New( { Timestamps: args.TimeSlice.StartTime.clone(), StatusCode: StatusCode.BadNoData } ); // the aggregate value we will create
                    var rawDataInTimeSlice = OPCF.HA.Analysis.Get.DataInTimeSliceIncludeBounds(  { RawData: mergedData, TimeSlice: args.TimeSlice } );
                    if( isDefined( rawDataInTimeSlice ) && rawDataInTimeSlice.length > 0 ) { // update our cumulative variables for minimum value 
                        uadv = rawDataInTimeSlice[0].clone();//, uncertainCount=0, badCount=0;
                        //var found = false;
                        for( var i=0; i<rawDataInTimeSlice.length; i++ ) {
                            if( rawDataInTimeSlice[ i ].SourceTimestamp.secsTo(args.TimeSlice.StartTime) == 0 ) {
                                if(rawDataInTimeSlice[ i ].StatusCode.isBad() ) uadv = new UaDataValue();
                                else uadv.Value = rawDataInTimeSlice[ i ].Value.clone();
                                uadv.StatusCode.StatusCode = rawDataInTimeSlice[i].StatusCode.StatusCode;
                                // set the return value in a UaDataValue object.
                                uadv.SourceTimestamp = args.TimeSlice.StartTime.clone();
                                uadv.ServerTimestamp = args.TimeSlice.StartTime.clone();
                                uadv.StatusCode = StatusCode.SetAggregateBit( { StatusCode: uadv.StatusCode, AggregateBit: AggregateBit.Calculated } );
                                results.push( uadv );
                                break;
                            }
                        }//for i
                        //uadv.StatusCode.StatusCode = StatusCode.GetValueBased( { TimeSlice: args.TimeSlice, RawValues: rawDataInTimeSlice, StatusCode: uadv.StatusCode, Configuration: args.Configuration } );
                    }
                    else uadv.StatusCode.StatusCode = StatusCode.BadNoData;
                    // add the UaDataValue object to our array which will be returned to the caller.
                    args.TimeSlice.next();
                }//while
                return( results );
            }, // GetDataset
        }, // Startbound

        EndBound: {
            Name: "EndBound",
            Type: new UaNodeId( Identifier.AggregateFunction_EndBound ),
            GetDataset: function( args ) {
                if( args === undefined || args === null ) throw( "args not specified." );
                if( args.RawData === undefined || args.RawData === null || args.RawData.length === undefined || args.RawData.length === null || args.RawData.length === 0 ) throw( "RawData not specified." );
                if( !isDefined( args.TimeSlice ) ) args.TimeSlice = { StartTime: new UaDateTime(), EndTime: UaDateTime.utcNow() };
                if( !isDefined( args.Configuration ) ) print( "Configuration not specified [" + this.Name + "]." );
                if( !isDefined( args.FailSafe ) ) args.FailSafe = 50;
                var results = [];
                var backupTimeSlice = args.TimeSlice.clone(); 

                //Find the Simple Bound Values
                var resultsSB = OPCF.HA.Analysis.Get.SimpleBoundValues( { RawData: args.RawData, SoughtTimestamp:args.TimeSlice.StartTime, TimeSlice: args.TimeSlice, Configuration: args.Configuration } );
                args.TimeSlice = backupTimeSlice.clone();
                //args.TimeSlice.EndTime.addMilliSeconds( args.TimeSlice.ProcessingInterval );
                //Combine & Merge the Simple Bound Values & Historian Data Sets
                var mergedData = OPCF.HA.Analysis.Get.MergeRawDataAndSimpleBounds( {SimpleBounds: resultsSB, RawData: args.RawData} );
                
                // loop through the recordset and get a "page" of data given the time increment
                while( args.TimeSlice.StartTime <= mergedData[ mergedData.length-1 ].SourceTimestamp ) {
                    var uadv = UaDataValue.New( { Timestamps: args.TimeSlice.StartTime.clone(), StatusCode: StatusCode.BadNoData } ); // the aggregate value we will create
                    var rawDataInTimeSlice = OPCF.HA.Analysis.Get.DataInTimeSliceIncludeBounds(  { RawData: mergedData, TimeSlice: args.TimeSlice } );
                    if( isDefined( rawDataInTimeSlice ) && rawDataInTimeSlice.length > 0 ) { // update our cumulative variables for minimum value 
                        uadv = rawDataInTimeSlice[0].clone();//, uncertainCount=0, badCount=0;
                        for( var i=0; i<rawDataInTimeSlice.length; i++ ) {
                            if( rawDataInTimeSlice[ i ].SourceTimestamp.secsTo(args.TimeSlice.EndTime) == 0 ) {
                                if(rawDataInTimeSlice[ i ].StatusCode.isBad() ) uadv = new UaDataValue();
                                else uadv.Value = rawDataInTimeSlice[ i ].Value.clone();
                                uadv.StatusCode.StatusCode = rawDataInTimeSlice[i].StatusCode.StatusCode;
                                // set the return value in a UaDataValue object.
                                uadv.SourceTimestamp = args.TimeSlice.StartTime.clone();
                                uadv.ServerTimestamp = args.TimeSlice.StartTime.clone();
                                uadv.StatusCode = StatusCode.SetAggregateBit( { StatusCode: uadv.StatusCode, AggregateBit: AggregateBit.Calculated } );
                                results.push( uadv );
                                break;
                            }
                        }//for i
                        //uadv.StatusCode.StatusCode = StatusCode.GetValueBased( { TimeSlice: args.TimeSlice, RawValues: rawDataInTimeSlice, StatusCode: uadv.StatusCode, Configuration: args.Configuration } );
                    }
                    else uadv.StatusCode.StatusCode = StatusCode.BadNoData;
                    // add the UaDataValue object to our array which will be returned to the caller.
                    args.TimeSlice.next();
                }//while
                return( results );
            }, // GetDataset
        }, // EndBound

    }, // Averaging, namespace


// ~~~~~~~~~~~~~~~ Counting ~~~~~~~~~~~~~~~~ //
    Counting: {
        Count: { 
            Name: "Count",
            Type: new UaNodeId( Identifier.AggregateFunction_Count ),
            GetDataset: function( args ) {
                // check parameters
                if( args === undefined || args === null ) throw( "args not specified." );
                if( !isDefined( args.RawData ) || !isDefined( args.RawData.length ) || args.RawData.length === 0 ) throw( "RawData not specified." );
                if( !isDefined( args.TimeSlice ) ) args.TimeSlice = { StartTime: new UaDateTime(), EndTime: UaDateTime.utcNow() };
                if( !isDefined( args.Configuration ) ) print( "Configuration not specified [" + this.Name + "]." );
                if( !isDefined( args.FailSafe ) ) args.FailSafe = 50;
                var results = [];
                var failsafe = 0;
                // loop through the recordset and get a "page" of data given the time increment
                while( ( args.TimeSlice.StartTime <= args.RawData[ args.RawData.length - 1 ].SourceTimestamp ) && failsafe++ < args.FailSafe ) {
                    var uadv = new UaDataValue();
                    var rawDataInTimeSlice = OPCF.HA.Analysis.Get.DataInTimeSlice(  { RawData: args.RawData, TimeSlice: args.TimeSlice } );
                    if( isDefined( rawDataInTimeSlice ) ) {
                        // update our cumulative variables for the count 
                        var count = 0;
                        for( var i=0; i<rawDataInTimeSlice.length; i++ ) if( rawDataInTimeSlice[i].StatusCode.isGood() ) count++;
                        // set the return value in a UaDataValue object.
                        uadv.Value.setInt32( count );
                        uadv.SourceTimestamp = args.TimeSlice.StartTime.clone();
                        uadv.ServerTimestamp = args.TimeSlice.StartTime.clone();
                        uadv.StatusCode = StatusCode.SetAggregateBit( { StatusCode: uadv.StatusCode, AggregateBit: AggregateBit.Calculated } );
                        uadv.StatusCode.StatusCode = StatusCode.GetValueBased( { TimeSlice: args.TimeSlice, RawValues: rawDataInTimeSlice, StatusCode: uadv.StatusCode, Configuration: args.Configuration } );
                    }
                    // add the UaDataValue object to our array which will be returned to the caller.
                    else uadv.StatusCode.StatusCode = StatusCode.BadNoData;
                    results.push( uadv );
                    args.TimeSlice.next();
                }//while
                return( results );
                }, // GetDataset
            }, // Count

        DurationInState0: {
            Name: "DurationInState0",
            Type: new UaNodeId( Identifier.AggregateFunction_DurationInState0 ),
            GetDataset: function( args ) {
                if( args === undefined || args === null ) throw( "args not specified." );
                if( args.RawData === undefined || args.RawData === null || args.RawData.length === undefined || args.RawData.length === null || args.RawData.length === 0 ) throw( "RawData not specified." );
            }, // GetDataset
            }, // DurationInState0

        DurationInState1: {
            Name: "DurationInState1",
            Type: new UaNodeId( Identifier.AggregateFunction_DurationInState1 ),
            GetDataset: function( args ) {
                if( args === undefined || args === null ) throw( "args not specified." );
                if( args.RawData === undefined || args.RawData === null || args.RawData.length === undefined || args.RawData.length === null || args.RawData.length === 0 ) throw( "RawData not specified." );
            }, // GetDataset
        }, // DurationInState1

        NumberOfTransitions: {
            Name: "NumberOfTransitions",
            Type: new UaNodeId( Identifier.AggregateFunction_NumberOfTransitions ),
            GetDataset: function( args ) {
                if( args === undefined || args === null ) throw( "args not specified." );
                if( args.RawData === undefined || args.RawData === null || args.RawData.length === undefined || args.RawData.length === null || args.RawData.length === 0 ) throw( "RawData not specified." );
            }, // GetDataset
            }, // NumberOfTransitions

        }, // Counting, namespace


// ~~~~~~~~~~~~~~~ Time ~~~~~~~~~~~~~~~~ //
    Time: {

        Start: {
            Name: "Start",
            Type: new UaNodeId( Identifier.AggregateFunction_Start ),
            GetDataset: function( args ) {
                if( args === undefined || args === null ) throw( "args not specified." );
                if( args.RawData === undefined || args.RawData === null || args.RawData.length === undefined || args.RawData.length === null || args.RawData.length === 0 ) throw( "RawData not specified." );
                if( !isDefined( args.TimeSlice ) ) args.TimeSlice = { StartTime: new UaDateTime(), EndTime: UaDateTime.utcNow() };
                if( !isDefined( args.Configuration ) ) print( "Configuration not specified [" + this.Name + "]." );
                if( !isDefined( args.FailSafe ) ) args.FailSafe = 50;
                var results = [];
                var failsafe = 0;
                while( ( args.TimeSlice.StartTime <= args.RawData[ args.RawData.length-1 ].SourceTimestamp ) && ( failsafe++ < args.FailSafe ) ) {
                    var uadv = UaDataValue.New( { Timestamps: args.TimeSlice.StartTime, StatusCode: StatusCode.BadNoData } );
                    var rawDataInTimeSlice = OPCF.HA.Analysis.Get.DataInTimeSlice( { RawData: args.RawData, TimeSlice: args.TimeSlice } ); 
                    if( isDefined( rawDataInTimeSlice ) ) {
                        if( rawDataInTimeSlice[0].StatusCode.isGood() || rawDataInTimeSlice[0].StatusCode.isUncertain() ) uadv.Value = rawDataInTimeSlice[0].Value
                        uadv.SourceTimestamp = args.TimeSlice.StartTime.clone();
                        uadv.ServerTimestamp = args.TimeSlice.StartTime.clone();
                        uadv.StatusCode.StatusCode = StatusCode.GetValueBased( { TimeSlice: args.TimeSlice, RawValues: rawDataInTimeSlice, StatusCode: uadv.StatusCode, Configuration: args.Configuration } );
                        results.push( uadv);
                    }// if
                    else uadv.StatusCode.StatusCode = StatusCode.BadNoData;
                    args.TimeSlice.next();
                }// while
                return results;
            } //GetDataSet
        }, // Start

        End: { 
            Name: "End",
            Type: new UaNodeId( Identifier.AggregateFunction_End ),
            GetDataset: function( args ) {
                if( args === undefined || args === null ) throw( "args not specified." );
                if( args.RawData === undefined || args.RawData === null || args.RawData.length === undefined || args.RawData.length === null || args.RawData.length === 0 ) throw( "RawData not specified." );
                if( !isDefined( args.TimeSlice ) ) args.TimeSlice = { StartTime: new UaDateTime(), EndTime: UaDateTime.utcNow() };
                if( !isDefined( args.Configuration ) ) print( "Configuration not specified [" + this.Name + "]." );
                if( !isDefined( args.FailSafe ) ) args.FailSafe = 50;
                var results = [];
                var failsafe = 0;
                while( ( args.TimeSlice.StartTime <= args.RawData[ args.RawData.length-1 ].SourceTimestamp ) && ( failsafe++ < args.FailSafe ) ) {
                    var uadv = UaDataValue.New( { Timestamps: args.TimeSlice.StartTime, StatusCode: StatusCode.BadNoData } );
                    var rawDataInTimeSlice = OPCF.HA.Analysis.Get.DataInTimeSlice( { RawData: args.RawData, TimeSlice: args.TimeSlice } ); 
                    if( isDefined( rawDataInTimeSlice ) ) {
                        if( rawDataInTimeSlice[0].StatusCode.isGood() || rawDataInTimeSlice[0].StatusCode.isUncertain() ) uadv.Value = rawDataInTimeSlice[rawDataInTimeSlice.length-1].Value
                        uadv.SourceTimestamp = args.TimeSlice.StartTime.clone();
                        uadv.ServerTimestamp = args.TimeSlice.StartTime.clone();
                        uadv.StatusCode.StatusCode = StatusCode.GetValueBased( { TimeSlice: args.TimeSlice, RawValues: rawDataInTimeSlice, StatusCode: uadv.StatusCode, Configuration: args.Configuration } );
                        results.push( uadv);
                    }// if
                    else uadv.StatusCode.StatusCode = StatusCode.BadNoData;
                    args.TimeSlice.next();
                }// while
                return results;
            }, // GetDataset
            }, // End 

        Delta: {
            Name: "Delta",
            Type: new UaNodeId( Identifier.AggregateFunction_Delta ),
            GetDataset: function( args ) {
                if( args === undefined || args === null ) throw( "args not specified." );
                if( args.RawData === undefined || args.RawData === null || args.RawData.length === undefined || args.RawData.length === null || args.RawData.length === 0 ) throw( "RawData not specified." );
            }, // GetDataset
            }, // Delta 

        Start2: {
            Name: "Start2",
            Type: new UaNodeId( Identifier.AggregateFunction_Start2 ),
            GetDataset: function( args ) {
                if( args === undefined || args === null ) throw( "args not specified." );
                if( args.RawData === undefined || args.RawData === null || args.RawData.length === undefined || args.RawData.length === null || args.RawData.length === 0 ) throw( "RawData not specified." );
            }, // GetDataset
            }, // Start2 

        End2: { 
            Name: "End2",
            Type: new UaNodeId( Identifier.AggregateFunction_End2 ),
            GetDataset: function( args ) {
                if( args === undefined || args === null ) throw( "args not specified." );
                if( args.RawData === undefined || args.RawData === null || args.RawData.length === undefined || args.RawData.length === null || args.RawData.length === 0 ) throw( "RawData not specified." );
            }, // GetDataset
            }, // End2 

        Delta2: {
            Name: "Delta2",
            Type: new UaNodeId( Identifier.AggregateFunction_Delta2 ),
            GetDataset: function( args ) {
                if( args === undefined || args === null ) throw( "args not specified." );
                if( args.RawData === undefined || args.RawData === null || args.RawData.length === undefined || args.RawData.length === null || args.RawData.length === 0 ) throw( "RawData not specified." );
            }, // GetDataset
            }, // Delta2

    }, // Time, namespace


// ~~~~~~~~~~~~~~~ Quality ~~~~~~~~~~~~~~~~ //
    Quality: {

        DurationGood: {
            Name: "DurationGood",
            Type: new UaNodeId( Identifier.AggregateFunction_DurationGood ),
            GetDataset: function( args ) {
                if( args === undefined || args === null ) throw( "args not specified." );
                if( args.RawData === undefined || args.RawData === null || args.RawData.length === undefined || args.RawData.length === null || args.RawData.length === 0 ) throw( "RawData not specified." );
                if( !isDefined( args.TimeSlice ) ) args.TimeSlice = { StartTime: new UaDateTime(), EndTime: UaDateTime.utcNow() };
                if( !isDefined( args.Configuration ) ) print( "Configuration not specified [" + this.Name + "]." );
                if( !isDefined( args.FailSafe ) ) args.FailSafe = 50;                

                var results = [];
                var failsafe = 0;

                //TimeSlice will have processing interval value.
                while( ( args.TimeSlice.StartTime <= args.RawData[ args.RawData.length-1 ].SourceTimestamp ) && failsafe++ < args.FailSafe ) {
                   var uadv = UaDataValue.New( { Timestamps: args.TimeSlice.StartTime, StatusCode: StatusCode.BadNoData } );
                   //To store Before value
                   var before = OPCF.HA.Analysis.Get.FindDataBeforeTimeSlice( { RawData: args.RawData, TimeSlice: args.TimeSlice } );                   
                   var rawDataInTimeSlice = OPCF.HA.Analysis.Get.DataInTimeSlice( { RawData: args.RawData, TimeSlice: args.TimeSlice } );
                   var after = OPCF.HA.Analysis.Get.FindDataAfterTimeSlice( { RawData: args.RawData, TimeSlice: args.TimeSlice } );                   
                    if( isDefined( rawDataInTimeSlice ) ) {
                        var durationGoodAggregate = 0;
                        if(before.length > 0 && before[0].StatusCode.isGood() ) {
                            durationGoodAggregate += before[0].SourceTimestamp.msecsTo( args.TimeSlice.StartTime );
                        }

                        var myCount = 1;
                        if(rawDataInTimeSlice.length < 2 && rawDataInTimeSlice[0].StatusCode.isGood() ) {
                            durationGoodAggregate += rawDataInTimeSlice[0].SourceTimestamp.msecsTo( args.TimeSlice.EndTime );
                         }
                        else if(rawDataInTimeSlice[0].StatusCode.isBad() || rawDataInTimeSlice[0].StatusCode.isUncertain() ) {
                            durationGoodAggregate = 0;
                        }

                        for( var i=0; i<rawDataInTimeSlice.length - 1; i++ ) {
                            if( rawDataInTimeSlice[i].StatusCode.isGood() ) { 
                                if( rawDataInTimeSlice[i].SourceTimestamp >= args.TimeSlice.StartTime &&  rawDataInTimeSlice[i].SourceTimestamp <= args.TimeSlice.EndTime ) {
                                    var rawdat = rawDataInTimeSlice[myCount].SourceTimestamp;
                                    durationGoodAggregate += rawDataInTimeSlice[i].SourceTimestamp.msecsTo( rawdat );
                                }
                            }
                            else { durationGoodAggregate = 0; }
                            myCount++;
                        }

                        if( rawDataInTimeSlice.length >1 ) {
                            if( rawDataInTimeSlice[rawDataInTimeSlice.length-1].StatusCode.isGood() && ( before[0].StatusCode.isBad() || before[0].StatusCode.isUncertain()) ) {
                                if(rawDataInTimeSlice[rawDataInTimeSlice.length-1].SourceTimestamp < args.TimeSlice.EndTime) {
                                    durationGoodAggregate += rawDataInTimeSlice[i].SourceTimestamp.msecsTo(args.TimeSlice.EndTime);//.msecsTo( rawDataInTimeSlice[rawDataInTimeSlice.length-1].SourceTimestamp);//.msecsTo( args.TimeSlice.EndTime);
                                }
                            }
                        }
                        uadv.Value.setDouble( durationGoodAggregate );
                        uadv.SourceTimestamp = args.TimeSlice.StartTime.clone();
                        uadv.ServerTimestamp = args.TimeSlice.StartTime.clone();
                        uadv.StatusCode = StatusCode.SetAggregateBit( { StatusCode: uadv.StatusCode, AggregateBit: AggregateBit.Calculated } );
                    }
                    results.push( uadv );
                    args.TimeSlice.next();
               }
               return( results );
            }, // GetDataset
            }, // DurationGood

        DurationBad: { 
            Name: "DurationBad",
            Type: new UaNodeId( Identifier.AggregateFunction_DurationBad ),
            GetDataset: function( args ) {
                if( args === undefined || args === null ) throw( "args not specified." );
                if( args.RawData === undefined || args.RawData === null || args.RawData.length === undefined || args.RawData.length === null || args.RawData.length === 0 ) throw( "RawData not specified." );
            }, // GetDataset
            }, // DurationBad

        PercentGood: {
            Name: "PercentGood",
            Type: new UaNodeId( Identifier.AggregateFunction_PercentGood ),
            GetDataset: function( args ) {
                if( args === undefined || args === null ) throw( "args not specified." );
                if( args.RawData === undefined || args.RawData === null || args.RawData.length === undefined || args.RawData.length === null || args.RawData.length === 0 ) throw( "RawData not specified." );
            }, // GetDataset
            }, // PercentGood

        PercentBad: {
            Name: "PercentBad",
            Type: new UaNodeId( Identifier.AggregateFunction_PercentBad ),
            GetDataset: function( args ) {
                if( args === undefined || args === null ) throw( "args not specified." );
                if( args.RawData === undefined || args.RawData === null || args.RawData.length === undefined || args.RawData.length === null || args.RawData.length === 0 ) throw( "RawData not specified." );
            }, // GetDataset
            }, // PercentBad

        WorstQuality: {
            Name: "WorstQuality",
            Type: new UaNodeId( Identifier.AggregateFunction_WorstQuality ),
            GetDataset: function( args ) {
                if( args === undefined || args === null ) throw( "args not specified." );
                if( args.RawData === undefined || args.RawData === null || args.RawData.length === undefined || args.RawData.length === null || args.RawData.length === 0 ) throw( "RawData not specified." );
            }, // GetDataset
            }, // WorstQuality

        WorstQuality2: {
            Name: "WorstQuality2",
            Type: new UaNodeId( Identifier.AggregateFunction_WorstQuality2 ),
            GetDataset: function( args ) {
                if( args === undefined || args === null ) throw( "args not specified." );
                if( args.RawData === undefined || args.RawData === null || args.RawData.length === undefined || args.RawData.length === null || args.RawData.length === 0 ) throw( "RawData not specified." );
            }, // GetDataset
            }, // WorstQuality2

    }, // Quality, namespace


// ~~~~~~~~~~~~~~~ Annotation ~~~~~~~~~~~~~~~~ //
    Annotation: {

    AnnotationCount: {
        Name: "AnnotationCount",
        Type: new UaNodeId( Identifier.AggregateFunction_AnnotationCount ),
        GetDataset: function( args ) {
            if( args === undefined || args === null ) throw( "args not specified." );
            if( args.RawData === undefined || args.RawData === null || args.RawData.length === undefined || args.RawData.length === null || args.RawData.length === 0 ) throw( "RawData not specified." );
        }, // GetDataset
        }, // AnnotationCount
    
    }, // Annotation, namespace


// ~~~~~~~~~~~~~~~ Other ~~~~~~~~~~~~~~~~ //

    Other: { 

        Interpolative: { 
            Name: "Interpolative",
            Type: new UaNodeId( Identifier.AggregateFunction_Interpolative ),
            GetDataset: function( args ) {
                if( args === undefined || args === null ) throw( "args not specified." );
                if( args.RawData === undefined || args.RawData === null || args.RawData.length === undefined || args.RawData.length === null || args.RawData.length === 0 ) throw( "RawData not specified." );
                if( !isDefined( args.TimeSlice ) ) args.TimeSlice = { StartTime: new UaDateTime(), EndTime: UaDateTime.utcNow() };
                if( !isDefined( args.Configuration ) ) print( "Configuration not specified [" + this.Name + "]." );
                if( !isDefined( args.FailSafe ) ) args.FailSafe = 50;
                var results = [];
                var failsafe = 0;
                // loop through the recordset and get a "page" of data given the time increment
                var timeIncrement = args.TimeSlice.clone();
                timeIncrement.first();
                while( ( timeIncrement.StartTime <= args.RawData[ args.RawData.length-1 ].SourceTimestamp ) && ( failsafe++ < args.FailSafe ) ) {
                    var uadv = UaDataValue.New( { Timestamps: timeIncrement.StartTime, StatusCode: StatusCode.BadNoData } );
                    if ( isDefined ( args.TimeFlowsBackward )) {
                    var rawDataInTimeSlice = OPCF.HA.Analysis.Get.Interpolate( { RawData: args.RawData, TimeSlice:timeIncrement.Endtime, Configuration: args.Configuration } ); }
                    else {
                    var rawDataInTimeSlice = OPCF.HA.Analysis.Get.Interpolate( { RawData: args.RawData, SoughtTimestamp:timeIncrement, TimeSlice: timeIncrement.StartTime, Configuration: args.Configuration } ); }
                        uadv.Value = rawDataInTimeSlice.Value ;
                        uadv.SourceTimestamp = timeIncrement.StartTime.clone();
                        uadv.ServerTimestamp = timeIncrement.StartTime.clone();
                        uadv.StatusCode.StatusCode = rawDataInTimeSlice.StatusCode.StatusCode;
                        results.push( uadv);
                        timeIncrement.next();
                }// while
                // Value if no end point exists
                if( ( timeIncrement.StartTime > args.RawData[ args.RawData.length-1 ].SourceTimestamp ) && ( failsafe++ < args.FailSafe ) ) {
                    var uadv = OPCF.HA.Analysis.Get.Interpolate( { RawData: args.RawData, SoughtTimestamp:timeIncrement, TimeSlice: timeIncrement.StartTime, Configuration: args.Configuration } ); 
                    uadv.SourceTimestamp = timeIncrement.StartTime.clone();
                    uadv.ServerTimestamp = timeIncrement.StartTime.clone();
                    results.push( uadv );    }
                return results;
            }, // GetDataset
        }, // Interpolative

        Range: {
            Name: "Range",
            Type: new UaNodeId( Identifier.AggregateFunction_Range ),
            GetDataset: function( args ) {
                if( args === undefined || args === null ) throw( "args not specified." );
                if( args.RawData === undefined || args.RawData === null || args.RawData.length === undefined || args.RawData.length === null || args.RawData.length === 0 ) throw( "RawData not specified." );
            }, // GetDataset
        }, // Range

        Range2: {
            Name: "Range2",
            Type: new UaNodeId( Identifier.AggregateFunction_Range2 ),
            GetDataset: function( args ) {
                if( args === undefined || args === null ) throw( "args not specified." );
                if( args.RawData === undefined || args.RawData === null || args.RawData.length === undefined || args.RawData.length === null || args.RawData.length === 0 ) throw( "RawData not specified." );
            }, // GetDataset
        }, // Range2


        DeltaBounds: {
            Name: "DeltaBounds",
            Type: new UaNodeId( Identifier.AggregateFunction_DeltaBounds ),
            GetDataset: function( args ) {
                if( args === undefined || args === null ) throw( "args not specified." );
                if( args.RawData === undefined || args.RawData === null || args.RawData.length === undefined || args.RawData.length === null || args.RawData.length === 0 ) throw( "RawData not specified." );
            }, // GetDataset
        }, // DeltaBounds

        PercentGood: {
            Name: "PercentGood",
            Type: new UaNodeId( Identifier.AggregateFunction_PercentGood ),
            GetDataset: function( args ) {
                if( args === undefined || args === null ) throw( "args not specified." );
                if( args.RawData === undefined || args.RawData === null || args.RawData.length === undefined || args.RawData.length === null || args.RawData.length === 0 ) throw( "RawData not specified." );
            }, // GetDataset
        }, // PercentGood

        PercentBad: {
            Name: "PercentBad",
            Type: new UaNodeId( Identifier.AggregateFunction_PercentBad ),
            GetDataset: function( args ) {
                if( args === undefined || args === null ) throw( "args not specified." );
                if( args.RawData === undefined || args.RawData === null || args.RawData.length === undefined || args.RawData.length === null || args.RawData.length === 0 ) throw( "RawData not specified." );
            }, // GetDataset
        }, // PercentBad

        StandardDeviationSample: {
            Name: "StandardDeviationSample",
            Type: new UaNodeId( Identifier.AggregateFunction_StandardDeviationSample ),
            GetDataset: function( args ) {
                if( args === undefined || args === null ) throw( "args not specified." );
                if( args.RawData === undefined || args.RawData === null || args.RawData.length === undefined || args.RawData.length === null || args.RawData.length === 0 ) throw( "RawData not specified." );
            }, // GetDataset
        }, // StandardDeviationSample

        StandardDeviationPopulation: {
            Name: "StandardDeviationPopulation",
            Type: new UaNodeId( Identifier.AggregateFunction_StandardDeviationPopulation ),
            GetDataset: function( args ) {
                if( args === undefined || args === null ) throw( "args not specified." );
                if( args.RawData === undefined || args.RawData === null || args.RawData.length === undefined || args.RawData.length === null || args.RawData.length === 0 ) throw( "RawData not specified." );
            }, // GetDataset
        }, // StandardDeviationPopulation

        VarianceSample: {
            Name: "StandardDeviationPopulation",
            Type: new UaNodeId( Identifier.AggregateFunction_VarianceSample ),
            GetDataset: function( args ) {
                if( args === undefined || args === null ) throw( "args not specified." );
                if( args.RawData === undefined || args.RawData === null || args.RawData.length === undefined || args.RawData.length === null || args.RawData.length === 0 ) throw( "RawData not specified." );
            }, // GetDataset
        }, // VarianceSample

        StandardDeviationPopulation: {
            Name: "StandardDeviationPopulation",
            Type: new UaNodeId( Identifier.AggregateFunction_StandardDeviationPopulation ),
            GetDataset: function( args ) {
                if( args === undefined || args === null ) throw( "args not specified." );
                if( args.RawData === undefined || args.RawData === null || args.RawData.length === undefined || args.RawData.length === null || args.RawData.length === 0 ) throw( "RawData not specified." );
            }, // GetDataset
        }, // StandardDeviationPopulation

        VariancePopulation: {
            Name: "VariancePopulation",
            Type: new UaNodeId( Identifier.AggregateFunction_VariancePopulation ),
            GetDataset: function( args ) {
                if( args === undefined || args === null ) throw( "args not specified." );
                if( args.RawData === undefined || args.RawData === null || args.RawData.length === undefined || args.RawData.length === null || args.RawData.length === 0 ) throw( "RawData not specified." );
            }, // GetDataset
        }, // VariancePopulation

        Custom: {
            Name: "Custom",
            Type: new UaNodeId( Identifier.AggregateFunction_Custom ),
            GetDataset: function( args ) {
                if( args === undefined || args === null ) throw( "args not specified." );
                if( args.RawData === undefined || args.RawData === null || args.RawData.length === undefined || args.RawData.length === null || args.RawData.length === 0 ) throw( "RawData not specified." );
            }, // GetDataset
        }, // Custom


    }, // Other, namespace

}// Aggregates, namespace;