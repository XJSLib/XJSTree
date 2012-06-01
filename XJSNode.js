function XJSNode( value ) {
    this.childNodes = [ ];
    if ( arguments.length > 0 ) {
        this.value = value;
    }
}
Object.defineProperties( XJSNode.prototype, {
    appendChild: {
        value: function ( ) {
            return this.appendChildren( Array.toArray( arguments ) );
        }
    },
    appendChildren: {
        value: function ( childNodes ) {
            this.childNodes = this.childNodes.concat( childNodes );
            return this;
        }
    },
    depth: {
        get: function ( ) {
            var previousNodes = [ ];
            var currentNodes = [ this ];
            var nextNodes = [ ];
            var node;
            var depth = 0;
            var containsCircularReference;
            while ( true ) {
                containsCircularReference = currentNodes.some( function ( node ) {
                    if ( previousNodes.contains( node ) ) {
                        return true;
                    } else {
                        nextNodes = nextNodes.concat( node.childNodes );
                    }
                } );
                if ( containsCircularReference ) {
                    return Infinity;
                } else {
                    if ( nextNodes.length === 0 ) {
                        return depth;
                    } else {
                        previousNodes = previousNodes.concat( currentNodes );
                        currentNodes = nextNodes;
                        nextNodes = [ ];
                        ++depth;
                    }
                }
            }
        }
    },
    isLeaf: {
        get: function ( ) {
            return this.childNodes.length === 0;
        }
    },
    flatten: {
        value: function ( ) {
            var childNodes = this.childNodes;
            switch ( childNodes.length ) {
                case 0:
                    return this;
                    break;
                case 1:
                    return childNodes[ 0 ].flatten( );
                    break;
                default:
                    this.childNodes = childNodes.map( function ( childNode ) {
                        return childNode.flatten( );
                    } );
                    return this;
            }
        }
    },
    leaves: {
        get: function ( ) {
            return this.childNodes.map( function ( childNode ) {
                return childNode.isLeaf ? childNode : childNode.leaves;
            } ).reduce( function ( childNodes1, childNodes2 ) {
                return childNodes1.concat( childNodes2 );
            }, [ ] );
        }
    },
    toHTML: {
        value: function ( ) {
            var container = document.createElement( 'div' );
            container.title = this.value;
            container.className = 'XJSNode';
            if ( this.isLeaf ) {
                container.appendChild( document.createTextNode( this.value ) )
            } else {
                this.childNodes.forEach( function ( childNode ) {
                    container.appendChild( childNode.toHTML( ) );
                } );
            }
            return container;
        }
    },
    toString: {
        value: function ( ) {
            var string = '';
            function walk( node, tabs ) {
                if ( node.hasOwnProperty( 'value' ) ) {
                    string += tabs + node.value + '\r\n';
                }
                tabs += ' ';
                node.childNodes.map( function ( childNode ) {
                    walk( childNode, tabs );
                } )
            }
            walk( this, '' );
            return string;
        }
    }
} );