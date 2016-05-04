/*global UaStatusCode */

// Object holding an array of expected results and array of accepted results
// this object is unsed in other functions checking the response
function ExpectedAndAcceptedResults( expected, accepted ) {
    this.ExpectedResults = [];
    this.AcceptedResults = [];

    // Adds an expected result to the list 
    // ExpectedResult must be of type StatusCode
    this.addExpectedResult = function( ExpectedResults ) {
        if( ExpectedResults.length === undefined ) ExpectedResults = [ ExpectedResults ];
        for( var i=0; i<ExpectedResults.length; i++ ) this.ExpectedResults.push( new UaStatusCode( ExpectedResults[i] ) );
    }// this.addExpectedResult = function( ExpectedResult )

    // Adds an accepted result to the list 
    // AcceptedResult must be of type StatusCode
    this.addAcceptedResult = function( AcceptedResults ) {
        if( AcceptedResults.length === undefined ) AcceptedResults = [ AcceptedResults ];
        for( var i=0; i<AcceptedResults.length; i++ ) this.AcceptedResults.push( new UaStatusCode( AcceptedResults[i] ) );
    }// this.addAcceptedResult = function( AcceptedResults )

    // Check if the expected array contains the given status
    this.containsExpectedStatus = function( statusCode ) {
        if( isDefined( statusCode.StatusCode ) ) { 
            // a statuscode object was presumably passed-in
            for( var i=0; i<this.ExpectedResults.length; i++ ) if( this.ExpectedResults[i].StatusCode === statusCode.StatusCode ) return true;
        }
        else {
            // a straight integer value was presumably passed-in
            for( var i=0; i<this.ExpectedResults.length; i++ ) if( this.ExpectedResults[i].StatusCode === statusCode ) return true;
        }
        return false;
    }// this.containsExpectedStatus = function( statusCode )

    // Check if the accepted array contains the given status
    this.containsAcceptedStatus = function( statusCode ) {
        if( isDefined( statusCode.StatusCode ) ) { 
            // a statuscode object was presumably passed-in
            for( var i=0; i<this.AcceptedResults.length; i++ ) if( this.AcceptedResults[i].equals( statusCode ) ) return true;
        }
        else {
            // a straight integer value was presumably passed-in
            for( var i=0; i<this.AcceptedResults.length; i++ ) if( this.AcceptedResults[i].StatusCode === statusCode ) return true;
        }
        return false;
    }// this.containsAcceptedStatus = function( statusCode )

    // Check if either Accepted or Expected contain the given status
    this.containsStatusCode = function( statusCode ) {
        if( this.containsExpectedStatus( new UaStatusCode( statusCode ) ) ) return( true );
        else if( this.containsAcceptedStatus( new UaStatusCode( statusCode ) ) ) return( true );
        return( false );
    }// this.containsStatusCode = function( statusCode )

    this.toString = function() {
        var s = "";
        if( this.ExpectedResults.length > 0 ) {
            s += "Expected: ";
            for( var e=0; e<this.ExpectedResults.length; e++ ) {
                s+= this.ExpectedResults[e].toString();
                if( e < this.ExpectedResults.length - 1 ){ s += " or "; }
            }
        }
        if( this.AcceptedResults.length > 0 ) {
            s += "; Would accept: ";
            for( var a=0; a<this.AcceptedResults.length; a++ ) {
                s += this.AcceptedResults[a].toString();
                if( a < this.ExpectedResults.length - 1 ){ s += " or "; }
            }
        }
        return( s );
    }

    this.clone = function() {
        var e = new ExpectedAndAcceptedResults();
        for( var i=0; i<this.ExpectedResults.length; i++ ) e.ExpectedResults.push( this.ExpectedResults[i] );
        for( var i=0; i<this.AcceptedResults.length; i++ ) e.ExpectedResults.push( this.AcceptedResults[i] );
        return( e );
    }

    // process the object constructor arguments, if provided.
    if( expected !== undefined && expected !== null ) this.addExpectedResult( expected );
    if( accepted !== undefined && accepted !== null ) this.addAcceptedResult( accepted );
}

/* Wrapper for the ExpectedAndAcceptedResults. Parameters: 
    Expected[]: array (or not) of StatusCode 
    Accepted[]: array (or not) of StatusCode */
function ExpectedResults( args ) {
    this.prototype = new ExpectedAndAcceptedResults();
    this.ExpectedResults = [];
    this.AcceptedResults = [];
    if( isDefined( args ) ) {
        // add expected
        if( isDefined( args.Expected ) ) {
            this.prototype.addExpectedResult( args.Expected );
            this.ExpectedResults = this.prototype.ExpectedResults;
        }
        // add accepted
        if( isDefined( args.Accepted ) ) {
            this.prototype.addAcceptedResult( args.Accepted );
            this.AcceptedResults = this.prototype.AcceptedResults;
        }
        // transaction results 
        if( isDefined( args.TransactionResults ) ) this.TransactionResults = args.TransactionResults;
    }
    return( this.prototype );
}

/* Returns an array of ExpectedAndAcceptedResults, based on these parameters:
   ExpectedResult: StatusCode (optional)
   AcceptedResult: StatusCode (optional)
   Quantity: required */
function ExpectedResultsArray( args ) {
    var erArray = [];
    if( args !== undefined && args !== null ) {
        if( args.Quantity === undefined || args.Quantity === null ) args.Quantity = 1;
        for( var i=0; i<args.Quantity; i++ ) {
            var er = new ExpectedAndAcceptedResults();
            if( args.ExpectedResult !== undefined && args.ExpectedResult !== null ) er.addExpectedResult( args.ExpectedResult );
            if( args.AcceptedResult !== undefined && args.AcceptedResult !== null ) er.addAcceptedResult( args.AcceptedResult );
            erArray.push( er );
        }
    }
    return( erArray );
}
